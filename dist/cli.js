#!/usr/bin/env node
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/ts-pattern/dist/index.js
function a(t2) {
  return Object.assign(t2, { optional: () => h(t2), and: (e2) => d(t2, e2), or: (e2) => y(t2, e2), select: (e2) => e2 === undefined ? v(t2) : v(e2, t2) });
}
function h(e2) {
  return a({ [t]: () => ({ match: (t2) => {
    let n2 = {};
    const r2 = (t3, e3) => {
      n2[t3] = e3;
    };
    return t2 === undefined ? (s(e2).forEach((t3) => r2(t3, undefined)), { matched: true, selections: n2 }) : { matched: o(e2, t2, r2), selections: n2 };
  }, getSelectionKeys: () => s(e2), matcherType: "optional" }) });
}
function d(...e2) {
  return a({ [t]: () => ({ match: (t2) => {
    let n2 = {};
    const r2 = (t3, e3) => {
      n2[t3] = e3;
    };
    return { matched: e2.every((e3) => o(e3, t2, r2)), selections: n2 };
  }, getSelectionKeys: () => c(e2, s), matcherType: "and" }) });
}
function y(...e2) {
  return a({ [t]: () => ({ match: (t2) => {
    let n2 = {};
    const r2 = (t3, e3) => {
      n2[t3] = e3;
    };
    return c(e2, s).forEach((t3) => r2(t3, undefined)), { matched: e2.some((e3) => o(e3, t2, r2)), selections: n2 };
  }, getSelectionKeys: () => c(e2, s), matcherType: "or" }) });
}
function p(e2) {
  return { [t]: () => ({ match: (t2) => ({ matched: Boolean(e2(t2)) }) }) };
}
function v(...e2) {
  const r2 = typeof e2[0] == "string" ? e2[0] : undefined, i2 = e2.length === 2 ? e2[1] : typeof e2[0] == "string" ? undefined : e2[0];
  return a({ [t]: () => ({ match: (t2) => {
    let e3 = { [r2 != null ? r2 : n]: t2 };
    return { matched: i2 === undefined || o(i2, t2, (t3, n2) => {
      e3[t3] = n2;
    }), selections: e3 };
  }, getSelectionKeys: () => [r2 != null ? r2 : n].concat(i2 === undefined ? [] : s(i2)) }) });
}
function b(t2) {
  return true;
}
function w(t2) {
  return typeof t2 == "number";
}
function S(t2) {
  return typeof t2 == "string";
}
function j(t2) {
  return typeof t2 == "bigint";
}
function M(t2) {
  return new R(t2, L);
}

class R {
  constructor(t2, e2) {
    this.input = undefined, this.state = undefined, this.input = t2, this.state = e2;
  }
  with(...t2) {
    if (this.state.matched)
      return this;
    const e2 = t2[t2.length - 1], r2 = [t2[0]];
    let i2;
    t2.length === 3 && typeof t2[1] == "function" ? i2 = t2[1] : t2.length > 2 && r2.push(...t2.slice(1, t2.length - 1));
    let s2 = false, c2 = {};
    const u = (t3, e3) => {
      s2 = true, c2[t3] = e3;
    }, a2 = !r2.some((t3) => o(t3, this.input, u)) || i2 && !Boolean(i2(this.input)) ? L : { matched: true, value: e2(s2 ? n in c2 ? c2[n] : c2 : this.input, this.input) };
    return new R(this.input, a2);
  }
  when(t2, e2) {
    if (this.state.matched)
      return this;
    const n2 = Boolean(t2(this.input));
    return new R(this.input, n2 ? { matched: true, value: e2(this.input, this.input) } : L);
  }
  otherwise(t2) {
    return this.state.matched ? this.state.value : t2(this.input);
  }
  exhaustive(t2 = F) {
    return this.state.matched ? this.state.value : t2(this.input);
  }
  run() {
    return this.exhaustive();
  }
  returnType() {
    return this;
  }
  narrow() {
    return this;
  }
}
function F(t2) {
  throw new I(t2);
}
var t, e, n = "@ts-pattern/anonymous-select-key", r = (t2) => Boolean(t2 && typeof t2 == "object"), i = (e2) => e2 && !!e2[t], o = (n2, s, c) => {
  if (i(n2)) {
    const e2 = n2[t](), { matched: r2, selections: i2 } = e2.match(s);
    return r2 && i2 && Object.keys(i2).forEach((t2) => c(t2, i2[t2])), r2;
  }
  if (r(n2)) {
    if (!r(s))
      return false;
    if (Array.isArray(n2)) {
      if (!Array.isArray(s))
        return false;
      let t2 = [], r2 = [], u = [];
      for (const o2 of n2.keys()) {
        const s2 = n2[o2];
        i(s2) && s2[e] ? u.push(s2) : u.length ? r2.push(s2) : t2.push(s2);
      }
      if (u.length) {
        if (u.length > 1)
          throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
        if (s.length < t2.length + r2.length)
          return false;
        const e2 = s.slice(0, t2.length), n3 = r2.length === 0 ? [] : s.slice(-r2.length), i2 = s.slice(t2.length, r2.length === 0 ? Infinity : -r2.length);
        return t2.every((t3, n4) => o(t3, e2[n4], c)) && r2.every((t3, e3) => o(t3, n3[e3], c)) && (u.length === 0 || o(u[0], i2, c));
      }
      return n2.length === s.length && n2.every((t3, e2) => o(t3, s[e2], c));
    }
    return Reflect.ownKeys(n2).every((e2) => {
      const r2 = n2[e2];
      return ((e2 in s) || i(u = r2) && u[t]().matcherType === "optional") && o(r2, s[e2], c);
      var u;
    });
  }
  return Object.is(s, n2);
}, s = (e2) => {
  var n2, o2, u;
  return r(e2) ? i(e2) ? (n2 = (o2 = (u = e2[t]()).getSelectionKeys) == null ? undefined : o2.call(u)) != null ? n2 : [] : Array.isArray(e2) ? c(e2, s) : c(Object.values(e2), s) : [];
}, c = (t2, e2) => t2.reduce((t3, n2) => t3.concat(e2(n2)), []), K, O, x = (t2) => Object.assign(a(t2), { startsWith: (e2) => {
  return x(d(t2, (n2 = e2, p((t3) => S(t3) && t3.startsWith(n2)))));
  var n2;
}, endsWith: (e2) => {
  return x(d(t2, (n2 = e2, p((t3) => S(t3) && t3.endsWith(n2)))));
  var n2;
}, minLength: (e2) => x(d(t2, ((t3) => p((e3) => S(e3) && e3.length >= t3))(e2))), length: (e2) => x(d(t2, ((t3) => p((e3) => S(e3) && e3.length === t3))(e2))), maxLength: (e2) => x(d(t2, ((t3) => p((e3) => S(e3) && e3.length <= t3))(e2))), includes: (e2) => {
  return x(d(t2, (n2 = e2, p((t3) => S(t3) && t3.includes(n2)))));
  var n2;
}, regex: (e2) => {
  return x(d(t2, (n2 = e2, p((t3) => S(t3) && Boolean(t3.match(n2))))));
  var n2;
} }), A, N = (t2) => Object.assign(a(t2), { between: (e2, n2) => N(d(t2, ((t3, e3) => p((n3) => w(n3) && t3 <= n3 && e3 >= n3))(e2, n2))), lt: (e2) => N(d(t2, ((t3) => p((e3) => w(e3) && e3 < t3))(e2))), gt: (e2) => N(d(t2, ((t3) => p((e3) => w(e3) && e3 > t3))(e2))), lte: (e2) => N(d(t2, ((t3) => p((e3) => w(e3) && e3 <= t3))(e2))), gte: (e2) => N(d(t2, ((t3) => p((e3) => w(e3) && e3 >= t3))(e2))), int: () => N(d(t2, p((t3) => w(t3) && Number.isInteger(t3)))), finite: () => N(d(t2, p((t3) => w(t3) && Number.isFinite(t3)))), positive: () => N(d(t2, p((t3) => w(t3) && t3 > 0))), negative: () => N(d(t2, p((t3) => w(t3) && t3 < 0))) }), P, k = (t2) => Object.assign(a(t2), { between: (e2, n2) => k(d(t2, ((t3, e3) => p((n3) => j(n3) && t3 <= n3 && e3 >= n3))(e2, n2))), lt: (e2) => k(d(t2, ((t3) => p((e3) => j(e3) && e3 < t3))(e2))), gt: (e2) => k(d(t2, ((t3) => p((e3) => j(e3) && e3 > t3))(e2))), lte: (e2) => k(d(t2, ((t3) => p((e3) => j(e3) && e3 <= t3))(e2))), gte: (e2) => k(d(t2, ((t3) => p((e3) => j(e3) && e3 >= t3))(e2))), positive: () => k(d(t2, p((t3) => j(t3) && t3 > 0))), negative: () => k(d(t2, p((t3) => j(t3) && t3 < 0))) }), T, B, _, W, $, I, L;
var init_dist = __esm(() => {
  t = Symbol.for("@ts-pattern/matcher");
  e = Symbol.for("@ts-pattern/isVariadic");
  K = a(p(b));
  O = a(p(b));
  A = x(p(S));
  P = N(p(w));
  T = k(p(j));
  B = a(p(function(t2) {
    return typeof t2 == "boolean";
  }));
  _ = a(p(function(t2) {
    return typeof t2 == "symbol";
  }));
  W = a(p(function(t2) {
    return t2 == null;
  }));
  $ = a(p(function(t2) {
    return t2 != null;
  }));
  I = class I extends Error {
    constructor(t2) {
      let e2;
      try {
        e2 = JSON.stringify(t2);
      } catch (n2) {
        e2 = t2;
      }
      super(`Pattern matching error: no pattern matches value ${e2}`), this.input = undefined, this.input = t2;
    }
  };
  L = { matched: false, value: undefined };
});

// src/result.ts
function Ok(value2) {
  return { ok: true, value: value2 };
}
function Err(error) {
  return { ok: false, error };
}
function collectResults(results) {
  const values2 = [];
  for (const result of results) {
    if (!result.ok)
      return result;
    values2.push(result.value);
  }
  return Ok(values2);
}

// src/exec.ts
import { spawn } from "child_process";
import * as os from "os";
import * as path2 from "path";
async function exec(command2, options = {}) {
  const { cwd, captureOutput = false, rejectOnNonZeroExit = true, env, timeout } = options;
  const mergedEnv = env ? { ...process.env, ...env } : undefined;
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", command2], {
      cwd,
      env: mergedEnv,
      stdio: captureOutput ? "pipe" : "inherit"
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = timeout != null ? setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeout) : undefined;
    if (captureOutput) {
      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
    }
    child.on("error", (err) => {
      if (timer != null)
        clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      if (timer != null)
        clearTimeout(timer);
      if (timedOut) {
        const result2 = {
          code: null,
          stdout,
          stderr: `Command timed out after ${timeout}ms: ${command2}`
        };
        if (rejectOnNonZeroExit) {
          const error = new Error(result2.stderr);
          error.cause = result2;
          reject(error);
        } else {
          resolve(result2);
        }
        return;
      }
      const result = { code, stdout, stderr };
      if (code !== 0 && rejectOnNonZeroExit) {
        const error = new Error(`Command '${command2}' failed with code ${code}`);
        error.cause = { code, stdout, stderr };
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
async function tryExec(command2, errorContext, options) {
  const result = await exec(command2, {
    ...options,
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0) {
    return Err(`${errorContext}: ${(result.stderr ?? "").trim()}`);
  }
  return Ok(result);
}
function shellEscape(s2) {
  return `'${s2.replace(/'/g, "'\\''")}'`;
}
function expandHome(p2) {
  if (p2.startsWith("~/"))
    return path2.join(os.homedir(), p2.slice(2));
  return p2;
}
function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}
function once(fn) {
  let cached;
  return () => {
    if (cached == null)
      cached = fn();
    return cached;
  };
}
var init_exec = () => {
};

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC = "\x1B";
  var CSI = `${ESC}[`;
  var beep = "\x07";
  var cursor = {
    to(x2, y2) {
      if (!y2)
        return `${CSI}${x2 + 1}G`;
      return `${CSI}${y2 + 1};${x2 + 1}H`;
    },
    move(x2, y2) {
      let ret = "";
      if (x2 < 0)
        ret += `${CSI}${-x2}D`;
      else if (x2 > 0)
        ret += `${CSI}${x2}C`;
      if (y2 < 0)
        ret += `${CSI}${-y2}A`;
      else if (y2 > 0)
        ret += `${CSI}${y2}B`;
      return ret;
    },
    up: (count = 1) => `${CSI}${count}A`,
    down: (count = 1) => `${CSI}${count}B`,
    forward: (count = 1) => `${CSI}${count}C`,
    backward: (count = 1) => `${CSI}${count}D`,
    nextLine: (count = 1) => `${CSI}E`.repeat(count),
    prevLine: (count = 1) => `${CSI}F`.repeat(count),
    left: `${CSI}G`,
    hide: `${CSI}?25l`,
    show: `${CSI}?25h`,
    save: `${ESC}7`,
    restore: `${ESC}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI}S`.repeat(count),
    down: (count = 1) => `${CSI}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI}2J`,
    up: (count = 1) => `${CSI}1J`.repeat(count),
    down: (count = 1) => `${CSI}J`.repeat(count),
    line: `${CSI}2K`,
    lineEnd: `${CSI}K`,
    lineStart: `${CSI}1K`,
    lines(count) {
      let clear = "";
      for (let i2 = 0;i2 < count; i2++)
        clear += this.line + (i2 < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/@clack/core/dist/index.mjs
import { styleText as D } from "node:util";
import { stdout as R2, stdin as q } from "node:process";
import * as k2 from "node:readline";
import ot from "node:readline";
import { ReadStream as J } from "node:tty";
function x2(t2, e2, s2) {
  if (!s2.some((u) => !u.disabled))
    return t2;
  const i2 = t2 + e2, r2 = Math.max(s2.length - 1, 0), n2 = i2 < 0 ? r2 : i2 > r2 ? 0 : i2;
  return s2[n2].disabled ? x2(n2, e2 < 0 ? -1 : 1, s2) : n2;
}
function K2(t2, e2, s2) {
  return String(t2).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i2) => Et(i2, e2, s2)).join(`
`);
}
function H(t2, e2) {
  if (typeof t2 == "string")
    return _2.aliases.get(t2) === e2;
  for (const s2 of t2)
    if (s2 !== undefined && H(s2, e2))
      return true;
  return false;
}
function _t(t2, e2) {
  if (t2 === e2)
    return;
  const s2 = t2.split(`
`), i2 = e2.split(`
`), r2 = Math.max(s2.length, i2.length), n2 = [];
  for (let u = 0;u < r2; u++)
    s2[u] !== i2[u] && n2.push(u);
  return { lines: n2, numLinesBefore: s2.length, numLinesAfter: i2.length, numLines: r2 };
}
function Ct(t2) {
  return t2 === z;
}
function W2(t2, e2) {
  const s2 = t2;
  s2.isTTY && s2.setRawMode(e2);
}
function xt({ input: t2 = q, output: e2 = R2, overwrite: s2 = true, hideCursor: i2 = true } = {}) {
  const r2 = k2.createInterface({ input: t2, output: e2, prompt: "", tabSize: 1 });
  k2.emitKeypressEvents(t2, r2), t2 instanceof J && t2.isTTY && t2.setRawMode(true);
  const n2 = (u, { name: a2, sequence: l }) => {
    const E = String(u);
    if (H([E, a2, l], "cancel")) {
      i2 && e2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!s2)
      return;
    const g = a2 === "return" ? 0 : -1, m = a2 === "return" ? -1 : 0;
    k2.moveCursor(e2, g, m, () => {
      k2.clearLine(e2, 1, () => {
        t2.once("keypress", n2);
      });
    });
  };
  return i2 && e2.write(import_sisteransi.cursor.hide), t2.once("keypress", n2), () => {
    t2.off("keypress", n2), i2 && e2.write(import_sisteransi.cursor.show), t2 instanceof J && t2.isTTY && !bt && t2.setRawMode(false), r2.terminal = false, r2.close();
  };
}
function Bt(t2, e2, s2, i2 = s2) {
  const r2 = rt(t2 ?? R2);
  return K2(e2, r2 - s2.length, { hard: true, trim: false }).split(`
`).map((n2, u) => `${u === 0 ? i2 : s2}${n2}`).join(`
`);
}

class B2 {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = new Map;
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(e2, s2 = true) {
    const { input: i2 = q, output: r2 = R2, render: n2, signal: u, ...a2 } = e2;
    this.opts = a2, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = n2.bind(this), this._track = s2, this._abortSignal = u, this.input = i2, this.output = r2;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(e2, s2) {
    const i2 = this._subscribers.get(e2) ?? [];
    i2.push(s2), this._subscribers.set(e2, i2);
  }
  on(e2, s2) {
    this.setSubscriber(e2, { cb: s2 });
  }
  once(e2, s2) {
    this.setSubscriber(e2, { cb: s2, once: true });
  }
  emit(e2, ...s2) {
    const i2 = this._subscribers.get(e2) ?? [], r2 = [];
    for (const n2 of i2)
      n2.cb(...s2), n2.once && r2.push(() => i2.splice(i2.indexOf(n2), 1));
    for (const n2 of r2)
      n2();
  }
  prompt() {
    return new Promise((e2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), e2(z);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = ot.createInterface({ input: this.input, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), this.rl.prompt(), this.opts.initialUserInput !== undefined && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), W2(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), W2(this.input, false), e2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), W2(this.input, false), e2(z);
      });
    });
  }
  _isActionKey(e2, s2) {
    return e2 === "\t";
  }
  _setValue(e2) {
    this.value = e2, this.emit("value", this.value);
  }
  _setUserInput(e2, s2) {
    this.userInput = e2 ?? "", this.emit("userInput", this.userInput), s2 && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(e2, s2) {
    if (this._track && s2.name !== "return" && (s2.name && this._isActionKey(e2, s2) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), s2?.name && (!this._track && _2.aliases.has(s2.name) && this.emit("cursor", _2.aliases.get(s2.name)), _2.actions.has(s2.name) && this.emit("cursor", s2.name)), e2 && (e2.toLowerCase() === "y" || e2.toLowerCase() === "n") && this.emit("confirm", e2.toLowerCase() === "y"), this.emit("key", e2?.toLowerCase(), s2), s2?.name === "return") {
      if (this.opts.validate) {
        const i2 = this.opts.validate(this.value);
        i2 && (this.error = i2 instanceof Error ? i2.message : i2, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    H([e2, s2?.name, s2?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), W2(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const e2 = K2(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, e2 * -1));
  }
  render() {
    const e2 = K2(this._render(this) ?? "", process.stdout.columns, { hard: true, trim: false });
    if (e2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const s2 = _t(this._prevFrame, e2), i2 = nt(this.output);
        if (this.restoreCursor(), s2) {
          const r2 = Math.max(0, s2.numLinesAfter - i2), n2 = Math.max(0, s2.numLinesBefore - i2);
          let u = s2.lines.find((a2) => a2 >= r2);
          if (u === undefined) {
            this._prevFrame = e2;
            return;
          }
          if (s2.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, u - n2)), this.output.write(import_sisteransi.erase.lines(1));
            const a2 = e2.split(`
`);
            this.output.write(a2[u]), this._prevFrame = e2, this.output.write(import_sisteransi.cursor.move(0, a2.length - u - 1));
            return;
          } else if (s2.lines.length > 1) {
            if (r2 < n2)
              u = r2;
            else {
              const l = u - n2;
              l > 0 && this.output.write(import_sisteransi.cursor.move(0, l));
            }
            this.output.write(import_sisteransi.erase.down());
            const a2 = e2.split(`
`).slice(u);
            this.output.write(a2.join(`
`)), this._prevFrame = e2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(e2), this.state === "initial" && (this.state = "active"), this._prevFrame = e2;
    }
  }
}
function wt(t2, e2) {
  if (t2 === undefined || e2.length === 0)
    return 0;
  const s2 = e2.findIndex((i2) => i2.value === t2);
  return s2 !== -1 ? s2 : 0;
}
function Dt(t2, e2) {
  return (e2.label ?? String(e2.value)).toLowerCase().includes(t2.toLowerCase());
}
function St(t2, e2) {
  if (e2)
    return t2 ? e2 : e2[0];
}
var import_sisteransi, at = (t2) => t2 === 161 || t2 === 164 || t2 === 167 || t2 === 168 || t2 === 170 || t2 === 173 || t2 === 174 || t2 >= 176 && t2 <= 180 || t2 >= 182 && t2 <= 186 || t2 >= 188 && t2 <= 191 || t2 === 198 || t2 === 208 || t2 === 215 || t2 === 216 || t2 >= 222 && t2 <= 225 || t2 === 230 || t2 >= 232 && t2 <= 234 || t2 === 236 || t2 === 237 || t2 === 240 || t2 === 242 || t2 === 243 || t2 >= 247 && t2 <= 250 || t2 === 252 || t2 === 254 || t2 === 257 || t2 === 273 || t2 === 275 || t2 === 283 || t2 === 294 || t2 === 295 || t2 === 299 || t2 >= 305 && t2 <= 307 || t2 === 312 || t2 >= 319 && t2 <= 322 || t2 === 324 || t2 >= 328 && t2 <= 331 || t2 === 333 || t2 === 338 || t2 === 339 || t2 === 358 || t2 === 359 || t2 === 363 || t2 === 462 || t2 === 464 || t2 === 466 || t2 === 468 || t2 === 470 || t2 === 472 || t2 === 474 || t2 === 476 || t2 === 593 || t2 === 609 || t2 === 708 || t2 === 711 || t2 >= 713 && t2 <= 715 || t2 === 717 || t2 === 720 || t2 >= 728 && t2 <= 731 || t2 === 733 || t2 === 735 || t2 >= 768 && t2 <= 879 || t2 >= 913 && t2 <= 929 || t2 >= 931 && t2 <= 937 || t2 >= 945 && t2 <= 961 || t2 >= 963 && t2 <= 969 || t2 === 1025 || t2 >= 1040 && t2 <= 1103 || t2 === 1105 || t2 === 8208 || t2 >= 8211 && t2 <= 8214 || t2 === 8216 || t2 === 8217 || t2 === 8220 || t2 === 8221 || t2 >= 8224 && t2 <= 8226 || t2 >= 8228 && t2 <= 8231 || t2 === 8240 || t2 === 8242 || t2 === 8243 || t2 === 8245 || t2 === 8251 || t2 === 8254 || t2 === 8308 || t2 === 8319 || t2 >= 8321 && t2 <= 8324 || t2 === 8364 || t2 === 8451 || t2 === 8453 || t2 === 8457 || t2 === 8467 || t2 === 8470 || t2 === 8481 || t2 === 8482 || t2 === 8486 || t2 === 8491 || t2 === 8531 || t2 === 8532 || t2 >= 8539 && t2 <= 8542 || t2 >= 8544 && t2 <= 8555 || t2 >= 8560 && t2 <= 8569 || t2 === 8585 || t2 >= 8592 && t2 <= 8601 || t2 === 8632 || t2 === 8633 || t2 === 8658 || t2 === 8660 || t2 === 8679 || t2 === 8704 || t2 === 8706 || t2 === 8707 || t2 === 8711 || t2 === 8712 || t2 === 8715 || t2 === 8719 || t2 === 8721 || t2 === 8725 || t2 === 8730 || t2 >= 8733 && t2 <= 8736 || t2 === 8739 || t2 === 8741 || t2 >= 8743 && t2 <= 8748 || t2 === 8750 || t2 >= 8756 && t2 <= 8759 || t2 === 8764 || t2 === 8765 || t2 === 8776 || t2 === 8780 || t2 === 8786 || t2 === 8800 || t2 === 8801 || t2 >= 8804 && t2 <= 8807 || t2 === 8810 || t2 === 8811 || t2 === 8814 || t2 === 8815 || t2 === 8834 || t2 === 8835 || t2 === 8838 || t2 === 8839 || t2 === 8853 || t2 === 8857 || t2 === 8869 || t2 === 8895 || t2 === 8978 || t2 >= 9312 && t2 <= 9449 || t2 >= 9451 && t2 <= 9547 || t2 >= 9552 && t2 <= 9587 || t2 >= 9600 && t2 <= 9615 || t2 >= 9618 && t2 <= 9621 || t2 === 9632 || t2 === 9633 || t2 >= 9635 && t2 <= 9641 || t2 === 9650 || t2 === 9651 || t2 === 9654 || t2 === 9655 || t2 === 9660 || t2 === 9661 || t2 === 9664 || t2 === 9665 || t2 >= 9670 && t2 <= 9672 || t2 === 9675 || t2 >= 9678 && t2 <= 9681 || t2 >= 9698 && t2 <= 9701 || t2 === 9711 || t2 === 9733 || t2 === 9734 || t2 === 9737 || t2 === 9742 || t2 === 9743 || t2 === 9756 || t2 === 9758 || t2 === 9792 || t2 === 9794 || t2 === 9824 || t2 === 9825 || t2 >= 9827 && t2 <= 9829 || t2 >= 9831 && t2 <= 9834 || t2 === 9836 || t2 === 9837 || t2 === 9839 || t2 === 9886 || t2 === 9887 || t2 === 9919 || t2 >= 9926 && t2 <= 9933 || t2 >= 9935 && t2 <= 9939 || t2 >= 9941 && t2 <= 9953 || t2 === 9955 || t2 === 9960 || t2 === 9961 || t2 >= 9963 && t2 <= 9969 || t2 === 9972 || t2 >= 9974 && t2 <= 9977 || t2 === 9979 || t2 === 9980 || t2 === 9982 || t2 === 9983 || t2 === 10045 || t2 >= 10102 && t2 <= 10111 || t2 >= 11094 && t2 <= 11097 || t2 >= 12872 && t2 <= 12879 || t2 >= 57344 && t2 <= 63743 || t2 >= 65024 && t2 <= 65039 || t2 === 65533 || t2 >= 127232 && t2 <= 127242 || t2 >= 127248 && t2 <= 127277 || t2 >= 127280 && t2 <= 127337 || t2 >= 127344 && t2 <= 127373 || t2 === 127375 || t2 === 127376 || t2 >= 127387 && t2 <= 127404 || t2 >= 917760 && t2 <= 917999 || t2 >= 983040 && t2 <= 1048573 || t2 >= 1048576 && t2 <= 1114109, lt = (t2) => t2 === 12288 || t2 >= 65281 && t2 <= 65376 || t2 >= 65504 && t2 <= 65510, ht = (t2) => t2 >= 4352 && t2 <= 4447 || t2 === 8986 || t2 === 8987 || t2 === 9001 || t2 === 9002 || t2 >= 9193 && t2 <= 9196 || t2 === 9200 || t2 === 9203 || t2 === 9725 || t2 === 9726 || t2 === 9748 || t2 === 9749 || t2 >= 9800 && t2 <= 9811 || t2 === 9855 || t2 === 9875 || t2 === 9889 || t2 === 9898 || t2 === 9899 || t2 === 9917 || t2 === 9918 || t2 === 9924 || t2 === 9925 || t2 === 9934 || t2 === 9940 || t2 === 9962 || t2 === 9970 || t2 === 9971 || t2 === 9973 || t2 === 9978 || t2 === 9981 || t2 === 9989 || t2 === 9994 || t2 === 9995 || t2 === 10024 || t2 === 10060 || t2 === 10062 || t2 >= 10067 && t2 <= 10069 || t2 === 10071 || t2 >= 10133 && t2 <= 10135 || t2 === 10160 || t2 === 10175 || t2 === 11035 || t2 === 11036 || t2 === 11088 || t2 === 11093 || t2 >= 11904 && t2 <= 11929 || t2 >= 11931 && t2 <= 12019 || t2 >= 12032 && t2 <= 12245 || t2 >= 12272 && t2 <= 12287 || t2 >= 12289 && t2 <= 12350 || t2 >= 12353 && t2 <= 12438 || t2 >= 12441 && t2 <= 12543 || t2 >= 12549 && t2 <= 12591 || t2 >= 12593 && t2 <= 12686 || t2 >= 12688 && t2 <= 12771 || t2 >= 12783 && t2 <= 12830 || t2 >= 12832 && t2 <= 12871 || t2 >= 12880 && t2 <= 19903 || t2 >= 19968 && t2 <= 42124 || t2 >= 42128 && t2 <= 42182 || t2 >= 43360 && t2 <= 43388 || t2 >= 44032 && t2 <= 55203 || t2 >= 63744 && t2 <= 64255 || t2 >= 65040 && t2 <= 65049 || t2 >= 65072 && t2 <= 65106 || t2 >= 65108 && t2 <= 65126 || t2 >= 65128 && t2 <= 65131 || t2 >= 94176 && t2 <= 94180 || t2 === 94192 || t2 === 94193 || t2 >= 94208 && t2 <= 100343 || t2 >= 100352 && t2 <= 101589 || t2 >= 101632 && t2 <= 101640 || t2 >= 110576 && t2 <= 110579 || t2 >= 110581 && t2 <= 110587 || t2 === 110589 || t2 === 110590 || t2 >= 110592 && t2 <= 110882 || t2 === 110898 || t2 >= 110928 && t2 <= 110930 || t2 === 110933 || t2 >= 110948 && t2 <= 110951 || t2 >= 110960 && t2 <= 111355 || t2 === 126980 || t2 === 127183 || t2 === 127374 || t2 >= 127377 && t2 <= 127386 || t2 >= 127488 && t2 <= 127490 || t2 >= 127504 && t2 <= 127547 || t2 >= 127552 && t2 <= 127560 || t2 === 127568 || t2 === 127569 || t2 >= 127584 && t2 <= 127589 || t2 >= 127744 && t2 <= 127776 || t2 >= 127789 && t2 <= 127797 || t2 >= 127799 && t2 <= 127868 || t2 >= 127870 && t2 <= 127891 || t2 >= 127904 && t2 <= 127946 || t2 >= 127951 && t2 <= 127955 || t2 >= 127968 && t2 <= 127984 || t2 === 127988 || t2 >= 127992 && t2 <= 128062 || t2 === 128064 || t2 >= 128066 && t2 <= 128252 || t2 >= 128255 && t2 <= 128317 || t2 >= 128331 && t2 <= 128334 || t2 >= 128336 && t2 <= 128359 || t2 === 128378 || t2 === 128405 || t2 === 128406 || t2 === 128420 || t2 >= 128507 && t2 <= 128591 || t2 >= 128640 && t2 <= 128709 || t2 === 128716 || t2 >= 128720 && t2 <= 128722 || t2 >= 128725 && t2 <= 128727 || t2 >= 128732 && t2 <= 128735 || t2 === 128747 || t2 === 128748 || t2 >= 128756 && t2 <= 128764 || t2 >= 128992 && t2 <= 129003 || t2 === 129008 || t2 >= 129292 && t2 <= 129338 || t2 >= 129340 && t2 <= 129349 || t2 >= 129351 && t2 <= 129535 || t2 >= 129648 && t2 <= 129660 || t2 >= 129664 && t2 <= 129672 || t2 >= 129680 && t2 <= 129725 || t2 >= 129727 && t2 <= 129733 || t2 >= 129742 && t2 <= 129755 || t2 >= 129760 && t2 <= 129768 || t2 >= 129776 && t2 <= 129784 || t2 >= 131072 && t2 <= 196605 || t2 >= 196608 && t2 <= 262141, O2, y2, L2, P2, M2, ct, ft, X = (t2, e2 = {}, s2 = {}) => {
  const i2 = e2.limit ?? 1 / 0, r2 = e2.ellipsis ?? "", n2 = e2?.ellipsisWidth ?? (r2 ? X(r2, ft, s2).width : 0), u = s2.ansiWidth ?? 0, a2 = s2.controlWidth ?? 0, l = s2.tabWidth ?? 8, E = s2.ambiguousWidth ?? 1, g = s2.emojiWidth ?? 2, m = s2.fullWidthWidth ?? 2, A2 = s2.regularWidth ?? 1, V = s2.wideWidth ?? 2;
  let h2 = 0, o2 = 0, p2 = t2.length, v2 = 0, F2 = false, d2 = p2, b2 = Math.max(0, i2 - n2), C = 0, w2 = 0, c2 = 0, f = 0;
  t:
    for (;; ) {
      if (w2 > C || o2 >= p2 && o2 > h2) {
        const ut = t2.slice(C, w2) || t2.slice(h2, o2);
        v2 = 0;
        for (const Y of ut.replaceAll(ct, "")) {
          const $2 = Y.codePointAt(0) || 0;
          if (lt($2) ? f = m : ht($2) ? f = V : E !== A2 && at($2) ? f = E : f = A2, c2 + f > b2 && (d2 = Math.min(d2, Math.max(C, h2) + v2)), c2 + f > i2) {
            F2 = true;
            break t;
          }
          v2 += Y.length, c2 += f;
        }
        C = w2 = 0;
      }
      if (o2 >= p2)
        break;
      if (M2.lastIndex = o2, M2.test(t2)) {
        if (v2 = M2.lastIndex - o2, f = v2 * A2, c2 + f > b2 && (d2 = Math.min(d2, o2 + Math.floor((b2 - c2) / A2))), c2 + f > i2) {
          F2 = true;
          break;
        }
        c2 += f, C = h2, w2 = o2, o2 = h2 = M2.lastIndex;
        continue;
      }
      if (O2.lastIndex = o2, O2.test(t2)) {
        if (c2 + u > b2 && (d2 = Math.min(d2, o2)), c2 + u > i2) {
          F2 = true;
          break;
        }
        c2 += u, C = h2, w2 = o2, o2 = h2 = O2.lastIndex;
        continue;
      }
      if (y2.lastIndex = o2, y2.test(t2)) {
        if (v2 = y2.lastIndex - o2, f = v2 * a2, c2 + f > b2 && (d2 = Math.min(d2, o2 + Math.floor((b2 - c2) / a2))), c2 + f > i2) {
          F2 = true;
          break;
        }
        c2 += f, C = h2, w2 = o2, o2 = h2 = y2.lastIndex;
        continue;
      }
      if (L2.lastIndex = o2, L2.test(t2)) {
        if (v2 = L2.lastIndex - o2, f = v2 * l, c2 + f > b2 && (d2 = Math.min(d2, o2 + Math.floor((b2 - c2) / l))), c2 + f > i2) {
          F2 = true;
          break;
        }
        c2 += f, C = h2, w2 = o2, o2 = h2 = L2.lastIndex;
        continue;
      }
      if (P2.lastIndex = o2, P2.test(t2)) {
        if (c2 + g > b2 && (d2 = Math.min(d2, o2)), c2 + g > i2) {
          F2 = true;
          break;
        }
        c2 += g, C = h2, w2 = o2, o2 = h2 = P2.lastIndex;
        continue;
      }
      o2 += 1;
    }
  return { width: F2 ? b2 : c2, index: F2 ? d2 : p2, truncated: F2, ellipsed: F2 && i2 >= n2 };
}, pt, S2 = (t2, e2 = {}) => X(t2, pt, e2).width, T2 = "\x1B", Z = "", Ft = 39, j2 = "\x07", Q = "[", dt = "]", tt = "m", U, et, mt = (t2) => {
  if (t2 >= 30 && t2 <= 37 || t2 >= 90 && t2 <= 97)
    return 39;
  if (t2 >= 40 && t2 <= 47 || t2 >= 100 && t2 <= 107)
    return 49;
  if (t2 === 1 || t2 === 2)
    return 22;
  if (t2 === 3)
    return 23;
  if (t2 === 4)
    return 24;
  if (t2 === 7)
    return 27;
  if (t2 === 8)
    return 28;
  if (t2 === 9)
    return 29;
  if (t2 === 0)
    return 0;
}, st = (t2) => `${T2}${Q}${t2}${tt}`, it = (t2) => `${T2}${U}${t2}${j2}`, gt = (t2) => t2.map((e2) => S2(e2)), G = (t2, e2, s2) => {
  const i2 = e2[Symbol.iterator]();
  let r2 = false, n2 = false, u = t2.at(-1), a2 = u === undefined ? 0 : S2(u), l = i2.next(), E = i2.next(), g = 0;
  for (;!l.done; ) {
    const m = l.value, A2 = S2(m);
    a2 + A2 <= s2 ? t2[t2.length - 1] += m : (t2.push(m), a2 = 0), (m === T2 || m === Z) && (r2 = true, n2 = e2.startsWith(U, g + 1)), r2 ? n2 ? m === j2 && (r2 = false, n2 = false) : m === tt && (r2 = false) : (a2 += A2, a2 === s2 && !E.done && (t2.push(""), a2 = 0)), l = E, E = i2.next(), g += m.length;
  }
  u = t2.at(-1), !a2 && u !== undefined && u.length > 0 && t2.length > 1 && (t2[t2.length - 2] += t2.pop());
}, vt = (t2) => {
  const e2 = t2.split(" ");
  let s2 = e2.length;
  for (;s2 > 0 && !(S2(e2[s2 - 1]) > 0); )
    s2--;
  return s2 === e2.length ? t2 : e2.slice(0, s2).join(" ") + e2.slice(s2).join("");
}, Et = (t2, e2, s2 = {}) => {
  if (s2.trim !== false && t2.trim() === "")
    return "";
  let i2 = "", r2, n2;
  const u = t2.split(" "), a2 = gt(u);
  let l = [""];
  for (const [h2, o2] of u.entries()) {
    s2.trim !== false && (l[l.length - 1] = (l.at(-1) ?? "").trimStart());
    let p2 = S2(l.at(-1) ?? "");
    if (h2 !== 0 && (p2 >= e2 && (s2.wordWrap === false || s2.trim === false) && (l.push(""), p2 = 0), (p2 > 0 || s2.trim === false) && (l[l.length - 1] += " ", p2++)), s2.hard && a2[h2] > e2) {
      const v2 = e2 - p2, F2 = 1 + Math.floor((a2[h2] - v2 - 1) / e2);
      Math.floor((a2[h2] - 1) / e2) < F2 && l.push(""), G(l, o2, e2);
      continue;
    }
    if (p2 + a2[h2] > e2 && p2 > 0 && a2[h2] > 0) {
      if (s2.wordWrap === false && p2 < e2) {
        G(l, o2, e2);
        continue;
      }
      l.push("");
    }
    if (p2 + a2[h2] > e2 && s2.wordWrap === false) {
      G(l, o2, e2);
      continue;
    }
    l[l.length - 1] += o2;
  }
  s2.trim !== false && (l = l.map((h2) => vt(h2)));
  const E = l.join(`
`), g = E[Symbol.iterator]();
  let m = g.next(), A2 = g.next(), V = 0;
  for (;!m.done; ) {
    const h2 = m.value, o2 = A2.value;
    if (i2 += h2, h2 === T2 || h2 === Z) {
      et.lastIndex = V + 1;
      const F2 = et.exec(E)?.groups;
      if (F2?.code !== undefined) {
        const d2 = Number.parseFloat(F2.code);
        r2 = d2 === Ft ? undefined : d2;
      } else
        F2?.uri !== undefined && (n2 = F2.uri.length === 0 ? undefined : F2.uri);
    }
    const p2 = r2 ? mt(r2) : undefined;
    o2 === `
` ? (n2 && (i2 += it("")), r2 && p2 && (i2 += st(p2))) : h2 === `
` && (r2 && p2 && (i2 += st(r2)), n2 && (i2 += it(n2))), V += h2.length, m = A2, A2 = g.next();
  }
  return i2;
}, At, _2, bt, z, rt = (t2) => ("columns" in t2) && typeof t2.columns == "number" ? t2.columns : 80, nt = (t2) => ("rows" in t2) && typeof t2.rows == "number" ? t2.rows : 20, Vt, kt, yt, Lt, Tt;
var init_dist2 = __esm(() => {
  import_sisteransi = __toESM(require_src(), 1);
  O2 = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
  y2 = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
  L2 = /\t{1,1000}/y;
  P2 = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
  M2 = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
  ct = /\p{M}+/gu;
  ft = { limit: 1 / 0, ellipsis: "" };
  pt = { limit: 1 / 0, ellipsis: "", ellipsisWidth: 0 };
  U = `${dt}8;;`;
  et = new RegExp(`(?:\\${Q}(?<code>\\d+)m|\\${U}(?<uri>.*)${j2})`, "y");
  At = ["up", "down", "left", "right", "space", "enter", "cancel"];
  _2 = { actions: new Set(At), aliases: new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["\x03", "cancel"], ["escape", "cancel"]]), messages: { cancel: "Canceled", error: "Something went wrong" }, withGuide: true };
  bt = globalThis.process.platform.startsWith("win");
  z = Symbol("clack:cancel");
  Vt = class Vt extends B2 {
    filteredOptions;
    multiple;
    isNavigating = false;
    selectedValues = [];
    focusedValue;
    #t = 0;
    #s = "";
    #i;
    #e;
    get cursor() {
      return this.#t;
    }
    get userInputWithCursor() {
      if (!this.userInput)
        return D(["inverse", "hidden"], "_");
      if (this._cursor >= this.userInput.length)
        return `${this.userInput}█`;
      const e2 = this.userInput.slice(0, this._cursor), [s2, ...i2] = this.userInput.slice(this._cursor);
      return `${e2}${D("inverse", s2)}${i2.join("")}`;
    }
    get options() {
      return typeof this.#e == "function" ? this.#e() : this.#e;
    }
    constructor(e2) {
      super(e2), this.#e = e2.options;
      const s2 = this.options;
      this.filteredOptions = [...s2], this.multiple = e2.multiple === true, this.#i = e2.filter ?? Dt;
      let i2;
      if (e2.initialValue && Array.isArray(e2.initialValue) ? this.multiple ? i2 = e2.initialValue : i2 = e2.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i2 = [this.options[0].value]), i2)
        for (const r2 of i2) {
          const n2 = s2.findIndex((u) => u.value === r2);
          n2 !== -1 && (this.toggleSelected(r2), this.#t = n2);
        }
      this.focusedValue = this.options[this.#t]?.value, this.on("key", (r2, n2) => this.#r(r2, n2)), this.on("userInput", (r2) => this.#n(r2));
    }
    _isActionKey(e2, s2) {
      return e2 === "\t" || this.multiple && this.isNavigating && s2.name === "space" && e2 !== undefined && e2 !== "";
    }
    #r(e2, s2) {
      const i2 = s2.name === "up", r2 = s2.name === "down", n2 = s2.name === "return";
      i2 || r2 ? (this.#t = x2(this.#t, i2 ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#t]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = true) : n2 ? this.value = St(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== undefined && (s2.name === "tab" || this.isNavigating && s2.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = false : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = false);
    }
    deselectAll() {
      this.selectedValues = [];
    }
    toggleSelected(e2) {
      this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e2) ? this.selectedValues = this.selectedValues.filter((s2) => s2 !== e2) : this.selectedValues = [...this.selectedValues, e2] : this.selectedValues = [e2]);
    }
    #n(e2) {
      if (e2 !== this.#s) {
        this.#s = e2;
        const s2 = this.options;
        e2 ? this.filteredOptions = s2.filter((n2) => this.#i(e2, n2)) : this.filteredOptions = [...s2];
        const i2 = wt(this.focusedValue, this.filteredOptions);
        this.#t = x2(i2, 0, this.filteredOptions);
        const r2 = this.filteredOptions[this.#t];
        r2 && !r2.disabled ? this.focusedValue = r2.value : this.focusedValue = undefined, this.multiple || (this.focusedValue !== undefined ? this.toggleSelected(this.focusedValue) : this.deselectAll());
      }
    }
  };
  kt = class kt extends B2 {
    get cursor() {
      return this.value ? 0 : 1;
    }
    get _value() {
      return this.cursor === 0;
    }
    constructor(e2) {
      super(e2, false), this.value = !!e2.initialValue, this.on("userInput", () => {
        this.value = this._value;
      }), this.on("confirm", (s2) => {
        this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = s2, this.state = "submit", this.close();
      }), this.on("cursor", () => {
        this.value = !this.value;
      });
    }
  };
  yt = class yt extends B2 {
    options;
    cursor = 0;
    #t;
    getGroupItems(e2) {
      return this.options.filter((s2) => s2.group === e2);
    }
    isGroupSelected(e2) {
      const s2 = this.getGroupItems(e2), i2 = this.value;
      return i2 === undefined ? false : s2.every((r2) => i2.includes(r2.value));
    }
    toggleValue() {
      const e2 = this.options[this.cursor];
      if (this.value === undefined && (this.value = []), e2.group === true) {
        const s2 = e2.value, i2 = this.getGroupItems(s2);
        this.isGroupSelected(s2) ? this.value = this.value.filter((r2) => i2.findIndex((n2) => n2.value === r2) === -1) : this.value = [...this.value, ...i2.map((r2) => r2.value)], this.value = Array.from(new Set(this.value));
      } else {
        const s2 = this.value.includes(e2.value);
        this.value = s2 ? this.value.filter((i2) => i2 !== e2.value) : [...this.value, e2.value];
      }
    }
    constructor(e2) {
      super(e2, false);
      const { options: s2 } = e2;
      this.#t = e2.selectableGroups !== false, this.options = Object.entries(s2).flatMap(([i2, r2]) => [{ value: i2, group: true, label: i2 }, ...r2.map((n2) => ({ ...n2, group: i2 }))]), this.value = [...e2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: i2 }) => i2 === e2.cursorAt), this.#t ? 0 : 1), this.on("cursor", (i2) => {
        switch (i2) {
          case "left":
          case "up": {
            this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
            const r2 = this.options[this.cursor]?.group === true;
            !this.#t && r2 && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
            break;
          }
          case "down":
          case "right": {
            this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
            const r2 = this.options[this.cursor]?.group === true;
            !this.#t && r2 && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
            break;
          }
          case "space":
            this.toggleValue();
            break;
        }
      });
    }
  };
  Lt = class extends B2 {
    options;
    cursor = 0;
    get _value() {
      return this.options[this.cursor].value;
    }
    get _enabledOptions() {
      return this.options.filter((e2) => e2.disabled !== true);
    }
    toggleAll() {
      const e2 = this._enabledOptions, s2 = this.value !== undefined && this.value.length === e2.length;
      this.value = s2 ? [] : e2.map((i2) => i2.value);
    }
    toggleInvert() {
      const e2 = this.value;
      if (!e2)
        return;
      const s2 = this._enabledOptions.filter((i2) => !e2.includes(i2.value));
      this.value = s2.map((i2) => i2.value);
    }
    toggleValue() {
      this.value === undefined && (this.value = []);
      const e2 = this.value.includes(this._value);
      this.value = e2 ? this.value.filter((s2) => s2 !== this._value) : [...this.value, this._value];
    }
    constructor(e2) {
      super(e2, false), this.options = e2.options, this.value = [...e2.initialValues ?? []];
      const s2 = Math.max(this.options.findIndex(({ value: i2 }) => i2 === e2.cursorAt), 0);
      this.cursor = this.options[s2].disabled ? x2(s2, 1, this.options) : s2, this.on("key", (i2) => {
        i2 === "a" && this.toggleAll(), i2 === "i" && this.toggleInvert();
      }), this.on("cursor", (i2) => {
        switch (i2) {
          case "left":
          case "up":
            this.cursor = x2(this.cursor, -1, this.options);
            break;
          case "down":
          case "right":
            this.cursor = x2(this.cursor, 1, this.options);
            break;
          case "space":
            this.toggleValue();
            break;
        }
      });
    }
  };
  Tt = class Tt extends B2 {
    options;
    cursor = 0;
    get _selectedValue() {
      return this.options[this.cursor];
    }
    changeValue() {
      this.value = this._selectedValue.value;
    }
    constructor(e2) {
      super(e2, false), this.options = e2.options;
      const s2 = this.options.findIndex(({ value: r2 }) => r2 === e2.initialValue), i2 = s2 === -1 ? 0 : s2;
      this.cursor = this.options[i2].disabled ? x2(i2, 1, this.options) : i2, this.changeValue(), this.on("cursor", (r2) => {
        switch (r2) {
          case "left":
          case "up":
            this.cursor = x2(this.cursor, -1, this.options);
            break;
          case "down":
          case "right":
            this.cursor = x2(this.cursor, 1, this.options);
            break;
        }
        this.changeValue();
      });
    }
  };
});

// node_modules/@clack/prompts/dist/index.mjs
import { styleText as t2, stripVTControlCharacters as ue } from "node:util";
import N3 from "node:process";
function pt2() {
  return N3.platform !== "win32" ? N3.env.TERM !== "linux" : !!N3.env.CI || !!N3.env.WT_SESSION || !!N3.env.TERMINUS_SUBLIME || N3.env.ConEmuTask === "{cmd::Cmder}" || N3.env.TERM_PROGRAM === "Terminus-Sublime" || N3.env.TERM_PROGRAM === "vscode" || N3.env.TERM === "xterm-256color" || N3.env.TERM === "alacritty" || N3.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
function J2(e2, r2, s2) {
  return String(e2).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i2) => It2(i2, r2, s2)).join(`
`);
}
function qe(e2) {
  return e2.label ?? String(e2.value ?? "");
}
function Je(e2, r2) {
  if (!e2)
    return true;
  const s2 = (r2.label ?? String(r2.value ?? "")).toLowerCase(), i2 = (r2.hint ?? "").toLowerCase(), a2 = String(r2.value).toLowerCase(), o2 = e2.toLowerCase();
  return s2.includes(o2) || i2.includes(o2) || a2.includes(o2);
}
function Bt2(e2, r2) {
  const s2 = [];
  for (const i2 of r2)
    e2.includes(i2.value) && s2.push(i2);
  return s2;
}
var import_sisteransi2, ee, ce = () => process.env.CI === "true", I3 = (e2, r2) => ee ? e2 : r2, Re, $e, de, V, he, h2, x3, Oe, Pe, z2, H2, te, U2, q2, Ne, se, pe, We, me, ge, Ge, fe, Fe, ye, Ee, W3 = (e2) => {
  switch (e2) {
    case "initial":
    case "active":
      return t2("cyan", Re);
    case "cancel":
      return t2("red", $e);
    case "error":
      return t2("yellow", de);
    case "submit":
      return t2("green", V);
  }
}, ve = (e2) => {
  switch (e2) {
    case "initial":
    case "active":
      return t2("cyan", h2);
    case "cancel":
      return t2("red", h2);
    case "error":
      return t2("yellow", h2);
    case "submit":
      return t2("green", h2);
  }
}, mt2 = (e2) => e2 === 161 || e2 === 164 || e2 === 167 || e2 === 168 || e2 === 170 || e2 === 173 || e2 === 174 || e2 >= 176 && e2 <= 180 || e2 >= 182 && e2 <= 186 || e2 >= 188 && e2 <= 191 || e2 === 198 || e2 === 208 || e2 === 215 || e2 === 216 || e2 >= 222 && e2 <= 225 || e2 === 230 || e2 >= 232 && e2 <= 234 || e2 === 236 || e2 === 237 || e2 === 240 || e2 === 242 || e2 === 243 || e2 >= 247 && e2 <= 250 || e2 === 252 || e2 === 254 || e2 === 257 || e2 === 273 || e2 === 275 || e2 === 283 || e2 === 294 || e2 === 295 || e2 === 299 || e2 >= 305 && e2 <= 307 || e2 === 312 || e2 >= 319 && e2 <= 322 || e2 === 324 || e2 >= 328 && e2 <= 331 || e2 === 333 || e2 === 338 || e2 === 339 || e2 === 358 || e2 === 359 || e2 === 363 || e2 === 462 || e2 === 464 || e2 === 466 || e2 === 468 || e2 === 470 || e2 === 472 || e2 === 474 || e2 === 476 || e2 === 593 || e2 === 609 || e2 === 708 || e2 === 711 || e2 >= 713 && e2 <= 715 || e2 === 717 || e2 === 720 || e2 >= 728 && e2 <= 731 || e2 === 733 || e2 === 735 || e2 >= 768 && e2 <= 879 || e2 >= 913 && e2 <= 929 || e2 >= 931 && e2 <= 937 || e2 >= 945 && e2 <= 961 || e2 >= 963 && e2 <= 969 || e2 === 1025 || e2 >= 1040 && e2 <= 1103 || e2 === 1105 || e2 === 8208 || e2 >= 8211 && e2 <= 8214 || e2 === 8216 || e2 === 8217 || e2 === 8220 || e2 === 8221 || e2 >= 8224 && e2 <= 8226 || e2 >= 8228 && e2 <= 8231 || e2 === 8240 || e2 === 8242 || e2 === 8243 || e2 === 8245 || e2 === 8251 || e2 === 8254 || e2 === 8308 || e2 === 8319 || e2 >= 8321 && e2 <= 8324 || e2 === 8364 || e2 === 8451 || e2 === 8453 || e2 === 8457 || e2 === 8467 || e2 === 8470 || e2 === 8481 || e2 === 8482 || e2 === 8486 || e2 === 8491 || e2 === 8531 || e2 === 8532 || e2 >= 8539 && e2 <= 8542 || e2 >= 8544 && e2 <= 8555 || e2 >= 8560 && e2 <= 8569 || e2 === 8585 || e2 >= 8592 && e2 <= 8601 || e2 === 8632 || e2 === 8633 || e2 === 8658 || e2 === 8660 || e2 === 8679 || e2 === 8704 || e2 === 8706 || e2 === 8707 || e2 === 8711 || e2 === 8712 || e2 === 8715 || e2 === 8719 || e2 === 8721 || e2 === 8725 || e2 === 8730 || e2 >= 8733 && e2 <= 8736 || e2 === 8739 || e2 === 8741 || e2 >= 8743 && e2 <= 8748 || e2 === 8750 || e2 >= 8756 && e2 <= 8759 || e2 === 8764 || e2 === 8765 || e2 === 8776 || e2 === 8780 || e2 === 8786 || e2 === 8800 || e2 === 8801 || e2 >= 8804 && e2 <= 8807 || e2 === 8810 || e2 === 8811 || e2 === 8814 || e2 === 8815 || e2 === 8834 || e2 === 8835 || e2 === 8838 || e2 === 8839 || e2 === 8853 || e2 === 8857 || e2 === 8869 || e2 === 8895 || e2 === 8978 || e2 >= 9312 && e2 <= 9449 || e2 >= 9451 && e2 <= 9547 || e2 >= 9552 && e2 <= 9587 || e2 >= 9600 && e2 <= 9615 || e2 >= 9618 && e2 <= 9621 || e2 === 9632 || e2 === 9633 || e2 >= 9635 && e2 <= 9641 || e2 === 9650 || e2 === 9651 || e2 === 9654 || e2 === 9655 || e2 === 9660 || e2 === 9661 || e2 === 9664 || e2 === 9665 || e2 >= 9670 && e2 <= 9672 || e2 === 9675 || e2 >= 9678 && e2 <= 9681 || e2 >= 9698 && e2 <= 9701 || e2 === 9711 || e2 === 9733 || e2 === 9734 || e2 === 9737 || e2 === 9742 || e2 === 9743 || e2 === 9756 || e2 === 9758 || e2 === 9792 || e2 === 9794 || e2 === 9824 || e2 === 9825 || e2 >= 9827 && e2 <= 9829 || e2 >= 9831 && e2 <= 9834 || e2 === 9836 || e2 === 9837 || e2 === 9839 || e2 === 9886 || e2 === 9887 || e2 === 9919 || e2 >= 9926 && e2 <= 9933 || e2 >= 9935 && e2 <= 9939 || e2 >= 9941 && e2 <= 9953 || e2 === 9955 || e2 === 9960 || e2 === 9961 || e2 >= 9963 && e2 <= 9969 || e2 === 9972 || e2 >= 9974 && e2 <= 9977 || e2 === 9979 || e2 === 9980 || e2 === 9982 || e2 === 9983 || e2 === 10045 || e2 >= 10102 && e2 <= 10111 || e2 >= 11094 && e2 <= 11097 || e2 >= 12872 && e2 <= 12879 || e2 >= 57344 && e2 <= 63743 || e2 >= 65024 && e2 <= 65039 || e2 === 65533 || e2 >= 127232 && e2 <= 127242 || e2 >= 127248 && e2 <= 127277 || e2 >= 127280 && e2 <= 127337 || e2 >= 127344 && e2 <= 127373 || e2 === 127375 || e2 === 127376 || e2 >= 127387 && e2 <= 127404 || e2 >= 917760 && e2 <= 917999 || e2 >= 983040 && e2 <= 1048573 || e2 >= 1048576 && e2 <= 1114109, gt2 = (e2) => e2 === 12288 || e2 >= 65281 && e2 <= 65376 || e2 >= 65504 && e2 <= 65510, ft2 = (e2) => e2 >= 4352 && e2 <= 4447 || e2 === 8986 || e2 === 8987 || e2 === 9001 || e2 === 9002 || e2 >= 9193 && e2 <= 9196 || e2 === 9200 || e2 === 9203 || e2 === 9725 || e2 === 9726 || e2 === 9748 || e2 === 9749 || e2 >= 9800 && e2 <= 9811 || e2 === 9855 || e2 === 9875 || e2 === 9889 || e2 === 9898 || e2 === 9899 || e2 === 9917 || e2 === 9918 || e2 === 9924 || e2 === 9925 || e2 === 9934 || e2 === 9940 || e2 === 9962 || e2 === 9970 || e2 === 9971 || e2 === 9973 || e2 === 9978 || e2 === 9981 || e2 === 9989 || e2 === 9994 || e2 === 9995 || e2 === 10024 || e2 === 10060 || e2 === 10062 || e2 >= 10067 && e2 <= 10069 || e2 === 10071 || e2 >= 10133 && e2 <= 10135 || e2 === 10160 || e2 === 10175 || e2 === 11035 || e2 === 11036 || e2 === 11088 || e2 === 11093 || e2 >= 11904 && e2 <= 11929 || e2 >= 11931 && e2 <= 12019 || e2 >= 12032 && e2 <= 12245 || e2 >= 12272 && e2 <= 12287 || e2 >= 12289 && e2 <= 12350 || e2 >= 12353 && e2 <= 12438 || e2 >= 12441 && e2 <= 12543 || e2 >= 12549 && e2 <= 12591 || e2 >= 12593 && e2 <= 12686 || e2 >= 12688 && e2 <= 12771 || e2 >= 12783 && e2 <= 12830 || e2 >= 12832 && e2 <= 12871 || e2 >= 12880 && e2 <= 19903 || e2 >= 19968 && e2 <= 42124 || e2 >= 42128 && e2 <= 42182 || e2 >= 43360 && e2 <= 43388 || e2 >= 44032 && e2 <= 55203 || e2 >= 63744 && e2 <= 64255 || e2 >= 65040 && e2 <= 65049 || e2 >= 65072 && e2 <= 65106 || e2 >= 65108 && e2 <= 65126 || e2 >= 65128 && e2 <= 65131 || e2 >= 94176 && e2 <= 94180 || e2 === 94192 || e2 === 94193 || e2 >= 94208 && e2 <= 100343 || e2 >= 100352 && e2 <= 101589 || e2 >= 101632 && e2 <= 101640 || e2 >= 110576 && e2 <= 110579 || e2 >= 110581 && e2 <= 110587 || e2 === 110589 || e2 === 110590 || e2 >= 110592 && e2 <= 110882 || e2 === 110898 || e2 >= 110928 && e2 <= 110930 || e2 === 110933 || e2 >= 110948 && e2 <= 110951 || e2 >= 110960 && e2 <= 111355 || e2 === 126980 || e2 === 127183 || e2 === 127374 || e2 >= 127377 && e2 <= 127386 || e2 >= 127488 && e2 <= 127490 || e2 >= 127504 && e2 <= 127547 || e2 >= 127552 && e2 <= 127560 || e2 === 127568 || e2 === 127569 || e2 >= 127584 && e2 <= 127589 || e2 >= 127744 && e2 <= 127776 || e2 >= 127789 && e2 <= 127797 || e2 >= 127799 && e2 <= 127868 || e2 >= 127870 && e2 <= 127891 || e2 >= 127904 && e2 <= 127946 || e2 >= 127951 && e2 <= 127955 || e2 >= 127968 && e2 <= 127984 || e2 === 127988 || e2 >= 127992 && e2 <= 128062 || e2 === 128064 || e2 >= 128066 && e2 <= 128252 || e2 >= 128255 && e2 <= 128317 || e2 >= 128331 && e2 <= 128334 || e2 >= 128336 && e2 <= 128359 || e2 === 128378 || e2 === 128405 || e2 === 128406 || e2 === 128420 || e2 >= 128507 && e2 <= 128591 || e2 >= 128640 && e2 <= 128709 || e2 === 128716 || e2 >= 128720 && e2 <= 128722 || e2 >= 128725 && e2 <= 128727 || e2 >= 128732 && e2 <= 128735 || e2 === 128747 || e2 === 128748 || e2 >= 128756 && e2 <= 128764 || e2 >= 128992 && e2 <= 129003 || e2 === 129008 || e2 >= 129292 && e2 <= 129338 || e2 >= 129340 && e2 <= 129349 || e2 >= 129351 && e2 <= 129535 || e2 >= 129648 && e2 <= 129660 || e2 >= 129664 && e2 <= 129672 || e2 >= 129680 && e2 <= 129725 || e2 >= 129727 && e2 <= 129733 || e2 >= 129742 && e2 <= 129755 || e2 >= 129760 && e2 <= 129768 || e2 >= 129776 && e2 <= 129784 || e2 >= 131072 && e2 <= 196605 || e2 >= 196608 && e2 <= 262141, we, re, ie, Ae, ne, Ft2, yt2, Le = (e2, r2 = {}, s2 = {}) => {
  const i2 = r2.limit ?? 1 / 0, a2 = r2.ellipsis ?? "", o2 = r2?.ellipsisWidth ?? (a2 ? Le(a2, yt2, s2).width : 0), u = s2.ansiWidth ?? 0, l = s2.controlWidth ?? 0, n2 = s2.tabWidth ?? 8, c2 = s2.ambiguousWidth ?? 1, p2 = s2.emojiWidth ?? 2, f = s2.fullWidthWidth ?? 2, g = s2.regularWidth ?? 1, E = s2.wideWidth ?? 2;
  let $2 = 0, m = 0, d2 = e2.length, F2 = 0, y3 = false, v2 = d2, C = Math.max(0, i2 - o2), A2 = 0, b2 = 0, w2 = 0, S3 = 0;
  e:
    for (;; ) {
      if (b2 > A2 || m >= d2 && m > $2) {
        const T3 = e2.slice(A2, b2) || e2.slice($2, m);
        F2 = 0;
        for (const M3 of T3.replaceAll(Ft2, "")) {
          const O3 = M3.codePointAt(0) || 0;
          if (gt2(O3) ? S3 = f : ft2(O3) ? S3 = E : c2 !== g && mt2(O3) ? S3 = c2 : S3 = g, w2 + S3 > C && (v2 = Math.min(v2, Math.max(A2, $2) + F2)), w2 + S3 > i2) {
            y3 = true;
            break e;
          }
          F2 += M3.length, w2 += S3;
        }
        A2 = b2 = 0;
      }
      if (m >= d2)
        break;
      if (ne.lastIndex = m, ne.test(e2)) {
        if (F2 = ne.lastIndex - m, S3 = F2 * g, w2 + S3 > C && (v2 = Math.min(v2, m + Math.floor((C - w2) / g))), w2 + S3 > i2) {
          y3 = true;
          break;
        }
        w2 += S3, A2 = $2, b2 = m, m = $2 = ne.lastIndex;
        continue;
      }
      if (we.lastIndex = m, we.test(e2)) {
        if (w2 + u > C && (v2 = Math.min(v2, m)), w2 + u > i2) {
          y3 = true;
          break;
        }
        w2 += u, A2 = $2, b2 = m, m = $2 = we.lastIndex;
        continue;
      }
      if (re.lastIndex = m, re.test(e2)) {
        if (F2 = re.lastIndex - m, S3 = F2 * l, w2 + S3 > C && (v2 = Math.min(v2, m + Math.floor((C - w2) / l))), w2 + S3 > i2) {
          y3 = true;
          break;
        }
        w2 += S3, A2 = $2, b2 = m, m = $2 = re.lastIndex;
        continue;
      }
      if (ie.lastIndex = m, ie.test(e2)) {
        if (F2 = ie.lastIndex - m, S3 = F2 * n2, w2 + S3 > C && (v2 = Math.min(v2, m + Math.floor((C - w2) / n2))), w2 + S3 > i2) {
          y3 = true;
          break;
        }
        w2 += S3, A2 = $2, b2 = m, m = $2 = ie.lastIndex;
        continue;
      }
      if (Ae.lastIndex = m, Ae.test(e2)) {
        if (w2 + p2 > C && (v2 = Math.min(v2, m)), w2 + p2 > i2) {
          y3 = true;
          break;
        }
        w2 += p2, A2 = $2, b2 = m, m = $2 = Ae.lastIndex;
        continue;
      }
      m += 1;
    }
  return { width: y3 ? C : w2, index: y3 ? v2 : d2, truncated: y3, ellipsed: y3 && i2 >= o2 };
}, Et2, D2 = (e2, r2 = {}) => Le(e2, Et2, r2).width, ae = "\x1B", je = "", vt2 = 39, Ce = "\x07", ke = "[", wt2 = "]", Ve = "m", Se, He, At2 = (e2) => {
  if (e2 >= 30 && e2 <= 37 || e2 >= 90 && e2 <= 97)
    return 39;
  if (e2 >= 40 && e2 <= 47 || e2 >= 100 && e2 <= 107)
    return 49;
  if (e2 === 1 || e2 === 2)
    return 22;
  if (e2 === 3)
    return 23;
  if (e2 === 4)
    return 24;
  if (e2 === 7)
    return 27;
  if (e2 === 8)
    return 28;
  if (e2 === 9)
    return 29;
  if (e2 === 0)
    return 0;
}, Ue = (e2) => `${ae}${ke}${e2}${Ve}`, Ke = (e2) => `${ae}${Se}${e2}${Ce}`, Ct2 = (e2) => e2.map((r2) => D2(r2)), Ie = (e2, r2, s2) => {
  const i2 = r2[Symbol.iterator]();
  let a2 = false, o2 = false, u = e2.at(-1), l = u === undefined ? 0 : D2(u), n2 = i2.next(), c2 = i2.next(), p2 = 0;
  for (;!n2.done; ) {
    const f = n2.value, g = D2(f);
    l + g <= s2 ? e2[e2.length - 1] += f : (e2.push(f), l = 0), (f === ae || f === je) && (a2 = true, o2 = r2.startsWith(Se, p2 + 1)), a2 ? o2 ? f === Ce && (a2 = false, o2 = false) : f === Ve && (a2 = false) : (l += g, l === s2 && !c2.done && (e2.push(""), l = 0)), n2 = c2, c2 = i2.next(), p2 += f.length;
  }
  u = e2.at(-1), !l && u !== undefined && u.length > 0 && e2.length > 1 && (e2[e2.length - 2] += e2.pop());
}, St2 = (e2) => {
  const r2 = e2.split(" ");
  let s2 = r2.length;
  for (;s2 > 0 && !(D2(r2[s2 - 1]) > 0); )
    s2--;
  return s2 === r2.length ? e2 : r2.slice(0, s2).join(" ") + r2.slice(s2).join("");
}, It2 = (e2, r2, s2 = {}) => {
  if (s2.trim !== false && e2.trim() === "")
    return "";
  let i2 = "", a2, o2;
  const u = e2.split(" "), l = Ct2(u);
  let n2 = [""];
  for (const [$2, m] of u.entries()) {
    s2.trim !== false && (n2[n2.length - 1] = (n2.at(-1) ?? "").trimStart());
    let d2 = D2(n2.at(-1) ?? "");
    if ($2 !== 0 && (d2 >= r2 && (s2.wordWrap === false || s2.trim === false) && (n2.push(""), d2 = 0), (d2 > 0 || s2.trim === false) && (n2[n2.length - 1] += " ", d2++)), s2.hard && l[$2] > r2) {
      const F2 = r2 - d2, y3 = 1 + Math.floor((l[$2] - F2 - 1) / r2);
      Math.floor((l[$2] - 1) / r2) < y3 && n2.push(""), Ie(n2, m, r2);
      continue;
    }
    if (d2 + l[$2] > r2 && d2 > 0 && l[$2] > 0) {
      if (s2.wordWrap === false && d2 < r2) {
        Ie(n2, m, r2);
        continue;
      }
      n2.push("");
    }
    if (d2 + l[$2] > r2 && s2.wordWrap === false) {
      Ie(n2, m, r2);
      continue;
    }
    n2[n2.length - 1] += m;
  }
  s2.trim !== false && (n2 = n2.map(($2) => St2($2)));
  const c2 = n2.join(`
`), p2 = c2[Symbol.iterator]();
  let f = p2.next(), g = p2.next(), E = 0;
  for (;!f.done; ) {
    const $2 = f.value, m = g.value;
    if (i2 += $2, $2 === ae || $2 === je) {
      He.lastIndex = E + 1;
      const y3 = He.exec(c2)?.groups;
      if (y3?.code !== undefined) {
        const v2 = Number.parseFloat(y3.code);
        a2 = v2 === vt2 ? undefined : v2;
      } else
        y3?.uri !== undefined && (o2 = y3.uri.length === 0 ? undefined : y3.uri);
    }
    const d2 = a2 ? At2(a2) : undefined;
    m === `
` ? (o2 && (i2 += Ke("")), a2 && d2 && (i2 += Ue(d2))) : $2 === `
` && (a2 && d2 && (i2 += Ue(a2)), o2 && (i2 += Ke(o2))), E += $2.length, f = g, g = p2.next();
  }
  return i2;
}, bt2 = (e2, r2, s2, i2, a2) => {
  let o2 = r2, u = 0;
  for (let l = s2;l < i2; l++) {
    const n2 = e2[l];
    if (o2 = o2 - n2.length, u++, o2 <= a2)
      break;
  }
  return { lineCount: o2, removals: u };
}, X2 = ({ cursor: e2, options: r2, style: s2, output: i2 = process.stdout, maxItems: a2 = Number.POSITIVE_INFINITY, columnPadding: o2 = 0, rowPadding: u = 4 }) => {
  const l = rt(i2) - o2, n2 = nt(i2), c2 = t2("dim", "..."), p2 = Math.max(n2 - u, 0), f = Math.max(Math.min(a2, p2), 5);
  let g = 0;
  e2 >= f - 3 && (g = Math.max(Math.min(e2 - f + 3, r2.length - f), 0));
  let E = f < r2.length && g > 0, $2 = f < r2.length && g + f < r2.length;
  const m = Math.min(g + f, r2.length), d2 = [];
  let F2 = 0;
  E && F2++, $2 && F2++;
  const y3 = g + (E ? 1 : 0), v2 = m - ($2 ? 1 : 0);
  for (let A2 = y3;A2 < v2; A2++) {
    const b2 = J2(s2(r2[A2], A2 === e2), l, { hard: true, trim: false }).split(`
`);
    d2.push(b2), F2 += b2.length;
  }
  if (F2 > p2) {
    let A2 = 0, b2 = 0, w2 = F2;
    const S3 = e2 - y3, T3 = (M3, O3) => bt2(d2, w2, M3, O3, p2);
    E ? ({ lineCount: w2, removals: A2 } = T3(0, S3), w2 > p2 && ({ lineCount: w2, removals: b2 } = T3(S3 + 1, d2.length))) : ({ lineCount: w2, removals: b2 } = T3(S3 + 1, d2.length), w2 > p2 && ({ lineCount: w2, removals: A2 } = T3(0, S3))), A2 > 0 && (E = true, d2.splice(0, A2)), b2 > 0 && ($2 = true, d2.splice(d2.length - b2, b2));
  }
  const C = [];
  E && C.push(c2);
  for (const A2 of d2)
    for (const b2 of A2)
      C.push(b2);
  return $2 && C.push(c2), C;
}, Xe = (e2) => new Vt({ options: e2.options, initialValue: e2.initialValue ? [e2.initialValue] : undefined, initialUserInput: e2.initialUserInput, filter: e2.filter ?? ((r2, s2) => Je(r2, s2)), signal: e2.signal, input: e2.input, output: e2.output, validate: e2.validate, render() {
  const r2 = e2.withGuide ?? _2.withGuide, s2 = r2 ? [`${t2("gray", h2)}`, `${W3(this.state)}  ${e2.message}`] : [`${W3(this.state)}  ${e2.message}`], i2 = this.userInput, a2 = this.options, o2 = e2.placeholder, u = i2 === "" && o2 !== undefined, l = (n2, c2) => {
    const p2 = qe(n2), f = n2.hint && n2.value === this.focusedValue ? t2("dim", ` (${n2.hint})`) : "";
    switch (c2) {
      case "active":
        return `${t2("green", z2)} ${p2}${f}`;
      case "inactive":
        return `${t2("dim", H2)} ${t2("dim", p2)}`;
      case "disabled":
        return `${t2("gray", H2)} ${t2(["strikethrough", "gray"], p2)}`;
    }
  };
  switch (this.state) {
    case "submit": {
      const n2 = Bt2(this.selectedValues, a2), c2 = n2.length > 0 ? `  ${t2("dim", n2.map(qe).join(", "))}` : "", p2 = r2 ? t2("gray", h2) : "";
      return `${s2.join(`
`)}
${p2}${c2}`;
    }
    case "cancel": {
      const n2 = i2 ? `  ${t2(["strikethrough", "dim"], i2)}` : "", c2 = r2 ? t2("gray", h2) : "";
      return `${s2.join(`
`)}
${c2}${n2}`;
    }
    default: {
      const n2 = this.state === "error" ? "yellow" : "cyan", c2 = r2 ? `${t2(n2, h2)}  ` : "", p2 = r2 ? t2(n2, x3) : "";
      let f = "";
      if (this.isNavigating || u) {
        const y3 = u ? o2 : i2;
        f = y3 !== "" ? ` ${t2("dim", y3)}` : "";
      } else
        f = ` ${this.userInputWithCursor}`;
      const g = this.filteredOptions.length !== a2.length ? t2("dim", ` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? "" : "es"})`) : "", E = this.filteredOptions.length === 0 && i2 ? [`${c2}${t2("yellow", "No matches found")}`] : [], $2 = this.state === "error" ? [`${c2}${t2("yellow", this.error)}`] : [];
      r2 && s2.push(`${c2.trimEnd()}`), s2.push(`${c2}${t2("dim", "Search:")}${f}${g}`, ...E, ...$2);
      const m = [`${t2("dim", "↑/↓")} to select`, `${t2("dim", "Enter:")} confirm`, `${t2("dim", "Type:")} to search`], d2 = [`${c2}${m.join(" • ")}`, p2], F2 = this.filteredOptions.length === 0 ? [] : X2({ cursor: this.cursor, options: this.filteredOptions, columnPadding: r2 ? 3 : 0, rowPadding: s2.length + d2.length, style: (y3, v2) => l(y3, y3.disabled ? "disabled" : v2 ? "active" : "inactive"), maxItems: e2.maxItems, output: e2.output });
      return [...s2, ...F2.map((y3) => `${c2}${y3}`), ...d2].join(`
`);
    }
  }
} }).prompt(), Rt = (e2) => {
  const r2 = e2.active ?? "Yes", s2 = e2.inactive ?? "No";
  return new kt({ active: r2, inactive: s2, signal: e2.signal, input: e2.input, output: e2.output, initialValue: e2.initialValue ?? true, render() {
    const i2 = e2.withGuide ?? _2.withGuide, a2 = `${i2 ? `${t2("gray", h2)}
` : ""}${W3(this.state)}  ${e2.message}
`, o2 = this.value ? r2 : s2;
    switch (this.state) {
      case "submit": {
        const u = i2 ? `${t2("gray", h2)}  ` : "";
        return `${a2}${u}${t2("dim", o2)}`;
      }
      case "cancel": {
        const u = i2 ? `${t2("gray", h2)}  ` : "";
        return `${a2}${u}${t2(["strikethrough", "dim"], o2)}${i2 ? `
${t2("gray", h2)}` : ""}`;
      }
      default: {
        const u = i2 ? `${t2("cyan", h2)}  ` : "", l = i2 ? t2("cyan", x3) : "";
        return `${a2}${u}${this.value ? `${t2("green", z2)} ${r2}` : `${t2("dim", H2)} ${t2("dim", r2)}`}${e2.vertical ? i2 ? `
${t2("cyan", h2)}  ` : `
` : ` ${t2("dim", "/")} `}${this.value ? `${t2("dim", H2)} ${t2("dim", s2)}` : `${t2("green", z2)} ${s2}`}
${l}
`;
      }
    }
  } }).prompt();
}, R3, Wt2 = (e2 = "", r2) => {
  const s2 = r2?.output ?? process.stdout, i2 = r2?.withGuide ?? _2.withGuide ? `${t2("gray", he)}  ` : "";
  s2.write(`${i2}${e2}
`);
}, Gt = (e2 = "", r2) => {
  const s2 = r2?.output ?? process.stdout, i2 = r2?.withGuide ?? _2.withGuide ? `${t2("gray", h2)}
${t2("gray", x3)}  ` : "";
  s2.write(`${i2}${e2}

`);
}, Q2 = (e2, r2) => e2.split(`
`).map((s2) => r2(s2)).join(`
`), Lt2 = (e2) => {
  const r2 = (i2, a2) => {
    const o2 = i2.label ?? String(i2.value);
    return a2 === "disabled" ? `${t2("gray", q2)} ${Q2(o2, (u) => t2(["strikethrough", "gray"], u))}${i2.hint ? ` ${t2("dim", `(${i2.hint ?? "disabled"})`)}` : ""}` : a2 === "active" ? `${t2("cyan", te)} ${o2}${i2.hint ? ` ${t2("dim", `(${i2.hint})`)}` : ""}` : a2 === "selected" ? `${t2("green", U2)} ${Q2(o2, (u) => t2("dim", u))}${i2.hint ? ` ${t2("dim", `(${i2.hint})`)}` : ""}` : a2 === "cancelled" ? `${Q2(o2, (u) => t2(["strikethrough", "dim"], u))}` : a2 === "active-selected" ? `${t2("green", U2)} ${o2}${i2.hint ? ` ${t2("dim", `(${i2.hint})`)}` : ""}` : a2 === "submitted" ? `${Q2(o2, (u) => t2("dim", u))}` : `${t2("dim", q2)} ${Q2(o2, (u) => t2("dim", u))}`;
  }, s2 = e2.required ?? true;
  return new Lt({ options: e2.options, signal: e2.signal, input: e2.input, output: e2.output, initialValues: e2.initialValues, required: s2, cursorAt: e2.cursorAt, validate(i2) {
    if (s2 && (i2 === undefined || i2.length === 0))
      return `Please select at least one option.
${t2("reset", t2("dim", `Press ${t2(["gray", "bgWhite", "inverse"], " space ")} to select, ${t2("gray", t2("bgWhite", t2("inverse", " enter ")))} to submit`))}`;
  }, render() {
    const i2 = Bt(e2.output, e2.message, `${ve(this.state)}  `, `${W3(this.state)}  `), a2 = `${t2("gray", h2)}
${i2}
`, o2 = this.value ?? [], u = (l, n2) => {
      if (l.disabled)
        return r2(l, "disabled");
      const c2 = o2.includes(l.value);
      return n2 && c2 ? r2(l, "active-selected") : c2 ? r2(l, "selected") : r2(l, n2 ? "active" : "inactive");
    };
    switch (this.state) {
      case "submit": {
        const l = this.options.filter(({ value: c2 }) => o2.includes(c2)).map((c2) => r2(c2, "submitted")).join(t2("dim", ", ")) || t2("dim", "none"), n2 = Bt(e2.output, l, `${t2("gray", h2)}  `);
        return `${a2}${n2}`;
      }
      case "cancel": {
        const l = this.options.filter(({ value: c2 }) => o2.includes(c2)).map((c2) => r2(c2, "cancelled")).join(t2("dim", ", "));
        if (l.trim() === "")
          return `${a2}${t2("gray", h2)}`;
        const n2 = Bt(e2.output, l, `${t2("gray", h2)}  `);
        return `${a2}${n2}
${t2("gray", h2)}`;
      }
      case "error": {
        const l = `${t2("yellow", h2)}  `, n2 = this.error.split(`
`).map((f, g) => g === 0 ? `${t2("yellow", x3)}  ${t2("yellow", f)}` : `   ${f}`).join(`
`), c2 = a2.split(`
`).length, p2 = n2.split(`
`).length + 1;
        return `${a2}${l}${X2({ output: e2.output, options: this.options, cursor: this.cursor, maxItems: e2.maxItems, columnPadding: l.length, rowPadding: c2 + p2, style: u }).join(`
${l}`)}
${n2}
`;
      }
      default: {
        const l = `${t2("cyan", h2)}  `, n2 = a2.split(`
`).length;
        return `${a2}${l}${X2({ output: e2.output, options: this.options, cursor: this.cursor, maxItems: e2.maxItems, columnPadding: l.length, rowPadding: n2 + 2, style: u }).join(`
${l}`)}
${t2("cyan", x3)}
`;
      }
    }
  } }).prompt();
}, jt = (e2) => t2("dim", e2), kt2 = (e2, r2, s2) => {
  const i2 = { hard: true, trim: false }, a2 = J2(e2, r2, i2).split(`
`), o2 = a2.reduce((n2, c2) => Math.max(D2(c2), n2), 0), u = a2.map(s2).reduce((n2, c2) => Math.max(D2(c2), n2), 0), l = r2 - (u - o2);
  return J2(e2, l, i2);
}, Vt2 = (e2 = "", r2 = "", s2) => {
  const i2 = s2?.output ?? N3.stdout, a2 = s2?.withGuide ?? _2.withGuide, o2 = s2?.format ?? jt, u = ["", ...kt2(e2, rt(i2) - 6, o2).split(`
`).map(o2), ""], l = D2(r2), n2 = Math.max(u.reduce((g, E) => {
    const $2 = D2(E);
    return $2 > g ? $2 : g;
  }, 0), l) + 2, c2 = u.map((g) => `${t2("gray", h2)}  ${g}${" ".repeat(n2 - D2(g))}${t2("gray", h2)}`).join(`
`), p2 = a2 ? `${t2("gray", h2)}
` : "", f = a2 ? We : ge;
  i2.write(`${p2}${t2("green", V)}  ${t2("reset", r2)} ${t2("gray", se.repeat(Math.max(n2 - l - 1, 1)) + pe)}
${c2}
${t2("gray", f + se.repeat(n2 + 2) + me)}
`);
}, Kt = (e2) => t2("magenta", e2), be = ({ indicator: e2 = "dots", onCancel: r2, output: s2 = process.stdout, cancelMessage: i2, errorMessage: a2, frames: o2 = ee ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"], delay: u = ee ? 80 : 120, signal: l, ...n2 } = {}) => {
  const c2 = ce();
  let p2, f, g = false, E = false, $2 = "", m, d2 = performance.now();
  const F2 = rt(s2), y3 = n2?.styleFrame ?? Kt, v2 = (B3) => {
    const P3 = B3 > 1 ? a2 ?? _2.messages.error : i2 ?? _2.messages.cancel;
    E = B3 === 1, g && (k3(P3, B3), E && typeof r2 == "function" && r2());
  }, C = () => v2(2), A2 = () => v2(1), b2 = () => {
    process.on("uncaughtExceptionMonitor", C), process.on("unhandledRejection", C), process.on("SIGINT", A2), process.on("SIGTERM", A2), process.on("exit", v2), l && l.addEventListener("abort", A2);
  }, w2 = () => {
    process.removeListener("uncaughtExceptionMonitor", C), process.removeListener("unhandledRejection", C), process.removeListener("SIGINT", A2), process.removeListener("SIGTERM", A2), process.removeListener("exit", v2), l && l.removeEventListener("abort", A2);
  }, S3 = () => {
    if (m === undefined)
      return;
    c2 && s2.write(`
`);
    const B3 = J2(m, F2, { hard: true, trim: false }).split(`
`);
    B3.length > 1 && s2.write(import_sisteransi2.cursor.up(B3.length - 1)), s2.write(import_sisteransi2.cursor.to(0)), s2.write(import_sisteransi2.erase.down());
  }, T3 = (B3) => B3.replace(/\.+$/, ""), M3 = (B3) => {
    const P3 = (performance.now() - B3) / 1000, G2 = Math.floor(P3 / 60), L3 = Math.floor(P3 % 60);
    return G2 > 0 ? `[${G2}m ${L3}s]` : `[${L3}s]`;
  }, O3 = n2.withGuide ?? _2.withGuide, le = (B3 = "") => {
    g = true, p2 = xt({ output: s2 }), $2 = T3(B3), d2 = performance.now(), O3 && s2.write(`${t2("gray", h2)}
`);
    let P3 = 0, G2 = 0;
    b2(), f = setInterval(() => {
      if (c2 && $2 === m)
        return;
      S3(), m = $2;
      const L3 = y3(o2[P3]);
      let Z2;
      if (c2)
        Z2 = `${L3}  ${$2}...`;
      else if (e2 === "timer")
        Z2 = `${L3}  ${$2} ${M3(d2)}`;
      else {
        const et2 = ".".repeat(Math.floor(G2)).slice(0, 3);
        Z2 = `${L3}  ${$2}${et2}`;
      }
      const Ze = J2(Z2, F2, { hard: true, trim: false });
      s2.write(Ze), P3 = P3 + 1 < o2.length ? P3 + 1 : 0, G2 = G2 < 4 ? G2 + 0.125 : 0;
    }, u);
  }, k3 = (B3 = "", P3 = 0, G2 = false) => {
    if (!g)
      return;
    g = false, clearInterval(f), S3();
    const L3 = P3 === 0 ? t2("green", V) : P3 === 1 ? t2("red", $e) : t2("red", de);
    $2 = B3 ?? $2, G2 || (e2 === "timer" ? s2.write(`${L3}  ${$2} ${M3(d2)}
`) : s2.write(`${L3}  ${$2}
`)), w2(), p2();
  };
  return { start: le, stop: (B3 = "") => k3(B3, 0), message: (B3 = "") => {
    $2 = T3(B3 ?? $2);
  }, cancel: (B3 = "") => k3(B3, 1), error: (B3 = "") => k3(B3, 2), clear: () => k3("", 0, true), get isCancelled() {
    return E;
  } };
}, ze, oe = (e2, r2) => e2.includes(`
`) ? e2.split(`
`).map((s2) => r2(s2)).join(`
`) : r2(e2), Jt = (e2) => {
  const r2 = (s2, i2) => {
    const a2 = s2.label ?? String(s2.value);
    switch (i2) {
      case "disabled":
        return `${t2("gray", H2)} ${oe(a2, (o2) => t2("gray", o2))}${s2.hint ? ` ${t2("dim", `(${s2.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${oe(a2, (o2) => t2("dim", o2))}`;
      case "active":
        return `${t2("green", z2)} ${a2}${s2.hint ? ` ${t2("dim", `(${s2.hint})`)}` : ""}`;
      case "cancelled":
        return `${oe(a2, (o2) => t2(["strikethrough", "dim"], o2))}`;
      default:
        return `${t2("dim", H2)} ${oe(a2, (o2) => t2("dim", o2))}`;
    }
  };
  return new Tt({ options: e2.options, signal: e2.signal, input: e2.input, output: e2.output, initialValue: e2.initialValue, render() {
    const s2 = e2.withGuide ?? _2.withGuide, i2 = `${W3(this.state)}  `, a2 = `${ve(this.state)}  `, o2 = Bt(e2.output, e2.message, a2, i2), u = `${s2 ? `${t2("gray", h2)}
` : ""}${o2}
`;
    switch (this.state) {
      case "submit": {
        const l = s2 ? `${t2("gray", h2)}  ` : "", n2 = Bt(e2.output, r2(this.options[this.cursor], "selected"), l);
        return `${u}${n2}`;
      }
      case "cancel": {
        const l = s2 ? `${t2("gray", h2)}  ` : "", n2 = Bt(e2.output, r2(this.options[this.cursor], "cancelled"), l);
        return `${u}${n2}${s2 ? `
${t2("gray", h2)}` : ""}`;
      }
      default: {
        const l = s2 ? `${t2("cyan", h2)}  ` : "", n2 = s2 ? t2("cyan", x3) : "", c2 = u.split(`
`).length, p2 = s2 ? 2 : 1;
        return `${u}${l}${X2({ output: e2.output, cursor: this.cursor, options: this.options, maxItems: e2.maxItems, columnPadding: l.length, rowPadding: c2 + p2, style: (f, g) => r2(f, f.disabled ? "disabled" : g ? "active" : "inactive") }).join(`
${l}`)}
${n2}
`;
      }
    }
  } }).prompt();
}, Qe;
var init_dist3 = __esm(() => {
  init_dist2();
  init_dist2();
  import_sisteransi2 = __toESM(require_src(), 1);
  ee = pt2();
  Re = I3("◆", "*");
  $e = I3("■", "x");
  de = I3("▲", "x");
  V = I3("◇", "o");
  he = I3("┌", "T");
  h2 = I3("│", "|");
  x3 = I3("└", "—");
  Oe = I3("┐", "T");
  Pe = I3("┘", "—");
  z2 = I3("●", ">");
  H2 = I3("○", " ");
  te = I3("◻", "[•]");
  U2 = I3("◼", "[+]");
  q2 = I3("◻", "[ ]");
  Ne = I3("▪", "•");
  se = I3("─", "-");
  pe = I3("╮", "+");
  We = I3("├", "+");
  me = I3("╯", "+");
  ge = I3("╰", "+");
  Ge = I3("╭", "+");
  fe = I3("●", "•");
  Fe = I3("◆", "*");
  ye = I3("▲", "!");
  Ee = I3("■", "x");
  we = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
  re = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
  ie = /\t{1,1000}/y;
  Ae = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
  ne = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
  Ft2 = /\p{M}+/gu;
  yt2 = { limit: 1 / 0, ellipsis: "" };
  Et2 = { limit: 1 / 0, ellipsis: "", ellipsisWidth: 0 };
  Se = `${wt2}8;;`;
  He = new RegExp(`(?:\\${ke}(?<code>\\d+)m|\\${Se}(?<uri>.*)${Ce})`, "y");
  R3 = { message: (e2 = [], { symbol: r2 = t2("gray", h2), secondarySymbol: s2 = t2("gray", h2), output: i2 = process.stdout, spacing: a2 = 1, withGuide: o2 } = {}) => {
    const u = [], l = o2 ?? _2.withGuide, n2 = l ? s2 : "", c2 = l ? `${r2}  ` : "", p2 = l ? `${s2}  ` : "";
    for (let g = 0;g < a2; g++)
      u.push(n2);
    const f = Array.isArray(e2) ? e2 : e2.split(`
`);
    if (f.length > 0) {
      const [g, ...E] = f;
      g.length > 0 ? u.push(`${c2}${g}`) : u.push(l ? r2 : "");
      for (const $2 of E)
        $2.length > 0 ? u.push(`${p2}${$2}`) : u.push(l ? s2 : "");
    }
    i2.write(`${u.join(`
`)}
`);
  }, info: (e2, r2) => {
    R3.message(e2, { ...r2, symbol: t2("blue", fe) });
  }, success: (e2, r2) => {
    R3.message(e2, { ...r2, symbol: t2("green", Fe) });
  }, step: (e2, r2) => {
    R3.message(e2, { ...r2, symbol: t2("green", V) });
  }, warn: (e2, r2) => {
    R3.message(e2, { ...r2, symbol: t2("yellow", ye) });
  }, warning: (e2, r2) => {
    R3.warn(e2, r2);
  }, error: (e2, r2) => {
    R3.message(e2, { ...r2, symbol: t2("red", Ee) });
  } };
  ze = { light: I3("─", "-"), heavy: I3("━", "="), block: I3("█", "#") };
  Qe = `${t2("gray", h2)}  `;
});

// node_modules/zod/v4/core/core.js
function $constructor(name, initializer, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _3,
          traits: new Set
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    const proto = _3.prototype;
    const keys = Object.keys(proto);
    for (let i2 = 0;i2 < keys.length; i2++) {
      const k3 = keys[i2];
      if (!(k3 in inst)) {
        inst[k3] = proto[k3].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _3(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_3, "init", { value: init });
  Object.defineProperty(_3, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_3, "name", { value: name });
  return _3;
}
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
var NEVER, $brand, $ZodAsyncError, $ZodEncodeError, globalConfig;
var init_core = __esm(() => {
  NEVER = Object.freeze({
    status: "aborted"
  });
  $brand = Symbol("zod_brand");
  $ZodAsyncError = class $ZodAsyncError extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  };
  $ZodEncodeError = class $ZodEncodeError extends Error {
    constructor(name) {
      super(`Encountered unidirectional transform during encode: ${name}`);
      this.name = "ZodEncodeError";
    }
  };
  globalConfig = {};
});

// node_modules/zod/v4/core/util.js
var exports_util = {};
__export(exports_util, {
  unwrapMessage: () => unwrapMessage,
  uint8ArrayToHex: () => uint8ArrayToHex,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  stringifyPrimitive: () => stringifyPrimitive,
  slugify: () => slugify,
  shallowClone: () => shallowClone,
  safeExtend: () => safeExtend,
  required: () => required,
  randomString: () => randomString,
  propertyKeyTypes: () => propertyKeyTypes,
  promiseAllObject: () => promiseAllObject,
  primitiveTypes: () => primitiveTypes,
  prefixIssues: () => prefixIssues,
  pick: () => pick,
  partial: () => partial,
  parsedType: () => parsedType,
  optionalKeys: () => optionalKeys,
  omit: () => omit,
  objectClone: () => objectClone,
  numKeys: () => numKeys,
  nullish: () => nullish,
  normalizeParams: () => normalizeParams,
  mergeDefs: () => mergeDefs,
  merge: () => merge,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  joinValues: () => joinValues,
  issue: () => issue,
  isPlainObject: () => isPlainObject2,
  isObject: () => isObject,
  hexToUint8Array: () => hexToUint8Array,
  getSizableOrigin: () => getSizableOrigin,
  getParsedType: () => getParsedType,
  getLengthableOrigin: () => getLengthableOrigin,
  getEnumValues: () => getEnumValues,
  getElementAtPath: () => getElementAtPath,
  floatSafeRemainder: () => floatSafeRemainder,
  finalizeIssue: () => finalizeIssue,
  extend: () => extend,
  escapeRegex: () => escapeRegex,
  esc: () => esc,
  defineLazy: () => defineLazy,
  createTransparentProxy: () => createTransparentProxy,
  cloneDef: () => cloneDef,
  clone: () => clone,
  cleanRegex: () => cleanRegex,
  cleanEnum: () => cleanEnum,
  captureStackTrace: () => captureStackTrace,
  cached: () => cached,
  base64urlToUint8Array: () => base64urlToUint8Array,
  base64ToUint8Array: () => base64ToUint8Array,
  assignProp: () => assignProp,
  assertNotEqual: () => assertNotEqual,
  assertNever: () => assertNever,
  assertIs: () => assertIs,
  assertEqual: () => assertEqual,
  assert: () => assert,
  allowsEval: () => allowsEval,
  aborted: () => aborted,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  Class: () => Class,
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES
});
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function assertIs(_arg) {
}
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
function assert(_3) {
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v2) => typeof v2 === "number");
  const values2 = Object.entries(entries).filter(([k3, _3]) => numericValues.indexOf(+k3) === -1).map(([_3, v2]) => v2);
  return values2;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_3, value2) {
  if (typeof value2 === "bigint")
    return value2.toString();
  return value2;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value2 = getter();
        Object.defineProperty(this, "value", { value: value2 });
        return value2;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepString = step.toString();
  let stepDecCount = (stepString.split(".")[1] || "").length;
  if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
    const match = stepString.match(/\d?e-(\d?)/);
    if (match?.[1]) {
      stepDecCount = Number.parseInt(match[1]);
    }
  }
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function defineLazy(object2, key, getter) {
  let value2 = undefined;
  Object.defineProperty(object2, key, {
    get() {
      if (value2 === EVALUATING) {
        return;
      }
      if (value2 === undefined) {
        value2 = EVALUATING;
        value2 = getter();
      }
      return value2;
    },
    set(v2) {
      Object.defineProperty(object2, key, {
        value: v2
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value2) {
  Object.defineProperty(target, prop, {
    value: value2,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path3) {
  if (!path3)
    return obj;
  return path3.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i2 = 0;i2 < keys.length; i2++) {
      resolvedObj[keys[i2]] = results[i2];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i2 = 0;i2 < length; i2++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject2(o2) {
  if (isObject(o2) === false)
    return false;
  const ctor = o2.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o2) {
  if (isPlainObject2(o2))
    return { ...o2 };
  if (Array.isArray(o2))
    return [...o2];
  return o2;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_3, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_3, prop, value2, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value2, receiver);
    },
    has(_3, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_3, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_3) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_3, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_3, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value2) {
  if (typeof value2 === "bigint")
    return value2.toString() + "n";
  if (typeof value2 === "string")
    return `"${value2}"`;
  return `${value2}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k3) => {
    return shape[k3]._zod.optin === "optional" && shape[k3]._zod.optout === "optional";
  });
}
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject2(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject2(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function merge(a2, b2) {
  const def = mergeDefs(a2._zod.def, {
    get shape() {
      const _shape = { ...a2._zod.def.shape, ...b2._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b2._zod.def.catchall;
    },
    checks: []
  });
  return clone(a2, def);
}
function partial(Class, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
function aborted(x4, startIndex = 0) {
  if (x4.aborted === true)
    return true;
  for (let i2 = startIndex;i2 < x4.issues.length; i2++) {
    if (x4.issues[i2]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path3, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path3);
    return iss;
  });
}
function unwrapMessage(message2) {
  return typeof message2 === "string" ? message2 : message2?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const full = { ...iss, path: iss.path ?? [] };
  if (!iss.message) {
    const message2 = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
    full.message = message2;
  }
  delete full.inst;
  delete full.continue;
  if (!ctx?.reportInput) {
    delete full.input;
  }
  return full;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t3 = typeof data;
  switch (t3) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t3;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k3, _3]) => {
    return Number.isNaN(Number.parseInt(k3, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i2 = 0;i2 < binaryString.length; i2++) {
    bytes[i2] = binaryString.charCodeAt(i2);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i2 = 0;i2 < bytes.length; i2++) {
    binaryString += String.fromCharCode(bytes[i2]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  return base64ToUint8Array(base64 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i2 = 0;i2 < cleanHex.length; i2 += 2) {
    bytes[i2 / 2] = Number.parseInt(cleanHex.slice(i2, i2 + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b2) => b2.toString(16).padStart(2, "0")).join("");
}

class Class {
  constructor(..._args) {
  }
}
var EVALUATING, captureStackTrace, allowsEval, getParsedType = (data) => {
  const t3 = typeof data;
  switch (t3) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t3}`);
  }
}, propertyKeyTypes, primitiveTypes, NUMBER_FORMAT_RANGES, BIGINT_FORMAT_RANGES;
var init_util = __esm(() => {
  EVALUATING = Symbol("evaluating");
  captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
  };
  allowsEval = cached(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
      return false;
    }
    try {
      const F2 = Function;
      new F2("");
      return true;
    } catch (_3) {
      return false;
    }
  });
  propertyKeyTypes = new Set(["string", "number", "symbol"]);
  primitiveTypes = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
  NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
  };
  BIGINT_FORMAT_RANGES = {
    int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
  };
});

// node_modules/zod/v4/core/errors.js
function flattenError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error2) => {
    for (const issue2 of error2.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues });
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues });
      } else if (issue2.path.length === 0) {
        fieldErrors._errors.push(mapper(issue2));
      } else {
        let curr = fieldErrors;
        let i2 = 0;
        while (i2 < issue2.path.length) {
          const el = issue2.path[i2];
          const terminal = i2 === issue2.path.length - 1;
          if (!terminal) {
            curr[el] = curr[el] || { _errors: [] };
          } else {
            curr[el] = curr[el] || { _errors: [] };
            curr[el]._errors.push(mapper(issue2));
          }
          curr = curr[el];
          i2++;
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}
function treeifyError(error, mapper = (issue2) => issue2.message) {
  const result = { errors: [] };
  const processError = (error2, path3 = []) => {
    var _a, _b;
    for (const issue2 of error2.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, issue2.path));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, issue2.path);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, issue2.path);
      } else {
        const fullpath = [...path3, ...issue2.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue2));
          continue;
        }
        let curr = result;
        let i2 = 0;
        while (i2 < fullpath.length) {
          const el = fullpath[i2];
          const terminal = i2 === fullpath.length - 1;
          if (typeof el === "string") {
            curr.properties ?? (curr.properties = {});
            (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
            curr = curr.properties[el];
          } else {
            curr.items ?? (curr.items = []);
            (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
            curr = curr.items[el];
          }
          if (terminal) {
            curr.errors.push(mapper(issue2));
          }
          i2++;
        }
      }
    }
  };
  processError(error);
  return result;
}
function toDotPath(_path) {
  const segs = [];
  const path3 = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
  for (const seg of path3) {
    if (typeof seg === "number")
      segs.push(`[${seg}]`);
    else if (typeof seg === "symbol")
      segs.push(`[${JSON.stringify(String(seg))}]`);
    else if (/[^\w$]/.test(seg))
      segs.push(`[${JSON.stringify(seg)}]`);
    else {
      if (segs.length)
        segs.push(".");
      segs.push(seg);
    }
  }
  return segs.join("");
}
function prettifyError(error) {
  const lines = [];
  const issues = [...error.issues].sort((a2, b2) => (a2.path ?? []).length - (b2.path ?? []).length);
  for (const issue2 of issues) {
    lines.push(`✖ ${issue2.message}`);
    if (issue2.path?.length)
      lines.push(`  → at ${toDotPath(issue2.path)}`);
  }
  return lines.join(`
`);
}
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
}, $ZodError, $ZodRealError;
var init_errors = __esm(() => {
  init_core();
  init_util();
  $ZodError = $constructor("$ZodError", initializer);
  $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
});

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value2, _ctx, _params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
  const result = schema._zod.run({ value: value2, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e2 = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e2, _params?.callee);
    throw e2;
  }
  return result.value;
}, parse, _parseAsync = (_Err) => async (schema, value2, _ctx, params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value: value2, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e2 = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e2, params?.callee);
    throw e2;
  }
  return result.value;
}, parseAsync2, _safeParse = (_Err) => (schema, value2, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value: value2, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, safeParse, _safeParseAsync = (_Err) => async (schema, value2, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value: value2, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, safeParseAsync, _encode = (_Err) => (schema, value2, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parse(_Err)(schema, value2, ctx);
}, encode, _decode = (_Err) => (schema, value2, _ctx) => {
  return _parse(_Err)(schema, value2, _ctx);
}, decode, _encodeAsync = (_Err) => async (schema, value2, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parseAsync(_Err)(schema, value2, ctx);
}, encodeAsync, _decodeAsync = (_Err) => async (schema, value2, _ctx) => {
  return _parseAsync(_Err)(schema, value2, _ctx);
}, decodeAsync, _safeEncode = (_Err) => (schema, value2, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParse(_Err)(schema, value2, ctx);
}, safeEncode, _safeDecode = (_Err) => (schema, value2, _ctx) => {
  return _safeParse(_Err)(schema, value2, _ctx);
}, safeDecode, _safeEncodeAsync = (_Err) => async (schema, value2, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value2, ctx);
}, safeEncodeAsync, _safeDecodeAsync = (_Err) => async (schema, value2, _ctx) => {
  return _safeParseAsync(_Err)(schema, value2, _ctx);
}, safeDecodeAsync;
var init_parse = __esm(() => {
  init_core();
  init_errors();
  init_util();
  parse = /* @__PURE__ */ _parse($ZodRealError);
  parseAsync2 = /* @__PURE__ */ _parseAsync($ZodRealError);
  safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
  safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
  encode = /* @__PURE__ */ _encode($ZodRealError);
  decode = /* @__PURE__ */ _decode($ZodRealError);
  encodeAsync = /* @__PURE__ */ _encodeAsync($ZodRealError);
  decodeAsync = /* @__PURE__ */ _decodeAsync($ZodRealError);
  safeEncode = /* @__PURE__ */ _safeEncode($ZodRealError);
  safeDecode = /* @__PURE__ */ _safeDecode($ZodRealError);
  safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
  safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);
});

// node_modules/zod/v4/core/regexes.js
var exports_regexes = {};
__export(exports_regexes, {
  xid: () => xid,
  uuid7: () => uuid7,
  uuid6: () => uuid6,
  uuid4: () => uuid4,
  uuid: () => uuid,
  uppercase: () => uppercase,
  unicodeEmail: () => unicodeEmail,
  undefined: () => _undefined,
  ulid: () => ulid,
  time: () => time,
  string: () => string2,
  sha512_hex: () => sha512_hex,
  sha512_base64url: () => sha512_base64url,
  sha512_base64: () => sha512_base64,
  sha384_hex: () => sha384_hex,
  sha384_base64url: () => sha384_base64url,
  sha384_base64: () => sha384_base64,
  sha256_hex: () => sha256_hex,
  sha256_base64url: () => sha256_base64url,
  sha256_base64: () => sha256_base64,
  sha1_hex: () => sha1_hex,
  sha1_base64url: () => sha1_base64url,
  sha1_base64: () => sha1_base64,
  rfc5322Email: () => rfc5322Email,
  number: () => number,
  null: () => _null,
  nanoid: () => nanoid,
  md5_hex: () => md5_hex,
  md5_base64url: () => md5_base64url,
  md5_base64: () => md5_base64,
  mac: () => mac,
  lowercase: () => lowercase,
  ksuid: () => ksuid,
  ipv6: () => ipv6,
  ipv4: () => ipv4,
  integer: () => integer,
  idnEmail: () => idnEmail,
  html5Email: () => html5Email,
  hostname: () => hostname,
  hex: () => hex,
  guid: () => guid,
  extendedDuration: () => extendedDuration,
  emoji: () => emoji,
  email: () => email,
  e164: () => e164,
  duration: () => duration,
  domain: () => domain,
  datetime: () => datetime,
  date: () => date,
  cuid2: () => cuid2,
  cuid: () => cuid,
  cidrv6: () => cidrv6,
  cidrv4: () => cidrv4,
  browserEmail: () => browserEmail,
  boolean: () => boolean,
  bigint: () => bigint,
  base64url: () => base64url,
  base64: () => base64
});
function emoji() {
  return new RegExp(_emoji, "u");
}
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const time2 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time2}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
function fixedBase64(bodyLength, padding) {
  return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
function fixedBase64url(length) {
  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
var cuid, cuid2, ulid, xid, ksuid, nanoid, duration, extendedDuration, guid, uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
}, uuid4, uuid6, uuid7, email, html5Email, rfc5322Email, unicodeEmail, idnEmail, browserEmail, _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`, ipv4, ipv6, mac = (delimiter) => {
  const escapedDelim = escapeRegex(delimiter ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
}, cidrv4, cidrv6, base64, base64url, hostname, domain, e164, dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`, date, string2 = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
}, bigint, integer, number, boolean, _null, _undefined, lowercase, uppercase, hex, md5_hex, md5_base64, md5_base64url, sha1_hex, sha1_base64, sha1_base64url, sha256_hex, sha256_base64, sha256_base64url, sha384_hex, sha384_base64, sha384_base64url, sha512_hex, sha512_base64, sha512_base64url;
var init_regexes = __esm(() => {
  init_util();
  cuid = /^[cC][^\s-]{8,}$/;
  cuid2 = /^[0-9a-z]+$/;
  ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
  xid = /^[0-9a-vA-V]{20}$/;
  ksuid = /^[A-Za-z0-9]{27}$/;
  nanoid = /^[a-zA-Z0-9_-]{21}$/;
  duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
  extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
  uuid4 = /* @__PURE__ */ uuid(4);
  uuid6 = /* @__PURE__ */ uuid(6);
  uuid7 = /* @__PURE__ */ uuid(7);
  email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
  html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
  idnEmail = unicodeEmail;
  browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
  cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
  base64url = /^[A-Za-z0-9_-]*$/;
  hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
  domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  e164 = /^\+[1-9]\d{6,14}$/;
  date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
  bigint = /^-?\d+n?$/;
  integer = /^-?\d+$/;
  number = /^-?\d+(?:\.\d+)?$/;
  boolean = /^(?:true|false)$/i;
  _null = /^null$/i;
  _undefined = /^undefined$/i;
  lowercase = /^[^A-Z]*$/;
  uppercase = /^[^a-z]*$/;
  hex = /^[0-9a-fA-F]*$/;
  md5_hex = /^[0-9a-fA-F]{32}$/;
  md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
  md5_base64url = /* @__PURE__ */ fixedBase64url(22);
  sha1_hex = /^[0-9a-fA-F]{40}$/;
  sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
  sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
  sha256_hex = /^[0-9a-fA-F]{64}$/;
  sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
  sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
  sha384_hex = /^[0-9a-fA-F]{96}$/;
  sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
  sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
  sha512_hex = /^[0-9a-fA-F]{128}$/;
  sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
  sha512_base64url = /* @__PURE__ */ fixedBase64url(86);
});

// node_modules/zod/v4/core/checks.js
function handleCheckPropertyResult(result, payload, property) {
  if (result.issues.length) {
    payload.issues.push(...prefixIssues(property, result.issues));
  }
}
var $ZodCheck, numericOriginMap, $ZodCheckLessThan, $ZodCheckGreaterThan, $ZodCheckMultipleOf, $ZodCheckNumberFormat, $ZodCheckBigIntFormat, $ZodCheckMaxSize, $ZodCheckMinSize, $ZodCheckSizeEquals, $ZodCheckMaxLength, $ZodCheckMinLength, $ZodCheckLengthEquals, $ZodCheckStringFormat, $ZodCheckRegex, $ZodCheckLowerCase, $ZodCheckUpperCase, $ZodCheckIncludes, $ZodCheckStartsWith, $ZodCheckEndsWith, $ZodCheckProperty, $ZodCheckMimeType, $ZodCheckOverwrite;
var init_checks = __esm(() => {
  init_core();
  init_regexes();
  init_util();
  $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
  });
  numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date"
  };
  $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
      if (def.value < curr) {
        if (def.inclusive)
          bag.maximum = def.value;
        else
          bag.exclusiveMaximum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
      if (def.value > curr) {
        if (def.inclusive)
          bag.minimum = def.value;
        else
          bag.exclusiveMinimum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      var _a;
      (_a = inst2._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
      if (typeof payload.value !== typeof def.value)
        throw new Error("Cannot mix number and bigint in multiple_of check.");
      const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
      if (isMultiple)
        return;
      payload.issues.push({
        origin: typeof payload.value,
        code: "not_multiple_of",
        divisor: def.value,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      bag.minimum = minimum;
      bag.maximum = maximum;
      if (isInt)
        bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      if (isInt) {
        if (!Number.isInteger(input)) {
          payload.issues.push({
            expected: origin,
            format: def.format,
            code: "invalid_type",
            continue: false,
            input,
            inst
          });
          return;
        }
        if (!Number.isSafeInteger(input)) {
          if (input > 0) {
            payload.issues.push({
              input,
              code: "too_big",
              maximum: Number.MAX_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort
            });
          } else {
            payload.issues.push({
              input,
              code: "too_small",
              minimum: Number.MIN_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort
            });
          }
          return;
        }
      }
      if (input < minimum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_small",
          minimum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
      if (input > maximum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_big",
          maximum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      bag.minimum = minimum;
      bag.maximum = maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      if (input < minimum) {
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_small",
          minimum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
      if (input > maximum) {
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_big",
          maximum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size <= def.maximum)
        return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size >= def.minimum)
        return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.minimum = def.size;
      bag.maximum = def.size;
      bag.size = def.size;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size === def.size)
        return;
      const tooBig = size > def.size;
      payload.issues.push({
        origin: getSizableOrigin(input),
        ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
        inclusive: true,
        exact: true,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length <= def.maximum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length >= def.minimum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.minimum = def.length;
      bag.maximum = def.length;
      bag.length = def.length;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length === def.length)
        return;
      const origin = getLengthableOrigin(input);
      const tooBig = length > def.length;
      payload.issues.push({
        origin,
        ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
        inclusive: true,
        exact: true,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a, _b;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      if (def.pattern) {
        bag.patterns ?? (bag.patterns = new Set);
        bag.patterns.add(def.pattern);
      }
    });
    if (def.pattern)
      (_a = inst._zod).check ?? (_a.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          ...def.pattern ? { pattern: def.pattern.toString() } : {},
          inst,
          continue: !def.abort
        });
      });
    else
      (_b = inst._zod).check ?? (_b.check = () => {
      });
  });
  $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "regex",
        input: payload.value,
        pattern: def.pattern.toString(),
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.includes(def.includes, def.position))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: def.includes,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.startsWith(def.prefix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: def.prefix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.endsWith(def.suffix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "ends_with",
        suffix: def.suffix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
      const result = def.schema._zod.run({
        value: payload.value[def.property],
        issues: []
      }, {});
      if (result instanceof Promise) {
        return result.then((result2) => handleCheckPropertyResult(result2, payload, def.property));
      }
      handleCheckPropertyResult(result, payload, def.property);
      return;
    };
  });
  $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst2) => {
      inst2._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload) => {
      if (mimeSet.has(payload.value.type))
        return;
      payload.issues.push({
        code: "invalid_value",
        values: def.mime,
        input: payload.value.type,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
      payload.value = def.tx(payload.value);
    };
  });
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x4) => x4);
    const minIndent = Math.min(...lines.map((x4) => x4.length - x4.trimStart().length));
    const dedented = lines.map((x4) => x4.slice(minIndent)).map((x4) => " ".repeat(this.indent * 2) + x4);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F2 = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x4) => `  ${x4}`)];
    return new F2(...args, lines.join(`
`));
  }
}

// node_modules/zod/v4/core/versions.js
var version;
var init_versions = __esm(() => {
  version = {
    major: 4,
    minor: 3,
    patch: 6
  };
});

// node_modules/zod/v4/core/schemas.js
function isValidBase64(data) {
  if (data === "")
    return true;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c2) => c2 === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
function handlePropertyResult(result, final, key, input, isOptionalOut) {
  if (result.issues.length) {
    if (isOptionalOut && !(key in input)) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (result.value === undefined) {
    if (key in input) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k3 of keys) {
    if (!def.shape?.[k3]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k3}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t3 = _catchall.def.type;
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (keySet.has(key))
      continue;
    if (t3 === "never") {
      unrecognized.push(key);
      continue;
    }
    const r2 = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r2 instanceof Promise) {
      proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input, isOptionalOut)));
    } else {
      handlePropertyResult(r2, payload, key, input, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r2) => !aborted(r2));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
function handleExclusiveUnionResults(results, final, inst, ctx) {
  const successes = results.filter((r2) => r2.issues.length === 0);
  if (successes.length === 1) {
    final.value = successes[0].value;
    return final;
  }
  if (successes.length === 0) {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    });
  } else {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: [],
      inclusive: false
    });
  }
  return final;
}
function mergeValues(a2, b2) {
  if (a2 === b2) {
    return { valid: true, data: a2 };
  }
  if (a2 instanceof Date && b2 instanceof Date && +a2 === +b2) {
    return { valid: true, data: a2 };
  }
  if (isPlainObject2(a2) && isPlainObject2(b2)) {
    const bKeys = Object.keys(b2);
    const sharedKeys = Object.keys(a2).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a2, ...b2 };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a2[key], b2[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a2) && Array.isArray(b2)) {
    if (a2.length !== b2.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a2.length; index++) {
      const itemA = a2[index];
      const itemB = b2[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k3 of iss.keys) {
        if (!unrecKeys.has(k3))
          unrecKeys.set(k3, {});
        unrecKeys.get(k3).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k3 of iss.keys) {
        if (!unrecKeys.has(k3))
          unrecKeys.set(k3, {});
        unrecKeys.get(k3).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k3]) => k3);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
function handleTupleResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
  if (keyResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, keyResult.issues));
    } else {
      final.issues.push({
        code: "invalid_key",
        origin: "map",
        input,
        inst,
        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  if (valueResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, valueResult.issues));
    } else {
      final.issues.push({
        origin: "map",
        code: "invalid_element",
        input,
        inst,
        key,
        issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  final.value.set(keyResult.value, valueResult.value);
}
function handleSetResult(result, final) {
  if (result.issues.length) {
    final.issues.push(...result.issues);
  }
  final.value.add(result.value);
}
function handleOptionalResult(result, input) {
  if (result.issues.length && input === undefined) {
    return { issues: [], value: undefined };
  }
  return result;
}
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
function handleCodecAResult(result, def, ctx) {
  if (result.issues.length) {
    result.aborted = true;
    return result;
  }
  const direction = ctx.direction || "forward";
  if (direction === "forward") {
    const transformed = def.transform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value2) => handleCodecTxResult(result, value2, def.out, ctx));
    }
    return handleCodecTxResult(result, transformed, def.out, ctx);
  } else {
    const transformed = def.reverseTransform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value2) => handleCodecTxResult(result, value2, def.in, ctx));
    }
    return handleCodecTxResult(result, transformed, def.in, ctx);
  }
}
function handleCodecTxResult(left, value2, nextSchema, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return nextSchema._zod.run({ value: value2, issues: left.issues }, ctx);
}
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
var $ZodType, $ZodString, $ZodStringFormat, $ZodGUID, $ZodUUID, $ZodEmail, $ZodURL, $ZodEmoji, $ZodNanoID, $ZodCUID, $ZodCUID2, $ZodULID, $ZodXID, $ZodKSUID, $ZodISODateTime, $ZodISODate, $ZodISOTime, $ZodISODuration, $ZodIPv4, $ZodIPv6, $ZodMAC, $ZodCIDRv4, $ZodCIDRv6, $ZodBase64, $ZodBase64URL, $ZodE164, $ZodJWT, $ZodCustomStringFormat, $ZodNumber, $ZodNumberFormat, $ZodBoolean, $ZodBigInt, $ZodBigIntFormat, $ZodSymbol, $ZodUndefined, $ZodNull, $ZodAny, $ZodUnknown, $ZodNever, $ZodVoid, $ZodDate, $ZodArray, $ZodObject, $ZodObjectJIT, $ZodUnion, $ZodXor, $ZodDiscriminatedUnion, $ZodIntersection, $ZodTuple, $ZodRecord, $ZodMap, $ZodSet, $ZodEnum, $ZodLiteral, $ZodFile, $ZodTransform, $ZodOptional, $ZodExactOptional, $ZodNullable, $ZodDefault, $ZodPrefault, $ZodNonOptional, $ZodSuccess, $ZodCatch, $ZodNaN, $ZodPipe, $ZodCodec, $ZodReadonly, $ZodTemplateLiteral, $ZodFunction, $ZodPromise, $ZodLazy, $ZodCustom;
var init_schemas = __esm(() => {
  init_checks();
  init_core();
  init_parse();
  init_regexes();
  init_util();
  init_versions();
  init_util();
  $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def;
    inst._zod.bag = inst._zod.bag || {};
    inst._zod.version = version;
    const checks = [...inst._zod.def.checks ?? []];
    if (inst._zod.traits.has("$ZodCheck")) {
      checks.unshift(inst);
    }
    for (const ch of checks) {
      for (const fn of ch._zod.onattach) {
        fn(inst);
      }
    }
    if (checks.length === 0) {
      (_a = inst._zod).deferred ?? (_a.deferred = []);
      inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    } else {
      const runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload);
        let asyncResult;
        for (const ch of checks2) {
          if (ch._zod.def.when) {
            const shouldRun = ch._zod.def.when(payload);
            if (!shouldRun)
              continue;
          } else if (isAborted) {
            continue;
          }
          const currLen = payload.issues.length;
          const _3 = ch._zod.check(payload);
          if (_3 instanceof Promise && ctx?.async === false) {
            throw new $ZodAsyncError;
          }
          if (asyncResult || _3 instanceof Promise) {
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _3;
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                return;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            });
          } else {
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              continue;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult) {
          return asyncResult.then(() => {
            return payload;
          });
        }
        return payload;
      };
      const handleCanaryResult = (canary, payload, ctx) => {
        if (aborted(canary)) {
          canary.aborted = true;
          return canary;
        }
        const checkResult = runChecks(payload, checks, ctx);
        if (checkResult instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError;
          return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
        }
        return inst._zod.parse(checkResult, ctx);
      };
      inst._zod.run = (payload, ctx) => {
        if (ctx.skipChecks) {
          return inst._zod.parse(payload, ctx);
        }
        if (ctx.direction === "backward") {
          const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
          if (canary instanceof Promise) {
            return canary.then((canary2) => {
              return handleCanaryResult(canary2, payload, ctx);
            });
          }
          return handleCanaryResult(canary, payload, ctx);
        }
        const result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError;
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    defineLazy(inst, "~standard", () => ({
      validate: (value2) => {
        try {
          const r2 = safeParse(inst, value2);
          return r2.success ? { value: r2.data } : { issues: r2.error?.issues };
        } catch (_3) {
          return safeParseAsync(inst, value2).then((r2) => r2.success ? { value: r2.data } : { issues: r2.error?.issues });
        }
      },
      vendor: "zod",
      version: 1
    }));
  });
  $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string2(inst._zod.bag);
    inst._zod.parse = (payload, _3) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_4) {
        }
      if (typeof payload.value === "string")
        return payload;
      payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
  });
  $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
      const versionMap = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8
      };
      const v2 = versionMap[def.version];
      if (v2 === undefined)
        throw new Error(`Invalid UUID version: "${def.version}"`);
      def.pattern ?? (def.pattern = uuid(v2));
    } else
      def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
  });
  $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email);
    $ZodStringFormat.init(inst, def);
  });
  $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      try {
        const trimmed = payload.value.trim();
        const url = new URL(trimmed);
        if (def.hostname) {
          def.hostname.lastIndex = 0;
          if (!def.hostname.test(url.hostname)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid hostname",
              pattern: def.hostname.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
          }
        }
        if (def.protocol) {
          def.protocol.lastIndex = 0;
          if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid protocol",
              pattern: def.protocol.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
          }
        }
        if (def.normalize) {
          payload.value = url.href;
        } else {
          payload.value = trimmed;
        }
        return;
      } catch (_3) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji());
    $ZodStringFormat.init(inst, def);
  });
  $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2);
    $ZodStringFormat.init(inst, def);
  });
  $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid);
    $ZodStringFormat.init(inst, def);
  });
  $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime(def));
    $ZodStringFormat.init(inst, def);
  });
  $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date);
    $ZodStringFormat.init(inst, def);
  });
  $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time(def));
    $ZodStringFormat.init(inst, def);
  });
  $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration);
    $ZodStringFormat.init(inst, def);
  });
  $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv4`;
  });
  $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv6`;
    inst._zod.check = (payload) => {
      try {
        new URL(`http://[${payload.value}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def) => {
    def.pattern ?? (def.pattern = mac(def.delimiter));
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `mac`;
  });
  $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4);
    $ZodStringFormat.init(inst, def);
  });
  $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      const parts = payload.value.split("/");
      try {
        if (parts.length !== 2)
          throw new Error;
        const [address, prefix] = parts;
        if (!prefix)
          throw new Error;
        const prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix)
          throw new Error;
        if (prefixNum < 0 || prefixNum > 128)
          throw new Error;
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64";
    inst._zod.check = (payload) => {
      if (isValidBase64(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64url";
    inst._zod.check = (payload) => {
      if (isValidBase64URL(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164);
    $ZodStringFormat.init(inst, def);
  });
  $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      if (isValidJWT(payload.value, def.alg))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      if (def.fn(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Number(payload.value);
        } catch (_3) {
        }
      const input = payload.value;
      if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
        return payload;
      }
      const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
      payload.issues.push({
        expected: "number",
        code: "invalid_type",
        input,
        inst,
        ...received ? { received } : {}
      });
      return payload;
    };
  });
  $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def);
  });
  $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = boolean;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Boolean(payload.value);
        } catch (_3) {
        }
      const input = payload.value;
      if (typeof input === "boolean")
        return payload;
      payload.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = bigint;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = BigInt(payload.value);
        } catch (_3) {
        }
      if (typeof payload.value === "bigint")
        return payload;
      payload.issues.push({
        expected: "bigint",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def) => {
    $ZodCheckBigIntFormat.init(inst, def);
    $ZodBigInt.init(inst, def);
  });
  $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "symbol")
        return payload;
      payload.issues.push({
        expected: "symbol",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _undefined;
    inst._zod.values = new Set([undefined]);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "undefined")
        return payload;
      payload.issues.push({
        expected: "undefined",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _null;
    inst._zod.values = new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (input === null)
        return payload;
      payload.issues.push({
        expected: "null",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      payload.issues.push({
        expected: "never",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "undefined")
        return payload;
      payload.issues.push({
        expected: "void",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce) {
        try {
          payload.value = new Date(payload.value);
        } catch (_err) {
        }
      }
      const input = payload.value;
      const isDate = input instanceof Date;
      const isValidDate = isDate && !Number.isNaN(input.getTime());
      if (isValidDate)
        return payload;
      payload.issues.push({
        expected: "date",
        code: "invalid_type",
        input,
        ...isDate ? { received: "Invalid Date" } : {},
        inst
      });
      return payload;
    };
  });
  $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          expected: "array",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = Array(input.length);
      const proms = [];
      for (let i2 = 0;i2 < input.length; i2++) {
        const item = input[i2];
        const result = def.element._zod.run({
          value: item,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleArrayResult(result2, payload, i2)));
        } else {
          handleArrayResult(result, payload, i2);
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
      const sh = def.shape;
      Object.defineProperty(def, "shape", {
        get: () => {
          const newSh = { ...sh };
          Object.defineProperty(def, "shape", {
            value: newSh
          });
          return newSh;
        }
      });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
      const shape = def.shape;
      const propValues = {};
      for (const key in shape) {
        const field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = new Set);
          for (const v2 of field.values)
            propValues[key].add(v2);
        }
      }
      return propValues;
    });
    const isObject2 = isObject;
    const catchall = def.catchall;
    let value2;
    inst._zod.parse = (payload, ctx) => {
      value2 ?? (value2 = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = {};
      const proms = [];
      const shape = value2.shape;
      for (const key of value2.keys) {
        const el = shape[key];
        const isOptionalOut = el._zod.optout === "optional";
        const r2 = el._zod.run({ value: input[key], issues: [] }, ctx);
        if (r2 instanceof Promise) {
          proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input, isOptionalOut)));
        } else {
          handlePropertyResult(r2, payload, key, input, isOptionalOut);
        }
      }
      if (!catchall) {
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      }
      return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
  });
  $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
    $ZodObject.init(inst, def);
    const superParse = inst._zod.parse;
    const _normalized = cached(() => normalizeDef(def));
    const generateFastpass = (shape) => {
      const doc = new Doc(["shape", "payload", "ctx"]);
      const normalized = _normalized.value;
      const parseStr = (key) => {
        const k3 = esc(key);
        return `shape[${k3}]._zod.run({ value: input[${k3}], issues: [] }, ctx)`;
      };
      doc.write(`const input = payload.value;`);
      const ids = Object.create(null);
      let counter = 0;
      for (const key of normalized.keys) {
        ids[key] = `key_${counter++}`;
      }
      doc.write(`const newResult = {};`);
      for (const key of normalized.keys) {
        const id = ids[key];
        const k3 = esc(key);
        const schema = shape[key];
        const isOptionalOut = schema?._zod?.optout === "optional";
        doc.write(`const ${id} = ${parseStr(key)};`);
        if (isOptionalOut) {
          doc.write(`
        if (${id}.issues.length) {
          if (${k3} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k3}, ...iss.path] : [${k3}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k3} in input) {
            newResult[${k3}] = undefined;
          }
        } else {
          newResult[${k3}] = ${id}.value;
        }
        
      `);
        } else {
          doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k3}, ...iss.path] : [${k3}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k3} in input) {
            newResult[${k3}] = undefined;
          }
        } else {
          newResult[${k3}] = ${id}.value;
        }
        
      `);
        }
      }
      doc.write(`payload.value = newResult;`);
      doc.write(`return payload;`);
      const fn = doc.compile();
      return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject2 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval2 = allowsEval;
    const fastEnabled = jit && allowsEval2.value;
    const catchall = def.catchall;
    let value2;
    inst._zod.parse = (payload, ctx) => {
      value2 ?? (value2 = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
        if (!fastpass)
          fastpass = generateFastpass(def.shape);
        payload = fastpass(payload, ctx);
        if (!catchall)
          return payload;
        return handleCatchall([], input, payload, ctx, value2, inst);
      }
      return superParse(payload, ctx);
    };
  });
  $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.options.some((o2) => o2._zod.optin === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "optout", () => def.options.some((o2) => o2._zod.optout === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "values", () => {
      if (def.options.every((o2) => o2._zod.values)) {
        return new Set(def.options.flatMap((option2) => Array.from(option2._zod.values)));
      }
      return;
    });
    defineLazy(inst._zod, "pattern", () => {
      if (def.options.every((o2) => o2._zod.pattern)) {
        const patterns = def.options.map((o2) => o2._zod.pattern);
        return new RegExp(`^(${patterns.map((p2) => cleanRegex(p2.source)).join("|")})$`);
      }
      return;
    });
    const single = def.options.length === 1;
    const first = def.options[0]._zod.run;
    inst._zod.parse = (payload, ctx) => {
      if (single) {
        return first(payload, ctx);
      }
      let async = false;
      const results = [];
      for (const option2 of def.options) {
        const result = option2._zod.run({
          value: payload.value,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          results.push(result);
          async = true;
        } else {
          if (result.issues.length === 0)
            return result;
          results.push(result);
        }
      }
      if (!async)
        return handleUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleUnionResults(results2, payload, inst, ctx);
      });
    };
  });
  $ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def) => {
    $ZodUnion.init(inst, def);
    def.inclusive = false;
    const single = def.options.length === 1;
    const first = def.options[0]._zod.run;
    inst._zod.parse = (payload, ctx) => {
      if (single) {
        return first(payload, ctx);
      }
      let async = false;
      const results = [];
      for (const option2 of def.options) {
        const result = option2._zod.run({
          value: payload.value,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          results.push(result);
          async = true;
        } else {
          results.push(result);
        }
      }
      if (!async)
        return handleExclusiveUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleExclusiveUnionResults(results2, payload, inst, ctx);
      });
    };
  });
  $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
    def.inclusive = false;
    $ZodUnion.init(inst, def);
    const _super = inst._zod.parse;
    defineLazy(inst._zod, "propValues", () => {
      const propValues = {};
      for (const option2 of def.options) {
        const pv = option2._zod.propValues;
        if (!pv || Object.keys(pv).length === 0)
          throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option2)}"`);
        for (const [k3, v2] of Object.entries(pv)) {
          if (!propValues[k3])
            propValues[k3] = new Set;
          for (const val of v2) {
            propValues[k3].add(val);
          }
        }
      }
      return propValues;
    });
    const disc = cached(() => {
      const opts = def.options;
      const map = new Map;
      for (const o2 of opts) {
        const values2 = o2._zod.propValues?.[def.discriminator];
        if (!values2 || values2.size === 0)
          throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o2)}"`);
        for (const v2 of values2) {
          if (map.has(v2)) {
            throw new Error(`Duplicate discriminator value "${String(v2)}"`);
          }
          map.set(v2, o2);
        }
      }
      return map;
    });
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!isObject(input)) {
        payload.issues.push({
          code: "invalid_type",
          expected: "object",
          input,
          inst
        });
        return payload;
      }
      const opt = disc.value.get(input?.[def.discriminator]);
      if (opt) {
        return opt._zod.run(payload, ctx);
      }
      if (def.unionFallback) {
        return _super(payload, ctx);
      }
      payload.issues.push({
        code: "invalid_union",
        errors: [],
        note: "No matching discriminator",
        discriminator: def.discriminator,
        input,
        path: [def.discriminator],
        inst
      });
      return payload;
    };
  });
  $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      const left = def.left._zod.run({ value: input, issues: [] }, ctx);
      const right = def.right._zod.run({ value: input, issues: [] }, ctx);
      const async = left instanceof Promise || right instanceof Promise;
      if (async) {
        return Promise.all([left, right]).then(([left2, right2]) => {
          return handleIntersectionResults(payload, left2, right2);
        });
      }
      return handleIntersectionResults(payload, left, right);
    };
  });
  $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    const items = def.items;
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          input,
          inst,
          expected: "tuple",
          code: "invalid_type"
        });
        return payload;
      }
      payload.value = [];
      const proms = [];
      const reversedIndex = [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
      const optStart = reversedIndex === -1 ? 0 : items.length - reversedIndex;
      if (!def.rest) {
        const tooBig = input.length > items.length;
        const tooSmall = input.length < optStart - 1;
        if (tooBig || tooSmall) {
          payload.issues.push({
            ...tooBig ? { code: "too_big", maximum: items.length, inclusive: true } : { code: "too_small", minimum: items.length },
            input,
            inst,
            origin: "array"
          });
          return payload;
        }
      }
      let i2 = -1;
      for (const item of items) {
        i2++;
        if (i2 >= input.length) {
          if (i2 >= optStart)
            continue;
        }
        const result = item._zod.run({
          value: input[i2],
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleTupleResult(result2, payload, i2)));
        } else {
          handleTupleResult(result, payload, i2);
        }
      }
      if (def.rest) {
        const rest = input.slice(items.length);
        for (const el of rest) {
          i2++;
          const result = def.rest._zod.run({
            value: el,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleTupleResult(result2, payload, i2)));
          } else {
            handleTupleResult(result, payload, i2);
          }
        }
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!isPlainObject2(input)) {
        payload.issues.push({
          expected: "record",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      const proms = [];
      const values2 = def.keyType._zod.values;
      if (values2) {
        payload.value = {};
        const recordKeys = new Set;
        for (const key of values2) {
          if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
            recordKeys.add(typeof key === "number" ? key.toString() : key);
            const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result instanceof Promise) {
              proms.push(result.then((result2) => {
                if (result2.issues.length) {
                  payload.issues.push(...prefixIssues(key, result2.issues));
                }
                payload.value[key] = result2.value;
              }));
            } else {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[key] = result.value;
            }
          }
        }
        let unrecognized;
        for (const key in input) {
          if (!recordKeys.has(key)) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
        if (unrecognized && unrecognized.length > 0) {
          payload.issues.push({
            code: "unrecognized_keys",
            input,
            inst,
            keys: unrecognized
          });
        }
      } else {
        payload.value = {};
        for (const key of Reflect.ownKeys(input)) {
          if (key === "__proto__")
            continue;
          let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
          if (checkNumericKey) {
            const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
            if (retryResult instanceof Promise) {
              throw new Error("Async schemas not supported in object keys currently");
            }
            if (retryResult.issues.length === 0) {
              keyResult = retryResult;
            }
          }
          if (keyResult.issues.length) {
            if (def.mode === "loose") {
              payload.value[key] = input[key];
            } else {
              payload.issues.push({
                code: "invalid_key",
                origin: "record",
                issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                input: key,
                path: [key],
                inst
              });
            }
            continue;
          }
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[keyResult.value] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!(input instanceof Map)) {
        payload.issues.push({
          expected: "map",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      const proms = [];
      payload.value = new Map;
      for (const [key, value2] of input) {
        const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        const valueResult = def.valueType._zod.run({ value: value2, issues: [] }, ctx);
        if (keyResult instanceof Promise || valueResult instanceof Promise) {
          proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
            handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
          }));
        } else {
          handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
        }
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!(input instanceof Set)) {
        payload.issues.push({
          input,
          inst,
          expected: "set",
          code: "invalid_type"
        });
        return payload;
      }
      const proms = [];
      payload.value = new Set;
      for (const item of input) {
        const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleSetResult(result2, payload)));
        } else
          handleSetResult(result, payload);
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values2 = getEnumValues(def.entries);
    const valuesSet = new Set(values2);
    inst._zod.values = valuesSet;
    inst._zod.pattern = new RegExp(`^(${values2.filter((k3) => propertyKeyTypes.has(typeof k3)).map((o2) => typeof o2 === "string" ? escapeRegex(o2) : o2.toString()).join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (valuesSet.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values: values2,
        input,
        inst
      });
      return payload;
    };
  });
  $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    if (def.values.length === 0) {
      throw new Error("Cannot create literal schema with no valid values");
    }
    const values2 = new Set(def.values);
    inst._zod.values = values2;
    inst._zod.pattern = new RegExp(`^(${def.values.map((o2) => typeof o2 === "string" ? escapeRegex(o2) : o2 ? escapeRegex(o2.toString()) : String(o2)).join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (values2.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values: def.values,
        input,
        inst
      });
      return payload;
    };
  });
  $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (input instanceof File)
        return payload;
      payload.issues.push({
        expected: "file",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      const _out = def.transform(payload.value, payload);
      if (ctx.async) {
        const output = _out instanceof Promise ? _out : Promise.resolve(_out);
        return output.then((output2) => {
          payload.value = output2;
          return payload;
        });
      }
      if (_out instanceof Promise) {
        throw new $ZodAsyncError;
      }
      payload.value = _out;
      return payload;
    };
  });
  $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
      if (def.innerType._zod.optin === "optional") {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise)
          return result.then((r2) => handleOptionalResult(r2, payload.value));
        return handleOptionalResult(result, payload.value);
      }
      if (payload.value === undefined) {
        return payload;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
    inst._zod.parse = (payload, ctx) => {
      return def.innerType._zod.run(payload, ctx);
    };
  });
  $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
    });
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
      if (payload.value === null)
        return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  });
  $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === undefined) {
        payload.value = def.defaultValue;
        return payload;
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleDefaultResult(result2, def));
      }
      return handleDefaultResult(result, def);
    };
  });
  $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === undefined) {
        payload.value = def.defaultValue;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
      const v2 = def.innerType._zod.values;
      return v2 ? new Set([...v2].filter((x4) => x4 !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleNonOptionalResult(result2, inst));
      }
      return handleNonOptionalResult(result, inst);
    };
  });
  $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        throw new $ZodEncodeError("ZodSuccess");
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => {
          payload.value = result2.issues.length === 0;
          return payload;
        });
      }
      payload.value = result.issues.length === 0;
      return payload;
    };
  });
  $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => {
          payload.value = result2.value;
          if (result2.issues.length) {
            payload.value = def.catchValue({
              ...payload,
              error: {
                issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
              },
              input: payload.value
            });
            payload.issues = [];
          }
          return payload;
        });
      }
      payload.value = result.value;
      if (result.issues.length) {
        payload.value = def.catchValue({
          ...payload,
          error: {
            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
          },
          input: payload.value
        });
        payload.issues = [];
      }
      return payload;
    };
  });
  $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
        payload.issues.push({
          input: payload.value,
          inst,
          expected: "nan",
          code: "invalid_type"
        });
        return payload;
      }
      return payload;
    };
  });
  $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        const right = def.out._zod.run(payload, ctx);
        if (right instanceof Promise) {
          return right.then((right2) => handlePipeResult(right2, def.in, ctx));
        }
        return handlePipeResult(right, def.in, ctx);
      }
      const left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left2) => handlePipeResult(left2, def.out, ctx));
      }
      return handlePipeResult(left, def.out, ctx);
    };
  });
  $ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
      const direction = ctx.direction || "forward";
      if (direction === "forward") {
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
          return left.then((left2) => handleCodecAResult(left2, def, ctx));
        }
        return handleCodecAResult(left, def, ctx);
      } else {
        const right = def.out._zod.run(payload, ctx);
        if (right instanceof Promise) {
          return right.then((right2) => handleCodecAResult(right2, def, ctx));
        }
        return handleCodecAResult(right, def, ctx);
      }
    };
  });
  $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
    defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then(handleReadonlyResult);
      }
      return handleReadonlyResult(result);
    };
  });
  $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    const regexParts = [];
    for (const part of def.parts) {
      if (typeof part === "object" && part !== null) {
        if (!part._zod.pattern) {
          throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
        }
        const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
        if (!source)
          throw new Error(`Invalid template literal part: ${part._zod.traits}`);
        const start = source.startsWith("^") ? 1 : 0;
        const end = source.endsWith("$") ? source.length - 1 : source.length;
        regexParts.push(source.slice(start, end));
      } else if (part === null || primitiveTypes.has(typeof part)) {
        regexParts.push(escapeRegex(`${part}`));
      } else {
        throw new Error(`Invalid template literal part: ${part}`);
      }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "string") {
        payload.issues.push({
          input: payload.value,
          inst,
          expected: "string",
          code: "invalid_type"
        });
        return payload;
      }
      inst._zod.pattern.lastIndex = 0;
      if (!inst._zod.pattern.test(payload.value)) {
        payload.issues.push({
          input: payload.value,
          inst,
          code: "invalid_format",
          format: def.format ?? "template_literal",
          pattern: inst._zod.pattern.source
        });
        return payload;
      }
      return payload;
    };
  });
  $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
    $ZodType.init(inst, def);
    inst._def = def;
    inst._zod.def = def;
    inst.implement = (func) => {
      if (typeof func !== "function") {
        throw new Error("implement() must be called with a function");
      }
      return function(...args) {
        const parsedArgs = inst._def.input ? parse(inst._def.input, args) : args;
        const result = Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return parse(inst._def.output, result);
        }
        return result;
      };
    };
    inst.implementAsync = (func) => {
      if (typeof func !== "function") {
        throw new Error("implementAsync() must be called with a function");
      }
      return async function(...args) {
        const parsedArgs = inst._def.input ? await parseAsync2(inst._def.input, args) : args;
        const result = await Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return await parseAsync2(inst._def.output, result);
        }
        return result;
      };
    };
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "function") {
        payload.issues.push({
          code: "invalid_type",
          expected: "function",
          input: payload.value,
          inst
        });
        return payload;
      }
      const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
      if (hasPromiseOutput) {
        payload.value = inst.implementAsync(payload.value);
      } else {
        payload.value = inst.implement(payload.value);
      }
      return payload;
    };
    inst.input = (...args) => {
      const F2 = inst.constructor;
      if (Array.isArray(args[0])) {
        return new F2({
          type: "function",
          input: new $ZodTuple({
            type: "tuple",
            items: args[0],
            rest: args[1]
          }),
          output: inst._def.output
        });
      }
      return new F2({
        type: "function",
        input: args[0],
        output: inst._def.output
      });
    };
    inst.output = (output) => {
      const F2 = inst.constructor;
      return new F2({
        type: "function",
        input: inst._def.input,
        output
      });
    };
    return inst;
  });
  $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
    };
  });
  $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "innerType", () => def.getter());
    defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
    defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
    defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? undefined);
    defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? undefined);
    inst._zod.parse = (payload, ctx) => {
      const inner = inst._zod.innerType;
      return inner._zod.run(payload, ctx);
    };
  });
  $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _3) => {
      return payload;
    };
    inst._zod.check = (payload) => {
      const input = payload.value;
      const r2 = def.fn(input);
      if (r2 instanceof Promise) {
        return r2.then((r3) => handleRefineResult(r3, payload, input, inst));
      }
      handleRefineResult(r2, payload, input, inst);
      return;
    };
  });
});

// node_modules/zod/v4/locales/ar.js
function ar_default() {
  return {
    localeError: error()
  };
}
var error = () => {
  const Sizable = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `مدخلات غير مقبولة: يفترض إدخال instanceof ${issue2.expected}، ولكن تم إدخال ${received}`;
        }
        return `مدخلات غير مقبولة: يفترض إدخال ${expected}، ولكن تم إدخال ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue2.values[0])}`;
        return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return ` أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
        return `أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `نَص غير مقبول: يجب أن يبدأ بـ "${issue2.prefix}"`;
        if (_issue.format === "ends_with")
          return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue2.divisor}`;
      case "unrecognized_keys":
        return `معرف${issue2.keys.length > 1 ? "ات" : ""} غريب${issue2.keys.length > 1 ? "ة" : ""}: ${joinValues(issue2.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${issue2.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${issue2.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
};
var init_ar = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/az.js
function az_default() {
  return {
    localeError: error2()
  };
}
var error2 = () => {
  const Sizable = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Yanlış dəyər: gözlənilən instanceof ${issue2.expected}, daxil olan ${received}`;
        }
        return `Yanlış dəyər: gözlənilən ${expected}, daxil olan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue2.values[0])}`;
        return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
        return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
        if (_issue.format === "ends_with")
          return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
        if (_issue.format === "includes")
          return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
        if (_issue.format === "regex")
          return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
        return `Yanlış ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${issue2.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${issue2.origin} daxilində yanlış dəyər`;
      default:
        return `Yanlış dəyər`;
    }
  };
};
var init_az = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/be.js
function getBelarusianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
function be_default() {
  return {
    localeError: error3()
  };
}
var error3 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "сімвал",
        few: "сімвалы",
        many: "сімвалаў"
      },
      verb: "мець"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    file: {
      unit: {
        one: "байт",
        few: "байты",
        many: "байтаў"
      },
      verb: "мець"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "лік",
    array: "масіў"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Няправільны ўвод: чакаўся instanceof ${issue2.expected}, атрымана ${received}`;
        }
        return `Няправільны ўвод: чакаўся ${expected}, атрымана ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue2.values[0])}`;
        return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна быць ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Занадта малы: чакалася, што ${issue2.origin} павінна ${sizing.verb} ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Занадта малы: чакалася, што ${issue2.origin} павінна быць ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
        return `Няправільны ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${issue2.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${issue2.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${issue2.origin}`;
      default:
        return `Няправільны ўвод`;
    }
  };
};
var init_be = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/bg.js
function bg_default() {
  return {
    localeError: error4()
  };
}
var error4 = () => {
  const Sizable = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "вход",
    email: "имейл адрес",
    url: "URL",
    emoji: "емоджи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO време",
    date: "ISO дата",
    time: "ISO време",
    duration: "ISO продължителност",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "base64-кодиран низ",
    base64url: "base64url-кодиран низ",
    json_string: "JSON низ",
    e164: "E.164 номер",
    jwt: "JWT",
    template_literal: "вход"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Невалиден вход: очакван instanceof ${issue2.expected}, получен ${received}`;
        }
        return `Невалиден вход: очакван ${expected}, получен ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Невалиден вход: очакван ${stringifyPrimitive(issue2.values[0])}`;
        return `Невалидна опция: очаквано едно от ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Твърде голямо: очаква се ${issue2.origin ?? "стойност"} да съдържа ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елемента"}`;
        return `Твърде голямо: очаква се ${issue2.origin ?? "стойност"} да бъде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Твърде малко: очаква се ${issue2.origin} да съдържа ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Твърде малко: очаква се ${issue2.origin} да бъде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Невалиден низ: трябва да включва "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
        let invalid_adj = "Невалиден";
        if (_issue.format === "emoji")
          invalid_adj = "Невалидно";
        if (_issue.format === "datetime")
          invalid_adj = "Невалидно";
        if (_issue.format === "date")
          invalid_adj = "Невалидна";
        if (_issue.format === "time")
          invalid_adj = "Невалидно";
        if (_issue.format === "duration")
          invalid_adj = "Невалидна";
        return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${issue2.keys.length > 1 ? "и" : ""} ключ${issue2.keys.length > 1 ? "ове" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${issue2.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${issue2.origin}`;
      default:
        return `Невалиден вход`;
    }
  };
};
var init_bg = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ca.js
function ca_default() {
  return {
    localeError: error5()
  };
}
var error5 = () => {
  const Sizable = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Tipus invàlid: s'esperava instanceof ${issue2.expected}, s'ha rebut ${received}`;
        }
        return `Tipus invàlid: s'esperava ${expected}, s'ha rebut ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Valor invàlid: s'esperava ${stringifyPrimitive(issue2.values[0])}`;
        return `Opció invàlida: s'esperava una de ${joinValues(issue2.values, " o ")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "com a màxim" : "menys de";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} contingués ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} fos ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "com a mínim" : "més de";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Massa petit: s'esperava que ${issue2.origin} contingués ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Massa petit: s'esperava que ${issue2.origin} fos ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Format invàlid: ha d'incloure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
        return `Format invàlid per a ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clau${issue2.keys.length > 1 ? "s" : ""} no reconeguda${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${issue2.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      case "invalid_element":
        return `Element invàlid a ${issue2.origin}`;
      default:
        return `Entrada invàlida`;
    }
  };
};
var init_ca = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/cs.js
function cs_default() {
  return {
    localeError: error6()
  };
}
var error6 = () => {
  const Sizable = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "číslo",
    string: "řetězec",
    function: "funkce",
    array: "pole"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Neplatný vstup: očekáváno instanceof ${issue2.expected}, obdrženo ${received}`;
        }
        return `Neplatný vstup: očekáváno ${expected}, obdrženo ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue2.values[0])}`;
        return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "prvků"}`;
        }
        return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
        return `Neplatný formát ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${issue2.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${issue2.origin}`;
      default:
        return `Neplatný vstup`;
    }
  };
};
var init_cs = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/da.js
function da_default() {
  return {
    localeError: error7()
  };
}
var error7 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslæt",
    date: "ISO-dato",
    time: "ISO-klokkeslæt",
    duration: "ISO-varighed",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "sæt",
    file: "fil"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ugyldigt input: forventede instanceof ${issue2.expected}, fik ${received}`;
        }
        return `Ugyldigt input: forventede ${expected}, fik ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ugyldig værdi: forventede ${stringifyPrimitive(issue2.values[0])}`;
        return `Ugyldigt valg: forventede en af følgende ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing)
          return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing) {
          return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `For lille: forventede ${origin} havde ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${issue2.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${issue2.origin}`;
      default:
        return `Ugyldigt input`;
    }
  };
};
var init_da = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/de.js
function de_default() {
  return {
    localeError: error8()
  };
}
var error8 = () => {
  const Sizable = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ungültige Eingabe: erwartet instanceof ${issue2.expected}, erhalten ${received}`;
        }
        return `Ungültige Eingabe: erwartet ${expected}, erhalten ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue2.values[0])}`;
        return `Ungültige Option: erwartet eine von ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
        return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ist`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} hat`;
        }
        return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
        if (_issue.format === "ends_with")
          return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
        if (_issue.format === "includes")
          return `Ungültiger String: muss "${_issue.includes}" enthalten`;
        if (_issue.format === "regex")
          return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
        return `Ungültig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${issue2.divisor} sein`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${issue2.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${issue2.origin}`;
      default:
        return `Ungültige Eingabe`;
    }
  };
};
var init_de = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/en.js
function en_default() {
  return {
    localeError: error9()
  };
}
var error9 = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
var init_en = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/eo.js
function eo_default() {
  return {
    localeError: error10()
  };
}
var error10 = () => {
  const Sizable = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emoĝio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-daŭro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Nevalida enigo: atendiĝis instanceof ${issue2.expected}, riceviĝis ${received}`;
        }
        return `Nevalida enigo: atendiĝis ${expected}, riceviĝis ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue2.values[0])}`;
        return `Nevalida opcio: atendiĝis unu el ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
        return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Tro malgranda: atendiĝis ke ${issue2.origin} havu ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Tro malgranda: atendiĝis ke ${issue2.origin} estu ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
        return `Nevalida ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${issue2.keys.length > 1 ? "j" : ""} ŝlosilo${issue2.keys.length > 1 ? "j" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${issue2.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${issue2.origin}`;
      default:
        return `Nevalida enigo`;
    }
  };
};
var init_eo = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/es.js
function es_default() {
  return {
    localeError: error11()
  };
}
var error11 = () => {
  const Sizable = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "texto",
    number: "número",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "número grande",
    symbol: "símbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "función",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeración",
    union: "unión",
    literal: "literal",
    promise: "promesa",
    void: "vacío",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrada inválida: se esperaba instanceof ${issue2.expected}, recibido ${received}`;
        }
        return `Entrada inválida: se esperaba ${expected}, recibido ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrada inválida: se esperaba ${stringifyPrimitive(issue2.values[0])}`;
        return `Opción inválida: se esperaba una de ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing)
          return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        if (sizing) {
          return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Cadena inválida: debe incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
        return `Inválido ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Llave${issue2.keys.length > 1 ? "s" : ""} desconocida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      default:
        return `Entrada inválida`;
    }
  };
};
var init_es = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/fa.js
function fa_default() {
  return {
    localeError: error12()
  };
}
var error12 = () => {
  const Sizable = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "آرایه"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ورودی نامعتبر: می‌بایست instanceof ${issue2.expected} می‌بود، ${received} دریافت شد`;
        }
        return `ورودی نامعتبر: می‌بایست ${expected} می‌بود، ${received} دریافت شد`;
      }
      case "invalid_value":
        if (issue2.values.length === 1) {
          return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue2.values[0])} می‌بود`;
        }
        return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue2.values, "|")} می‌بود`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
        }
        return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} باشد`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} باشد`;
        }
        return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
        }
        if (_issue.format === "ends_with") {
          return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
        }
        if (_issue.format === "includes") {
          return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
        }
        if (_issue.format === "regex") {
          return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
        }
        return `${FormatDictionary[_issue.format] ?? issue2.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${issue2.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${issue2.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${issue2.origin}`;
      case "invalid_union":
        return `ورودی نامعتبر`;
      case "invalid_element":
        return `مقدار نامعتبر در ${issue2.origin}`;
      default:
        return `ورودی نامعتبر`;
    }
  };
};
var init_fa = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/fi.js
function fi_default() {
  return {
    localeError: error13()
  };
}
var error13 = () => {
  const Sizable = {
    string: { unit: "merkkiä", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "päivämäärän" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Virheellinen tyyppi: odotettiin instanceof ${issue2.expected}, oli ${received}`;
        }
        return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue2.values[0])}`;
        return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue2.maximum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian suuri: arvon täytyy olla ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue2.minimum.toString()} ${sizing.unit}`.trim();
        }
        return `Liian pieni: arvon täytyy olla ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
        if (_issue.format === "regex") {
          return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
        }
        return `Virheellinen ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${issue2.divisor} monikerta`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return `Virheellinen syöte`;
    }
  };
};
var init_fi = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/fr.js
function fr_default() {
  return {
    localeError: error14()
  };
}
var error14 = () => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombre",
    array: "tableau"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrée invalide : instanceof ${issue2.expected} attendu, ${received} reçu`;
        }
        return `Entrée invalide : ${expected} attendu, ${received} reçu`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrée invalide : ${stringifyPrimitive(issue2.values[0])} attendu`;
        return `Option invalide : une valeur parmi ${joinValues(issue2.values, "|")} attendue`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Trop grand : ${issue2.origin ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
        return `Trop grand : ${issue2.origin ?? "valeur"} doit être ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Trop petit : ${issue2.origin} doit ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Trop petit : ${issue2.origin} doit être ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue2.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue2.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
};
var init_fr = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/fr-CA.js
function fr_CA_default() {
  return {
    localeError: error15()
  };
}
var error15 = () => {
  const Sizable = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Entrée invalide : attendu instanceof ${issue2.expected}, reçu ${received}`;
        }
        return `Entrée invalide : attendu ${expected}, reçu ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrée invalide : attendu ${stringifyPrimitive(issue2.values[0])}`;
        return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "≤" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} ait ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} soit ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "≥" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Trop petit : attendu que ${issue2.origin} ait ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Trop petit : attendu que ${issue2.origin} soit ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chaîne invalide : doit inclure "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${issue2.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${issue2.origin}`;
      default:
        return `Entrée invalide`;
    }
  };
};
var init_fr_CA = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/he.js
function he_default() {
  return {
    localeError: error16()
  };
}
var error16 = () => {
  const TypeNames = {
    string: { label: "מחרוזת", gender: "f" },
    number: { label: "מספר", gender: "m" },
    boolean: { label: "ערך בוליאני", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "תאריך", gender: "m" },
    array: { label: "מערך", gender: "m" },
    object: { label: "אובייקט", gender: "m" },
    null: { label: "ערך ריק (null)", gender: "m" },
    undefined: { label: "ערך לא מוגדר (undefined)", gender: "m" },
    symbol: { label: "סימבול (Symbol)", gender: "m" },
    function: { label: "פונקציה", gender: "f" },
    map: { label: "מפה (Map)", gender: "f" },
    set: { label: "קבוצה (Set)", gender: "f" },
    file: { label: "קובץ", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "ערך לא ידוע", gender: "m" },
    value: { label: "ערך", gender: "m" }
  };
  const Sizable = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
  };
  const typeEntry = (t3) => t3 ? TypeNames[t3] : undefined;
  const typeLabel = (t3) => {
    const e2 = typeEntry(t3);
    if (e2)
      return e2.label;
    return t3 ?? TypeNames.unknown.label;
  };
  const withDefinite = (t3) => `ה${typeLabel(t3)}`;
  const verbFor = (t3) => {
    const e2 = typeEntry(t3);
    const gender = e2?.gender ?? "m";
    return gender === "f" ? "צריכה להיות" : "צריך להיות";
  };
  const getSizing = (origin) => {
    if (!origin)
      return null;
    return Sizable[origin] ?? null;
  };
  const FormatDictionary = {
    regex: { label: "קלט", gender: "m" },
    email: { label: "כתובת אימייל", gender: "f" },
    url: { label: "כתובת רשת", gender: "f" },
    emoji: { label: "אימוג'י", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "תאריך וזמן ISO", gender: "m" },
    date: { label: "תאריך ISO", gender: "m" },
    time: { label: "זמן ISO", gender: "m" },
    duration: { label: "משך זמן ISO", gender: "m" },
    ipv4: { label: "כתובת IPv4", gender: "f" },
    ipv6: { label: "כתובת IPv6", gender: "f" },
    cidrv4: { label: "טווח IPv4", gender: "m" },
    cidrv6: { label: "טווח IPv6", gender: "m" },
    base64: { label: "מחרוזת בבסיס 64", gender: "f" },
    base64url: { label: "מחרוזת בבסיס 64 לכתובות רשת", gender: "f" },
    json_string: { label: "מחרוזת JSON", gender: "f" },
    e164: { label: "מספר E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "קלט", gender: "m" },
    includes: { label: "קלט", gender: "m" },
    lowercase: { label: "קלט", gender: "m" },
    starts_with: { label: "קלט", gender: "m" },
    uppercase: { label: "קלט", gender: "m" }
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expectedKey = issue2.expected;
        const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `קלט לא תקין: צריך להיות instanceof ${issue2.expected}, התקבל ${received}`;
        }
        return `קלט לא תקין: צריך להיות ${expected}, התקבל ${received}`;
      }
      case "invalid_value": {
        if (issue2.values.length === 1) {
          return `ערך לא תקין: הערך חייב להיות ${stringifyPrimitive(issue2.values[0])}`;
        }
        const stringified = issue2.values.map((v2) => stringifyPrimitive(v2));
        if (issue2.values.length === 2) {
          return `ערך לא תקין: האפשרויות המתאימות הן ${stringified[0]} או ${stringified[1]}`;
        }
        const lastValue = stringified[stringified.length - 1];
        const restValues = stringified.slice(0, -1).join(", ");
        return `ערך לא תקין: האפשרויות המתאימות הן ${restValues} או ${lastValue}`;
      }
      case "too_big": {
        const sizing = getSizing(issue2.origin);
        const subject = withDefinite(issue2.origin ?? "value");
        if (issue2.origin === "string") {
          return `${sizing?.longLabel ?? "ארוך"} מדי: ${subject} צריכה להכיל ${issue2.maximum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        }
        if (issue2.origin === "number") {
          const comparison = issue2.inclusive ? `קטן או שווה ל-${issue2.maximum}` : `קטן מ-${issue2.maximum}`;
          return `גדול מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue2.origin === "array" || issue2.origin === "set") {
          const verb = issue2.origin === "set" ? "צריכה" : "צריך";
          const comparison = issue2.inclusive ? `${issue2.maximum} ${sizing?.unit ?? ""} או פחות` : `פחות מ-${issue2.maximum} ${sizing?.unit ?? ""}`;
          return `גדול מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue2.inclusive ? "<=" : "<";
        const be2 = verbFor(issue2.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.longLabel} מדי: ${subject} ${be2} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.longLabel ?? "גדול"} מדי: ${subject} ${be2} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const sizing = getSizing(issue2.origin);
        const subject = withDefinite(issue2.origin ?? "value");
        if (issue2.origin === "string") {
          return `${sizing?.shortLabel ?? "קצר"} מדי: ${subject} צריכה להכיל ${issue2.minimum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "או יותר" : "לפחות"}`.trim();
        }
        if (issue2.origin === "number") {
          const comparison = issue2.inclusive ? `גדול או שווה ל-${issue2.minimum}` : `גדול מ-${issue2.minimum}`;
          return `קטן מדי: ${subject} צריך להיות ${comparison}`;
        }
        if (issue2.origin === "array" || issue2.origin === "set") {
          const verb = issue2.origin === "set" ? "צריכה" : "צריך";
          if (issue2.minimum === 1 && issue2.inclusive) {
            const singularPhrase = issue2.origin === "set" ? "לפחות פריט אחד" : "לפחות פריט אחד";
            return `קטן מדי: ${subject} ${verb} להכיל ${singularPhrase}`;
          }
          const comparison = issue2.inclusive ? `${issue2.minimum} ${sizing?.unit ?? ""} או יותר` : `יותר מ-${issue2.minimum} ${sizing?.unit ?? ""}`;
          return `קטן מדי: ${subject} ${verb} להכיל ${comparison}`.trim();
        }
        const adj = issue2.inclusive ? ">=" : ">";
        const be2 = verbFor(issue2.origin ?? "value");
        if (sizing?.unit) {
          return `${sizing.shortLabel} מדי: ${subject} ${be2} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `${sizing?.shortLabel ?? "קטן"} מדי: ${subject} ${be2} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `המחרוזת חייבת לכלול "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${_issue.pattern}`;
        const nounEntry = FormatDictionary[_issue.format];
        const noun = nounEntry?.label ?? _issue.format;
        const gender = nounEntry?.gender ?? "m";
        const adjective = gender === "f" ? "תקינה" : "תקין";
        return `${noun} לא ${adjective}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${issue2.divisor}`;
      case "unrecognized_keys":
        return `מפתח${issue2.keys.length > 1 ? "ות" : ""} לא מזוה${issue2.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key": {
        return `שדה לא תקין באובייקט`;
      }
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element": {
        const place = withDefinite(issue2.origin ?? "array");
        return `ערך לא תקין ב${place}`;
      }
      default:
        return `קלט לא תקין`;
    }
  };
};
var init_he = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/hu.js
function hu_default() {
  return {
    localeError: error17()
  };
}
var error17 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "szám",
    array: "tömb"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Érvénytelen bemenet: a várt érték instanceof ${issue2.expected}, a kapott érték ${received}`;
        }
        return `Érvénytelen bemenet: a várt érték ${expected}, a kapott érték ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue2.values[0])}`;
        return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Túl nagy: ${issue2.origin ?? "érték"} mérete túl nagy ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elem"}`;
        return `Túl nagy: a bemeneti érték ${issue2.origin ?? "érték"} túl nagy: ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Túl kicsi: a bemeneti érték ${issue2.origin} mérete túl kicsi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Túl kicsi: a bemeneti érték ${issue2.origin} túl kicsi ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
        if (_issue.format === "ends_with")
          return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
        if (_issue.format === "includes")
          return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
        if (_issue.format === "regex")
          return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
        return `Érvénytelen ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${issue2.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${issue2.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${issue2.origin}`;
      default:
        return `Érvénytelen bemenet`;
    }
  };
};
var init_hu = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/hy.js
function getArmenianPlural(count, one, many) {
  return Math.abs(count) === 1 ? one : many;
}
function withDefiniteArticle(word) {
  if (!word)
    return "";
  const vowels = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"];
  const lastChar = word[word.length - 1];
  return word + (vowels.includes(lastChar) ? "ն" : "ը");
}
function hy_default() {
  return {
    localeError: error18()
  };
}
var error18 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "նշան",
        many: "նշաններ"
      },
      verb: "ունենալ"
    },
    file: {
      unit: {
        one: "բայթ",
        many: "բայթեր"
      },
      verb: "ունենալ"
    },
    array: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    },
    set: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "մուտք",
    email: "էլ. հասցե",
    url: "URL",
    emoji: "էմոջի",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ամսաթիվ և ժամ",
    date: "ISO ամսաթիվ",
    time: "ISO ժամ",
    duration: "ISO տևողություն",
    ipv4: "IPv4 հասցե",
    ipv6: "IPv6 հասցե",
    cidrv4: "IPv4 միջակայք",
    cidrv6: "IPv6 միջակայք",
    base64: "base64 ձևաչափով տող",
    base64url: "base64url ձևաչափով տող",
    json_string: "JSON տող",
    e164: "E.164 համար",
    jwt: "JWT",
    template_literal: "մուտք"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "թիվ",
    array: "զանգված"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Սխալ մուտքագրում․ սպասվում էր instanceof ${issue2.expected}, ստացվել է ${received}`;
        }
        return `Սխալ մուտքագրում․ սպասվում էր ${expected}, ստացվել է ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Սխալ մուտքագրում․ սպասվում էր ${stringifyPrimitive(issue2.values[1])}`;
        return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getArmenianPlural(maxValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin ?? "արժեք")} կունենա ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin ?? "արժեք")} լինի ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getArmenianPlural(minValue, sizing.unit.one, sizing.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin)} կունենա ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue2.origin)} լինի ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Սխալ տող․ պետք է սկսվի "${_issue.prefix}"-ով`;
        if (_issue.format === "ends_with")
          return `Սխալ տող․ պետք է ավարտվի "${_issue.suffix}"-ով`;
        if (_issue.format === "includes")
          return `Սխալ տող․ պետք է պարունակի "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Սխալ տող․ պետք է համապատասխանի ${_issue.pattern} ձևաչափին`;
        return `Սխալ ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${issue2.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${issue2.keys.length > 1 ? "ներ" : ""}. ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${withDefiniteArticle(issue2.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${withDefiniteArticle(issue2.origin)}-ում`;
      default:
        return `Սխալ մուտքագրում`;
    }
  };
};
var init_hy = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/id.js
function id_default() {
  return {
    localeError: error19()
  };
}
var error19 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input tidak valid: diharapkan instanceof ${issue2.expected}, diterima ${received}`;
        }
        return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input tidak valid: diharapkan ${stringifyPrimitive(issue2.values[0])}`;
        return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} memiliki ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} menjadi ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Terlalu kecil: diharapkan ${issue2.origin} memiliki ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: diharapkan ${issue2.origin} menjadi ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak valid: harus menyertakan "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${issue2.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${issue2.origin}`;
      default:
        return `Input tidak valid`;
    }
  };
};
var init_id = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/is.js
function is_default() {
  return {
    localeError: error20()
  };
}
var error20 = () => {
  const Sizable = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "gildi",
    email: "netfang",
    url: "vefslóð",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og tími",
    date: "ISO dagsetning",
    time: "ISO tími",
    duration: "ISO tímalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 tölugildi",
    jwt: "JWT",
    template_literal: "gildi"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "númer",
    array: "fylki"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera instanceof ${issue2.expected}`;
        }
        return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera ${expected}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue2.values[0])}`;
        return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} hafi ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "hluti"}`;
        return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} sé ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Of lítið: gert er ráð fyrir að ${issue2.origin} hafi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Of lítið: gert er ráð fyrir að ${issue2.origin} sé ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
        return `Rangt ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${issue2.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${issue2.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${issue2.origin}`;
      default:
        return `Rangt gildi`;
    }
  };
};
var init_is = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/it.js
function it_default() {
  return {
    localeError: error21()
  };
}
var error21 = () => {
  const Sizable = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input non valido: atteso instanceof ${issue2.expected}, ricevuto ${received}`;
        }
        return `Input non valido: atteso ${expected}, ricevuto ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input non valido: atteso ${stringifyPrimitive(issue2.values[0])}`;
        return `Opzione non valida: atteso uno tra ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Troppo grande: ${issue2.origin ?? "valore"} deve avere ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementi"}`;
        return `Troppo grande: ${issue2.origin ?? "valore"} deve essere ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Troppo piccolo: ${issue2.origin} deve avere ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Troppo piccolo: ${issue2.origin} deve essere ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Stringa non valida: deve includere "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chiav${issue2.keys.length > 1 ? "i" : "e"} non riconosciut${issue2.keys.length > 1 ? "e" : "a"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${issue2.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${issue2.origin}`;
      default:
        return `Input non valido`;
    }
  };
};
var init_it = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ja.js
function ja_default() {
  return {
    localeError: error22()
  };
}
var error22 = () => {
  const Sizable = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数値",
    array: "配列"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `無効な入力: instanceof ${issue2.expected}が期待されましたが、${received}が入力されました`;
        }
        return `無効な入力: ${expected}が期待されましたが、${received}が入力されました`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `無効な入力: ${stringifyPrimitive(issue2.values[0])}が期待されました`;
        return `無効な選択: ${joinValues(issue2.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const adj = issue2.inclusive ? "以下である" : "より小さい";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
        return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${adj}必要があります`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "以上である" : "より大きい";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${sizing.unit}${adj}必要があります`;
        return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${adj}必要があります`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
        if (_issue.format === "ends_with")
          return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
        if (_issue.format === "includes")
          return `無効な文字列: "${_issue.includes}"を含む必要があります`;
        if (_issue.format === "regex")
          return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
        return `無効な${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${issue2.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${issue2.keys.length > 1 ? "群" : ""}: ${joinValues(issue2.keys, "、")}`;
      case "invalid_key":
        return `${issue2.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${issue2.origin}内の無効な値`;
      default:
        return `無効な入力`;
    }
  };
};
var init_ja = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ka.js
function ka_default() {
  return {
    localeError: error23()
  };
}
var error23 = () => {
  const Sizable = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "შეყვანა",
    email: "ელ-ფოსტის მისამართი",
    url: "URL",
    emoji: "ემოჯი",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "თარიღი-დრო",
    date: "თარიღი",
    time: "დრო",
    duration: "ხანგრძლივობა",
    ipv4: "IPv4 მისამართი",
    ipv6: "IPv6 მისამართი",
    cidrv4: "IPv4 დიაპაზონი",
    cidrv6: "IPv6 დიაპაზონი",
    base64: "base64-კოდირებული სტრინგი",
    base64url: "base64url-კოდირებული სტრინგი",
    json_string: "JSON სტრინგი",
    e164: "E.164 ნომერი",
    jwt: "JWT",
    template_literal: "შეყვანა"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "რიცხვი",
    string: "სტრინგი",
    boolean: "ბულეანი",
    function: "ფუნქცია",
    array: "მასივი"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `არასწორი შეყვანა: მოსალოდნელი instanceof ${issue2.expected}, მიღებული ${received}`;
        }
        return `არასწორი შეყვანა: მოსალოდნელი ${expected}, მიღებული ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue2.values[0])}`;
        return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue2.values, "|")}-დან`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
        return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} იყოს ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `არასწორი სტრინგი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
        }
        if (_issue.format === "ends_with")
          return `არასწორი სტრინგი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
        if (_issue.format === "includes")
          return `არასწორი სტრინგი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
        if (_issue.format === "regex")
          return `არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
        return `არასწორი ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${issue2.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${issue2.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${issue2.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${issue2.origin}-ში`;
      default:
        return `არასწორი შეყვანა`;
    }
  };
};
var init_ka = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/km.js
function km_default() {
  return {
    localeError: error24()
  };
}
var error24 = () => {
  const Sizable = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ទិន្នន័យបញ្ចូល",
    email: "អាសយដ្ឋានអ៊ីមែល",
    url: "URL",
    emoji: "សញ្ញាអារម្មណ៍",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
    date: "កាលបរិច្ឆេទ ISO",
    time: "ម៉ោង ISO",
    duration: "រយៈពេល ISO",
    ipv4: "អាសយដ្ឋាន IPv4",
    ipv6: "អាសយដ្ឋាន IPv6",
    cidrv4: "ដែនអាសយដ្ឋាន IPv4",
    cidrv6: "ដែនអាសយដ្ឋាន IPv6",
    base64: "ខ្សែអក្សរអ៊ិកូដ base64",
    base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
    json_string: "ខ្សែអក្សរ JSON",
    e164: "លេខ E.164",
    jwt: "JWT",
    template_literal: "ទិន្នន័យបញ្ចូល"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "លេខ",
    array: "អារេ (Array)",
    null: "គ្មានតម្លៃ (null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${issue2.expected} ប៉ុន្តែទទួលបាន ${received}`;
        }
        return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${expected} ប៉ុន្តែទទួលបាន ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue2.values[0])}`;
        return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
        return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
        return `មិនត្រឹមត្រូវ៖ ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue2.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
      case "invalid_union":
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
      default:
        return `ទិន្នន័យមិនត្រឹមត្រូវ`;
    }
  };
};
var init_km = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/kh.js
function kh_default() {
  return km_default();
}
var init_kh = __esm(() => {
  init_km();
});

// node_modules/zod/v4/locales/ko.js
function ko_default() {
  return {
    localeError: error25()
  };
}
var error25 = () => {
  const Sizable = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `잘못된 입력: 예상 타입은 instanceof ${issue2.expected}, 받은 타입은 ${received}입니다`;
        }
        return `잘못된 입력: 예상 타입은 ${expected}, 받은 타입은 ${received}입니다`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `잘못된 입력: 값은 ${stringifyPrimitive(issue2.values[0])} 이어야 합니다`;
        return `잘못된 옵션: ${joinValues(issue2.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const adj = issue2.inclusive ? "이하" : "미만";
        const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue2.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing)
          return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()}${unit} ${adj}${suffix}`;
        return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()} ${adj}${suffix}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "이상" : "초과";
        const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
        const sizing = getSizing(issue2.origin);
        const unit = sizing?.unit ?? "요소";
        if (sizing) {
          return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()}${unit} ${adj}${suffix}`;
        }
        return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()} ${adj}${suffix}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
        }
        if (_issue.format === "ends_with")
          return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
        if (_issue.format === "includes")
          return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
        if (_issue.format === "regex")
          return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
        return `잘못된 ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${issue2.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${issue2.origin}`;
      case "invalid_union":
        return `잘못된 입력`;
      case "invalid_element":
        return `잘못된 값: ${issue2.origin}`;
      default:
        return `잘못된 입력`;
    }
  };
};
var init_ko = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/lt.js
function getUnitTypeFromNumber(number2) {
  const abs = Math.abs(number2);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 19 || last === 0)
    return "many";
  if (last === 1)
    return "one";
  return "few";
}
function lt_default() {
  return {
    localeError: error26()
  };
}
var capitalizeFirstCharacter = (text2) => {
  return text2.charAt(0).toUpperCase() + text2.slice(1);
}, error26 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simbolių"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne ilgesnė kaip",
          notInclusive: "turi būti trumpesnė kaip"
        },
        bigger: {
          inclusive: "turi būti ne trumpesnė kaip",
          notInclusive: "turi būti ilgesnė kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "baitų"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne didesnis kaip",
          notInclusive: "turi būti mažesnis kaip"
        },
        bigger: {
          inclusive: "turi būti ne mažesnis kaip",
          notInclusive: "turi būti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    }
  };
  function getSizing(origin, unitType, inclusive, targetShouldBe) {
    const result = Sizable[origin] ?? null;
    if (result === null)
      return result;
    return {
      unit: result.unit[unitType],
      verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
    };
  }
  const FormatDictionary = {
    regex: "įvestis",
    email: "el. pašto adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukmė",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 užkoduota eilutė",
    base64url: "base64url užkoduota eilutė",
    json_string: "JSON eilutė",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "įvestis"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "skaičius",
    bigint: "sveikasis skaičius",
    string: "eilutė",
    boolean: "loginė reikšmė",
    undefined: "neapibrėžta reikšmė",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulinė reikšmė"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Gautas tipas ${received}, o tikėtasi - instanceof ${issue2.expected}`;
        }
        return `Gautas tipas ${received}, o tikėtasi - ${expected}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Privalo būti ${stringifyPrimitive(issue2.values[0])}`;
        return `Privalo būti vienas iš ${joinValues(issue2.values, "|")} pasirinkimų`;
      case "too_big": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.maximum)), issue2.inclusive ?? false, "smaller");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.maximum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue2.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.maximum.toString()} ${sizing?.unit}`;
      }
      case "too_small": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.minimum)), issue2.inclusive ?? false, "bigger");
        if (sizing?.verb)
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.minimum.toString()} ${sizing.unit ?? "elementų"}`;
        const adj = issue2.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.minimum.toString()} ${sizing?.unit}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Eilutė privalo prasidėti "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Eilutė privalo įtraukti "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Eilutė privalo atitikti ${_issue.pattern}`;
        return `Neteisingas ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${issue2.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${issue2.keys.length > 1 ? "i" : "as"} rakt${issue2.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
        return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
};
var init_lt = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/mk.js
function mk_default() {
  return {
    localeError: error27()
  };
}
var error27 = () => {
  const Sizable = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "број",
    array: "низа"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Грешен внес: се очекува instanceof ${issue2.expected}, примено ${received}`;
        }
        return `Грешен внес: се очекува ${expected}, примено ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Грешана опција: се очекува една ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да има ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементи"}`;
        return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да биде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Премногу мал: се очекува ${issue2.origin} да има ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Премногу мал: се очекува ${issue2.origin} да биде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${issue2.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${issue2.origin}`;
      default:
        return `Грешен внес`;
    }
  };
};
var init_mk = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ms.js
function ms_default() {
  return {
    localeError: error28()
  };
}
var error28 = () => {
  const Sizable = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombor"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Input tidak sah: dijangka instanceof ${issue2.expected}, diterima ${received}`;
        }
        return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Input tidak sah: dijangka ${stringifyPrimitive(issue2.values[0])}`;
        return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
        return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} adalah ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Terlalu kecil: dijangka ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Terlalu kecil: dijangka ${issue2.origin} adalah ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${issue2.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${issue2.origin}`;
      default:
        return `Input tidak sah`;
    }
  };
};
var init_ms = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/nl.js
function nl_default() {
  return {
    localeError: error29()
  };
}
var error29 = () => {
  const Sizable = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "getal"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ongeldige invoer: verwacht instanceof ${issue2.expected}, ontving ${received}`;
        }
        return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue2.values[0])}`;
        return `Ongeldige optie: verwacht één van ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        const longName = issue2.origin === "date" ? "laat" : issue2.origin === "string" ? "lang" : "groot";
        if (sizing)
          return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
        return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} is`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        const shortName = issue2.origin === "date" ? "vroeg" : issue2.origin === "string" ? "kort" : "klein";
        if (sizing) {
          return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} is`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
        }
        if (_issue.format === "ends_with")
          return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
        if (_issue.format === "includes")
          return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
        if (_issue.format === "regex")
          return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
        return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${issue2.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${issue2.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${issue2.origin}`;
      default:
        return `Ongeldige invoer`;
    }
  };
};
var init_nl = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/no.js
function no_default() {
  return {
    localeError: error30()
  };
}
var error30 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ugyldig input: forventet instanceof ${issue2.expected}, fikk ${received}`;
        }
        return `Ugyldig input: forventet ${expected}, fikk ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ugyldig verdi: forventet ${stringifyPrimitive(issue2.values[0])}`;
        return `Ugyldig valg: forventet en av ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
        return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ugyldig streng: må starte med "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ugyldig streng: må ende med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ugyldig streng: må inneholde "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
        return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${issue2.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${issue2.origin}`;
      default:
        return `Ugyldig input`;
    }
  };
};
var init_no = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ota.js
function ota_default() {
  return {
    localeError: error31()
  };
}
var error31 = () => {
  const Sizable = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Fâsit giren: umulan instanceof ${issue2.expected}, alınan ${received}`;
        }
        return `Fâsit giren: umulan ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Fâsit giren: umulan ${stringifyPrimitive(issue2.values[0])}`;
        return `Fâsit tercih: mûteberler ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
        return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
        }
        return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
        if (_issue.format === "ends_with")
          return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
        if (_issue.format === "includes")
          return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
        if (_issue.format === "regex")
          return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
        return `Fâsit ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${issue2.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${issue2.origin} için tanınmayan kıymet var.`;
      default:
        return `Kıymet tanınamadı.`;
    }
  };
};
var init_ota = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ps.js
function ps_default() {
  return {
    localeError: error32()
  };
}
var error32 = () => {
  const Sizable = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ورودي",
    email: "بریښنالیک",
    url: "یو آر ال",
    emoji: "ایموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "نیټه او وخت",
    date: "نېټه",
    time: "وخت",
    duration: "موده",
    ipv4: "د IPv4 پته",
    ipv6: "د IPv6 پته",
    cidrv4: "د IPv4 ساحه",
    cidrv6: "د IPv6 ساحه",
    base64: "base64-encoded متن",
    base64url: "base64url-encoded متن",
    json_string: "JSON متن",
    e164: "د E.164 شمېره",
    jwt: "JWT",
    template_literal: "ورودي"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "عدد",
    array: "ارې"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ناسم ورودي: باید instanceof ${issue2.expected} وای, مګر ${received} ترلاسه شو`;
        }
        return `ناسم ورودي: باید ${expected} وای, مګر ${received} ترلاسه شو`;
      }
      case "invalid_value":
        if (issue2.values.length === 1) {
          return `ناسم ورودي: باید ${stringifyPrimitive(issue2.values[0])} وای`;
        }
        return `ناسم انتخاب: باید یو له ${joinValues(issue2.values, "|")} څخه وای`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
        }
        return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} وي`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} ولري`;
        }
        return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
        }
        if (_issue.format === "ends_with") {
          return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
        }
        if (_issue.format === "includes") {
          return `ناسم متن: باید "${_issue.includes}" ولري`;
        }
        if (_issue.format === "regex") {
          return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
        }
        return `${FormatDictionary[_issue.format] ?? issue2.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${issue2.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${issue2.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${issue2.origin} کې`;
      case "invalid_union":
        return `ناسمه ورودي`;
      case "invalid_element":
        return `ناسم عنصر په ${issue2.origin} کې`;
      default:
        return `ناسمه ورودي`;
    }
  };
};
var init_ps = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/pl.js
function pl_default() {
  return {
    localeError: error33()
  };
}
var error33 = () => {
  const Sizable = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${issue2.expected}, otrzymano ${received}`;
        }
        return `Nieprawidłowe dane wejściowe: oczekiwano ${expected}, otrzymano ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue2.values[0])}`;
        return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Za duża wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt duż(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Za mała wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "elementów"}`;
        }
        return `Zbyt mał(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
        return `Nieprawidłow(y/a/e) ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${issue2.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${issue2.origin}`;
      default:
        return `Nieprawidłowe dane wejściowe`;
    }
  };
};
var init_pl = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/pt.js
function pt_default() {
  return {
    localeError: error34()
  };
}
var error34 = () => {
  const Sizable = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "número",
    null: "nulo"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Tipo inválido: esperado instanceof ${issue2.expected}, recebido ${received}`;
        }
        return `Tipo inválido: esperado ${expected}, recebido ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Entrada inválida: esperado ${stringifyPrimitive(issue2.values[0])}`;
        return `Opção inválida: esperada uma das ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Muito grande: esperado que ${issue2.origin ?? "valor"} tivesse ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
        return `Muito grande: esperado que ${issue2.origin ?? "valor"} fosse ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Muito pequeno: esperado que ${issue2.origin} tivesse ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Muito pequeno: esperado que ${issue2.origin} fosse ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Texto inválido: deve começar com "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Texto inválido: deve terminar com "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Texto inválido: deve incluir "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chave${issue2.keys.length > 1 ? "s" : ""} desconhecida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${issue2.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${issue2.origin}`;
      default:
        return `Campo inválido`;
    }
  };
};
var init_pt = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ru.js
function getRussianPlural(count, one, few, many) {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}
function ru_default() {
  return {
    localeError: error35()
  };
}
var error35 = () => {
  const Sizable = {
    string: {
      unit: {
        one: "символ",
        few: "символа",
        many: "символов"
      },
      verb: "иметь"
    },
    file: {
      unit: {
        one: "байт",
        few: "байта",
        many: "байт"
      },
      verb: "иметь"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "массив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Неверный ввод: ожидалось instanceof ${issue2.expected}, получено ${received}`;
        }
        return `Неверный ввод: ожидалось ${expected}, получено ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Неверный ввод: ожидалось ${stringifyPrimitive(issue2.values[0])}`;
        return `Неверный вариант: ожидалось одно из ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const maxValue = Number(issue2.maximum);
          const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет иметь ${adj}${issue2.maximum.toString()} ${unit}`;
        }
        return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          const minValue = Number(issue2.minimum);
          const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет иметь ${adj}${issue2.minimum.toString()} ${unit}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неверная строка: должна содержать "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
        return `Неверный ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${issue2.keys.length > 1 ? "ые" : "ый"} ключ${issue2.keys.length > 1 ? "и" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${issue2.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${issue2.origin}`;
      default:
        return `Неверные входные данные`;
    }
  };
};
var init_ru = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/sl.js
function sl_default() {
  return {
    localeError: error36()
  };
}
var error36 = () => {
  const Sizable = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "število",
    array: "tabela"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Neveljaven vnos: pričakovano instanceof ${issue2.expected}, prejeto ${received}`;
        }
        return `Neveljaven vnos: pričakovano ${expected}, prejeto ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue2.values[0])}`;
        return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} imelo ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementov"}`;
        return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Premajhno: pričakovano, da bo ${issue2.origin} imelo ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Premajhno: pričakovano, da bo ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
        return `Neveljaven ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${issue2.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${issue2.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${issue2.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
var init_sl = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/sv.js
function sv_default() {
  return {
    localeError: error37()
  };
}
var error37 = () => {
  const Sizable = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "reguljärt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad sträng",
    base64url: "base64url-kodad sträng",
    json_string: "JSON-sträng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ogiltig inmatning: förväntat instanceof ${issue2.expected}, fick ${received}`;
        }
        return `Ogiltig inmatning: förväntat ${expected}, fick ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue2.values[0])}`;
        return `Ogiltigt val: förväntade en av ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `För stor(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
        }
        return `För stor(t): förväntat ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
        return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${issue2.divisor}`;
      case "unrecognized_keys":
        return `${issue2.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${issue2.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${issue2.origin ?? "värdet"}`;
      default:
        return `Ogiltig input`;
    }
  };
};
var init_sv = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ta.js
function ta_default() {
  return {
    localeError: error38()
  };
}
var error38 = () => {
  const Sizable = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "எண்",
    array: "அணி",
    null: "வெறுமை"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${issue2.expected}, பெறப்பட்டது ${received}`;
        }
        return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${expected}, பெறப்பட்டது ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue2.values[0])}`;
        return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue2.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
        }
        return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
        }
        return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
        if (_issue.format === "ends_with")
          return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
        if (_issue.format === "includes")
          return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
        if (_issue.format === "regex")
          return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
        return `தவறான ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${issue2.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${issue2.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${issue2.origin} இல் தவறான மதிப்பு`;
      default:
        return `தவறான உள்ளீடு`;
    }
  };
};
var init_ta = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/th.js
function th_default() {
  return {
    localeError: error39()
  };
}
var error39 = () => {
  const Sizable = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "ตัวเลข",
    array: "อาร์เรย์ (Array)",
    null: "ไม่มีค่า (null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${issue2.expected} แต่ได้รับ ${received}`;
        }
        return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${expected} แต่ได้รับ ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue2.values[0])}`;
        return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "ไม่เกิน" : "น้อยกว่า";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
        return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? "อย่างน้อย" : "มากกว่า";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
        if (_issue.format === "regex")
          return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
        return `รูปแบบไม่ถูกต้อง: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue2.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${issue2.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${issue2.origin}`;
      default:
        return `ข้อมูลไม่ถูกต้อง`;
    }
  };
};
var init_th = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/tr.js
function tr_default() {
  return {
    localeError: error40()
  };
}
var error40 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Geçersiz değer: beklenen instanceof ${issue2.expected}, alınan ${received}`;
        }
        return `Geçersiz değer: beklenen ${expected}, alınan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Geçersiz değer: beklenen ${stringifyPrimitive(issue2.values[0])}`;
        return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "öğe"}`;
        return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
        if (_issue.format === "ends_with")
          return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
        if (_issue.format === "includes")
          return `Geçersiz metin: "${_issue.includes}" içermeli`;
        if (_issue.format === "regex")
          return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
        return `Geçersiz ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${issue2.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${issue2.origin} içinde geçersiz değer`;
      default:
        return `Geçersiz değer`;
    }
  };
};
var init_tr = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/uk.js
function uk_default() {
  return {
    localeError: error41()
  };
}
var error41 = () => {
  const Sizable = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Неправильні вхідні дані: очікується instanceof ${issue2.expected}, отримано ${received}`;
        }
        return `Неправильні вхідні дані: очікується ${expected}, отримано ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue2.values[0])}`;
        return `Неправильна опція: очікується одне з ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементів"}`;
        return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} буде ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Занадто мале: очікується, що ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Занадто мале: очікується, що ${issue2.origin} буде ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Неправильний рядок: повинен містити "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
        return `Неправильний ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${issue2.keys.length > 1 ? "і" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${issue2.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${issue2.origin}`;
      default:
        return `Неправильні вхідні дані`;
    }
  };
};
var init_uk = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/ua.js
function ua_default() {
  return uk_default();
}
var init_ua = __esm(() => {
  init_uk();
});

// node_modules/zod/v4/locales/ur.js
function ur_default() {
  return {
    localeError: error42()
  };
}
var error42 = () => {
  const Sizable = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "نمبر",
    array: "آرے",
    null: "نل"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `غلط ان پٹ: instanceof ${issue2.expected} متوقع تھا، ${received} موصول ہوا`;
        }
        return `غلط ان پٹ: ${expected} متوقع تھا، ${received} موصول ہوا`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `غلط ان پٹ: ${stringifyPrimitive(issue2.values[0])} متوقع تھا`;
        return `غلط آپشن: ${joinValues(issue2.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کے ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
        return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کا ${adj}${issue2.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `بہت چھوٹا: ${issue2.origin} کے ${adj}${issue2.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
        }
        return `بہت چھوٹا: ${issue2.origin} کا ${adj}${issue2.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
        }
        if (_issue.format === "ends_with")
          return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
        if (_issue.format === "includes")
          return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
        if (_issue.format === "regex")
          return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
        return `غلط ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${issue2.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${issue2.keys.length > 1 ? "ز" : ""}: ${joinValues(issue2.keys, "، ")}`;
      case "invalid_key":
        return `${issue2.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${issue2.origin} میں غلط ویلیو`;
      default:
        return `غلط ان پٹ`;
    }
  };
};
var init_ur = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/uz.js
function uz_default() {
  return {
    localeError: error43()
  };
}
var error43 = () => {
  const Sizable = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Noto‘g‘ri kirish: kutilgan instanceof ${issue2.expected}, qabul qilingan ${received}`;
        }
        return `Noto‘g‘ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Noto‘g‘ri kirish: kutilgan ${stringifyPrimitive(issue2.values[0])}`;
        return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
        return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
        }
        return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Noto‘g‘ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
        if (_issue.format === "ends_with")
          return `Noto‘g‘ri satr: "${_issue.suffix}" bilan tugashi kerak`;
        if (_issue.format === "includes")
          return `Noto‘g‘ri satr: "${_issue.includes}" ni o‘z ichiga olishi kerak`;
        if (_issue.format === "regex")
          return `Noto‘g‘ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
        return `Noto‘g‘ri ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${issue2.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${issue2.origin} da noto‘g‘ri qiymat`;
      default:
        return `Noto‘g‘ri kirish`;
    }
  };
};
var init_uz = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/vi.js
function vi_default() {
  return {
    localeError: error44()
  };
}
var error44 = () => {
  const Sizable = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "số",
    array: "mảng"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Đầu vào không hợp lệ: mong đợi instanceof ${issue2.expected}, nhận được ${received}`;
        }
        return `Đầu vào không hợp lệ: mong đợi ${expected}, nhận được ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue2.values[0])}`;
        return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
        return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Quá nhỏ: mong đợi ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Quá nhỏ: mong đợi ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
        return `${FormatDictionary[_issue.format] ?? issue2.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${issue2.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${issue2.origin}`;
      default:
        return `Đầu vào không hợp lệ`;
    }
  };
};
var init_vi = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/zh-CN.js
function zh_CN_default() {
  return {
    localeError: error45()
  };
}
var error45 = () => {
  const Sizable = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "数字",
    array: "数组",
    null: "空值(null)"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `无效输入：期望 instanceof ${issue2.expected}，实际接收 ${received}`;
        }
        return `无效输入：期望 ${expected}，实际接收 ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `无效输入：期望 ${stringifyPrimitive(issue2.values[0])}`;
        return `无效选项：期望以下之一 ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "个元素"}`;
        return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `无效字符串：必须以 "${_issue.prefix}" 开头`;
        if (_issue.format === "ends_with")
          return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
        if (_issue.format === "includes")
          return `无效字符串：必须包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
        return `无效${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${issue2.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `${issue2.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${issue2.origin} 中包含无效值(value)`;
      default:
        return `无效输入`;
    }
  };
};
var init_zh_CN = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/zh-TW.js
function zh_TW_default() {
  return {
    localeError: error46()
  };
}
var error46 = () => {
  const Sizable = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `無效的輸入值：預期為 instanceof ${issue2.expected}，但收到 ${received}`;
        }
        return `無效的輸入值：預期為 ${expected}，但收到 ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `無效的輸入值：預期為 ${stringifyPrimitive(issue2.values[0])}`;
        return `無效的選項：預期為以下其中之一 ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "個元素"}`;
        return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
        }
        if (_issue.format === "ends_with")
          return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
        if (_issue.format === "includes")
          return `無效的字串：必須包含 "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `無效的字串：必須符合格式 ${_issue.pattern}`;
        return `無效的 ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${issue2.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${issue2.keys.length > 1 ? "們" : ""}：${joinValues(issue2.keys, "、")}`;
      case "invalid_key":
        return `${issue2.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${issue2.origin} 中有無效的值`;
      default:
        return `無效的輸入值`;
    }
  };
};
var init_zh_TW = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/yo.js
function yo_default() {
  return {
    localeError: error47()
  };
}
var error47 = () => {
  const Sizable = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "ẹ̀rọ ìbáwọlé",
    email: "àdírẹ́sì ìmẹ́lì",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "àkókò ISO",
    date: "ọjọ́ ISO",
    time: "àkókò ISO",
    duration: "àkókò tó pé ISO",
    ipv4: "àdírẹ́sì IPv4",
    ipv6: "àdírẹ́sì IPv6",
    cidrv4: "àgbègbè IPv4",
    cidrv6: "àgbègbè IPv6",
    base64: "ọ̀rọ̀ tí a kọ́ ní base64",
    base64url: "ọ̀rọ̀ base64url",
    json_string: "ọ̀rọ̀ JSON",
    e164: "nọ́mbà E.164",
    jwt: "JWT",
    template_literal: "ẹ̀rọ ìbáwọlé"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nọ́mbà",
    array: "akopọ"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue2.expected)) {
          return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${issue2.expected}, àmọ̀ a rí ${received}`;
        }
        return `Ìbáwọlé aṣìṣe: a ní láti fi ${expected}, àmọ̀ a rí ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue2.values[0])}`;
        return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue2.origin ?? "iye"} ${sizing.verb} ${adj}${issue2.maximum} ${sizing.unit}`;
        return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue2.maximum}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Kéré ju: a ní láti jẹ́ pé ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum} ${sizing.unit}`;
        return `Kéré ju: a ní láti jẹ́ ${adj}${issue2.minimum}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
        return `Aṣìṣe: ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${issue2.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${issue2.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
};
var init_yo = __esm(() => {
  init_util();
});

// node_modules/zod/v4/locales/index.js
var exports_locales = {};
__export(exports_locales, {
  zhTW: () => zh_TW_default,
  zhCN: () => zh_CN_default,
  yo: () => yo_default,
  vi: () => vi_default,
  uz: () => uz_default,
  ur: () => ur_default,
  uk: () => uk_default,
  ua: () => ua_default,
  tr: () => tr_default,
  th: () => th_default,
  ta: () => ta_default,
  sv: () => sv_default,
  sl: () => sl_default,
  ru: () => ru_default,
  pt: () => pt_default,
  ps: () => ps_default,
  pl: () => pl_default,
  ota: () => ota_default,
  no: () => no_default,
  nl: () => nl_default,
  ms: () => ms_default,
  mk: () => mk_default,
  lt: () => lt_default,
  ko: () => ko_default,
  km: () => km_default,
  kh: () => kh_default,
  ka: () => ka_default,
  ja: () => ja_default,
  it: () => it_default,
  is: () => is_default,
  id: () => id_default,
  hy: () => hy_default,
  hu: () => hu_default,
  he: () => he_default,
  frCA: () => fr_CA_default,
  fr: () => fr_default,
  fi: () => fi_default,
  fa: () => fa_default,
  es: () => es_default,
  eo: () => eo_default,
  en: () => en_default,
  de: () => de_default,
  da: () => da_default,
  cs: () => cs_default,
  ca: () => ca_default,
  bg: () => bg_default,
  be: () => be_default,
  az: () => az_default,
  ar: () => ar_default
});
var init_locales = __esm(() => {
  init_ar();
  init_az();
  init_be();
  init_bg();
  init_ca();
  init_cs();
  init_da();
  init_de();
  init_en();
  init_eo();
  init_es();
  init_fa();
  init_fi();
  init_fr();
  init_fr_CA();
  init_he();
  init_hu();
  init_hy();
  init_id();
  init_is();
  init_it();
  init_ja();
  init_ka();
  init_kh();
  init_km();
  init_ko();
  init_lt();
  init_mk();
  init_ms();
  init_nl();
  init_no();
  init_ota();
  init_ps();
  init_pl();
  init_pt();
  init_ru();
  init_sl();
  init_sv();
  init_ta();
  init_th();
  init_tr();
  init_ua();
  init_uk();
  init_ur();
  init_uz();
  init_vi();
  init_zh_CN();
  init_zh_TW();
  init_yo();
});

// node_modules/zod/v4/core/registries.js
class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p2 = schema._zod.parent;
    if (p2) {
      const pm = { ...this.get(p2) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
var _a, $output, $input, globalRegistry;
var init_registries = __esm(() => {
  $output = Symbol("ZodOutput");
  $input = Symbol("ZodInput");
  (_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
  globalRegistry = globalThis.__zod_globalRegistry;
});

// node_modules/zod/v4/core/api.js
function _string(Class2, params) {
  return new Class2({
    type: "string",
    ...normalizeParams(params)
  });
}
function _coercedString(Class2, params) {
  return new Class2({
    type: "string",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _mac(Class2, params) {
  return new Class2({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class2, params) {
  return new Class2({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _coercedNumber(Class2, params) {
  return new Class2({
    type: "number",
    coerce: true,
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _float32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float32",
    ...normalizeParams(params)
  });
}
function _float64(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float64",
    ...normalizeParams(params)
  });
}
function _int32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "int32",
    ...normalizeParams(params)
  });
}
function _uint32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "uint32",
    ...normalizeParams(params)
  });
}
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _coercedBoolean(Class2, params) {
  return new Class2({
    type: "boolean",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _bigint(Class2, params) {
  return new Class2({
    type: "bigint",
    ...normalizeParams(params)
  });
}
function _coercedBigint(Class2, params) {
  return new Class2({
    type: "bigint",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _int64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "int64",
    ...normalizeParams(params)
  });
}
function _uint64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "uint64",
    ...normalizeParams(params)
  });
}
function _symbol(Class2, params) {
  return new Class2({
    type: "symbol",
    ...normalizeParams(params)
  });
}
function _undefined2(Class2, params) {
  return new Class2({
    type: "undefined",
    ...normalizeParams(params)
  });
}
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
function _any(Class2) {
  return new Class2({
    type: "any"
  });
}
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
function _void(Class2, params) {
  return new Class2({
    type: "void",
    ...normalizeParams(params)
  });
}
function _date(Class2, params) {
  return new Class2({
    type: "date",
    ...normalizeParams(params)
  });
}
function _coercedDate(Class2, params) {
  return new Class2({
    type: "date",
    coerce: true,
    ...normalizeParams(params)
  });
}
function _nan(Class2, params) {
  return new Class2({
    type: "nan",
    ...normalizeParams(params)
  });
}
function _lt(value2, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value: value2,
    inclusive: false
  });
}
function _lte(value2, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value: value2,
    inclusive: true
  });
}
function _gt(value2, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value: value2,
    inclusive: false
  });
}
function _gte(value2, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value: value2,
    inclusive: true
  });
}
function _positive(params) {
  return _gt(0, params);
}
function _negative(params) {
  return _lt(0, params);
}
function _nonpositive(params) {
  return _lte(0, params);
}
function _nonnegative(params) {
  return _gte(0, params);
}
function _multipleOf(value2, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value: value2
  });
}
function _maxSize(maximum, params) {
  return new $ZodCheckMaxSize({
    check: "max_size",
    ...normalizeParams(params),
    maximum
  });
}
function _minSize(minimum, params) {
  return new $ZodCheckMinSize({
    check: "min_size",
    ...normalizeParams(params),
    minimum
  });
}
function _size(size, params) {
  return new $ZodCheckSizeEquals({
    check: "size_equals",
    ...normalizeParams(params),
    size
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _property(property, schema, params) {
  return new $ZodCheckProperty({
    check: "property",
    property,
    schema,
    ...normalizeParams(params)
  });
}
function _mime(types, params) {
  return new $ZodCheckMimeType({
    check: "mime_type",
    mime: types,
    ...normalizeParams(params)
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _union(Class2, options, params) {
  return new Class2({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
function _xor(Class2, options, params) {
  return new Class2({
    type: "union",
    options,
    inclusive: false,
    ...normalizeParams(params)
  });
}
function _discriminatedUnion(Class2, discriminator, options, params) {
  return new Class2({
    type: "union",
    options,
    discriminator,
    ...normalizeParams(params)
  });
}
function _intersection(Class2, left, right) {
  return new Class2({
    type: "intersection",
    left,
    right
  });
}
function _tuple(Class2, items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new Class2({
    type: "tuple",
    items,
    rest,
    ...normalizeParams(params)
  });
}
function _record(Class2, keyType, valueType, params) {
  return new Class2({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function _map(Class2, keyType, valueType, params) {
  return new Class2({
    type: "map",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function _set(Class2, valueType, params) {
  return new Class2({
    type: "set",
    valueType,
    ...normalizeParams(params)
  });
}
function _enum(Class2, values2, params) {
  const entries = Array.isArray(values2) ? Object.fromEntries(values2.map((v2) => [v2, v2])) : values2;
  return new Class2({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function _nativeEnum(Class2, entries, params) {
  return new Class2({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function _literal(Class2, value2, params) {
  return new Class2({
    type: "literal",
    values: Array.isArray(value2) ? value2 : [value2],
    ...normalizeParams(params)
  });
}
function _file(Class2, params) {
  return new Class2({
    type: "file",
    ...normalizeParams(params)
  });
}
function _transform(Class2, fn) {
  return new Class2({
    type: "transform",
    transform: fn
  });
}
function _optional(Class2, innerType) {
  return new Class2({
    type: "optional",
    innerType
  });
}
function _nullable(Class2, innerType) {
  return new Class2({
    type: "nullable",
    innerType
  });
}
function _default(Class2, innerType, defaultValue) {
  return new Class2({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function _nonoptional(Class2, innerType, params) {
  return new Class2({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
function _success(Class2, innerType) {
  return new Class2({
    type: "success",
    innerType
  });
}
function _catch(Class2, innerType, catchValue) {
  return new Class2({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
function _pipe(Class2, in_, out) {
  return new Class2({
    type: "pipe",
    in: in_,
    out
  });
}
function _readonly(Class2, innerType) {
  return new Class2({
    type: "readonly",
    innerType
  });
}
function _templateLiteral(Class2, parts, params) {
  return new Class2({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
function _lazy(Class2, getter) {
  return new Class2({
    type: "lazy",
    getter
  });
}
function _promise(Class2, innerType) {
  return new Class2({
    type: "promise",
    innerType
  });
}
function _custom(Class2, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  });
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
function describe(description) {
  const ch = new $ZodCheck({ check: "describe" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, description });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
function meta(metadata) {
  const ch = new $ZodCheck({ check: "meta" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, ...metadata });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
function _stringbool(Classes, _params) {
  const params = normalizeParams(_params);
  let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
  let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (params.case !== "sensitive") {
    truthyArray = truthyArray.map((v2) => typeof v2 === "string" ? v2.toLowerCase() : v2);
    falsyArray = falsyArray.map((v2) => typeof v2 === "string" ? v2.toLowerCase() : v2);
  }
  const truthySet = new Set(truthyArray);
  const falsySet = new Set(falsyArray);
  const _Codec = Classes.Codec ?? $ZodCodec;
  const _Boolean = Classes.Boolean ?? $ZodBoolean;
  const _String = Classes.String ?? $ZodString;
  const stringSchema = new _String({ type: "string", error: params.error });
  const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
  const codec = new _Codec({
    type: "pipe",
    in: stringSchema,
    out: booleanSchema,
    transform: (input, payload) => {
      let data = input;
      if (params.case !== "sensitive")
        data = data.toLowerCase();
      if (truthySet.has(data)) {
        return true;
      } else if (falsySet.has(data)) {
        return false;
      } else {
        payload.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...truthySet, ...falsySet],
          input: payload.value,
          inst: codec,
          continue: false
        });
        return {};
      }
    },
    reverseTransform: (input, _payload) => {
      if (input === true) {
        return truthyArray[0] || "true";
      } else {
        return falsyArray[0] || "false";
      }
    },
    error: params.error
  });
  return codec;
}
function _stringFormat(Class2, format, fnOrRegex, _params = {}) {
  const params = normalizeParams(_params);
  const def = {
    ...normalizeParams(_params),
    check: "string_format",
    type: "string",
    format,
    fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
    ...params
  };
  if (fnOrRegex instanceof RegExp) {
    def.pattern = fnOrRegex;
  }
  const inst = new Class2(def);
  return inst;
}
var TimePrecision;
var init_api = __esm(() => {
  init_checks();
  init_registries();
  init_schemas();
  init_util();
  TimePrecision = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6
  };
});

// node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? undefined
  };
}
function process3(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a2;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process3(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    Object.assign(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && result.schema._prefault)
    (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option2 of def.options) {
      if (isTransforming(option2, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process3(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
}, createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process3(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var init_to_json_schema = __esm(() => {
  init_registries();
});

// node_modules/zod/v4/core/json-schema-processors.js
function toJSONSchema(input, params) {
  if ("_idmap" in input) {
    const registry2 = input;
    const ctx2 = initializeContext({ ...params, processors: allProcessors });
    const defs = {};
    for (const entry of registry2._idmap.entries()) {
      const [_3, schema] = entry;
      process3(schema, ctx2);
    }
    const schemas = {};
    const external = {
      registry: registry2,
      uri: params?.uri,
      defs
    };
    ctx2.external = external;
    for (const entry of registry2._idmap.entries()) {
      const [key, schema] = entry;
      extractDefs(ctx2, schema);
      schemas[key] = finalize(ctx2, schema);
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = ctx2.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const ctx = initializeContext({ ...params, processors: allProcessors });
  process3(input, ctx);
  extractDefs(ctx, input);
  return finalize(ctx, input);
}
var formatMap, stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
}, numberProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  if (typeof exclusiveMinimum === "number") {
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  }
  if (typeof minimum === "number") {
    json.minimum = minimum;
    if (typeof exclusiveMinimum === "number" && ctx.target !== "draft-04") {
      if (exclusiveMinimum >= minimum)
        delete json.minimum;
      else
        delete json.exclusiveMinimum;
    }
  }
  if (typeof exclusiveMaximum === "number") {
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  }
  if (typeof maximum === "number") {
    json.maximum = maximum;
    if (typeof exclusiveMaximum === "number" && ctx.target !== "draft-04") {
      if (exclusiveMaximum <= maximum)
        delete json.maximum;
      else
        delete json.exclusiveMaximum;
    }
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
}, booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
}, bigintProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("BigInt cannot be represented in JSON Schema");
  }
}, symbolProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Symbols cannot be represented in JSON Schema");
  }
}, nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
}, undefinedProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Undefined cannot be represented in JSON Schema");
  }
}, voidProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Void cannot be represented in JSON Schema");
  }
}, neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
}, anyProcessor = (_schema, _ctx, _json, _params) => {
}, unknownProcessor = (_schema, _ctx, _json, _params) => {
}, dateProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Date cannot be represented in JSON Schema");
  }
}, enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values2 = getEnumValues(def.entries);
  if (values2.every((v2) => typeof v2 === "number"))
    json.type = "number";
  if (values2.every((v2) => typeof v2 === "string"))
    json.type = "string";
  json.enum = values2;
}, literalProcessor = (schema, ctx, json, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      } else {
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v2) => typeof v2 === "number"))
      json.type = "number";
    if (vals.every((v2) => typeof v2 === "string"))
      json.type = "string";
    if (vals.every((v2) => typeof v2 === "boolean"))
      json.type = "boolean";
    if (vals.every((v2) => v2 === null))
      json.type = "null";
    json.enum = vals;
  }
}, nanProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("NaN cannot be represented in JSON Schema");
  }
}, templateLiteralProcessor = (schema, _ctx, json, _params) => {
  const _json = json;
  const pattern = schema._zod.pattern;
  if (!pattern)
    throw new Error("Pattern not found in template literal");
  _json.type = "string";
  _json.pattern = pattern.source;
}, fileProcessor = (schema, _ctx, json, _params) => {
  const _json = json;
  const file = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  };
  const { minimum, maximum, mime } = schema._zod.bag;
  if (minimum !== undefined)
    file.minLength = minimum;
  if (maximum !== undefined)
    file.maxLength = maximum;
  if (mime) {
    if (mime.length === 1) {
      file.contentMediaType = mime[0];
      Object.assign(_json, file);
    } else {
      Object.assign(_json, file);
      _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
    }
  } else {
    Object.assign(_json, file);
  }
}, successProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
}, customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
}, functionProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Function types cannot be represented in JSON Schema");
  }
}, transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
}, mapProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Map cannot be represented in JSON Schema");
  }
}, setProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Set cannot be represented in JSON Schema");
  }
}, arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process3(def.element, ctx, { ...params, path: [...params.path, "items"] });
}, objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  json.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json.properties[key] = process3(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v2 = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v2.optin === undefined;
    } else {
      return v2.optout === undefined;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = process3(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
}, unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x4, i2) => process3(x4, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i2]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
}, intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a2 = process3(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b2 = process3(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a2) ? a2.allOf : [a2],
    ...isSimpleIntersection(b2) ? b2.allOf : [b2]
  ];
  json.allOf = allOf;
}, tupleProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "array";
  const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
  const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
  const prefixItems = def.items.map((x4, i2) => process3(x4, ctx, {
    ...params,
    path: [...params.path, prefixPath, i2]
  }));
  const rest = def.rest ? process3(def.rest, ctx, {
    ...params,
    path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def.items.length] : []]
  }) : null;
  if (ctx.target === "draft-2020-12") {
    json.prefixItems = prefixItems;
    if (rest) {
      json.items = rest;
    }
  } else if (ctx.target === "openapi-3.0") {
    json.items = {
      anyOf: prefixItems
    };
    if (rest) {
      json.items.anyOf.push(rest);
    }
    json.minItems = prefixItems.length;
    if (!rest) {
      json.maxItems = prefixItems.length;
    }
  } else {
    json.items = prefixItems;
    if (rest) {
      json.additionalItems = rest;
    }
  }
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
}, recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process3(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process3(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process3(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v2) => typeof v2 === "string" || typeof v2 === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues;
    }
  }
}, nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
}, nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
}, prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
}, catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
}, pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
  process3(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
}, promiseProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process3(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  process3(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, allProcessors;
var init_json_schema_processors = __esm(() => {
  init_to_json_schema();
  init_util();
  formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: ""
  };
  allProcessors = {
    string: stringProcessor,
    number: numberProcessor,
    boolean: booleanProcessor,
    bigint: bigintProcessor,
    symbol: symbolProcessor,
    null: nullProcessor,
    undefined: undefinedProcessor,
    void: voidProcessor,
    never: neverProcessor,
    any: anyProcessor,
    unknown: unknownProcessor,
    date: dateProcessor,
    enum: enumProcessor,
    literal: literalProcessor,
    nan: nanProcessor,
    template_literal: templateLiteralProcessor,
    file: fileProcessor,
    success: successProcessor,
    custom: customProcessor,
    function: functionProcessor,
    transform: transformProcessor,
    map: mapProcessor,
    set: setProcessor,
    array: arrayProcessor,
    object: objectProcessor,
    union: unionProcessor,
    intersection: intersectionProcessor,
    tuple: tupleProcessor,
    record: recordProcessor,
    nullable: nullableProcessor,
    nonoptional: nonoptionalProcessor,
    default: defaultProcessor,
    prefault: prefaultProcessor,
    catch: catchProcessor,
    pipe: pipeProcessor,
    readonly: readonlyProcessor,
    promise: promiseProcessor,
    optional: optionalProcessor,
    lazy: lazyProcessor
  };
});

// node_modules/zod/v4/core/json-schema-generator.js
class JSONSchemaGenerator {
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  get target() {
    return this.ctx.target;
  }
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  get override() {
    return this.ctx.override;
  }
  get io() {
    return this.ctx.io;
  }
  get counter() {
    return this.ctx.counter;
  }
  set counter(value2) {
    this.ctx.counter = value2;
  }
  get seen() {
    return this.ctx.seen;
  }
  constructor(params) {
    let normalizedTarget = params?.target ?? "draft-2020-12";
    if (normalizedTarget === "draft-4")
      normalizedTarget = "draft-04";
    if (normalizedTarget === "draft-7")
      normalizedTarget = "draft-07";
    this.ctx = initializeContext({
      processors: allProcessors,
      target: normalizedTarget,
      ...params?.metadata && { metadata: params.metadata },
      ...params?.unrepresentable && { unrepresentable: params.unrepresentable },
      ...params?.override && { override: params.override },
      ...params?.io && { io: params.io }
    });
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    return process3(schema, this.ctx, _params);
  }
  emit(schema, _params) {
    if (_params) {
      if (_params.cycles)
        this.ctx.cycles = _params.cycles;
      if (_params.reused)
        this.ctx.reused = _params.reused;
      if (_params.external)
        this.ctx.external = _params.external;
    }
    extractDefs(this.ctx, schema);
    const result = finalize(this.ctx, schema);
    const { "~standard": _3, ...plainResult } = result;
    return plainResult;
  }
}
var init_json_schema_generator = __esm(() => {
  init_json_schema_processors();
  init_to_json_schema();
});

// node_modules/zod/v4/core/json-schema.js
var exports_json_schema = {};
var init_json_schema = () => {
};

// node_modules/zod/v4/core/index.js
var exports_core2 = {};
__export(exports_core2, {
  version: () => version,
  util: () => exports_util,
  treeifyError: () => treeifyError,
  toJSONSchema: () => toJSONSchema,
  toDotPath: () => toDotPath,
  safeParseAsync: () => safeParseAsync,
  safeParse: () => safeParse,
  safeEncodeAsync: () => safeEncodeAsync,
  safeEncode: () => safeEncode,
  safeDecodeAsync: () => safeDecodeAsync,
  safeDecode: () => safeDecode,
  registry: () => registry,
  regexes: () => exports_regexes,
  process: () => process3,
  prettifyError: () => prettifyError,
  parseAsync: () => parseAsync2,
  parse: () => parse,
  meta: () => meta,
  locales: () => exports_locales,
  isValidJWT: () => isValidJWT,
  isValidBase64URL: () => isValidBase64URL,
  isValidBase64: () => isValidBase64,
  initializeContext: () => initializeContext,
  globalRegistry: () => globalRegistry,
  globalConfig: () => globalConfig,
  formatError: () => formatError,
  flattenError: () => flattenError,
  finalize: () => finalize,
  extractDefs: () => extractDefs,
  encodeAsync: () => encodeAsync,
  encode: () => encode,
  describe: () => describe,
  decodeAsync: () => decodeAsync,
  decode: () => decode,
  createToJSONSchemaMethod: () => createToJSONSchemaMethod,
  createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
  config: () => config,
  clone: () => clone,
  _xor: () => _xor,
  _xid: () => _xid,
  _void: () => _void,
  _uuidv7: () => _uuidv7,
  _uuidv6: () => _uuidv6,
  _uuidv4: () => _uuidv4,
  _uuid: () => _uuid,
  _url: () => _url,
  _uppercase: () => _uppercase,
  _unknown: () => _unknown,
  _union: () => _union,
  _undefined: () => _undefined2,
  _ulid: () => _ulid,
  _uint64: () => _uint64,
  _uint32: () => _uint32,
  _tuple: () => _tuple,
  _trim: () => _trim,
  _transform: () => _transform,
  _toUpperCase: () => _toUpperCase,
  _toLowerCase: () => _toLowerCase,
  _templateLiteral: () => _templateLiteral,
  _symbol: () => _symbol,
  _superRefine: () => _superRefine,
  _success: () => _success,
  _stringbool: () => _stringbool,
  _stringFormat: () => _stringFormat,
  _string: () => _string,
  _startsWith: () => _startsWith,
  _slugify: () => _slugify,
  _size: () => _size,
  _set: () => _set,
  _safeParseAsync: () => _safeParseAsync,
  _safeParse: () => _safeParse,
  _safeEncodeAsync: () => _safeEncodeAsync,
  _safeEncode: () => _safeEncode,
  _safeDecodeAsync: () => _safeDecodeAsync,
  _safeDecode: () => _safeDecode,
  _regex: () => _regex,
  _refine: () => _refine,
  _record: () => _record,
  _readonly: () => _readonly,
  _property: () => _property,
  _promise: () => _promise,
  _positive: () => _positive,
  _pipe: () => _pipe,
  _parseAsync: () => _parseAsync,
  _parse: () => _parse,
  _overwrite: () => _overwrite,
  _optional: () => _optional,
  _number: () => _number,
  _nullable: () => _nullable,
  _null: () => _null2,
  _normalize: () => _normalize,
  _nonpositive: () => _nonpositive,
  _nonoptional: () => _nonoptional,
  _nonnegative: () => _nonnegative,
  _never: () => _never,
  _negative: () => _negative,
  _nativeEnum: () => _nativeEnum,
  _nanoid: () => _nanoid,
  _nan: () => _nan,
  _multipleOf: () => _multipleOf,
  _minSize: () => _minSize,
  _minLength: () => _minLength,
  _min: () => _gte,
  _mime: () => _mime,
  _maxSize: () => _maxSize,
  _maxLength: () => _maxLength,
  _max: () => _lte,
  _map: () => _map,
  _mac: () => _mac,
  _lte: () => _lte,
  _lt: () => _lt,
  _lowercase: () => _lowercase,
  _literal: () => _literal,
  _length: () => _length,
  _lazy: () => _lazy,
  _ksuid: () => _ksuid,
  _jwt: () => _jwt,
  _isoTime: () => _isoTime,
  _isoDuration: () => _isoDuration,
  _isoDateTime: () => _isoDateTime,
  _isoDate: () => _isoDate,
  _ipv6: () => _ipv6,
  _ipv4: () => _ipv4,
  _intersection: () => _intersection,
  _int64: () => _int64,
  _int32: () => _int32,
  _int: () => _int,
  _includes: () => _includes,
  _guid: () => _guid,
  _gte: () => _gte,
  _gt: () => _gt,
  _float64: () => _float64,
  _float32: () => _float32,
  _file: () => _file,
  _enum: () => _enum,
  _endsWith: () => _endsWith,
  _encodeAsync: () => _encodeAsync,
  _encode: () => _encode,
  _emoji: () => _emoji2,
  _email: () => _email,
  _e164: () => _e164,
  _discriminatedUnion: () => _discriminatedUnion,
  _default: () => _default,
  _decodeAsync: () => _decodeAsync,
  _decode: () => _decode,
  _date: () => _date,
  _custom: () => _custom,
  _cuid2: () => _cuid2,
  _cuid: () => _cuid,
  _coercedString: () => _coercedString,
  _coercedNumber: () => _coercedNumber,
  _coercedDate: () => _coercedDate,
  _coercedBoolean: () => _coercedBoolean,
  _coercedBigint: () => _coercedBigint,
  _cidrv6: () => _cidrv6,
  _cidrv4: () => _cidrv4,
  _check: () => _check,
  _catch: () => _catch,
  _boolean: () => _boolean,
  _bigint: () => _bigint,
  _base64url: () => _base64url,
  _base64: () => _base64,
  _array: () => _array,
  _any: () => _any,
  TimePrecision: () => TimePrecision,
  NEVER: () => NEVER,
  JSONSchemaGenerator: () => JSONSchemaGenerator,
  JSONSchema: () => exports_json_schema,
  Doc: () => Doc,
  $output: () => $output,
  $input: () => $input,
  $constructor: () => $constructor,
  $brand: () => $brand,
  $ZodXor: () => $ZodXor,
  $ZodXID: () => $ZodXID,
  $ZodVoid: () => $ZodVoid,
  $ZodUnknown: () => $ZodUnknown,
  $ZodUnion: () => $ZodUnion,
  $ZodUndefined: () => $ZodUndefined,
  $ZodUUID: () => $ZodUUID,
  $ZodURL: () => $ZodURL,
  $ZodULID: () => $ZodULID,
  $ZodType: () => $ZodType,
  $ZodTuple: () => $ZodTuple,
  $ZodTransform: () => $ZodTransform,
  $ZodTemplateLiteral: () => $ZodTemplateLiteral,
  $ZodSymbol: () => $ZodSymbol,
  $ZodSuccess: () => $ZodSuccess,
  $ZodStringFormat: () => $ZodStringFormat,
  $ZodString: () => $ZodString,
  $ZodSet: () => $ZodSet,
  $ZodRegistry: () => $ZodRegistry,
  $ZodRecord: () => $ZodRecord,
  $ZodRealError: () => $ZodRealError,
  $ZodReadonly: () => $ZodReadonly,
  $ZodPromise: () => $ZodPromise,
  $ZodPrefault: () => $ZodPrefault,
  $ZodPipe: () => $ZodPipe,
  $ZodOptional: () => $ZodOptional,
  $ZodObjectJIT: () => $ZodObjectJIT,
  $ZodObject: () => $ZodObject,
  $ZodNumberFormat: () => $ZodNumberFormat,
  $ZodNumber: () => $ZodNumber,
  $ZodNullable: () => $ZodNullable,
  $ZodNull: () => $ZodNull,
  $ZodNonOptional: () => $ZodNonOptional,
  $ZodNever: () => $ZodNever,
  $ZodNanoID: () => $ZodNanoID,
  $ZodNaN: () => $ZodNaN,
  $ZodMap: () => $ZodMap,
  $ZodMAC: () => $ZodMAC,
  $ZodLiteral: () => $ZodLiteral,
  $ZodLazy: () => $ZodLazy,
  $ZodKSUID: () => $ZodKSUID,
  $ZodJWT: () => $ZodJWT,
  $ZodIntersection: () => $ZodIntersection,
  $ZodISOTime: () => $ZodISOTime,
  $ZodISODuration: () => $ZodISODuration,
  $ZodISODateTime: () => $ZodISODateTime,
  $ZodISODate: () => $ZodISODate,
  $ZodIPv6: () => $ZodIPv6,
  $ZodIPv4: () => $ZodIPv4,
  $ZodGUID: () => $ZodGUID,
  $ZodFunction: () => $ZodFunction,
  $ZodFile: () => $ZodFile,
  $ZodExactOptional: () => $ZodExactOptional,
  $ZodError: () => $ZodError,
  $ZodEnum: () => $ZodEnum,
  $ZodEncodeError: () => $ZodEncodeError,
  $ZodEmoji: () => $ZodEmoji,
  $ZodEmail: () => $ZodEmail,
  $ZodE164: () => $ZodE164,
  $ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
  $ZodDefault: () => $ZodDefault,
  $ZodDate: () => $ZodDate,
  $ZodCustomStringFormat: () => $ZodCustomStringFormat,
  $ZodCustom: () => $ZodCustom,
  $ZodCodec: () => $ZodCodec,
  $ZodCheckUpperCase: () => $ZodCheckUpperCase,
  $ZodCheckStringFormat: () => $ZodCheckStringFormat,
  $ZodCheckStartsWith: () => $ZodCheckStartsWith,
  $ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
  $ZodCheckRegex: () => $ZodCheckRegex,
  $ZodCheckProperty: () => $ZodCheckProperty,
  $ZodCheckOverwrite: () => $ZodCheckOverwrite,
  $ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
  $ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
  $ZodCheckMinSize: () => $ZodCheckMinSize,
  $ZodCheckMinLength: () => $ZodCheckMinLength,
  $ZodCheckMimeType: () => $ZodCheckMimeType,
  $ZodCheckMaxSize: () => $ZodCheckMaxSize,
  $ZodCheckMaxLength: () => $ZodCheckMaxLength,
  $ZodCheckLowerCase: () => $ZodCheckLowerCase,
  $ZodCheckLessThan: () => $ZodCheckLessThan,
  $ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
  $ZodCheckIncludes: () => $ZodCheckIncludes,
  $ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
  $ZodCheckEndsWith: () => $ZodCheckEndsWith,
  $ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
  $ZodCheck: () => $ZodCheck,
  $ZodCatch: () => $ZodCatch,
  $ZodCUID2: () => $ZodCUID2,
  $ZodCUID: () => $ZodCUID,
  $ZodCIDRv6: () => $ZodCIDRv6,
  $ZodCIDRv4: () => $ZodCIDRv4,
  $ZodBoolean: () => $ZodBoolean,
  $ZodBigIntFormat: () => $ZodBigIntFormat,
  $ZodBigInt: () => $ZodBigInt,
  $ZodBase64URL: () => $ZodBase64URL,
  $ZodBase64: () => $ZodBase64,
  $ZodAsyncError: () => $ZodAsyncError,
  $ZodArray: () => $ZodArray,
  $ZodAny: () => $ZodAny
});
var init_core2 = __esm(() => {
  init_core();
  init_parse();
  init_errors();
  init_schemas();
  init_checks();
  init_versions();
  init_util();
  init_regexes();
  init_locales();
  init_registries();
  init_api();
  init_to_json_schema();
  init_json_schema_processors();
  init_json_schema_generator();
  init_json_schema();
});

// node_modules/zod/v4/classic/checks.js
var exports_checks2 = {};
__export(exports_checks2, {
  uppercase: () => _uppercase,
  trim: () => _trim,
  toUpperCase: () => _toUpperCase,
  toLowerCase: () => _toLowerCase,
  startsWith: () => _startsWith,
  slugify: () => _slugify,
  size: () => _size,
  regex: () => _regex,
  property: () => _property,
  positive: () => _positive,
  overwrite: () => _overwrite,
  normalize: () => _normalize,
  nonpositive: () => _nonpositive,
  nonnegative: () => _nonnegative,
  negative: () => _negative,
  multipleOf: () => _multipleOf,
  minSize: () => _minSize,
  minLength: () => _minLength,
  mime: () => _mime,
  maxSize: () => _maxSize,
  maxLength: () => _maxLength,
  lte: () => _lte,
  lt: () => _lt,
  lowercase: () => _lowercase,
  length: () => _length,
  includes: () => _includes,
  gte: () => _gte,
  gt: () => _gt,
  endsWith: () => _endsWith
});
var init_checks2 = __esm(() => {
  init_core2();
});

// node_modules/zod/v4/classic/iso.js
var exports_iso = {};
__export(exports_iso, {
  time: () => time2,
  duration: () => duration2,
  datetime: () => datetime2,
  date: () => date2,
  ZodISOTime: () => ZodISOTime,
  ZodISODuration: () => ZodISODuration,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODate: () => ZodISODate
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
function date2(params) {
  return _isoDate(ZodISODate, params);
}
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}
var ZodISODateTime, ZodISODate, ZodISOTime, ZodISODuration;
var init_iso = __esm(() => {
  init_core2();
  init_schemas2();
  ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
});

// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
}, ZodError, ZodRealError;
var init_errors2 = __esm(() => {
  init_core2();
  init_core2();
  init_util();
  ZodError = $constructor("ZodError", initializer2);
  ZodRealError = $constructor("ZodError", initializer2, {
    Parent: Error
  });
});

// node_modules/zod/v4/classic/parse.js
var parse3, parseAsync3, safeParse2, safeParseAsync2, encode2, decode2, encodeAsync2, decodeAsync2, safeEncode2, safeDecode2, safeEncodeAsync2, safeDecodeAsync2;
var init_parse2 = __esm(() => {
  init_core2();
  init_errors2();
  parse3 = /* @__PURE__ */ _parse(ZodRealError);
  parseAsync3 = /* @__PURE__ */ _parseAsync(ZodRealError);
  safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
  safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
  encode2 = /* @__PURE__ */ _encode(ZodRealError);
  decode2 = /* @__PURE__ */ _decode(ZodRealError);
  encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
  decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
  safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
  safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
  safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
  safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
});

// node_modules/zod/v4/classic/schemas.js
var exports_schemas2 = {};
__export(exports_schemas2, {
  xor: () => xor,
  xid: () => xid2,
  void: () => _void2,
  uuidv7: () => uuidv7,
  uuidv6: () => uuidv6,
  uuidv4: () => uuidv4,
  uuid: () => uuid2,
  url: () => url,
  unknown: () => unknown,
  union: () => union,
  undefined: () => _undefined3,
  ulid: () => ulid2,
  uint64: () => uint64,
  uint32: () => uint32,
  tuple: () => tuple,
  transform: () => transform,
  templateLiteral: () => templateLiteral,
  symbol: () => symbol,
  superRefine: () => superRefine,
  success: () => success,
  stringbool: () => stringbool,
  stringFormat: () => stringFormat,
  string: () => string3,
  strictObject: () => strictObject,
  set: () => set,
  refine: () => refine,
  record: () => record,
  readonly: () => readonly,
  promise: () => promise,
  preprocess: () => preprocess,
  prefault: () => prefault,
  pipe: () => pipe,
  partialRecord: () => partialRecord,
  optional: () => optional2,
  object: () => object2,
  number: () => number2,
  nullish: () => nullish2,
  nullable: () => nullable,
  null: () => _null3,
  nonoptional: () => nonoptional,
  never: () => never,
  nativeEnum: () => nativeEnum,
  nanoid: () => nanoid2,
  nan: () => nan,
  meta: () => meta2,
  map: () => map,
  mac: () => mac2,
  looseRecord: () => looseRecord,
  looseObject: () => looseObject,
  literal: () => literal,
  lazy: () => lazy,
  ksuid: () => ksuid2,
  keyof: () => keyof,
  jwt: () => jwt,
  json: () => json,
  ipv6: () => ipv62,
  ipv4: () => ipv42,
  intersection: () => intersection,
  int64: () => int64,
  int32: () => int32,
  int: () => int,
  instanceof: () => _instanceof,
  httpUrl: () => httpUrl,
  hostname: () => hostname2,
  hex: () => hex2,
  hash: () => hash,
  guid: () => guid2,
  function: () => _function,
  float64: () => float64,
  float32: () => float32,
  file: () => file,
  exactOptional: () => exactOptional,
  enum: () => _enum2,
  emoji: () => emoji2,
  email: () => email2,
  e164: () => e1642,
  discriminatedUnion: () => discriminatedUnion,
  describe: () => describe2,
  date: () => date3,
  custom: () => custom,
  cuid2: () => cuid22,
  cuid: () => cuid3,
  codec: () => codec,
  cidrv6: () => cidrv62,
  cidrv4: () => cidrv42,
  check: () => check,
  catch: () => _catch2,
  boolean: () => boolean2,
  bigint: () => bigint2,
  base64url: () => base64url2,
  base64: () => base642,
  array: () => array,
  any: () => any,
  _function: () => _function,
  _default: () => _default2,
  _ZodString: () => _ZodString,
  ZodXor: () => ZodXor,
  ZodXID: () => ZodXID,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodUUID: () => ZodUUID,
  ZodURL: () => ZodURL,
  ZodULID: () => ZodULID,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransform: () => ZodTransform,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodSymbol: () => ZodSymbol,
  ZodSuccess: () => ZodSuccess,
  ZodStringFormat: () => ZodStringFormat,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodRecord: () => ZodRecord,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPrefault: () => ZodPrefault,
  ZodPipe: () => ZodPipe,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNonOptional: () => ZodNonOptional,
  ZodNever: () => ZodNever,
  ZodNanoID: () => ZodNanoID,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodMAC: () => ZodMAC,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodKSUID: () => ZodKSUID,
  ZodJWT: () => ZodJWT,
  ZodIntersection: () => ZodIntersection,
  ZodIPv6: () => ZodIPv6,
  ZodIPv4: () => ZodIPv4,
  ZodGUID: () => ZodGUID,
  ZodFunction: () => ZodFunction,
  ZodFile: () => ZodFile,
  ZodExactOptional: () => ZodExactOptional,
  ZodEnum: () => ZodEnum,
  ZodEmoji: () => ZodEmoji,
  ZodEmail: () => ZodEmail,
  ZodE164: () => ZodE164,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodCustom: () => ZodCustom,
  ZodCodec: () => ZodCodec,
  ZodCatch: () => ZodCatch,
  ZodCUID2: () => ZodCUID2,
  ZodCUID: () => ZodCUID,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodBoolean: () => ZodBoolean,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBigInt: () => ZodBigInt,
  ZodBase64URL: () => ZodBase64URL,
  ZodBase64: () => ZodBase64,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny
});
function string3(params) {
  return _string(ZodString, params);
}
function email2(params) {
  return _email(ZodEmail, params);
}
function guid2(params) {
  return _guid(ZodGUID, params);
}
function uuid2(params) {
  return _uuid(ZodUUID, params);
}
function uuidv4(params) {
  return _uuidv4(ZodUUID, params);
}
function uuidv6(params) {
  return _uuidv6(ZodUUID, params);
}
function uuidv7(params) {
  return _uuidv7(ZodUUID, params);
}
function url(params) {
  return _url(ZodURL, params);
}
function httpUrl(params) {
  return _url(ZodURL, {
    protocol: /^https?$/,
    hostname: exports_regexes.domain,
    ...exports_util.normalizeParams(params)
  });
}
function emoji2(params) {
  return _emoji2(ZodEmoji, params);
}
function nanoid2(params) {
  return _nanoid(ZodNanoID, params);
}
function cuid3(params) {
  return _cuid(ZodCUID, params);
}
function cuid22(params) {
  return _cuid2(ZodCUID2, params);
}
function ulid2(params) {
  return _ulid(ZodULID, params);
}
function xid2(params) {
  return _xid(ZodXID, params);
}
function ksuid2(params) {
  return _ksuid(ZodKSUID, params);
}
function ipv42(params) {
  return _ipv4(ZodIPv4, params);
}
function mac2(params) {
  return _mac(ZodMAC, params);
}
function ipv62(params) {
  return _ipv6(ZodIPv6, params);
}
function cidrv42(params) {
  return _cidrv4(ZodCIDRv4, params);
}
function cidrv62(params) {
  return _cidrv6(ZodCIDRv6, params);
}
function base642(params) {
  return _base64(ZodBase64, params);
}
function base64url2(params) {
  return _base64url(ZodBase64URL, params);
}
function e1642(params) {
  return _e164(ZodE164, params);
}
function jwt(params) {
  return _jwt(ZodJWT, params);
}
function stringFormat(format, fnOrRegex, _params = {}) {
  return _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hostname", exports_regexes.hostname, _params);
}
function hex2(_params) {
  return _stringFormat(ZodCustomStringFormat, "hex", exports_regexes.hex, _params);
}
function hash(alg, params) {
  const enc = params?.enc ?? "hex";
  const format = `${alg}_${enc}`;
  const regex = exports_regexes[format];
  if (!regex)
    throw new Error(`Unrecognized hash format: ${format}`);
  return _stringFormat(ZodCustomStringFormat, format, regex, params);
}
function number2(params) {
  return _number(ZodNumber, params);
}
function int(params) {
  return _int(ZodNumberFormat, params);
}
function float32(params) {
  return _float32(ZodNumberFormat, params);
}
function float64(params) {
  return _float64(ZodNumberFormat, params);
}
function int32(params) {
  return _int32(ZodNumberFormat, params);
}
function uint32(params) {
  return _uint32(ZodNumberFormat, params);
}
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
function bigint2(params) {
  return _bigint(ZodBigInt, params);
}
function int64(params) {
  return _int64(ZodBigIntFormat, params);
}
function uint64(params) {
  return _uint64(ZodBigIntFormat, params);
}
function symbol(params) {
  return _symbol(ZodSymbol, params);
}
function _undefined3(params) {
  return _undefined2(ZodUndefined, params);
}
function _null3(params) {
  return _null2(ZodNull, params);
}
function any() {
  return _any(ZodAny);
}
function unknown() {
  return _unknown(ZodUnknown);
}
function never(params) {
  return _never(ZodNever, params);
}
function _void2(params) {
  return _void(ZodVoid, params);
}
function date3(params) {
  return _date(ZodDate, params);
}
function array(element, params) {
  return _array(ZodArray, element, params);
}
function keyof(schema) {
  const shape = schema._zod.def.shape;
  return _enum2(Object.keys(shape));
}
function object2(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...exports_util.normalizeParams(params)
  };
  return new ZodObject(def);
}
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...exports_util.normalizeParams(params)
  });
}
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...exports_util.normalizeParams(params)
  });
}
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...exports_util.normalizeParams(params)
  });
}
function xor(options, params) {
  return new ZodXor({
    type: "union",
    options,
    inclusive: false,
    ...exports_util.normalizeParams(params)
  });
}
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...exports_util.normalizeParams(params)
  });
}
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
function tuple(items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new ZodTuple({
    type: "tuple",
    items,
    rest,
    ...exports_util.normalizeParams(params)
  });
}
function record(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...exports_util.normalizeParams(params)
  });
}
function partialRecord(keyType, valueType, params) {
  const k3 = clone(keyType);
  k3._zod.values = undefined;
  return new ZodRecord({
    type: "record",
    keyType: k3,
    valueType,
    ...exports_util.normalizeParams(params)
  });
}
function looseRecord(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    mode: "loose",
    ...exports_util.normalizeParams(params)
  });
}
function map(keyType, valueType, params) {
  return new ZodMap({
    type: "map",
    keyType,
    valueType,
    ...exports_util.normalizeParams(params)
  });
}
function set(valueType, params) {
  return new ZodSet({
    type: "set",
    valueType,
    ...exports_util.normalizeParams(params)
  });
}
function _enum2(values2, params) {
  const entries = Array.isArray(values2) ? Object.fromEntries(values2.map((v2) => [v2, v2])) : values2;
  return new ZodEnum({
    type: "enum",
    entries,
    ...exports_util.normalizeParams(params)
  });
}
function nativeEnum(entries, params) {
  return new ZodEnum({
    type: "enum",
    entries,
    ...exports_util.normalizeParams(params)
  });
}
function literal(value2, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value2) ? value2 : [value2],
    ...exports_util.normalizeParams(params)
  });
}
function file(params) {
  return _file(ZodFile, params);
}
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
function optional2(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
function nullish2(innerType) {
  return optional2(nullable(innerType));
}
function _default2(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : exports_util.shallowClone(defaultValue);
    }
  });
}
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : exports_util.shallowClone(defaultValue);
    }
  });
}
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...exports_util.normalizeParams(params)
  });
}
function success(innerType) {
  return new ZodSuccess({
    type: "success",
    innerType
  });
}
function _catch2(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
function nan(params) {
  return _nan(ZodNaN, params);
}
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
function codec(in_, out, params) {
  return new ZodCodec({
    type: "pipe",
    in: in_,
    out,
    transform: params.decode,
    reverseTransform: params.encode
  });
}
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
function templateLiteral(parts, params) {
  return new ZodTemplateLiteral({
    type: "template_literal",
    parts,
    ...exports_util.normalizeParams(params)
  });
}
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
function promise(innerType) {
  return new ZodPromise({
    type: "promise",
    innerType
  });
}
function _function(params) {
  return new ZodFunction({
    type: "function",
    input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
    output: params?.output ?? unknown()
  });
}
function check(fn) {
  const ch = new $ZodCheck({
    check: "custom"
  });
  ch._zod.check = fn;
  return ch;
}
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
  return _superRefine(fn);
}
function _instanceof(cls, params = {}) {
  const inst = new ZodCustom({
    type: "custom",
    check: "custom",
    fn: (data) => data instanceof cls,
    abort: true,
    ...exports_util.normalizeParams(params)
  });
  inst._zod.bag.Class = cls;
  inst._zod.check = (payload) => {
    if (!(payload.value instanceof cls)) {
      payload.issues.push({
        code: "invalid_type",
        expected: cls.name,
        input: payload.value,
        inst,
        path: [...inst._zod.def.path ?? []]
      });
    }
  };
  return inst;
}
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string3(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string3(), jsonSchema)]);
  });
  return jsonSchema;
}
function preprocess(fn, schema) {
  return pipe(transform(fn), schema);
}
var ZodType, _ZodString, ZodString, ZodStringFormat, ZodEmail, ZodGUID, ZodUUID, ZodURL, ZodEmoji, ZodNanoID, ZodCUID, ZodCUID2, ZodULID, ZodXID, ZodKSUID, ZodIPv4, ZodMAC, ZodIPv6, ZodCIDRv4, ZodCIDRv6, ZodBase64, ZodBase64URL, ZodE164, ZodJWT, ZodCustomStringFormat, ZodNumber, ZodNumberFormat, ZodBoolean, ZodBigInt, ZodBigIntFormat, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodDate, ZodArray, ZodObject, ZodUnion, ZodXor, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodEnum, ZodLiteral, ZodFile, ZodTransform, ZodOptional, ZodExactOptional, ZodNullable, ZodDefault, ZodPrefault, ZodNonOptional, ZodSuccess, ZodCatch, ZodNaN, ZodPipe, ZodCodec, ZodReadonly, ZodTemplateLiteral, ZodLazy, ZodPromise, ZodFunction, ZodCustom, describe2, meta2, stringbool = (...args) => _stringbool({
  Codec: ZodCodec,
  Boolean: ZodBoolean,
  String: ZodString
}, ...args);
var init_schemas2 = __esm(() => {
  init_core2();
  init_core2();
  init_json_schema_processors();
  init_to_json_schema();
  init_checks2();
  init_iso();
  init_parse2();
  ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    Object.assign(inst["~standard"], {
      jsonSchema: {
        input: createStandardJSONSchemaMethod(inst, "input"),
        output: createStandardJSONSchemaMethod(inst, "output")
      }
    });
    inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    inst.check = (...checks2) => {
      return inst.clone(exports_util.mergeDefs(def, {
        checks: [
          ...def.checks ?? [],
          ...checks2.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), {
        parent: true
      });
    };
    inst.with = inst.check;
    inst.clone = (def2, params) => clone(inst, def2, params);
    inst.brand = () => inst;
    inst.register = (reg, meta2) => {
      reg.add(inst, meta2);
      return inst;
    };
    inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse2(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync3(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
    inst.spa = inst.safeParseAsync;
    inst.encode = (data, params) => encode2(inst, data, params);
    inst.decode = (data, params) => decode2(inst, data, params);
    inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
    inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
    inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
    inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
    inst.refine = (check, params) => inst.check(refine(check, params));
    inst.superRefine = (refinement) => inst.check(superRefine(refinement));
    inst.overwrite = (fn) => inst.check(_overwrite(fn));
    inst.optional = () => optional2(inst);
    inst.exactOptional = () => exactOptional(inst);
    inst.nullable = () => nullable(inst);
    inst.nullish = () => optional2(nullable(inst));
    inst.nonoptional = (params) => nonoptional(inst, params);
    inst.array = () => array(inst);
    inst.or = (arg) => union([inst, arg]);
    inst.and = (arg) => intersection(inst, arg);
    inst.transform = (tx) => pipe(inst, transform(tx));
    inst.default = (def2) => _default2(inst, def2);
    inst.prefault = (def2) => prefault(inst, def2);
    inst.catch = (params) => _catch2(inst, params);
    inst.pipe = (target) => pipe(inst, target);
    inst.readonly = () => readonly(inst);
    inst.describe = (description) => {
      const cl = inst.clone();
      globalRegistry.add(cl, { description });
      return cl;
    };
    Object.defineProperty(inst, "description", {
      get() {
        return globalRegistry.get(inst)?.description;
      },
      configurable: true
    });
    inst.meta = (...args) => {
      if (args.length === 0) {
        return globalRegistry.get(inst);
      }
      const cl = inst.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    };
    inst.isOptional = () => inst.safeParse(undefined).success;
    inst.isNullable = () => inst.safeParse(null).success;
    inst.apply = (fn) => fn(inst);
    return inst;
  });
  _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    inst.regex = (...args) => inst.check(_regex(...args));
    inst.includes = (...args) => inst.check(_includes(...args));
    inst.startsWith = (...args) => inst.check(_startsWith(...args));
    inst.endsWith = (...args) => inst.check(_endsWith(...args));
    inst.min = (...args) => inst.check(_minLength(...args));
    inst.max = (...args) => inst.check(_maxLength(...args));
    inst.length = (...args) => inst.check(_length(...args));
    inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
    inst.lowercase = (params) => inst.check(_lowercase(params));
    inst.uppercase = (params) => inst.check(_uppercase(params));
    inst.trim = () => inst.check(_trim());
    inst.normalize = (...args) => inst.check(_normalize(...args));
    inst.toLowerCase = () => inst.check(_toLowerCase());
    inst.toUpperCase = () => inst.check(_toUpperCase());
    inst.slugify = () => inst.check(_slugify());
  });
  ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    inst.datetime = (params) => inst.check(datetime2(params));
    inst.date = (params) => inst.check(date2(params));
    inst.time = (params) => inst.check(time2(params));
    inst.duration = (params) => inst.check(duration2(params));
  });
  ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
  });
  ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def) => {
    $ZodMAC.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def) => {
    $ZodCustomStringFormat.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
    inst.gt = (value2, params) => inst.check(_gt(value2, params));
    inst.gte = (value2, params) => inst.check(_gte(value2, params));
    inst.min = (value2, params) => inst.check(_gte(value2, params));
    inst.lt = (value2, params) => inst.check(_lt(value2, params));
    inst.lte = (value2, params) => inst.check(_lte(value2, params));
    inst.max = (value2, params) => inst.check(_lte(value2, params));
    inst.int = (params) => inst.check(int(params));
    inst.safe = (params) => inst.check(int(params));
    inst.positive = (params) => inst.check(_gt(0, params));
    inst.nonnegative = (params) => inst.check(_gte(0, params));
    inst.negative = (params) => inst.check(_lt(0, params));
    inst.nonpositive = (params) => inst.check(_lte(0, params));
    inst.multipleOf = (value2, params) => inst.check(_multipleOf(value2, params));
    inst.step = (value2, params) => inst.check(_multipleOf(value2, params));
    inst.finite = () => inst;
    const bag = inst._zod.bag;
    inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
  });
  ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
  });
  ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
  });
  ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def) => {
    $ZodBigInt.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => bigintProcessor(inst, ctx, json, params);
    inst.gte = (value2, params) => inst.check(_gte(value2, params));
    inst.min = (value2, params) => inst.check(_gte(value2, params));
    inst.gt = (value2, params) => inst.check(_gt(value2, params));
    inst.gte = (value2, params) => inst.check(_gte(value2, params));
    inst.min = (value2, params) => inst.check(_gte(value2, params));
    inst.lt = (value2, params) => inst.check(_lt(value2, params));
    inst.lte = (value2, params) => inst.check(_lte(value2, params));
    inst.max = (value2, params) => inst.check(_lte(value2, params));
    inst.positive = (params) => inst.check(_gt(BigInt(0), params));
    inst.negative = (params) => inst.check(_lt(BigInt(0), params));
    inst.nonpositive = (params) => inst.check(_lte(BigInt(0), params));
    inst.nonnegative = (params) => inst.check(_gte(BigInt(0), params));
    inst.multipleOf = (value2, params) => inst.check(_multipleOf(value2, params));
    const bag = inst._zod.bag;
    inst.minValue = bag.minimum ?? null;
    inst.maxValue = bag.maximum ?? null;
    inst.format = bag.format ?? null;
  });
  ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def) => {
    $ZodBigIntFormat.init(inst, def);
    ZodBigInt.init(inst, def);
  });
  ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def) => {
    $ZodSymbol.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => symbolProcessor(inst, ctx, json, params);
  });
  ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
    $ZodUndefined.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
  });
  ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
    $ZodNull.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
  });
  ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
    $ZodAny.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => anyProcessor(inst, ctx, json, params);
  });
  ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
  });
  ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
  });
  ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
    $ZodVoid.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => voidProcessor(inst, ctx, json, params);
  });
  ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def) => {
    $ZodDate.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => dateProcessor(inst, ctx, json, params);
    inst.min = (value2, params) => inst.check(_gte(value2, params));
    inst.max = (value2, params) => inst.check(_lte(value2, params));
    const c2 = inst._zod.bag;
    inst.minDate = c2.minimum ? new Date(c2.minimum) : null;
    inst.maxDate = c2.maximum ? new Date(c2.maximum) : null;
  });
  ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
    inst.element = def.element;
    inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
    inst.nonempty = (params) => inst.check(_minLength(1, params));
    inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
    inst.length = (len, params) => inst.check(_length(len, params));
    inst.unwrap = () => inst.element;
  });
  ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
    $ZodObjectJIT.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
    exports_util.defineLazy(inst, "shape", () => {
      return def.shape;
    });
    inst.keyof = () => _enum2(Object.keys(inst._zod.def.shape));
    inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall });
    inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
    inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
    inst.extend = (incoming) => {
      return exports_util.extend(inst, incoming);
    };
    inst.safeExtend = (incoming) => {
      return exports_util.safeExtend(inst, incoming);
    };
    inst.merge = (other) => exports_util.merge(inst, other);
    inst.pick = (mask) => exports_util.pick(inst, mask);
    inst.omit = (mask) => exports_util.omit(inst, mask);
    inst.partial = (...args) => exports_util.partial(ZodOptional, inst, args[0]);
    inst.required = (...args) => exports_util.required(ZodNonOptional, inst, args[0]);
  });
  ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
    inst.options = def.options;
  });
  ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodXor.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
    inst.options = def.options;
  });
  ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodDiscriminatedUnion.init(inst, def);
  });
  ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
  });
  ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
    $ZodTuple.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => tupleProcessor(inst, ctx, json, params);
    inst.rest = (rest) => inst.clone({
      ...inst._zod.def,
      rest
    });
  });
  ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
    $ZodRecord.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
  });
  ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def) => {
    $ZodMap.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => mapProcessor(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
    inst.min = (...args) => inst.check(_minSize(...args));
    inst.nonempty = (params) => inst.check(_minSize(1, params));
    inst.max = (...args) => inst.check(_maxSize(...args));
    inst.size = (...args) => inst.check(_size(...args));
  });
  ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def) => {
    $ZodSet.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => setProcessor(inst, ctx, json, params);
    inst.min = (...args) => inst.check(_minSize(...args));
    inst.nonempty = (params) => inst.check(_minSize(1, params));
    inst.max = (...args) => inst.check(_maxSize(...args));
    inst.size = (...args) => inst.check(_size(...args));
  });
  ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values2, params) => {
      const newEntries = {};
      for (const value2 of values2) {
        if (keys.has(value2)) {
          newEntries[value2] = def.entries[value2];
        } else
          throw new Error(`Key ${value2} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...exports_util.normalizeParams(params),
        entries: newEntries
      });
    };
    inst.exclude = (values2, params) => {
      const newEntries = { ...def.entries };
      for (const value2 of values2) {
        if (keys.has(value2)) {
          delete newEntries[value2];
        } else
          throw new Error(`Key ${value2} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...exports_util.normalizeParams(params),
        entries: newEntries
      });
    };
  });
  ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
      get() {
        if (def.values.length > 1) {
          throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
        }
        return def.values[0];
      }
    });
  });
  ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def) => {
    $ZodFile.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => fileProcessor(inst, ctx, json, params);
    inst.min = (size, params) => inst.check(_minSize(size, params));
    inst.max = (size, params) => inst.check(_maxSize(size, params));
    inst.mime = (types, params) => inst.check(_mime(Array.isArray(types) ? types : [types], params));
  });
  ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
    inst._zod.parse = (payload, _ctx) => {
      if (_ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(exports_util.issue(issue2, payload.value, def));
        } else {
          const _issue = issue2;
          if (_issue.fatal)
            _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = inst);
          payload.issues.push(exports_util.issue(_issue));
        }
      };
      const output = def.transform(payload.value, payload);
      if (output instanceof Promise) {
        return output.then((output2) => {
          payload.value = output2;
          return payload;
        });
      }
      payload.value = output;
      return payload;
    };
  });
  ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
    $ZodExactOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
  });
  ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def) => {
    $ZodSuccess.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => successProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
  });
  ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
    $ZodNaN.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nanProcessor(inst, ctx, json, params);
  });
  ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
    inst.in = def.in;
    inst.out = def.out;
  });
  ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def) => {
    ZodPipe.init(inst, def);
    $ZodCodec.init(inst, def);
  });
  ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
    $ZodTemplateLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => templateLiteralProcessor(inst, ctx, json, params);
  });
  ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
    $ZodLazy.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.getter();
  });
  ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def) => {
    $ZodPromise.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => promiseProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
    $ZodFunction.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => functionProcessor(inst, ctx, json, params);
  });
  ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
  });
  describe2 = describe;
  meta2 = meta;
});

// node_modules/zod/v4/classic/compat.js
function setErrorMap(map2) {
  config({
    customError: map2
  });
}
function getErrorMap() {
  return config().customError;
}
var ZodIssueCode, ZodFirstPartyTypeKind;
var init_compat = __esm(() => {
  init_core2();
  ZodIssueCode = {
    invalid_type: "invalid_type",
    too_big: "too_big",
    too_small: "too_small",
    invalid_format: "invalid_format",
    not_multiple_of: "not_multiple_of",
    unrecognized_keys: "unrecognized_keys",
    invalid_union: "invalid_union",
    invalid_key: "invalid_key",
    invalid_element: "invalid_element",
    invalid_value: "invalid_value",
    custom: "custom"
  };
  (function(ZodFirstPartyTypeKind2) {
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
});

// node_modules/zod/v4/classic/from-json-schema.js
function detectVersion(schema, defaultTarget) {
  const $schema = schema.$schema;
  if ($schema === "https://json-schema.org/draft/2020-12/schema") {
    return "draft-2020-12";
  }
  if ($schema === "http://json-schema.org/draft-07/schema#") {
    return "draft-7";
  }
  if ($schema === "http://json-schema.org/draft-04/schema#") {
    return "draft-4";
  }
  return defaultTarget ?? "draft-2020-12";
}
function resolveRef(ref, ctx) {
  if (!ref.startsWith("#")) {
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  }
  const path3 = ref.slice(1).split("/").filter(Boolean);
  if (path3.length === 0) {
    return ctx.rootSchema;
  }
  const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
  if (path3[0] === defsKey) {
    const key = path3[1];
    if (!key || !ctx.defs[key]) {
      throw new Error(`Reference not found: ${ref}`);
    }
    return ctx.defs[key];
  }
  throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
  if (schema.not !== undefined) {
    if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
      return z3.never();
    }
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (schema.unevaluatedItems !== undefined) {
    throw new Error("unevaluatedItems is not supported");
  }
  if (schema.unevaluatedProperties !== undefined) {
    throw new Error("unevaluatedProperties is not supported");
  }
  if (schema.if !== undefined || schema.then !== undefined || schema.else !== undefined) {
    throw new Error("Conditional schemas (if/then/else) are not supported");
  }
  if (schema.dependentSchemas !== undefined || schema.dependentRequired !== undefined) {
    throw new Error("dependentSchemas and dependentRequired are not supported");
  }
  if (schema.$ref) {
    const refPath = schema.$ref;
    if (ctx.refs.has(refPath)) {
      return ctx.refs.get(refPath);
    }
    if (ctx.processing.has(refPath)) {
      return z3.lazy(() => {
        if (!ctx.refs.has(refPath)) {
          throw new Error(`Circular reference not resolved: ${refPath}`);
        }
        return ctx.refs.get(refPath);
      });
    }
    ctx.processing.add(refPath);
    const resolved = resolveRef(refPath, ctx);
    const zodSchema2 = convertSchema(resolved, ctx);
    ctx.refs.set(refPath, zodSchema2);
    ctx.processing.delete(refPath);
    return zodSchema2;
  }
  if (schema.enum !== undefined) {
    const enumValues = schema.enum;
    if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
      return z3.null();
    }
    if (enumValues.length === 0) {
      return z3.never();
    }
    if (enumValues.length === 1) {
      return z3.literal(enumValues[0]);
    }
    if (enumValues.every((v2) => typeof v2 === "string")) {
      return z3.enum(enumValues);
    }
    const literalSchemas = enumValues.map((v2) => z3.literal(v2));
    if (literalSchemas.length < 2) {
      return literalSchemas[0];
    }
    return z3.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
  }
  if (schema.const !== undefined) {
    return z3.literal(schema.const);
  }
  const type = schema.type;
  if (Array.isArray(type)) {
    const typeSchemas = type.map((t3) => {
      const typeSchema = { ...schema, type: t3 };
      return convertBaseSchema(typeSchema, ctx);
    });
    if (typeSchemas.length === 0) {
      return z3.never();
    }
    if (typeSchemas.length === 1) {
      return typeSchemas[0];
    }
    return z3.union(typeSchemas);
  }
  if (!type) {
    return z3.any();
  }
  let zodSchema;
  switch (type) {
    case "string": {
      let stringSchema = z3.string();
      if (schema.format) {
        const format = schema.format;
        if (format === "email") {
          stringSchema = stringSchema.check(z3.email());
        } else if (format === "uri" || format === "uri-reference") {
          stringSchema = stringSchema.check(z3.url());
        } else if (format === "uuid" || format === "guid") {
          stringSchema = stringSchema.check(z3.uuid());
        } else if (format === "date-time") {
          stringSchema = stringSchema.check(z3.iso.datetime());
        } else if (format === "date") {
          stringSchema = stringSchema.check(z3.iso.date());
        } else if (format === "time") {
          stringSchema = stringSchema.check(z3.iso.time());
        } else if (format === "duration") {
          stringSchema = stringSchema.check(z3.iso.duration());
        } else if (format === "ipv4") {
          stringSchema = stringSchema.check(z3.ipv4());
        } else if (format === "ipv6") {
          stringSchema = stringSchema.check(z3.ipv6());
        } else if (format === "mac") {
          stringSchema = stringSchema.check(z3.mac());
        } else if (format === "cidr") {
          stringSchema = stringSchema.check(z3.cidrv4());
        } else if (format === "cidr-v6") {
          stringSchema = stringSchema.check(z3.cidrv6());
        } else if (format === "base64") {
          stringSchema = stringSchema.check(z3.base64());
        } else if (format === "base64url") {
          stringSchema = stringSchema.check(z3.base64url());
        } else if (format === "e164") {
          stringSchema = stringSchema.check(z3.e164());
        } else if (format === "jwt") {
          stringSchema = stringSchema.check(z3.jwt());
        } else if (format === "emoji") {
          stringSchema = stringSchema.check(z3.emoji());
        } else if (format === "nanoid") {
          stringSchema = stringSchema.check(z3.nanoid());
        } else if (format === "cuid") {
          stringSchema = stringSchema.check(z3.cuid());
        } else if (format === "cuid2") {
          stringSchema = stringSchema.check(z3.cuid2());
        } else if (format === "ulid") {
          stringSchema = stringSchema.check(z3.ulid());
        } else if (format === "xid") {
          stringSchema = stringSchema.check(z3.xid());
        } else if (format === "ksuid") {
          stringSchema = stringSchema.check(z3.ksuid());
        }
      }
      if (typeof schema.minLength === "number") {
        stringSchema = stringSchema.min(schema.minLength);
      }
      if (typeof schema.maxLength === "number") {
        stringSchema = stringSchema.max(schema.maxLength);
      }
      if (schema.pattern) {
        stringSchema = stringSchema.regex(new RegExp(schema.pattern));
      }
      zodSchema = stringSchema;
      break;
    }
    case "number":
    case "integer": {
      let numberSchema = type === "integer" ? z3.number().int() : z3.number();
      if (typeof schema.minimum === "number") {
        numberSchema = numberSchema.min(schema.minimum);
      }
      if (typeof schema.maximum === "number") {
        numberSchema = numberSchema.max(schema.maximum);
      }
      if (typeof schema.exclusiveMinimum === "number") {
        numberSchema = numberSchema.gt(schema.exclusiveMinimum);
      } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
        numberSchema = numberSchema.gt(schema.minimum);
      }
      if (typeof schema.exclusiveMaximum === "number") {
        numberSchema = numberSchema.lt(schema.exclusiveMaximum);
      } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
        numberSchema = numberSchema.lt(schema.maximum);
      }
      if (typeof schema.multipleOf === "number") {
        numberSchema = numberSchema.multipleOf(schema.multipleOf);
      }
      zodSchema = numberSchema;
      break;
    }
    case "boolean": {
      zodSchema = z3.boolean();
      break;
    }
    case "null": {
      zodSchema = z3.null();
      break;
    }
    case "object": {
      const shape = {};
      const properties = schema.properties || {};
      const requiredSet = new Set(schema.required || []);
      for (const [key, propSchema] of Object.entries(properties)) {
        const propZodSchema = convertSchema(propSchema, ctx);
        shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
      }
      if (schema.propertyNames) {
        const keySchema = convertSchema(schema.propertyNames, ctx);
        const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z3.any();
        if (Object.keys(shape).length === 0) {
          zodSchema = z3.record(keySchema, valueSchema);
          break;
        }
        const objectSchema2 = z3.object(shape).passthrough();
        const recordSchema = z3.looseRecord(keySchema, valueSchema);
        zodSchema = z3.intersection(objectSchema2, recordSchema);
        break;
      }
      if (schema.patternProperties) {
        const patternProps = schema.patternProperties;
        const patternKeys = Object.keys(patternProps);
        const looseRecords = [];
        for (const pattern of patternKeys) {
          const patternValue = convertSchema(patternProps[pattern], ctx);
          const keySchema = z3.string().regex(new RegExp(pattern));
          looseRecords.push(z3.looseRecord(keySchema, patternValue));
        }
        const schemasToIntersect = [];
        if (Object.keys(shape).length > 0) {
          schemasToIntersect.push(z3.object(shape).passthrough());
        }
        schemasToIntersect.push(...looseRecords);
        if (schemasToIntersect.length === 0) {
          zodSchema = z3.object({}).passthrough();
        } else if (schemasToIntersect.length === 1) {
          zodSchema = schemasToIntersect[0];
        } else {
          let result = z3.intersection(schemasToIntersect[0], schemasToIntersect[1]);
          for (let i2 = 2;i2 < schemasToIntersect.length; i2++) {
            result = z3.intersection(result, schemasToIntersect[i2]);
          }
          zodSchema = result;
        }
        break;
      }
      const objectSchema = z3.object(shape);
      if (schema.additionalProperties === false) {
        zodSchema = objectSchema.strict();
      } else if (typeof schema.additionalProperties === "object") {
        zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
      } else {
        zodSchema = objectSchema.passthrough();
      }
      break;
    }
    case "array": {
      const prefixItems = schema.prefixItems;
      const items = schema.items;
      if (prefixItems && Array.isArray(prefixItems)) {
        const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
        const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : undefined;
        if (rest) {
          zodSchema = z3.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z3.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z3.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z3.maxLength(schema.maxItems));
        }
      } else if (Array.isArray(items)) {
        const tupleItems = items.map((item) => convertSchema(item, ctx));
        const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : undefined;
        if (rest) {
          zodSchema = z3.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z3.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z3.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z3.maxLength(schema.maxItems));
        }
      } else if (items !== undefined) {
        const element = convertSchema(items, ctx);
        let arraySchema = z3.array(element);
        if (typeof schema.minItems === "number") {
          arraySchema = arraySchema.min(schema.minItems);
        }
        if (typeof schema.maxItems === "number") {
          arraySchema = arraySchema.max(schema.maxItems);
        }
        zodSchema = arraySchema;
      } else {
        zodSchema = z3.array(z3.any());
      }
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  if (schema.description) {
    zodSchema = zodSchema.describe(schema.description);
  }
  if (schema.default !== undefined) {
    zodSchema = zodSchema.default(schema.default);
  }
  return zodSchema;
}
function convertSchema(schema, ctx) {
  if (typeof schema === "boolean") {
    return schema ? z3.any() : z3.never();
  }
  let baseSchema = convertBaseSchema(schema, ctx);
  const hasExplicitType = schema.type || schema.enum !== undefined || schema.const !== undefined;
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const options = schema.anyOf.map((s2) => convertSchema(s2, ctx));
    const anyOfUnion = z3.union(options);
    baseSchema = hasExplicitType ? z3.intersection(baseSchema, anyOfUnion) : anyOfUnion;
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const options = schema.oneOf.map((s2) => convertSchema(s2, ctx));
    const oneOfUnion = z3.xor(options);
    baseSchema = hasExplicitType ? z3.intersection(baseSchema, oneOfUnion) : oneOfUnion;
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    if (schema.allOf.length === 0) {
      baseSchema = hasExplicitType ? baseSchema : z3.any();
    } else {
      let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
      const startIdx = hasExplicitType ? 0 : 1;
      for (let i2 = startIdx;i2 < schema.allOf.length; i2++) {
        result = z3.intersection(result, convertSchema(schema.allOf[i2], ctx));
      }
      baseSchema = result;
    }
  }
  if (schema.nullable === true && ctx.version === "openapi-3.0") {
    baseSchema = z3.nullable(baseSchema);
  }
  if (schema.readOnly === true) {
    baseSchema = z3.readonly(baseSchema);
  }
  const extraMeta = {};
  const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const key of coreMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const key of contentMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  for (const key of Object.keys(schema)) {
    if (!RECOGNIZED_KEYS.has(key)) {
      extraMeta[key] = schema[key];
    }
  }
  if (Object.keys(extraMeta).length > 0) {
    ctx.registry.add(baseSchema, extraMeta);
  }
  return baseSchema;
}
function fromJSONSchema(schema, params) {
  if (typeof schema === "boolean") {
    return schema ? z3.any() : z3.never();
  }
  const version2 = detectVersion(schema, params?.defaultTarget);
  const defs = schema.$defs || schema.definitions || {};
  const ctx = {
    version: version2,
    defs,
    refs: new Map,
    processing: new Set,
    rootSchema: schema,
    registry: params?.registry ?? globalRegistry
  };
  return convertSchema(schema, ctx);
}
var z3, RECOGNIZED_KEYS;
var init_from_json_schema = __esm(() => {
  init_registries();
  init_checks2();
  init_iso();
  init_schemas2();
  z3 = {
    ...exports_schemas2,
    ...exports_checks2,
    iso: exports_iso
  };
  RECOGNIZED_KEYS = new Set([
    "$schema",
    "$ref",
    "$defs",
    "definitions",
    "$id",
    "id",
    "$comment",
    "$anchor",
    "$vocabulary",
    "$dynamicRef",
    "$dynamicAnchor",
    "type",
    "enum",
    "const",
    "anyOf",
    "oneOf",
    "allOf",
    "not",
    "properties",
    "required",
    "additionalProperties",
    "patternProperties",
    "propertyNames",
    "minProperties",
    "maxProperties",
    "items",
    "prefixItems",
    "additionalItems",
    "minItems",
    "maxItems",
    "uniqueItems",
    "contains",
    "minContains",
    "maxContains",
    "minLength",
    "maxLength",
    "pattern",
    "format",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    "description",
    "default",
    "contentEncoding",
    "contentMediaType",
    "contentSchema",
    "unevaluatedItems",
    "unevaluatedProperties",
    "if",
    "then",
    "else",
    "dependentSchemas",
    "dependentRequired",
    "nullable",
    "readOnly"
  ]);
});

// node_modules/zod/v4/classic/coerce.js
var exports_coerce = {};
__export(exports_coerce, {
  string: () => string4,
  number: () => number3,
  date: () => date4,
  boolean: () => boolean3,
  bigint: () => bigint3
});
function string4(params) {
  return _coercedString(ZodString, params);
}
function number3(params) {
  return _coercedNumber(ZodNumber, params);
}
function boolean3(params) {
  return _coercedBoolean(ZodBoolean, params);
}
function bigint3(params) {
  return _coercedBigint(ZodBigInt, params);
}
function date4(params) {
  return _coercedDate(ZodDate, params);
}
var init_coerce = __esm(() => {
  init_core2();
  init_schemas2();
});

// node_modules/zod/v4/classic/external.js
var exports_external = {};
__export(exports_external, {
  xor: () => xor,
  xid: () => xid2,
  void: () => _void2,
  uuidv7: () => uuidv7,
  uuidv6: () => uuidv6,
  uuidv4: () => uuidv4,
  uuid: () => uuid2,
  util: () => exports_util,
  url: () => url,
  uppercase: () => _uppercase,
  unknown: () => unknown,
  union: () => union,
  undefined: () => _undefined3,
  ulid: () => ulid2,
  uint64: () => uint64,
  uint32: () => uint32,
  tuple: () => tuple,
  trim: () => _trim,
  treeifyError: () => treeifyError,
  transform: () => transform,
  toUpperCase: () => _toUpperCase,
  toLowerCase: () => _toLowerCase,
  toJSONSchema: () => toJSONSchema,
  templateLiteral: () => templateLiteral,
  symbol: () => symbol,
  superRefine: () => superRefine,
  success: () => success,
  stringbool: () => stringbool,
  stringFormat: () => stringFormat,
  string: () => string3,
  strictObject: () => strictObject,
  startsWith: () => _startsWith,
  slugify: () => _slugify,
  size: () => _size,
  setErrorMap: () => setErrorMap,
  set: () => set,
  safeParseAsync: () => safeParseAsync2,
  safeParse: () => safeParse2,
  safeEncodeAsync: () => safeEncodeAsync2,
  safeEncode: () => safeEncode2,
  safeDecodeAsync: () => safeDecodeAsync2,
  safeDecode: () => safeDecode2,
  registry: () => registry,
  regexes: () => exports_regexes,
  regex: () => _regex,
  refine: () => refine,
  record: () => record,
  readonly: () => readonly,
  property: () => _property,
  promise: () => promise,
  prettifyError: () => prettifyError,
  preprocess: () => preprocess,
  prefault: () => prefault,
  positive: () => _positive,
  pipe: () => pipe,
  partialRecord: () => partialRecord,
  parseAsync: () => parseAsync3,
  parse: () => parse3,
  overwrite: () => _overwrite,
  optional: () => optional2,
  object: () => object2,
  number: () => number2,
  nullish: () => nullish2,
  nullable: () => nullable,
  null: () => _null3,
  normalize: () => _normalize,
  nonpositive: () => _nonpositive,
  nonoptional: () => nonoptional,
  nonnegative: () => _nonnegative,
  never: () => never,
  negative: () => _negative,
  nativeEnum: () => nativeEnum,
  nanoid: () => nanoid2,
  nan: () => nan,
  multipleOf: () => _multipleOf,
  minSize: () => _minSize,
  minLength: () => _minLength,
  mime: () => _mime,
  meta: () => meta2,
  maxSize: () => _maxSize,
  maxLength: () => _maxLength,
  map: () => map,
  mac: () => mac2,
  lte: () => _lte,
  lt: () => _lt,
  lowercase: () => _lowercase,
  looseRecord: () => looseRecord,
  looseObject: () => looseObject,
  locales: () => exports_locales,
  literal: () => literal,
  length: () => _length,
  lazy: () => lazy,
  ksuid: () => ksuid2,
  keyof: () => keyof,
  jwt: () => jwt,
  json: () => json,
  iso: () => exports_iso,
  ipv6: () => ipv62,
  ipv4: () => ipv42,
  intersection: () => intersection,
  int64: () => int64,
  int32: () => int32,
  int: () => int,
  instanceof: () => _instanceof,
  includes: () => _includes,
  httpUrl: () => httpUrl,
  hostname: () => hostname2,
  hex: () => hex2,
  hash: () => hash,
  guid: () => guid2,
  gte: () => _gte,
  gt: () => _gt,
  globalRegistry: () => globalRegistry,
  getErrorMap: () => getErrorMap,
  function: () => _function,
  fromJSONSchema: () => fromJSONSchema,
  formatError: () => formatError,
  float64: () => float64,
  float32: () => float32,
  flattenError: () => flattenError,
  file: () => file,
  exactOptional: () => exactOptional,
  enum: () => _enum2,
  endsWith: () => _endsWith,
  encodeAsync: () => encodeAsync2,
  encode: () => encode2,
  emoji: () => emoji2,
  email: () => email2,
  e164: () => e1642,
  discriminatedUnion: () => discriminatedUnion,
  describe: () => describe2,
  decodeAsync: () => decodeAsync2,
  decode: () => decode2,
  date: () => date3,
  custom: () => custom,
  cuid2: () => cuid22,
  cuid: () => cuid3,
  core: () => exports_core2,
  config: () => config,
  coerce: () => exports_coerce,
  codec: () => codec,
  clone: () => clone,
  cidrv6: () => cidrv62,
  cidrv4: () => cidrv42,
  check: () => check,
  catch: () => _catch2,
  boolean: () => boolean2,
  bigint: () => bigint2,
  base64url: () => base64url2,
  base64: () => base642,
  array: () => array,
  any: () => any,
  _function: () => _function,
  _default: () => _default2,
  _ZodString: () => _ZodString,
  ZodXor: () => ZodXor,
  ZodXID: () => ZodXID,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodUUID: () => ZodUUID,
  ZodURL: () => ZodURL,
  ZodULID: () => ZodULID,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransform: () => ZodTransform,
  ZodTemplateLiteral: () => ZodTemplateLiteral,
  ZodSymbol: () => ZodSymbol,
  ZodSuccess: () => ZodSuccess,
  ZodStringFormat: () => ZodStringFormat,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodRecord: () => ZodRecord,
  ZodRealError: () => ZodRealError,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPrefault: () => ZodPrefault,
  ZodPipe: () => ZodPipe,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumberFormat: () => ZodNumberFormat,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNonOptional: () => ZodNonOptional,
  ZodNever: () => ZodNever,
  ZodNanoID: () => ZodNanoID,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodMAC: () => ZodMAC,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodKSUID: () => ZodKSUID,
  ZodJWT: () => ZodJWT,
  ZodIssueCode: () => ZodIssueCode,
  ZodIntersection: () => ZodIntersection,
  ZodISOTime: () => ZodISOTime,
  ZodISODuration: () => ZodISODuration,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODate: () => ZodISODate,
  ZodIPv6: () => ZodIPv6,
  ZodIPv4: () => ZodIPv4,
  ZodGUID: () => ZodGUID,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFile: () => ZodFile,
  ZodExactOptional: () => ZodExactOptional,
  ZodError: () => ZodError,
  ZodEnum: () => ZodEnum,
  ZodEmoji: () => ZodEmoji,
  ZodEmail: () => ZodEmail,
  ZodE164: () => ZodE164,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCustomStringFormat: () => ZodCustomStringFormat,
  ZodCustom: () => ZodCustom,
  ZodCodec: () => ZodCodec,
  ZodCatch: () => ZodCatch,
  ZodCUID2: () => ZodCUID2,
  ZodCUID: () => ZodCUID,
  ZodCIDRv6: () => ZodCIDRv6,
  ZodCIDRv4: () => ZodCIDRv4,
  ZodBoolean: () => ZodBoolean,
  ZodBigIntFormat: () => ZodBigIntFormat,
  ZodBigInt: () => ZodBigInt,
  ZodBase64URL: () => ZodBase64URL,
  ZodBase64: () => ZodBase64,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny,
  TimePrecision: () => TimePrecision,
  NEVER: () => NEVER,
  $output: () => $output,
  $input: () => $input,
  $brand: () => $brand
});
var init_external = __esm(() => {
  init_core2();
  init_schemas2();
  init_checks2();
  init_errors2();
  init_parse2();
  init_compat();
  init_core2();
  init_en();
  init_core2();
  init_json_schema_processors();
  init_from_json_schema();
  init_locales();
  init_iso();
  init_iso();
  init_coerce();
  config(en_default());
});

// node_modules/zod/index.js
var init_zod = __esm(() => {
  init_external();
  init_external();
});

// src/config.ts
async function resolveCacheImages(cacheImages) {
  return typeof cacheImages === "function" ? cacheImages() : cacheImages;
}
var TmuxPaneSchema, TmuxWindowSchema, TmuxModeSchema, VolumeMountSchema, ServicePortSchema, ResourceLimitsSchema, AgentboxConfigSchema;
var init_config = __esm(() => {
  init_zod();
  TmuxPaneSchema = exports_external.object({
    command: exports_external.string(),
    sleepSeconds: exports_external.number().optional()
  });
  TmuxWindowSchema = exports_external.object({
    name: exports_external.string(),
    panes: exports_external.array(TmuxPaneSchema).readonly()
  });
  TmuxModeSchema = exports_external.object({
    name: exports_external.string(),
    windows: exports_external.array(TmuxWindowSchema).readonly()
  });
  VolumeMountSchema = exports_external.object({
    hostPath: exports_external.string(),
    containerPath: exports_external.string(),
    readOnly: exports_external.boolean().optional()
  });
  ServicePortSchema = exports_external.object({
    name: exports_external.string(),
    port: exports_external.number(),
    targetPort: exports_external.number().optional()
  });
  ResourceLimitsSchema = exports_external.object({
    memoryGi: exports_external.number().positive(),
    cpuLimit: exports_external.number().optional()
  });
  AgentboxConfigSchema = exports_external.object({
    tmuxModes: exports_external.array(TmuxModeSchema).readonly(),
    dependencyStrategies: exports_external.array(exports_external.custom()).readonly(),
    containerImage: exports_external.string().optional(),
    resources: ResourceLimitsSchema.optional(),
    volumes: exports_external.array(VolumeMountSchema).readonly().optional(),
    servicePorts: exports_external.array(ServicePortSchema).readonly().optional(),
    environmentSetup: exports_external.array(exports_external.string()).readonly().optional(),
    cacheImages: exports_external.custom().optional()
  });
});

// src/container-spec.ts
import * as path3 from "path";
function buildContainerSpec(spec) {
  const userVolumes = spec.config.volumes ?? [];
  const env = [
    { name: "AGENT_NAME", value: spec.agentName },
    { name: "HOME", value: "/home/agent" },
    ...spec.gitUser?.name ? [
      { name: "GIT_AUTHOR_NAME", value: spec.gitUser.name },
      { name: "GIT_COMMITTER_NAME", value: spec.gitUser.name }
    ] : [],
    ...spec.gitUser?.email ? [
      { name: "GIT_AUTHOR_EMAIL", value: spec.gitUser.email },
      { name: "GIT_COMMITTER_EMAIL", value: spec.gitUser.email }
    ] : []
  ];
  const volumes = [
    { hostPath: spec.worktreePath, containerPath: "/workspace" },
    { hostPath: spec.bareRepoPath, containerPath: spec.bareRepoPath },
    ...spec.strategyVolumes ?? [],
    ...userVolumes.map((m) => ({
      hostPath: expandHome(m.hostPath),
      containerPath: m.containerPath,
      readOnly: m.readOnly
    })),
    ...spec.imageCachePath ? [
      {
        hostPath: path3.dirname(spec.imageCachePath),
        containerPath: "/cache",
        readOnly: true
      }
    ] : []
  ];
  const environmentSetup = spec.config.environmentSetup ?? [
    "echo '127.0.0.1 host.docker.internal' >> /etc/hosts",
    "sysctl -w fs.inotify.max_user_watches=524288"
  ];
  const ports = spec.config.servicePorts ?? [];
  return { env, volumes, ports, environmentSetup };
}
var init_container_spec = __esm(() => {
  init_exec();
});

// src/image.ts
import * as crypto from "crypto";
import * as fs from "fs";
import * as os2 from "os";
import * as path4 from "path";
async function imageExistsInContainerd(imageName) {
  const result = await exec(`k3s ctr images check name==${shellEscape(`docker.io/library/${imageName}`)}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return result.code === 0 && result.stdout.includes(imageName);
}
async function imageExistsInDocker(imageName) {
  const result = await exec(`docker image inspect ${shellEscape(imageName)}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return result.code === 0;
}
async function buildAgentImage(customImage, backendKind) {
  if (customImage)
    return Ok(customImage);
  const kind = backendKind ?? "k3s";
  const alreadyCached = await M(kind).with("k3s", () => imageExistsInContainerd(TAGGED_IMAGE_NAME)).with("docker", () => imageExistsInDocker(TAGGED_IMAGE_NAME)).exhaustive();
  if (alreadyCached)
    return Ok(TAGGED_IMAGE_NAME);
  const tmpDir = fs.mkdtempSync(path4.join(os2.tmpdir(), "agentbox-"));
  fs.writeFileSync(path4.join(tmpDir, "Dockerfile"), DEFAULT_DOCKERFILE);
  const buildResult = await tryExec(`docker build -t ${TAGGED_IMAGE_NAME} ${shellEscape(tmpDir)}`, "Docker build failed");
  if (!buildResult.ok) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return buildResult;
  }
  const importResult = await M(kind).with("k3s", () => tryExec(`docker save ${TAGGED_IMAGE_NAME} | k3s ctr images import -`, "k3s image import failed")).with("docker", () => Promise.resolve(Ok(undefined))).exhaustive();
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (!importResult.ok)
    return importResult;
  return Ok(TAGGED_IMAGE_NAME);
}
var DEFAULT_IMAGE_NAME = "agentbox-agent:local", DEFAULT_DOCKERFILE = `FROM cruizba/ubuntu-dind:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \\
    git \\
    curl \\
    ca-certificates \\
    && rm -rf /var/lib/apt/lists/*

RUN userdel -r ubuntu 2>/dev/null || true \\
    && useradd -m -s /bin/bash -u 1000 agent \\
    && usermod -aG docker agent

RUN git config --system --add safe.directory /workspace

ENV HOME=/home/agent
ENV TERM=xterm-256color

WORKDIR /workspace
`, DOCKERFILE_HASH, TAGGED_IMAGE_NAME;
var init_image = __esm(() => {
  init_dist();
  init_exec();
  DOCKERFILE_HASH = crypto.createHash("sha256").update(DEFAULT_DOCKERFILE).digest("hex").slice(0, 12);
  TAGGED_IMAGE_NAME = `${DEFAULT_IMAGE_NAME}-${DOCKERFILE_HASH}`;
});

// src/yaml.ts
function isArray(value2) {
  return Array.isArray(value2);
}
function isBlock(value2) {
  if (value2 == null || typeof value2 !== "object")
    return false;
  if (isArray(value2))
    return value2.length > 0;
  return Object.keys(value2).length > 0;
}
function serializeValue(value2, indent) {
  if (value2 == null)
    return "null";
  if (typeof value2 === "boolean")
    return value2 ? "true" : "false";
  if (typeof value2 === "number")
    return String(value2);
  if (typeof value2 === "string")
    return serializeString(value2);
  if (isArray(value2))
    return serializeArray(value2, indent);
  return serializeObject(value2, indent);
}
function serializeString(value2) {
  if (value2 === "" || value2 === "true" || value2 === "false" || value2 === "null" || /[\n\r:#{}[\],&*?|>!'"%@`]/.test(value2) || /^\d/.test(value2)) {
    return JSON.stringify(value2);
  }
  return value2;
}
function serializeArray(arr, indent) {
  if (arr.length === 0)
    return "[]";
  const pad = " ".repeat(indent);
  return arr.map((item) => {
    if (item != null && typeof item === "object" && !isArray(item)) {
      const entries = Object.entries(item);
      if (entries.length === 0)
        return `${pad}- {}`;
      const lines = entries.map(([k3, v2], i2) => {
        const prefix = i2 === 0 ? `${pad}- ` : `${pad}  `;
        if (isBlock(v2)) {
          const serialized = serializeScalarOrBlock(v2, indent + 4);
          return `${prefix}${k3}:
${serialized}`;
        }
        return `${prefix}${k3}: ${serializeValue(v2, indent + 4)}`;
      });
      return lines.join(`
`);
    }
    return `${pad}- ${serializeValue(item, indent + 2)}`;
  }).join(`
`);
}
function serializeObject(obj, indent) {
  const entries = Object.entries(obj);
  if (entries.length === 0)
    return "{}";
  const pad = " ".repeat(indent);
  return entries.map(([k3, v2]) => {
    if (isBlock(v2)) {
      return `${pad}${k3}:
${serializeScalarOrBlock(v2, indent + 2)}`;
    }
    return `${pad}${k3}: ${serializeValue(v2, indent + 2)}`;
  }).join(`
`);
}
function serializeScalarOrBlock(value2, indent) {
  if (value2 == null || typeof value2 !== "object")
    return serializeValue(value2, indent);
  if (isArray(value2))
    return serializeArray(value2, indent);
  return serializeObject(value2, indent);
}
function toYaml(value2) {
  if (value2 != null && typeof value2 === "object" && !isArray(value2)) {
    return serializeObject(value2, 0);
  }
  return serializeValue(value2, 0);
}
function toYamlDocuments(docs) {
  return docs.map(toYaml).join(`
---
`);
}

// src/k8s.ts
import * as os3 from "os";
import * as path5 from "path";
function kubectl(cmd) {
  return `KUBECONFIG=${KUBECONFIG} kubectl -n ${NAMESPACE} ${cmd}`;
}
async function ensureNamespace() {
  const result = await exec(kubectl(`get namespace ${NAMESPACE}`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0) {
    await exec(`KUBECONFIG=${KUBECONFIG} kubectl create namespace ${NAMESPACE}`, {
      rejectOnNonZeroExit: false
    });
  }
}
function podName(agentName) {
  return `agent-${agentName}`;
}
async function getPodState(name) {
  const result = await exec(kubectl(`get pod ${name} -o jsonpath='{.status.phase}'`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0 || !result.stdout.trim())
    return { kind: "not-found" };
  const phase = result.stdout.trim().replace(/^'|'$/g, "");
  return phase === "Running" ? { kind: "running" } : { kind: "stopped" };
}
async function deletePodAndService(name) {
  await Promise.all([
    exec(kubectl(`delete pod ${name} --force --grace-period=0 --ignore-not-found`), {
      rejectOnNonZeroExit: false
    }),
    exec(kubectl(`delete service ${name} --ignore-not-found`), { rejectOnNonZeroExit: false })
  ]);
}
function createPodBuildContext() {
  return {
    cpuCount: os3.cpus().length
  };
}
function sanitizeSegment(segment) {
  return segment.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function deriveUserVolumeName(containerPath) {
  const segment = path5.basename(containerPath);
  const sanitized = sanitizeSegment(segment);
  return `user-${sanitized || "vol"}`;
}
function assignVolumeNames(volumes) {
  const candidates = volumes.map((v2) => {
    const known = KNOWN_VOLUME_MAP.get(v2.containerPath);
    if (known != null) {
      return { volume: v2, name: known.name, type: known.type };
    }
    if (v2.hostPath === v2.containerPath) {
      return { volume: v2, name: "bare-repo", type: "Directory" };
    }
    return {
      volume: v2,
      name: deriveUserVolumeName(v2.containerPath),
      type: "DirectoryOrCreate"
    };
  });
  const nameCounts = new Map;
  return candidates.map((c2) => {
    const count = nameCounts.get(c2.name) ?? 0;
    nameCounts.set(c2.name, count + 1);
    const name = count === 0 ? c2.name : `${c2.name}-${count}`;
    return {
      hostPath: c2.volume.hostPath,
      containerPath: c2.volume.containerPath,
      readOnly: c2.volume.readOnly,
      name,
      type: c2.type
    };
  });
}
function buildVolumeMounts(namedVolumes, worktreeParent) {
  return [
    { name: "worktree-link", mountPath: worktreeParent },
    ...namedVolumes.map((v2) => v2.readOnly ? { name: v2.name, mountPath: v2.containerPath, readOnly: true } : { name: v2.name, mountPath: v2.containerPath })
  ];
}
function buildVolumes(namedVolumes) {
  return [
    { name: "worktree-link", emptyDir: {} },
    ...namedVolumes.map((v2) => ({
      name: v2.name,
      hostPath: { path: v2.hostPath, type: v2.type }
    }))
  ];
}
function buildPodYaml(spec, ctx) {
  const name = podName(spec.agentName);
  const worktreeParent = path5.dirname(spec.worktreePath);
  const memoryGi = spec.config.resources?.memoryGi ?? 16;
  const cpuLimit = spec.config.resources?.cpuLimit ?? ctx.cpuCount;
  const containerImage = spec.config.containerImage ?? DEFAULT_IMAGE_NAME;
  const initScript = `mkdir -p ${shellEscape(worktreeParent)} && ln -sfn /workspace ${shellEscape(spec.worktreePath)}`;
  const container = buildContainerSpec(spec);
  const startupCommands = [
    "mknod /dev/loop-control c 10 237 2>/dev/null",
    "for i in $(seq 0 7); do mknod /dev/loop$i b 7 $i 2>/dev/null; done",
    "truncate -s 20G /tmp/docker.img && mkfs.ext4 -q /tmp/docker.img && mount -o loop /tmp/docker.img /var/lib/docker",
    ...container.environmentSetup,
    "chown -R agent:agent /home/agent/.local 2>/dev/null",
    "exec /usr/local/bin/entrypoint.sh sleep infinity"
  ].join("; ");
  const namedVolumes = assignVolumeNames(container.volumes);
  const allMounts = buildVolumeMounts(namedVolumes, worktreeParent);
  const allVolumes = buildVolumes(namedVolumes);
  const env = container.env.length > 0 ? container.env.map((e2) => ({ name: e2.name, value: e2.value })) : undefined;
  const podDoc = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name,
      labels: {
        app: "agent",
        "agent-name": spec.agentName
      }
    },
    spec: {
      runtimeClassName: "kata",
      restartPolicy: "Never",
      initContainers: [
        {
          name: "setup",
          image: containerImage,
          command: ["bash", "-c", initScript],
          securityContext: { runAsUser: 0 },
          volumeMounts: [
            { name: "worktree-link", mountPath: worktreeParent },
            { name: "workspace", mountPath: "/workspace" }
          ]
        }
      ],
      containers: [
        {
          name: "agent",
          image: containerImage,
          workingDir: "/workspace",
          command: ["bash", "-c", startupCommands],
          securityContext: { privileged: true },
          resources: {
            requests: { memory: `${memoryGi}Gi`, cpu: "1" },
            limits: { memory: `${memoryGi}Gi`, cpu: `${cpuLimit}` }
          },
          ...env != null ? { env } : {},
          volumeMounts: allMounts
        }
      ],
      volumes: allVolumes
    }
  };
  const servicePorts = container.ports.length > 0 ? container.ports.map((p2) => ({
    name: p2.name,
    port: p2.port,
    targetPort: p2.targetPort ?? p2.port
  })) : [];
  const serviceDoc = {
    apiVersion: "v1",
    kind: "Service",
    metadata: { name },
    spec: {
      type: "NodePort",
      selector: { "agent-name": spec.agentName },
      ports: servicePorts
    }
  };
  return toYamlDocuments([podDoc, serviceDoc]);
}
async function startPod(spec, ctx) {
  await ensureNamespace();
  const yaml = buildPodYaml(spec, ctx);
  const applyResult = await tryExec(`cat <<'K8S_EOF' | ${kubectl("apply -f -")}
${yaml}
K8S_EOF`, "kubectl apply failed");
  if (!applyResult.ok)
    return applyResult;
  const name = podName(spec.agentName);
  const waitResult = await tryExec(kubectl(`wait --for=condition=Ready pod/${name} --timeout=120s`), "Pod failed to become ready");
  if (!waitResult.ok)
    return waitResult;
  return Ok(undefined);
}
async function stopPod(agentName) {
  await deletePodAndService(podName(agentName));
}
async function getServicePorts(agentName) {
  const name = podName(agentName);
  const result = await exec(kubectl(`get service ${name} -o jsonpath='{.spec.ports}'`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0 || !result.stdout.trim())
    return [];
  try {
    const raw = result.stdout.trim().replace(/^'|'$/g, "");
    const json2 = JSON.parse(raw);
    if (!Array.isArray(json2))
      return [];
    return json2.flatMap((item) => {
      const result2 = AllocatedPortSchema.safeParse(item);
      return result2.success ? [result2.data] : [];
    });
  } catch {
    return [];
  }
}
function kubectlExecCommand(agentName, command2, options = {}) {
  const { interactive = true } = options;
  const name = podName(agentName);
  const cmd = command2 ?? "bash";
  const flags = interactive ? "-it" : "-i";
  return kubectl(`exec ${flags} ${name} -c agent -- runuser -u agent -- ${cmd}`);
}
var KUBECONFIG, NAMESPACE = "agents", KNOWN_VOLUME_MAP, AllocatedPortSchema;
var init_k8s = __esm(() => {
  init_zod();
  init_container_spec();
  init_exec();
  init_image();
  KUBECONFIG = path5.join(os3.homedir(), ".kube/config");
  KNOWN_VOLUME_MAP = new Map([
    ["/workspace", { name: "workspace", type: "Directory" }],
    ["/home/agent/.claude", { name: "claude-config", type: "DirectoryOrCreate" }],
    ["/usr/local/bin/claude", { name: "claude-cli", type: "File" }],
    ["/home/agent/.claude.json", { name: "claude-json", type: "File" }],
    ["/nix", { name: "nix", type: "Directory" }],
    ["/cache", { name: "docker-image-cache", type: "Directory" }]
  ]);
  AllocatedPortSchema = exports_external.object({
    name: exports_external.string(),
    nodePort: exports_external.number(),
    targetPort: exports_external.number()
  });
});

// src/backend.ts
function createBackend(agentName, kind) {
  return M(kind).with("k3s", () => ({ kind: "k3s", podName: podName(agentName), agentName })).with("docker", () => ({
    kind: "docker",
    containerName: dockerContainerName(agentName),
    agentName
  })).exhaustive();
}
async function getBackendState(backend) {
  return M(backend).with({ kind: "k3s" }, (b2) => getPodState(b2.podName)).with({ kind: "docker" }, (b2) => getDockerContainerState(b2.containerName)).exhaustive();
}
async function isBackendRunning(backend) {
  return (await getBackendState(backend)).kind === "running";
}
async function startBackend(backend, spec) {
  return M(backend).with({ kind: "k3s" }, async (b2) => {
    const state = await getPodState(b2.podName);
    if (state.kind === "stopped") {
      await deletePodAndService(b2.podName);
    }
    return startPod({
      agentName: spec.agentName,
      worktreePath: spec.worktreePath,
      bareRepoPath: spec.bareRepoPath,
      config: { ...spec.config, containerImage: spec.imageName },
      imageCachePath: spec.imageCachePath,
      gitUser: spec.gitUser,
      strategyVolumes: spec.strategyVolumes
    }, createPodBuildContext());
  }).with({ kind: "docker" }, async (b2) => {
    await exec(`docker rm -f ${b2.containerName}`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    const container = buildContainerSpec(spec);
    const runResult = await tryExec(buildDockerRunCommand(b2.containerName, spec.imageName, container), "Failed to start Docker container");
    if (!runResult.ok)
      return Err(runResult.error);
    for (const cmd of container.environmentSetup) {
      await exec(`docker exec ${b2.containerName} bash -c ${shellEscape(cmd)}`, {
        rejectOnNonZeroExit: false
      });
    }
    return Ok(undefined);
  }).exhaustive();
}
async function stopBackend(backend) {
  return M(backend).with({ kind: "k3s" }, async (b2) => {
    await stopPod(b2.agentName);
    return Ok(undefined);
  }).with({ kind: "docker" }, async (b2) => {
    await exec(`docker rm -f ${b2.containerName}`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    return Ok(undefined);
  }).exhaustive();
}
function buildExecCommand(backend, command2, options = {}) {
  const { interactive = true } = options;
  return M(backend).with({ kind: "k3s" }, (b2) => kubectlExecCommand(b2.agentName, command2, { interactive })).with({ kind: "docker" }, (b2) => {
    const cmd = command2 ?? "bash";
    const flags = interactive ? "-it" : "-i";
    return `docker exec ${flags} ${b2.containerName} runuser -u agent -- ${cmd}`;
  }).exhaustive();
}
function buildLogsCommand(backend, options = {}) {
  const { follow = false, init = false } = options;
  return M(backend).with({ kind: "k3s" }, (b2) => {
    const container = init ? "-c setup" : "-c agent";
    const followFlag = follow ? " -f" : "";
    return Ok(`kubectl logs ${b2.podName} ${container}${followFlag}`);
  }).with({ kind: "docker" }, (b2) => {
    if (init) {
      return Err("--init is only supported with k3s backend");
    }
    const followFlag = follow ? " -f" : "";
    return Ok(`docker logs${followFlag} ${b2.containerName}`);
  }).exhaustive();
}
async function getBackendLogs(backend, options = {}) {
  const cmdResult = buildLogsCommand(backend, options);
  if (!cmdResult.ok)
    return cmdResult;
  const { follow = false } = options;
  const result = await exec(cmdResult.value, {
    captureOutput: !follow,
    rejectOnNonZeroExit: false
  });
  if (follow)
    return Ok("");
  if (result.code !== 0)
    return Err(`Failed to get logs: ${result.stderr.trim()}`);
  return Ok(result.stdout);
}
async function getBackendServicePorts(backend) {
  return M(backend).with({ kind: "k3s" }, (b2) => getServicePorts(b2.agentName)).with({ kind: "docker" }, (b2) => queryDockerPortsLabel(b2.containerName)).exhaustive();
}
function dockerContainerName(agentName) {
  return `agentbox-${agentName}`;
}
async function getDockerContainerState(containerName) {
  const result = await exec(`docker inspect --format='{{.State.Status}}' ${containerName}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0)
    return { kind: "not-found" };
  const status = result.stdout.trim();
  if (status === "running")
    return { kind: "running" };
  return { kind: "stopped" };
}
function parsePortsLabel(raw) {
  if (raw == null || raw.trim() === "")
    return [];
  try {
    const json2 = JSON.parse(raw);
    if (!Array.isArray(json2))
      return [];
    return json2.flatMap((item) => {
      const result = AllocatedPortSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}
async function queryDockerPortsLabel(containerName) {
  const result = await exec(`docker inspect --format='{{index .Config.Labels "agentbox.ports"}}' ${containerName}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0)
    return [];
  return parsePortsLabel(result.stdout.trim());
}
function buildDockerRunCommand(containerName, imageName, container) {
  const volumeFlags = container.volumes.map((v2) => `-v ${shellEscape(v2.hostPath)}:${shellEscape(v2.containerPath)}${v2.readOnly ? ":ro" : ""}`);
  const envFlags = container.env.map((e2) => `-e ${e2.name}=${shellEscape(e2.value)}`);
  const portFlags = container.ports.map((p2) => {
    const hostPort = p2.port;
    const containerPort = p2.targetPort ?? p2.port;
    return `-p ${hostPort}:${containerPort}`;
  });
  const ports = container.ports.map((p2) => ({
    name: p2.name,
    nodePort: p2.port,
    targetPort: p2.targetPort ?? p2.port
  }));
  const portsLabel = `--label agentbox.ports=${shellEscape(JSON.stringify(ports))}`;
  return `docker run -d --name ${containerName} --privileged ` + [...volumeFlags, ...envFlags, ...portFlags].join(" ") + ` ${portsLabel}` + ` -w /workspace ${imageName} sleep infinity`;
}
var init_backend = __esm(() => {
  init_dist();
  init_exec();
  init_k8s();
  init_k8s();
  init_container_spec();
});

// src/cache.ts
var exports_cache = {};
__export(exports_cache, {
  stripDigest: () => stripDigest,
  isCacheValid: () => isCacheValid,
  getCachePaths: () => getCachePaths,
  ensureImageCache: () => ensureImageCache,
  dedupeAndSort: () => dedupeAndSort
});
import * as fs2 from "fs";
import * as path6 from "path";
function getCachePaths(agentsDir) {
  const cacheDir = path6.join(agentsDir, "cache");
  return {
    cacheDir,
    tarball: path6.join(cacheDir, "docker-images.tar"),
    manifest: path6.join(cacheDir, "docker-images.manifest")
  };
}
function readManifest(manifestPath) {
  try {
    const content = fs2.readFileSync(manifestPath, "utf-8").trim();
    return content ? content.split(`
`).sort() : null;
  } catch {
    return null;
  }
}
function writeManifest(manifestPath, images) {
  fs2.writeFileSync(manifestPath, images.sort().join(`
`) + `
`);
}
function isCacheValid(cached2, currentImages, tarballExists) {
  if (cached2 == null)
    return false;
  if (!tarballExists)
    return false;
  if (cached2.length !== currentImages.length)
    return false;
  return cached2.every((img, i2) => img === currentImages[i2]);
}
function stripDigest(ref) {
  return ref.replace(/@sha256:[a-f0-9]+$/, "");
}
function dedupeAndSort(images) {
  return [...new Set(images)].sort();
}
async function ensureImageCache(agentsDir, images) {
  const sorted = dedupeAndSort(images);
  if (sorted.length === 0)
    return Ok(null);
  const paths = getCachePaths(agentsDir);
  const cached2 = readManifest(paths.manifest);
  if (isCacheValid(cached2, sorted, fs2.existsSync(paths.tarball))) {
    return Ok(paths.tarball);
  }
  fs2.mkdirSync(paths.cacheDir, { recursive: true });
  await Promise.all(sorted.map((image) => exec(`docker pull ${shellEscape(image)}`, { rejectOnNonZeroExit: false })));
  await Promise.all(sorted.filter((image) => stripDigest(image) !== image).map((image) => exec(`docker tag ${shellEscape(image)} ${shellEscape(stripDigest(image))}`, {
    rejectOnNonZeroExit: false
  })));
  const saveRefs = sorted.map(stripDigest);
  const imageArgs = saveRefs.map((img) => shellEscape(img)).join(" ");
  const saveResult = await tryExec(`docker save ${imageArgs} -o ${shellEscape(paths.tarball)}`, "Docker save failed");
  if (!saveResult.ok)
    return saveResult;
  writeManifest(paths.manifest, sorted);
  return Ok(paths.tarball);
}
var init_cache = __esm(() => {
  init_exec();
});

// src/git/agent-name.ts
function parseAgentName(raw) {
  if (!/^[a-zA-Z0-9-]{1,63}$/.test(raw)) {
    return Err(`Invalid agent name '${raw}': must be 1-63 characters, alphanumeric and hyphens only`);
  }
  return Ok(raw);
}
var init_agent_name = () => {
};

// src/git/paths.ts
import * as path7 from "path";
function getAgentsDirPaths(repoPath) {
  const repoName = path7.basename(repoPath);
  const agentsDir = path7.resolve(repoPath, "..", `${repoName}-agents`);
  return {
    agentsDir,
    bareRepo: path7.join(agentsDir, BARE_REPO_DIR)
  };
}
function getAgentPaths(repoPath, agentName) {
  const { agentsDir, bareRepo } = getAgentsDirPaths(repoPath);
  return {
    agentsDir,
    bareRepo,
    worktree: path7.join(agentsDir, agentName)
  };
}
var BARE_REPO_DIR = ".bare";
var init_paths = () => {
};

// src/git/branches.ts
async function fetchLatestRefs(repoPath, bareRepoPath) {
  const fetchBareRepo = async () => {
    if (!bareRepoPath)
      return;
    await exec(`git -C ${shellEscape(bareRepoPath)} fetch --quiet origin`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
  };
  await Promise.all([
    exec(`git -C ${shellEscape(repoPath)} fetch --quiet`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    }),
    fetchBareRepo()
  ]);
}
function parseBranchLine(line) {
  const [name, sha, author, lastEdit, unix] = line.split("\t");
  if (!name || !sha || !author || !lastEdit || !unix)
    return null;
  return { name, sha, author, lastEdit, lastEditUnix: parseInt(unix, 10) || 0 };
}
async function listLocalBranches(repoPath) {
  const result = await exec(`git -C ${shellEscape(repoPath)} branch --list --sort=-committerdate ${BRANCH_FORMAT}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0 || !result.stdout.trim())
    return [];
  return result.stdout.trim().split(`
`).filter(Boolean).map(parseBranchLine).filter((b2) => b2 != null);
}
async function listRemoteBranches(repoPath) {
  const result = await exec(`git -C ${shellEscape(repoPath)} branch -r --sort=-committerdate ${BRANCH_FORMAT}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0 || !result.stdout.trim())
    return [];
  return result.stdout.trim().split(`
`).filter(Boolean).map(parseBranchLine).filter((b2) => b2 != null && b2.name !== "origin/HEAD");
}
function mergeBranches(local, remote) {
  const localMap = new Map(local.map((b2) => [b2.name, b2]));
  const remoteMap = new Map(remote.map((b2) => [b2.name.replace(/^origin\//, ""), b2]));
  const allBareNames = [
    ...new Set([
      ...local.map((b2) => b2.name),
      ...remote.map((b2) => b2.name.replace(/^origin\//, ""))
    ])
  ];
  return allBareNames.flatMap((name) => {
    const l = localMap.get(name);
    const r2 = remoteMap.get(name);
    if (l && r2) {
      return l.sha === r2.sha ? [{ ...l, location: "local + remote" }] : [
        { ...l, location: "local" },
        { ...r2, location: "remote" }
      ];
    }
    if (l)
      return [{ ...l, location: "local" }];
    if (r2)
      return [{ ...r2, location: "remote" }];
    return [];
  }).toSorted((a2, b2) => b2.lastEditUnix - a2.lastEditUnix);
}
function branchHint(b2) {
  return [b2.location, b2.author, b2.lastEdit].join(", ");
}
async function getRepoOriginUrl(repoPath) {
  const result = await exec(`git -C ${shellEscape(repoPath)} remote get-url origin`, {
    captureOutput: true
  });
  return result.stdout.trim();
}
async function getMainBranch(repoPath) {
  for (const candidate of ["main", "master"]) {
    const result = await exec(`git -C ${shellEscape(repoPath)} rev-parse --verify refs/heads/${candidate}`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    if (result.code === 0)
      return candidate;
  }
  return "main";
}
async function branchExists(bareRepoPath, branch) {
  const result = await exec(`git -C ${shellEscape(bareRepoPath)} show-ref --verify --quiet ${shellEscape(`refs/heads/${branch}`)}`, { captureOutput: true, rejectOnNonZeroExit: false });
  return result.code === 0;
}
var BRANCH_FORMAT = "'--format=%(refname:lstrip=2)%09%(objectname:short)%09%(authorname)%09%(committerdate:relative)%09%(committerdate:unix)'";
var init_branches = __esm(() => {
  init_exec();
});

// src/git/resolve.ts
import * as path8 from "path";
function classifyBranchSources(shas) {
  const present = [shas.originSha, shas.localSha, shas.bareSha].filter((s2) => s2 != null);
  if (present.length === 0)
    return { kind: "new-branch" };
  const unique = new Set(present);
  if (unique.size <= 1)
    return { kind: "agreed", localSha: shas.localSha };
  return { kind: "conflict", localSha: shas.localSha };
}
function groupSourcesBySha(sources) {
  return sources.reduce((groups, { label, sha }) => {
    const existing = groups.find((g) => g.sha === sha);
    if (existing != null) {
      return groups.map((g) => g.sha === sha ? { ...g, labels: [...g.labels, label] } : g);
    }
    return [...groups, { labels: [label], sha, unix: 0 }];
  }, []);
}
async function hasUncommittedChanges(repoPath, branch) {
  const currentBranchResult = await exec(`git -C ${shellEscape(repoPath)} rev-parse --abbrev-ref HEAD`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (currentBranchResult.code !== 0 || currentBranchResult.stdout.trim() !== branch)
    return false;
  const statusResult = await exec(`git -C ${shellEscape(repoPath)} status --porcelain`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return statusResult.stdout.trim().length > 0;
}
async function warnUncommittedChanges(repoPath, branch) {
  if (!await hasUncommittedChanges(repoPath, branch))
    return Ok(undefined);
  const confirmed = await Rt({
    message: `Main repo has uncommitted changes on '${branch}' that won't be in the agent worktree. Continue?`,
    initialValue: true
  });
  if (Ct(confirmed) || !confirmed)
    return Err(CANCELLED);
  return Ok(undefined);
}
async function resolveTargetBranch(bareRepoPath, repoPath, branch, options) {
  const repoName = path8.basename(repoPath);
  const agentsDirName = `${repoName}-agents`;
  const revParse = async (repo, ref) => {
    const result = await exec(`git -C ${shellEscape(repo)} rev-parse --verify --quiet ${shellEscape(ref)}`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    return result.code === 0 ? result.stdout.trim() : null;
  };
  const commitInfo = async (repo, sha) => {
    const result = await exec(`git -C ${shellEscape(repo)} log -1 --format="%s%x09%cr%x09%ct" ${shellEscape(sha)}`, { captureOutput: true, rejectOnNonZeroExit: false });
    const [subject, date5, unixStr] = result.stdout.trim().split("\t");
    return subject && date5 && unixStr ? { subject, date: date5, unix: parseInt(unixStr, 10) || 0 } : null;
  };
  const [originSha, localSha, bareSha] = await Promise.all([
    revParse(bareRepoPath, `refs/remotes/origin/${branch}`),
    revParse(repoPath, `refs/heads/${branch}`),
    revParse(bareRepoPath, `refs/heads/${branch}`)
  ]);
  const outcome = classifyBranchSources({ originSha, localSha, bareSha });
  return M(outcome).with({ kind: "new-branch" }, () => Ok(branch)).with({ kind: "agreed" }, async ({ localSha: local }) => {
    if (local != null) {
      const warning = await warnUncommittedChanges(repoPath, branch);
      if (!warning.ok)
        return warning;
    }
    return Ok(branch);
  }).with({ kind: "conflict" }, async ({ localSha: local }) => {
    const sources = [
      ...local != null ? [{ label: `Local (${repoName})`, sha: local }] : [],
      ...originSha != null ? [{ label: "GitHub", sha: originSha }] : [],
      ...bareSha != null ? [{ label: `Bare repo (${agentsDirName}/.bare)`, sha: bareSha }] : []
    ];
    const rawGroups = groupSourcesBySha(sources);
    const enrichedGroups = await Promise.all(rawGroups.map(async (group2) => {
      const info = await commitInfo(bareRepoPath, group2.sha) ?? await commitInfo(repoPath, group2.sha);
      return info != null ? { ...group2, subject: info.subject, date: info.date, unix: info.unix } : group2;
    }));
    const groups = [...enrichedGroups].sort((a2, b2) => b2.unix - a2.unix);
    R3.warn(`Branch '${branch}' has different versions:`);
    for (const { labels, sha: sha2, subject, date: date5 } of groups) {
      R3.info(`  ${labels.join(" + ")}: ${sha2.slice(0, 7)} "${subject}"${date5 ? ` (${date5})` : ""}`);
    }
    const selectedSha = await (async () => {
      if (options?.useLocalBranch && local != null) {
        R3.step("Using local version (--use-local-branch)");
        return Ok(local);
      }
      const selectOptions = [
        ...groups.map((g) => ({
          value: g.sha,
          label: `${g.labels.join(" + ")} (${g.sha.slice(0, 7)})`,
          hint: g.date
        })),
        { value: "__cancel__", label: "Cancel", hint: undefined }
      ];
      const selected = await Jt({
        message: "Which version should the agent use?",
        options: selectOptions
      });
      if (Ct(selected) || selected === "__cancel__")
        return Err(CANCELLED);
      if (selected === local && local != null) {
        const warning = await warnUncommittedChanges(repoPath, branch);
        if (!warning.ok)
          return warning;
      }
      return Ok(selected);
    })();
    if (!selectedSha.ok)
      return selectedSha;
    const sha = selectedSha.value;
    const commitExists = await exec(`git -C ${shellEscape(bareRepoPath)} cat-file -e ${shellEscape(sha)}`, {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    if (commitExists.code !== 0) {
      await exec(`git -C ${shellEscape(bareRepoPath)} fetch local`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
      });
    }
    const branchResult = await tryExec(`git -C ${shellEscape(bareRepoPath)} branch -f ${shellEscape(branch)} ${shellEscape(sha)}`, `Failed to update branch '${branch}' to ${sha.slice(0, 7)} in the bare repo`);
    if (!branchResult.ok)
      return branchResult;
    return Ok(branch);
  }).exhaustive();
}
var CANCELLED = "cancelled";
var init_resolve = __esm(() => {
  init_dist3();
  init_dist();
  init_exec();
});

// src/git/worktree.ts
import * as fs3 from "fs";
import * as path9 from "path";
async function ensureBareRepo(repoPath) {
  const { agentsDir, bareRepo } = getAgentsDirPaths(repoPath);
  const checkResult = await exec(`git -C ${shellEscape(bareRepo)} rev-parse --is-bare-repository`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (checkResult.code === 0)
    return Ok(bareRepo);
  fs3.mkdirSync(agentsDir, { recursive: true });
  const cloneResult = await tryExec(`git clone --bare ${shellEscape(repoPath)} ${shellEscape(bareRepo)}`, "Failed to clone bare repo");
  if (!cloneResult.ok)
    return cloneResult;
  const originUrl = await getRepoOriginUrl(repoPath);
  const setUrlResult = await tryExec(`git -C ${shellEscape(bareRepo)} remote set-url origin ${shellEscape(originUrl)}`, "Failed to set origin URL");
  if (!setUrlResult.ok)
    return setUrlResult;
  const configFetchResult = await tryExec(`git -C ${shellEscape(bareRepo)} config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'`, "Failed to configure origin fetch");
  if (!configFetchResult.ok)
    return configFetchResult;
  const addLocalResult = await tryExec(`git -C ${shellEscape(bareRepo)} remote add local ${shellEscape(repoPath)}`, "Failed to add local remote");
  if (!addLocalResult.ok)
    return addLocalResult;
  const configLocalResult = await tryExec(`git -C ${shellEscape(bareRepo)} config remote.local.fetch '+refs/heads/*:refs/remotes/local/*'`, "Failed to configure local fetch");
  if (!configLocalResult.ok)
    return configLocalResult;
  return Ok(bareRepo);
}
async function syncBareRepo(bareRepoPath, repoPath) {
  const originUrl = await getRepoOriginUrl(repoPath);
  const currentOrigin = await exec(`git -C ${shellEscape(bareRepoPath)} remote get-url origin`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (currentOrigin.stdout.trim() !== originUrl) {
    const setUrl = await tryExec(`git -C ${shellEscape(bareRepoPath)} remote set-url origin ${shellEscape(originUrl)}`, "Failed to set origin URL on bare repo");
    if (!setUrl.ok)
      return setUrl;
  }
  const localRemote = await exec(`git -C ${shellEscape(bareRepoPath)} remote get-url local`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (localRemote.code !== 0) {
    const addLocal = await tryExec(`git -C ${shellEscape(bareRepoPath)} remote add local ${shellEscape(repoPath)}`, "Failed to add local remote to bare repo");
    if (!addLocal.ok)
      return addLocal;
  } else if (localRemote.stdout.trim() !== repoPath) {
    const setLocal = await tryExec(`git -C ${shellEscape(bareRepoPath)} remote set-url local ${shellEscape(repoPath)}`, "Failed to set local remote URL on bare repo");
    if (!setLocal.ok)
      return setLocal;
  }
  await exec(`git -C ${shellEscape(bareRepoPath)} config remote.local.fetch '+refs/heads/*:refs/remotes/local/*'`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  const originResult = await exec(`git -C ${shellEscape(bareRepoPath)} fetch origin`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  const originWarnings = originResult.code !== 0 ? [
    `origin: Failed to fetch from origin: ${(originResult.stderr ?? "").split(`
`).find((l) => l.trim() !== "")?.trim() ?? "unknown error"}`
  ] : [];
  const localResult = await exec(`git -C ${shellEscape(bareRepoPath)} fetch local 'refs/heads/*:refs/heads/*'`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  const localLines = (localResult.stderr ?? "").split(`
`).map((line) => line.trim()).filter((line) => line !== "");
  const fatalWarnings = localLines.filter((line) => line.includes("fatal:")).map((line) => `local: ${line}`);
  const divergenceWarnings = localLines.filter((line) => (line.includes("rejected") || line.includes("non-fast-forward")) && !line.includes("fatal:"));
  return Ok({ warnings: [...originWarnings, ...fatalWarnings, ...divergenceWarnings] });
}
async function setUpstreamTracking(bareRepoPath, branch) {
  await exec(`git -C ${shellEscape(bareRepoPath)} config ${shellEscape(`branch.${branch}.remote`)} origin`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  await exec(`git -C ${shellEscape(bareRepoPath)} config ${shellEscape(`branch.${branch}.merge`)} ${shellEscape(`refs/heads/${branch}`)}`, { captureOutput: true, rejectOnNonZeroExit: false });
}
async function createWorktree(bareRepoPath, worktreePath, branch, repoPath, baseBranch, resolveOptions) {
  fs3.mkdirSync(path9.dirname(worktreePath), { recursive: true });
  const hasBranch = await branchExists(bareRepoPath, branch);
  if (hasBranch) {
    const resolved = await resolveTargetBranch(bareRepoPath, repoPath, branch, resolveOptions);
    if (!resolved.ok)
      return resolved;
    const addResult = await tryExec(`git -C ${shellEscape(bareRepoPath)} worktree add ${shellEscape(worktreePath)} ${shellEscape(branch)}`, "Failed to add worktree");
    if (!addResult.ok)
      return addResult;
  } else {
    const base = baseBranch ?? await getMainBranch(bareRepoPath);
    const addResult = await tryExec(`git -C ${shellEscape(bareRepoPath)} worktree add -b ${shellEscape(branch)} ${shellEscape(worktreePath)} ${shellEscape(base)}`, "Failed to add worktree");
    if (!addResult.ok)
      return addResult;
  }
  await setUpstreamTracking(bareRepoPath, branch);
  return Ok(worktreePath);
}
async function removeWorktree(bareRepoPath, worktreePath, force = false) {
  const forceFlag = force ? " --force" : "";
  const result = await exec(`git -C ${shellEscape(bareRepoPath)} worktree remove${forceFlag} ${shellEscape(worktreePath)}`, { captureOutput: true, rejectOnNonZeroExit: false });
  if (result.code === 0)
    return Ok(undefined);
  const stderr = (result.stderr ?? "").trim();
  return Err(stderr || `git worktree remove exited with code ${result.code}`);
}
async function listWorktrees(bareRepoPath) {
  const result = await exec(`git -C ${shellEscape(bareRepoPath)} worktree list --porcelain`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0 || !result.stdout.trim())
    return [];
  return result.stdout.trim().split(`

`).flatMap((block) => {
    const lines = block.split(`
`);
    const wtPath = lines.find((l) => l.startsWith("worktree "))?.substring("worktree ".length) ?? "";
    const branch = lines.find((l) => l.startsWith("branch "))?.substring("branch ".length).replace("refs/heads/", "") ?? "";
    if (!wtPath || wtPath === bareRepoPath)
      return [];
    return [{ name: path9.basename(wtPath), path: wtPath, branch: branch || "(detached)" }];
  });
}
async function checkoutAgentBranch(bareRepoPath, repoPath, agentName) {
  const worktrees = await listWorktrees(bareRepoPath);
  const agent = worktrees.find((w2) => w2.name === agentName);
  if (!agent)
    return Err({ kind: "not-found", name: agentName });
  const branch = agent.branch;
  const fetchResult = await tryExec(`git -C ${shellEscape(repoPath)} fetch ${shellEscape(bareRepoPath)} ${shellEscape(branch)}:${shellEscape(branch)}`, `Failed to fetch branch '${branch}' from bare repo`);
  if (!fetchResult.ok) {
    const forceFetch = await tryExec(`git -C ${shellEscape(repoPath)} fetch ${shellEscape(bareRepoPath)} +${shellEscape(branch)}:${shellEscape(branch)}`, `Failed to fetch branch '${branch}' from bare repo`);
    if (!forceFetch.ok)
      return Err({ kind: "fetch-failed", branch, detail: forceFetch.error });
  }
  const checkoutResult = await tryExec(`git -C ${shellEscape(repoPath)} checkout ${shellEscape(branch)}`, `Failed to checkout branch '${branch}'`);
  if (!checkoutResult.ok)
    return Err({ kind: "checkout-failed", branch, detail: checkoutResult.error });
  return Ok(undefined);
}
var init_worktree = __esm(() => {
  init_exec();
  init_branches();
  init_paths();
  init_resolve();
});

// src/git/index.ts
var init_git = __esm(() => {
  init_agent_name();
  init_paths();
  init_branches();
  init_resolve();
  init_worktree();
});

// src/tmux.ts
function isInsideTmux() {
  return !!process.env.TMUX;
}
async function getCurrentSessionName() {
  if (!isInsideTmux())
    return null;
  const result = await exec("tmux display-message -p '#S'", {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0)
    return null;
  return result.stdout.trim();
}
function sanitizeSessionName(name) {
  return name.replace(/[.:/]/g, "-");
}
async function sessionExists(name) {
  const result = await exec(`tmux has-session -t ${shellEscape(name)} 2>/dev/null`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return result.code === 0;
}
async function windowExists(session, window) {
  const result = await exec(`tmux list-windows -t ${shellEscape(session)} -F '#{window_name}'`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0)
    return false;
  return result.stdout.trim().split(`
`).includes(window);
}
async function createSession(name, cwd) {
  const result = await tryExec(`tmux new-session -d -s ${shellEscape(name)} -c ${shellEscape(cwd)}`, "Failed to create tmux session");
  if (!result.ok)
    return result;
  return Ok(undefined);
}
async function createWindow(session, name, afterWindow) {
  const printFmt = "-P -F '#{session_name}:#{window_index}'";
  const after = afterWindow ?? await getLastWindowName(session);
  const result = after ? await tryExec(`tmux new-window -d -t ${shellEscape(session)}:${shellEscape(after)} -a -n ${shellEscape(name)} ${printFmt}`, "Failed to create tmux window") : await tryExec(`tmux new-window -d -t ${shellEscape(session)} -n ${shellEscape(name)} ${printFmt}`, "Failed to create tmux window");
  if (!result.ok)
    return result;
  return Ok(result.value.stdout.trim() || `${session}:${name}`);
}
async function splitPane(target) {
  const result = await tryExec(`tmux split-window -d -t ${shellEscape(target)} -v`, "Failed to split tmux pane");
  if (!result.ok)
    return result;
  return Ok(undefined);
}
async function selectLayout(target, layout) {
  const result = await tryExec(`tmux select-layout -t ${shellEscape(target)} ${layout}`, "Failed to set tmux layout");
  if (!result.ok)
    return result;
  return Ok(undefined);
}
async function sendKeys(target, keys) {
  const result = await tryExec(`tmux send-keys -t ${shellEscape(target)} ${shellEscape(keys)} Enter`, "Failed to send keys to tmux");
  if (!result.ok)
    return result;
  return Ok(undefined);
}
async function switchOrAttach(session) {
  try {
    if (isInsideTmux()) {
      const result = await tryExec(`tmux switch-client -t ${shellEscape(session)}`, "Failed to switch tmux client");
      if (!result.ok)
        return result;
    } else {
      await exec(`tmux attach-session -t ${shellEscape(session)}`, {
        captureOutput: false
      });
    }
    return Ok(undefined);
  } catch (err) {
    return Err(`Failed to attach to tmux session: ${errorMessage(err)}`);
  }
}
async function killSession(name) {
  await exec(`tmux kill-session -t ${shellEscape(name)}`, {
    rejectOnNonZeroExit: false
  });
}
async function gracefullyKillSession(name) {
  const currentPane = process.env.TMUX_PANE;
  const result = await exec(`tmux list-panes -s -t ${shellEscape(name)} -F '#{pane_id} #{pane_pid}'`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code === 0) {
    const panes = result.stdout.trim().split(`
`).filter(Boolean).map((line) => {
      const [id, pidStr] = line.split(" ");
      return { id: id ?? "", pid: parseInt(pidStr ?? "", 10) };
    }).filter((p2) => p2.id !== "");
    const otherPanes = panes.filter((p2) => p2.id !== currentPane);
    for (const pane of otherPanes) {
      await exec(`tmux send-keys -t ${shellEscape(name)}:${pane.id} C-c`, {
        rejectOnNonZeroExit: false
      });
    }
    if (otherPanes.length > 0) {
      await new Promise((r2) => setTimeout(r2, 2000));
    }
    for (const pane of otherPanes) {
      if (!isNaN(pane.pid) && pane.pid > 1) {
        await exec(`kill -9 ${pane.pid}`, { rejectOnNonZeroExit: false });
      }
    }
    if (otherPanes.length > 0) {
      await new Promise((r2) => setTimeout(r2, 500));
    }
  }
  await killSession(name);
}
async function getLastWindowName(session) {
  const result = await exec(`tmux list-windows -t ${shellEscape(session)} -F '#{window_name}'`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code !== 0)
    return null;
  const windows = result.stdout.trim().split(`
`).filter(Boolean);
  return windows.at(-1) ?? null;
}
async function createWindowWithPanes(session, window, wrapCommand) {
  const windowResult = await createWindow(session, window.name);
  if (!windowResult.ok)
    return windowResult;
  const target = windowResult.value;
  for (let i2 = 1;i2 < window.panes.length; i2++) {
    const splitResult = await splitPane(`${target}.0`);
    if (!splitResult.ok)
      return splitResult;
  }
  if (window.panes.length > 1) {
    const layoutResult = await selectLayout(target, "even-vertical");
    if (!layoutResult.ok)
      return layoutResult;
  }
  for (const [i2, pane] of window.panes.entries()) {
    if (!pane.command)
      continue;
    const paneTarget = `${target}.${i2}`;
    if (pane.sleepSeconds && pane.sleepSeconds > 0) {
      const sleepResult = await sendKeys(paneTarget, `sleep ${pane.sleepSeconds}`);
      if (!sleepResult.ok)
        return sleepResult;
    }
    const cmd = wrapCommand ? wrapCommand(pane.command) : pane.command;
    const cmdResult = await sendKeys(paneTarget, cmd);
    if (!cmdResult.ok)
      return cmdResult;
  }
  return Ok(undefined);
}
async function setupMode(session, mode, wrapCommand) {
  for (const window of mode.windows) {
    if (await windowExists(session, window.name))
      continue;
    const result = await createWindowWithPanes(session, window, wrapCommand);
    if (!result.ok)
      return result;
  }
  return Ok(undefined);
}
async function ensureSession(name, cwd) {
  const sessionName = sanitizeSessionName(name);
  if (!await sessionExists(sessionName)) {
    const result = await createSession(sessionName, cwd);
    if (!result.ok)
      return result;
  }
  return Ok(sessionName);
}
var isTmuxInstalled;
var init_tmux = __esm(() => {
  init_exec();
  isTmuxInstalled = once(async () => {
    const result = await exec("which tmux", {
      captureOutput: true,
      rejectOnNonZeroExit: false
    });
    return result.code === 0;
  });
});

// src/vm.ts
import * as fs4 from "fs";
import * as os4 from "os";
import * as path10 from "path";
async function diagnose() {
  const results = await Promise.all(VM_CHECKS.map(async (check2) => ({
    kind: check2.kind,
    name: check2.name,
    ok: await check2.detect()
  })));
  return results;
}
function failingKinds(checks3) {
  return new Set(checks3.filter((c2) => !c2.ok).map((c2) => c2.kind));
}
async function checkVm() {
  const checks3 = await diagnose();
  const allGood = checks3.every((c2) => c2.ok);
  const fixScript = allGood ? null : buildFixScript(failingKinds(checks3));
  return { checks: checks3, allGood, fixScript };
}
async function commandExists(cmd) {
  const result = await exec(`which ${cmd}`, { captureOutput: true, rejectOnNonZeroExit: false });
  return result.code === 0;
}
async function systemdActive(service) {
  const result = await exec(`systemctl is-active ${service}`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return result.stdout.trim() === "active";
}
function isKataInstalled() {
  return fileExists(KATA_SHIM_PATH) && fileExists(`${KATA_INSTALL_DIR}/bin/cloud-hypervisor`);
}
async function modulesAreLoaded() {
  const result = await exec("lsmod", { captureOutput: true, rejectOnNonZeroExit: false });
  if (result.code !== 0)
    return false;
  return REQUIRED_MODULES.every((m) => result.stdout.includes(m));
}
function isShimSymlinked() {
  try {
    return fs4.existsSync(SHIM_SYMLINK_PATH) && fs4.existsSync(fs4.realpathSync(SHIM_SYMLINK_PATH));
  } catch {
    return false;
  }
}
async function isKataConfigured() {
  const content = readFileSafe(KATA_CONFIG_PATH);
  if (!content)
    return false;
  return /\[hypervisor\.clh\]/.test(content) && /virtio_fs_cache\s*=\s*"auto"/.test(content) && /enable_virtio_mem\s*=\s*true/.test(content);
}
async function isContainerdConfigured() {
  const content = readFileSafe(K3S_CONTAINERD_TMPL);
  if (content) {
    return content.includes("containerd.runtimes.kata") && content.includes("io.containerd.kata.v2");
  }
  return await systemdActive("k3s") && await runtimeClassExists();
}
function isSocketAccessible() {
  try {
    fs4.accessSync(CONTAINERD_SOCKET_PATH, fs4.constants.R_OK | fs4.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}
async function isTraefikDisabled() {
  if (!isFileReadable(KUBECONFIG_PATH))
    return true;
  const result = await exec(`KUBECONFIG=${KUBECONFIG_PATH} kubectl get helmchart traefik -n kube-system -o name 2>/dev/null`, { captureOutput: true, rejectOnNonZeroExit: false });
  return result.code !== 0 || result.stdout.trim() === "";
}
async function runtimeClassExists() {
  if (!isFileReadable(KUBECONFIG_PATH))
    return false;
  const result = await exec(`KUBECONFIG=${KUBECONFIG_PATH} kubectl get runtimeclass kata -o name`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  return result.code === 0;
}
function fileExists(p2) {
  return fs4.existsSync(p2);
}
function isFileReadable(p2) {
  try {
    fs4.accessSync(p2, fs4.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
function readFileSafe(p2) {
  try {
    return fs4.readFileSync(p2, "utf-8");
  } catch {
    return null;
  }
}
async function smokeTest() {
  await ensureNamespace();
  await exec(kubectl(`delete pod ${SMOKE_TEST_POD_NAME} --ignore-not-found`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  const podYaml = toYaml(SMOKE_TEST_POD_SPEC);
  const apply = await exec(`cat <<'K8S_EOF' | ${kubectl("apply -f -")}
${podYaml}
K8S_EOF`, {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (apply.code !== 0) {
    return Err(`Failed to create smoke test pod: ${(apply.stdout + apply.stderr).trim()}`);
  }
  const wait = await exec(kubectl(`wait --for=jsonpath='{.status.phase}'=Succeeded pod/${SMOKE_TEST_POD_NAME} --timeout=60s`), { captureOutput: true, rejectOnNonZeroExit: false });
  const logs = await exec(kubectl(`logs ${SMOKE_TEST_POD_NAME}`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  await exec(kubectl(`delete pod ${SMOKE_TEST_POD_NAME} --ignore-not-found`), {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (logs.code === 0 && logs.stdout.trim() === "ok") {
    return Ok(undefined);
  }
  const output = (logs.stdout + logs.stderr + wait.stderr).trim();
  return Err(output ? `Smoke test failed: ${output}` : "Smoke test failed: pod did not produce expected output");
}
function getFixSteps(failing) {
  const has = (kind) => failing.has(kind);
  return [
    ...has("kataInstall") ? [{ kind: "installKata" }] : [],
    ...has("modules") ? [{ kind: "loadModules" }] : [],
    ...has("shimSymlink") ? [{ kind: "shimSymlink" }] : [],
    ...has("kataConfig") ? [{ kind: "configureKata" }] : [],
    ...has("k3sInstall") ? [{ kind: "installK3s" }] : [],
    ...has("k3sRunning") && !has("k3sInstall") ? [{ kind: "startK3s" }] : [],
    ...has("traefikDisabled") && !has("k3sInstall") ? [{ kind: "disableTraefik" }] : [],
    ...has("containerdSocketAccess") || has("k3sInstall") ? [{ kind: "socketAccess" }] : [],
    ...has("kubeconfig") || has("k3sInstall") ? [{ kind: "kubeconfig" }] : [],
    ...has("containerdConfig") || has("k3sInstall") ? [{ kind: "containerdConfig" }] : [],
    ...has("runtimeClass") || has("k3sInstall") ? [{ kind: "runtimeClass" }] : []
  ];
}
function renderFixStep(step) {
  return M(step).with({ kind: "installKata" }, () => {
    const tarball = `kata-static-${KATA_VERSION}-amd64.tar.zst`;
    const url2 = `https://github.com/kata-containers/kata-containers/releases/download/${KATA_VERSION}/${tarball}`;
    return [
      `# Install Kata Containers ${KATA_VERSION}`,
      `curl -fSL -o /tmp/${tarball} ${url2}`,
      `sudo mkdir -p ${KATA_INSTALL_DIR}`,
      `sudo tar --use-compress-program=unzstd -xf /tmp/${tarball} --strip-components=3 -C ${KATA_INSTALL_DIR} ./opt/kata`,
      `sudo chmod 755 ${KATA_INSTALL_DIR}/bin/cloud-hypervisor`,
      `rm /tmp/${tarball}`,
      ""
    ];
  }).with({ kind: "loadModules" }, () => [
    "# Load kernel modules for Kata",
    ...REQUIRED_MODULES.map((m) => `sudo modprobe ${m}`),
    `printf '%s\\n' ${REQUIRED_MODULES.join(" ")} | sudo tee ${MODULES_LOAD_PATH}`,
    ""
  ]).with({ kind: "shimSymlink" }, () => [
    "# Symlink Kata shim for containerd discovery",
    `sudo ln -sf ${KATA_SHIM_PATH} ${SHIM_SYMLINK_PATH}`,
    ""
  ]).with({ kind: "configureKata" }, () => {
    const clhTemplate = `${KATA_INSTALL_DIR}/share/defaults/kata-containers/configuration-clh.toml`;
    return [
      "# Configure Kata for Cloud Hypervisor",
      `sudo mkdir -p ${KATA_CONFIG_DIR}`,
      `sudo sed -e 's|^path = ".*cloud-hypervisor.*"|path = "${KATA_INSTALL_DIR}/bin/cloud-hypervisor"|' \\`,
      `  -e 's|^virtio_fs_cache =.*|virtio_fs_cache = "auto"|' \\`,
      `  ${clhTemplate} | sudo tee ${KATA_CONFIG_PATH} > /dev/null`,
      `sudo sed -i '/^default_memory = /a enable_virtio_mem = true' ${KATA_CONFIG_PATH}`,
      ""
    ];
  }).with({ kind: "installK3s" }, () => [
    "# Install k3s (Traefik disabled)",
    'curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik" sudo -E sh -',
    ""
  ]).with({ kind: "startK3s" }, () => ["# Start k3s", "sudo systemctl start k3s", ""]).with({ kind: "disableTraefik" }, () => [
    "# Disable Traefik",
    `KUBECONFIG=${KUBECONFIG_PATH} kubectl delete helmchart traefik traefik-crd -n kube-system --ignore-not-found`,
    "sudo mkdir -p /etc/rancher/k3s",
    `sudo tee /etc/rancher/k3s/config.yaml <<'EOF'
disable:
  - traefik
EOF`,
    "sudo systemctl restart k3s",
    ""
  ]).with({ kind: "socketAccess" }, () => [
    "# Grant user access to k3s containerd socket",
    "sudo groupadd -f k3s",
    "sudo usermod -aG k3s $(whoami)",
    "sudo mkdir -p /etc/systemd/system/k3s.service.d",
    "sudo tee /etc/systemd/system/k3s.service.d/socket-perms.conf <<'EOF'",
    "[Service]",
    "ExecStartPost=/bin/sh -c 'chown root:k3s /run/k3s/containerd/containerd.sock && chmod 0660 /run/k3s/containerd/containerd.sock'",
    "EOF",
    "sudo systemctl daemon-reload",
    "sudo systemctl restart k3s",
    ""
  ]).with({ kind: "kubeconfig" }, () => [
    "# Set up kubeconfig",
    "mkdir -p ~/.kube",
    "sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config",
    "sudo chown $(id -u):$(id -g) ~/.kube/config",
    ""
  ]).with({ kind: "containerdConfig" }, () => [
    "# Configure k3s containerd with Kata runtime",
    `sudo tee ${K3S_CONTAINERD_TMPL} <<'CONTAINERD_EOF'`,
    buildContainerdTemplate().trimEnd(),
    "CONTAINERD_EOF",
    "sudo systemctl restart k3s",
    ""
  ]).with({ kind: "runtimeClass" }, () => [
    "# Create Kata RuntimeClass",
    "KUBECONFIG=~/.kube/config kubectl apply -f - <<'EOF'",
    `apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata
handler: kata`,
    "EOF",
    ""
  ]).exhaustive();
}
function buildFixScript(failing) {
  const steps = getFixSteps(failing);
  const lines = ["#!/usr/bin/env bash", "set -euo pipefail", "", ...steps.flatMap(renderFixStep)];
  return lines.join(`
`);
}
function buildContainerdTemplate() {
  return `version = 3
root = "/var/lib/rancher/k3s/agent/containerd"
state = "/run/k3s/containerd"

[grpc]
  address = "/run/k3s/containerd/containerd.sock"

[plugins.'io.containerd.internal.v1.opt']
  path = "/var/lib/rancher/k3s/agent/containerd"

[plugins.'io.containerd.grpc.v1.cri']
  stream_server_address = "127.0.0.1"
  stream_server_port = "10010"

[plugins.'io.containerd.cri.v1.runtime']
  enable_selinux = false
  enable_unprivileged_ports = true
  enable_unprivileged_icmp = true

[plugins.'io.containerd.cri.v1.images']
  snapshotter = "overlayfs"
  disable_snapshot_annotations = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  runtime_type = "io.containerd.runc.v2"

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
  SystemdCgroup = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.kata]
  runtime_type = "io.containerd.kata.v2"
  privileged_without_host_devices = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.kata.options]
  ConfigPath = "${KATA_CONFIG_PATH}"

[plugins.'io.containerd.cri.v1.images'.registry]
  config_path = "/var/lib/rancher/k3s/agent/etc/containerd/certs.d"
`;
}
var KATA_INSTALL_DIR = "/opt/kata", KATA_SHIM_PATH, KATA_CONFIG_DIR = "/etc/kata-containers", KATA_CONFIG_PATH, SHIM_SYMLINK_PATH = "/usr/local/bin/containerd-shim-kata-v2", MODULES_LOAD_PATH = "/etc/modules-load.d/kata.conf", K3S_CONTAINERD_TMPL = "/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl", CONTAINERD_SOCKET_PATH = "/run/k3s/containerd/containerd.sock", KUBECONFIG_PATH, REQUIRED_MODULES, KATA_VERSION = "3.27.0", VM_CHECKS, SMOKE_TEST_POD_NAME = "agentbox-smoke-test", SMOKE_TEST_POD_SPEC;
var init_vm = __esm(() => {
  init_dist();
  init_exec();
  init_k8s();
  KATA_SHIM_PATH = `${KATA_INSTALL_DIR}/bin/containerd-shim-kata-v2`;
  KATA_CONFIG_PATH = `${KATA_CONFIG_DIR}/configuration.toml`;
  KUBECONFIG_PATH = path10.join(os4.homedir(), ".kube/config");
  REQUIRED_MODULES = ["vhost_vsock", "vhost"];
  VM_CHECKS = [
    { kind: "kataInstall", name: "Kata Containers installed", detect: () => isKataInstalled() },
    {
      kind: "modules",
      name: "Kernel modules loaded (vhost_vsock, vhost)",
      detect: () => modulesAreLoaded()
    },
    {
      kind: "shimSymlink",
      name: "Kata shim symlinked for containerd",
      detect: () => isShimSymlinked()
    },
    {
      kind: "kataConfig",
      name: "Kata configured for Cloud Hypervisor",
      detect: () => isKataConfigured()
    },
    { kind: "k3sInstall", name: "k3s installed", detect: () => commandExists("k3s") },
    { kind: "k3sRunning", name: "k3s running", detect: () => systemdActive("k3s") },
    {
      kind: "containerdSocketAccess",
      name: "k3s containerd socket accessible",
      detect: () => isSocketAccessible()
    },
    {
      kind: "containerdConfig",
      name: "k3s containerd configured for Kata",
      detect: () => isContainerdConfigured()
    },
    {
      kind: "kubeconfig",
      name: "Kubeconfig accessible",
      detect: () => isFileReadable(KUBECONFIG_PATH)
    },
    { kind: "runtimeClass", name: "Kata RuntimeClass created", detect: () => runtimeClassExists() },
    {
      kind: "traefikDisabled",
      name: "Traefik disabled (ports 80/443 free)",
      detect: () => isTraefikDisabled()
    }
  ];
  SMOKE_TEST_POD_SPEC = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: SMOKE_TEST_POD_NAME
    },
    spec: {
      runtimeClassName: "kata",
      restartPolicy: "Never",
      containers: [
        {
          name: "test",
          image: "alpine",
          command: ["sh", "-c", "echo ok"]
        }
      ]
    }
  };
});

// src/strategies.ts
var exports_strategies = {};
__export(exports_strategies, {
  yarnStrategy: () => yarnStrategy,
  runHostPrepare: () => runHostPrepare,
  pnpmStrategy: () => pnpmStrategy,
  npmStrategy: () => npmStrategy,
  nixStrategy: () => nixStrategy,
  direnvStrategy: () => direnvStrategy,
  detectStrategies: () => detectStrategies,
  collectStrategyVolumes: () => collectStrategyVolumes,
  claudeStrategy: () => claudeStrategy,
  bunStrategy: () => bunStrategy,
  builtInStrategies: () => builtInStrategies
});
import * as childProcess from "child_process";
import * as fs5 from "fs";
import * as os5 from "os";
import * as path11 from "path";
function fileExists2(repoRoot, filename) {
  return fs5.existsSync(path11.join(repoRoot, filename));
}
function nixStrategy(opts) {
  const nixPath = opts?.nixPath ?? "/nix";
  return {
    name: "nix",
    detect: async (repoRoot) => fileExists2(repoRoot, "flake.nix"),
    hostPrepare: async (ctx, _repoRoot, worktreePath) => {
      if (!ctx.trusted) {
        ctx.logWarning("Skipping nix build (untrusted). If derivations are already cached, the dev environment will be set up inside the container.");
        return Ok(undefined);
      }
      const outputPath = path11.join(worktreePath, ".nix-dev-env.sh");
      const result = await tryExec(`nix print-dev-env ${shellEscape(worktreePath)} > ${shellEscape(outputPath)}`, "nix print-dev-env failed", { timeout: 120000 });
      if (!result.ok)
        return Err(result.error);
      return Ok(undefined);
    },
    containerInstall: async () => [
      "[ -f /workspace/.nix-dev-env.sh ] || nix print-dev-env --store local --offline /workspace > /workspace/.nix-dev-env.sh"
    ],
    shellInit: () => ["source /workspace/.nix-dev-env.sh"],
    volumes: () => fs5.existsSync(nixPath) ? [{ hostPath: nixPath, containerPath: "/nix", readOnly: true }] : []
  };
}
function direnvStrategy() {
  return {
    name: "direnv",
    detect: async (repoRoot) => fileExists2(repoRoot, ".envrc"),
    hostPrepare: async (ctx, _repoRoot, worktreePath) => {
      if (!ctx.trusted)
        return Ok(undefined);
      const result = await tryExec(`direnv allow ${shellEscape(worktreePath)}`, "direnv allow failed");
      if (!result.ok)
        return Err(result.error);
      return Ok(undefined);
    }
  };
}
function resolveClaudeCliPathSync() {
  if (cachedClaudeCliPath !== undefined)
    return cachedClaudeCliPath;
  try {
    const out = childProcess.execFileSync("which", ["claude"], { encoding: "utf-8" }).trim();
    cachedClaudeCliPath = out ? fs5.realpathSync(out) : null;
  } catch {
    cachedClaudeCliPath = null;
  }
  return cachedClaudeCliPath;
}
async function resolveClaudeCliPath() {
  if (cachedClaudeCliPath !== undefined)
    return cachedClaudeCliPath;
  return resolveClaudeCliPathSync();
}
function claudeStrategy() {
  const hostHome = os5.homedir();
  return {
    name: "claude",
    detect: async () => {
      const cliPath = await resolveClaudeCliPath();
      return cliPath != null;
    },
    volumes: () => {
      const vols = [
        { hostPath: path11.join(hostHome, ".claude"), containerPath: "/home/agent/.claude" }
      ];
      const cliPath = resolveClaudeCliPathSync();
      if (cliPath != null) {
        vols.push({
          hostPath: cliPath,
          containerPath: "/usr/local/bin/claude",
          readOnly: true
        });
      }
      const claudeJsonPath = path11.join(hostHome, ".claude.json");
      if (fs5.existsSync(claudeJsonPath)) {
        vols.push({
          hostPath: claudeJsonPath,
          containerPath: "/home/agent/.claude.json"
        });
      }
      return vols;
    }
  };
}
function bunStrategy(opts) {
  return {
    name: "bun",
    detect: async (repoRoot) => fileExists2(repoRoot, "bun.lock") || fileExists2(repoRoot, "bun.lockb"),
    containerInstall: async () => ["bun install --frozen-lockfile"],
    ...opts?.cachePath && {
      volumes: () => [
        { hostPath: opts.cachePath, containerPath: "/home/agent/.bun/install/cache" }
      ]
    }
  };
}
function yarnStrategy(opts) {
  return {
    name: "yarn",
    detect: async (repoRoot) => fileExists2(repoRoot, "yarn.lock"),
    containerInstall: async () => ["yarn install --frozen-lockfile"],
    ...opts?.cachePath && {
      volumes: () => [{ hostPath: opts.cachePath, containerPath: "/home/agent/.yarn" }]
    }
  };
}
function pnpmStrategy(opts) {
  return {
    name: "pnpm",
    detect: async (repoRoot) => fileExists2(repoRoot, "pnpm-lock.yaml"),
    containerInstall: async () => ["pnpm install --frozen-lockfile"],
    ...opts?.storePath && {
      volumes: () => [
        { hostPath: opts.storePath, containerPath: "/home/agent/.local/share/pnpm/store" }
      ]
    }
  };
}
function npmStrategy(opts) {
  return {
    name: "npm",
    detect: async (repoRoot) => fileExists2(repoRoot, "package-lock.json"),
    containerInstall: async () => ["npm ci"],
    ...opts?.cachePath && {
      volumes: () => [{ hostPath: opts.cachePath, containerPath: "/home/agent/.npm" }]
    }
  };
}
async function detectStrategies(repoRoot, strategies = builtInStrategies) {
  const results = await Promise.all(strategies.map(async (s2) => ({ strategy: s2, detected: await s2.detect(repoRoot) })));
  return results.filter((r2) => r2.detected).map((r2) => r2.strategy);
}
async function runHostPrepare(ctx, strategies, repoRoot, worktreePath) {
  for (const strategy of strategies) {
    if (strategy.hostPrepare) {
      const result = await strategy.hostPrepare(ctx, repoRoot, worktreePath);
      if (!result.ok)
        return result;
    }
  }
  return Ok(undefined);
}
function collectStrategyVolumes(strategies) {
  return strategies.flatMap((s2) => s2.volumes?.() ?? []);
}
var cachedClaudeCliPath, builtInStrategies;
var init_strategies = __esm(() => {
  init_exec();
  builtInStrategies = [
    nixStrategy(),
    direnvStrategy(),
    claudeStrategy(),
    bunStrategy(),
    yarnStrategy(),
    pnpmStrategy(),
    npmStrategy()
  ];
});

// src/agent.ts
import * as fs6 from "fs";
import * as os6 from "os";
import * as path12 from "path";
function selectBackendKind(k3sAvailable) {
  return k3sAvailable ? "k3s" : "docker";
}
async function resolveBackend(agentName) {
  const kind = selectBackendKind(await isK3sAvailable());
  return createBackend(agentName, kind);
}
async function logBackendFallback() {
  if (await isK3sAvailable())
    return;
  await logFallbackOnce();
}
async function createAgentContext(name, repoPath, config2) {
  const paths = getAgentPaths(repoPath, name);
  const backend = await resolveBackend(name);
  return { name, paths, config: config2, backend };
}
async function preflightVmCheck() {
  const diagnosis = await checkVm();
  if (diagnosis.allGood)
    return Ok(undefined);
  for (const check2 of diagnosis.checks) {
    if (!check2.ok) {
      R3.error(`${check2.name}`);
    }
  }
  if (diagnosis.fixScript != null) {
    const fixPath = path12.join(os6.tmpdir(), "agentbox-fix-vm.sh");
    fs6.writeFileSync(fixPath, diagnosis.fixScript, { mode: 493 });
    Vt2(`bash ${fixPath}`, "Run the fix script to resolve:");
  }
  return Err("VM not ready — run `agentbox check-vm` for details");
}
function ensureClaudeBypassPermissions(hostHome) {
  const claudeJsonPath = path12.join(hostHome, ".claude.json");
  try {
    if (!fs6.existsSync(claudeJsonPath))
      return;
    const raw = fs6.readFileSync(claudeJsonPath, "utf-8");
    const parsed = JSON.parse(raw);
    const result = ClaudeJsonSchema.safeParse(parsed);
    if (!result.success)
      return;
    if (result.data.bypassPermissionsModeAccepted === true)
      return;
    const updated = { ...result.data, bypassPermissionsModeAccepted: true };
    fs6.writeFileSync(claudeJsonPath, JSON.stringify(updated, null, 2) + `
`);
  } catch {
  }
}
async function readGitIdentity() {
  const gitName = (await exec("git config --global user.name", {
    captureOutput: true,
    rejectOnNonZeroExit: false
  })).stdout.trim();
  const gitEmail = (await exec("git config --global user.email", {
    captureOutput: true,
    rejectOnNonZeroExit: false
  })).stdout.trim();
  return gitName && gitEmail ? { name: gitName, email: gitEmail } : undefined;
}
async function resolveStrategies(ctx) {
  if (ctx.config.dependencyStrategies.length > 0)
    return ctx.config.dependencyStrategies;
  const { detectStrategies: detectStrategies2 } = await Promise.resolve().then(() => (init_strategies(), exports_strategies));
  const detected = await detectStrategies2(ctx.paths.worktree);
  if (detected.length > 0) {
    R3.step(`Detected strategies: ${detected.map((s2) => s2.name).join(", ")}`);
  }
  return detected;
}
async function runContainerInstall(strategies, execPrefix) {
  const installFns = strategies.map((s2) => s2.containerInstall).filter((fn) => fn != null);
  for (const install of installFns) {
    const commands = await install("/workspace");
    for (const cmd of commands) {
      R3.step(`Installing: ${cmd}`);
      await exec(`${execPrefix} ${shellEscape(cmd)}`, { rejectOnNonZeroExit: false });
    }
  }
}
async function loadCachedImages(backend, imageCachePath) {
  if (!imageCachePath)
    return;
  const cacheSpinner = be();
  cacheSpinner.start("Loading cached docker images...");
  await exec(`${buildExecCommand(backend, "bash -c")} ${shellEscape("until docker info >/dev/null 2>&1; do sleep 1; done && docker load -i /cache/docker-images.tar")}`, { rejectOnNonZeroExit: false });
  cacheSpinner.stop("Cached docker images loaded");
}
async function getAgentState(nameOrCtx) {
  if (typeof nameOrCtx === "string") {
    const backend = await resolveBackend(nameOrCtx);
    return getBackendState(backend);
  }
  return getBackendState(nameOrCtx.backend);
}
async function getAgentPorts(nameOrCtx) {
  if (typeof nameOrCtx === "string") {
    const backend = await resolveBackend(nameOrCtx);
    return getBackendServicePorts(backend);
  }
  return getBackendServicePorts(nameOrCtx.backend);
}
async function getAgentLogs(agentName, options = {}) {
  const backend = await resolveBackend(agentName);
  return getBackendLogs(backend, options);
}
async function stopAgent(agentName) {
  const backend = await resolveBackend(agentName);
  return stopBackend(backend);
}
async function execInAgent(agentName, command2, options = {}) {
  const { interactive = true } = options;
  const backend = await resolveBackend(agentName);
  const execCmd = buildExecCommand(backend, command2, { interactive });
  const result = await exec(execCmd, { captureOutput: !interactive, rejectOnNonZeroExit: false });
  if (!interactive && result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (!interactive && result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
  return Ok(result.code ?? 1);
}
async function ensureAgentPod(ctx) {
  const { name, paths, config: config2, backend } = ctx;
  if (await isBackendRunning(backend)) {
    R3.step(backend.kind === "k3s" ? "Pod already running" : "Container already running");
    return Ok(undefined);
  }
  if (backend.kind === "k3s") {
    const vmResult = await preflightVmCheck();
    if (!vmResult.ok)
      return vmResult;
  }
  const buildSpinner = be();
  buildSpinner.start("Building agent image...");
  const imageResult = await buildAgentImage(config2.containerImage, backend.kind);
  if (!imageResult.ok) {
    buildSpinner.stop("Failed");
    return imageResult;
  }
  buildSpinner.stop("Agent image built");
  const imageName = imageResult.value;
  const cacheResult = config2.cacheImages ? await ensureImageCache(paths.agentsDir, await resolveCacheImages(config2.cacheImages)) : Ok(null);
  if (!cacheResult.ok)
    return cacheResult;
  const imageCachePath = cacheResult.value ?? undefined;
  const gitUser = await readGitIdentity();
  ensureClaudeBypassPermissions(os6.homedir());
  const strategies = await resolveStrategies(ctx);
  const { collectStrategyVolumes: collectStrategyVolumes2 } = await Promise.resolve().then(() => (init_strategies(), exports_strategies));
  const strategyVolumes = collectStrategyVolumes2(strategies);
  const startSpinner = be();
  startSpinner.start(backend.kind === "k3s" ? "Starting agent pod..." : "Starting Docker container...");
  const startResult = await startBackend(backend, {
    agentName: name,
    worktreePath: paths.worktree,
    bareRepoPath: paths.bareRepo,
    config: config2,
    imageName,
    imageCachePath,
    gitUser,
    strategyVolumes
  });
  if (!startResult.ok) {
    startSpinner.stop("Failed");
    return startResult;
  }
  startSpinner.stop(backend.kind === "k3s" ? "Agent pod started" : "Docker container started");
  await loadCachedImages(backend, imageCachePath);
  await runContainerInstall(strategies, buildExecCommand(backend, "bash -c"));
  return Ok(undefined);
}
async function setupAgentTmux(ctx, mode) {
  const { name, paths, backend } = ctx;
  const sessionResult = await ensureSession(name, paths.worktree);
  if (!sessionResult.ok)
    return sessionResult;
  const session = sessionResult.value;
  if (!await windowExists(session, "main")) {
    const windowResult = await createWindow(session, "main");
    if (!windowResult.ok)
      return windowResult;
    const mainTarget = windowResult.value;
    const execResult = await sendKeys(mainTarget, buildExecCommand(backend));
    if (!execResult.ok)
      return execResult;
  }
  if (mode) {
    const strategies = await resolveStrategies(ctx);
    const initLines = strategies.flatMap((s2) => s2.shellInit?.() ?? []);
    const initPrefix = initLines.length > 0 ? initLines.join(" && ") + " && " : "";
    const wrapCommand = (cmd) => buildExecCommand(backend, `bash -c ${shellEscape(`${initPrefix}${cmd}`)}`);
    const modeResult = await setupMode(session, mode, wrapCommand);
    if (!modeResult.ok)
      return modeResult;
  }
  return Ok(session);
}
async function startAndSetupAgent(ctx, mode) {
  const podResult = await ensureAgentPod(ctx);
  if (!podResult.ok)
    return podResult;
  return setupAgentTmux(ctx, mode);
}
function handleLifecycleError(error48) {
  R3.error(error48);
  R3.info("Run `agentbox check-vm` to diagnose VM issues");
  Gt("Aborted");
  return 1;
}
async function detectAgentPresence(agentName, paths) {
  const tmuxAvailable = await isTmuxInstalled();
  const hasSession = tmuxAvailable && await sessionExists(sanitizeSessionName(agentName));
  const agentState = await getAgentState(agentName);
  const hasWorktree = fs6.existsSync(paths.worktree);
  return { hasSession, agentState, hasWorktree };
}
async function removeAgent(agentName, paths, presence, options) {
  const { force } = options;
  const { hasSession, agentState, hasWorktree } = presence;
  const containerWarning = await (async () => {
    if (agentState.kind === "not-found")
      return Ok(undefined);
    const stopResult = await stopAgent(agentName);
    if (stopResult.ok)
      return Ok(undefined);
    if (!force)
      return Err(stopResult.error);
    return Ok(`Container ${agentState.kind === "running" ? "stop" : "removal"} failed: ${stopResult.error}`);
  })();
  if (!containerWarning.ok)
    return containerWarning;
  const worktreeWarning = await (async () => {
    if (!hasWorktree)
      return Ok(undefined);
    if (!fs6.existsSync(paths.bareRepo)) {
      fs6.rmSync(paths.worktree, { recursive: true, force: true });
      return Ok(undefined);
    }
    const removeResult = await removeWorktree(paths.bareRepo, paths.worktree, true);
    if (removeResult.ok)
      return Ok(undefined);
    if (!force)
      return Err(removeResult.error);
    fs6.rmSync(paths.worktree, { recursive: true, force: true });
    return Ok("Worktree removal failed, falling back to direct deletion");
  })();
  if (!worktreeWarning.ok)
    return worktreeWarning;
  if (hasSession) {
    await gracefullyKillSession(sanitizeSessionName(agentName));
  }
  return Ok({
    warnings: [containerWarning.value, worktreeWarning.value].filter((w2) => w2 != null)
  });
}
var isK3sAvailable, logFallbackOnce, ClaudeJsonSchema;
var init_agent = __esm(() => {
  init_zod();
  init_config();
  init_exec();
  init_dist3();
  init_backend();
  init_cache();
  init_git();
  init_image();
  init_tmux();
  init_vm();
  isK3sAvailable = once(async () => {
    const result = await exec("which k3s", { captureOutput: true, rejectOnNonZeroExit: false });
    return result.code === 0;
  });
  logFallbackOnce = once(async () => {
    R3.step("k3s not found — falling back to plain Docker (less secure)");
  });
  ClaudeJsonSchema = exports_external.object({ bypassPermissionsModeAccepted: exports_external.boolean().optional() }).passthrough();
});

// src/loader.ts
import * as fs7 from "fs";
import * as path13 from "path";
async function loadConfig(repoPath) {
  const configPath = findConfigFile(repoPath);
  if (configPath == null) {
    return Err(`No agentbox config found in ${repoPath}
Create ${CONFIG_FILENAMES[0]} in your repo root.`);
  }
  let mod;
  try {
    mod = await import(configPath);
  } catch (err) {
    const message2 = errorMessage(err);
    return Err(`Failed to load ${path13.basename(configPath)}: ${message2}`);
  }
  const raw = isModuleWithDefault(mod) ? mod.default : mod;
  const result = AgentboxConfigSchema.safeParse(raw);
  if (!result.success) {
    const filename = path13.basename(configPath);
    const issues = result.error.issues.map((i2) => `  ${i2.path.join(".")}: ${i2.message}`).join(`
`);
    return Err(`${filename} has invalid config:
${issues}
Use defineConfig() for type checking.`);
  }
  return Ok(result.data);
}
function isModuleWithDefault(mod) {
  return mod != null && typeof mod === "object" && "default" in mod;
}
function findConfigFile(repoPath) {
  for (const filename of CONFIG_FILENAMES) {
    const configPath = path13.join(repoPath, filename);
    if (fs7.existsSync(configPath))
      return configPath;
  }
  return null;
}
async function getRepoPath() {
  const result = await exec("git rev-parse --show-toplevel", {
    captureOutput: true,
    rejectOnNonZeroExit: false
  });
  if (result.code === 0 && result.stdout.trim()) {
    return Ok(result.stdout.trim());
  }
  return Err("Not inside a git repository. Run agentbox from your project root.");
}
var CONFIG_FILENAMES;
var init_loader = __esm(() => {
  init_config();
  init_exec();
  CONFIG_FILENAMES = ["agentbox.config.ts", "agentbox.config.js"];
});

// src/commands/resolve-config.ts
async function resolveConfig() {
  const repoPathResult = await getRepoPath();
  if (!repoPathResult.ok) {
    R3.error(repoPathResult.error);
    return null;
  }
  const repoPath = repoPathResult.value;
  const result = await loadConfig(repoPath);
  if (!result.ok) {
    R3.error(result.error);
    return null;
  }
  return { config: result.value, repoPath };
}
var init_resolve_config = __esm(() => {
  init_dist3();
  init_loader();
});

// src/commands/branch-prompts.ts
async function promptForAgentBranch(message2, repoPath, bareRepoPath) {
  const [localBranches, remoteBranches, existingWorktrees] = await Promise.all([
    listLocalBranches(repoPath),
    listRemoteBranches(repoPath),
    bareRepoPath ? listWorktrees(bareRepoPath) : Promise.resolve([])
  ]);
  const allBranches = mergeBranches(localBranches, remoteBranches);
  const agentSet = new Set(existingWorktrees.map((w2) => w2.name));
  const nameSet = new Set(allBranches.map((b2) => b2.name));
  const agentStateMap = new Map(await Promise.all(existingWorktrees.map(async (w2) => {
    const parsed = parseAgentName(w2.name);
    const state = parsed.ok ? await getAgentState(parsed.value) : { kind: "not-found" };
    return [w2.name, state.kind === "not-found" ? "unknown" : state.kind];
  })));
  const branchEntries = allBranches.map((b2) => {
    const agentState = agentStateMap.get(b2.name);
    const hint = [
      agentState != null ? `agent: ${agentState}` : null,
      b2.location,
      b2.author,
      b2.lastEdit
    ].filter(Boolean).join(", ");
    return { value: b2.name, label: `${b2.name} (${hint})`, sortKey: b2.lastEditUnix };
  });
  const orphanedAgents = existingWorktrees.filter((w2) => !nameSet.has(w2.name)).map((w2) => {
    const state = agentStateMap.get(w2.name);
    return { value: w2.name, label: `${w2.name} (agent: ${state ?? "unknown"})`, sortKey: 0 };
  });
  const entries = [...branchEntries, ...orphanedAgents].toSorted((a2, b2) => b2.sortKey - a2.sortKey);
  const result = await Xe({
    message: message2,
    placeholder: "Type to search or enter a branch name...",
    maxItems: 20,
    options() {
      const input = this.userInput;
      const base = entries.map((e2) => ({
        value: e2.value,
        label: e2.label
      }));
      const custom2 = input && !nameSet.has(input) && !agentSet.has(input) ? [{ value: input, label: `${input} (new branch)` }] : [];
      return [...base, ...custom2];
    }
  });
  if (Ct(result))
    return result;
  const isExisting = agentSet.has(result) || nameSet.has(result);
  return { branch: result, isExisting };
}
async function promptForBaseBranch(repoPath) {
  const [localBranches, remoteBranches, mainBranch] = await Promise.all([
    listLocalBranches(repoPath),
    listRemoteBranches(repoPath),
    getMainBranch(repoPath)
  ]);
  const allBranches = mergeBranches(localBranches, remoteBranches);
  const nameSet = new Set(allBranches.map((b2) => b2.name));
  const prioritize = [mainBranch, `origin/${mainBranch}`].filter((n2) => nameSet.has(n2));
  const prioritySet = new Set(prioritize);
  const ordered = prioritize.length > 0 ? [
    ...allBranches.filter((b2) => prioritySet.has(b2.name)),
    ...allBranches.filter((b2) => !prioritySet.has(b2.name))
  ] : allBranches;
  const result = await Xe({
    message: "Base branch for your new branch",
    placeholder: "Type to search...",
    options() {
      return ordered.map((b2) => ({ value: b2.name, label: `${b2.name} (${branchHint(b2)})` }));
    },
    initialValue: mainBranch,
    validate: (value2) => typeof value2 !== "string" || !nameSet.has(value2) ? "Select an existing branch" : undefined
  });
  if (Ct(result))
    return null;
  return result;
}
var init_branch_prompts = __esm(() => {
  init_dist3();
  init_agent();
  init_git();
});

// src/commands/resolve-new.ts
function resolveMode(modeName, config2) {
  if (!modeName)
    return Ok(undefined);
  const found = config2.tmuxModes.find((m) => m.name === modeName);
  if (!found) {
    return Err(`Unknown tmux mode: ${modeName}. Available: ${config2.tmuxModes.map((m) => m.name).join(", ")}`);
  }
  return Ok(found);
}
async function resolveNewArgs(opts, config2, repoPath, bareRepoPath) {
  const branchStep = await resolveBranchAndBase(opts.branch, opts.base, repoPath, bareRepoPath);
  if (branchStep.kind !== "resolved")
    return branchStep;
  const parseResult = parseAgentName(branchStep.rawAgentName);
  if (!parseResult.ok) {
    return { kind: "error", message: parseResult.error };
  }
  const agentName = parseResult.value;
  const tmuxStep = await resolveTmuxMode(opts.mode, opts.noTmux, config2);
  if (tmuxStep.kind !== "resolved")
    return tmuxStep;
  return {
    kind: "resolved",
    agentName,
    baseBranch: branchStep.baseBranch,
    tmuxMode: tmuxStep.tmuxMode
  };
}
async function resolveBranchAndBase(branch, base, repoPath, bareRepoPath) {
  if (branch) {
    return { kind: "resolved", rawAgentName: branch, baseBranch: base };
  }
  const fetchSpinner = be();
  fetchSpinner.start("Fetching latest branches...");
  await fetchLatestRefs(repoPath, bareRepoPath);
  fetchSpinner.stop("Branches up to date");
  const branchResult = await promptForAgentBranch("New or existing git branch (determines worktree branch and agent name)", repoPath, bareRepoPath);
  if (Ct(branchResult)) {
    Gt("Aborted");
    return { kind: "cancelled" };
  }
  if (!base && !branchResult.isExisting) {
    const baseResult = await promptForBaseBranch(repoPath);
    if (baseResult == null) {
      Gt("Aborted");
      return { kind: "cancelled" };
    }
    return { kind: "resolved", rawAgentName: branchResult.branch, baseBranch: baseResult };
  }
  return { kind: "resolved", rawAgentName: branchResult.branch, baseBranch: base };
}
async function resolveTmuxMode(mode, noTmux, config2) {
  const modeResult = resolveMode(mode, config2);
  if (!modeResult.ok)
    return { kind: "error", message: modeResult.error };
  if (!mode && !noTmux && config2.tmuxModes.length > 0) {
    const selection = await Jt({
      message: "tmux mode",
      options: [
        { value: "__none__", label: "none (shell only)" },
        ...config2.tmuxModes.map((m) => ({
          value: m.name,
          label: m.name,
          hint: `${m.windows.length} window${m.windows.length === 1 ? "" : "s"}`
        }))
      ]
    });
    if (Ct(selection)) {
      Gt("Aborted");
      return { kind: "cancelled" };
    }
    const selectedMode = selection === "__none__" ? undefined : config2.tmuxModes.find((m) => m.name === selection);
    return { kind: "resolved", tmuxMode: selectedMode };
  }
  return { kind: "resolved", tmuxMode: modeResult.value };
}
function buildReinvokeArgs(selfPath, agentName, baseBranch, tmuxMode, useLocalBranch, trusted) {
  return [
    selfPath,
    "new",
    agentName,
    ...baseBranch ? [baseBranch] : [],
    ...tmuxMode ? ["-m", tmuxMode.name] : [],
    ...useLocalBranch ? ["--use-local-branch"] : [],
    trusted ? "--trust" : "--untrusted"
  ];
}
async function resolveTrust(trust, untrusted) {
  if (trust)
    return true;
  if (untrusted)
    return false;
  const trustResult = await Rt({
    message: "Trust this environment? Untrusted mode skips running unsafe operations on your host computer.",
    initialValue: true
  });
  if (Ct(trustResult) || !trustResult) {
    return false;
  }
  return true;
}
async function ensureHostPreparation(config2, repoPath, worktreePath, trust, untrusted) {
  const trusted = await resolveTrust(trust, untrusted);
  const strategies = config2.dependencyStrategies.length > 0 ? config2.dependencyStrategies : await detectStrategies(repoPath);
  const prepareResult = await runHostPrepare({ trusted, logWarning: (msg) => R3.warn(msg) }, strategies, repoPath, worktreePath);
  if (!prepareResult.ok)
    return Err(prepareResult.error);
  return Ok(trusted);
}
var init_resolve_new = __esm(() => {
  init_dist3();
  init_git();
  init_strategies();
  init_branch_prompts();
});

// src/commands/new.ts
import * as fs8 from "fs";
import * as path14 from "path";
async function cmdNew(opts) {
  const resolved = await resolveConfig();
  if (resolved == null)
    return 1;
  const { config: config2, repoPath } = resolved;
  const dirPaths = getAgentsDirPaths(repoPath);
  const bareRepoPath = fs8.existsSync(dirPaths.bareRepo) ? dirPaths.bareRepo : null;
  const resolution = await resolveNewArgs({ branch: opts.branch, base: opts.base, mode: opts.mode, noTmux: opts.noTmux }, config2, repoPath, bareRepoPath);
  return M(resolution).with({ kind: "cancelled" }, () => 1).with({ kind: "error" }, (r2) => {
    R3.error(r2.message);
    return 1;
  }).with({ kind: "resolved" }, (r2) => executeNew(r2, opts, config2, repoPath)).exhaustive();
}
async function executeNew(resolved, opts, config2, repoPath) {
  const { agentName, baseBranch, tmuxMode } = resolved;
  const paths = getAgentPaths(repoPath, agentName);
  const inTargetSession = isInsideTmux() && await getCurrentSessionName() === sanitizeSessionName(agentName);
  if (inTargetSession) {
    return executeInsideSession(agentName, repoPath, config2, tmuxMode);
  }
  Wt2(`agent · new · ${agentName}`);
  const syncSpinner = be();
  syncSpinner.start("Syncing bare repo...");
  const bareRepoResult = await ensureBareRepo(repoPath);
  if (!bareRepoResult.ok) {
    syncSpinner.stop("Failed");
    R3.error(bareRepoResult.error);
    Gt("Aborted");
    return 1;
  }
  const bareRepo = bareRepoResult.value;
  const syncResult = await syncBareRepo(bareRepo, repoPath);
  if (!syncResult.ok) {
    syncSpinner.stop("Failed");
    R3.error(syncResult.error);
    Gt("Aborted");
    return 1;
  }
  syncSpinner.stop("Bare repo synced");
  for (const w2 of syncResult.value.warnings) {
    if (w2.startsWith("origin:") || w2.startsWith("local:")) {
      R3.warn(w2);
    } else {
      R3.info(w2);
    }
  }
  if (fs8.existsSync(paths.worktree)) {
    R3.step("Reusing existing worktree");
  } else {
    const resolvedBase = await resolveBaseBranch(baseBranch, bareRepo, agentName);
    if (resolvedBase) {
      R3.info(`Creating new branch from ${resolvedBase}`);
    }
    R3.step(`Creating worktree for ${agentName}...`);
    const resolveOptions = opts.useLocalBranch ? { useLocalBranch: true } : undefined;
    const worktreeResult = await createWorktree(bareRepo, paths.worktree, agentName, repoPath, resolvedBase ?? baseBranch, resolveOptions);
    if (!worktreeResult.ok) {
      if (worktreeResult.error === CANCELLED) {
        Gt("Aborted");
      } else {
        R3.error(worktreeResult.error);
        Gt("Aborted");
      }
      return 1;
    }
  }
  const prepResult = await ensureHostPreparation(config2, repoPath, paths.worktree, opts.trust, opts.untrusted);
  if (!prepResult.ok) {
    Gt("Aborted");
    return 1;
  }
  const resolvedTrusted = prepResult.value;
  if (opts.noTmux) {
    R3.success(`Agent ${agentName} ready`);
    R3.info(paths.worktree);
    R3.info(`To start: agentbox attach ${agentName}`);
    Gt("Ready");
    return 0;
  }
  if (!await isTmuxInstalled()) {
    R3.error("tmux not found. Install tmux or use --no-tmux.");
    Gt("Aborted");
    return 1;
  }
  const isNew = !await sessionExists(sanitizeSessionName(agentName));
  const sessionResult = await ensureSession(agentName, paths.worktree);
  if (!sessionResult.ok) {
    R3.error(sessionResult.error);
    Gt("Aborted");
    return 1;
  }
  const session = sessionResult.value;
  const selfPath = path14.resolve(process.argv[1]);
  const reinvokeArgs = buildReinvokeArgs(selfPath, agentName, baseBranch, tmuxMode, opts.useLocalBranch, resolvedTrusted);
  if (isNew) {
    const keysResult = await sendKeys(`${session}:`, reinvokeArgs.join(" "));
    if (!keysResult.ok) {
      R3.error(keysResult.error);
      Gt("Aborted");
      return 1;
    }
  } else {
    const windowResult = await createWindow(session, "setup");
    if (!windowResult.ok) {
      R3.error(windowResult.error);
      Gt("Aborted");
      return 1;
    }
    const keysResult = await sendKeys(windowResult.value, reinvokeArgs.join(" "));
    if (!keysResult.ok) {
      R3.error(keysResult.error);
      Gt("Aborted");
      return 1;
    }
  }
  R3.step("Attaching to session — setup continues inside");
  const attachResult = await switchOrAttach(session);
  if (!attachResult.ok) {
    R3.error(attachResult.error);
    Gt("Aborted");
    return 1;
  }
  return 0;
}
async function executeInsideSession(agentName, repoPath, config2, tmuxMode) {
  Wt2(`agent · new · ${agentName}`);
  await logBackendFallback();
  const ctx = await createAgentContext(agentName, repoPath, config2);
  const result = await startAndSetupAgent(ctx, tmuxMode);
  if (!result.ok)
    return handleLifecycleError(result.error);
  const ports = await getAgentPorts(ctx);
  for (const port of ports) {
    R3.info(`${port.name}: localhost:${port.nodePort}`);
  }
  return 0;
}
async function resolveBaseBranch(baseBranch, bareRepo, agentName) {
  if (baseBranch)
    return baseBranch;
  const hasBranch = await branchExists(bareRepo, agentName);
  if (!hasBranch) {
    return await getMainBranch(bareRepo);
  }
  return;
}
var init_new = __esm(() => {
  init_dist3();
  init_dist();
  init_agent();
  init_git();
  init_tmux();
  init_resolve_config();
  init_resolve_new();
});

// src/commands/agent-info.ts
import * as fs9 from "fs";
function agentStatusHint(agent) {
  const stateLabel = M(agent.containerState).with({ kind: "running" }, () => "running").with({ kind: "stopped" }, () => "stopped").with({ kind: "not-found" }, () => null).exhaustive();
  const parts = [stateLabel, agent.hasTmuxSession ? "tmux" : null].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : agent.branch;
}
async function listAgentsWithState(repoPath) {
  const paths = getAgentsDirPaths(repoPath);
  if (!fs9.existsSync(paths.bareRepo))
    return [];
  const worktrees = await listWorktrees(paths.bareRepo);
  if (worktrees.length === 0)
    return [];
  const tmuxAvailable = await isTmuxInstalled();
  return Promise.all(worktrees.map(async (wt3) => {
    const parsed = parseAgentName(wt3.name);
    const agentName = parsed.ok ? parsed.value : null;
    const containerState = agentName != null ? await getAgentState(agentName) : { kind: "not-found" };
    const [hasTmuxSession, ports] = await Promise.all([
      tmuxAvailable && agentName != null ? sessionExists(sanitizeSessionName(agentName)) : Promise.resolve(false),
      containerState.kind === "running" && agentName != null ? getAgentPorts(agentName) : Promise.resolve(NO_PORTS)
    ]);
    return {
      name: wt3.name,
      agentName,
      branch: wt3.branch,
      path: wt3.path,
      containerState,
      hasTmuxSession,
      ports
    };
  }));
}
var NO_PORTS;
var init_agent_info = __esm(() => {
  init_dist();
  init_agent();
  init_git();
  init_tmux();
  NO_PORTS = [];
});

// src/commands/resolve-agent.ts
function parseAgentNames(rawNames) {
  const collected = collectResults(rawNames.map(parseAgentName));
  return collected.ok ? Ok(collected.value) : Err({ kind: "error", message: collected.error });
}
function agentsWithValidNames(agents) {
  return agents.filter((a2) => a2.agentName != null);
}
async function pickAgent(repoPath, message2) {
  const allAgents = await listAgentsWithState(repoPath);
  const agents = agentsWithValidNames(allAgents);
  if (agents.length === 0)
    return Err({ kind: "no-agents" });
  const options = agents.map((a2) => ({
    value: a2.agentName,
    label: a2.name,
    hint: agentStatusHint(a2)
  }));
  const result = await Jt({ message: message2, options });
  if (Ct(result))
    return Err({ kind: "cancelled" });
  return Ok(result);
}
async function resolveAgentName(rawName, repoPath, promptMessage) {
  if (rawName != null) {
    const parsed = parseAgentName(rawName);
    return parsed.ok ? Ok(parsed.value) : Err({ kind: "error", message: parsed.error });
  }
  return pickAgent(repoPath, promptMessage);
}
async function resolveAgentNames(rawNames, repoPath) {
  if (rawNames.length > 0) {
    return parseAgentNames(rawNames);
  }
  const allAgents = await listAgentsWithState(repoPath);
  const agents = agentsWithValidNames(allAgents);
  if (agents.length === 0)
    return Err({ kind: "no-agents" });
  const options = agents.map((a2) => ({
    value: a2.agentName,
    label: a2.name,
    hint: agentStatusHint(a2)
  }));
  const selected = await Lt2({
    message: "Select agents to remove",
    options,
    required: true
  });
  if (Ct(selected))
    return Err({ kind: "cancelled" });
  return Ok(selected);
}
function handleResolveError(error48, noAgentsMessage) {
  return M(error48).with({ kind: "no-agents" }, () => {
    R3.info(noAgentsMessage);
    return 0;
  }).with({ kind: "cancelled" }, () => {
    Gt("Aborted");
    return 0;
  }).with({ kind: "error" }, (r2) => {
    R3.error(r2.message);
    return 1;
  }).exhaustive();
}
async function withRepoPath(onOk) {
  const repoPathResult = await getRepoPath();
  if (!repoPathResult.ok) {
    R3.error(repoPathResult.error);
    return 1;
  }
  return onOk(repoPathResult.value);
}
async function withResolvedAgent(rawName, promptMessage, onOk, noAgentsMessage = "No agents available") {
  const repoPathResult = await getRepoPath();
  if (!repoPathResult.ok) {
    R3.error(repoPathResult.error);
    return 1;
  }
  const repoPath = repoPathResult.value;
  const resolved = await resolveAgentName(rawName, repoPath, promptMessage);
  if (resolved.ok)
    return onOk(resolved.value, repoPath);
  return handleResolveError(resolved.error, noAgentsMessage);
}
async function withResolvedAgentNames(rawNames, onOk, noAgentsMessage = "No agents to remove") {
  const repoPathResult = await getRepoPath();
  if (!repoPathResult.ok) {
    R3.error(repoPathResult.error);
    return 1;
  }
  const repoPath = repoPathResult.value;
  const resolved = await resolveAgentNames(rawNames, repoPath);
  if (resolved.ok)
    return onOk(resolved.value, repoPath);
  return handleResolveError(resolved.error, noAgentsMessage);
}
var init_resolve_agent = __esm(() => {
  init_dist3();
  init_dist();
  init_git();
  init_loader();
  init_agent_info();
});

// src/commands/resolve-attach.ts
import * as fs10 from "fs";
function determineAttachAction(state) {
  if (!state.tmuxAvailable) {
    return { kind: "error", message: "tmux not found. Please install tmux first." };
  }
  if (state.hasSession) {
    if (state.modeName != null) {
      if (state.configResult == null) {
        return { kind: "error", message: "Failed to load config" };
      }
      if (!state.modeResult.ok) {
        return { kind: "error", message: state.modeResult.error };
      }
      return {
        kind: "reattach",
        agentName: state.agentName,
        mode: state.modeResult.value,
        config: state.configResult,
        repoPath: state.repoPath
      };
    }
    return {
      kind: "reattach",
      agentName: state.agentName,
      mode: undefined,
      config: undefined,
      repoPath: state.repoPath
    };
  }
  if (!state.worktreeExists) {
    return {
      kind: "error",
      message: `Agent ${state.agentName} not found. Create with: agentbox new ${state.agentName}`
    };
  }
  if (state.configResult == null) {
    return { kind: "error", message: "Failed to load config" };
  }
  if (!state.modeResult.ok) {
    return { kind: "error", message: state.modeResult.error };
  }
  return {
    kind: "restore",
    agentName: state.agentName,
    config: state.configResult,
    repoPath: state.repoPath,
    mode: state.modeResult.value,
    trust: state.trust,
    untrusted: state.untrusted
  };
}
async function resolveAttachArgs(name, modeName, trust, untrusted) {
  const repoPathResult = await getRepoPath();
  if (!repoPathResult.ok) {
    return { kind: "error", message: repoPathResult.error };
  }
  const repoPath = repoPathResult.value;
  const agentResult = await resolveAgentName(name, repoPath, "Select agent to attach");
  if (!agentResult.ok) {
    return M(agentResult.error).with({ kind: "no-agents" }, () => ({
      kind: "no-agents",
      message: "No agents available. Create one with: agentbox new"
    })).with({ kind: "cancelled" }, () => ({ kind: "cancelled" })).with({ kind: "error" }, (e2) => ({ kind: "error", message: e2.message })).exhaustive();
  }
  const agentName = agentResult.value;
  const tmuxAvailable = await isTmuxInstalled();
  const hasSession = tmuxAvailable ? await sessionExists(sanitizeSessionName(agentName)) : false;
  const paths = getAgentPaths(repoPath, agentName);
  const worktreeExists = fs10.existsSync(paths.worktree);
  const needsConfig = modeName != null || !hasSession && worktreeExists;
  const configResult = needsConfig ? (await resolveConfig())?.config ?? null : null;
  const modeResult = configResult != null ? resolveMode(modeName, configResult) : { ok: true, value: undefined };
  return determineAttachAction({
    tmuxAvailable,
    hasSession,
    worktreeExists,
    configResult,
    modeResult,
    agentName,
    repoPath,
    trust,
    untrusted,
    modeName
  });
}
var init_resolve_attach = __esm(() => {
  init_dist();
  init_git();
  init_loader();
  init_tmux();
  init_resolve_agent();
  init_resolve_config();
  init_resolve_new();
});

// src/commands/attach.ts
async function cmdAttach(name, modeName, trust = false, untrusted = false) {
  const resolved = await resolveAttachArgs(name, modeName, trust, untrusted);
  return M(resolved).with({ kind: "reattach" }, async (r2) => {
    if (r2.mode != null && r2.config != null) {
      const ctx = await createAgentContext(r2.agentName, r2.repoPath, r2.config);
      const tmuxResult = await setupAgentTmux(ctx, r2.mode);
      if (!tmuxResult.ok) {
        R3.error(tmuxResult.error);
        return 1;
      }
      const attachResult2 = await switchOrAttach(tmuxResult.value);
      if (!attachResult2.ok) {
        R3.error(attachResult2.error);
        return 1;
      }
      return 0;
    }
    const attachResult = await switchOrAttach(sanitizeSessionName(r2.agentName));
    if (!attachResult.ok) {
      R3.error(attachResult.error);
      return 1;
    }
    return 0;
  }).with({ kind: "restore" }, async (r2) => {
    Wt2(`agent · attach · ${r2.agentName}`);
    const agentState = await getAgentState(r2.agentName);
    if (agentState.kind !== "running") {
      const paths = getAgentPaths(r2.repoPath, r2.agentName);
      const prepResult = await ensureHostPreparation(r2.config, r2.repoPath, paths.worktree, r2.trust, r2.untrusted);
      if (!prepResult.ok) {
        Gt("Aborted");
        return 1;
      }
    }
    await logBackendFallback();
    const ctx = await createAgentContext(r2.agentName, r2.repoPath, r2.config);
    const result = await startAndSetupAgent(ctx, r2.mode);
    if (!result.ok)
      return handleLifecycleError(result.error);
    const attachResult = await switchOrAttach(result.value);
    if (!attachResult.ok) {
      R3.error(attachResult.error);
      return 1;
    }
    return 0;
  }).with({ kind: "cancelled" }, () => {
    Gt("Aborted");
    return 0;
  }).with({ kind: "no-agents" }, (r2) => {
    R3.info(r2.message);
    return 0;
  }).with({ kind: "error" }, (r2) => {
    R3.error(r2.message);
    return 1;
  }).exhaustive();
}
var init_attach = __esm(() => {
  init_dist3();
  init_dist();
  init_agent();
  init_git();
  init_tmux();
  init_resolve_attach();
  init_resolve_new();
});

// src/commands/resolve-stop.ts
function determineStopAction(state) {
  const { agentName, agentState, hasSession, hasWorktree } = state;
  if (agentState.kind === "not-found" && !hasSession && !hasWorktree) {
    return { kind: "not-found" };
  }
  if (agentState.kind === "running") {
    return { kind: "stop-container", agentName, hasSession, hasWorktree };
  }
  if (agentState.kind === "stopped") {
    return { kind: "already-stopped", agentName, hasSession, hasWorktree };
  }
  return { kind: "no-container", agentName, hasSession, hasWorktree };
}

// src/commands/stop.ts
async function cmdStop(name) {
  return withResolvedAgent(name, "Select agent to stop", async (agentName, repoPath) => {
    const paths = getAgentPaths(repoPath, agentName);
    const presence = await detectAgentPresence(agentName, paths);
    const action = determineStopAction({ agentName, ...presence });
    if (action.kind === "not-found") {
      R3.error(`Agent ${agentName} does not exist`);
      return 1;
    }
    Wt2(`agent · stop · ${agentName}`);
    const failed = await M(action).with({ kind: "stop-container" }, async () => {
      const stopSpinner = be();
      stopSpinner.start("Stopping agent container...");
      const stopResult = await stopAgent(agentName);
      if (!stopResult.ok) {
        stopSpinner.stop("Failed");
        R3.error(stopResult.error);
        R3.info("Run `agentbox check-vm` to diagnose VM issues");
        Gt("Aborted");
        return true;
      }
      stopSpinner.stop("Agent container stopped");
      return false;
    }).with({ kind: "already-stopped" }, () => {
      R3.warn("Container already stopped");
      return false;
    }).with({ kind: "no-container" }, () => {
      R3.warn("No container found");
      return false;
    }).exhaustive();
    if (failed) {
      return 1;
    }
    if (action.hasSession) {
      await gracefullyKillSession(sanitizeSessionName(agentName));
      R3.step("Tmux session killed");
    }
    if (action.hasWorktree) {
      R3.info(`Worktree preserved (use agentbox rm ${agentName} to remove)`);
    }
    R3.success(`Stopped agent ${agentName}`);
    Gt("Done");
    return 0;
  });
}
var init_stop = __esm(() => {
  init_dist3();
  init_dist();
  init_agent();
  init_git();
  init_tmux();
  init_resolve_agent();
});

// src/commands/rm.ts
async function cmdRm(names, force) {
  return withResolvedAgentNames(names, async (agentNames, repoPath) => {
    for (const agentName of agentNames) {
      const paths = getAgentPaths(repoPath, agentName);
      const presence = await detectAgentPresence(agentName, paths);
      if (!presence.hasSession && presence.agentState.kind === "not-found" && !presence.hasWorktree) {
        R3.error(`Agent ${agentName} not found`);
        return 1;
      }
      Wt2(`agent · rm · ${agentName}`);
      if (!force) {
        R3.warn("This will delete:");
        if (presence.hasSession)
          R3.info(`  tmux session ${agentName}`);
        if (presence.agentState.kind !== "not-found")
          R3.info(`  agent container (${presence.agentState.kind})`);
        if (presence.hasWorktree)
          R3.info(`  worktree at ${paths.worktree}`);
        const confirmed = await Rt({
          message: `Remove agent ${agentName}?`,
          initialValue: true
        });
        if (Ct(confirmed) || !confirmed) {
          Gt("Aborted");
          return 0;
        }
      }
      const spinner = be();
      spinner.start("Removing agent...");
      const result = await removeAgent(agentName, paths, presence, { force });
      if (!result.ok) {
        spinner.stop("Failed");
        R3.error(result.error);
        R3.info(`Try \`agentbox rm --force ${agentName}\` to force removal`);
        Gt("Aborted");
        return 1;
      }
      spinner.stop("Agent removed");
      for (const warning of result.value.warnings) {
        R3.warn(warning);
      }
      R3.success(`Removed agent ${agentName}`);
      Gt("Done");
    }
    return 0;
  });
}
var init_rm = __esm(() => {
  init_dist3();
  init_agent();
  init_git();
  init_resolve_agent();
});

// node_modules/chalk/source/vendor/ansi-styles/index.js
function assembleStyles() {
  const codes = new Map;
  for (const [groupName, group2] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group2)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group2[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group2,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex3) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex3.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer2 = Number.parseInt(colorString, 16);
        return [
          integer2 >> 16 & 255,
          integer2 >> 8 & 255,
          integer2 & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex3) => styles.rgbToAnsi256(...styles.hexToRgb(hex3)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value2 = Math.max(red, green, blue) * 2;
        if (value2 === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value2 === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex3) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex3)),
      enumerable: false
    }
  });
  return styles;
}
var ANSI_BACKGROUND_OFFSET = 10, wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`, wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`, wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`, styles, modifierNames, foregroundColorNames, backgroundColorNames, colorNames, ansiStyles, ansi_styles_default;
var init_ansi_styles = __esm(() => {
  styles = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      gray: [90, 39],
      grey: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  modifierNames = Object.keys(styles.modifier);
  foregroundColorNames = Object.keys(styles.color);
  backgroundColorNames = Object.keys(styles.bgColor);
  colorNames = [...foregroundColorNames, ...backgroundColorNames];
  ansiStyles = assembleStyles();
  ansi_styles_default = ansiStyles;
});

// node_modules/chalk/source/vendor/supports-color/index.js
import process4 from "node:process";
import os7 from "node:os";
import tty from "node:tty";
function hasFlag(flag2, argv = globalThis.Deno ? globalThis.Deno.args : process4.argv) {
  const prefix = flag2.startsWith("-") ? "" : flag2.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag2);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process4.platform === "win32") {
    const osRelease = os7.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env))) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version2 = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version2 >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var env, flagForceColor, supportsColor, supports_color_default;
var init_supports_color = __esm(() => {
  ({ env } = process4);
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    flagForceColor = 0;
  } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    flagForceColor = 1;
  }
  supportsColor = {
    stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
    stderr: createSupportsColor({ isTTY: tty.isatty(2) })
  };
  supports_color_default = supportsColor;
});

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string5, substring, replacer) {
  let index = string5.indexOf(substring);
  if (index === -1) {
    return string5;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string5.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string5.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string5.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string5, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string5[index - 1] === "\r";
    returnValue += string5.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? `\r
` : `
`) + postfix;
    endIndex = index + 1;
    index = string5.indexOf(`
`, endIndex);
  } while (index !== -1);
  returnValue += string5.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
function createChalk(options) {
  return chalkFactory(options);
}
var stdoutColor, stderrColor, GENERATOR, STYLER, IS_EMPTY, levelMapping, styles2, applyOptions = (object3, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object3.level = options.level === undefined ? colorLevel : options.level;
}, chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
}, getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
}, usedModels, proto, createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
}, createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
}, applyStyle = (self, string5) => {
  if (self.level <= 0 || !string5) {
    return self[IS_EMPTY] ? "" : string5;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string5;
  }
  const { openAll, closeAll } = styler;
  if (string5.includes("\x1B")) {
    while (styler !== undefined) {
      string5 = stringReplaceAll(string5, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string5.indexOf(`
`);
  if (lfIndex !== -1) {
    string5 = stringEncaseCRLFWithFirstIndex(string5, closeAll, openAll, lfIndex);
  }
  return openAll + string5 + closeAll;
}, chalk, chalkStderr, source_default;
var init_source = __esm(() => {
  init_ansi_styles();
  init_supports_color();
  ({ stdout: stdoutColor, stderr: stderrColor } = supports_color_default);
  GENERATOR = Symbol("GENERATOR");
  STYLER = Symbol("STYLER");
  IS_EMPTY = Symbol("IS_EMPTY");
  levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  styles2 = Object.create(null);
  Object.setPrototypeOf(createChalk.prototype, Function.prototype);
  for (const [styleName, style] of Object.entries(ansi_styles_default)) {
    styles2[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      }
    };
  }
  styles2.visible = {
    get() {
      const builder = createBuilder(this, this[STYLER], true);
      Object.defineProperty(this, "visible", { value: builder });
      return builder;
    }
  };
  usedModels = ["rgb", "hex", "ansi256"];
  for (const model of usedModels) {
    styles2[model] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles2[bgModel] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
  }
  proto = Object.defineProperties(() => {
  }, {
    ...styles2,
    level: {
      enumerable: true,
      get() {
        return this[GENERATOR].level;
      },
      set(level) {
        this[GENERATOR].level = level;
      }
    }
  });
  Object.defineProperties(createChalk.prototype, styles2);
  chalk = createChalk();
  chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
  source_default = chalk;
});

// src/commands/list.ts
async function cmdList() {
  return withRepoPath(async (repoPath) => {
    const agents = await listAgentsWithState(repoPath);
    if (agents.length === 0) {
      R3.info("No agents found");
      return 0;
    }
    const nameW = Math.max(6, ...agents.map((a2) => a2.name.length)) + 2;
    const branchW = Math.max(8, ...agents.map((a2) => a2.branch.length)) + 2;
    const statusW = 14;
    const tmuxW = 6;
    console.log(source_default.bold("NAME".padEnd(nameW)) + source_default.bold("BRANCH".padEnd(branchW)) + source_default.bold("STATUS".padEnd(statusW)) + source_default.bold("TMUX".padEnd(tmuxW)) + source_default.bold("PATH"));
    for (const a2 of agents) {
      const statusStyled = M(a2.containerState).with({ kind: "running" }, () => source_default.green("running".padEnd(statusW))).with({ kind: "stopped" }, () => source_default.yellow("stopped".padEnd(statusW))).with({ kind: "not-found" }, () => source_default.dim("no container".padEnd(statusW))).exhaustive();
      const tmuxStyled = a2.hasTmuxSession ? source_default.green("✓".padEnd(tmuxW)) : " ".padEnd(tmuxW);
      console.log(source_default.cyan(a2.name.padEnd(nameW)) + a2.branch.padEnd(branchW) + statusStyled + tmuxStyled + source_default.dim(a2.path));
      for (const port of a2.ports) {
        console.log(source_default.dim(`  ${port.name}: localhost:${port.nodePort}`));
      }
    }
    return 0;
  });
}
var init_list = __esm(() => {
  init_dist3();
  init_source();
  init_dist();
  init_agent_info();
  init_resolve_agent();
});

// src/commands/checkout.ts
import * as fs11 from "fs";
async function cmdCheckout(name) {
  return withResolvedAgent(name, "Select agent to checkout", async (agentName, repoPath) => {
    const paths = getAgentPaths(repoPath, agentName);
    if (!fs11.existsSync(paths.bareRepo)) {
      R3.error("No agents directory found");
      return 1;
    }
    Wt2(`agent · checkout · ${agentName}`);
    const fetchSpinner = be();
    fetchSpinner.start("Fetching agent branch...");
    const result = await checkoutAgentBranch(paths.bareRepo, repoPath, agentName);
    if (!result.ok) {
      fetchSpinner.stop("Failed");
      return showCheckoutError(result.error);
    }
    fetchSpinner.stop("Branch checked out");
    R3.success(`Checked out branch ${agentName}`);
    R3.info(`Push with: git push -u origin ${agentName}`);
    Gt("Done");
    return 0;
  });
}
function showCheckoutError(error48) {
  M(error48).with({ kind: "not-found" }, ({ name }) => {
    R3.error(`Agent '${name}' not found`);
  }).with({ kind: "fetch-failed" }, ({ detail }) => {
    R3.error(`Failed to fetch branch: ${detail}`);
  }).with({ kind: "checkout-failed" }, ({ detail }) => {
    R3.error(`Failed to checkout branch: ${detail}`);
    R3.info("You may have uncommitted changes. Commit or stash them first.");
  }).exhaustive();
  Gt("Aborted");
  return 1;
}
var init_checkout = __esm(() => {
  init_dist3();
  init_dist();
  init_git();
  init_resolve_agent();
});

// src/commands/check-vm.ts
import * as fs12 from "fs";
import * as os8 from "os";
import * as path15 from "path";
async function cmdCheckVm() {
  Wt2("agent · check-vm");
  const diagnosis = await checkVm();
  for (const check2 of diagnosis.checks) {
    if (check2.ok) {
      R3.success(check2.name);
    } else {
      R3.error(check2.name);
    }
  }
  if (!diagnosis.allGood) {
    if (diagnosis.fixScript) {
      const scriptPath = path15.join(os8.tmpdir(), "agentbox-setup-vm.sh");
      fs12.writeFileSync(scriptPath, diagnosis.fixScript, { mode: 493 });
      Vt2(scriptPath, "Fix script written");
      Gt("Run the fix script to resolve issues");
    }
    return 1;
  }
  const spin = be();
  spin.start("Running Kata VM smoke test...");
  const result = await smokeTest();
  if (result.ok) {
    spin.stop("Kata VM smoke test passed");
    Gt("All checks passed");
    return 0;
  }
  spin.stop("Kata VM smoke test failed");
  if (result.error) {
    R3.message(result.error);
  }
  Gt("Config checks passed but smoke test failed");
  return 1;
}
var init_check_vm = __esm(() => {
  init_dist3();
  init_vm();
});

// src/commands/cache.ts
import * as fs13 from "fs";
async function cmdCache() {
  const resolved = await resolveConfig();
  if (resolved == null)
    return 1;
  const { config: config2, repoPath } = resolved;
  const { ensureImageCache: ensureImageCache2 } = await Promise.resolve().then(() => (init_cache(), exports_cache));
  const paths = getAgentsDirPaths(repoPath);
  if (!config2.cacheImages) {
    R3.info("No cache images configured");
    return 0;
  }
  Wt2("agent · cache");
  const cacheSpinner = be();
  cacheSpinner.start("Resolving image list...");
  const images = await resolveCacheImages(config2.cacheImages);
  if (images.length === 0) {
    cacheSpinner.stop("No images to cache");
    Gt("Done");
    return 0;
  }
  cacheSpinner.stop(`Found ${images.length} image${images.length === 1 ? "" : "s"}`);
  const pullSpinner = be();
  pullSpinner.start("Caching docker images...");
  const result = await ensureImageCache2(paths.agentsDir, images);
  if (!result.ok) {
    pullSpinner.stop("Failed");
    R3.error(result.error);
    R3.info("Ensure Docker is running and the configured images are pullable");
    Gt("Aborted");
    return 1;
  }
  if (result.value) {
    const stats = fs13.statSync(result.value);
    const sizeMB = (stats.size / 1048576).toFixed(0);
    pullSpinner.stop(`Cached ${images.length} image${images.length === 1 ? "" : "s"} (${sizeMB} MB)`);
  } else {
    pullSpinner.stop("Docker images already cached");
  }
  Gt("Done");
  return 0;
}
var init_cache2 = __esm(() => {
  init_dist3();
  init_config();
  init_git();
  init_resolve_config();
});

// src/commands/logs.ts
async function cmdLogs(name, follow, init) {
  return withResolvedAgent(name, "Select agent to view logs", async (agentName) => {
    const state = await getAgentState(agentName);
    if (state.kind === "not-found") {
      R3.error(`No container found for agent ${agentName}`);
      return 1;
    }
    const result = await getAgentLogs(agentName, { follow, init });
    if (!result.ok) {
      R3.error(result.error);
      return 1;
    }
    if (!follow && result.value.length > 0) {
      process.stdout.write(result.value);
    }
    return 0;
  });
}
var init_logs = __esm(() => {
  init_dist3();
  init_agent();
  init_resolve_agent();
});

// src/commands/exec.ts
async function cmdExec(name, command2) {
  return withResolvedAgent(name, "Select agent to exec into", async (agentName) => {
    const state = await getAgentState(agentName);
    if (state.kind !== "running") {
      R3.error(`Agent ${agentName} is not running`);
      return 1;
    }
    const hasCommand = command2 != null && command2.length > 0;
    const fullCommand = hasCommand ? command2.join(" ") : undefined;
    const interactive = !hasCommand;
    const result = await execInAgent(agentName, fullCommand, { interactive });
    if (!result.ok) {
      R3.error(result.error);
      return 1;
    }
    return result.value;
  });
}
var init_exec2 = __esm(() => {
  init_dist3();
  init_agent();
  init_resolve_agent();
});

// src/commands/index.ts
var exports_commands = {};
__export(exports_commands, {
  cmdStop: () => cmdStop,
  cmdRm: () => cmdRm,
  cmdNew: () => cmdNew,
  cmdLogs: () => cmdLogs,
  cmdList: () => cmdList,
  cmdExec: () => cmdExec,
  cmdCheckout: () => cmdCheckout,
  cmdCheckVm: () => cmdCheckVm,
  cmdCache: () => cmdCache,
  cmdAttach: () => cmdAttach
});
var init_commands = __esm(() => {
  init_new();
  init_attach();
  init_stop();
  init_rm();
  init_list();
  init_checkout();
  init_check_vm();
  init_cache2();
  init_logs();
  init_exec2();
});

// node_modules/@optique/core/dist/message.js
function message(message$1, ...values$1) {
  const messageTerms = [];
  for (let i = 0;i < message$1.length; i++) {
    if (message$1[i] !== "")
      messageTerms.push({
        type: "text",
        text: message$1[i]
      });
    if (i >= values$1.length)
      continue;
    const value$1 = values$1[i];
    if (typeof value$1 === "string")
      messageTerms.push({
        type: "value",
        value: value$1
      });
    else if (Array.isArray(value$1))
      messageTerms.push(...value$1);
    else if (typeof value$1 === "object" && value$1 != null && "type" in value$1)
      messageTerms.push(value$1);
    else
      throw new TypeError(`Invalid value type in message: ${typeof value$1}.`);
  }
  return messageTerms;
}
function text(text$1) {
  return {
    type: "text",
    text: text$1
  };
}
function optionName(name) {
  return {
    type: "optionName",
    optionName: name
  };
}
function optionNames(names) {
  return {
    type: "optionNames",
    optionNames: names
  };
}
function metavar(metavar$1) {
  return {
    type: "metavar",
    metavar: metavar$1
  };
}
function value(value$1) {
  return {
    type: "value",
    value: value$1
  };
}
function values(values$1) {
  return {
    type: "values",
    values: values$1
  };
}
function commandLine(commandLine$1) {
  return {
    type: "commandLine",
    commandLine: commandLine$1
  };
}
function lineBreak() {
  return { type: "lineBreak" };
}
function valueSet(values$1, options) {
  if (values$1.length === 0)
    return [];
  const formatter = new Intl.ListFormat(options?.locale, {
    type: options?.type,
    style: options?.style
  });
  const parts = formatter.formatToParts(values$1);
  const result = [];
  for (const part of parts)
    if (part.type === "element")
      result.push({
        type: "value",
        value: part.value
      });
    else
      result.push({
        type: "text",
        text: part.value
      });
  return result;
}
function formatMessage(msg, options = {}) {
  const colorConfig = options.colors ?? false;
  const useColors = typeof colorConfig === "boolean" ? colorConfig : true;
  const resetSuffix = typeof colorConfig === "object" ? colorConfig.resetSuffix ?? "" : "";
  const useQuotes = options.quotes ?? true;
  const resetSequence = `\x1B[0m${resetSuffix}`;
  function* stream() {
    const wordPattern = /\s*\S+\s*/g;
    let prevWasLineBreak = false;
    for (const term of msg) {
      const isAfterLineBreak = prevWasLineBreak;
      prevWasLineBreak = false;
      if (term.type === "text") {
        const rawText = isAfterLineBreak ? term.text.replace(/^\n(?!\n)/, "") : term.text;
        if (rawText.includes(`

`)) {
          const paragraphs = rawText.split(/\n\n+/);
          for (let paragraphIndex = 0;paragraphIndex < paragraphs.length; paragraphIndex++) {
            if (paragraphIndex > 0)
              yield {
                text: `
`,
                width: -1
              };
            const paragraph = paragraphs[paragraphIndex].replace(/\n/g, " ");
            wordPattern.lastIndex = 0;
            while (true) {
              const match = wordPattern.exec(paragraph);
              if (match == null)
                break;
              yield {
                text: match[0],
                width: match[0].length
              };
            }
          }
        } else {
          const normalizedText = rawText.replace(/\n/g, " ");
          if (normalizedText.trim() === "" && normalizedText.length > 0)
            yield {
              text: " ",
              width: 1
            };
          else {
            wordPattern.lastIndex = 0;
            while (true) {
              const match = wordPattern.exec(normalizedText);
              if (match == null)
                break;
              yield {
                text: match[0],
                width: match[0].length
              };
            }
          }
        }
      } else if (term.type === "optionName") {
        const name = useQuotes ? `\`${term.optionName}\`` : term.optionName;
        yield {
          text: useColors ? `\x1B[3m${name}${resetSequence}` : name,
          width: name.length
        };
      } else if (term.type === "optionNames") {
        const names = term.optionNames.map((name) => useQuotes ? `\`${name}\`` : name);
        let i = 0;
        for (const name of names) {
          if (i > 0)
            yield {
              text: "/",
              width: 1
            };
          yield {
            text: useColors ? `\x1B[3m${name}${resetSequence}` : name,
            width: name.length
          };
          i++;
        }
      } else if (term.type === "metavar") {
        const metavar$1 = useQuotes ? `\`${term.metavar}\`` : term.metavar;
        yield {
          text: useColors ? `\x1B[1m${metavar$1}${resetSequence}` : metavar$1,
          width: metavar$1.length
        };
      } else if (term.type === "value") {
        const value$1 = useQuotes ? `${JSON.stringify(term.value)}` : term.value;
        yield {
          text: useColors ? `\x1B[32m${value$1}${resetSequence}` : value$1,
          width: value$1.length
        };
      } else if (term.type === "values")
        for (let i = 0;i < term.values.length; i++) {
          if (i > 0)
            yield {
              text: " ",
              width: 1
            };
          const value$1 = useQuotes ? JSON.stringify(term.values[i]) : term.values[i];
          yield {
            text: useColors ? i <= 0 ? `\x1B[32m${value$1}` : i + 1 >= term.values.length ? `${value$1}${resetSequence}` : value$1 : value$1,
            width: value$1.length
          };
        }
      else if (term.type === "envVar") {
        const envVar$1 = useQuotes ? `\`${term.envVar}\`` : term.envVar;
        yield {
          text: useColors ? `\x1B[1;4m${envVar$1}${resetSequence}` : envVar$1,
          width: envVar$1.length
        };
      } else if (term.type === "commandLine") {
        const cmd = useQuotes ? `\`${term.commandLine}\`` : term.commandLine;
        yield {
          text: useColors ? `\x1B[36m${cmd}${resetSequence}` : cmd,
          width: cmd.length
        };
      } else if (term.type === "lineBreak") {
        yield {
          text: `
`,
          width: -1
        };
        prevWasLineBreak = true;
      } else if (term.type === "url") {
        const urlString = term.url.href;
        const displayText = useQuotes ? `<${urlString}>` : urlString;
        if (useColors) {
          const hyperlink = `\x1B]8;;${urlString}\x1B\\${displayText}\x1B]8;;\x1B\\${resetSuffix}`;
          yield {
            text: hyperlink,
            width: displayText.length
          };
        } else
          yield {
            text: displayText,
            width: displayText.length
          };
      } else
        throw new TypeError(`Invalid MessageTerm type: ${term["type"]}.`);
    }
  }
  let output = "";
  let totalWidth = options.startWidth ?? 0;
  for (const { text: text$1, width } of stream()) {
    if (width === -1) {
      output += text$1;
      totalWidth = 0;
      continue;
    }
    if (options.maxWidth != null && totalWidth + width > options.maxWidth) {
      output += `
`;
      totalWidth = 0;
    }
    output += text$1;
    totalWidth += width;
  }
  return output;
}

// node_modules/@optique/core/dist/dependency.js
var dependencySourceMarker = Symbol.for("@optique/core/dependency/dependencySourceMarker");
var derivedValueParserMarker = Symbol.for("@optique/core/dependency/derivedValueParserMarker");
var dependencyId = Symbol.for("@optique/core/dependency/dependencyId");
var dependencyIds = Symbol.for("@optique/core/dependency/dependencyIds");
var defaultValues = Symbol.for("@optique/core/dependency/defaultValues");
var parseWithDependency = Symbol.for("@optique/core/dependency/parseWithDependency");
var suggestWithDependency = Symbol.for("@optique/core/dependency/suggestWithDependency");
function isDependencySource(parser) {
  return dependencySourceMarker in parser && parser[dependencySourceMarker] === true;
}
function isDerivedValueParser(parser) {
  return derivedValueParserMarker in parser && parser[derivedValueParserMarker] === true;
}
var deferredParseMarker = Symbol.for("@optique/core/dependency/deferredParseMarker");
function isDeferredParseState(value2) {
  return typeof value2 === "object" && value2 !== null && deferredParseMarker in value2 && value2[deferredParseMarker] === true;
}
function getDependencyIds(parser) {
  if (dependencyIds in parser)
    return parser[dependencyIds];
  return [parser[dependencyId]];
}
function getDefaultValuesFunction(parser) {
  if (defaultValues in parser)
    return parser[defaultValues];
  return;
}
function createDeferredParseState(rawInput, parser, preliminaryResult) {
  const multipleIds = dependencyIds in parser ? parser[dependencyIds] : undefined;
  const defaultValuesFn = defaultValues in parser ? parser[defaultValues] : undefined;
  const defaultVals = defaultValuesFn ? defaultValuesFn() : undefined;
  return {
    [deferredParseMarker]: true,
    rawInput,
    parser,
    dependencyId: parser[dependencyId],
    dependencyIds: multipleIds,
    defaultValues: defaultVals,
    preliminaryResult
  };
}
var dependencySourceStateMarker = Symbol.for("@optique/core/dependency/dependencySourceStateMarker");
function isDependencySourceState(value2) {
  return typeof value2 === "object" && value2 !== null && dependencySourceStateMarker in value2 && value2[dependencySourceStateMarker] === true;
}
function createDependencySourceState(result, depId) {
  return {
    [dependencySourceStateMarker]: true,
    [dependencyId]: depId,
    result
  };
}
var pendingDependencySourceStateMarker = Symbol.for("@optique/core/dependency/pendingDependencySourceStateMarker");
function isPendingDependencySourceState(value2) {
  return typeof value2 === "object" && value2 !== null && pendingDependencySourceStateMarker in value2 && value2[pendingDependencySourceStateMarker] === true;
}
function createPendingDependencySourceState(depId) {
  return {
    [pendingDependencySourceStateMarker]: true,
    [dependencyId]: depId
  };
}
var wrappedDependencySourceMarker = Symbol.for("@optique/core/dependency/wrappedDependencySourceMarker");
var transformsDependencyValueMarker = Symbol.for("@optique/core/dependency/transformsDependencyValueMarker");
function transformsDependencyValue(parser) {
  return typeof parser === "object" && parser !== null && transformsDependencyValueMarker in parser && parser[transformsDependencyValueMarker] === true;
}
function isWrappedDependencySource(parser) {
  return typeof parser === "object" && parser !== null && wrappedDependencySourceMarker in parser;
}
var DependencyRegistry = class DependencyRegistry2 {
  values = /* @__PURE__ */ new Map;
  set(id, value2) {
    this.values.set(id, value2);
  }
  get(id) {
    return this.values.get(id);
  }
  has(id) {
    return this.values.has(id);
  }
  clone() {
    const copy = new DependencyRegistry2;
    for (const [id, value2] of this.values)
      copy.values.set(id, value2);
    return copy;
  }
};

// node_modules/@optique/core/dist/mode-dispatch.js
function dispatchByMode(mode, syncFn, asyncFn) {
  if (mode === "async")
    return asyncFn();
  return syncFn();
}
function dispatchIterableByMode(mode, syncFn, asyncFn) {
  if (mode === "async")
    return asyncFn();
  return syncFn();
}

// node_modules/@optique/core/dist/usage.js
function extractOptionNames(usage) {
  const names = /* @__PURE__ */ new Set;
  function traverseUsage(terms) {
    if (!terms || !Array.isArray(terms))
      return;
    for (const term of terms)
      if (term.type === "option") {
        if (term.hidden)
          continue;
        for (const name of term.names)
          names.add(name);
      } else if (term.type === "optional" || term.type === "multiple")
        traverseUsage(term.terms);
      else if (term.type === "exclusive")
        for (const exclusiveUsage of term.terms)
          traverseUsage(exclusiveUsage);
  }
  traverseUsage(usage);
  return names;
}
function extractCommandNames(usage) {
  const names = /* @__PURE__ */ new Set;
  function traverseUsage(terms) {
    if (!terms || !Array.isArray(terms))
      return;
    for (const term of terms)
      if (term.type === "command") {
        if (term.hidden)
          continue;
        names.add(term.name);
      } else if (term.type === "optional" || term.type === "multiple")
        traverseUsage(term.terms);
      else if (term.type === "exclusive")
        for (const exclusiveUsage of term.terms)
          traverseUsage(exclusiveUsage);
  }
  traverseUsage(usage);
  return names;
}
function extractArgumentMetavars(usage) {
  const metavars = /* @__PURE__ */ new Set;
  function traverseUsage(terms) {
    if (!terms || !Array.isArray(terms))
      return;
    for (const term of terms)
      if (term.type === "argument") {
        if (term.hidden)
          continue;
        metavars.add(term.metavar);
      } else if (term.type === "optional" || term.type === "multiple")
        traverseUsage(term.terms);
      else if (term.type === "exclusive")
        for (const exclusiveUsage of term.terms)
          traverseUsage(exclusiveUsage);
  }
  traverseUsage(usage);
  return metavars;
}
function formatUsage(programName, usage, options = {}) {
  usage = normalizeUsage(usage);
  if (options.expandCommands) {
    const lastTerm = usage.at(-1);
    if (usage.length > 0 && usage.slice(0, -1).every((t) => t.type === "command") && lastTerm.type === "exclusive" && lastTerm.terms.every((t) => t.length > 0 && (t[0].type === "command" || t[0].type === "option" || t[0].type === "argument" || t[0].type === "optional" && t[0].terms.length === 1 && (t[0].terms[0].type === "command" || t[0].terms[0].type === "option" || t[0].terms[0].type === "argument")))) {
      const lines = [];
      for (let command of lastTerm.terms) {
        const firstTerm = command[0];
        if (firstTerm?.type === "command" && firstTerm.hidden)
          continue;
        if (usage.length > 1)
          command = [...usage.slice(0, -1), ...command];
        lines.push(formatUsage(programName, command, options));
      }
      return lines.join(`
`);
    }
  }
  let output = options.colors ? `\x1B[1m${programName}\x1B[0m ` : `${programName} `;
  let lineWidth = programName.length + 1;
  for (const { text: text2, width } of formatUsageTerms(usage, options)) {
    if (options.maxWidth != null && lineWidth + width > options.maxWidth) {
      output += `
`;
      lineWidth = 0;
      if (text2 === " ")
        continue;
    }
    output += text2;
    lineWidth += width;
  }
  return output;
}
function normalizeUsage(usage) {
  const terms = usage.map(normalizeUsageTerm);
  terms.sort((a, b) => {
    const aCmd = a.type === "command";
    const bCmd = b.type === "command";
    const aArg = a.type === "argument" || (a.type === "optional" || a.type === "multiple") && a.terms.at(-1)?.type === "argument";
    const bArg = b.type === "argument" || (b.type === "optional" || b.type === "multiple") && b.terms.at(-1)?.type === "argument";
    return aCmd === bCmd ? aArg === bArg ? 0 : aArg ? 1 : -1 : aCmd ? -1 : 1;
  });
  return terms;
}
function normalizeUsageTerm(term) {
  if (term.type === "optional")
    return {
      type: "optional",
      terms: normalizeUsage(term.terms)
    };
  else if (term.type === "multiple")
    return {
      type: "multiple",
      terms: normalizeUsage(term.terms),
      min: term.min
    };
  else if (term.type === "exclusive") {
    const terms = [];
    for (const usage of term.terms) {
      const normalized = normalizeUsage(usage);
      if (normalized.length >= 1 && normalized[0].type === "exclusive") {
        const rest = normalized.slice(1);
        for (const subUsage of normalized[0].terms)
          terms.push([...subUsage, ...rest]);
      } else
        terms.push(normalized);
    }
    return {
      type: "exclusive",
      terms
    };
  } else
    return term;
}
function* formatUsageTerms(terms, options) {
  let i = 0;
  for (const t of terms) {
    if (i > 0)
      yield {
        text: " ",
        width: 1
      };
    yield* formatUsageTermInternal(t, options);
    i++;
  }
}
function formatUsageTerm(term, options = {}) {
  let lineWidth = 0;
  let output = "";
  for (const { text: text2, width } of formatUsageTermInternal(term, options)) {
    if (options.maxWidth != null && lineWidth + width > options.maxWidth) {
      output += `
`;
      lineWidth = 0;
      if (text2 === " ")
        continue;
    }
    output += text2;
    lineWidth += width;
  }
  return output;
}
function* formatUsageTermInternal(term, options) {
  const optionsSeparator = options.optionsSeparator ?? "/";
  if (term.type === "argument")
    yield {
      text: options?.colors ? `\x1B[4m${term.metavar}\x1B[0m` : term.metavar,
      width: term.metavar.length
    };
  else if (term.type === "option")
    if (options?.onlyShortestOptions) {
      const shortestName = term.names.reduce((a, b) => a.length <= b.length ? a : b);
      yield {
        text: options?.colors ? `\x1B[3m${shortestName}\x1B[0m` : shortestName,
        width: shortestName.length
      };
    } else {
      let i = 0;
      for (const optionName2 of term.names) {
        if (i > 0)
          yield {
            text: options?.colors ? `\x1B[2m${optionsSeparator}\x1B[0m` : optionsSeparator,
            width: optionsSeparator.length
          };
        yield {
          text: options?.colors ? `\x1B[3m${optionName2}\x1B[0m` : optionName2,
          width: optionName2.length
        };
        i++;
      }
      if (term.metavar != null) {
        yield {
          text: " ",
          width: 1
        };
        yield {
          text: options?.colors ? `\x1B[4m\x1B[2m${term.metavar}\x1B[0m` : term.metavar,
          width: term.metavar.length
        };
      }
    }
  else if (term.type === "command")
    yield {
      text: options?.colors ? `\x1B[1m${term.name}\x1B[0m` : term.name,
      width: term.name.length
    };
  else if (term.type === "optional") {
    yield {
      text: options?.colors ? `\x1B[2m[\x1B[0m` : "[",
      width: 1
    };
    yield* formatUsageTerms(term.terms, options);
    yield {
      text: options?.colors ? `\x1B[2m]\x1B[0m` : "]",
      width: 1
    };
  } else if (term.type === "exclusive") {
    yield {
      text: options?.colors ? `\x1B[2m(\x1B[0m` : "(",
      width: 1
    };
    let i = 0;
    for (const termGroup of term.terms) {
      if (i > 0) {
        yield {
          text: " ",
          width: 1
        };
        yield {
          text: "|",
          width: 1
        };
        yield {
          text: " ",
          width: 1
        };
      }
      yield* formatUsageTerms(termGroup, options);
      i++;
    }
    yield {
      text: options?.colors ? `\x1B[2m)\x1B[0m` : ")",
      width: 1
    };
  } else if (term.type === "multiple") {
    if (term.min < 1)
      yield {
        text: options?.colors ? `\x1B[2m[\x1B[0m` : "[",
        width: 1
      };
    for (let i = 0;i < Math.max(1, term.min); i++) {
      if (i > 0)
        yield {
          text: " ",
          width: 1
        };
      yield* formatUsageTerms(term.terms, options);
    }
    yield {
      text: options?.colors ? `\x1B[2m...\x1B[0m` : "...",
      width: 3
    };
    if (term.min < 1)
      yield {
        text: options?.colors ? `\x1B[2m]\x1B[0m` : "]",
        width: 1
      };
  } else if (term.type === "literal")
    yield {
      text: term.value,
      width: term.value.length
    };
  else if (term.type === "passthrough") {
    const text2 = "[...]";
    yield {
      text: options?.colors ? `\x1B[2m${text2}\x1B[0m` : text2,
      width: 5
    };
  } else
    throw new TypeError(`Unknown usage term type: ${term["type"]}.`);
}

// node_modules/@optique/core/dist/suggestion.js
function levenshteinDistance(source, target) {
  if (source.length === 0)
    return target.length;
  if (target.length === 0)
    return source.length;
  if (source.length > target.length)
    [source, target] = [target, source];
  let previousRow = new Array(source.length + 1);
  let currentRow = new Array(source.length + 1);
  for (let i = 0;i <= source.length; i++)
    previousRow[i] = i;
  for (let j = 1;j <= target.length; j++) {
    currentRow[0] = j;
    for (let i = 1;i <= source.length; i++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      currentRow[i] = Math.min(currentRow[i - 1] + 1, previousRow[i] + 1, previousRow[i - 1] + cost);
    }
    [previousRow, currentRow] = [currentRow, previousRow];
  }
  return previousRow[source.length];
}
var DEFAULT_FIND_SIMILAR_OPTIONS = {
  maxDistance: 3,
  maxDistanceRatio: 0.5,
  maxSuggestions: 3,
  caseSensitive: false
};
function findSimilar(input, candidates, options = {}) {
  const maxDistance = options.maxDistance ?? DEFAULT_FIND_SIMILAR_OPTIONS.maxDistance;
  const maxDistanceRatio = options.maxDistanceRatio ?? DEFAULT_FIND_SIMILAR_OPTIONS.maxDistanceRatio;
  const maxSuggestions = options.maxSuggestions ?? DEFAULT_FIND_SIMILAR_OPTIONS.maxSuggestions;
  const caseSensitive = options.caseSensitive ?? DEFAULT_FIND_SIMILAR_OPTIONS.caseSensitive;
  if (input.length === 0)
    return [];
  const normalizedInput = caseSensitive ? input : input.toLowerCase();
  const matches = [];
  for (const candidate of candidates) {
    const normalizedCandidate = caseSensitive ? candidate : candidate.toLowerCase();
    const distance = levenshteinDistance(normalizedInput, normalizedCandidate);
    if (distance === 0)
      return [candidate];
    const distanceRatio = distance / input.length;
    if (distance <= maxDistance && distanceRatio <= maxDistanceRatio)
      matches.push({
        candidate,
        distance
      });
  }
  matches.sort((a, b) => {
    if (a.distance !== b.distance)
      return a.distance - b.distance;
    const lengthDiffA = Math.abs(a.candidate.length - input.length);
    const lengthDiffB = Math.abs(b.candidate.length - input.length);
    if (lengthDiffA !== lengthDiffB)
      return lengthDiffA - lengthDiffB;
    return a.candidate.localeCompare(b.candidate);
  });
  return matches.slice(0, maxSuggestions).map((m) => m.candidate);
}
function createSuggestionMessage(suggestions) {
  if (suggestions.length === 0)
    return [];
  if (suggestions.length === 1)
    return message`Did you mean ${optionName(suggestions[0])}?`;
  const messageParts = [text("Did you mean one of these?")];
  for (const suggestion of suggestions) {
    messageParts.push(text(`
  `));
    messageParts.push(optionName(suggestion));
  }
  return messageParts;
}
function createErrorWithSuggestions(baseError, invalidInput, usage, type = "both", customFormatter) {
  const candidates = /* @__PURE__ */ new Set;
  if (type === "option" || type === "both")
    for (const name of extractOptionNames(usage))
      candidates.add(name);
  if (type === "command" || type === "both")
    for (const name of extractCommandNames(usage))
      candidates.add(name);
  const suggestions = findSimilar(invalidInput, candidates, DEFAULT_FIND_SIMILAR_OPTIONS);
  const suggestionMsg = customFormatter ? customFormatter(suggestions) : createSuggestionMessage(suggestions);
  return suggestionMsg.length > 0 ? [
    ...baseError,
    text(`

`),
    ...suggestionMsg
  ] : baseError;
}
function getSuggestionKey(suggestion) {
  if (suggestion.kind === "literal")
    return suggestion.text;
  return `__FILE__:${suggestion.type}:${suggestion.extensions?.join(",") ?? ""}:${suggestion.pattern ?? ""}`;
}
function deduplicateSuggestions(suggestions) {
  const seen = /* @__PURE__ */ new Set;
  return suggestions.filter((suggestion) => {
    const key = getSuggestionKey(suggestion);
    if (seen.has(key))
      return false;
    seen.add(key);
    return true;
  });
}

// node_modules/@optique/core/dist/usage-internals.js
function collectLeadingCandidates(terms, optionNames2, commandNames) {
  if (!terms || !Array.isArray(terms))
    return true;
  for (const term of terms) {
    if (term.type === "option") {
      for (const name of term.names)
        optionNames2.add(name);
      return false;
    }
    if (term.type === "command") {
      commandNames.add(term.name);
      return false;
    }
    if (term.type === "argument")
      return false;
    if (term.type === "optional") {
      collectLeadingCandidates(term.terms, optionNames2, commandNames);
      continue;
    }
    if (term.type === "multiple") {
      collectLeadingCandidates(term.terms, optionNames2, commandNames);
      if (term.min === 0)
        continue;
      return false;
    }
    if (term.type === "exclusive") {
      let allSkippable = true;
      for (const branch of term.terms) {
        const branchSkippable = collectLeadingCandidates(branch, optionNames2, commandNames);
        allSkippable = allSkippable && branchSkippable;
      }
      if (allSkippable)
        continue;
      return false;
    }
  }
  return true;
}
function extractLeadingCommandNames(usage) {
  const options = /* @__PURE__ */ new Set;
  const commands = /* @__PURE__ */ new Set;
  collectLeadingCandidates(usage, options, commands);
  return commands;
}

// node_modules/@optique/core/dist/constructs.js
function createUnexpectedInputErrorWithScopedSuggestions(baseError, invalidInput, parsers, customFormatter) {
  const options = /* @__PURE__ */ new Set;
  const commands = /* @__PURE__ */ new Set;
  for (const parser of parsers)
    collectLeadingCandidates(parser.usage, options, commands);
  const candidates = new Set([...options, ...commands]);
  const suggestions = findSimilar(invalidInput, candidates, DEFAULT_FIND_SIMILAR_OPTIONS);
  const suggestionMsg = customFormatter ? customFormatter(suggestions) : createSuggestionMessage(suggestions);
  return suggestionMsg.length > 0 ? [
    ...baseError,
    text(`

`),
    ...suggestionMsg
  ] : baseError;
}
function isOptionRequiringValue(usage, token) {
  function traverse(terms) {
    if (!terms || !Array.isArray(terms))
      return false;
    for (const term of terms)
      if (term.type === "option") {
        if (term.metavar && term.names.includes(token))
          return true;
      } else if (term.type === "optional" || term.type === "multiple") {
        if (traverse(term.terms))
          return true;
      } else if (term.type === "exclusive") {
        for (const exclusiveUsage of term.terms)
          if (traverse(exclusiveUsage))
            return true;
      }
    return false;
  }
  return traverse(usage);
}
function extractRequiredUsage(usage) {
  const required = [];
  for (const term of usage)
    if (term.type === "optional")
      continue;
    else if (term.type === "exclusive") {
      const requiredBranches = term.terms.map((branch) => extractRequiredUsage(branch)).filter((branch) => branch.length > 0);
      if (requiredBranches.length > 0)
        required.push({
          type: "exclusive",
          terms: requiredBranches
        });
    } else if (term.type === "multiple") {
      if (term.min > 0) {
        const requiredTerms = extractRequiredUsage(term.terms);
        if (requiredTerms.length > 0)
          required.push({
            type: "multiple",
            terms: requiredTerms,
            min: term.min
          });
      }
    } else
      required.push(term);
  return required;
}
function analyzeNoMatchContext(parsers) {
  const combinedUsage = [{
    type: "exclusive",
    terms: parsers.map((p) => p.usage)
  }];
  const requiredUsage = extractRequiredUsage(combinedUsage);
  return {
    hasOptions: extractOptionNames(requiredUsage).size > 0,
    hasCommands: extractCommandNames(requiredUsage).size > 0,
    hasArguments: extractArgumentMetavars(requiredUsage).size > 0
  };
}
var DuplicateOptionError = class extends Error {
  constructor(optionName$1, sources) {
    const sourceNames = sources.map((s) => typeof s === "symbol" ? s.description ?? s.toString() : s);
    super(`Duplicate option name "${optionName$1}" found in fields: ${sourceNames.join(", ")}. Each option name must be unique within a parser combinator.`);
    this.optionName = optionName$1;
    this.sources = sources;
    this.name = "DuplicateOptionError";
  }
};
function checkDuplicateOptionNames(parserSources) {
  const optionNameSources = /* @__PURE__ */ new Map;
  for (const [source, usage] of parserSources) {
    const names = extractOptionNames(usage);
    for (const name of names) {
      if (!optionNameSources.has(name))
        optionNameSources.set(name, []);
      optionNameSources.get(name).push(source);
    }
  }
  for (const [name, sources] of optionNameSources)
    if (sources.length > 1)
      throw new DuplicateOptionError(name, sources);
}
function generateNoMatchError(context) {
  const { hasOptions, hasCommands, hasArguments } = context;
  if (hasArguments && !hasOptions && !hasCommands)
    return message`Missing required argument.`;
  else if (hasCommands && !hasOptions && !hasArguments)
    return message`No matching command found.`;
  else if (hasOptions && !hasCommands && !hasArguments)
    return message`No matching option found.`;
  else if (hasCommands && hasOptions && !hasArguments)
    return message`No matching option or command found.`;
  else if (hasArguments && hasOptions && !hasCommands)
    return message`No matching option or argument found.`;
  else if (hasArguments && hasCommands && !hasOptions)
    return message`No matching command or argument found.`;
  else
    return message`No matching option, command, or argument found.`;
}
function createExclusiveComplete(parsers, options, noMatchContext, mode) {
  const syncParsers = parsers;
  return (state) => {
    if (state == null)
      return {
        success: false,
        error: getNoMatchError(options, noMatchContext)
      };
    const [i, result] = state;
    if (!result.success)
      return {
        success: false,
        error: result.error
      };
    return dispatchByMode(mode, () => syncParsers[i].complete(result.next.state), async () => {
      const completeResult = await parsers[i].complete(result.next.state);
      return completeResult;
    });
  };
}
function createExclusiveSuggest(parsers, mode) {
  const syncParsers = parsers;
  return (context, prefix) => {
    return dispatchIterableByMode(mode, function* () {
      const suggestions = [];
      if (context.state == null)
        for (const parser of syncParsers) {
          const parserSuggestions = parser.suggest({
            ...context,
            state: parser.initialState
          }, prefix);
          suggestions.push(...parserSuggestions);
        }
      else {
        const [index, parserResult] = context.state;
        if (parserResult.success) {
          const parserSuggestions = syncParsers[index].suggest({
            ...context,
            state: parserResult.next.state
          }, prefix);
          suggestions.push(...parserSuggestions);
        }
      }
      yield* deduplicateSuggestions(suggestions);
    }, async function* () {
      const suggestions = [];
      if (context.state == null)
        for (const parser of parsers) {
          const parserSuggestions = parser.suggest({
            ...context,
            state: parser.initialState
          }, prefix);
          if (parser.$mode === "async")
            for await (const s of parserSuggestions)
              suggestions.push(s);
          else
            suggestions.push(...parserSuggestions);
        }
      else {
        const [index, parserResult] = context.state;
        if (parserResult.success) {
          const parser = parsers[index];
          const parserSuggestions = parser.suggest({
            ...context,
            state: parserResult.next.state
          }, prefix);
          if (parser.$mode === "async")
            for await (const s of parserSuggestions)
              suggestions.push(s);
          else
            suggestions.push(...parserSuggestions);
        }
      }
      yield* deduplicateSuggestions(suggestions);
    });
  };
}
function getNoMatchError(options, noMatchContext) {
  const customNoMatch = options?.errors?.noMatch;
  return customNoMatch ? typeof customNoMatch === "function" ? customNoMatch(noMatchContext) : customNoMatch : generateNoMatchError(noMatchContext);
}
function or(...args) {
  let parsers;
  let options;
  if (args.length > 0 && args[args.length - 1] && typeof args[args.length - 1] === "object" && !("$valueType" in args[args.length - 1])) {
    options = args[args.length - 1];
    parsers = args.slice(0, -1);
  } else {
    parsers = args;
    options = undefined;
  }
  const noMatchContext = analyzeNoMatchContext(parsers);
  const combinedMode = parsers.some((p) => p.$mode === "async") ? "async" : "sync";
  const syncParsers = parsers;
  const getInitialError = (context) => ({
    consumed: 0,
    error: context.buffer.length < 1 ? getNoMatchError(options, noMatchContext) : (() => {
      const token = context.buffer[0];
      const defaultMsg = message`Unexpected option or subcommand: ${optionName(token)}.`;
      if (options?.errors?.unexpectedInput != null)
        return typeof options.errors.unexpectedInput === "function" ? options.errors.unexpectedInput(token) : options.errors.unexpectedInput;
      return createUnexpectedInputErrorWithScopedSuggestions(defaultMsg, token, parsers, options?.errors?.suggestions);
    })()
  });
  const parseSync = (context) => {
    let error = getInitialError(context);
    const orderedParsers = syncParsers.map((p, i) => [p, i]);
    orderedParsers.sort(([_, a], [__, b]) => context.state?.[0] === a ? -1 : context.state?.[0] === b ? 1 : a - b);
    for (const [parser, i] of orderedParsers) {
      const result = parser.parse({
        ...context,
        state: context.state == null || context.state[0] !== i || !context.state[1].success ? parser.initialState : context.state[1].next.state
      });
      if (result.success && result.consumed.length > 0) {
        if (context.state?.[0] !== i && context.state?.[1].success) {
          const previouslyConsumed = context.state[1].consumed;
          const checkResult = parser.parse({
            ...context,
            buffer: previouslyConsumed,
            state: parser.initialState
          });
          const canConsumeShared = checkResult.success && checkResult.consumed.length === previouslyConsumed.length && checkResult.consumed.every((c, idx) => c === previouslyConsumed[idx]);
          if (!canConsumeShared)
            return {
              success: false,
              consumed: context.buffer.length - result.next.buffer.length,
              error: message`${values(context.state[1].consumed)} and ${values(result.consumed)} cannot be used together.`
            };
          const replayedResult = parser.parse({
            ...context,
            state: checkResult.next.state
          });
          if (!replayedResult.success)
            return replayedResult;
          return {
            success: true,
            next: {
              ...context,
              buffer: replayedResult.next.buffer,
              optionsTerminated: replayedResult.next.optionsTerminated,
              state: [i, {
                ...replayedResult,
                consumed: [...previouslyConsumed, ...replayedResult.consumed]
              }]
            },
            consumed: replayedResult.consumed
          };
        }
        return {
          success: true,
          next: {
            ...context,
            buffer: result.next.buffer,
            optionsTerminated: result.next.optionsTerminated,
            state: [i, result]
          },
          consumed: result.consumed
        };
      } else if (!result.success && error.consumed < result.consumed)
        error = result;
    }
    return {
      ...error,
      success: false
    };
  };
  const parseAsync = async (context) => {
    let error = getInitialError(context);
    const orderedParsers = parsers.map((p, i) => [p, i]);
    orderedParsers.sort(([_, a], [__, b]) => context.state?.[0] === a ? -1 : context.state?.[0] === b ? 1 : a - b);
    for (const [parser, i] of orderedParsers) {
      const resultOrPromise = parser.parse({
        ...context,
        state: context.state == null || context.state[0] !== i || !context.state[1].success ? parser.initialState : context.state[1].next.state
      });
      const result = await resultOrPromise;
      if (result.success && result.consumed.length > 0) {
        if (context.state?.[0] !== i && context.state?.[1].success) {
          const previouslyConsumed = context.state[1].consumed;
          const checkResultOrPromise = parser.parse({
            ...context,
            buffer: previouslyConsumed,
            state: parser.initialState
          });
          const checkResult = await checkResultOrPromise;
          const canConsumeShared = checkResult.success && checkResult.consumed.length === previouslyConsumed.length && checkResult.consumed.every((c, idx) => c === previouslyConsumed[idx]);
          if (!canConsumeShared)
            return {
              success: false,
              consumed: context.buffer.length - result.next.buffer.length,
              error: message`${values(context.state[1].consumed)} and ${values(result.consumed)} cannot be used together.`
            };
          const replayedResultOrPromise = parser.parse({
            ...context,
            state: checkResult.next.state
          });
          const replayedResult = await replayedResultOrPromise;
          if (!replayedResult.success)
            return replayedResult;
          return {
            success: true,
            next: {
              ...context,
              buffer: replayedResult.next.buffer,
              optionsTerminated: replayedResult.next.optionsTerminated,
              state: [i, {
                ...replayedResult,
                consumed: [...previouslyConsumed, ...replayedResult.consumed]
              }]
            },
            consumed: replayedResult.consumed
          };
        }
        return {
          success: true,
          next: {
            ...context,
            buffer: result.next.buffer,
            optionsTerminated: result.next.optionsTerminated,
            state: [i, result]
          },
          consumed: result.consumed
        };
      } else if (!result.success && error.consumed < result.consumed)
        error = result;
    }
    return {
      ...error,
      success: false
    };
  };
  return {
    $mode: combinedMode,
    $valueType: [],
    $stateType: [],
    priority: Math.max(...parsers.map((p) => p.priority)),
    usage: [{
      type: "exclusive",
      terms: parsers.map((p) => p.usage)
    }],
    initialState: undefined,
    complete: createExclusiveComplete(parsers, options, noMatchContext, combinedMode),
    parse(context) {
      return dispatchByMode(combinedMode, () => parseSync(context), () => parseAsync(context));
    },
    suggest: createExclusiveSuggest(parsers, combinedMode),
    getDocFragments(state, _defaultValue) {
      let brief;
      let description;
      let footer;
      let fragments;
      if (state.kind === "unavailable" || state.state == null)
        fragments = parsers.flatMap((p) => p.getDocFragments({ kind: "unavailable" }, undefined).fragments);
      else {
        const [index, parserResult] = state.state;
        const innerState = parserResult.success ? {
          kind: "available",
          state: parserResult.next.state
        } : { kind: "unavailable" };
        const docFragments = parsers[index].getDocFragments(innerState, undefined);
        brief = docFragments.brief;
        description = docFragments.description;
        footer = docFragments.footer;
        fragments = docFragments.fragments;
      }
      const entries = fragments.filter((f) => f.type === "entry");
      const sections = [];
      for (const fragment of fragments) {
        if (fragment.type !== "section")
          continue;
        if (fragment.title == null)
          entries.push(...fragment.entries);
        else
          sections.push(fragment);
      }
      return {
        brief,
        description,
        footer,
        fragments: [...sections.map((s) => ({
          ...s,
          type: "section"
        })), {
          type: "section",
          entries
        }]
      };
    }
  };
}
function longestMatch(...args) {
  let parsers;
  let options;
  if (args.length > 0 && args[args.length - 1] && typeof args[args.length - 1] === "object" && !("$valueType" in args[args.length - 1])) {
    options = args[args.length - 1];
    parsers = args.slice(0, -1);
  } else {
    parsers = args;
    options = undefined;
  }
  const noMatchContext = analyzeNoMatchContext(parsers);
  const combinedMode = parsers.some((p) => p.$mode === "async") ? "async" : "sync";
  const syncParsers = parsers;
  const getInitialError = (context) => ({
    consumed: 0,
    error: context.buffer.length < 1 ? getNoMatchError(options, noMatchContext) : (() => {
      const token = context.buffer[0];
      const defaultMsg = message`Unexpected option or subcommand: ${optionName(token)}.`;
      if (options?.errors?.unexpectedInput != null)
        return typeof options.errors.unexpectedInput === "function" ? options.errors.unexpectedInput(token) : options.errors.unexpectedInput;
      return createUnexpectedInputErrorWithScopedSuggestions(defaultMsg, token, parsers, options?.errors?.suggestions);
    })()
  });
  const parseSync = (context) => {
    let bestMatch = null;
    let error = getInitialError(context);
    for (let i = 0;i < syncParsers.length; i++) {
      const parser = syncParsers[i];
      const result = parser.parse({
        ...context,
        state: context.state == null || context.state[0] !== i || !context.state[1].success ? parser.initialState : context.state[1].next.state
      });
      if (result.success) {
        const consumed = context.buffer.length - result.next.buffer.length;
        if (bestMatch === null || consumed > bestMatch.consumed)
          bestMatch = {
            index: i,
            result,
            consumed
          };
      } else if (error.consumed < result.consumed)
        error = result;
    }
    if (bestMatch && bestMatch.result.success)
      return {
        success: true,
        next: {
          ...context,
          buffer: bestMatch.result.next.buffer,
          optionsTerminated: bestMatch.result.next.optionsTerminated,
          state: [bestMatch.index, bestMatch.result]
        },
        consumed: bestMatch.result.consumed
      };
    return {
      ...error,
      success: false
    };
  };
  const parseAsync = async (context) => {
    let bestMatch = null;
    let error = getInitialError(context);
    for (let i = 0;i < parsers.length; i++) {
      const parser = parsers[i];
      const resultOrPromise = parser.parse({
        ...context,
        state: context.state == null || context.state[0] !== i || !context.state[1].success ? parser.initialState : context.state[1].next.state
      });
      const result = await resultOrPromise;
      if (result.success) {
        const consumed = context.buffer.length - result.next.buffer.length;
        if (bestMatch === null || consumed > bestMatch.consumed)
          bestMatch = {
            index: i,
            result,
            consumed
          };
      } else if (error.consumed < result.consumed)
        error = result;
    }
    if (bestMatch && bestMatch.result.success)
      return {
        success: true,
        next: {
          ...context,
          buffer: bestMatch.result.next.buffer,
          optionsTerminated: bestMatch.result.next.optionsTerminated,
          state: [bestMatch.index, bestMatch.result]
        },
        consumed: bestMatch.result.consumed
      };
    return {
      ...error,
      success: false
    };
  };
  return {
    $mode: combinedMode,
    $valueType: [],
    $stateType: [],
    priority: Math.max(...parsers.map((p) => p.priority)),
    usage: [{
      type: "exclusive",
      terms: parsers.map((p) => p.usage)
    }],
    initialState: undefined,
    complete: createExclusiveComplete(parsers, options, noMatchContext, combinedMode),
    parse(context) {
      return dispatchByMode(combinedMode, () => parseSync(context), () => parseAsync(context));
    },
    suggest: createExclusiveSuggest(parsers, combinedMode),
    getDocFragments(state, _defaultValue) {
      let brief;
      let description;
      let footer;
      let fragments;
      if (state.kind === "unavailable" || state.state == null)
        fragments = parsers.flatMap((p) => p.getDocFragments({ kind: "unavailable" }).fragments);
      else {
        const [i, result] = state.state;
        if (result.success) {
          const docResult = parsers[i].getDocFragments({
            kind: "available",
            state: result.next.state
          });
          brief = docResult.brief;
          description = docResult.description;
          footer = docResult.footer;
          fragments = docResult.fragments;
        } else
          fragments = parsers.flatMap((p) => p.getDocFragments({ kind: "unavailable" }).fragments);
      }
      return {
        brief,
        description,
        fragments,
        footer
      };
    }
  };
}
function* suggestObjectSync(context, prefix, parserPairs) {
  const registry = context.dependencyRegistry instanceof DependencyRegistry ? context.dependencyRegistry : new DependencyRegistry;
  if (context.state && typeof context.state === "object")
    collectDependencies(context.state, registry);
  const contextWithRegistry = {
    ...context,
    dependencyRegistry: registry
  };
  if (context.buffer.length > 0) {
    const lastToken = context.buffer[context.buffer.length - 1];
    for (const [field, parser] of parserPairs)
      if (isOptionRequiringValue(parser.usage, lastToken)) {
        const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
        yield* parser.suggest({
          ...contextWithRegistry,
          state: fieldState
        }, prefix);
        return;
      }
  }
  const suggestions = [];
  for (const [field, parser] of parserPairs) {
    const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
    const fieldSuggestions = parser.suggest({
      ...contextWithRegistry,
      state: fieldState
    }, prefix);
    suggestions.push(...fieldSuggestions);
  }
  yield* deduplicateSuggestions(suggestions);
}
async function* suggestObjectAsync(context, prefix, parserPairs) {
  const registry = context.dependencyRegistry instanceof DependencyRegistry ? context.dependencyRegistry : new DependencyRegistry;
  if (context.state && typeof context.state === "object")
    collectDependencies(context.state, registry);
  const contextWithRegistry = {
    ...context,
    dependencyRegistry: registry
  };
  if (context.buffer.length > 0) {
    const lastToken = context.buffer[context.buffer.length - 1];
    for (const [field, parser] of parserPairs)
      if (isOptionRequiringValue(parser.usage, lastToken)) {
        const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
        const suggestions$1 = parser.suggest({
          ...contextWithRegistry,
          state: fieldState
        }, prefix);
        for await (const s of suggestions$1)
          yield s;
        return;
      }
  }
  const suggestions = [];
  for (const [field, parser] of parserPairs) {
    const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
    const fieldSuggestions = parser.suggest({
      ...contextWithRegistry,
      state: fieldState
    }, prefix);
    for await (const s of fieldSuggestions)
      suggestions.push(s);
  }
  yield* deduplicateSuggestions(suggestions);
}
function collectDependencies(state, registry, visited = /* @__PURE__ */ new WeakSet) {
  if (state === null || state === undefined)
    return;
  if (typeof state === "object") {
    if (visited.has(state))
      return;
    visited.add(state);
  }
  if (isDependencySourceState(state)) {
    const depId = state[dependencyId];
    const result = state.result;
    if (result.success)
      registry.set(depId, result.value);
    return;
  }
  if (Array.isArray(state)) {
    for (const item of state)
      collectDependencies(item, registry, visited);
    return;
  }
  if (typeof state === "object" && !isDeferredParseState(state))
    for (const key of Reflect.ownKeys(state))
      collectDependencies(state[key], registry, visited);
}
function isPlainObject(value2) {
  if (typeof value2 !== "object" || value2 === null)
    return false;
  const proto = Object.getPrototypeOf(value2);
  return proto === Object.prototype || proto === null;
}
function collectDependencyValues(deferredState, registry) {
  const depIds = deferredState.dependencyIds;
  if (depIds && depIds.length > 0) {
    const defaults = deferredState.defaultValues;
    const dependencyValues = [];
    for (let i = 0;i < depIds.length; i++) {
      const depId$1 = depIds[i];
      if (registry.has(depId$1))
        dependencyValues.push(registry.get(depId$1));
      else if (defaults && i < defaults.length)
        dependencyValues.push(defaults[i]);
      else
        return null;
    }
    return dependencyValues;
  }
  const depId = deferredState.dependencyId;
  if (registry.has(depId))
    return registry.get(depId);
  return null;
}
function resolveDeferred(state, registry, visited = /* @__PURE__ */ new WeakSet) {
  if (state === null || state === undefined)
    return state;
  if (typeof state === "object") {
    if (visited.has(state))
      return state;
    visited.add(state);
  }
  if (isDeferredParseState(state)) {
    const deferredState = state;
    const dependencyValue = collectDependencyValues(deferredState, registry);
    if (dependencyValue === null)
      return deferredState.preliminaryResult;
    const reParseResult = deferredState.parser[parseWithDependency](deferredState.rawInput, dependencyValue);
    if (reParseResult instanceof Promise)
      return deferredState.preliminaryResult;
    return reParseResult;
  }
  if (isDependencySourceState(state))
    return state;
  if (Array.isArray(state))
    return state.map((item) => resolveDeferred(item, registry, visited));
  if (isPlainObject(state)) {
    const resolved = {};
    for (const key of Reflect.ownKeys(state))
      resolved[key] = resolveDeferred(state[key], registry, visited);
    return resolved;
  }
  return state;
}
function resolveDeferredParseStates(fieldStates) {
  const registry = new DependencyRegistry;
  collectDependencies(fieldStates, registry);
  return resolveDeferred(fieldStates, registry);
}
async function resolveDeferredAsync(state, registry, visited = /* @__PURE__ */ new WeakSet) {
  if (state === null || state === undefined)
    return state;
  if (typeof state === "object") {
    if (visited.has(state))
      return state;
    visited.add(state);
  }
  if (isDeferredParseState(state)) {
    const deferredState = state;
    const dependencyValue = collectDependencyValues(deferredState, registry);
    if (dependencyValue === null)
      return deferredState.preliminaryResult;
    const reParseResult = deferredState.parser[parseWithDependency](deferredState.rawInput, dependencyValue);
    return Promise.resolve(reParseResult);
  }
  if (isDependencySourceState(state))
    return state;
  if (Array.isArray(state))
    return Promise.all(state.map((item) => resolveDeferredAsync(item, registry, visited)));
  if (isPlainObject(state)) {
    const resolved = {};
    const keys = Reflect.ownKeys(state);
    await Promise.all(keys.map(async (key) => {
      resolved[key] = await resolveDeferredAsync(state[key], registry, visited);
    }));
    return resolved;
  }
  return state;
}
async function resolveDeferredParseStatesAsync(fieldStates) {
  const registry = new DependencyRegistry;
  collectDependencies(fieldStates, registry);
  return await resolveDeferredAsync(fieldStates, registry);
}
function object(labelOrParsers, maybeParsersOrOptions, maybeOptions) {
  const label = typeof labelOrParsers === "string" ? labelOrParsers : undefined;
  let parsers;
  let options = {};
  if (typeof labelOrParsers === "string") {
    parsers = maybeParsersOrOptions;
    options = maybeOptions ?? {};
  } else {
    parsers = labelOrParsers;
    options = maybeParsersOrOptions ?? {};
  }
  const parserKeys = Reflect.ownKeys(parsers);
  const parserPairs = parserKeys.map((k) => [k, parsers[k]]);
  parserPairs.sort(([_, parserA], [__, parserB]) => parserB.priority - parserA.priority);
  const initialState = {};
  for (const key of parserKeys)
    initialState[key] = parsers[key].initialState;
  if (!options.allowDuplicates)
    checkDuplicateOptionNames(parserPairs.map(([field, parser]) => [field, parser.usage]));
  const noMatchContext = analyzeNoMatchContext(parserKeys.map((k) => parsers[k]));
  const combinedMode = parserKeys.some((k) => parsers[k].$mode === "async") ? "async" : "sync";
  const getInitialError = (context) => ({
    consumed: 0,
    error: context.buffer.length > 0 ? (() => {
      const token = context.buffer[0];
      const customMessage = options.errors?.unexpectedInput;
      if (customMessage)
        return typeof customMessage === "function" ? customMessage(token) : customMessage;
      const baseError = message`Unexpected option or argument: ${token}.`;
      return createErrorWithSuggestions(baseError, token, context.usage, "both", options.errors?.suggestions);
    })() : (() => {
      const customEndOfInput = options.errors?.endOfInput;
      return customEndOfInput ? typeof customEndOfInput === "function" ? customEndOfInput(noMatchContext) : customEndOfInput : generateNoMatchError(noMatchContext);
    })()
  });
  const parseSync = (context) => {
    let error = getInitialError(context);
    let currentContext = context;
    let anySuccess = false;
    const allConsumed = [];
    let madeProgress = true;
    while (madeProgress && currentContext.buffer.length > 0) {
      madeProgress = false;
      for (const [field, parser] of parserPairs) {
        const result = parser.parse({
          ...currentContext,
          state: currentContext.state && typeof currentContext.state === "object" && field in currentContext.state ? currentContext.state[field] : parser.initialState
        });
        if (result.success && result.consumed.length > 0) {
          currentContext = {
            ...currentContext,
            buffer: result.next.buffer,
            optionsTerminated: result.next.optionsTerminated,
            state: {
              ...currentContext.state,
              [field]: result.next.state
            }
          };
          allConsumed.push(...result.consumed);
          anySuccess = true;
          madeProgress = true;
          break;
        } else if (!result.success && error.consumed < result.consumed)
          error = result;
      }
    }
    if (anySuccess)
      return {
        success: true,
        next: currentContext,
        consumed: allConsumed
      };
    if (context.buffer.length === 0) {
      let allCanComplete = true;
      for (const [field, parser] of parserPairs) {
        const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
        const completeResult = parser.complete(fieldState);
        if (!completeResult.success) {
          allCanComplete = false;
          break;
        }
      }
      if (allCanComplete)
        return {
          success: true,
          next: context,
          consumed: []
        };
    }
    return {
      ...error,
      success: false
    };
  };
  const parseAsync = async (context) => {
    let error = getInitialError(context);
    let currentContext = context;
    let anySuccess = false;
    const allConsumed = [];
    let madeProgress = true;
    while (madeProgress && currentContext.buffer.length > 0) {
      madeProgress = false;
      for (const [field, parser] of parserPairs) {
        const resultOrPromise = parser.parse({
          ...currentContext,
          state: currentContext.state && typeof currentContext.state === "object" && field in currentContext.state ? currentContext.state[field] : parser.initialState
        });
        const result = await resultOrPromise;
        if (result.success && result.consumed.length > 0) {
          currentContext = {
            ...currentContext,
            buffer: result.next.buffer,
            optionsTerminated: result.next.optionsTerminated,
            state: {
              ...currentContext.state,
              [field]: result.next.state
            }
          };
          allConsumed.push(...result.consumed);
          anySuccess = true;
          madeProgress = true;
          break;
        } else if (!result.success && error.consumed < result.consumed)
          error = result;
      }
    }
    if (anySuccess)
      return {
        success: true,
        next: currentContext,
        consumed: allConsumed
      };
    if (context.buffer.length === 0) {
      let allCanComplete = true;
      for (const [field, parser] of parserPairs) {
        const fieldState = context.state && typeof context.state === "object" && field in context.state ? context.state[field] : parser.initialState;
        const completeResult = await parser.complete(fieldState);
        if (!completeResult.success) {
          allCanComplete = false;
          break;
        }
      }
      if (allCanComplete)
        return {
          success: true,
          next: context,
          consumed: []
        };
    }
    return {
      ...error,
      success: false
    };
  };
  return {
    $mode: combinedMode,
    $valueType: [],
    $stateType: [],
    priority: Math.max(...parserKeys.map((k) => parsers[k].priority)),
    usage: parserPairs.flatMap(([_, p]) => p.usage),
    initialState,
    parse(context) {
      return dispatchByMode(combinedMode, () => parseSync(context), () => parseAsync(context));
    },
    complete(state) {
      return dispatchByMode(combinedMode, () => {
        const preCompletedState = {};
        const preCompletedKeys = /* @__PURE__ */ new Set;
        for (const field of parserKeys) {
          const fieldKey = field;
          const fieldState = state[fieldKey];
          const fieldParser = parsers[field];
          if (Array.isArray(fieldState) && fieldState.length === 1 && isPendingDependencySourceState(fieldState[0])) {
            const completed = fieldParser.complete(fieldState);
            preCompletedState[fieldKey] = completed;
            preCompletedKeys.add(fieldKey);
          } else if (fieldState === undefined && isPendingDependencySourceState(fieldParser.initialState)) {
            const completed = fieldParser.complete([fieldParser.initialState]);
            preCompletedState[fieldKey] = completed;
            preCompletedKeys.add(fieldKey);
          } else if (fieldState === undefined && isWrappedDependencySource(fieldParser)) {
            const pendingState = fieldParser[wrappedDependencySourceMarker];
            const completed = fieldParser.complete([pendingState]);
            if (isDependencySourceState(completed)) {
              preCompletedState[fieldKey] = completed;
              preCompletedKeys.add(fieldKey);
            } else
              preCompletedState[fieldKey] = fieldState;
          } else
            preCompletedState[fieldKey] = fieldState;
        }
        const resolvedState = resolveDeferredParseStates(preCompletedState);
        const result = {};
        for (const field of parserKeys) {
          const fieldKey = field;
          const fieldResolvedState = resolvedState[fieldKey];
          const fieldParser = parsers[field];
          if (isDependencySourceState(fieldResolvedState) && preCompletedKeys.has(fieldKey)) {
            const depResult = fieldResolvedState.result;
            if (depResult.success)
              result[fieldKey] = depResult.value;
            else
              return {
                success: false,
                error: depResult.error
              };
            continue;
          }
          const valueResult = fieldParser.complete(fieldResolvedState);
          if (valueResult.success)
            result[fieldKey] = valueResult.value;
          else
            return {
              success: false,
              error: valueResult.error
            };
        }
        return {
          success: true,
          value: result
        };
      }, async () => {
        const preCompletedState = {};
        const preCompletedKeys = /* @__PURE__ */ new Set;
        for (const field of parserKeys) {
          const fieldKey = field;
          const fieldState = state[fieldKey];
          const fieldParser = parsers[field];
          if (Array.isArray(fieldState) && fieldState.length === 1 && isPendingDependencySourceState(fieldState[0])) {
            const completed = await fieldParser.complete(fieldState);
            preCompletedState[fieldKey] = completed;
            preCompletedKeys.add(fieldKey);
          } else if (fieldState === undefined && isPendingDependencySourceState(fieldParser.initialState)) {
            const completed = await fieldParser.complete([fieldParser.initialState]);
            preCompletedState[fieldKey] = completed;
            preCompletedKeys.add(fieldKey);
          } else if (fieldState === undefined && isWrappedDependencySource(fieldParser)) {
            const pendingState = fieldParser[wrappedDependencySourceMarker];
            const completed = await fieldParser.complete([pendingState]);
            if (isDependencySourceState(completed)) {
              preCompletedState[fieldKey] = completed;
              preCompletedKeys.add(fieldKey);
            } else
              preCompletedState[fieldKey] = fieldState;
          } else
            preCompletedState[fieldKey] = fieldState;
        }
        const resolvedState = await resolveDeferredParseStatesAsync(preCompletedState);
        const result = {};
        for (const field of parserKeys) {
          const fieldKey = field;
          const fieldResolvedState = resolvedState[fieldKey];
          const fieldParser = parsers[field];
          if (isDependencySourceState(fieldResolvedState) && preCompletedKeys.has(fieldKey)) {
            const depResult = fieldResolvedState.result;
            if (depResult.success)
              result[fieldKey] = depResult.value;
            else
              return {
                success: false,
                error: depResult.error
              };
            continue;
          }
          const valueResult = await fieldParser.complete(fieldResolvedState);
          if (valueResult.success)
            result[fieldKey] = valueResult.value;
          else
            return {
              success: false,
              error: valueResult.error
            };
        }
        return {
          success: true,
          value: result
        };
      });
    },
    suggest(context, prefix) {
      return dispatchIterableByMode(combinedMode, () => {
        const syncParserPairs = parserPairs;
        return suggestObjectSync(context, prefix, syncParserPairs);
      }, () => suggestObjectAsync(context, prefix, parserPairs));
    },
    getDocFragments(state, defaultValue) {
      const fragments = parserPairs.flatMap(([field, p]) => {
        const fieldState = state.kind === "unavailable" ? { kind: "unavailable" } : {
          kind: "available",
          state: state.state[field]
        };
        return p.getDocFragments(fieldState, defaultValue?.[field]).fragments;
      });
      const entries = fragments.filter((d) => d.type === "entry");
      const sections = [];
      for (const fragment of fragments) {
        if (fragment.type !== "section")
          continue;
        if (fragment.title == null)
          entries.push(...fragment.entries);
        else
          sections.push(fragment);
      }
      const section = {
        title: label,
        entries
      };
      sections.push(section);
      return { fragments: sections.map((s) => ({
        ...s,
        type: "section"
      })) };
    }
  };
}
function group(label, parser) {
  return {
    $mode: parser.$mode,
    $valueType: parser.$valueType,
    $stateType: parser.$stateType,
    priority: parser.priority,
    usage: parser.usage,
    initialState: parser.initialState,
    parse: (context) => parser.parse(context),
    complete: (state) => parser.complete(state),
    suggest: (context, prefix) => parser.suggest(context, prefix),
    getDocFragments: (state, defaultValue) => {
      const { brief, description, footer, fragments } = parser.getDocFragments(state, defaultValue);
      const allEntries = [];
      const titledSections = [];
      for (const fragment of fragments)
        if (fragment.type === "entry")
          allEntries.push(fragment);
        else if (fragment.type === "section")
          if (fragment.title)
            titledSections.push(fragment);
          else
            allEntries.push(...fragment.entries);
      const initialFragments = parser.getDocFragments({
        kind: "available",
        state: parser.initialState
      }, undefined);
      const initialCommandNames = /* @__PURE__ */ new Set;
      for (const f of initialFragments.fragments)
        if (f.type === "entry" && f.term.type === "command")
          initialCommandNames.add(f.term.name);
        else if (f.type === "section") {
          for (const e of f.entries)
            if (e.term.type === "command")
              initialCommandNames.add(e.term.name);
        }
      const initialHasCommands = initialCommandNames.size > 0;
      const currentCommandsAreGroupOwn = allEntries.some((e) => e.term.type === "command" && initialCommandNames.has(e.term.name));
      const applyLabel = !initialHasCommands || currentCommandsAreGroupOwn;
      const labeledSection = applyLabel ? {
        title: label,
        entries: allEntries
      } : { entries: allEntries };
      return {
        brief,
        description,
        footer,
        fragments: [...titledSections.map((s) => ({
          ...s,
          type: "section"
        })), {
          type: "section",
          ...labeledSection
        }]
      };
    }
  };
}

// node_modules/@optique/core/dist/modifiers.js
function parseOptionalStyleSync(context, parser) {
  const innerState = typeof context.state === "undefined" ? parser.initialState : context.state[0];
  const result = parser.parse({
    ...context,
    state: innerState
  });
  return processOptionalStyleResult(result, innerState, context);
}
async function parseOptionalStyleAsync(context, parser) {
  const innerState = typeof context.state === "undefined" ? parser.initialState : context.state[0];
  const result = await parser.parse({
    ...context,
    state: innerState
  });
  return processOptionalStyleResult(result, innerState, context);
}
function processOptionalStyleResult(result, innerState, context) {
  if (result.success) {
    if (result.next.state !== innerState || result.consumed.length === 0)
      return {
        success: true,
        next: {
          ...result.next,
          state: [result.next.state]
        },
        consumed: result.consumed
      };
    return {
      success: true,
      next: {
        ...result.next,
        state: context.state
      },
      consumed: result.consumed
    };
  }
  if (result.consumed === 0)
    return {
      success: true,
      next: context,
      consumed: []
    };
  return result;
}
function optional(parser) {
  const syncParser = parser;
  function* suggestSync(context, prefix) {
    const innerState = typeof context.state === "undefined" ? syncParser.initialState : context.state[0];
    yield* syncParser.suggest({
      ...context,
      state: innerState
    }, prefix);
  }
  async function* suggestAsync(context, prefix) {
    const innerState = typeof context.state === "undefined" ? syncParser.initialState : context.state[0];
    const suggestions = parser.suggest({
      ...context,
      state: innerState
    }, prefix);
    for await (const s of suggestions)
      yield s;
  }
  const innerHasWrappedDependency = isWrappedDependencySource(parser);
  const innerHasDirectDependency = isPendingDependencySourceState(syncParser.initialState);
  const wrappedDependencyMarker = innerHasWrappedDependency ? { [wrappedDependencySourceMarker]: parser[wrappedDependencySourceMarker] } : innerHasDirectDependency ? { [wrappedDependencySourceMarker]: syncParser.initialState } : {};
  const hasWrappedDependencySource = wrappedDependencySourceMarker in wrappedDependencyMarker;
  const wrappedPendingState = hasWrappedDependencySource ? wrappedDependencyMarker[wrappedDependencySourceMarker] : undefined;
  return {
    $mode: parser.$mode,
    $valueType: [],
    $stateType: [],
    priority: parser.priority,
    usage: [{
      type: "optional",
      terms: parser.usage
    }],
    initialState: undefined,
    ...wrappedDependencyMarker,
    parse(context) {
      return dispatchByMode(parser.$mode, () => parseOptionalStyleSync(context, syncParser), () => parseOptionalStyleAsync(context, parser));
    },
    complete(state) {
      if (typeof state === "undefined") {
        if (innerHasWrappedDependency && wrappedPendingState)
          return dispatchByMode(parser.$mode, () => syncParser.complete([wrappedPendingState]), () => parser.complete([wrappedPendingState]));
        return {
          success: true,
          value: undefined
        };
      }
      if (Array.isArray(state) && state.length === 1 && isPendingDependencySourceState(state[0])) {
        if (innerHasWrappedDependency)
          return dispatchByMode(parser.$mode, () => syncParser.complete(state), () => parser.complete(state));
        return {
          success: true,
          value: undefined
        };
      }
      return dispatchByMode(parser.$mode, () => syncParser.complete(state[0]), () => parser.complete(state[0]));
    },
    suggest(context, prefix) {
      return dispatchIterableByMode(parser.$mode, () => suggestSync(context, prefix), () => suggestAsync(context, prefix));
    },
    getDocFragments(state, defaultValue) {
      const innerState = state.kind === "unavailable" ? { kind: "unavailable" } : state.state === undefined ? { kind: "unavailable" } : {
        kind: "available",
        state: state.state[0]
      };
      return syncParser.getDocFragments(innerState, defaultValue);
    }
  };
}
var WithDefaultError = class extends Error {
  errorMessage;
  constructor(message$1) {
    super(formatMessage(message$1));
    this.errorMessage = message$1;
    this.name = "WithDefaultError";
  }
};
function withDefault(parser, defaultValue, options) {
  const syncParser = parser;
  function* suggestSync(context, prefix) {
    const innerState = typeof context.state === "undefined" ? syncParser.initialState : context.state[0];
    yield* syncParser.suggest({
      ...context,
      state: innerState
    }, prefix);
  }
  async function* suggestAsync(context, prefix) {
    const innerState = typeof context.state === "undefined" ? syncParser.initialState : context.state[0];
    const suggestions = parser.suggest({
      ...context,
      state: innerState
    }, prefix);
    for await (const s of suggestions)
      yield s;
  }
  const innerInitialState = syncParser.initialState;
  const wrappedDependencyMarker = isPendingDependencySourceState(innerInitialState) ? { [wrappedDependencySourceMarker]: innerInitialState } : isWrappedDependencySource(parser) ? { [wrappedDependencySourceMarker]: parser[wrappedDependencySourceMarker] } : {};
  return {
    $mode: parser.$mode,
    $valueType: [],
    $stateType: [],
    priority: parser.priority,
    usage: [{
      type: "optional",
      terms: parser.usage
    }],
    initialState: undefined,
    ...wrappedDependencyMarker,
    parse(context) {
      return dispatchByMode(parser.$mode, () => parseOptionalStyleSync(context, syncParser), () => parseOptionalStyleAsync(context, parser));
    },
    complete(state) {
      if (typeof state === "undefined") {
        if (transformsDependencyValue(parser)) {
          const innerResult = dispatchByMode(parser.$mode, () => syncParser.complete(undefined), () => parser.complete(undefined));
          const handleInnerResult = (res) => {
            if (isDependencySourceState(res))
              try {
                const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
                return createDependencySourceState({
                  success: true,
                  value: value2
                }, res[dependencyId]);
              } catch (error) {
                return {
                  success: false,
                  error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
                };
              }
            try {
              const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
              return {
                success: true,
                value: value2
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
              };
            }
          };
          if (innerResult instanceof Promise)
            return innerResult.then(handleInnerResult);
          return handleInnerResult(innerResult);
        }
        if (isWrappedDependencySource(parser))
          try {
            const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
            const pendingState = parser[wrappedDependencySourceMarker];
            return createDependencySourceState({
              success: true,
              value: value2
            }, pendingState[dependencyId]);
          } catch (error) {
            return {
              success: false,
              error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
            };
          }
        try {
          const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
          return {
            success: true,
            value: value2
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
          };
        }
      }
      if (isPendingDependencySourceState(state[0])) {
        if (transformsDependencyValue(parser)) {
          const innerResult = dispatchByMode(parser.$mode, () => syncParser.complete(state), () => parser.complete(state));
          const handleInnerResult = (res) => {
            if (isDependencySourceState(res))
              try {
                const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
                return createDependencySourceState({
                  success: true,
                  value: value2
                }, res[dependencyId]);
              } catch (error) {
                return {
                  success: false,
                  error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
                };
              }
            try {
              const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
              return {
                success: true,
                value: value2
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
              };
            }
          };
          if (innerResult instanceof Promise)
            return innerResult.then(handleInnerResult);
          return handleInnerResult(innerResult);
        }
        try {
          const value2 = typeof defaultValue === "function" ? defaultValue() : defaultValue;
          return createDependencySourceState({
            success: true,
            value: value2
          }, state[0][dependencyId]);
        } catch (error) {
          return {
            success: false,
            error: error instanceof WithDefaultError ? error.errorMessage : message`${text(String(error))}`
          };
        }
      }
      return dispatchByMode(parser.$mode, () => syncParser.complete(state[0]), () => parser.complete(state[0]));
    },
    suggest(context, prefix) {
      return dispatchIterableByMode(parser.$mode, () => suggestSync(context, prefix), () => suggestAsync(context, prefix));
    },
    getDocFragments(state, upperDefaultValue) {
      const innerState = state.kind === "unavailable" ? { kind: "unavailable" } : state.state === undefined ? { kind: "unavailable" } : {
        kind: "available",
        state: state.state[0]
      };
      const actualDefaultValue = upperDefaultValue != null ? upperDefaultValue : typeof defaultValue === "function" ? defaultValue() : defaultValue;
      const fragments = syncParser.getDocFragments(innerState, actualDefaultValue);
      if (options?.message) {
        const modifiedFragments = fragments.fragments.map((fragment) => {
          if (fragment.type === "entry")
            return {
              ...fragment,
              default: options.message
            };
          return fragment;
        });
        return {
          ...fragments,
          fragments: modifiedFragments
        };
      }
      return fragments;
    }
  };
}
function multiple(parser, options = {}) {
  const syncParser = parser;
  const { min = 0, max = Infinity } = options;
  const parseSync = (context) => {
    let added = context.state.length < 1;
    let result = syncParser.parse({
      ...context,
      state: context.state.at(-1) ?? syncParser.initialState
    });
    if (!result.success)
      if (!added) {
        result = syncParser.parse({
          ...context,
          state: syncParser.initialState
        });
        if (!result.success)
          return result;
        added = true;
      } else
        return result;
    return {
      success: true,
      next: {
        ...result.next,
        state: [...added ? context.state : context.state.slice(0, -1), result.next.state]
      },
      consumed: result.consumed
    };
  };
  const parseAsync = async (context) => {
    let added = context.state.length < 1;
    let resultOrPromise = parser.parse({
      ...context,
      state: context.state.at(-1) ?? parser.initialState
    });
    let result = await resultOrPromise;
    if (!result.success)
      if (!added) {
        resultOrPromise = parser.parse({
          ...context,
          state: parser.initialState
        });
        result = await resultOrPromise;
        if (!result.success)
          return result;
        added = true;
      } else
        return result;
    return {
      success: true,
      next: {
        ...result.next,
        state: [...added ? context.state : context.state.slice(0, -1), result.next.state]
      },
      consumed: result.consumed
    };
  };
  const resultParser = {
    $mode: parser.$mode,
    $valueType: [],
    $stateType: [],
    priority: parser.priority,
    usage: [{
      type: "multiple",
      terms: parser.usage,
      min
    }],
    initialState: [],
    parse(context) {
      return dispatchByMode(parser.$mode, () => parseSync(context), () => parseAsync(context));
    },
    complete(state) {
      return dispatchByMode(parser.$mode, () => {
        const result = [];
        for (const s of state) {
          const valueResult = syncParser.complete(s);
          if (valueResult.success)
            result.push(valueResult.value);
          else
            return {
              success: false,
              error: valueResult.error
            };
        }
        return validateMultipleResult(result);
      }, async () => {
        const results = await Promise.all(state.map((s) => parser.complete(s)));
        const values2 = [];
        for (const valueResult of results)
          if (valueResult.success)
            values2.push(valueResult.value);
          else
            return {
              success: false,
              error: valueResult.error
            };
        return validateMultipleResult(values2);
      });
    },
    suggest(context, prefix) {
      const selectedValues = /* @__PURE__ */ new Set;
      for (const s of context.state) {
        const completed = syncParser.complete(s);
        if (completed.success) {
          const valueStr = String(completed.value);
          selectedValues.add(valueStr);
        }
      }
      const shouldInclude = (suggestion) => {
        if (suggestion.kind === "literal")
          return !selectedValues.has(suggestion.text);
        return true;
      };
      return dispatchIterableByMode(parser.$mode, function* () {
        for (const s of syncParser.suggest({
          ...context,
          state: parser.initialState
        }, prefix))
          if (shouldInclude(s))
            yield s;
      }, async function* () {
        const suggestions = parser.suggest({
          ...context,
          state: parser.initialState
        }, prefix);
        for await (const s of suggestions)
          if (shouldInclude(s))
            yield s;
      });
    },
    getDocFragments(state, defaultValue) {
      const innerState = state.kind === "unavailable" ? { kind: "unavailable" } : state.state.length > 0 ? {
        kind: "available",
        state: state.state.at(-1)
      } : { kind: "unavailable" };
      return syncParser.getDocFragments(innerState, defaultValue != null && defaultValue.length > 0 ? defaultValue[0] : undefined);
    }
  };
  function validateMultipleResult(result) {
    if (result.length < min) {
      const customMessage = options.errors?.tooFew;
      return {
        success: false,
        error: customMessage ? typeof customMessage === "function" ? customMessage(min, result.length) : customMessage : message`Expected at least ${text(min.toLocaleString("en"))} values, but got only ${text(result.length.toLocaleString("en"))}.`
      };
    } else if (result.length > max) {
      const customMessage = options.errors?.tooMany;
      return {
        success: false,
        error: customMessage ? typeof customMessage === "function" ? customMessage(max, result.length) : customMessage : message`Expected at most ${text(max.toLocaleString("en"))} values, but got ${text(result.length.toLocaleString("en"))}.`
      };
    }
    return {
      success: true,
      value: result
    };
  }
  return resultParser;
}

// node_modules/@optique/core/dist/nonempty.js
function ensureNonEmptyString(value2) {
  if (value2 === "")
    throw new TypeError("Expected a non-empty string.");
}

// node_modules/@optique/core/dist/valueparser.js
function isValueParser(object2) {
  return typeof object2 === "object" && object2 != null && "$mode" in object2 && (object2.$mode === "sync" || object2.$mode === "async") && "metavar" in object2 && typeof object2.metavar === "string" && "parse" in object2 && typeof object2.parse === "function" && "format" in object2 && typeof object2.format === "function";
}
function string(options = {}) {
  const metavar2 = options.metavar ?? "STRING";
  ensureNonEmptyString(metavar2);
  return {
    $mode: "sync",
    metavar: metavar2,
    parse(input) {
      if (options.pattern != null && !options.pattern.test(input))
        return {
          success: false,
          error: options.errors?.patternMismatch ? typeof options.errors.patternMismatch === "function" ? options.errors.patternMismatch(input, options.pattern) : options.errors.patternMismatch : message`Expected a string matching pattern ${text(options.pattern.source)}, but got ${input}.`
        };
      return {
        success: true,
        value: input
      };
    },
    format(value2) {
      return value2;
    }
  };
}

// node_modules/@optique/core/dist/primitives.js
function createOptionParseState(rawInput, valueParser, parseResult) {
  if (isDerivedValueParser(valueParser))
    return createDeferredParseState(rawInput, valueParser, parseResult);
  if (isDependencySource(valueParser))
    return createDependencySourceState(parseResult, valueParser[dependencyId]);
  return parseResult;
}
function constant(value2) {
  return {
    $valueType: [],
    $stateType: [],
    $mode: "sync",
    priority: 0,
    usage: [],
    initialState: value2,
    parse(context) {
      return {
        success: true,
        next: context,
        consumed: []
      };
    },
    complete(state) {
      return {
        success: true,
        value: state
      };
    },
    suggest(_context, _prefix) {
      return [];
    },
    getDocFragments(_state, _defaultValue) {
      return { fragments: [] };
    }
  };
}
function* getSuggestionsWithDependency(valueParser, prefix, dependencyRegistry) {
  if (!valueParser.suggest)
    return;
  if (isDerivedValueParser(valueParser) && suggestWithDependency in valueParser) {
    const derived = valueParser;
    const suggestWithDep = derived[suggestWithDependency];
    if (suggestWithDep && dependencyRegistry) {
      const depIds = getDependencyIds(derived);
      const defaultsFn = getDefaultValuesFunction(derived);
      const defaults = defaultsFn?.();
      const dependencyValues = [];
      let hasAnyValue = false;
      for (let i = 0;i < depIds.length; i++) {
        const depId = depIds[i];
        if (dependencyRegistry.has(depId)) {
          dependencyValues.push(dependencyRegistry.get(depId));
          hasAnyValue = true;
        } else if (defaults && i < defaults.length)
          dependencyValues.push(defaults[i]);
        else {
          yield* valueParser.suggest(prefix);
          return;
        }
      }
      if (hasAnyValue) {
        const depValue = depIds.length === 1 ? dependencyValues[0] : dependencyValues;
        yield* suggestWithDep(prefix, depValue);
        return;
      }
    }
  }
  yield* valueParser.suggest(prefix);
}
function* suggestOptionSync(optionNames$1, valueParser, hidden, context, prefix) {
  if (hidden)
    return;
  const equalsIndex = prefix.indexOf("=");
  if (equalsIndex >= 0) {
    const optionPart = prefix.slice(0, equalsIndex);
    const valuePart = prefix.slice(equalsIndex + 1);
    if (optionNames$1.includes(optionPart)) {
      if (valueParser && valueParser.suggest) {
        const valueSuggestions = getSuggestionsWithDependency(valueParser, valuePart, context.dependencyRegistry);
        for (const suggestion of valueSuggestions)
          if (suggestion.kind === "literal")
            yield {
              kind: "literal",
              text: `${optionPart}=${suggestion.text}`,
              description: suggestion.description
            };
          else
            yield {
              kind: "literal",
              text: `${optionPart}=${suggestion.pattern || ""}`,
              description: suggestion.description
            };
      }
    }
  } else {
    if (prefix.startsWith("--") || prefix.startsWith("-") || prefix.startsWith("/")) {
      for (const optionName$1 of optionNames$1)
        if (optionName$1.startsWith(prefix)) {
          if (prefix === "-" && optionName$1.length !== 2)
            continue;
          yield {
            kind: "literal",
            text: optionName$1
          };
        }
    }
    if (valueParser && valueParser.suggest) {
      let shouldSuggestValues = false;
      if (context.buffer.length > 0) {
        const lastToken = context.buffer[context.buffer.length - 1];
        if (optionNames$1.includes(lastToken))
          shouldSuggestValues = true;
      } else if (context.state === undefined && context.buffer.length === 0)
        shouldSuggestValues = true;
      if (shouldSuggestValues)
        yield* getSuggestionsWithDependency(valueParser, prefix, context.dependencyRegistry);
    }
  }
}
async function* getSuggestionsWithDependencyAsync(valueParser, prefix, dependencyRegistry) {
  if (!valueParser.suggest)
    return;
  if (isDerivedValueParser(valueParser) && suggestWithDependency in valueParser) {
    const derived = valueParser;
    const suggestWithDep = derived[suggestWithDependency];
    if (suggestWithDep && dependencyRegistry) {
      const depIds = getDependencyIds(derived);
      const defaultsFn = getDefaultValuesFunction(derived);
      const defaults = defaultsFn?.();
      const dependencyValues = [];
      let hasAnyValue = false;
      for (let i = 0;i < depIds.length; i++) {
        const depId = depIds[i];
        if (dependencyRegistry.has(depId)) {
          dependencyValues.push(dependencyRegistry.get(depId));
          hasAnyValue = true;
        } else if (defaults && i < defaults.length)
          dependencyValues.push(defaults[i]);
        else {
          for await (const suggestion of valueParser.suggest(prefix))
            yield suggestion;
          return;
        }
      }
      if (hasAnyValue) {
        const depValue = depIds.length === 1 ? dependencyValues[0] : dependencyValues;
        for await (const suggestion of suggestWithDep(prefix, depValue))
          yield suggestion;
        return;
      }
    }
  }
  for await (const suggestion of valueParser.suggest(prefix))
    yield suggestion;
}
async function* suggestOptionAsync(optionNames$1, valueParser, hidden, context, prefix) {
  if (hidden)
    return;
  const equalsIndex = prefix.indexOf("=");
  if (equalsIndex >= 0) {
    const optionPart = prefix.slice(0, equalsIndex);
    const valuePart = prefix.slice(equalsIndex + 1);
    if (optionNames$1.includes(optionPart)) {
      if (valueParser && valueParser.suggest) {
        const valueSuggestions = getSuggestionsWithDependencyAsync(valueParser, valuePart, context.dependencyRegistry);
        for await (const suggestion of valueSuggestions)
          if (suggestion.kind === "literal")
            yield {
              kind: "literal",
              text: `${optionPart}=${suggestion.text}`,
              description: suggestion.description
            };
          else
            yield {
              kind: "literal",
              text: `${optionPart}=${suggestion.pattern || ""}`,
              description: suggestion.description
            };
      }
    }
  } else {
    if (prefix.startsWith("--") || prefix.startsWith("-") || prefix.startsWith("/")) {
      for (const optionName$1 of optionNames$1)
        if (optionName$1.startsWith(prefix)) {
          if (prefix === "-" && optionName$1.length !== 2)
            continue;
          yield {
            kind: "literal",
            text: optionName$1
          };
        }
    }
    if (valueParser && valueParser.suggest) {
      let shouldSuggestValues = false;
      if (context.buffer.length > 0) {
        const lastToken = context.buffer[context.buffer.length - 1];
        if (optionNames$1.includes(lastToken))
          shouldSuggestValues = true;
      } else if (context.state === undefined && context.buffer.length === 0)
        shouldSuggestValues = true;
      if (shouldSuggestValues)
        for await (const suggestion of getSuggestionsWithDependencyAsync(valueParser, prefix, context.dependencyRegistry))
          yield suggestion;
    }
  }
}
function* suggestArgumentSync(valueParser, hidden, prefix, dependencyRegistry) {
  if (hidden)
    return;
  if (valueParser.suggest)
    yield* getSuggestionsWithDependency(valueParser, prefix, dependencyRegistry);
}
async function* suggestArgumentAsync(valueParser, hidden, prefix, dependencyRegistry) {
  if (hidden)
    return;
  if (valueParser.suggest)
    yield* getSuggestionsWithDependencyAsync(valueParser, prefix, dependencyRegistry);
}
function option(...args) {
  const lastArg = args.at(-1);
  const secondLastArg = args.at(-2);
  let valueParser;
  let optionNames$1;
  let options = {};
  if (isValueParser(lastArg)) {
    valueParser = lastArg;
    optionNames$1 = args.slice(0, -1);
  } else if (typeof lastArg === "object" && lastArg != null) {
    options = lastArg;
    if (isValueParser(secondLastArg)) {
      valueParser = secondLastArg;
      optionNames$1 = args.slice(0, -2);
    } else {
      valueParser = undefined;
      optionNames$1 = args.slice(0, -1);
    }
  } else {
    optionNames$1 = args;
    valueParser = undefined;
  }
  const mode = valueParser?.$mode ?? "sync";
  const isAsync = mode === "async";
  const result = {
    $mode: mode,
    $valueType: [],
    $stateType: [],
    priority: 10,
    usage: [valueParser == null ? {
      type: "optional",
      terms: [{
        type: "option",
        names: optionNames$1,
        ...options.hidden && { hidden: true }
      }]
    } : {
      type: "option",
      names: optionNames$1,
      metavar: valueParser.metavar,
      ...options.hidden && { hidden: true }
    }],
    initialState: valueParser == null ? {
      success: true,
      value: false
    } : isDependencySource(valueParser) ? createPendingDependencySourceState(valueParser[dependencyId]) : {
      success: false,
      error: options.errors?.missing ? typeof options.errors.missing === "function" ? options.errors.missing(optionNames$1) : options.errors.missing : message`Missing option ${optionNames(optionNames$1)}.`
    },
    parse(context) {
      if (context.optionsTerminated)
        return {
          success: false,
          consumed: 0,
          error: options.errors?.optionsTerminated ?? message`No more options can be parsed.`
        };
      else if (context.buffer.length < 1)
        return {
          success: false,
          consumed: 0,
          error: options.errors?.endOfInput ?? message`Expected an option, but got end of input.`
        };
      if (context.buffer[0] === "--")
        return {
          success: true,
          next: {
            ...context,
            buffer: context.buffer.slice(1),
            state: context.state,
            optionsTerminated: true
          },
          consumed: context.buffer.slice(0, 1)
        };
      if (optionNames$1.includes(context.buffer[0])) {
        const hasValue = valueParser != null ? context.state?.success || isDeferredParseState(context.state) || isDependencySourceState(context.state) : context.state?.success && context.state?.value;
        if (hasValue)
          return {
            success: false,
            consumed: 1,
            error: options.errors?.duplicate ? typeof options.errors.duplicate === "function" ? options.errors.duplicate(context.buffer[0]) : options.errors.duplicate : message`${optionName(context.buffer[0])} cannot be used multiple times.`
          };
        if (valueParser == null)
          return {
            success: true,
            next: {
              ...context,
              state: {
                success: true,
                value: true
              },
              buffer: context.buffer.slice(1)
            },
            consumed: context.buffer.slice(0, 1)
          };
        if (context.buffer.length < 2)
          return {
            success: false,
            consumed: 1,
            error: message`Option ${optionName(context.buffer[0])} requires a value, but got no value.`
          };
        const rawInput = context.buffer[1];
        const parseResultOrPromise = valueParser.parse(rawInput);
        if (isAsync)
          return parseResultOrPromise.then((parseResult) => ({
            success: true,
            next: {
              ...context,
              state: createOptionParseState(rawInput, valueParser, parseResult),
              buffer: context.buffer.slice(2)
            },
            consumed: context.buffer.slice(0, 2)
          }));
        return {
          success: true,
          next: {
            ...context,
            state: createOptionParseState(rawInput, valueParser, parseResultOrPromise),
            buffer: context.buffer.slice(2)
          },
          consumed: context.buffer.slice(0, 2)
        };
      }
      const prefixes = optionNames$1.filter((name) => name.startsWith("--") || name.startsWith("/")).map((name) => name.startsWith("/") ? `${name}:` : `${name}=`);
      for (const prefix of prefixes) {
        if (!context.buffer[0].startsWith(prefix))
          continue;
        if (context.state?.success && (valueParser != null || context.state.value))
          return {
            success: false,
            consumed: 1,
            error: options.errors?.duplicate ? typeof options.errors.duplicate === "function" ? options.errors.duplicate(prefix) : options.errors.duplicate : message`${optionName(prefix)} cannot be used multiple times.`
          };
        const rawInput = context.buffer[0].slice(prefix.length);
        if (valueParser == null)
          return {
            success: false,
            consumed: 1,
            error: options.errors?.unexpectedValue ? typeof options.errors.unexpectedValue === "function" ? options.errors.unexpectedValue(rawInput) : options.errors.unexpectedValue : message`Option ${optionName(prefix)} is a Boolean flag, but got a value: ${rawInput}.`
          };
        const parseResultOrPromise = valueParser.parse(rawInput);
        if (isAsync)
          return parseResultOrPromise.then((parseResult) => ({
            success: true,
            next: {
              ...context,
              state: createOptionParseState(rawInput, valueParser, parseResult),
              buffer: context.buffer.slice(1)
            },
            consumed: context.buffer.slice(0, 1)
          }));
        return {
          success: true,
          next: {
            ...context,
            state: createOptionParseState(rawInput, valueParser, parseResultOrPromise),
            buffer: context.buffer.slice(1)
          },
          consumed: context.buffer.slice(0, 1)
        };
      }
      if (valueParser == null) {
        const shortOptions = optionNames$1.filter((name) => name.match(/^-[^-]$/));
        for (const shortOption of shortOptions) {
          if (!context.buffer[0].startsWith(shortOption))
            continue;
          if (context.state?.success && (valueParser != null || context.state.value))
            return {
              success: false,
              consumed: 1,
              error: options.errors?.duplicate ? typeof options.errors.duplicate === "function" ? options.errors.duplicate(shortOption) : options.errors.duplicate : message`${optionName(shortOption)} cannot be used multiple times.`
            };
          return {
            success: true,
            next: {
              ...context,
              state: {
                success: true,
                value: true
              },
              buffer: [`-${context.buffer[0].slice(2)}`, ...context.buffer.slice(1)]
            },
            consumed: [context.buffer[0].slice(0, 2)]
          };
        }
      }
      const invalidOption = context.buffer[0];
      if (options.errors?.noMatch) {
        const candidates = /* @__PURE__ */ new Set;
        for (const name of extractOptionNames(context.usage))
          candidates.add(name);
        const suggestions = findSimilar(invalidOption, candidates, DEFAULT_FIND_SIMILAR_OPTIONS);
        const errorMessage = typeof options.errors.noMatch === "function" ? options.errors.noMatch(invalidOption, suggestions) : options.errors.noMatch;
        return {
          success: false,
          consumed: 0,
          error: errorMessage
        };
      }
      const baseError = message`No matched option for ${optionName(invalidOption)}.`;
      return {
        success: false,
        consumed: 0,
        error: createErrorWithSuggestions(baseError, invalidOption, context.usage, "option")
      };
    },
    complete(state) {
      if (state == null)
        return valueParser == null ? {
          success: true,
          value: false
        } : {
          success: false,
          error: options.errors?.missing ? typeof options.errors.missing === "function" ? options.errors.missing(optionNames$1) : options.errors.missing : message`Missing option ${optionNames(optionNames$1)}.`
        };
      if (isPendingDependencySourceState(state))
        return {
          success: false,
          error: options.errors?.missing ? typeof options.errors.missing === "function" ? options.errors.missing(optionNames$1) : options.errors.missing : message`Missing option ${optionNames(optionNames$1)}.`
        };
      if (isDeferredParseState(state)) {
        const preliminaryResult = state.preliminaryResult;
        if (preliminaryResult.success)
          return preliminaryResult;
        return {
          success: false,
          error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(preliminaryResult.error) : options.errors.invalidValue : message`${optionNames(optionNames$1)}: ${preliminaryResult.error}`
        };
      }
      if (isDependencySourceState(state)) {
        const result$1 = state.result;
        if (result$1.success)
          return result$1;
        return {
          success: false,
          error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(result$1.error) : options.errors.invalidValue : message`${optionNames(optionNames$1)}: ${result$1.error}`
        };
      }
      if (state.success)
        return state;
      return {
        success: false,
        error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(state.error) : options.errors.invalidValue : message`${optionNames(optionNames$1)}: ${state.error}`
      };
    },
    suggest(context, prefix) {
      if (isAsync)
        return suggestOptionAsync(optionNames$1, valueParser, options.hidden ?? false, context, prefix);
      return suggestOptionSync(optionNames$1, valueParser, options.hidden ?? false, context, prefix);
    },
    getDocFragments(_state, defaultValue) {
      if (options.hidden)
        return {
          fragments: [],
          description: options.description
        };
      const choicesMessage = valueParser?.choices != null && valueParser.choices.length > 0 ? valueSet(valueParser.choices.map((c) => valueParser.format(c)), { type: "unit" }) : undefined;
      const fragments = [{
        type: "entry",
        term: {
          type: "option",
          names: optionNames$1,
          metavar: valueParser?.metavar
        },
        description: options.description,
        default: defaultValue != null && valueParser != null ? message`${valueParser.format(defaultValue)}` : undefined,
        choices: choicesMessage
      }];
      return {
        fragments,
        description: options.description
      };
    },
    [Symbol.for("Deno.customInspect")]() {
      return `option(${optionNames$1.map((o) => JSON.stringify(o)).join(", ")})`;
    }
  };
  return result;
}
function flag(...args) {
  const lastArg = args.at(-1);
  let optionNames$1;
  let options = {};
  if (typeof lastArg === "object" && lastArg != null && !Array.isArray(lastArg)) {
    options = lastArg;
    optionNames$1 = args.slice(0, -1);
  } else
    optionNames$1 = args;
  return {
    $valueType: [],
    $stateType: [],
    $mode: "sync",
    priority: 10,
    usage: [{
      type: "option",
      names: optionNames$1,
      ...options.hidden && { hidden: true }
    }],
    initialState: undefined,
    parse(context) {
      if (context.optionsTerminated)
        return {
          success: false,
          consumed: 0,
          error: options.errors?.optionsTerminated ?? message`No more options can be parsed.`
        };
      else if (context.buffer.length < 1)
        return {
          success: false,
          consumed: 0,
          error: options.errors?.endOfInput ?? message`Expected an option, but got end of input.`
        };
      if (context.buffer[0] === "--")
        return {
          success: true,
          next: {
            ...context,
            buffer: context.buffer.slice(1),
            state: context.state,
            optionsTerminated: true
          },
          consumed: context.buffer.slice(0, 1)
        };
      if (optionNames$1.includes(context.buffer[0])) {
        if (context.state?.success)
          return {
            success: false,
            consumed: 1,
            error: options.errors?.duplicate ? typeof options.errors.duplicate === "function" ? options.errors.duplicate(context.buffer[0]) : options.errors.duplicate : message`${optionName(context.buffer[0])} cannot be used multiple times.`
          };
        return {
          success: true,
          next: {
            ...context,
            state: {
              success: true,
              value: true
            },
            buffer: context.buffer.slice(1)
          },
          consumed: context.buffer.slice(0, 1)
        };
      }
      const prefixes = optionNames$1.filter((name) => name.startsWith("--") || name.startsWith("/")).map((name) => name.startsWith("/") ? `${name}:` : `${name}=`);
      for (const prefix of prefixes)
        if (context.buffer[0].startsWith(prefix)) {
          const value2 = context.buffer[0].slice(prefix.length);
          return {
            success: false,
            consumed: 1,
            error: message`Flag ${optionName(prefix.slice(0, -1))} does not accept a value, but got: ${value2}.`
          };
        }
      const shortOptions = optionNames$1.filter((name) => name.match(/^-[^-]$/));
      for (const shortOption of shortOptions) {
        if (!context.buffer[0].startsWith(shortOption))
          continue;
        if (context.state?.success)
          return {
            success: false,
            consumed: 1,
            error: options.errors?.duplicate ? typeof options.errors.duplicate === "function" ? options.errors.duplicate(shortOption) : options.errors.duplicate : message`${optionName(shortOption)} cannot be used multiple times.`
          };
        return {
          success: true,
          next: {
            ...context,
            state: {
              success: true,
              value: true
            },
            buffer: [`-${context.buffer[0].slice(2)}`, ...context.buffer.slice(1)]
          },
          consumed: [context.buffer[0].slice(0, 2)]
        };
      }
      const invalidOption = context.buffer[0];
      if (options.errors?.noMatch) {
        const candidates = /* @__PURE__ */ new Set;
        for (const name of extractOptionNames(context.usage))
          candidates.add(name);
        const suggestions = findSimilar(invalidOption, candidates, DEFAULT_FIND_SIMILAR_OPTIONS);
        const errorMessage = typeof options.errors.noMatch === "function" ? options.errors.noMatch(invalidOption, suggestions) : options.errors.noMatch;
        return {
          success: false,
          consumed: 0,
          error: errorMessage
        };
      }
      const baseError = message`No matched option for ${optionName(invalidOption)}.`;
      return {
        success: false,
        consumed: 0,
        error: createErrorWithSuggestions(baseError, invalidOption, context.usage, "option")
      };
    },
    complete(state) {
      if (state == null)
        return {
          success: false,
          error: options.errors?.missing ? typeof options.errors.missing === "function" ? options.errors.missing(optionNames$1) : options.errors.missing : message`Required flag ${optionNames(optionNames$1)} is missing.`
        };
      if (state.success)
        return {
          success: true,
          value: true
        };
      return {
        success: false,
        error: message`${optionNames(optionNames$1)}: ${state.error}`
      };
    },
    suggest(_context, prefix) {
      if (options.hidden)
        return [];
      const suggestions = [];
      if (prefix.startsWith("--") || prefix.startsWith("-") || prefix.startsWith("/")) {
        for (const optionName$1 of optionNames$1)
          if (optionName$1.startsWith(prefix)) {
            if (prefix === "-" && optionName$1.length !== 2)
              continue;
            suggestions.push({
              kind: "literal",
              text: optionName$1
            });
          }
      }
      return suggestions;
    },
    getDocFragments(_state, _defaultValue) {
      if (options.hidden)
        return {
          fragments: [],
          description: options.description
        };
      const fragments = [{
        type: "entry",
        term: {
          type: "option",
          names: optionNames$1
        },
        description: options.description
      }];
      return {
        fragments,
        description: options.description
      };
    },
    [Symbol.for("Deno.customInspect")]() {
      return `flag(${optionNames$1.map((o) => JSON.stringify(o)).join(", ")})`;
    }
  };
}
function argument(valueParser, options = {}) {
  const isAsync = valueParser.$mode === "async";
  const optionPattern = /^--?[a-z0-9-]+$/i;
  const term = {
    type: "argument",
    metavar: valueParser.metavar,
    ...options.hidden && { hidden: true }
  };
  const result = {
    $mode: valueParser.$mode,
    $valueType: [],
    $stateType: [],
    priority: 5,
    usage: [term],
    initialState: undefined,
    parse(context) {
      if (context.buffer.length < 1)
        return {
          success: false,
          consumed: 0,
          error: options.errors?.endOfInput ?? message`Expected an argument, but got end of input.`
        };
      let i = 0;
      let optionsTerminated = context.optionsTerminated;
      if (!optionsTerminated) {
        if (context.buffer[i] === "--") {
          optionsTerminated = true;
          i++;
        } else if (context.buffer[i].match(optionPattern))
          return {
            success: false,
            consumed: i,
            error: message`Expected an argument, but got an option: ${optionName(context.buffer[i])}.`
          };
      }
      if (context.buffer.length < i + 1)
        return {
          success: false,
          consumed: i,
          error: message`Expected an argument, but got end of input.`
        };
      if (context.state != null)
        return {
          success: false,
          consumed: i,
          error: options.errors?.multiple ? typeof options.errors.multiple === "function" ? options.errors.multiple(valueParser.metavar) : options.errors.multiple : message`The argument ${metavar(valueParser.metavar)} cannot be used multiple times.`
        };
      const rawInput = context.buffer[i];
      const parseResultOrPromise = valueParser.parse(rawInput);
      if (isAsync)
        return parseResultOrPromise.then((parseResult) => ({
          success: true,
          next: {
            ...context,
            buffer: context.buffer.slice(i + 1),
            state: createOptionParseState(rawInput, valueParser, parseResult),
            optionsTerminated
          },
          consumed: context.buffer.slice(0, i + 1)
        }));
      return {
        success: true,
        next: {
          ...context,
          buffer: context.buffer.slice(i + 1),
          state: createOptionParseState(rawInput, valueParser, parseResultOrPromise),
          optionsTerminated
        },
        consumed: context.buffer.slice(0, i + 1)
      };
    },
    complete(state) {
      if (state == null)
        return {
          success: false,
          error: options.errors?.endOfInput ?? message`Expected a ${metavar(valueParser.metavar)}, but too few arguments.`
        };
      if (isDeferredParseState(state)) {
        const preliminaryResult = state.preliminaryResult;
        if (preliminaryResult.success)
          return preliminaryResult;
        return {
          success: false,
          error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(preliminaryResult.error) : options.errors.invalidValue : message`${metavar(valueParser.metavar)}: ${preliminaryResult.error}`
        };
      }
      if (isDependencySourceState(state)) {
        const result$1 = state.result;
        if (result$1.success)
          return result$1;
        return {
          success: false,
          error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(result$1.error) : options.errors.invalidValue : message`${metavar(valueParser.metavar)}: ${result$1.error}`
        };
      }
      if (state.success)
        return state;
      return {
        success: false,
        error: options.errors?.invalidValue ? typeof options.errors.invalidValue === "function" ? options.errors.invalidValue(state.error) : options.errors.invalidValue : message`${metavar(valueParser.metavar)}: ${state.error}`
      };
    },
    suggest(context, prefix) {
      if (context.state != null)
        return dispatchIterableByMode(valueParser.$mode, function* () {
        }, async function* () {
        });
      if (isAsync)
        return suggestArgumentAsync(valueParser, options.hidden ?? false, prefix, context.dependencyRegistry);
      return suggestArgumentSync(valueParser, options.hidden ?? false, prefix, context.dependencyRegistry);
    },
    getDocFragments(_state, defaultValue) {
      if (options.hidden)
        return {
          fragments: [],
          description: options.description
        };
      const choicesMessage = valueParser.choices != null && valueParser.choices.length > 0 ? valueSet(valueParser.choices.map((c) => valueParser.format(c)), { type: "unit" }) : undefined;
      const fragments = [{
        type: "entry",
        term,
        description: options.description,
        default: defaultValue == null ? undefined : message`${valueParser.format(defaultValue)}`,
        choices: choicesMessage
      }];
      return {
        fragments,
        description: options.description
      };
    },
    [Symbol.for("Deno.customInspect")]() {
      return `argument()`;
    }
  };
  return result;
}
function* suggestCommandSync(context, prefix, name, parser, options) {
  if (options.hidden)
    return;
  if (context.state === undefined) {
    if (name.startsWith(prefix))
      yield {
        kind: "literal",
        text: name,
        ...options.description && { description: options.description }
      };
  } else if (context.state[0] === "matched")
    yield* parser.suggest({
      ...context,
      state: parser.initialState
    }, prefix);
  else if (context.state[0] === "parsing")
    yield* parser.suggest({
      ...context,
      state: context.state[1]
    }, prefix);
}
async function* suggestCommandAsync(context, prefix, name, parser, options) {
  if (options.hidden)
    return;
  if (context.state === undefined) {
    if (name.startsWith(prefix))
      yield {
        kind: "literal",
        text: name,
        ...options.description && { description: options.description }
      };
  } else if (context.state[0] === "matched") {
    const suggestions = parser.suggest({
      ...context,
      state: parser.initialState
    }, prefix);
    for await (const s of suggestions)
      yield s;
  } else if (context.state[0] === "parsing") {
    const suggestions = parser.suggest({
      ...context,
      state: context.state[1]
    }, prefix);
    for await (const s of suggestions)
      yield s;
  }
}
function command(name, parser, options = {}) {
  const isAsync = parser.$mode === "async";
  const result = {
    $mode: parser.$mode,
    $valueType: [],
    $stateType: [],
    priority: 15,
    usage: [{
      type: "command",
      name,
      ...options.hidden && { hidden: true }
    }, ...parser.usage],
    initialState: undefined,
    parse(context) {
      if (context.state === undefined) {
        if (context.buffer.length < 1 || context.buffer[0] !== name) {
          const actual = context.buffer.length > 0 ? context.buffer[0] : null;
          const leadingCmds = extractLeadingCommandNames(context.usage);
          const suggestions = actual ? findSimilar(actual, leadingCmds, DEFAULT_FIND_SIMILAR_OPTIONS) : [];
          if (options.errors?.notMatched) {
            const errorMessage = options.errors.notMatched;
            return {
              success: false,
              consumed: 0,
              error: typeof errorMessage === "function" ? errorMessage(name, actual, suggestions) : errorMessage
            };
          }
          if (actual == null)
            return {
              success: false,
              consumed: 0,
              error: message`Expected command ${optionName(name)}, but got end of input.`
            };
          const baseError = message`Expected command ${optionName(name)}, but got ${actual}.`;
          const suggestionMsg = createSuggestionMessage(suggestions);
          return {
            success: false,
            consumed: 0,
            error: suggestionMsg.length > 0 ? [
              ...baseError,
              text(`

`),
              ...suggestionMsg
            ] : baseError
          };
        }
        return {
          success: true,
          next: {
            ...context,
            buffer: context.buffer.slice(1),
            state: ["matched", name]
          },
          consumed: context.buffer.slice(0, 1)
        };
      } else if (context.state[0] === "matched" || context.state[0] === "parsing") {
        const innerState = context.state[0] === "matched" ? parser.initialState : context.state[1];
        const parseResultOrPromise = parser.parse({
          ...context,
          state: innerState
        });
        const wrapState = (parseResult) => {
          if (parseResult.success)
            return {
              success: true,
              next: {
                ...parseResult.next,
                state: ["parsing", parseResult.next.state]
              },
              consumed: parseResult.consumed
            };
          return parseResult;
        };
        if (isAsync)
          return parseResultOrPromise.then(wrapState);
        return wrapState(parseResultOrPromise);
      }
      return {
        success: false,
        consumed: 0,
        error: options.errors?.invalidState ?? message`Invalid command state.`
      };
    },
    complete(state) {
      if (typeof state === "undefined")
        return {
          success: false,
          error: options.errors?.notFound ?? message`Command ${optionName(name)} was not matched.`
        };
      else if (state[0] === "matched") {
        const parseResultOrPromise = parser.parse({
          buffer: [],
          optionsTerminated: false,
          usage: [],
          state: parser.initialState
        });
        if (isAsync)
          return parseResultOrPromise.then((parseResult$1) => {
            if (parseResult$1.success)
              return parser.complete(parseResult$1.next.state);
            return parser.complete(parser.initialState);
          });
        const parseResult = parseResultOrPromise;
        if (parseResult.success)
          return parser.complete(parseResult.next.state);
        return parser.complete(parser.initialState);
      } else if (state[0] === "parsing")
        return parser.complete(state[1]);
      return {
        success: false,
        error: options.errors?.invalidState ?? message`Invalid command state during completion.`
      };
    },
    suggest(context, prefix) {
      if (isAsync)
        return suggestCommandAsync(context, prefix, name, parser, options);
      return suggestCommandSync(context, prefix, name, parser, options);
    },
    getDocFragments(state, defaultValue) {
      if (state.kind === "unavailable" || typeof state.state === "undefined") {
        if (options.hidden)
          return {
            fragments: [],
            description: options.description
          };
        return {
          description: options.description,
          fragments: [{
            type: "entry",
            term: {
              type: "command",
              name
            },
            description: options.brief ?? options.description
          }]
        };
      }
      const innerState = state.state[0] === "parsing" ? {
        kind: "available",
        state: state.state[1]
      } : {
        kind: "available",
        state: parser.initialState
      };
      const innerFragments = parser.getDocFragments(innerState, defaultValue);
      return {
        ...innerFragments,
        brief: innerFragments.brief ?? options.brief,
        description: innerFragments.description ?? options.description,
        footer: innerFragments.footer ?? options.footer
      };
    },
    [Symbol.for("Deno.customInspect")]() {
      return `command(${JSON.stringify(name)})`;
    }
  };
  return result;
}

// node_modules/@optique/core/dist/program.js
function defineProgram(program) {
  return program;
}

// node_modules/@optique/core/dist/annotations.js
var annotationKey = Symbol.for("@optique/core/parser/annotation");

// node_modules/@optique/core/dist/completion.js
var SAFE_PROGRAM_NAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;
function validateProgramName(programName) {
  if (!SAFE_PROGRAM_NAME_PATTERN.test(programName))
    throw new Error(`Invalid program name for shell completion: "${programName}". Program names must contain only alphanumeric characters, underscores, hyphens, and dots.`);
}
var bash = {
  name: "bash",
  generateScript(programName, args = []) {
    validateProgramName(programName);
    const escapedArgs = args.map((arg) => `'${arg.replace(/'/g, "'\\''")}'`).join(" ");
    return `
function _${programName} () {
  COMPREPLY=()
  local current="\${COMP_WORDS[COMP_CWORD]}"
  local prev=("\${COMP_WORDS[@]:1:COMP_CWORD-1}")
  while IFS= read -r line; do
    if [[ "$line" == __FILE__:* ]]; then
      # Parse file completion directive: __FILE__:type:extensions:pattern:hidden
      IFS=':' read -r _ type extensions pattern hidden <<< "$line"

      # Generate file completions based on type
      case "$type" in
        file)
          # Complete files only
          if [[ -n "$extensions" ]]; then
            # Complete with extension filtering
            local ext_pattern="\${extensions//,/|}"
            for file in "$current"*; do
              [[ -e "$file" && "$file" =~ \\.($ext_pattern)$ ]] && COMPREPLY+=("$file")
            done
          else
            # Complete files only, exclude directories
            while IFS= read -r -d '' item; do
              [[ -f "$item" ]] && COMPREPLY+=("$item")
            done < <(compgen -f -z -- "$current")
          fi
          ;;
        directory)
          # Complete directories only
          while IFS= read -r -d '' dir; do
            COMPREPLY+=("$dir/")
          done < <(compgen -d -z -- "$current")
          ;;
        any)
          # Complete both files and directories
          if [[ -n "$extensions" ]]; then
            # Files with extension filtering + directories
            # Files with extension filtering
            local ext_pattern="\${extensions//,/|}"
            for item in "$current"*; do
              if [[ -d "$item" ]]; then
                COMPREPLY+=("$item/")
              elif [[ -f "$item" && "$item" =~ \\.($ext_pattern)$ ]]; then
                COMPREPLY+=("$item")
              fi
            done
          else
            # Complete files and directories, add slash to directories
            while IFS= read -r -d '' item; do
              if [[ -d "$item" ]]; then
                COMPREPLY+=("$item/")
              else
                COMPREPLY+=("$item")
              fi
            done < <(compgen -f -z -- "$current")
          fi
          ;;
      esac

      # Filter out hidden files unless requested
      if [[ "$hidden" != "1" && "$current" != .* ]]; then
        local filtered=()
        for item in "\${COMPREPLY[@]}"; do
          [[ "$(basename "$item")" != .* ]] && filtered+=("$item")
        done
        COMPREPLY=("\${filtered[@]}")
      fi
    else
      # Regular literal completion
      COMPREPLY+=("$line")
    fi
  done < <(${programName} ${escapedArgs} "\${prev[@]}" "$current" 2>/dev/null)
}

complete -F _${programName} ${programName}
    `;
  },
  *encodeSuggestions(suggestions) {
    let i = 0;
    for (const suggestion of suggestions) {
      if (i > 0)
        yield `
`;
      if (suggestion.kind === "literal")
        yield `${suggestion.text}`;
      else {
        const extensions = suggestion.extensions?.join(",") || "";
        const hidden = suggestion.includeHidden ? "1" : "0";
        yield `__FILE__:${suggestion.type}:${extensions}:${suggestion.pattern || ""}:${hidden}`;
      }
      i++;
    }
  }
};
var zsh = {
  name: "zsh",
  generateScript(programName, args = []) {
    validateProgramName(programName);
    const escapedArgs = args.map((arg) => `'${arg.replace(/'/g, "'\\''")}'`).join(" ");
    return `
function _${programName.replace(/[^a-zA-Z0-9]/g, "_")} () {
  local current="$words[CURRENT]"
  local -a prev
  # Extract previous arguments, skipping empty ones
  prev=()
  local i
  for (( i=2; i < CURRENT; i++ )); do
    if [[ -n "$words[i]" ]]; then
      prev+=("$words[i]")
    fi
  done

  # Call the completion function and capture output
  local output
  if (( \${#prev[@]} == 0 )); then
    output=$(${programName} ${escapedArgs} "$current" 2>/dev/null)
  else
    output=$(${programName} ${escapedArgs} "\${prev[@]}" "$current" 2>/dev/null)
  fi

  # Split output into lines and process each line
  local -a completions descriptions
  local line value desc
  local has_file_completion=0

  while IFS= read -r line; do
    if [[ -n "$line" ]]; then
      # Split by null character - first part is value, second is description
      value=\${line%%$'\\0'*}
      desc=\${line#*$'\\0'}
      desc=\${desc%%$'\\0'*}

      if [[ "$value" == __FILE__:* ]]; then
        # Parse file completion directive: __FILE__:type:extensions:pattern:hidden
        local type extensions pattern hidden
        IFS=':' read -r _ type extensions pattern hidden <<< "$value"
        has_file_completion=1

        # Use zsh's native file completion
        case "$type" in
          file)
            if [[ -n "$extensions" ]]; then
              # Complete files with extension filtering
              local ext_pattern="*.(\\\${extensions//,/|})"
              _files -g "\\$ext_pattern"
            else
              _files -g "*"
            fi
            ;;
          directory)
            _directories
            ;;
          any)
            if [[ -n "$extensions" ]]; then
              # Complete both files and directories, with extension filtering for files
              local ext_pattern="*.(\\\${extensions//,/|})"
              _files -g "\\$ext_pattern" && _directories
            else
              _files
            fi
            ;;
        esac

        # Note: zsh's _files and _directories handle hidden file filtering automatically
        # based on the completion context and user settings
      else
        # Regular literal completion
        if [[ -n "$value" ]]; then
          completions+=("$value")
          descriptions+=("$desc")
        fi
      fi
    fi
  done <<< "$output"

  # Add literal completions with descriptions if we have any
  if (( \${#completions[@]} > 0 )); then
    # Prepare completion with descriptions for _describe
    local -a matches
    local -i i
    for (( i=1; i <= \${#completions[@]}; i++ )); do
      if [[ -n "\${descriptions[i]}" ]]; then
        matches+=("\${completions[i]}:\${descriptions[i]}")
      else
        matches+=("\${completions[i]}")
      fi
    done
    _describe 'commands' matches
  fi
}

compdef _${programName.replace(/[^a-zA-Z0-9]/g, "_")} ${programName}
    `;
  },
  *encodeSuggestions(suggestions) {
    for (const suggestion of suggestions)
      if (suggestion.kind === "literal") {
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `${suggestion.text}\x00${description}\x00`;
      } else {
        const extensions = suggestion.extensions?.join(",") || "";
        const hidden = suggestion.includeHidden ? "1" : "0";
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `__FILE__:${suggestion.type}:${extensions}:${suggestion.pattern || ""}:${hidden}\x00${description}\x00`;
      }
  }
};
var fish = {
  name: "fish",
  generateScript(programName, args = []) {
    validateProgramName(programName);
    const escapedArgs = args.map((arg) => `'${arg.replace(/'/g, "\\'")}'`).join(" ");
    const functionName = `__${programName.replace(/[^a-zA-Z0-9]/g, "_")}_complete`;
    return `
function ${functionName}
    set -l tokens (commandline -poc)
    set -l current (commandline -ct)

    # Extract previous arguments (skip the command name)
    set -l prev
    set -l count (count $tokens)
    if test $count -gt 1
        set prev $tokens[2..$count]
    end

    # Call completion command and capture output
${escapedArgs ? `    set -l output (${programName} ${escapedArgs} $prev $current 2>/dev/null)
` : `    set -l output (${programName} $prev $current 2>/dev/null)
`}
    # Process each line of output
    for line in $output
        if string match -q '__FILE__:*' -- $line
            # Parse file completion directive: __FILE__:type:extensions:pattern:hidden
            set -l parts (string split ':' -- $line)
            set -l type $parts[2]
            set -l extensions $parts[3]
            set -l pattern $parts[4]
            set -l hidden $parts[5]

            # Generate file completions based on type
            set -l items
            switch $type
                case file
                    # Complete files only
                    for item in $current*
                        if test -f $item
                            set -a items $item
                        end
                    end
                case directory
                    # Complete directories only
                    for item in $current*
                        if test -d $item
                            set -a items $item/
                        end
                    end
                case any
                    # Complete both files and directories
                    for item in $current*
                        if test -d $item
                            set -a items $item/
                        else if test -f $item
                            set -a items $item
                        end
                    end
            end

            # Filter by extensions if specified
            if test -n "$extensions" -a "$type" != directory
                set -l filtered
                set -l ext_list (string split ',' -- $extensions)
                for item in $items
                    # Skip directories, they don't have extensions
                    if string match -q '*/' -- $item
                        set -a filtered $item
                        continue
                    end
                    # Check if file matches any extension
                    for ext in $ext_list
                        if string match -q "*.$ext" -- $item
                            set -a filtered $item
                            break
                        end
                    end
                end
                set items $filtered
            end

            # Filter out hidden files unless requested
            if test "$hidden" != "1" -a (string sub -l 1 -- $current) != "."
                set -l filtered
                for item in $items
                    set -l basename (basename $item)
                    if not string match -q '.*' -- $basename
                        set -a filtered $item
                    end
                end
                set items $filtered
            end

            # Output file completions
            for item in $items
                echo $item
            end
        else
            # Regular literal completion - split by tab
            set -l parts (string split \\t -- $line)
            if test (count $parts) -ge 2
                # value\tdescription format
                echo $parts[1]\\t$parts[2]
            else
                # Just value
                echo $line
            end
        end
    end
end

complete -c ${programName} -f -a '(${functionName})'
    `;
  },
  *encodeSuggestions(suggestions) {
    let i = 0;
    for (const suggestion of suggestions) {
      if (i > 0)
        yield `
`;
      if (suggestion.kind === "literal") {
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `${suggestion.text}\t${description}`;
      } else {
        const extensions = suggestion.extensions?.join(",") || "";
        const hidden = suggestion.includeHidden ? "1" : "0";
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `__FILE__:${suggestion.type}:${extensions}:${suggestion.pattern || ""}:${hidden}\t${description}`;
      }
      i++;
    }
  }
};
var nu = {
  name: "nu",
  generateScript(programName, args = []) {
    validateProgramName(programName);
    const escapedArgs = args.map((arg) => `'${arg.replace(/'/g, "''")}'`).join(" ");
    const safeName = programName.replace(/[^a-zA-Z0-9]+/g, "-");
    const functionName = `nu-complete-${safeName}`;
    return `
# Helper to split args respecting quotes and whitespace
def args-split []: string -> list<string> {
  let STATE_NORMAL = 0
  let STATE_IN_SINGLE_QUOTE = 1
  let STATE_IN_DOUBLE_QUOTE = 2
  let STATE_ESCAPE = 3
  let WHITESPACES = [" " "\\t" "\\n" "\\r"]

  mut state = $STATE_NORMAL
  mut current_token = ""
  mut result: list<string> = []
  mut prev_state = $STATE_NORMAL

  for char in ($in | split chars) {
    if $state == $STATE_ESCAPE {
      $current_token = $current_token + $char
      $state = $prev_state
    } else if $char == '\\\\' {
      $prev_state = $state
      $state = $STATE_ESCAPE
    } else if $state == $STATE_NORMAL {
      if $char == "'" {
        $state = $STATE_IN_SINGLE_QUOTE
      } else if $char == '"' {
        $state = $STATE_IN_DOUBLE_QUOTE
      } else if ($char in $WHITESPACES) {
        if ($current_token | is-not-empty) {
          $result = $result | append $current_token
          $current_token = ""
        }
      } else {
        $current_token = $current_token + $char
      }
    } else if $state == $STATE_IN_SINGLE_QUOTE {
      if $char == "'" {
        $state = $STATE_NORMAL
      } else {
        $current_token = $current_token + $char
      }
    } else if $state == $STATE_IN_DOUBLE_QUOTE {
      if $char == '"' {
        $state = $STATE_NORMAL
      } else {
        $current_token = $current_token + $char
      }
    }
  }
  if ($current_token | is-not-empty) {
    $result = $result | append $current_token
  }
  $result
}

# Completion command that calls back to the CLI
export def "${functionName}" [context: string] {
  # Split context into tokens, handling quotes properly
  let tokens = $context | args-split

  # Remove the command name (first token) to get arguments
  let args = if ($tokens | length) > 1 {
    $tokens | skip 1
  } else {
    []
  }

  # If context ends with whitespace, add empty string to represent the new argument
  let args_with_empty = if ($context | str ends-with ' ') {
    $args | append ''
  } else {
    $args
  }

  # Ensure at least one argument (empty string) to get completions not script
  let final_args = if ($args_with_empty | is-empty) {
    ['']
  } else {
    $args_with_empty
  }

  let output = try {
${escapedArgs ? `    ^${programName} ${escapedArgs} ...$final_args | complete | get stdout
` : `    ^${programName} ...$final_args | complete | get stdout
`}  } catch {
    ""
  }

  # Process each line of output
  $output | lines | each {|line|
    if ($line | str starts-with '__FILE__:') {
      # Parse file completion directive: __FILE__:type:extensions:pattern:hidden
      let parts = ($line | split row ':')
      let type = ($parts | get 1)
      let extensions = ($parts | get 2)
      let pattern = ($parts | get 3)
      let hidden = ($parts | get 4) == '1'

      # Extract prefix from the last argument if it exists
      let prefix = if ($final_args | length) > 0 {
        $final_args | last
      } else {
        ""
      }

      # Generate file completions based on type
      # Use current directory if prefix is empty
      let ls_pattern = if ($prefix | is-empty) { "." } else { $prefix + "*" }

      let items = try {
        match $type {
          "file" => {
            if ($extensions | is-empty) {
              ls $ls_pattern | where type == file
            } else {
              let ext_list = ($extensions | split row ',')
              ls $ls_pattern | where type == file | where {|f|
                let ext = ($f.name | path parse | get extension)
                $ext in $ext_list
              }
            }
          },
          "directory" => {
            ls $ls_pattern | where type == dir
          },
          "any" => {
            if ($extensions | is-empty) {
              ls $ls_pattern
            } else {
              let ext_list = ($extensions | split row ',')
              let dirs = ls $ls_pattern | where type == dir
              let files = ls $ls_pattern | where type == file | where {|f|
                let ext = ($f.name | path parse | get extension)
                $ext in $ext_list
              }
              $dirs | append $files
            }
          }
        }
      } catch {
        []
      }

      # Filter out hidden files unless requested
      let filtered = if $hidden or ($prefix | str starts-with '.') {
        $items
      } else {
        $items | where {|item|
          let basename = ($item.name | path basename)
          not ($basename | str starts-with '.')
        }
      }

      # Format file completions
      $filtered | each {|item|
        let name = if $item.type == dir {
          ($item.name | path basename) + "/"
        } else {
          $item.name | path basename
        }
        { value: $name }
      }
    } else {
      # Regular literal completion - split by tab
      let parts = ($line | split row "\t")
      if ($parts | length) >= 2 {
        # value\\tdescription format
        { value: ($parts | get 0), description: ($parts | get 1) }
      } else if ($parts | length) == 1 and ($parts | get 0 | is-not-empty) {
        # Just value
        { value: ($parts | get 0) }
      } else {
        null
      }
    }
  } | flatten | compact
}

# Custom completer for external commands
# This function will be called by Nushell's completion system
def --env "${functionName}-external" [] {
  let existing_completer = $env.config.completions.external.completer

  $env.config.completions.external.completer = {|spans|
    # Check if this is for our program
    if ($spans.0 == "${programName}") {
      # Build context string from spans
      let context = $spans | str join ' '
      ${functionName} $context
    } else if ($existing_completer != null) {
      # Delegate to existing completer
      do $existing_completer $spans
    } else {
      # No completions
      null
    }
  }

  $env.config.completions.external.enable = true
}

# Auto-setup: register the completer when this module is imported
${functionName}-external
    `;
  },
  *encodeSuggestions(suggestions) {
    let i = 0;
    for (const suggestion of suggestions) {
      if (i > 0)
        yield `
`;
      if (suggestion.kind === "literal") {
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `${suggestion.text}\t${description}`;
      } else {
        const extensions = suggestion.extensions?.join(",") || "";
        const hidden = suggestion.includeHidden ? "1" : "0";
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `__FILE__:${suggestion.type}:${extensions}:${suggestion.pattern || ""}:${hidden}\t${description}`;
      }
      i++;
    }
  }
};
var pwsh = {
  name: "pwsh",
  generateScript(programName, args = []) {
    validateProgramName(programName);
    const escapedArgs = args.map((arg) => `'${arg.replace(/'/g, "''")}'`).join(", ");
    return `
Register-ArgumentCompleter -Native -CommandName ${programName} -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)

    # Extract arguments from AST (handles quoted strings properly)
    $arguments = @()
    $commandElements = $commandAst.CommandElements

    # Determine the range of elements to extract
    # Exclude the last element if it matches wordToComplete (partial input case)
    $maxIndex = $commandElements.Count - 1
    if ($commandElements.Count -gt 1) {
        $lastElement = $commandElements[$commandElements.Count - 1]
        $lastText = if ($lastElement -is [System.Management.Automation.Language.StringConstantExpressionAst]) {
            $lastElement.Value
        } else {
            $lastElement.Extent.Text
        }
        if ($lastText -eq $wordToComplete) {
            $maxIndex = $commandElements.Count - 2
        }
    }

    for ($i = 1; $i -le $maxIndex; $i++) {
        $element = $commandElements[$i]

        if ($element -is [System.Management.Automation.Language.StringConstantExpressionAst]) {
            $arguments += $element.Value
        } else {
            $arguments += $element.Extent.Text
        }
    }

    # Build arguments array for completion command
    $completionArgs = @()
${escapedArgs ? `    $completionArgs += @(${escapedArgs})
` : ""}    $completionArgs += $arguments
    $completionArgs += $wordToComplete

    # Call completion command and capture output
    try {
        $output = & ${programName} $completionArgs 2>$null
        if (-not $output) { return }

        # Parse tab-separated output and create CompletionResult objects
        $output -split "\`n" | ForEach-Object {
            $line = $_.Trim()
            if (-not $line) { return }

            if ($line -match '^__FILE__:') {
                # Parse file completion directive: __FILE__:type:extensions:pattern:hidden
                $parts = $line -split ':', 5
                $type = $parts[1]
                $extensions = $parts[2]
                $pattern = $parts[3]
                $hidden = $parts[4] -eq '1'

                # Determine current prefix for file matching
                $prefix = if ($wordToComplete) { $wordToComplete } else { '' }

                # Get file system items based on type
                $items = @()
                switch ($type) {
                    'file' {
                        if ($extensions) {
                            # Filter by extensions
                            $extList = $extensions -split ','
                            $items = Get-ChildItem -File -Path "\${prefix}*" -ErrorAction SilentlyContinue |
                                Where-Object {
                                    $ext = $_.Extension
                                    $extList | ForEach-Object { if ($ext -eq ".$_") { return $true } }
                                }
                        } else {
                            $items = Get-ChildItem -File -Path "\${prefix}*" -ErrorAction SilentlyContinue
                        }
                    }
                    'directory' {
                        $items = Get-ChildItem -Directory -Path "\${prefix}*" -ErrorAction SilentlyContinue
                    }
                    'any' {
                        if ($extensions) {
                            # Get directories and filtered files
                            $dirs = Get-ChildItem -Directory -Path "\${prefix}*" -ErrorAction SilentlyContinue
                            $extList = $extensions -split ','
                            $files = Get-ChildItem -File -Path "\${prefix}*" -ErrorAction SilentlyContinue |
                                Where-Object {
                                    $ext = $_.Extension
                                    $extList | ForEach-Object { if ($ext -eq ".$_") { return $true } }
                                }
                            $items = $dirs + $files
                        } else {
                            $items = Get-ChildItem -Path "\${prefix}*" -ErrorAction SilentlyContinue
                        }
                    }
                }

                # Filter hidden files unless requested
                if (-not $hidden) {
                    $items = $items | Where-Object { -not $_.Attributes.HasFlag([System.IO.FileAttributes]::Hidden) }
                }

                # Create completion results for files
                $items | ForEach-Object {
                    $completionText = if ($_.PSIsContainer) { "$($_.Name)/" } else { $_.Name }
                    $itemType = if ($_.PSIsContainer) { 'Directory' } else { 'File' }
                    [System.Management.Automation.CompletionResult]::new(
                        $completionText,
                        $completionText,
                        'ParameterValue',
                        $itemType
                    )
                }
            } else {
                # Parse literal completion: text\\tlistItemText\\tdescription
                $parts = $line -split "\`t", 3
                $completionText = $parts[0]
                $listItemText = if ($parts.Length -gt 1 -and $parts[1]) { $parts[1] } else { $completionText }
                $toolTip = if ($parts.Length -gt 2 -and $parts[2]) { $parts[2] } else { $completionText }

                [System.Management.Automation.CompletionResult]::new(
                    $completionText,
                    $listItemText,
                    'ParameterValue',
                    $toolTip
                )
            }
        }
    } catch {
        # Silently ignore errors
    }
}
    `;
  },
  *encodeSuggestions(suggestions) {
    let i = 0;
    for (const suggestion of suggestions) {
      if (i > 0)
        yield `
`;
      if (suggestion.kind === "literal") {
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `${suggestion.text}\t${suggestion.text}\t${description}`;
      } else {
        const extensions = suggestion.extensions?.join(",") || "";
        const hidden = suggestion.includeHidden ? "1" : "0";
        const description = suggestion.description == null ? "" : formatMessage(suggestion.description, { colors: false });
        yield `__FILE__:${suggestion.type}:${extensions}:${suggestion.pattern || ""}:${hidden}\t[file]\t${description}`;
      }
      i++;
    }
  }
};

// node_modules/@optique/core/dist/doc.js
function formatDocPage(programName, page, options = {}) {
  const termIndent = options.termIndent ?? 2;
  const termWidth = options.termWidth ?? 26;
  let output = "";
  if (page.brief != null) {
    output += formatMessage(page.brief, {
      colors: options.colors,
      maxWidth: options.maxWidth,
      quotes: !options.colors
    });
    output += `
`;
  }
  if (page.usage != null) {
    const usageLabel = options.colors ? "\x1B[1;2mUsage:\x1B[0m " : "Usage: ";
    output += usageLabel;
    output += indentLines(formatUsage(programName, page.usage, {
      colors: options.colors,
      maxWidth: options.maxWidth == null ? undefined : options.maxWidth - 7,
      expandCommands: true
    }), 7);
    output += `
`;
  }
  if (page.description != null) {
    output += `
`;
    output += formatMessage(page.description, {
      colors: options.colors,
      maxWidth: options.maxWidth,
      quotes: !options.colors
    });
    output += `
`;
  }
  const sections = page.sections.toSorted((a, b) => a.title == null && b.title == null ? 0 : a.title == null ? -1 : 1);
  for (const section of sections) {
    if (section.entries.length < 1)
      continue;
    output += `
`;
    if (section.title != null) {
      const sectionLabel = options.colors ? `\x1B[1;2m${section.title}:\x1B[0m
` : `${section.title}:
`;
      output += sectionLabel;
    }
    for (const entry of section.entries) {
      const term = formatUsageTerm(entry.term, {
        colors: options.colors,
        optionsSeparator: ", ",
        maxWidth: options.maxWidth == null ? undefined : options.maxWidth - termIndent
      });
      const descColumnWidth = options.maxWidth == null ? undefined : options.maxWidth - termIndent - termWidth - 2;
      const termVisibleWidth = lastLineVisibleLength(term);
      const extraTermOffset = descColumnWidth != null ? Math.max(0, termVisibleWidth - termWidth) : 0;
      const currentExtraOffset = () => description.includes(`
`) ? 0 : extraTermOffset;
      const descFormatOptions = {
        colors: options.colors,
        quotes: !options.colors,
        maxWidth: descColumnWidth,
        startWidth: extraTermOffset > 0 ? extraTermOffset : undefined
      };
      let description = entry.description == null ? "" : formatMessage(entry.description, descFormatOptions);
      if (options.showDefault && entry.default != null) {
        const prefix = typeof options.showDefault === "object" ? options.showDefault.prefix ?? " [" : " [";
        const suffix = typeof options.showDefault === "object" ? options.showDefault.suffix ?? "]" : "]";
        let defaultStartWidth;
        if (descColumnWidth != null) {
          const lastW = lastLineVisibleLength(description);
          const effectiveLastW = lastW + currentExtraOffset();
          if (effectiveLastW + prefix.length >= descColumnWidth) {
            description += `
`;
            defaultStartWidth = prefix.length;
          } else
            defaultStartWidth = effectiveLastW + prefix.length;
        }
        const defaultFormatOptions = {
          colors: options.colors ? { resetSuffix: "\x1B[2m" } : false,
          quotes: !options.colors,
          maxWidth: descColumnWidth == null ? undefined : descColumnWidth - suffix.length,
          startWidth: defaultStartWidth
        };
        const defaultContent = formatMessage(entry.default, defaultFormatOptions);
        const defaultText = `${prefix}${defaultContent}${suffix}`;
        const formattedDefault = options.colors ? `\x1B[2m${defaultText}\x1B[0m` : defaultText;
        description += formattedDefault;
      }
      if (options.showChoices && entry.choices != null) {
        const prefix = typeof options.showChoices === "object" ? options.showChoices.prefix ?? " (" : " (";
        const suffix = typeof options.showChoices === "object" ? options.showChoices.suffix ?? ")" : ")";
        const label = typeof options.showChoices === "object" ? options.showChoices.label ?? "choices: " : "choices: ";
        const maxItems = typeof options.showChoices === "object" ? options.showChoices.maxItems ?? 8 : 8;
        const terms = Array.isArray(entry.choices) ? entry.choices : [];
        let truncatedTerms = terms;
        let truncated = false;
        if (maxItems < Infinity) {
          let valueCount = 0;
          let cutIndex = terms.length;
          for (let i = 0;i < terms.length; i++)
            if (terms[i].type === "value") {
              valueCount++;
              if (valueCount > maxItems) {
                cutIndex = i > 0 && terms[i - 1].type === "text" ? i - 1 : i;
                truncated = true;
                break;
              }
            }
          if (truncated)
            truncatedTerms = [...terms.slice(0, cutIndex), text(", ...")];
        }
        let choicesStartWidth;
        if (descColumnWidth != null) {
          const lastW = lastLineVisibleLength(description);
          const effectiveLastW = lastW + currentExtraOffset();
          const prefixLabelLen = prefix.length + label.length;
          if (effectiveLastW + prefixLabelLen >= descColumnWidth) {
            description += `
`;
            choicesStartWidth = prefixLabelLen;
          } else
            choicesStartWidth = effectiveLastW + prefixLabelLen;
        }
        const choicesFormatOptions = {
          colors: options.colors ? { resetSuffix: "\x1B[2m" } : false,
          quotes: false,
          maxWidth: descColumnWidth == null ? undefined : descColumnWidth - suffix.length,
          startWidth: choicesStartWidth
        };
        const choicesDisplay = formatMessage(truncatedTerms, choicesFormatOptions);
        const choicesText = `${prefix}${label}${choicesDisplay}${suffix}`;
        const formattedChoices = options.colors ? `\x1B[2m${choicesText}\x1B[0m` : choicesText;
        description += formattedChoices;
      }
      output += `${" ".repeat(termIndent)}${ansiAwareRightPad(term, termWidth)}  ${description === "" ? "" : indentLines(description, termIndent + termWidth + 2)}
`;
    }
  }
  if (page.examples != null) {
    output += `
`;
    const examplesLabel = options.colors ? `\x1B[1;2mExamples:\x1B[0m
` : `Examples:
`;
    output += examplesLabel;
    const examplesContent = formatMessage(page.examples, {
      colors: options.colors,
      maxWidth: options.maxWidth == null ? undefined : options.maxWidth - 2,
      quotes: !options.colors
    });
    output += "  " + indentLines(examplesContent, 2);
    output += `
`;
  }
  if (page.author != null) {
    output += `
`;
    const authorLabel = options.colors ? `\x1B[1;2mAuthor:\x1B[0m
` : `Author:
`;
    output += authorLabel;
    const authorContent = formatMessage(page.author, {
      colors: options.colors,
      maxWidth: options.maxWidth == null ? undefined : options.maxWidth - 2,
      quotes: !options.colors
    });
    output += "  " + indentLines(authorContent, 2);
    output += `
`;
  }
  if (page.bugs != null) {
    output += `
`;
    const bugsLabel = options.colors ? `\x1B[1;2mBugs:\x1B[0m
` : `Bugs:
`;
    output += bugsLabel;
    const bugsContent = formatMessage(page.bugs, {
      colors: options.colors,
      maxWidth: options.maxWidth == null ? undefined : options.maxWidth - 2,
      quotes: !options.colors
    });
    output += "  " + indentLines(bugsContent, 2);
    output += `
`;
  }
  if (page.footer != null) {
    output += `
`;
    output += formatMessage(page.footer, {
      colors: options.colors,
      maxWidth: options.maxWidth,
      quotes: !options.colors
    });
  }
  return output;
}
function indentLines(text$1, indent) {
  return text$1.split(`
`).join(`
` + " ".repeat(indent));
}
var ansiEscapeCodeRegex = /\x1B\[[0-9;]*[a-zA-Z]/g;
function ansiAwareRightPad(text$1, length, char = " ") {
  const strippedText = text$1.replace(ansiEscapeCodeRegex, "");
  if (strippedText.length >= length)
    return text$1;
  return text$1 + char.repeat(length - strippedText.length);
}
function lastLineVisibleLength(text$1) {
  const lastNewline = text$1.lastIndexOf(`
`);
  const lastLine = lastNewline === -1 ? text$1 : text$1.slice(lastNewline + 1);
  return lastLine.replace(ansiEscapeCodeRegex, "").length;
}

// node_modules/@optique/core/dist/parser.js
function parseSync(parser, args, options) {
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: args,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  do {
    const result = parser.parse(context);
    if (!result.success)
      return {
        success: false,
        error: result.error
      };
    const previousBuffer = context.buffer;
    context = result.next;
    if (context.buffer.length > 0 && context.buffer.length === previousBuffer.length && context.buffer.every((item, i) => item === previousBuffer[i]))
      return {
        success: false,
        error: message`Unexpected option or argument: ${context.buffer[0]}.`
      };
  } while (context.buffer.length > 0);
  const endResult = parser.complete(context.state);
  return endResult.success ? {
    success: true,
    value: endResult.value
  } : {
    success: false,
    error: endResult.error
  };
}
async function parseAsync(parser, args, options) {
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: args,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  do {
    const result = await parser.parse(context);
    if (!result.success)
      return {
        success: false,
        error: result.error
      };
    const previousBuffer = context.buffer;
    context = result.next;
    if (context.buffer.length > 0 && context.buffer.length === previousBuffer.length && context.buffer.every((item, i) => item === previousBuffer[i]))
      return {
        success: false,
        error: message`Unexpected option or argument: ${context.buffer[0]}.`
      };
  } while (context.buffer.length > 0);
  const endResult = await parser.complete(context.state);
  return endResult.success ? {
    success: true,
    value: endResult.value
  } : {
    success: false,
    error: endResult.error
  };
}
function suggestSync(parser, args, options) {
  const allButLast = args.slice(0, -1);
  const prefix = args[args.length - 1];
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: allButLast,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  while (context.buffer.length > 0) {
    const result = parser.parse(context);
    if (!result.success)
      return Array.from(parser.suggest(context, prefix));
    const previousBuffer = context.buffer;
    context = result.next;
    if (context.buffer.length > 0 && context.buffer.length === previousBuffer.length && context.buffer.every((item, i) => item === previousBuffer[i]))
      return [];
  }
  return Array.from(parser.suggest(context, prefix));
}
async function suggestAsync(parser, args, options) {
  const allButLast = args.slice(0, -1);
  const prefix = args[args.length - 1];
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: allButLast,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  while (context.buffer.length > 0) {
    const result = await parser.parse(context);
    if (!result.success) {
      const suggestions$1 = [];
      for await (const suggestion of parser.suggest(context, prefix))
        suggestions$1.push(suggestion);
      return suggestions$1;
    }
    const previousBuffer = context.buffer;
    context = result.next;
    if (context.buffer.length > 0 && context.buffer.length === previousBuffer.length && context.buffer.every((item, i) => item === previousBuffer[i]))
      return [];
  }
  const suggestions = [];
  for await (const suggestion of parser.suggest(context, prefix))
    suggestions.push(suggestion);
  return suggestions;
}
function suggest(parser, args, options) {
  if (parser.$mode === "async")
    return suggestAsync(parser, args, options);
  return suggestSync(parser, args, options);
}
function findCommandInExclusive(term, commandName) {
  if (term.type !== "exclusive")
    return null;
  for (const termGroup of term.terms) {
    const firstTerm = termGroup[0];
    if (firstTerm?.type === "command" && firstTerm.name === commandName)
      return termGroup;
    if (firstTerm?.type === "exclusive") {
      const found = findCommandInExclusive(firstTerm, commandName);
      if (found)
        return [...found, ...termGroup.slice(1)];
    }
  }
  return null;
}
function getDocPage(parser, args = [], options) {
  if (parser.$mode === "sync")
    return getDocPageSyncImpl(parser, args, options);
  return getDocPageAsyncImpl(parser, args, options);
}
function getDocPageSyncImpl(parser, args, options) {
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: args,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  while (context.buffer.length > 0) {
    const result = parser.parse(context);
    if (!result.success)
      break;
    context = result.next;
  }
  return buildDocPage(parser, context, args);
}
async function getDocPageAsyncImpl(parser, args, options) {
  let initialState = parser.initialState;
  if (options?.annotations && initialState != null)
    initialState = {
      ...typeof initialState === "object" ? initialState : {},
      [annotationKey]: options.annotations
    };
  let context = {
    buffer: args,
    optionsTerminated: false,
    state: initialState,
    usage: parser.usage
  };
  while (context.buffer.length > 0) {
    const result = await parser.parse(context);
    if (!result.success)
      break;
    context = result.next;
  }
  return buildDocPage(parser, context, args);
}
function buildDocPage(parser, context, args) {
  const { brief, description, fragments, footer } = parser.getDocFragments({
    kind: "available",
    state: context.state
  }, undefined);
  const entries = fragments.filter((f) => f.type === "entry");
  const sections = [];
  for (const fragment of fragments) {
    if (fragment.type !== "section")
      continue;
    if (fragment.title == null)
      entries.push(...fragment.entries);
    else
      sections.push(fragment);
  }
  if (entries.length > 0)
    sections.push({ entries });
  const usage = [...normalizeUsage(parser.usage)];
  let i = 0;
  for (const arg of args) {
    if (i >= usage.length)
      break;
    const term = usage[i];
    if (term.type === "exclusive") {
      const found = findCommandInExclusive(term, arg);
      if (found)
        usage.splice(i, 1, ...found);
    }
    i++;
  }
  return {
    usage,
    sections,
    ...brief != null && { brief },
    ...description != null && { description },
    ...footer != null && { footer }
  };
}

// node_modules/@optique/core/dist/facade.js
function createHelpParser(mode) {
  const helpCommand = command("help", multiple(argument(string({ metavar: "COMMAND" }), { description: message`Command name to show help for.` })), { description: message`Show help information.` });
  const helpOption = flag("--help", { description: message`Show help information.` });
  switch (mode) {
    case "command":
      return {
        helpCommand,
        helpOption: null
      };
    case "option":
      return {
        helpCommand: null,
        helpOption
      };
    case "both":
      return {
        helpCommand,
        helpOption
      };
  }
}
function createVersionParser(mode) {
  const versionCommand = command("version", object({}), { description: message`Show version information.` });
  const versionOption = flag("--version", { description: message`Show version information.` });
  switch (mode) {
    case "command":
      return {
        versionCommand,
        versionOption: null
      };
    case "option":
      return {
        versionCommand: null,
        versionOption
      };
    case "both":
      return {
        versionCommand,
        versionOption
      };
  }
}
function createCompletionParser(mode, programName, availableShells, name = "both", helpVisibility = name) {
  const shellList = [];
  for (const shell in availableShells) {
    if (shellList.length > 0)
      shellList.push(text(", "));
    shellList.push(value(shell));
  }
  const completionInner = object({
    shell: optional(argument(string({ metavar: "SHELL" }), { description: message`Shell type (${shellList}). Generate completion script when used alone, or provide completions when followed by arguments.` })),
    args: multiple(argument(string({ metavar: "ARG" }), { description: message`Command line arguments for completion suggestions (used by shell integration; you usually don't need to provide this).` }))
  });
  const commandName = name === "plural" ? "completions" : "completion";
  const completionCommandConfig = {
    brief: message`Generate shell completion script or provide completions.`,
    description: message`Generate shell completion script or provide completions.`,
    footer: message`Examples:${lineBreak()}  Bash:       ${commandLine(`eval "$(${programName} ${commandName} bash)"`)}${lineBreak()}  zsh:        ${commandLine(`eval "$(${programName} ${commandName} zsh)"`)}${lineBreak()}  fish:       ${commandLine(`eval "$(${programName} ${commandName} fish)"`)}${lineBreak()}  PowerShell: ${commandLine(`${programName} ${commandName} pwsh > ${programName}-completion.ps1; . ./${programName}-completion.ps1`)}${lineBreak()}  Nushell:    ${commandLine(`${programName} ${commandName} nu | save ${programName}-completion.nu; source ./${programName}-completion.nu`)}`
  };
  const completionCommands = [];
  const showSingular = helpVisibility === "singular" || helpVisibility === "both";
  const showPlural = helpVisibility === "plural" || helpVisibility === "both";
  if (name === "singular" || name === "both")
    completionCommands.push(command("completion", completionInner, {
      ...completionCommandConfig,
      hidden: !showSingular
    }));
  if (name === "plural" || name === "both")
    completionCommands.push(command("completions", completionInner, {
      ...completionCommandConfig,
      hidden: !showPlural
    }));
  const completionCommand = longestMatch(...completionCommands);
  const completionOptions = [];
  if (name === "singular" || name === "both")
    completionOptions.push(option("--completion", string({ metavar: "SHELL" }), {
      description: message`Generate shell completion script.`,
      hidden: !showSingular
    }));
  if (name === "plural" || name === "both")
    completionOptions.push(option("--completions", string({ metavar: "SHELL" }), {
      description: message`Generate shell completion script.`,
      hidden: !showPlural
    }));
  const completionOption = completionOptions.length === 1 ? completionOptions[0] : longestMatch(completionOptions[0], completionOptions[1]);
  const argsParser = withDefault(multiple(argument(string({ metavar: "ARG" }), { description: message`Command line arguments for completion suggestions (used by shell integration; you usually don't need to provide this).` })), []);
  const optionParser = object({
    shell: completionOption,
    args: argsParser
  });
  switch (mode) {
    case "command":
      return {
        completionCommand,
        completionOption: null
      };
    case "option":
      return {
        completionCommand: null,
        completionOption: optionParser
      };
    case "both":
      return {
        completionCommand,
        completionOption: optionParser
      };
  }
}
function combineWithHelpVersion(originalParser, helpParsers, versionParsers, completionParsers, groups) {
  const parsers = [];
  if (helpParsers.helpOption) {
    const lenientHelpParser = {
      $mode: "sync",
      $valueType: [],
      $stateType: [],
      priority: 200,
      usage: helpParsers.helpOption.usage,
      initialState: null,
      parse(context) {
        const { buffer, optionsTerminated } = context;
        if (optionsTerminated)
          return {
            success: false,
            error: message`Options terminated.`,
            consumed: 0
          };
        let helpFound = false;
        let helpIndex = -1;
        let versionIndex = -1;
        for (let i = 0;i < buffer.length; i++) {
          if (buffer[i] === "--")
            break;
          if (buffer[i] === "--help") {
            helpFound = true;
            helpIndex = i;
          }
          if (buffer[i] === "--version")
            versionIndex = i;
        }
        if (helpFound && versionIndex > helpIndex)
          return {
            success: false,
            error: message`Version option wins.`,
            consumed: 0
          };
        if (helpFound) {
          const commands = [];
          for (let i = 0;i < helpIndex; i++) {
            const arg = buffer[i];
            if (!arg.startsWith("-"))
              commands.push(arg);
          }
          return {
            success: true,
            next: {
              ...context,
              buffer: [],
              state: {
                help: true,
                version: false,
                commands,
                helpFlag: true
              }
            },
            consumed: buffer.slice(0)
          };
        }
        return {
          success: false,
          error: message`Flag ${optionName("--help")} not found.`,
          consumed: 0
        };
      },
      complete(state) {
        return {
          success: true,
          value: state
        };
      },
      *suggest(_context, prefix) {
        if ("--help".startsWith(prefix))
          yield {
            kind: "literal",
            text: "--help"
          };
      },
      getDocFragments(state) {
        return helpParsers.helpOption?.getDocFragments(state) ?? { fragments: [] };
      }
    };
    parsers.push(lenientHelpParser);
  }
  if (versionParsers.versionOption) {
    const lenientVersionParser = {
      $mode: "sync",
      $valueType: [],
      $stateType: [],
      priority: 200,
      usage: versionParsers.versionOption.usage,
      initialState: null,
      parse(context) {
        const { buffer, optionsTerminated } = context;
        if (optionsTerminated)
          return {
            success: false,
            error: message`Options terminated.`,
            consumed: 0
          };
        let versionFound = false;
        let versionIndex = -1;
        let helpIndex = -1;
        for (let i = 0;i < buffer.length; i++) {
          if (buffer[i] === "--")
            break;
          if (buffer[i] === "--version") {
            versionFound = true;
            versionIndex = i;
          }
          if (buffer[i] === "--help")
            helpIndex = i;
        }
        if (versionFound && helpIndex > versionIndex)
          return {
            success: false,
            error: message`Help option wins.`,
            consumed: 0
          };
        if (versionFound)
          return {
            success: true,
            next: {
              ...context,
              buffer: [],
              state: {
                help: false,
                version: true,
                versionFlag: true
              }
            },
            consumed: buffer.slice(0)
          };
        return {
          success: false,
          error: message`Flag ${optionName("--version")} not found.`,
          consumed: 0
        };
      },
      complete(state) {
        return {
          success: true,
          value: state
        };
      },
      *suggest(_context, prefix) {
        if ("--version".startsWith(prefix))
          yield {
            kind: "literal",
            text: "--version"
          };
      },
      getDocFragments(state) {
        return versionParsers.versionOption?.getDocFragments(state) ?? { fragments: [] };
      }
    };
    parsers.push(lenientVersionParser);
  }
  if (versionParsers.versionCommand) {
    const versionParser = object({
      help: constant(false),
      version: constant(true),
      completion: constant(false),
      result: versionParsers.versionCommand,
      helpFlag: helpParsers.helpOption ? optional(helpParsers.helpOption) : constant(false)
    });
    parsers.push(groups?.versionGroup ? group(groups.versionGroup, versionParser) : versionParser);
  }
  if (completionParsers.completionCommand) {
    const completionParser = object({
      help: constant(false),
      version: constant(false),
      completion: constant(true),
      completionData: completionParsers.completionCommand,
      helpFlag: helpParsers.helpOption ? optional(helpParsers.helpOption) : constant(false)
    });
    parsers.push(groups?.completionGroup ? group(groups.completionGroup, completionParser) : completionParser);
  }
  if (helpParsers.helpCommand) {
    const helpParser = object({
      help: constant(true),
      version: constant(false),
      completion: constant(false),
      commands: helpParsers.helpCommand
    });
    parsers.push(groups?.helpGroup ? group(groups.helpGroup, helpParser) : helpParser);
  }
  parsers.push(object({
    help: constant(false),
    version: constant(false),
    completion: constant(false),
    result: originalParser
  }));
  const mainParserIndex = parsers.length - 1;
  if (parsers.length === 1)
    return parsers[0];
  let combined;
  if (parsers.length === 2)
    combined = longestMatch(parsers[0], parsers[1]);
  else
    combined = longestMatch(...parsers);
  const topUsage = combined.usage[0];
  if (topUsage?.type === "exclusive" && mainParserIndex > 0) {
    const terms = [...topUsage.terms];
    const [mainTerm] = terms.splice(mainParserIndex, 1);
    const lenientCount = (helpParsers.helpOption ? 1 : 0) + (versionParsers.versionOption ? 1 : 0);
    terms.splice(lenientCount, 0, mainTerm);
    combined = {
      ...combined,
      usage: [{
        ...topUsage,
        terms
      }]
    };
  }
  return combined;
}
function classifyResult(result, args) {
  if (!result.success)
    return {
      type: "error",
      error: result.error
    };
  const value$1 = result.value;
  if (typeof value$1 === "object" && value$1 != null && "help" in value$1 && "version" in value$1) {
    const parsedValue = value$1;
    const hasVersionOption = args.includes("--version");
    const hasVersionCommand = args.length > 0 && args[0] === "version";
    const hasHelpOption = args.includes("--help");
    const hasHelpCommand = args.length > 0 && args[0] === "help";
    const hasCompletionCommand = args.length > 0 && args[0] === "completion";
    if (hasVersionOption && hasHelpOption && !hasVersionCommand && !hasHelpCommand) {
    }
    if (hasVersionCommand && hasHelpOption && parsedValue.helpFlag)
      return {
        type: "help",
        commands: ["version"]
      };
    if (hasCompletionCommand && hasHelpOption && parsedValue.helpFlag)
      return {
        type: "help",
        commands: ["completion"]
      };
    if (parsedValue.help && (hasHelpOption || hasHelpCommand)) {
      let commandContext = [];
      if (Array.isArray(parsedValue.commands))
        commandContext = parsedValue.commands;
      else if (typeof parsedValue.commands === "object" && parsedValue.commands != null && "length" in parsedValue.commands)
        commandContext = parsedValue.commands;
      return {
        type: "help",
        commands: commandContext
      };
    }
    if ((hasVersionOption || hasVersionCommand) && (parsedValue.version || parsedValue.versionFlag))
      return { type: "version" };
    if (parsedValue.completion && parsedValue.completionData)
      return {
        type: "completion",
        shell: parsedValue.completionData.shell || "",
        args: parsedValue.completionData.args || []
      };
    return {
      type: "success",
      value: parsedValue.result ?? value$1
    };
  }
  return {
    type: "success",
    value: value$1
  };
}
function handleCompletion(completionArgs, programName, parser, completionParser, stdout, stderr, onCompletion, onError, availableShells, colors, maxWidth, completionMode, completionName) {
  const shellName = completionArgs[0] || "";
  const args = completionArgs.slice(1);
  const callOnError = (code) => {
    try {
      return onError(code);
    } catch {
      return onError();
    }
  };
  const callOnCompletion = (code) => {
    try {
      return onCompletion(code);
    } catch {
      return onCompletion();
    }
  };
  if (!shellName) {
    stderr(`Error: Missing shell name for completion.
`);
    if (completionParser) {
      const doc = getDocPage(completionParser, ["completion"]);
      if (doc)
        stderr(formatDocPage(programName, doc, {
          colors,
          maxWidth
        }));
    }
    if (parser.$mode === "async")
      return Promise.resolve(callOnError(1));
    return callOnError(1);
  }
  const shell = availableShells[shellName];
  if (!shell) {
    const available = [];
    for (const name in availableShells) {
      if (available.length > 0)
        available.push(text(", "));
      available.push(value(name));
    }
    stderr(formatMessage(message`Error: Unsupported shell ${shellName}. Available shells: ${available}.`, {
      colors,
      quotes: !colors
    }));
    if (parser.$mode === "async")
      return Promise.resolve(callOnError(1));
    return callOnError(1);
  }
  if (args.length === 0) {
    const usePlural = completionName === "plural";
    const completionArg = completionMode === "option" ? usePlural ? "--completions" : "--completion" : usePlural ? "completions" : "completion";
    const script = shell.generateScript(programName, [completionArg, shellName]);
    stdout(script);
    if (parser.$mode === "async")
      return Promise.resolve(callOnCompletion(0));
    return callOnCompletion(0);
  }
  if (parser.$mode === "async")
    return (async () => {
      const suggestions$1 = await suggestAsync(parser, args);
      for (const chunk of shell.encodeSuggestions(suggestions$1))
        stdout(chunk);
      return callOnCompletion(0);
    })();
  const syncParser = parser;
  const suggestions = suggest(syncParser, args);
  for (const chunk of shell.encodeSuggestions(suggestions))
    stdout(chunk);
  return callOnCompletion(0);
}
function runParser(parserOrProgram, programNameOrArgs, argsOrOptions, optionsParam) {
  const isProgram = typeof programNameOrArgs !== "string";
  let parser;
  let programName;
  let args;
  let options;
  if (isProgram) {
    const program = parserOrProgram;
    parser = program.parser;
    programName = program.metadata.name;
    args = programNameOrArgs;
    options = argsOrOptions ?? {};
    options = {
      ...options,
      brief: options.brief ?? program.metadata.brief,
      description: options.description ?? program.metadata.description,
      examples: options.examples ?? program.metadata.examples,
      author: options.author ?? program.metadata.author,
      bugs: options.bugs ?? program.metadata.bugs,
      footer: options.footer ?? program.metadata.footer
    };
  } else {
    parser = parserOrProgram;
    programName = programNameOrArgs;
    args = argsOrOptions;
    options = optionsParam ?? {};
  }
  const { colors, maxWidth, showDefault, showChoices, aboveError = "usage", onError = () => {
    throw new RunParserError("Failed to parse command line arguments.");
  }, stderr = console.error, stdout = console.log, brief, description, examples, author, bugs, footer } = options;
  const helpMode = options.help?.mode ?? "option";
  const onHelp = options.help?.onShow ?? (() => ({}));
  const helpGroup = options.help?.group;
  const versionMode = options.version?.mode ?? "option";
  const versionValue = options.version?.value ?? "";
  const onVersion = options.version?.onShow ?? (() => ({}));
  const versionGroup = options.version?.group;
  const completionMode = options.completion?.mode ?? "both";
  const completionName = options.completion?.name ?? "both";
  const completionHelpVisibility = options.completion?.helpVisibility ?? completionName;
  const onCompletion = options.completion?.onShow ?? (() => ({}));
  const completionGroup = options.completion?.group;
  const defaultShells = {
    bash,
    fish,
    nu,
    pwsh,
    zsh
  };
  const availableShells = options.completion?.shells ? {
    ...defaultShells,
    ...options.completion.shells
  } : defaultShells;
  const help = options.help ? helpMode : "none";
  const version = options.version ? versionMode : "none";
  const completion = options.completion ? completionMode : "none";
  const helpParsers = help === "none" ? {
    helpCommand: null,
    helpOption: null
  } : createHelpParser(help);
  const versionParsers = version === "none" ? {
    versionCommand: null,
    versionOption: null
  } : createVersionParser(version);
  const completionParsers = completion === "none" ? {
    completionCommand: null,
    completionOption: null
  } : createCompletionParser(completion, programName, availableShells, completionName, completionHelpVisibility);
  if (options.completion) {
    const hasHelpOption = args.includes("--help");
    if ((completionMode === "command" || completionMode === "both") && args.length >= 1 && ((completionName === "singular" || completionName === "both" ? args[0] === "completion" : false) || (completionName === "plural" || completionName === "both" ? args[0] === "completions" : false)) && !hasHelpOption)
      return handleCompletion(args.slice(1), programName, parser, completionParsers.completionCommand, stdout, stderr, onCompletion, onError, availableShells, colors, maxWidth, completionMode, completionName);
    if (completionMode === "option" || completionMode === "both")
      for (let i = 0;i < args.length; i++) {
        const arg = args[i];
        const singularMatch = completionName === "singular" || completionName === "both" ? arg.startsWith("--completion=") : false;
        const pluralMatch = completionName === "plural" || completionName === "both" ? arg.startsWith("--completions=") : false;
        if (singularMatch || pluralMatch) {
          const shell = arg.slice(arg.indexOf("=") + 1);
          const completionArgs = args.slice(i + 1);
          return handleCompletion([shell, ...completionArgs], programName, parser, completionParsers.completionCommand, stdout, stderr, onCompletion, onError, availableShells, colors, maxWidth, completionMode, completionName);
        } else {
          const singularMatchExact = completionName === "singular" || completionName === "both" ? arg === "--completion" : false;
          const pluralMatchExact = completionName === "plural" || completionName === "both" ? arg === "--completions" : false;
          if (singularMatchExact || pluralMatchExact) {
            const shell = i + 1 < args.length ? args[i + 1] : "";
            const completionArgs = i + 1 < args.length ? args.slice(i + 2) : [];
            return handleCompletion([shell, ...completionArgs], programName, parser, completionParsers.completionCommand, stdout, stderr, onCompletion, onError, availableShells, colors, maxWidth, completionMode, completionName);
          }
        }
      }
  }
  const augmentedParser = help === "none" && version === "none" && completion === "none" ? parser : combineWithHelpVersion(parser, helpParsers, versionParsers, completionParsers, {
    helpGroup,
    versionGroup,
    completionGroup
  });
  const handleResult = (result) => {
    const classified = classifyResult(result, args);
    switch (classified.type) {
      case "success":
        return classified.value;
      case "version":
        stdout(versionValue);
        try {
          return onVersion(0);
        } catch {
          return onVersion();
        }
      case "completion":
        throw new RunParserError("Completion should be handled by early return");
      case "help": {
        let helpGeneratorParser;
        const helpAsCommand = help === "command" || help === "both";
        const versionAsCommand = version === "command" || version === "both";
        const completionAsCommand = completion === "command" || completion === "both";
        const helpAsOption = help === "option" || help === "both";
        const versionAsOption = version === "option" || version === "both";
        const completionAsOption = completion === "option" || completion === "both";
        const requestedCommand = classified.commands[0];
        if ((requestedCommand === "completion" || requestedCommand === "completions") && completionAsCommand && completionParsers.completionCommand)
          helpGeneratorParser = completionParsers.completionCommand;
        else if (requestedCommand === "help" && helpAsCommand && helpParsers.helpCommand)
          helpGeneratorParser = helpParsers.helpCommand;
        else if (requestedCommand === "version" && versionAsCommand && versionParsers.versionCommand)
          helpGeneratorParser = versionParsers.versionCommand;
        else {
          const commandParsers = [parser];
          const groupedMeta = {};
          const ungroupedMeta = [];
          const addMeta = (p, groupLabel) => {
            if (groupLabel)
              (groupedMeta[groupLabel] ??= []).push(p);
            else
              ungroupedMeta.push(p);
          };
          if (helpAsCommand && helpParsers.helpCommand)
            addMeta(helpParsers.helpCommand, helpGroup);
          if (versionAsCommand && versionParsers.versionCommand)
            addMeta(versionParsers.versionCommand, versionGroup);
          if (completionAsCommand && completionParsers.completionCommand)
            addMeta(completionParsers.completionCommand, completionGroup);
          commandParsers.push(...ungroupedMeta);
          for (const [label, parsers] of Object.entries(groupedMeta))
            if (parsers.length === 1)
              commandParsers.push(group(label, parsers[0]));
            else
              commandParsers.push(group(label, longestMatch(...parsers)));
          if (helpAsOption && helpParsers.helpOption)
            commandParsers.push(helpParsers.helpOption);
          if (versionAsOption && versionParsers.versionOption)
            commandParsers.push(versionParsers.versionOption);
          if (completionAsOption && completionParsers.completionOption)
            commandParsers.push(completionParsers.completionOption);
          if (commandParsers.length === 1)
            helpGeneratorParser = commandParsers[0];
          else if (commandParsers.length === 2)
            helpGeneratorParser = longestMatch(commandParsers[0], commandParsers[1]);
          else
            helpGeneratorParser = longestMatch(...commandParsers);
        }
        const reportInvalidHelpCommand = (validationError) => {
          stderr(`Usage: ${indentLines2(formatUsage(programName, augmentedParser.usage, {
            colors,
            maxWidth: maxWidth == null ? undefined : maxWidth - 7,
            expandCommands: true
          }), 7)}`);
          const errorMessage = formatMessage(validationError, {
            colors,
            quotes: !colors
          });
          stderr(`Error: ${errorMessage}`);
          return onError(1);
        };
        if (classified.commands.length > 0) {
          let validationContext = {
            buffer: [...classified.commands],
            optionsTerminated: false,
            state: helpGeneratorParser.initialState,
            usage: helpGeneratorParser.usage
          };
          const processStep = (stepResult) => {
            if (!stepResult.success)
              return stepResult.error;
            if (stepResult.consumed.length < 1)
              return message`Unexpected option or subcommand: ${optionName(validationContext.buffer[0])}.`;
            validationContext = {
              ...validationContext,
              buffer: stepResult.next.buffer,
              optionsTerminated: stepResult.next.optionsTerminated,
              state: stepResult.next.state,
              usage: stepResult.next.usage ?? validationContext.usage
            };
            return validationContext.buffer.length > 0 ? "continue" : null;
          };
          let validationResult = "continue";
          while (validationResult === "continue") {
            const stepResult = helpGeneratorParser.parse(validationContext);
            if (stepResult instanceof Promise) {
              const asyncValidate = async (result$1) => {
                let res = processStep(result$1);
                while (res === "continue") {
                  const next = helpGeneratorParser.parse(validationContext);
                  const resolved = next instanceof Promise ? await next : next;
                  res = processStep(resolved);
                }
                if (res != null)
                  return reportInvalidHelpCommand(res);
                const docOrPromise$1 = getDocPage(helpGeneratorParser, classified.commands);
                return docOrPromise$1 instanceof Promise ? docOrPromise$1.then(displayHelp) : displayHelp(docOrPromise$1);
              };
              return stepResult.then(asyncValidate);
            }
            validationResult = processStep(stepResult);
          }
          if (validationResult != null)
            return reportInvalidHelpCommand(validationResult);
        }
        const displayHelp = (doc) => {
          if (doc != null) {
            const isMetaCommandHelp = (completionName === "singular" || completionName === "both" ? requestedCommand === "completion" : false) || (completionName === "plural" || completionName === "both" ? requestedCommand === "completions" : false) || requestedCommand === "help" || requestedCommand === "version";
            const isSubcommandHelp = classified.commands.length > 0;
            const isTopLevel = !isSubcommandHelp;
            const shouldOverride = !isMetaCommandHelp && !isSubcommandHelp;
            const augmentedDoc = {
              ...doc,
              brief: shouldOverride ? brief ?? doc.brief : doc.brief,
              description: shouldOverride ? description ?? doc.description : doc.description,
              examples: isTopLevel && !isMetaCommandHelp ? examples ?? doc.examples : undefined,
              author: isTopLevel && !isMetaCommandHelp ? author ?? doc.author : undefined,
              bugs: isTopLevel && !isMetaCommandHelp ? bugs ?? doc.bugs : undefined,
              footer: shouldOverride ? footer ?? doc.footer : doc.footer ?? footer
            };
            stdout(formatDocPage(programName, augmentedDoc, {
              colors,
              maxWidth,
              showDefault,
              showChoices
            }));
          }
          try {
            return onHelp(0);
          } catch {
            return onHelp();
          }
        };
        const docOrPromise = getDocPage(helpGeneratorParser, classified.commands);
        if (docOrPromise instanceof Promise)
          return docOrPromise.then(displayHelp);
        return displayHelp(docOrPromise);
      }
      case "error": {
        const displayError = (doc, currentAboveError) => {
          let effectiveAboveError = currentAboveError;
          if (effectiveAboveError === "help")
            if (doc == null)
              effectiveAboveError = "usage";
            else {
              const augmentedDoc = {
                ...doc,
                brief: brief ?? doc.brief,
                description: description ?? doc.description,
                examples: examples ?? doc.examples,
                author: author ?? doc.author,
                bugs: bugs ?? doc.bugs,
                footer: footer ?? doc.footer
              };
              stderr(formatDocPage(programName, augmentedDoc, {
                colors,
                maxWidth,
                showDefault,
                showChoices
              }));
            }
          if (effectiveAboveError === "usage")
            stderr(`Usage: ${indentLines2(formatUsage(programName, augmentedParser.usage, {
              colors,
              maxWidth: maxWidth == null ? undefined : maxWidth - 7,
              expandCommands: true
            }), 7)}`);
          const errorMessage = formatMessage(classified.error, {
            colors,
            quotes: !colors
          });
          stderr(`Error: ${errorMessage}`);
          return onError(1);
        };
        if (aboveError === "help") {
          const parserForDoc = args.length < 1 ? augmentedParser : parser;
          const docOrPromise = getDocPage(parserForDoc, args);
          if (docOrPromise instanceof Promise)
            return docOrPromise.then((doc) => displayError(doc, aboveError));
          return displayError(docOrPromise, aboveError);
        }
        return displayError(undefined, aboveError);
      }
      default:
        throw new RunParserError("Unexpected parse result type");
    }
  };
  if (parser.$mode === "async")
    return parseAsync(augmentedParser, args).then(handleResult);
  else {
    const result = parseSync(augmentedParser, args);
    return handleResult(result);
  }
}
var RunParserError = class extends Error {
  constructor(message$1) {
    super(message$1);
    this.name = "RunParserError";
  }
};
function indentLines2(text$1, indent) {
  return text$1.split(`
`).join(`
` + " ".repeat(indent));
}

// node_modules/@optique/run/dist/run.js
import path from "node:path";
import process2 from "node:process";
function run(parserOrProgram, options = {}) {
  return runImpl(parserOrProgram, options);
}
function runImpl(parserOrProgram, options = {}) {
  const isProgram = "parser" in parserOrProgram && "metadata" in parserOrProgram;
  let parser;
  let programNameFromProgram;
  let programMetadata;
  if (isProgram) {
    const program = parserOrProgram;
    parser = program.parser;
    programNameFromProgram = program.metadata.name;
    programMetadata = {
      brief: program.metadata.brief,
      description: program.metadata.description,
      examples: program.metadata.examples,
      author: program.metadata.author,
      bugs: program.metadata.bugs,
      footer: program.metadata.footer
    };
  } else
    parser = parserOrProgram;
  const { programName = programNameFromProgram ?? path.basename(process2.argv[1] || "cli"), args = process2.argv.slice(2), colors = process2.stdout.isTTY, maxWidth = process2.stdout.columns, showDefault, showChoices, help, version, completion, aboveError = "usage", errorExitCode = 1, brief = programMetadata?.brief, description = programMetadata?.description, examples = programMetadata?.examples, author = programMetadata?.author, bugs = programMetadata?.bugs, footer = programMetadata?.footer } = options;
  const helpConfig = help ? typeof help === "string" ? {
    mode: help,
    onShow: () => process2.exit(0)
  } : {
    mode: help.mode,
    group: help.group,
    onShow: () => process2.exit(0)
  } : undefined;
  const versionConfig = (() => {
    if (!version)
      return;
    if (typeof version === "string")
      return {
        mode: "option",
        value: version,
        onShow: () => process2.exit(0)
      };
    const mode = version.mode ?? "option";
    if (mode === "command" || mode === "both")
      return {
        mode,
        value: version.value,
        group: version.group,
        onShow: () => process2.exit(0)
      };
    return {
      mode,
      value: version.value,
      onShow: () => process2.exit(0)
    };
  })();
  const completionConfig = (() => {
    if (!completion)
      return;
    const onShow = () => process2.exit(0);
    if (typeof completion === "string")
      return {
        mode: completion,
        name: "both",
        helpVisibility: "both",
        onShow
      };
    const mode = completion.mode ?? "both";
    const shells = completion.shells;
    const cGroup = completion.group;
    if (completion.name === "singular")
      return {
        mode,
        shells,
        ...cGroup != null && { group: cGroup },
        name: "singular",
        helpVisibility: completion.helpVisibility ?? "singular",
        onShow
      };
    if (completion.name === "plural")
      return {
        mode,
        shells,
        ...cGroup != null && { group: cGroup },
        name: "plural",
        helpVisibility: completion.helpVisibility ?? "plural",
        onShow
      };
    return {
      mode,
      shells,
      ...cGroup != null && { group: cGroup },
      name: "both",
      helpVisibility: completion.helpVisibility ?? "both",
      onShow
    };
  })();
  return runParser(parser, programName, args, {
    stderr(line) {
      process2.stderr.write(`${line}
`);
    },
    stdout(line) {
      process2.stdout.write(`${line}
`);
    },
    colors,
    maxWidth,
    showDefault,
    showChoices,
    help: helpConfig,
    version: versionConfig,
    completion: completionConfig,
    aboveError,
    brief,
    description,
    examples,
    author,
    bugs,
    footer,
    onError() {
      return process2.exit(errorExitCode);
    }
  });
}

// src/cli.ts
init_dist();
// package.json
var package_default = {
  name: "agentbox",
  version: "0.1.0",
  description: "Secure, isolated development environments for AI coding agents",
  exports: {
    ".": {
      types: "./src/index.ts",
      default: "./dist/index.js"
    }
  },
  type: "module",
  bin: {
    agentbox: "dist/cli.js"
  },
  scripts: {
    build: "bun build src/cli.ts --outfile dist/cli.js --target node --format esm && bun build src/index.ts --outfile dist/index.js --target node --format esm && sed -i '1i#!/usr/bin/env node' dist/cli.js",
    typecheck: "tsc --noEmit",
    test: "bun test",
    lint: "oxlint src/",
    fmt: "oxfmt --write src/",
    "fmt:check": "oxfmt --check src/",
    release: "bun scripts/release.ts"
  },
  files: [
    "src/",
    "dist/"
  ],
  license: "MIT",
  devDependencies: {
    "@types/bun": "^1.2.0",
    oxfmt: "^0.40.0",
    oxlint: "^1.55.0"
  },
  peerDependencies: {
    typescript: "^5.0.0"
  },
  dependencies: {
    "@clack/prompts": "^1.1.0",
    "@optique/core": "^0.10.7",
    "@optique/run": "^0.10.7",
    chalk: "^5.6.2",
    "ts-pattern": "^5.9.0",
    zod: "^4.3.6"
  }
};

// src/cli.ts
init_exec();
var VERSION = package_default.version;
var newCmd = command("new", object({
  cmd: constant("new"),
  branch: optional(argument(string(), { description: message`Branch name or existing branch` })),
  base: optional(argument(string(), { description: message`Base branch to create from` })),
  mode: optional(option("-m", "--mode", string(), { description: message`tmux mode to launch` })),
  noTmux: option("--no-tmux", {
    description: message`Create worktree without starting tmux`
  }),
  trust: option("--trust", {
    description: message`Trust environment (run host-side operations)`
  }),
  untrusted: option("--untrusted", {
    description: message`Skip host-side operations like direnv`
  }),
  useLocalBranch: option("--use-local-branch", {
    description: message`Auto-select local branch version when versions differ`
  })
}), { description: message`Create a new agent (worktree + container + tmux)` });
var attachCmd = command("attach", object({
  cmd: constant("attach"),
  name: optional(argument(string(), { description: message`Agent name` })),
  mode: optional(option("-m", "--mode", string(), { description: message`tmux mode to launch` })),
  trust: option("--trust", {
    description: message`Trust environment (run host-side operations)`
  }),
  untrusted: option("--untrusted", {
    description: message`Skip host-side operations like direnv`
  })
}), { description: message`Attach to an existing agent's tmux session` });
var stopCmd = command("stop", object({
  cmd: constant("stop"),
  name: optional(argument(string(), { description: message`Agent name` }))
}), { description: message`Stop agent container, preserve worktree` });
var rmCmd = command("rm", object({
  cmd: constant("rm"),
  names: multiple(argument(string(), { description: message`Agent name(s)` })),
  force: option("-f", "--force", { description: message`Skip confirmation` })
}), { description: message`Remove agent entirely (container + worktree)` });
var listCmd = command("list", object({
  cmd: constant("list")
}), { description: message`List all agents with status` });
var checkoutCmd = command("checkout", object({
  cmd: constant("checkout"),
  name: optional(argument(string(), { description: message`Agent name` }))
}), { description: message`Fetch agent's branch into main repo` });
var checkVmCmd = command("check-vm", object({
  cmd: constant("check-vm")
}), { description: message`Verify k3s/Kata/Cloud Hypervisor setup` });
var cacheCmd = command("cache", object({
  cmd: constant("cache")
}), { description: message`Pre-cache docker images for fast startup` });
var logsCmd = command("logs", object({
  cmd: constant("logs"),
  name: optional(argument(string(), { description: message`Agent name` })),
  follow: option("-f", "--follow", { description: message`Follow log output` }),
  init: option("--init", { description: message`Show init container logs (k3s only)` })
}), { description: message`Display agent container logs` });
var execCmd = command("exec", object({
  cmd: constant("exec"),
  name: optional(argument(string(), { description: message`Agent name` })),
  command: multiple(argument(string(), { description: message`Command to run (after --)` }))
}), { description: message`Execute a command inside an agent container` });
var parser = or(newCmd, attachCmd, stopCmd, rmCmd, listCmd, checkoutCmd, checkVmCmd, cacheCmd, logsCmd, execCmd);
var program = defineProgram({
  parser,
  metadata: {
    name: "agentbox",
    version: VERSION,
    brief: message`Secure, isolated development environments for AI coding agents`
  }
});
async function dispatch() {
  const result = run(program, {
    help: { mode: "both" },
    version: { mode: "both", value: VERSION }
  });
  const cmd = await Promise.resolve().then(() => (init_commands(), exports_commands));
  return M(result).with({ cmd: "new" }, (r2) => cmd.cmdNew({
    branch: r2.branch,
    base: r2.base,
    mode: r2.mode,
    noTmux: r2.noTmux,
    trust: r2.trust,
    untrusted: r2.untrusted,
    useLocalBranch: r2.useLocalBranch
  })).with({ cmd: "attach" }, (r2) => cmd.cmdAttach(r2.name, r2.mode, r2.trust, r2.untrusted)).with({ cmd: "stop" }, (r2) => cmd.cmdStop(r2.name)).with({ cmd: "rm" }, (r2) => cmd.cmdRm(r2.names, r2.force)).with({ cmd: "list" }, () => cmd.cmdList()).with({ cmd: "checkout" }, (r2) => cmd.cmdCheckout(r2.name)).with({ cmd: "check-vm" }, () => cmd.cmdCheckVm()).with({ cmd: "cache" }, () => cmd.cmdCache()).with({ cmd: "logs" }, (r2) => cmd.cmdLogs(r2.name, r2.follow, r2.init)).with({ cmd: "exec" }, (r2) => cmd.cmdExec(r2.name, r2.command)).exhaustive();
}
dispatch().then((code) => {
  process.exitCode = code;
}, (err) => {
  console.error(errorMessage(err));
  process.exitCode = 1;
});
