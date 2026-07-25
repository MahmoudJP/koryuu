"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { IntroStyle } from "./introAudio";

/**
 * "Confluence" — Koryuu's cinematic intro.
 *
 * 交流 (kōryū) means *exchange / flow*. Koryuu is one platform that many apps,
 * tools and services flow into. So a large swarm of colourful orbs — each a
 * point of its own hue, near and far for depth — streams inward along curved
 * currents and merges into a single luminous core, which blooms and resolves
 * into the 交流 kanji and the Koryuu wordmark. Many → one.
 *
 * The orb field is generated procedurally (not from the app list), so the
 * "many things converging" idea scales whether there are 8 apps or 800.
 *
 * Lives in the root layout, so it plays once on a real page load and stays out
 * of the way during client-side navigation (the layout never remounts).
 *
 * The whole timeline is CSS-driven (animation-delay); JS only handles the
 * curtain exit and click-to-skip.
 */

// ── Master clock (seconds) ──────────────────────────────────────
const T = {
  exit: 5.0, // curtain lift begins
  done: 5.7, // unmount / scroll unlock
};

// Number of orbs in the swarm. Decoupled from the app count so the
// "ecosystem converging" idea reads the same at any catalogue size.
const ORB_COUNT = 110;

// A broad, vibrant palette so the swarm reads as many *different* apps and
// services — biased a little toward the brand's indigo/violet so it stays Koryuu.
const PALETTE = [
  "#6366f1", "#818cf8", "#8b5cf6", "#a855f7", "#c084fc",
  "#d946ef", "#ec4899", "#f43f5e", "#fb7185", "#f97316",
  "#f59e0b", "#fbbf24", "#84cc16", "#22c55e", "#10b981",
  "#14b8a6", "#06b6d4", "#38bdf8", "#3b82f6", "#60a5fa",
];

// Deterministic PRNG (mulberry32) so the server and client render identically
// and there's no hydration mismatch.
function makeRng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Audio is a dev-only evaluation aid — gated so it never runs in production.
const AUDIO_DEV_ONLY = process.env.NODE_ENV === "development";

export function IntroReveal() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  // Bumped to replay the intro from the top (dev audio-evaluation control).
  const [runId, setRunId] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  const orbs = useMemo(() => {
    const rng = makeRng(0x6b6f7279); // "kory"
    return Array.from({ length: ORB_COUNT }, (_, i) => {
      // Even angular spread with jitter, so currents arrive from every side.
      const angle = (i / ORB_COUNT) * Math.PI * 2 + (rng() - 0.5) * 0.55;
      const radius = 230 + rng() * 260; // 230–490px out from the core
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;

      // Bend each path: a control point partway in, pushed along the tangent,
      // so the orbs sweep in on curved currents rather than straight lines.
      const px = -Math.sin(angle);
      const py = Math.cos(angle);
      const curve = (rng() - 0.5) * radius * 0.55;
      const mx = tx * 0.22 + px * curve;
      const my = ty * 0.22 + py * curve;

      const far = rng() < 0.34; // depth: a third sit "further away"
      const size = far ? 2.5 + rng() * 3.5 : 5 + rng() * 8;

      return {
        tx: `${tx.toFixed(0)}px`,
        ty: `${ty.toFixed(0)}px`,
        mx: `${mx.toFixed(0)}px`,
        my: `${my.toFixed(0)}px`,
        size: `${size.toFixed(1)}px`,
        color: PALETTE[Math.floor(rng() * PALETTE.length)],
        delay: `${(0.1 + rng() * 1.85).toFixed(2)}s`,
        dur: `${(1.3 + rng() * 0.7).toFixed(2)}s`,
        opacity: (far ? 0.4 : 0.7) + rng() * 0.3,
        blur: far ? `${(0.6 + rng() * 1.8).toFixed(1)}px` : "0px",
      };
    });
  }, []);

  const stopAudio = () => {
    audioRef.current?.close().catch(() => {});
    audioRef.current = null;
  };

  const playAudio = (style: IntroStyle) => {
    if (!AUDIO_DEV_ONLY) return;
    stopAudio();
    import("./introAudio")
      .then((m) => {
        audioRef.current = m.playIntroAudio(style);
      })
      .catch(() => {});
  };

  const skip = () => {
    setExiting(true);
    stopAudio();
    window.setTimeout(() => {
      document.documentElement.classList.remove("kr-loading");
      setDone(true);
    }, 650);
  };

  // Dev-only: restart the animation and the chosen audio style together, synced.
  const runWithStyle = (style: IntroStyle) => {
    stopAudio();
    document.documentElement.classList.add("kr-loading");
    setExiting(false);
    setDone(false);
    setRunId((r) => r + 1);
    playAudio(style);
  };

  const AudioPicker = AUDIO_DEV_ONLY ? (
    <div className="iv__audio" onClick={(e) => e.stopPropagation()}>
      <span className="iv__audio-label">▶ Play with sound:</span>
      {(
        [
          ["pulse", "Pulse · Classic"],
          ["pulse-warm", "Pulse · Warm"],
          ["pulse-neon", "Pulse · Neon"],
          ["voice", "Voice · Warm (halal)"],
          ["voice-bright", "Voice · Bright (halal)"],
          ["voice-deep", "Voice · Deep (halal)"],
        ] as [IntroStyle, string][]
      ).map(([s, label]) => (
        <button
          key={s}
          className="iv__audio-btn"
          onClick={() => runWithStyle(s)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  ) : null;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("kr-loading");

    // The full sequence plays for everyone — it's the brand's hero moment.
    // Reduced-motion users still get it, just without the blurred exit (CSS).
    const t1 = window.setTimeout(() => setExiting(true), T.exit * 1000);
    const t2 = window.setTimeout(() => {
      root.classList.remove("kr-loading");
      setDone(true);
    }, T.done * 1000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      root.classList.remove("kr-loading");
    };
  }, [runId]);

  // Stop any audio when the component unmounts.
  useEffect(() => stopAudio, []);

  // Dev-only: expose the offline render so the audio can be measured/auditioned.
  useEffect(() => {
    if (!AUDIO_DEV_ONLY) return;
    import("./introAudio").then((m) => {
      (window as unknown as Record<string, unknown>).__koryuuIntroAudio = m;
    });
  }, []);

  // After the intro finishes, keep the dev audio picker around so the styles
  // can be auditioned in sync. In production this renders nothing.
  if (done) return AudioPicker;

  return (
    <div
      className={`iv${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading Koryuu"
      aria-live="polite"
      onClick={skip}
    >
      {/* Ambient glow that intensifies as the currents converge. */}
      <div className="iv__glow" key={`glow-${runId}`} aria-hidden />

      <div className="iv__stage" key={`stage-${runId}`} aria-hidden>
        {/* The converging swarm. */}
        <div className="iv__field">
          {orbs.map((o, i) => (
            <span
              key={i}
              className="iv-orb"
              style={
                {
                  "--tx": o.tx,
                  "--ty": o.ty,
                  "--mx": o.mx,
                  "--my": o.my,
                  "--sz": o.size,
                  "--c": o.color,
                  "--d": o.delay,
                  "--dur": o.dur,
                  "--o": o.opacity,
                  "--blur": o.blur,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Faint guide rings — a hint of the platform the currents orbit. */}
          <span className="iv-orbit iv-orbit--1" />
          <span className="iv-orbit iv-orbit--2" />

          {/* The shockwave as the currents land, and the luminous core. */}
          <span className="iv-core__ring" />
          <span className="iv-core__ring iv-core__ring--2" />
          <span className="iv-core" />
        </div>

        {/* The mark that emerges from the confluence. */}
        <div className="iv-mark">
          <span className="iv-mark__kanji jp">交流</span>
          <span className="iv-mark__word display">
            Koryu<span className="iv-u">u</span>
          </span>
          <span className="iv-mark__meter">
            <span className="iv-mark__fill" />
          </span>
        </div>
      </div>

      <button className="iv__skip" onClick={skip} type="button">
        Skip intro
      </button>

      {AudioPicker}
    </div>
  );
}
