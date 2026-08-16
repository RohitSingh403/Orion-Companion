import K from "fs";
import q from "path";
import Ne from "util";
import Pe from "child_process";
import Ie from "os";
function Ce(t, s) {
  for (var i = 0; i < s.length; i++) {
    const e = s[i];
    if (typeof e != "string" && !Array.isArray(e)) {
      for (const r in e)
        if (r !== "default" && !(r in t)) {
          const n = Object.getOwnPropertyDescriptor(e, r);
          n && Object.defineProperty(t, r, n.get ? n : {
            enumerable: !0,
            get: () => e[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
function Fe(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var H = { exports: {} };
function xe(t) {
  return t.charAt(0) === "/";
}
function De(t) {
  var s = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/, i = s.exec(t), e = i[1] || "", r = !!(e && e.charAt(1) !== ":");
  return !!(i[2] || r);
}
H.exports = process.platform === "win32" ? De : xe;
H.exports.posix = xe;
H.exports.win32 = De;
var Ke = H.exports, Y, le;
function He() {
  if (le) return Y;
  le = 1;
  var t = Ne, s = q, i = Pe.spawn, e = "HKLM", r = "HKCU", n = "HKCR", o = "HKU", u = "HKCC", c = [e, r, n, o, u], g = "REG_SZ", y = "REG_MULTI_SZ", v = "REG_EXPAND_SZ", k = "REG_DWORD", L = "REG_QWORD", se = "REG_BINARY", ue = "REG_NONE", oe = [g, y, v, k, L, se, ue], Me = "", Ue = /(\\[a-zA-Z0-9_\s]+)*/, $e = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/, ae = /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;
  function $(_, a) {
    if (!(this instanceof $))
      return new $(_, a);
    Error.captureStackTrace(this, $), this.__defineGetter__("name", function() {
      return $.name;
    }), this.__defineGetter__("message", function() {
      return _;
    }), this.__defineGetter__("code", function() {
      return a;
    });
  }
  t.inherits($, Error);
  function T(_) {
    var a = { stdout: "", stderr: "" };
    return _.stdout.on("data", function(l) {
      a.stdout += l.toString();
    }), _.stderr.on("data", function(l) {
      a.stderr += l.toString();
    }), a;
  }
  function b(_, a, l) {
    var f = l.stdout.trim(), h = l.stderr.trim(), p = t.format(`%s command exited with code %d:
%s
%s`, _, a, f, h);
    return new $(p, a);
  }
  function qe(_) {
    if (_ == "x64")
      return "64";
    if (_ == "x86")
      return "32";
    throw new Error("illegal architecture: " + _ + " (use x86 or x64)");
  }
  function O(_, a) {
    a && _.push("/reg:" + qe(a));
  }
  function G() {
    return process.platform === "win32" ? s.join(process.env.windir, "system32", "reg.exe") : "REG";
  }
  function I(_, a, l, f, h, p, d) {
    if (!(this instanceof I))
      return new I(_, a, l, f, h, p, d);
    var A = _, m = a, w = l, N = f, R = h, P = p, S = d;
    this.__defineGetter__("host", function() {
      return A;
    }), this.__defineGetter__("hive", function() {
      return m;
    }), this.__defineGetter__("key", function() {
      return w;
    }), this.__defineGetter__("name", function() {
      return N;
    }), this.__defineGetter__("type", function() {
      return R;
    }), this.__defineGetter__("value", function() {
      return P;
    }), this.__defineGetter__("arch", function() {
      return S;
    });
  }
  t.inherits(I, Object);
  function E(_) {
    if (!(this instanceof E))
      return new E(_);
    var a = _ || {}, l = "" + (a.host || ""), f = "" + (a.hive || e), h = "" + (a.key || ""), p = a.arch || null;
    if (this.__defineGetter__("host", function() {
      return l;
    }), this.__defineGetter__("hive", function() {
      return f;
    }), this.__defineGetter__("key", function() {
      return h;
    }), this.__defineGetter__("path", function() {
      return (l.length == 0 ? "" : "\\\\" + l + "\\") + f + h;
    }), this.__defineGetter__("arch", function() {
      return p;
    }), this.__defineGetter__("parent", function() {
      var d = h.lastIndexOf("\\");
      return new E({
        host: this.host,
        hive: this.hive,
        key: d == -1 ? "" : h.substring(0, d),
        arch: this.arch
      });
    }), c.indexOf(f) == -1)
      throw new Error("illegal hive specified.");
    if (!Ue.test(h))
      throw new Error("illegal key specified.");
    if (p && p != "x64" && p != "x86")
      throw new Error("illegal architecture specified (use x86 or x64)");
  }
  return E.HKLM = e, E.HKCU = r, E.HKCR = n, E.HKU = o, E.HKCC = u, E.HIVES = c, E.REG_SZ = g, E.REG_MULTI_SZ = y, E.REG_EXPAND_SZ = v, E.REG_DWORD = k, E.REG_QWORD = L, E.REG_BINARY = se, E.REG_NONE = ue, E.REG_TYPES = oe, E.DEFAULT_VALUE = Me, E.prototype.values = function(a) {
    if (typeof a != "function")
      throw new TypeError("must specify a callback");
    var l = ["QUERY", this.path];
    O(l, this.arch);
    var f = i(G(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = "", p = this, d = null, A = T(f);
    return f.on("close", function(m) {
      if (!d)
        if (m !== 0)
          a(b("QUERY", m, A), null);
        else {
          for (var w = [], N = [], R = h.split(`
`), P = 0, S = 0, x = R.length; S < x; S++) {
            var D = R[S].trim();
            D.length > 0 && (P != 0 && w.push(D), ++P);
          }
          for (var S = 0, x = w.length; S < x; S++) {
            var M = ae.exec(w[S]), F, U, C;
            M && (F = M[1].trim(), U = M[2].trim(), C = M[3], N.push(new I(p.host, p.hive, p.key, F, U, C, p.arch)));
          }
          a(null, N);
        }
    }), f.stdout.on("data", function(m) {
      h += m.toString();
    }), f.on("error", function(m) {
      d = m, a(m);
    }), this;
  }, E.prototype.keys = function(a) {
    if (typeof a != "function")
      throw new TypeError("must specify a callback");
    var l = ["QUERY", this.path];
    O(l, this.arch);
    var f = i(G(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = "", p = this, d = null, A = T(f);
    return f.on("close", function(m) {
      d || m !== 0 && a(b("QUERY", m, A), null);
    }), f.stdout.on("data", function(m) {
      h += m.toString();
    }), f.stdout.on("end", function() {
      for (var m = [], w = [], N = h.split(`
`), R = 0, P = N.length; R < P; R++) {
        var S = N[R].trim();
        S.length > 0 && m.push(S);
      }
      for (var R = 0, P = m.length; R < P; R++) {
        var x = $e.exec(m[R]), D;
        x && (x[1], D = x[2], D && D !== p.key && w.push(new E({
          host: p.host,
          hive: p.hive,
          key: D,
          arch: p.arch
        })));
      }
      a(null, w);
    }), f.on("error", function(m) {
      d = m, a(m);
    }), this;
  }, E.prototype.get = function(a, l) {
    if (typeof l != "function")
      throw new TypeError("must specify a callback");
    var f = ["QUERY", this.path];
    a == "" ? f.push("/ve") : f = f.concat(["/v", a]), O(f, this.arch);
    var h = i(G(), f, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = "", d = this, A = null, m = T(h);
    return h.on("close", function(w) {
      if (!A)
        if (w !== 0)
          l(b("QUERY", w, m), null);
        else {
          for (var N = [], R = null, P = p.split(`
`), S = 0, x = 0, D = P.length; x < D; x++) {
            var M = P[x].trim();
            M.length > 0 && (S != 0 && N.push(M), ++S);
          }
          var F = N[N.length - 1] || "", U = ae.exec(F), C, ce, fe;
          U && (C = U[1].trim(), ce = U[2].trim(), fe = U[3], R = new I(d.host, d.hive, d.key, C, ce, fe, d.arch)), l(null, R);
        }
    }), h.stdout.on("data", function(w) {
      p += w.toString();
    }), h.on("error", function(w) {
      A = w, l(w);
    }), this;
  }, E.prototype.set = function(a, l, f, h) {
    if (typeof h != "function")
      throw new TypeError("must specify a callback");
    if (oe.indexOf(l) == -1)
      throw Error("illegal type specified.");
    var p = ["ADD", this.path];
    a == "" ? p.push("/ve") : p = p.concat(["/v", a]), p = p.concat(["/t", l, "/d", f, "/f"]), O(p, this.arch);
    var d = i(G(), p, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), A = null, m = T(d);
    return d.on("close", function(w) {
      A || h(w !== 0 ? b("ADD", w, m) : null);
    }), d.stdout.on("data", function(w) {
    }), d.on("error", function(w) {
      A = w, h(w);
    }), this;
  }, E.prototype.remove = function(a, l) {
    if (typeof l != "function")
      throw new TypeError("must specify a callback");
    var f = a ? ["DELETE", this.path, "/f", "/v", a] : ["DELETE", this.path, "/f", "/ve"];
    O(f, this.arch);
    var h = i(G(), f, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = null, d = T(h);
    return h.on("close", function(A) {
      p || (A !== 0 ? l(b("DELETE", A, d), null) : l(null));
    }), h.stdout.on("data", function(A) {
    }), h.on("error", function(A) {
      p = A, l(A);
    }), this;
  }, E.prototype.clear = function(a) {
    if (typeof a != "function")
      throw new TypeError("must specify a callback");
    var l = ["DELETE", this.path, "/f", "/va"];
    O(l, this.arch);
    var f = i(G(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = null, p = T(f);
    return f.on("close", function(d) {
      h || (d !== 0 ? a(b("DELETE", d, p), null) : a(null));
    }), f.stdout.on("data", function(d) {
    }), f.on("error", function(d) {
      h = d, a(d);
    }), this;
  }, E.prototype.erase = E.prototype.clear, E.prototype.destroy = function(a) {
    if (typeof a != "function")
      throw new TypeError("must specify a callback");
    var l = ["DELETE", this.path, "/f"];
    O(l, this.arch);
    var f = i(G(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = null, p = T(f);
    return f.on("close", function(d) {
      h || (d !== 0 ? a(b("DELETE", d, p), null) : a(null));
    }), f.stdout.on("data", function(d) {
    }), f.on("error", function(d) {
      h = d, a(d);
    }), this;
  }, E.prototype.create = function(a) {
    if (typeof a != "function")
      throw new TypeError("must specify a callback");
    var l = ["ADD", this.path, "/f"];
    O(l, this.arch);
    var f = i(G(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = null, p = T(f);
    return f.on("close", function(d) {
      h || (d !== 0 ? a(b("ADD", d, p), null) : a(null));
    }), f.stdout.on("data", function(d) {
    }), f.on("error", function(d) {
      h = d, a(d);
    }), this;
  }, E.prototype.keyExists = function(a) {
    return this.values(function(l, f) {
      if (l)
        return l.code == 1 ? a(null, !1) : a(l);
      a(null, !0);
    }), this;
  }, E.prototype.valueExists = function(a, l) {
    return this.get(a, function(f, h) {
      if (f)
        return f.code == 1 ? l(null, !1) : l(f);
      l(null, !0);
    }), this;
  }, Y = E, Y;
}
var j, de;
function Ye() {
  if (de) return j;
  de = 1;
  var t, s, i, e;
  return s = K, i = q, t = He(), e = new t({
    hive: process.arch === "x64" ? t.HKLM : t.HKCU,
    key: process.arch === "x64" ? "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run" : "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  }), j = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    // Returns a Promise
    enable: function({ appName: r, appPath: n, isHiddenOnLaunch: o }) {
      return new Promise(function(u, c) {
        var g, y, v, k;
        return y = n, g = "", k = i.join(i.dirname(process.execPath), "..", "update.exe"), ((v = process.versions) != null ? v.electron : void 0) != null && s.existsSync(k) ? (y = k, g = ` --processStart "${i.basename(process.execPath)}"`, o && (g += ' --process-start-args "--hidden"')) : o && (g += " --hidden"), e.set(r, t.REG_SZ, `"${y}"${g}`, function(L) {
          return L != null ? c(L) : u();
        });
      });
    },
    // appName - {String}
    // Returns a Promise
    disable: function(r) {
      return new Promise(function(n, o) {
        return e.remove(r, function(u) {
          return u != null ? u.message.indexOf("The system was unable to find the specified registry key or value") !== -1 ? n(!1) : o(u) : n();
        });
      });
    },
    // appName - {String}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(r) {
      return new Promise(function(n, o) {
        return e.get(r, function(u, c) {
          return u != null ? n(!1) : n(c != null);
        });
      });
    }
  }, j;
}
var Z = {}, B = {}, he;
function je() {
  return he || (he = 1, function(t) {
    t.parse = function(e) {
      if (e.length != 0) {
        var r = s.call({
          value: e,
          index: 0
        });
        return r;
      }
    };
    function s() {
      var e = this.value[this.index];
      switch (e) {
        case "{":
          return t.ArrayParser.call(this);
        case '"':
          return t.StringParser.call(this);
        case "a":
          if (this.value.substring(this.index, this.index + 5) == "alias")
            return t.AliasParser.call(this);
          break;
        case "«":
          if (this.value.substring(this.index, this.index + 5) == "«data")
            return t.DataParser.call(this);
          break;
      }
      return isNaN(e) ? t.UndefinedParser.call(this) : t.NumberParser.call(this);
    }
    t.AliasParser = function() {
      return this.index += 6, "/Volumes/" + t.StringParser.call(this).replace(/:/g, "/");
    }, t.ArrayParser = function() {
      for (var e = [], r = this.value[++this.index]; r != "}"; )
        e.push(s.call(this)), this.value[this.index] == "," && (this.index += 2), r = this.value[this.index];
      return this.index++, e;
    }, t.DataParser = function() {
      var e = t.UndefinedParser.call(this);
      e = e.substring(6, e.length - 1);
      var r = e.substring(0, 4);
      e = e.substring(4, e.length);
      for (var n = new Buffer(e.length / 2), o = 0, u = 0, c = e.length; u < c; u += 2)
        n[o++] = parseInt(e[u] + e[u + 1], 16);
      return n.type = r, n;
    }, t.NumberParser = function() {
      return Number(t.UndefinedParser.call(this));
    }, t.StringParser = function(e) {
      for (var r = "", n = ++this.index, o = this.value[n++]; o != '"'; )
        o == "\\" && (r += this.value.substring(this.index, n - 1), this.index = n++), o = this.value[n++];
      return r += this.value.substring(this.index, n - 1), this.index = n, r;
    };
    var i = /}|,|\n/;
    t.UndefinedParser = function() {
      for (var e = this.index, r = this.value[e++]; !i.test(r); )
        r = this.value[e++];
      var n = this.value.substring(this.index, e - 1);
      return this.index = e - 1, n;
    };
  }(B)), B;
}
var pe;
function Ze() {
  return pe || (pe = 1, function(t) {
    var s = Pe.spawn;
    t.Parsers = je();
    var i = t.Parsers.parse;
    t.osascript = "osascript", t.execFile = function(o, u, c) {
      return Array.isArray(u) || (c = u, u = []), e(o, u, c);
    }, t.execString = function(o, u) {
      return e(o, u);
    };
    function e(n, o, u) {
      var c = !1;
      Array.isArray(o) || (u = o, o = [], c = !0), o.push("-ss"), c || o.push(n);
      var g = s(t.osascript, o);
      r(g.stdout), r(g.stderr), g.on("exit", function(y) {
        var v = i(g.stdout.body), k;
        y && (k = new Error(g.stderr.body), k.appleScript = n, k.exitCode = y), u && u(k, v, g.stderr.body);
      }), c && (g.stdin.write(n), g.stdin.end());
    }
    function r(n) {
      n.body = "", n.setEncoding("utf8"), n.on("data", function(o) {
        n.body += o;
      });
    }
  }(Z)), Z;
}
var W, ve;
function Te() {
  if (ve) return W;
  ve = 1;
  const s = Ie.homedir();
  return W = (i) => {
    if (typeof i != "string")
      throw new TypeError(`Expected a string, got ${typeof i}`);
    return s ? i.replace(/^~(?=$|\/|\\)/, s) : i;
  }, W;
}
var V, ye;
function Be() {
  if (ye) return V;
  ye = 1;
  const { promisify: t } = Ne, s = K;
  return V = (e) => {
    if (!e)
      e = { mode: 511, fs: s };
    else if (typeof e == "object")
      e = { mode: 511, fs: s, ...e };
    else if (typeof e == "number")
      e = { mode: e, fs: s };
    else if (typeof e == "string")
      e = { mode: parseInt(e, 8), fs: s };
    else
      throw new TypeError("invalid options argument");
    return e.mkdir = e.mkdir || e.fs.mkdir || s.mkdir, e.mkdirAsync = t(e.mkdir), e.stat = e.stat || e.fs.stat || s.stat, e.statAsync = t(e.stat), e.statSync = e.statSync || e.fs.statSync || s.statSync, e.mkdirSync = e.mkdirSync || e.fs.mkdirSync || s.mkdirSync, e;
  }, V;
}
var Q, Ee;
function We() {
  if (Ee) return Q;
  Ee = 1;
  const t = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform, { resolve: s, parse: i } = q;
  return Q = (r) => {
    if (/\0/.test(r))
      throw Object.assign(
        new TypeError("path must be a string without null bytes"),
        {
          path: r,
          code: "ERR_INVALID_ARG_VALUE"
        }
      );
    if (r = s(r), t === "win32") {
      const n = /[*|"<>?:]/, { root: o } = i(r);
      if (n.test(r.substr(o.length)))
        throw Object.assign(new Error("Illegal characters in path."), {
          path: r,
          code: "EINVAL"
        });
    }
    return r;
  }, Q;
}
var X, _e;
function Ve() {
  if (_e) return X;
  _e = 1;
  const { dirname: t } = q, s = (e, r, n = void 0) => n === r ? Promise.resolve() : e.statAsync(r).then(
    (o) => o.isDirectory() ? n : void 0,
    // will fail later
    (o) => o.code === "ENOENT" ? s(e, t(r), r) : void 0
  ), i = (e, r, n = void 0) => {
    if (n !== r)
      try {
        return e.statSync(r).isDirectory() ? n : void 0;
      } catch (o) {
        return o.code === "ENOENT" ? i(e, t(r), r) : void 0;
      }
  };
  return X = { findMade: s, findMadeSync: i }, X;
}
var z, me;
function be() {
  if (me) return z;
  me = 1;
  const { dirname: t } = q, s = (e, r, n) => {
    r.recursive = !1;
    const o = t(e);
    return o === e ? r.mkdirAsync(e, r).catch((u) => {
      if (u.code !== "EISDIR")
        throw u;
    }) : r.mkdirAsync(e, r).then(() => n || e, (u) => {
      if (u.code === "ENOENT")
        return s(o, r).then((c) => s(e, r, c));
      if (u.code !== "EEXIST" && u.code !== "EROFS")
        throw u;
      return r.statAsync(e).then((c) => {
        if (c.isDirectory())
          return n;
        throw u;
      }, () => {
        throw u;
      });
    });
  }, i = (e, r, n) => {
    const o = t(e);
    if (r.recursive = !1, o === e)
      try {
        return r.mkdirSync(e, r);
      } catch (u) {
        if (u.code !== "EISDIR")
          throw u;
        return;
      }
    try {
      return r.mkdirSync(e, r), n || e;
    } catch (u) {
      if (u.code === "ENOENT")
        return i(e, r, i(o, r, n));
      if (u.code !== "EEXIST" && u.code !== "EROFS")
        throw u;
      try {
        if (!r.statSync(e).isDirectory())
          throw u;
      } catch {
        throw u;
      }
    }
  };
  return z = { mkdirpManual: s, mkdirpManualSync: i }, z;
}
var J, ge;
function Qe() {
  if (ge) return J;
  ge = 1;
  const { dirname: t } = q, { findMade: s, findMadeSync: i } = Ve(), { mkdirpManual: e, mkdirpManualSync: r } = be();
  return J = { mkdirpNative: (u, c) => (c.recursive = !0, t(u) === u ? c.mkdirAsync(u, c) : s(c, u).then((y) => c.mkdirAsync(u, c).then(() => y).catch((v) => {
    if (v.code === "ENOENT")
      return e(u, c);
    throw v;
  }))), mkdirpNativeSync: (u, c) => {
    if (c.recursive = !0, t(u) === u)
      return c.mkdirSync(u, c);
    const y = i(c, u);
    try {
      return c.mkdirSync(u, c), y;
    } catch (v) {
      if (v.code === "ENOENT")
        return r(u, c);
      throw v;
    }
  } }, J;
}
var ee, we;
function Xe() {
  if (we) return ee;
  we = 1;
  const t = K, i = (process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version).replace(/^v/, "").split("."), e = +i[0] > 10 || +i[0] == 10 && +i[1] >= 12;
  return ee = { useNative: e ? (o) => o.mkdir === t.mkdir : () => !1, useNativeSync: e ? (o) => o.mkdirSync === t.mkdirSync : () => !1 }, ee;
}
var re, Ae;
function ze() {
  if (Ae) return re;
  Ae = 1;
  const t = Be(), s = We(), { mkdirpNative: i, mkdirpNativeSync: e } = Qe(), { mkdirpManual: r, mkdirpManualSync: n } = be(), { useNative: o, useNativeSync: u } = Xe(), c = (y, v) => (y = s(y), v = t(v), o(v) ? i(y, v) : r(y, v)), g = (y, v) => (y = s(y), v = t(v), u(v) ? e(y, v) : n(y, v));
  return c.sync = g, c.native = (y, v) => i(s(y), t(v)), c.manual = (y, v) => r(s(y), t(v)), c.nativeSync = (y, v) => e(s(y), t(v)), c.manualSync = (y, v) => n(s(y), t(v)), re = c, re;
}
var te, Re;
function Oe() {
  if (Re) return te;
  Re = 1;
  var t, s;
  return t = K, s = ze(), te = {
    /* Public */
    // This is essentially enabling auto-launching
    // options - {Object}
    //   :data - {String}
    //   :directory - {String}
    //   :filePath - {String}
    // Returns a Promise
    createFile: function({ directory: i, filePath: e, data: r }) {
      return new Promise(function(n, o) {
        return s(i, function(u) {
          return u != null ? o(u) : t.writeFile(e, r, function(c) {
            return c != null ? o(c) : n();
          });
        });
      });
    },
    // filePath - {String}
    isEnabled: function(i) {
      return new Promise((e, r) => t.stat(i, function(n, o) {
        return n != null ? e(!1) : e(o != null);
      }));
    },
    // This is essentially disabling auto-launching
    // filePath - {String}
    // Returns a Promise
    removeFile: function(i) {
      return new Promise((e, r) => t.stat(i, function(n) {
        return n != null ? e() : t.unlink(i, function(o) {
          return o != null ? r(o) : e();
        });
      }));
    }
  }, te;
}
var ne, Se;
function Je() {
  if (Se) return ne;
  Se = 1;
  var t, s, i, e = [].indexOf;
  return t = Ze(), i = Te(), s = Oe(), ne = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    //   :mac - (Optional) {Object}
    //       :useLaunchAgent - (Optional) {Boolean}
    // Returns a Promise
    enable: function({ appName: r, appPath: n, isHiddenOnLaunch: o, mac: u }) {
      var c, g, y, v, k;
      return u.useLaunchAgent ? (y = [n], o && y.push("--hidden"), v = y.map(function(L) {
        return `    <string>${L}</string>`;
      }).join(`
`), c = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${r}</string>
  <key>ProgramArguments</key>
  <array>
  ${v}
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>`, s.createFile({
        data: c,
        directory: this.getDirectory(),
        filePath: this.getFilePath(r)
      })) : (g = o ? "true" : "false", k = `{path:"${n}", hidden:${g}, name:"${r}"}`, this.execApplescriptCommand(`make login item at end with properties ${k}`));
    },
    // appName - {String}
    // mac - {Object}
    //   :useLaunchAgent - {Object}
    // Returns a Promise
    disable: function(r, n) {
      return n.useLaunchAgent ? s.removeFile(this.getFilePath(r)) : this.execApplescriptCommand(`delete login item "${r}"`);
    },
    // appName - {String}
    // mac - {Object}
    //   :useLaunchAgent - {Object}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(r, n) {
      return n.useLaunchAgent ? s.isEnabled(this.getFilePath(r)) : this.execApplescriptCommand("get the name of every login item").then(function(o) {
        return o != null && e.call(o, r) >= 0;
      });
    },
    /* Private */
    // commandSuffix - {String}
    // Returns a Promise
    execApplescriptCommand: function(r) {
      return new Promise(function(n, o) {
        return t.execString(`tell application "System Events" to ${r}`, function(u, c) {
          return u != null ? o(u) : n(c);
        });
      });
    },
    // Returns a {String}
    getDirectory: function() {
      return i("~/Library/LaunchAgents/");
    },
    // appName - {String}
    // Returns a {String}
    getFilePath: function(r) {
      return `${this.getDirectory()}${r}.plist`;
    }
  }, ne;
}
var ie, ke;
function er() {
  if (ke) return ie;
  ke = 1;
  var t, s;
  return s = Te(), t = Oe(), ie = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    // Returns a Promise
    enable: function({ appName: i, appPath: e, isHiddenOnLaunch: r }) {
      var n, o;
      return o = r ? " --hidden" : "", n = `[Desktop Entry]
Type=Application
Version=1.0
Name=${i}
Comment=${i}startup script
Exec=${e}${o}
StartupNotify=false
Terminal=false`, t.createFile({
        data: n,
        directory: this.getDirectory(),
        filePath: this.getFilePath(i)
      });
    },
    // appName - {String}
    // Returns a Promise
    disable: function(i) {
      return t.removeFile(this.getFilePath(i));
    },
    // appName - {String}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(i) {
      return t.isEnabled(this.getFilePath(i));
    },
    /* Private */
    // Returns a {String}
    getDirectory: function() {
      return s("~/.config/autostart/");
    },
    // appName - {String}
    // Returns a {String}
    getFilePath: function(i) {
      return `${this.getDirectory()}${i}.desktop`;
    }
  }, ie;
}
var Ge;
Ge = Ke;
var Le = class {
  /* Public */
  // options - {Object}
  //   :isHidden - (Optional) {Boolean}
  //   :mac - (Optional) {Object}
  //       :useLaunchAgent - (Optional) {Boolean}. If `true`, use filed-based Launch Agent. Otherwise use AppleScript
  //           to add Login Item
  //   :name - {String}
  //   :path - (Optional) {String}
  constructor({ name: s, isHidden: i, mac: e, path: r }) {
    var n;
    if (this.enable = this.enable.bind(this), this.disable = this.disable.bind(this), this.isEnabled = this.isEnabled.bind(this), this.fixOpts = this.fixOpts.bind(this), s == null)
      throw new Error("You must specify a name");
    if (this.opts = {
      appName: s,
      isHiddenOnLaunch: i ?? !1,
      mac: e ?? {}
    }, n = typeof process < "u" && process !== null ? process.versions : void 0, r != null) {
      if (!Ge(r))
        throw new Error("path must be absolute");
      this.opts.appPath = r;
    } else if (n != null && (n.nw != null || n["node-webkit"] != null || n.electron != null))
      this.opts.appPath = process.execPath;
    else
      throw new Error("You must give a path (this is only auto-detected for NW.js and Electron apps)");
    if (this.fixOpts(), this.api = null, /^win/.test(process.platform))
      this.api = Ye();
    else if (/darwin/.test(process.platform))
      this.api = Je();
    else if (/linux/.test(process.platform))
      this.api = er();
    else
      throw new Error("Unsupported platform");
  }
  enable() {
    return this.api.enable(this.opts);
  }
  disable() {
    return this.api.disable(this.opts.appName, this.opts.mac);
  }
  isEnabled() {
    return this.api.isEnabled(this.opts.appName, this.opts.mac);
  }
  /* Private */
  // Corrects the path to point to the outer .app
  // path - {String}
  // macOptions - {Object}
  // Returns a {String}
  fixMacExecPath(s, i) {
    return s = s.replace(/(^.+?[^\/]+?\.app)\/Contents\/(Frameworks\/((\1|[^\/]+?) Helper)\.app\/Contents\/MacOS\/\3|MacOS\/Electron)/, "$1"), i.useLaunchAgent || (s = s.replace(/\.app\/Contents\/MacOS\/[^\/]*$/, ".app")), s;
  }
  fixOpts() {
    var s;
    if (this.opts.appPath = this.opts.appPath.replace(/\/$/, ""), /darwin/.test(process.platform) && (this.opts.appPath = this.fixMacExecPath(this.opts.appPath, this.opts.mac)), this.opts.appPath.indexOf("/") !== -1 ? (s = this.opts.appPath.split("/"), this.opts.appName = s[s.length - 1]) : this.opts.appPath.indexOf("\\") !== -1 && (s = this.opts.appPath.split("\\"), this.opts.appName = s[s.length - 1], this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4)), /darwin/.test(process.platform) && this.opts.appName.indexOf(".app", this.opts.appName.length - 4) !== -1)
      return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4);
  }
};
const rr = /* @__PURE__ */ Fe(Le), ar = /* @__PURE__ */ Ce({
  __proto__: null,
  default: rr
}, [Le]);
export {
  ar as i
};
