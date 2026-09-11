import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../public/play/neon-coil/js/", import.meta.url);

class FakeClassList {
  constructor() { this.values = new Set(); }
  add(...names) { names.forEach((name) => this.values.add(name)); }
  remove(...names) { names.forEach((name) => this.values.delete(name)); }
  contains(name) { return this.values.has(name); }
  toggle(name, force) {
    const enabled = force === undefined ? !this.values.has(name) : force;
    if (enabled) this.values.add(name); else this.values.delete(name);
    return enabled;
  }
}

class FakeElement {
  constructor() {
    this.classList = new FakeClassList();
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.innerHTML = "";
    this.textContent = "";
  }
  addEventListener() {}
  appendChild(child) { this.children.push(child); return child; }
  setAttribute(name, value) { this[name] = String(value); }
  querySelectorAll() { return []; }
  closest() { return null; }
}

function makeContext() {
  const elements = new Map();
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, new FakeElement());
    return elements.get(id);
  };
  const canvas = element("game");
  canvas.width = 600;
  canvas.height = 600;
  const gradient = { addColorStop() {} };
  const context2d = new Proxy({}, {
    get(target, key) {
      if (key === "createLinearGradient" || key === "createRadialGradient") return () => gradient;
      if (!(key in target)) target[key] = () => {};
      return target[key];
    },
    set(target, key, value) { target[key] = value; return true; },
  });
  canvas.getContext = () => context2d;

  let now = 0;
  let nextFrame = null;
  let nextTimerId = 1;
  const timers = new Map();
  let seed = 0x1a2b3c4d;
  const testMath = Object.create(Math);
  testMath.random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  const storage = new Map([["neonCoilBest:classic", "not-a-number"]]);
  const context = {
    console,
    Math: testMath,
    Date,
    Number,
    JSON,
    performance: { now: () => now },
    navigator: { vibrate() {} },
    localStorage: {
      getItem: (key) => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
    document: {
      hidden: false,
      addEventListener() {},
      createElement: () => new FakeElement(),
      getElementById: element,
      querySelectorAll: () => [],
    },
    requestAnimationFrame(callback) { nextFrame = callback; return 1; },
    setTimeout(callback) { const id = nextTimerId++; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  context.window = context;
  context.window.addEventListener = () => {};
  context.window.matchMedia = () => ({ matches: false });
  vm.createContext(context);

  function load(name) {
    vm.runInContext(readFileSync(new URL(name, root), "utf8"), context, { filename: name });
  }
  load("core.js");
  load("plugin-modes.js");
  load("plugin-content.js");
  context.SnakeAPI.boot();

  function frame(milliseconds = 16) {
    now += milliseconds;
    const callback = nextFrame;
    nextFrame = null;
    assert.equal(typeof callback, "function", "animation frame was scheduled");
    callback(now);
  }
  function advance(milliseconds) {
    for (let elapsed = 0; elapsed < milliseconds; elapsed += 16) frame(Math.min(16, milliseconds - elapsed));
  }
  function runTimers() {
    const callbacks = [...timers.values()];
    timers.clear();
    callbacks.forEach((callback) => callback());
  }
  frame(0);
  return { API: context.SnakeAPI, elements, advance, runTimers, timers };
}

const { API, elements, advance, runTimers, timers } = makeContext();

function setSnake(cells, direction) {
  API.state.snake = cells.map(([x, y]) => ({ x, y, rx: x, ry: y }));
  API.state.dir = { ...direction };
  API.state.nextDir = { ...direction };
  API.state.food = { x: 15, y: 15, type: null };
}

assert.equal(API.state.best, 0, "corrupt saved scores fall back to zero");

API.setMode("classic");
API.startGame();
setSnake([[19, 5], [18, 5], [17, 5]], { x: 1, y: 0 });
advance(180);
assert.equal(API.state.dead, false, "Classic survives a wrapped edge");
assert.equal(API.state.snake[0].x, 0, "Classic re-enters on the opposite edge");

API.startGame();
setSnake([[6, 0], [6, 1], [6, 2]], { x: 0, y: -1 });
advance(180);
assert.equal(API.state.dead, false, "vertical wrapping is safe");
assert.equal(API.state.snake[0].y, 19, "vertical wrapping re-enters on the opposite edge");

API.startGame();
setSnake([[2, 2], [2, 3], [1, 3], [1, 2]], { x: -1, y: 0 });
advance(180);
assert.equal(API.state.dead, false, "moving into a departing tail cell is legal");

API.startGame();
setSnake([[2, 2], [2, 3], [1, 3], [1, 2], [0, 2]], { x: -1, y: 0 });
API.state.shield = true;
API.state.effects.shield = Infinity;
advance(180);
assert.equal(API.state.dead, false, "shield protects a self collision");
assert.equal(API.state.shield, false, "shield is consumed once");
assert.equal(new Set(API.state.snake.map(({ x, y }) => `${x}:${y}`)).size, API.state.snake.length, "protected self collision leaves no overlapping body cells");

API.showMenu();
API.setMode("rush");
API.startGame();
setSnake([[19, 7], [18, 7], [17, 7]], { x: 1, y: 0 });
API.state.shield = true;
API.state.effects.shield = Infinity;
advance(130);
assert.equal(API.state.dead, false, "shield protects a hard-wall collision");
assert.equal(API.state.snake[0].x, 0, "shielded wall collisions re-enter safely");
assert.equal(API.state.shield, false, "a wall consumes the shield");

API.startGame();
setSnake([[19, 7], [18, 7], [17, 7]], { x: 1, y: 0 });
advance(130);
assert.equal(API.state.dead, true, "Rush keeps its hard wall rule");
assert.equal(API.state.lastReason, "wall", "wall deaths retain an explicit cause");
assert.equal(timers.size, 1, "game over schedules one result overlay");
API.startGame();
assert.equal(timers.size, 0, "starting again cancels the stale result overlay");
runTimers();
assert.equal(API.state.dead, false, "a stale timer cannot interrupt the new run");
assert.equal(elements.get("overlay").classList.contains("hidden"), true, "the new run stays visible");

API.showMenu();
API.setMode("rush");
API.startGame();
setSnake([[19, 7], [18, 7], [17, 7]], { x: 1, y: 0 });
advance(130);
runTimers();
assert.match(elements.get("overlay").innerHTML, /edge of the circuit/, "the result explains a wall death");

API.showMenu();
API.setMode("classic");
API.startGame();
API.addScore(100);
API.emit("afterStep");
const obstacle = API.getObstacles()[0];
assert.ok(obstacle, "level two introduces an arena block");
assert.equal(obstacle.armed, false, "new arena blocks begin as warnings");
const head = API.state.snake[0];
const dx = Math.min(Math.abs(head.x - obstacle.x), API.GRID - Math.abs(head.x - obstacle.x));
const dy = Math.min(Math.abs(head.y - obstacle.y), API.GRID - Math.abs(head.y - obstacle.y));
assert.ok(dx + dy >= 7, "new blocks keep a safe toroidal distance from the player");
for (let i = 0; i < 7; i++) API.emit("afterStep");
assert.equal(obstacle.armed, false, "a block cannot kill while it is still fading in");
API.emit("afterStep");
assert.equal(obstacle.armed, true, "a fully visible block becomes active");

API.startGame();
API.addScore(100);
API.emit("afterStep");
const shieldedObstacle = API.getObstacles()[0];
assert.ok(shieldedObstacle, "the shield scenario has an arena block");
const nextX = (API.state.snake[0].x + API.state.dir.x + API.GRID) % API.GRID;
const nextY = (API.state.snake[0].y + API.state.dir.y + API.GRID) % API.GRID;
shieldedObstacle.x = nextX;
shieldedObstacle.y = nextY;
shieldedObstacle.t = 1;
shieldedObstacle.armed = true;
API.state.shield = true;
API.state.effects.shield = Infinity;
advance(180);
assert.equal(API.state.dead, false, "shield protects an armed-obstacle collision");
assert.equal(API.state.shield, false, "an obstacle consumes the shield");
assert.equal(API.getObstacles().includes(shieldedObstacle), false, "the shield clears the block it absorbed");

API.state.targetSpeed = 100;
API.state.effects.speed = 5;
API.state.effects.mini = 5;
advance(1000);
assert.ok(API.state.effectiveSpeed <= API.cfg.MAX_EFFECTIVE_SPEED, "stacked boosts stay below the mode safety cap");

console.log("Neon Coil regression checks passed.");
