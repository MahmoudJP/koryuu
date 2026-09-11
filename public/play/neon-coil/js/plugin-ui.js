/* Neon Coil: mode selection, live telemetry, touch controls, settings, and sound effects. */
(function (API) {
  "use strict";
  if (!API) return;

  var KEYS = {
    sound: "neonCoilSound",
    effects: "neonCoilEffects", haptics: "neonCoilHaptics",
    mode: "neonCoilMode", scores: "neonCoilScores"
  };

  function get(key, fallback) { try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; } }
  function set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  var settings = {
    sound: get(KEYS.sound, "1") === "1",
    effects: get(KEYS.effects, API.cfg.REDUCED_MOTION ? "0" : "1") === "1",
    haptics: get(KEYS.haptics, "1") === "1"
  };
  API.cfg.REDUCED_MOTION = !settings.effects;
  API.cfg.HAPTICS = settings.haptics;

  var actx = null, master = null;
  function ensureAudio() {
    if (actx) return actx;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = .78; master.connect(actx.destination);
    } catch (e) { actx = null; }
    return actx;
  }
  function resumeAudio() { if (actx && actx.state === "suspended") actx.resume().catch(function () {}); }
  function tone(freq, when, duration, type, volume, endFreq, target) {
    if (!actx) return;
    var osc = actx.createOscillator(), gain = actx.createGain();
    osc.type = type || "triangle"; osc.frequency.setValueAtTime(freq, when);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, when + duration);
    gain.gain.setValueAtTime(.0001, when); gain.gain.exponentialRampToValueAtTime(volume, when + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
    osc.connect(gain); gain.connect(target || master); osc.start(when); osc.stop(when + duration + .03);
  }
  function sfx(type) {
    if (!settings.sound || !ensureAudio()) return;
    resumeAudio(); var now = actx.currentTime;
    if (type === "eat") { tone(520, now, .12, "triangle", .13, 960); tone(780, now + .025, .09, "sine", .055); }
    else if (type === "power") [523, 659, 784, 1047].forEach(function (n, i) { tone(n, now + i * .052, .15, "square", .075); });
    else if (type === "die") { tone(330, now, .52, "sawtooth", .16, 52); tone(170, now + .04, .5, "triangle", .08, 38); }
  }
  API.on("audio", sfx);

  function byId(id) { return document.getElementById(id); }
  function setText(id, value) { var el = byId(id); if (el) el.textContent = value; }

  function renderMode(id, m) {
    setText("modeName", m.name); setText("modeDescription", m.description);
    setText("difficultyPill", m.difficulty); setText("modeBadge", "●  " + m.name);
    setText("footerTip", m.tip);
    var status = byId("difficultyPill"); if (status) status.dataset.level = m.difficulty.toLowerCase();
    document.querySelectorAll(".mode-card").forEach(function (card) {
      var selected = card.dataset.mode === id;
      card.classList.toggle("active", selected); card.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    var button = byId("startBtn");
    if (button) button.innerHTML = "<span>Play " + m.name.replace(" Circuit", "").replace(" Protocol", "").replace(" Flow", "") + "</span><b aria-hidden='true'>→</b>";
  }

  function chooseMode(id) {
    if (!API.modes[id]) return;
    API.setMode(id); set(KEYS.mode, id); renderMode(id, API.modes[id]);
  }

  function bindModeCards() {
    document.querySelectorAll(".mode-card").forEach(function (card) {
      card.addEventListener("click", function () { chooseMode(card.dataset.mode); });
    });
    var preferred = get(KEYS.mode, "classic");
    chooseMode(API.modes[preferred] ? preferred : "classic");
  }

  function renderProgress(data) {
    setText("level", data.level);
    var bar = byId("levelProgress"); if (bar) bar.style.width = Math.min(100, data.current / data.target * 100) + "%";
    setText(
      "levelGoal",
      data.complete
        ? "Level 5 · Infinite — keep the coil alive"
        : "Level " + data.level + " · " + data.name + " — " + data.remaining + " points to " + data.nextName
    );
  }

  function renderCombo(data) { setText("combo", data.combo > 1 ? data.combo + "×" : "—"); }

  function renderTelemetry() {
    var S = API.state;
    setText("foodCount", S.foodEaten); setText("lengthCount", S.snake.length);
    setText("speedCount", (S.effectiveSpeed / (API.getMode().baseSpeed || 1)).toFixed(1) + "×");
    var effects = API.getEffects(), list = byId("effectList"); setText("effectCount", effects.length);
    if (!list) return;
    if (!effects.length) { list.innerHTML = "<p>No active power-ups yet.</p>"; return; }
    list.innerHTML = effects.map(function (effect) {
      var time = Number.isFinite(effect.remaining) ? Math.max(0, effect.remaining).toFixed(1) + "s" : "READY";
      return "<div class='effect-chip' style='--effect-color:" + (effect.color || "83,243,207") + "'><i></i><span>" +
        (effect.glyph || "●") + " " + (effect.label || effect.type) + "</span><b>" + time + "</b></div>";
    }).join("");
  }

  function button(label, icon, pressed, handler) {
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "dock-button";
    btn.innerHTML = "<i aria-hidden='true'>" + icon + "</i><span>" + label + "</span>";
    if (typeof pressed === "boolean") btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    btn.addEventListener("click", handler); return btn;
  }
  function setPressed(btn, state) { btn.setAttribute("aria-pressed", state ? "true" : "false"); }

  function buildDock() {
    var dock = byId("dock"); if (!dock) return;
    var pause = button("Pause / resume", "Ⅱ", null, function () {
      if (API.state.running && !API.state.dead) API.togglePause(); else API.startGame();
    });
    var sound = button("Sound", "◖)", settings.sound, function () {
      settings.sound = !settings.sound; set(KEYS.sound, settings.sound ? "1" : "0"); setPressed(sound, settings.sound);
    });
    var effects = button("Visual effects", "✦", settings.effects, function () {
      settings.effects = !settings.effects; API.cfg.REDUCED_MOTION = !settings.effects;
      set(KEYS.effects, settings.effects ? "1" : "0"); setPressed(effects, settings.effects);
    });
    var haptics = button("Haptics", "≈", settings.haptics, function () {
      settings.haptics = !settings.haptics; API.cfg.HAPTICS = settings.haptics;
      set(KEYS.haptics, settings.haptics ? "1" : "0"); setPressed(haptics, settings.haptics);
    });
    [pause, sound, effects, haptics].forEach(function (btn) { dock.appendChild(btn); });
  }

  function buildTouchControls() {
    var host = byId("mobileControls"); if (!host) return;
    host.innerHTML = "<div class='touch-pad' aria-label='Direction pad'>" +
      "<button type='button' data-dir='up' aria-label='Move up'>↑</button>" +
      "<button type='button' data-dir='left' aria-label='Move left'>←</button>" +
      "<button type='button' data-dir='pause' aria-label='Pause or resume'>Ⅱ</button>" +
      "<button type='button' data-dir='right' aria-label='Move right'>→</button>" +
      "<button type='button' data-dir='down' aria-label='Move down'>↓</button></div>";
    var directions = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    host.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("pointerdown", function (event) {
        event.preventDefault(); var dir = btn.dataset.dir;
        if (dir === "pause") {
          if (API.state.running && !API.state.dead) API.togglePause(); else API.startGame();
          return;
        }
        if (!API.state.running && !API.state.dead) API.startGame();
        API.setDir(directions[dir][0], directions[dir][1]);
      });
    });
  }

  function readScores() {
    try {
      var scores = JSON.parse(get(KEYS.scores, "[]"));
      return Array.isArray(scores) ? scores : [];
    } catch (e) { return []; }
  }
  function saveScore(score) {
    if (!score) return;
    var scores = readScores(); scores.unshift({ score: score, mode: API.state.mode, at: Date.now() });
    set(KEYS.scores, JSON.stringify(scores.slice(0, 10)));
  }

  var telemetryTimer = 0;
  API.on("tick", function (dt) { telemetryTimer += dt; if (telemetryTimer > .1) { telemetryTimer = 0; renderTelemetry(); } });
  API.on("afterStep", renderTelemetry);
  API.on("start", renderTelemetry);
  API.on("gameover", function (score) { saveScore(score); renderTelemetry(); });
  API.on("init", renderTelemetry);
  API.on("modechange", renderMode);
  API.on("progress", renderProgress);
  API.on("combochange", renderCombo);
  API.on("menu", bindModeCards);

  function unlockAudio() {
    ensureAudio(); resumeAudio();
    window.removeEventListener("pointerdown", unlockAudio, true); window.removeEventListener("keydown", unlockAudio, true);
  }
  window.addEventListener("pointerdown", unlockAudio, true); window.addEventListener("keydown", unlockAudio, true);

  bindModeCards(); buildDock(); buildTouchControls(); renderTelemetry();
})(window.SnakeAPI);
