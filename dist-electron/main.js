import { app, BrowserWindow, globalShortcut, ipcMain, Notification, nativeImage, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import require$$0$2 from "fs";
import require$$0$1 from "path";
import require$$0 from "util";
import require$$2 from "child_process";
import require$$0$3 from "os";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var pathIsAbsolute = { exports: {} };
function posix(path2) {
  return path2.charAt(0) === "/";
}
function win32(path2) {
  var splitDeviceRe = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/;
  var result = splitDeviceRe.exec(path2);
  var device = result[1] || "";
  var isUnc = Boolean(device && device.charAt(1) !== ":");
  return Boolean(result[2] || isUnc);
}
pathIsAbsolute.exports = process.platform === "win32" ? win32 : posix;
pathIsAbsolute.exports.posix = posix;
pathIsAbsolute.exports.win32 = win32;
var pathIsAbsoluteExports = pathIsAbsolute.exports;
var registry;
var hasRequiredRegistry;
function requireRegistry() {
  if (hasRequiredRegistry) return registry;
  hasRequiredRegistry = 1;
  var util = require$$0, path2 = require$$0$1, spawn = require$$2.spawn, HKLM = "HKLM", HKCU = "HKCU", HKCR = "HKCR", HKU = "HKU", HKCC = "HKCC", HIVES = [HKLM, HKCU, HKCR, HKU, HKCC], REG_SZ = "REG_SZ", REG_MULTI_SZ = "REG_MULTI_SZ", REG_EXPAND_SZ = "REG_EXPAND_SZ", REG_DWORD = "REG_DWORD", REG_QWORD = "REG_QWORD", REG_BINARY = "REG_BINARY", REG_NONE = "REG_NONE", REG_TYPES = [REG_SZ, REG_MULTI_SZ, REG_EXPAND_SZ, REG_DWORD, REG_QWORD, REG_BINARY, REG_NONE], DEFAULT_VALUE = "", KEY_PATTERN = /(\\[a-zA-Z0-9_\s]+)*/, PATH_PATTERN = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/, ITEM_PATTERN = /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;
  function ProcessUncleanExitError(message, code) {
    if (!(this instanceof ProcessUncleanExitError))
      return new ProcessUncleanExitError(message, code);
    Error.captureStackTrace(this, ProcessUncleanExitError);
    this.__defineGetter__("name", function() {
      return ProcessUncleanExitError.name;
    });
    this.__defineGetter__("message", function() {
      return message;
    });
    this.__defineGetter__("code", function() {
      return code;
    });
  }
  util.inherits(ProcessUncleanExitError, Error);
  function captureOutput(child) {
    var output = { "stdout": "", "stderr": "" };
    child.stdout.on("data", function(data) {
      output["stdout"] += data.toString();
    });
    child.stderr.on("data", function(data) {
      output["stderr"] += data.toString();
    });
    return output;
  }
  function mkErrorMsg(registryCommand, code, output) {
    var stdout = output["stdout"].trim();
    var stderr = output["stderr"].trim();
    var msg = util.format("%s command exited with code %d:\n%s\n%s", registryCommand, code, stdout, stderr);
    return new ProcessUncleanExitError(msg, code);
  }
  function convertArchString(archString) {
    if (archString == "x64") {
      return "64";
    } else if (archString == "x86") {
      return "32";
    } else {
      throw new Error("illegal architecture: " + archString + " (use x86 or x64)");
    }
  }
  function pushArch(args, arch) {
    if (arch) {
      args.push("/reg:" + convertArchString(arch));
    }
  }
  function getRegExePath() {
    if (process.platform === "win32") {
      return path2.join(process.env.windir, "system32", "reg.exe");
    } else {
      return "REG";
    }
  }
  function RegistryItem(host, hive, key, name, type, value, arch) {
    if (!(this instanceof RegistryItem))
      return new RegistryItem(host, hive, key, name, type, value, arch);
    var _host = host, _hive = hive, _key = key, _name = name, _type = type, _value = value, _arch = arch;
    this.__defineGetter__("host", function() {
      return _host;
    });
    this.__defineGetter__("hive", function() {
      return _hive;
    });
    this.__defineGetter__("key", function() {
      return _key;
    });
    this.__defineGetter__("name", function() {
      return _name;
    });
    this.__defineGetter__("type", function() {
      return _type;
    });
    this.__defineGetter__("value", function() {
      return _value;
    });
    this.__defineGetter__("arch", function() {
      return _arch;
    });
  }
  util.inherits(RegistryItem, Object);
  function Registry(options) {
    if (!(this instanceof Registry))
      return new Registry(options);
    var _options = options || {}, _host = "" + (_options.host || ""), _hive = "" + (_options.hive || HKLM), _key = "" + (_options.key || ""), _arch = _options.arch || null;
    this.__defineGetter__("host", function() {
      return _host;
    });
    this.__defineGetter__("hive", function() {
      return _hive;
    });
    this.__defineGetter__("key", function() {
      return _key;
    });
    this.__defineGetter__("path", function() {
      return (_host.length == 0 ? "" : "\\\\" + _host + "\\") + _hive + _key;
    });
    this.__defineGetter__("arch", function() {
      return _arch;
    });
    this.__defineGetter__("parent", function() {
      var i = _key.lastIndexOf("\\");
      return new Registry({
        host: this.host,
        hive: this.hive,
        key: i == -1 ? "" : _key.substring(0, i),
        arch: this.arch
      });
    });
    if (HIVES.indexOf(_hive) == -1)
      throw new Error("illegal hive specified.");
    if (!KEY_PATTERN.test(_key))
      throw new Error("illegal key specified.");
    if (_arch && _arch != "x64" && _arch != "x86")
      throw new Error("illegal architecture specified (use x86 or x64)");
  }
  Registry.HKLM = HKLM;
  Registry.HKCU = HKCU;
  Registry.HKCR = HKCR;
  Registry.HKU = HKU;
  Registry.HKCC = HKCC;
  Registry.HIVES = HIVES;
  Registry.REG_SZ = REG_SZ;
  Registry.REG_MULTI_SZ = REG_MULTI_SZ;
  Registry.REG_EXPAND_SZ = REG_EXPAND_SZ;
  Registry.REG_DWORD = REG_DWORD;
  Registry.REG_QWORD = REG_QWORD;
  Registry.REG_BINARY = REG_BINARY;
  Registry.REG_NONE = REG_NONE;
  Registry.REG_TYPES = REG_TYPES;
  Registry.DEFAULT_VALUE = DEFAULT_VALUE;
  Registry.prototype.values = function values(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      } else {
        var items = [], result = [], lines = buffer.split("\n"), lineNumber = 0;
        for (var i = 0, l = lines.length; i < l; i++) {
          var line = lines[i].trim();
          if (line.length > 0) {
            if (lineNumber != 0) {
              items.push(line);
            }
            ++lineNumber;
          }
        }
        for (var i = 0, l = items.length; i < l; i++) {
          var match = ITEM_PATTERN.exec(items[i]), name, type, value;
          if (match) {
            name = match[1].trim();
            type = match[2].trim();
            value = match[3];
            result.push(new RegistryItem(self.host, self.hive, self.key, name, type, value, self.arch));
          }
        }
        cb(null, result);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.keys = function keys(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.stdout.on("end", function() {
      var items = [], result = [], lines = buffer.split("\n");
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i].trim();
        if (line.length > 0) {
          items.push(line);
        }
      }
      for (var i = 0, l = items.length; i < l; i++) {
        var match = PATH_PATTERN.exec(items[i]), key;
        if (match) {
          match[1];
          key = match[2];
          if (key && key !== self.key) {
            result.push(new Registry({
              host: self.host,
              hive: self.hive,
              key,
              arch: self.arch
            }));
          }
        }
      }
      cb(null, result);
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.get = function get(name, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    if (name == "")
      args.push("/ve");
    else
      args = args.concat(["/v", name]);
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      } else {
        var items = [], result = null, lines = buffer.split("\n"), lineNumber = 0;
        for (var i = 0, l = lines.length; i < l; i++) {
          var line = lines[i].trim();
          if (line.length > 0) {
            if (lineNumber != 0) {
              items.push(line);
            }
            ++lineNumber;
          }
        }
        var item = items[items.length - 1] || "", match = ITEM_PATTERN.exec(item), name2, type, value;
        if (match) {
          name2 = match[1].trim();
          type = match[2].trim();
          value = match[3];
          result = new RegistryItem(self.host, self.hive, self.key, name2, type, value, self.arch);
        }
        cb(null, result);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.set = function set(name, type, value, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    if (REG_TYPES.indexOf(type) == -1)
      throw Error("illegal type specified.");
    var args = ["ADD", this.path];
    if (name == "")
      args.push("/ve");
    else
      args = args.concat(["/v", name]);
    args = args.concat(["/t", type, "/d", value, "/f"]);
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("ADD", code, output));
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.remove = function remove(name, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = name ? ["DELETE", this.path, "/f", "/v", name] : ["DELETE", this.path, "/f", "/ve"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.clear = function clear(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["DELETE", this.path, "/f", "/va"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.erase = Registry.prototype.clear;
  Registry.prototype.destroy = function destroy(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["DELETE", this.path, "/f"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.create = function create(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["ADD", this.path, "/f"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("ADD", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.keyExists = function keyExists(cb) {
    this.values(function(err, items) {
      if (err) {
        if (err.code == 1) {
          return cb(null, false);
        }
        return cb(err);
      }
      cb(null, true);
    });
    return this;
  };
  Registry.prototype.valueExists = function valueExists(name, cb) {
    this.get(name, function(err, item) {
      if (err) {
        if (err.code == 1) {
          return cb(null, false);
        }
        return cb(err);
      }
      cb(null, true);
    });
    return this;
  };
  registry = Registry;
  return registry;
}
var AutoLaunchWindows;
var hasRequiredAutoLaunchWindows;
function requireAutoLaunchWindows() {
  if (hasRequiredAutoLaunchWindows) return AutoLaunchWindows;
  hasRequiredAutoLaunchWindows = 1;
  var Winreg, fs, path2, regKey;
  fs = require$$0$2;
  path2 = require$$0$1;
  Winreg = requireRegistry();
  regKey = new Winreg({
    hive: process.arch === "x64" ? Winreg.HKLM : Winreg.HKCU,
    key: process.arch === "x64" ? "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run" : "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  });
  AutoLaunchWindows = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    // Returns a Promise
    enable: function({ appName, appPath, isHiddenOnLaunch }) {
      return new Promise(function(resolve, reject) {
        var args, pathToAutoLaunchedApp, ref, updateDotExe;
        pathToAutoLaunchedApp = appPath;
        args = "";
        updateDotExe = path2.join(path2.dirname(process.execPath), "..", "update.exe");
        if (((ref = process.versions) != null ? ref.electron : void 0) != null && fs.existsSync(updateDotExe)) {
          pathToAutoLaunchedApp = updateDotExe;
          args = ` --processStart "${path2.basename(process.execPath)}"`;
          if (isHiddenOnLaunch) {
            args += ' --process-start-args "--hidden"';
          }
        } else {
          if (isHiddenOnLaunch) {
            args += " --hidden";
          }
        }
        return regKey.set(appName, Winreg.REG_SZ, `"${pathToAutoLaunchedApp}"${args}`, function(err) {
          if (err != null) {
            return reject(err);
          }
          return resolve();
        });
      });
    },
    // appName - {String}
    // Returns a Promise
    disable: function(appName) {
      return new Promise(function(resolve, reject) {
        return regKey.remove(appName, function(err) {
          if (err != null) {
            if (err.message.indexOf("The system was unable to find the specified registry key or value") !== -1) {
              return resolve(false);
            }
            return reject(err);
          }
          return resolve();
        });
      });
    },
    // appName - {String}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(appName) {
      return new Promise(function(resolve, reject) {
        return regKey.get(appName, function(err, item) {
          if (err != null) {
            return resolve(false);
          }
          return resolve(item != null);
        });
      });
    }
  };
  return AutoLaunchWindows;
}
var applescript = {};
var applescriptParser = {};
var hasRequiredApplescriptParser;
function requireApplescriptParser() {
  if (hasRequiredApplescriptParser) return applescriptParser;
  hasRequiredApplescriptParser = 1;
  (function(exports) {
    exports.parse = function(str) {
      if (str.length == 0) {
        return;
      }
      var rtn = parseFromFirstRemaining.call({
        value: str,
        index: 0
      });
      return rtn;
    };
    function parseFromFirstRemaining() {
      var cur = this.value[this.index];
      switch (cur) {
        case "{":
          return exports.ArrayParser.call(this);
        case '"':
          return exports.StringParser.call(this);
        case "a":
          if (this.value.substring(this.index, this.index + 5) == "alias") {
            return exports.AliasParser.call(this);
          }
          break;
        case "«":
          if (this.value.substring(this.index, this.index + 5) == "«data") {
            return exports.DataParser.call(this);
          }
          break;
      }
      if (!isNaN(cur)) {
        return exports.NumberParser.call(this);
      }
      return exports.UndefinedParser.call(this);
    }
    exports.AliasParser = function() {
      this.index += 6;
      return "/Volumes/" + exports.StringParser.call(this).replace(/:/g, "/");
    };
    exports.ArrayParser = function() {
      var rtn = [], cur = this.value[++this.index];
      while (cur != "}") {
        rtn.push(parseFromFirstRemaining.call(this));
        if (this.value[this.index] == ",") this.index += 2;
        cur = this.value[this.index];
      }
      this.index++;
      return rtn;
    };
    exports.DataParser = function() {
      var body = exports.UndefinedParser.call(this);
      body = body.substring(6, body.length - 1);
      var type = body.substring(0, 4);
      body = body.substring(4, body.length);
      var buf = new Buffer(body.length / 2);
      var count = 0;
      for (var i = 0, l = body.length; i < l; i += 2) {
        buf[count++] = parseInt(body[i] + body[i + 1], 16);
      }
      buf.type = type;
      return buf;
    };
    exports.NumberParser = function() {
      return Number(exports.UndefinedParser.call(this));
    };
    exports.StringParser = function(str) {
      var rtn = "", end = ++this.index, cur = this.value[end++];
      while (cur != '"') {
        if (cur == "\\") {
          rtn += this.value.substring(this.index, end - 1);
          this.index = end++;
        }
        cur = this.value[end++];
      }
      rtn += this.value.substring(this.index, end - 1);
      this.index = end;
      return rtn;
    };
    var END_OF_TOKEN = /}|,|\n/;
    exports.UndefinedParser = function() {
      var end = this.index, cur = this.value[end++];
      while (!END_OF_TOKEN.test(cur)) {
        cur = this.value[end++];
      }
      var rtn = this.value.substring(this.index, end - 1);
      this.index = end - 1;
      return rtn;
    };
  })(applescriptParser);
  return applescriptParser;
}
var hasRequiredApplescript;
function requireApplescript() {
  if (hasRequiredApplescript) return applescript;
  hasRequiredApplescript = 1;
  (function(exports) {
    var spawn = require$$2.spawn;
    exports.Parsers = requireApplescriptParser();
    var parse = exports.Parsers.parse;
    exports.osascript = "osascript";
    exports.execFile = function execFile(file, args, callback) {
      if (!Array.isArray(args)) {
        callback = args;
        args = [];
      }
      return runApplescript(file, args, callback);
    };
    exports.execString = function execString(str, callback) {
      return runApplescript(str, callback);
    };
    function runApplescript(strOrPath, args, callback) {
      var isString = false;
      if (!Array.isArray(args)) {
        callback = args;
        args = [];
        isString = true;
      }
      args.push("-ss");
      if (!isString) {
        args.push(strOrPath);
      }
      var interpreter = spawn(exports.osascript, args);
      bufferBody(interpreter.stdout);
      bufferBody(interpreter.stderr);
      interpreter.on("exit", function(code) {
        var result = parse(interpreter.stdout.body);
        var err;
        if (code) {
          err = new Error(interpreter.stderr.body);
          err.appleScript = strOrPath;
          err.exitCode = code;
        }
        if (callback) {
          callback(err, result, interpreter.stderr.body);
        }
      });
      if (isString) {
        interpreter.stdin.write(strOrPath);
        interpreter.stdin.end();
      }
    }
    function bufferBody(stream) {
      stream.body = "";
      stream.setEncoding("utf8");
      stream.on("data", function(chunk) {
        stream.body += chunk;
      });
    }
  })(applescript);
  return applescript;
}
var untildify;
var hasRequiredUntildify;
function requireUntildify() {
  if (hasRequiredUntildify) return untildify;
  hasRequiredUntildify = 1;
  const os = require$$0$3;
  const homeDirectory = os.homedir();
  untildify = (pathWithTilde) => {
    if (typeof pathWithTilde !== "string") {
      throw new TypeError(`Expected a string, got ${typeof pathWithTilde}`);
    }
    return homeDirectory ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDirectory) : pathWithTilde;
  };
  return untildify;
}
var optsArg_1;
var hasRequiredOptsArg;
function requireOptsArg() {
  if (hasRequiredOptsArg) return optsArg_1;
  hasRequiredOptsArg = 1;
  const { promisify } = require$$0;
  const fs = require$$0$2;
  const optsArg = (opts) => {
    if (!opts)
      opts = { mode: 511, fs };
    else if (typeof opts === "object")
      opts = { mode: 511, fs, ...opts };
    else if (typeof opts === "number")
      opts = { mode: opts, fs };
    else if (typeof opts === "string")
      opts = { mode: parseInt(opts, 8), fs };
    else
      throw new TypeError("invalid options argument");
    opts.mkdir = opts.mkdir || opts.fs.mkdir || fs.mkdir;
    opts.mkdirAsync = promisify(opts.mkdir);
    opts.stat = opts.stat || opts.fs.stat || fs.stat;
    opts.statAsync = promisify(opts.stat);
    opts.statSync = opts.statSync || opts.fs.statSync || fs.statSync;
    opts.mkdirSync = opts.mkdirSync || opts.fs.mkdirSync || fs.mkdirSync;
    return opts;
  };
  optsArg_1 = optsArg;
  return optsArg_1;
}
var pathArg_1;
var hasRequiredPathArg;
function requirePathArg() {
  if (hasRequiredPathArg) return pathArg_1;
  hasRequiredPathArg = 1;
  const platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
  const { resolve, parse } = require$$0$1;
  const pathArg = (path2) => {
    if (/\0/.test(path2)) {
      throw Object.assign(
        new TypeError("path must be a string without null bytes"),
        {
          path: path2,
          code: "ERR_INVALID_ARG_VALUE"
        }
      );
    }
    path2 = resolve(path2);
    if (platform === "win32") {
      const badWinChars = /[*|"<>?:]/;
      const { root } = parse(path2);
      if (badWinChars.test(path2.substr(root.length))) {
        throw Object.assign(new Error("Illegal characters in path."), {
          path: path2,
          code: "EINVAL"
        });
      }
    }
    return path2;
  };
  pathArg_1 = pathArg;
  return pathArg_1;
}
var findMade_1;
var hasRequiredFindMade;
function requireFindMade() {
  if (hasRequiredFindMade) return findMade_1;
  hasRequiredFindMade = 1;
  const { dirname } = require$$0$1;
  const findMade = (opts, parent, path2 = void 0) => {
    if (path2 === parent)
      return Promise.resolve();
    return opts.statAsync(parent).then(
      (st) => st.isDirectory() ? path2 : void 0,
      // will fail later
      (er) => er.code === "ENOENT" ? findMade(opts, dirname(parent), parent) : void 0
    );
  };
  const findMadeSync = (opts, parent, path2 = void 0) => {
    if (path2 === parent)
      return void 0;
    try {
      return opts.statSync(parent).isDirectory() ? path2 : void 0;
    } catch (er) {
      return er.code === "ENOENT" ? findMadeSync(opts, dirname(parent), parent) : void 0;
    }
  };
  findMade_1 = { findMade, findMadeSync };
  return findMade_1;
}
var mkdirpManual_1;
var hasRequiredMkdirpManual;
function requireMkdirpManual() {
  if (hasRequiredMkdirpManual) return mkdirpManual_1;
  hasRequiredMkdirpManual = 1;
  const { dirname } = require$$0$1;
  const mkdirpManual = (path2, opts, made) => {
    opts.recursive = false;
    const parent = dirname(path2);
    if (parent === path2) {
      return opts.mkdirAsync(path2, opts).catch((er) => {
        if (er.code !== "EISDIR")
          throw er;
      });
    }
    return opts.mkdirAsync(path2, opts).then(() => made || path2, (er) => {
      if (er.code === "ENOENT")
        return mkdirpManual(parent, opts).then((made2) => mkdirpManual(path2, opts, made2));
      if (er.code !== "EEXIST" && er.code !== "EROFS")
        throw er;
      return opts.statAsync(path2).then((st) => {
        if (st.isDirectory())
          return made;
        else
          throw er;
      }, () => {
        throw er;
      });
    });
  };
  const mkdirpManualSync = (path2, opts, made) => {
    const parent = dirname(path2);
    opts.recursive = false;
    if (parent === path2) {
      try {
        return opts.mkdirSync(path2, opts);
      } catch (er) {
        if (er.code !== "EISDIR")
          throw er;
        else
          return;
      }
    }
    try {
      opts.mkdirSync(path2, opts);
      return made || path2;
    } catch (er) {
      if (er.code === "ENOENT")
        return mkdirpManualSync(path2, opts, mkdirpManualSync(parent, opts, made));
      if (er.code !== "EEXIST" && er.code !== "EROFS")
        throw er;
      try {
        if (!opts.statSync(path2).isDirectory())
          throw er;
      } catch (_) {
        throw er;
      }
    }
  };
  mkdirpManual_1 = { mkdirpManual, mkdirpManualSync };
  return mkdirpManual_1;
}
var mkdirpNative_1;
var hasRequiredMkdirpNative;
function requireMkdirpNative() {
  if (hasRequiredMkdirpNative) return mkdirpNative_1;
  hasRequiredMkdirpNative = 1;
  const { dirname } = require$$0$1;
  const { findMade, findMadeSync } = requireFindMade();
  const { mkdirpManual, mkdirpManualSync } = requireMkdirpManual();
  const mkdirpNative = (path2, opts) => {
    opts.recursive = true;
    const parent = dirname(path2);
    if (parent === path2)
      return opts.mkdirAsync(path2, opts);
    return findMade(opts, path2).then((made) => opts.mkdirAsync(path2, opts).then(() => made).catch((er) => {
      if (er.code === "ENOENT")
        return mkdirpManual(path2, opts);
      else
        throw er;
    }));
  };
  const mkdirpNativeSync = (path2, opts) => {
    opts.recursive = true;
    const parent = dirname(path2);
    if (parent === path2)
      return opts.mkdirSync(path2, opts);
    const made = findMadeSync(opts, path2);
    try {
      opts.mkdirSync(path2, opts);
      return made;
    } catch (er) {
      if (er.code === "ENOENT")
        return mkdirpManualSync(path2, opts);
      else
        throw er;
    }
  };
  mkdirpNative_1 = { mkdirpNative, mkdirpNativeSync };
  return mkdirpNative_1;
}
var useNative_1;
var hasRequiredUseNative;
function requireUseNative() {
  if (hasRequiredUseNative) return useNative_1;
  hasRequiredUseNative = 1;
  const fs = require$$0$2;
  const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
  const versArr = version.replace(/^v/, "").split(".");
  const hasNative = +versArr[0] > 10 || +versArr[0] === 10 && +versArr[1] >= 12;
  const useNative = !hasNative ? () => false : (opts) => opts.mkdir === fs.mkdir;
  const useNativeSync = !hasNative ? () => false : (opts) => opts.mkdirSync === fs.mkdirSync;
  useNative_1 = { useNative, useNativeSync };
  return useNative_1;
}
var mkdirp_1;
var hasRequiredMkdirp;
function requireMkdirp() {
  if (hasRequiredMkdirp) return mkdirp_1;
  hasRequiredMkdirp = 1;
  const optsArg = requireOptsArg();
  const pathArg = requirePathArg();
  const { mkdirpNative, mkdirpNativeSync } = requireMkdirpNative();
  const { mkdirpManual, mkdirpManualSync } = requireMkdirpManual();
  const { useNative, useNativeSync } = requireUseNative();
  const mkdirp = (path2, opts) => {
    path2 = pathArg(path2);
    opts = optsArg(opts);
    return useNative(opts) ? mkdirpNative(path2, opts) : mkdirpManual(path2, opts);
  };
  const mkdirpSync = (path2, opts) => {
    path2 = pathArg(path2);
    opts = optsArg(opts);
    return useNativeSync(opts) ? mkdirpNativeSync(path2, opts) : mkdirpManualSync(path2, opts);
  };
  mkdirp.sync = mkdirpSync;
  mkdirp.native = (path2, opts) => mkdirpNative(pathArg(path2), optsArg(opts));
  mkdirp.manual = (path2, opts) => mkdirpManual(pathArg(path2), optsArg(opts));
  mkdirp.nativeSync = (path2, opts) => mkdirpNativeSync(pathArg(path2), optsArg(opts));
  mkdirp.manualSync = (path2, opts) => mkdirpManualSync(pathArg(path2), optsArg(opts));
  mkdirp_1 = mkdirp;
  return mkdirp_1;
}
var fileBasedUtilities;
var hasRequiredFileBasedUtilities;
function requireFileBasedUtilities() {
  if (hasRequiredFileBasedUtilities) return fileBasedUtilities;
  hasRequiredFileBasedUtilities = 1;
  var fs, mkdirp;
  fs = require$$0$2;
  mkdirp = requireMkdirp();
  fileBasedUtilities = {
    /* Public */
    // This is essentially enabling auto-launching
    // options - {Object}
    //   :data - {String}
    //   :directory - {String}
    //   :filePath - {String}
    // Returns a Promise
    createFile: function({ directory, filePath, data }) {
      return new Promise(function(resolve, reject) {
        return mkdirp(directory, function(mkdirErr) {
          if (mkdirErr != null) {
            return reject(mkdirErr);
          }
          return fs.writeFile(filePath, data, function(writeErr) {
            if (writeErr != null) {
              return reject(writeErr);
            }
            return resolve();
          });
        });
      });
    },
    // filePath - {String}
    isEnabled: function(filePath) {
      return new Promise((resolve, reject) => {
        return fs.stat(filePath, function(err, stat) {
          if (err != null) {
            return resolve(false);
          }
          return resolve(stat != null);
        });
      });
    },
    // This is essentially disabling auto-launching
    // filePath - {String}
    // Returns a Promise
    removeFile: function(filePath) {
      return new Promise((resolve, reject) => {
        return fs.stat(filePath, function(statErr) {
          if (statErr != null) {
            return resolve();
          }
          return fs.unlink(filePath, function(unlinkErr) {
            if (unlinkErr != null) {
              return reject(unlinkErr);
            }
            return resolve();
          });
        });
      });
    }
  };
  return fileBasedUtilities;
}
var AutoLaunchMac;
var hasRequiredAutoLaunchMac;
function requireAutoLaunchMac() {
  if (hasRequiredAutoLaunchMac) return AutoLaunchMac;
  hasRequiredAutoLaunchMac = 1;
  var applescript2, fileBasedUtilities2, untildify2, indexOf = [].indexOf;
  applescript2 = requireApplescript();
  untildify2 = requireUntildify();
  fileBasedUtilities2 = requireFileBasedUtilities();
  AutoLaunchMac = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    //   :mac - (Optional) {Object}
    //       :useLaunchAgent - (Optional) {Boolean}
    // Returns a Promise
    enable: function({ appName, appPath, isHiddenOnLaunch, mac }) {
      var data, isHiddenValue, programArguments, programArgumentsSection, properties;
      if (mac.useLaunchAgent) {
        programArguments = [appPath];
        if (isHiddenOnLaunch) {
          programArguments.push("--hidden");
        }
        programArgumentsSection = programArguments.map(function(argument) {
          return `    <string>${argument}</string>`;
        }).join("\n");
        data = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${appName}</string>
  <key>ProgramArguments</key>
  <array>
  ${programArgumentsSection}
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>`;
        return fileBasedUtilities2.createFile({
          data,
          directory: this.getDirectory(),
          filePath: this.getFilePath(appName)
        });
      }
      isHiddenValue = isHiddenOnLaunch ? "true" : "false";
      properties = `{path:"${appPath}", hidden:${isHiddenValue}, name:"${appName}"}`;
      return this.execApplescriptCommand(`make login item at end with properties ${properties}`);
    },
    // appName - {String}
    // mac - {Object}
    //   :useLaunchAgent - {Object}
    // Returns a Promise
    disable: function(appName, mac) {
      if (mac.useLaunchAgent) {
        return fileBasedUtilities2.removeFile(this.getFilePath(appName));
      }
      return this.execApplescriptCommand(`delete login item "${appName}"`);
    },
    // appName - {String}
    // mac - {Object}
    //   :useLaunchAgent - {Object}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(appName, mac) {
      if (mac.useLaunchAgent) {
        return fileBasedUtilities2.isEnabled(this.getFilePath(appName));
      }
      return this.execApplescriptCommand("get the name of every login item").then(function(loginItems) {
        return loginItems != null && indexOf.call(loginItems, appName) >= 0;
      });
    },
    /* Private */
    // commandSuffix - {String}
    // Returns a Promise
    execApplescriptCommand: function(commandSuffix) {
      return new Promise(function(resolve, reject) {
        return applescript2.execString(`tell application "System Events" to ${commandSuffix}`, function(err, result) {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        });
      });
    },
    // Returns a {String}
    getDirectory: function() {
      return untildify2("~/Library/LaunchAgents/");
    },
    // appName - {String}
    // Returns a {String}
    getFilePath: function(appName) {
      return `${this.getDirectory()}${appName}.plist`;
    }
  };
  return AutoLaunchMac;
}
var AutoLaunchLinux;
var hasRequiredAutoLaunchLinux;
function requireAutoLaunchLinux() {
  if (hasRequiredAutoLaunchLinux) return AutoLaunchLinux;
  hasRequiredAutoLaunchLinux = 1;
  var fileBasedUtilities2, untildify2;
  untildify2 = requireUntildify();
  fileBasedUtilities2 = requireFileBasedUtilities();
  AutoLaunchLinux = {
    /* Public */
    // options - {Object}
    //   :appName - {String}
    //   :appPath - {String}
    //   :isHiddenOnLaunch - {Boolean}
    // Returns a Promise
    enable: function({ appName, appPath, isHiddenOnLaunch }) {
      var data, hiddenArg;
      hiddenArg = isHiddenOnLaunch ? " --hidden" : "";
      data = `[Desktop Entry]
Type=Application
Version=1.0
Name=${appName}
Comment=${appName}startup script
Exec=${appPath}${hiddenArg}
StartupNotify=false
Terminal=false`;
      return fileBasedUtilities2.createFile({
        data,
        directory: this.getDirectory(),
        filePath: this.getFilePath(appName)
      });
    },
    // appName - {String}
    // Returns a Promise
    disable: function(appName) {
      return fileBasedUtilities2.removeFile(this.getFilePath(appName));
    },
    // appName - {String}
    // Returns a Promise which resolves to a {Boolean}
    isEnabled: function(appName) {
      return fileBasedUtilities2.isEnabled(this.getFilePath(appName));
    },
    /* Private */
    // Returns a {String}
    getDirectory: function() {
      return untildify2("~/.config/autostart/");
    },
    // appName - {String}
    // Returns a {String}
    getFilePath: function(appName) {
      return `${this.getDirectory()}${appName}.desktop`;
    }
  };
  return AutoLaunchLinux;
}
var isPathAbsolute;
isPathAbsolute = pathIsAbsoluteExports;
var dist = class AutoLaunch {
  /* Public */
  // options - {Object}
  //   :isHidden - (Optional) {Boolean}
  //   :mac - (Optional) {Object}
  //       :useLaunchAgent - (Optional) {Boolean}. If `true`, use filed-based Launch Agent. Otherwise use AppleScript
  //           to add Login Item
  //   :name - {String}
  //   :path - (Optional) {String}
  constructor({ name, isHidden, mac, path: path2 }) {
    var versions;
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
    this.fixOpts = this.fixOpts.bind(this);
    if (name == null) {
      throw new Error("You must specify a name");
    }
    this.opts = {
      appName: name,
      isHiddenOnLaunch: isHidden != null ? isHidden : false,
      mac: mac != null ? mac : {}
    };
    versions = typeof process !== "undefined" && process !== null ? process.versions : void 0;
    if (path2 != null) {
      if (!isPathAbsolute(path2)) {
        throw new Error("path must be absolute");
      }
      this.opts.appPath = path2;
    } else if (versions != null && (versions.nw != null || versions["node-webkit"] != null || versions.electron != null)) {
      this.opts.appPath = process.execPath;
    } else {
      throw new Error("You must give a path (this is only auto-detected for NW.js and Electron apps)");
    }
    this.fixOpts();
    this.api = null;
    if (/^win/.test(process.platform)) {
      this.api = requireAutoLaunchWindows();
    } else if (/darwin/.test(process.platform)) {
      this.api = requireAutoLaunchMac();
    } else if (/linux/.test(process.platform)) {
      this.api = requireAutoLaunchLinux();
    } else {
      throw new Error("Unsupported platform");
    }
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
  fixMacExecPath(path2, macOptions) {
    path2 = path2.replace(/(^.+?[^\/]+?\.app)\/Contents\/(Frameworks\/((\1|[^\/]+?) Helper)\.app\/Contents\/MacOS\/\3|MacOS\/Electron)/, "$1");
    if (!macOptions.useLaunchAgent) {
      path2 = path2.replace(/\.app\/Contents\/MacOS\/[^\/]*$/, ".app");
    }
    return path2;
  }
  fixOpts() {
    var tempPath;
    this.opts.appPath = this.opts.appPath.replace(/\/$/, "");
    if (/darwin/.test(process.platform)) {
      this.opts.appPath = this.fixMacExecPath(this.opts.appPath, this.opts.mac);
    }
    if (this.opts.appPath.indexOf("/") !== -1) {
      tempPath = this.opts.appPath.split("/");
      this.opts.appName = tempPath[tempPath.length - 1];
    } else if (this.opts.appPath.indexOf("\\") !== -1) {
      tempPath = this.opts.appPath.split("\\");
      this.opts.appName = tempPath[tempPath.length - 1];
      this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - ".exe".length);
    }
    if (/darwin/.test(process.platform)) {
      if (this.opts.appName.indexOf(".app", this.opts.appName.length - ".app".length) !== -1) {
        return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - ".app".length);
      }
    }
  }
};
const AutoLaunch2 = /* @__PURE__ */ getDefaultExportFromCjs(dist);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let miniWin;
let tray;
let isQuitting = false;
let autoLauncher = null;
function setupAutoLaunch() {
  autoLauncher = new AutoLaunch2({
    name: "Focus Companion",
    path: app.getPath("exe")
  });
  autoLauncher.enable().catch((err) => {
    console.error("Failed to enable auto launch:", err);
  });
}
function createMiniWindow() {
  miniWin = new BrowserWindow({
    width: 280,
    height: 160,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    title: "Focus Timer",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    miniWin.loadURL(`${VITE_DEV_SERVER_URL}#/mini-timer`);
  } else {
    miniWin.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: "#/mini-timer" });
  }
  miniWin.on("close", (event) => {
    event.preventDefault();
    miniWin == null ? void 0 : miniWin.hide();
  });
}
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Focus Companion",
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.on("minimize", (event) => {
    event.preventDefault();
    win == null ? void 0 : win.hide();
  });
  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win == null ? void 0 : win.hide();
    }
  });
}
function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC, "electron-vite.svg");
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Start Focus",
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-start-focus");
        win == null ? void 0 : win.show();
      }
    },
    {
      label: "Pause",
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-pause-focus");
        win == null ? void 0 : win.show();
      }
    },
    {
      label: "Resume",
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-resume-focus");
        win == null ? void 0 : win.show();
      }
    },
    { type: "separator" },
    {
      label: "Quick Add Task",
      click: () => {
        win == null ? void 0 : win.show();
        win == null ? void 0 : win.webContents.send("tray-quick-add-task");
      }
    },
    {
      label: "Today's Progress",
      click: () => {
        win == null ? void 0 : win.show();
        win == null ? void 0 : win.webContents.send("tray-show-progress");
      }
    },
    { type: "separator" },
    {
      label: "Show Mini Timer",
      click: () => {
        if (miniWin) {
          miniWin.show();
        } else {
          createMiniWindow();
        }
      }
    },
    {
      label: "Show App",
      click: () => {
        win == null ? void 0 : win.show();
      }
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Focus Companion");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    win == null ? void 0 : win.show();
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    win == null ? void 0 : win.show();
  }
});
app.whenReady().then(() => {
  createWindow();
  createMiniWindow();
  createTray();
  setupAutoLaunch();
  const ret = globalShortcut.register("CommandOrControl+Shift+Space", () => {
    win == null ? void 0 : win.show();
    win == null ? void 0 : win.webContents.send("global-shortcut-quick-capture");
  });
  if (!ret) {
    console.error("Global shortcut registration failed");
  }
  ipcMain.on("show-break-notification", () => {
    new Notification({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  });
  ipcMain.on("show-focus-notification", () => {
    new Notification({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  });
  ipcMain.on("update-tray-status", (_event, status) => {
    tray == null ? void 0 : tray.setToolTip(`Focus Companion - ${status}`);
  });
  ipcMain.handle("get-auto-launch-status", async () => {
    return (autoLauncher == null ? void 0 : autoLauncher.isEnabled()) || false;
  });
  ipcMain.handle("toggle-auto-launch", async (_event, enabled) => {
    if (enabled) {
      await (autoLauncher == null ? void 0 : autoLauncher.enable());
    } else {
      await (autoLauncher == null ? void 0 : autoLauncher.disable());
    }
    return (autoLauncher == null ? void 0 : autoLauncher.isEnabled()) || false;
  });
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
