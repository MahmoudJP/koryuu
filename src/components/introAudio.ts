/**
 * Koryuu intro — sound design (DEV ONLY).
 *
 * Fully synthesized (Web Audio API, no sample files), timed to the "Confluence"
 * intro: build (0–2.6s) → impact (~2.6s) → sonic-logo bloom (~2.9s) → tail.
 *
 * Two families, three variants each:
 *
 *   "pulse" — modern / futuristic synth (resonant riser, pulsing arp, punchy
 *             impact, chime). Variants:
 *     • "pulse"      — classic: saw riser, bright chime
 *     • "pulse-warm" — softer triangle riser, slower arp, gentle low chime
 *     • "pulse-neon" — faster, brighter, more energetic, high sparkly chime
 *
 *   "voice" — HALAL SOUNDS: 100% vocal, no instruments. A formant-synthesized
 *             choir (the acapella-nasheed / "halal sounds" approach — human
 *             voice only). Variants:
 *     • "voice"        — warm: open "ah" vowel, mid register
 *     • "voice-bright" — brighter "eh" vowel, higher, with a shimmer top
 *     • "voice-deep"   — round "oh/oo" vowels, lower, slower, meditative
 *
 * Gated behind NODE_ENV in the caller so it never runs in production.
 */

export type IntroStyle =
  | "pulse"
  | "pulse-warm"
  | "pulse-neon"
  | "voice"
  | "voice-bright"
  | "voice-deep";

type Win = typeof window & {
  webkitAudioContext?: typeof AudioContext;
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
};

function noiseSource(ctx: BaseAudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}

/** Smooth, lush reverb impulse (stereo-decorrelated decaying noise). */
function reverbIR(ctx: BaseAudioContext, seconds: number, decay: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

// ── the arrangement (shared by realtime + offline render) ────────
function build(ctx: BaseAudioContext, style: IntroStyle) {
  const t = ctx.currentTime + 0.05;

  // master: gentle compression + a soft top-end roll-off so nothing is harsh
  const master = ctx.createGain();
  master.gain.value = 0.82;
  const tame = ctx.createBiquadFilter();
  tame.type = "highshelf";
  tame.frequency.value = 7000;
  tame.gain.value = -4;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 28;
  comp.ratio.value = 3;
  comp.attack.value = 0.006;
  comp.release.value = 0.28;
  master.connect(tame).connect(comp).connect(ctx.destination);

  // reverb send, with a warm (low-passed) return so it never fizzes
  const reverb = ctx.createConvolver();
  reverb.buffer = reverbIR(ctx, style === "pulse" ? 2.6 : 3.8, 2.4);
  const verbTone = ctx.createBiquadFilter();
  verbTone.type = "lowpass";
  verbTone.frequency.value = 6500;
  const reverbReturn = ctx.createGain();
  reverbReturn.gain.value = style === "pulse" ? 0.7 : 1.0;
  reverb.connect(verbTone).connect(reverbReturn).connect(master);

  // damped stereo feedback delay
  const delayIn = ctx.createGain();
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = style === "pulse" ? 0.26 : 0.36;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 2200;
  const fb = ctx.createGain();
  fb.gain.value = 0.34;
  const delayReturn = ctx.createGain();
  delayReturn.gain.value = 0.5;
  delayIn.connect(delay);
  delay.connect(damp);
  damp.connect(fb).connect(delay);
  damp.connect(delayReturn).connect(master);
  damp.connect(reverb);

  const out = (pan = 0, verb = 0.45, del = 0) => {
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    p.connect(master);
    if (verb > 0) {
      const g = ctx.createGain();
      g.gain.value = verb;
      p.connect(g).connect(reverb);
    }
    if (del > 0) {
      const g = ctx.createGain();
      g.gain.value = del;
      p.connect(g).connect(delayIn);
    }
    return p;
  };

  // warm glassy bell
  const bell = (
    dest: AudioNode,
    time: number,
    freq: number,
    dur: number,
    gain: number,
    bright = 0,
  ) => {
    const partials: [number, number, number, OscillatorType][] = [
      [1, 1, 1, "triangle"],
      [2, 0.3, 0.55, "sine"],
      [3, 0.1, 0.35, "sine"],
    ];
    if (bright > 0) partials.push([4.02, bright, 0.16, "sine"]);
    for (const [mult, amp, decayFrac, type] of partials) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq * mult;
      o.detune.value = (Math.random() * 2 - 1) * 4;
      const g = ctx.createGain();
      const d = dur * decayFrac;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(gain * amp, time + 0.014);
      g.gain.exponentialRampToValueAtTime(0.0001, time + d);
      o.connect(g).connect(dest);
      o.start(time);
      o.stop(time + d + 0.05);
    }
  };

  // short synth pluck (for the pulse arp)
  const pluck = (
    dest: AudioNode,
    time: number,
    freq: number,
    gain: number,
  ) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(3500, time);
    lp.frequency.exponentialRampToValueAtTime(700, time + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    o.connect(lp).connect(g).connect(dest);
    o.start(time);
    o.stop(time + 0.22);
  };

  const pad = (
    dest: AudioNode,
    time: number,
    dur: number,
    freqs: number[],
    peak: number,
    octave = false,
  ) => {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(320, time);
    lp.frequency.exponentialRampToValueAtTime(2600, time + dur * 0.5);
    lp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + dur * 0.4);
    g.gain.setValueAtTime(peak, time + dur * 0.68);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    lp.connect(g).connect(dest);
    for (const f of freqs) {
      for (const cents of [-7, 7]) {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = f;
        o.detune.value = cents;
        const og = ctx.createGain();
        og.gain.value = 0.5 / freqs.length;
        o.connect(og).connect(lp);
        o.start(time);
        o.stop(time + dur + 0.1);
      }
      if (octave) {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f * 2;
        const og = ctx.createGain();
        og.gain.value = 0.18 / freqs.length;
        o.connect(og).connect(lp);
        o.start(time);
        o.stop(time + dur + 0.1);
      }
    }
  };

  const sub = (
    dest: AudioNode,
    time: number,
    dur: number,
    freq: number,
    peak: number,
    drop = 0,
  ) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, time);
    if (drop) o.frequency.exponentialRampToValueAtTime(freq * drop, time + 0.55);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(peak, time + (drop ? 0.015 : 0.5));
    g.gain.setValueAtTime(peak, time + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g).connect(dest);
    o.start(time);
    o.stop(time + dur + 0.1);
  };

  const impactBoom = (time: number, peak = 0.55, fast = false) => {
    sub(out(0, 0.15, 0), time, fast ? 0.7 : 0.95, fast ? 120 : 100, peak, 0.4);
    const nz = noiseSource(ctx, 0.4);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = fast ? 1200 : 700;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, time);
    ng.gain.linearRampToValueAtTime(fast ? 0.28 : 0.2, time + 0.02);
    ng.gain.exponentialRampToValueAtTime(0.0001, time + (fast ? 0.18 : 0.32));
    nz.connect(lp).connect(ng).connect(out(0, 0.2, 0));
    nz.start(time);
    nz.stop(time + 0.4);
  };

  // Vowel formant presets [freq, gain, Q] — the resonances that make a vowel.
  const VOWEL = {
    aa: [[800, 1, 7], [1150, 0.45, 9], [2800, 0.18, 12]], // "ah" — open, warm
    eh: [[560, 1, 7], [1700, 0.5, 10], [2600, 0.22, 12]], // "eh" — bright
    oh: [[500, 1, 6], [900, 0.4, 8], [2500, 0.14, 12]], //  "oh" — round, dark
    oo: [[350, 1, 6], [800, 0.3, 8], [2700, 0.12, 12]], //  "oo" — hollow, deep
    ee: [[300, 1, 6], [2300, 0.5, 12], [3000, 0.2, 14]], // "ee" — bright, shimmer
  } as Record<string, [number, number, number][]>;

  // A sung vowel: detuned glottal saw sources shaped by vowel-formant filters
  // → a human voice. The basis of the halal-sounds / nasheed style (voice only).
  const voice = (
    time: number,
    dur: number,
    freq: number,
    peak: number,
    pan: number,
    verb = 0.6,
    toFreq = 0,
    vowel: [number, number, number][] = VOWEL.aa,
    lp = 3800,
  ) => {
    const src = ctx.createGain(); // glottal-source mix point
    for (const det of [-7, 7, 0]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(freq, time);
      if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, time + dur * 0.85);
      o.detune.value = det;
      // gentle human vibrato
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 4.8 + Math.random() * 0.8;
      const lg = ctx.createGain();
      lg.gain.value = freq * 0.007;
      lfo.connect(lg).connect(o.frequency);
      lfo.start(time);
      lfo.stop(time + dur + 0.1);
      const og = ctx.createGain();
      og.gain.value = 0.3;
      o.connect(og).connect(src);
      o.start(time);
      o.stop(time + dur + 0.1);
    }
    // the chosen vowel: three formant resonances (F1/F2/F3)
    const sum = ctx.createGain();
    for (const [ff, fg, q] of vowel) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = ff;
      bp.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = fg;
      src.connect(bp).connect(g).connect(sum);
    }
    const warm = ctx.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = lp;
    // makeup gain — the formant band-passes attenuate the source heavily, so
    // bring the voice back up to a level comparable to the other styles.
    const makeup = ctx.createGain();
    makeup.gain.value = 7;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(peak, time + dur * 0.28);
    env.gain.setValueAtTime(peak, time + dur * 0.7);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    sum.connect(warm).connect(makeup).connect(env).connect(out(pan, verb, 0));
  };

  // a soft human breath (inhale) — light filtered noise before a phrase.
  const breath = (time: number, gain: number) => {
    const nz = noiseSource(ctx, 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);
    nz.connect(bp).connect(g).connect(out(0, 0.4, 0));
    nz.start(time);
    nz.stop(time + 0.5);
  };

  const A = { A1: 55, A2: 110, E3: 164.81, A3: 220, Cs4: 277.18, E4: 329.63, G4: 392, B4: 493.88, A4: 440, Cs5: 554.37, E5: 659.25, A5: 880, Cs6: 1108.73, E6: 1318.51, A6: 1760 };

  // ════════════════════════════════════════════════════════════
  // "pulse" family — modern / futuristic synth (the one musical style kept).
  // A parameterized arrangement so each variant shares the shape but differs in
  // timbre, tempo, brightness and chime.
  const pulseArr = (o: {
    arp: number[];
    step: number;
    count: number;
    riser: OscillatorType;
    sweepTo: number;
    chime: [number, number, number];
    chimeBright: number;
    rv: number;
    impact: number;
  }) => {
    sub(out(0, 0.15, 0), t, 2.7, A.A1, 0.14);
    pad(out(0, 0.4, 0), t + 0.1, 2.6, [A.A2, A.E3], 0.08); // thin drone

    // pulsing arp — "data flowing in"
    for (let i = 0; i < o.count; i++) {
      const time = t + 0.5 + i * o.step;
      if (time > t + 2.5) break;
      pluck(out(i % 2 ? 0.4 : -0.4, 0.3, 0.3), time, o.arp[i % o.arp.length], 0.06 + (i / o.count) * 0.05);
    }

    // resonant lowpass synth riser
    const osc = ctx.createOscillator();
    osc.type = o.riser;
    osc.frequency.value = A.A2;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.Q.value = 9;
    f.frequency.setValueAtTime(200, t + 1.0);
    f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + 2.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t + 1.0);
    g.gain.exponentialRampToValueAtTime(0.06, t + 2.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.72);
    osc.connect(f).connect(g).connect(out(0, 0.4, 0));
    osc.start(t + 1.0);
    osc.stop(t + 2.8);

    impactBoom(t + 2.6, o.impact, true);
    // crisp transient snap
    const snap = noiseSource(ctx, 0.05);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1500;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.12, t + 2.6);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 2.66);
    snap.connect(hp).connect(sg).connect(out(0, 0.1, 0));
    snap.start(t + 2.6);
    snap.stop(t + 2.67);

    // chime signature
    const base = t + 2.9;
    sub(out(0, 0.15, 0), base, 1.6, A.A2, 0.14);
    bell(out(-0.1, o.rv, 0.3), base, o.chime[0], 1.2, 0.16, o.chimeBright);
    bell(out(0.12, o.rv, 0.35), base + 0.16, o.chime[1], 1.6, 0.16, o.chimeBright + 0.1);
    bell(out(0, o.rv + 0.05, 0.4), base + 0.18, o.chime[2], 1.2, 0.04, o.chimeBright + 0.2);
  };

  // Classic — the original: saw riser, bright chime (A4 · E5 · A6).
  if (style === "pulse") {
    pulseArr({
      arp: [A.A3, A.E4, A.Cs4, A.E4],
      step: 0.17,
      count: 12,
      riser: "sawtooth",
      sweepTo: 4800,
      chime: [A.A4, A.E5, A.A6],
      chimeBright: 0.4,
      rv: 0.4,
      impact: 0.58,
    });
  }

  // Warm — softer triangle riser, slower arp, darker sweep, gentler low chime.
  if (style === "pulse-warm") {
    pulseArr({
      arp: [A.A3, A.E4, A.A3, A.Cs4],
      step: 0.22,
      count: 10,
      riser: "triangle",
      sweepTo: 2600,
      chime: [A.A4, A.Cs5, A.A5],
      chimeBright: 0.15,
      rv: 0.6,
      impact: 0.5,
    });
  }

  // Neon — faster, brighter, more energetic: wide sweep, high sparkly chime.
  if (style === "pulse-neon") {
    pulseArr({
      arp: [A.A3, A.Cs4, A.E4, A.A4],
      step: 0.13,
      count: 16,
      riser: "sawtooth",
      sweepTo: 6800,
      chime: [A.E5, A.A5, A.E6],
      chimeBright: 0.6,
      rv: 0.35,
      impact: 0.62,
    });
  }

  // ════════════════════════════════════════════════════════════
  // HALAL SOUNDS — "voice" family: 100% vocal, no instruments. A formant choir
  // that hums in as a drone, a voice rises like the gathering current, and it
  // blooms into a serene open chord as the confluence lands. The three variants
  // differ in vowel, register and pacing.

  // Warm — the original: open "ah" vowel, mid register.
  if (style === "voice") {
    breath(t, 0.05);
    voice(t + 0.1, 2.6, A.A2, 0.12, -0.25); // root drone
    voice(t + 0.1, 2.6, A.E3, 0.1, 0.25); //  fifth drone
    // a soft voice rising an octave — the converging current
    voice(t + 0.5, 2.05, A.A3, 0.06, 0, 0.7, A.A4);

    // the confluence lands → an open, serene choir bloom (root / fifth / octave)
    breath(t + 2.45, 0.06);
    const base = t + 2.6;
    voice(base, 2.3, A.A2, 0.11, 0);
    voice(base, 2.3, A.A3, 0.12, -0.3);
    voice(base, 2.3, A.E4, 0.1, 0.3);
    voice(base + 0.05, 2.2, A.A4, 0.09, 0);
  }

  // Bright — lighter "eh" vowel, a register higher, with a shimmering top
  // voice. More uplifting and airy.
  if (style === "voice-bright") {
    breath(t, 0.05);
    voice(t + 0.1, 2.6, A.A3, 0.1, -0.25, 0.6, 0, VOWEL.eh);
    voice(t + 0.1, 2.6, A.E4, 0.085, 0.25, 0.6, 0, VOWEL.eh);
    voice(t + 0.5, 2.05, A.A4, 0.055, 0, 0.7, A.E5, VOWEL.eh); // rising current

    breath(t + 2.45, 0.06);
    const base = t + 2.6;
    voice(base, 2.3, A.A3, 0.1, 0, 0.6, 0, VOWEL.eh);
    voice(base, 2.3, A.E4, 0.095, -0.3, 0.6, 0, VOWEL.eh);
    voice(base, 2.3, A.A4, 0.085, 0.3, 0.6, 0, VOWEL.eh);
    voice(base + 0.06, 2.1, A.E5, 0.07, 0, 0.75, 0, VOWEL.ee); // shimmer top
  }

  // Deep — round "oh"/"oo" vowels, a register lower, slower swell and more
  // reverb. Solemn and meditative.
  if (style === "voice-deep") {
    breath(t, 0.05);
    voice(t + 0.05, 2.85, A.A1, 0.12, 0, 0.85, 0, VOWEL.oh, 2200); // deep root
    voice(t + 0.1, 2.7, A.A2, 0.1, -0.2, 0.85, 0, VOWEL.oh, 2200);
    voice(t + 0.1, 2.7, A.E3, 0.085, 0.2, 0.85, 0, VOWEL.oh, 2200);
    voice(t + 0.6, 2.1, A.E3, 0.05, 0, 0.9, A.A3, VOWEL.oo, 2200); // slow rise

    breath(t + 2.4, 0.06);
    const base = t + 2.6;
    voice(base, 2.6, A.A1, 0.11, 0, 0.9, 0, VOWEL.oh, 2200);
    voice(base, 2.6, A.A2, 0.11, -0.28, 0.9, 0, VOWEL.oh, 2200);
    voice(base, 2.6, A.E3, 0.095, 0.28, 0.9, 0, VOWEL.oh, 2200);
    voice(base + 0.05, 2.5, A.A3, 0.08, 0, 0.9, 0, VOWEL.oo, 2200);
  }

  // graceful master fade
  master.gain.setValueAtTime(master.gain.value, t + 4.6);
  master.gain.exponentialRampToValueAtTime(0.0001, t + 5.1);
}

export function playIntroAudio(style: IntroStyle = "pulse"): AudioContext | null {
  const Ctor = window.AudioContext || (window as Win).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  build(ctx, style);
  ctx.resume().catch(() => {});
  return ctx;
}

/** Offline render (no gesture/speaker needed) — for dev measurement. */
export async function renderIntroAudioBuffer(
  style: IntroStyle = "pulse",
  seconds = 5.5,
): Promise<AudioBuffer | null> {
  const OCtor =
    window.OfflineAudioContext || (window as Win).webkitOfflineAudioContext;
  if (!OCtor) return null;
  const sr = 44100;
  const ctx = new OCtor(2, Math.ceil(sr * seconds), sr);
  build(ctx, style);
  return ctx.startRendering();
}
