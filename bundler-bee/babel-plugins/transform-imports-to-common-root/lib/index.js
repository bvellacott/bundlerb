"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TransformImportsToCommonRoot = void 0;

var _path = require("path");

var _resolve = _interopRequireDefault(require("resolve"));

var _nodeLibsBrowser = _interopRequireDefault(require("node-libs-browser"));

var _helperModuleTransforms = require("@babel/helper-module-transforms");

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import normalizeAndLoadMetadata from 'babel-helper-module-transforms/normalize-and-load-metadata';
var packageFilter = function packageFilter(pkg) {
  return _objectSpread({}, pkg, {
    main: pkg.module || pkg.main
  });
};

var requireToPath = function requireToPath(req, filedir, basedir, aliases) {
  return (0, _path.relative)(basedir, _resolve["default"].sync(transformAlias(req, basedir, aliases), {
    basedir: filedir,
    packageFilter: packageFilter
  }));
};

var transformAlias = function transformAlias(path, basedir, aliases) {
  if (_nodeLibsBrowser["default"][path]) {
    console.log('!!! found: ', path, '-', _nodeLibsBrowser["default"][path], ' !!!');
    return _nodeLibsBrowser["default"][path];
  }

  for (var i = 0; i < aliases.length; i++) {
    var _aliases$i = aliases[i],
        regex = _aliases$i.regex,
        aliasedPath = _aliases$i.aliasedPath;

    if (regex.test(path)) {
      var noAlias = path.replace(regex, '');
      return (0, _path.join)(basedir, aliasedPath, noAlias);
    }
  }

  return path;
};

var TransformImportsToCommonRoot = function TransformImportsToCommonRoot() {
  var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var aliases = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  aliases = Object.keys(aliases || {}).map(function (alias) {
    return {
      aliasedPath: aliases[alias],
      regex: new RegExp("^".concat(alias))
    };
  });
  return function () {
    function isValidRequireCall(nodepath) {
      if (!nodepath.isCallExpression()) return false;

      if (!nodepath.get("callee").isIdentifier({
        name: "require"
      })) {
        return false;
      }

      if (nodepath.scope.getBinding("require")) return false;
      var args = nodepath.get("arguments");
      if (args.length !== 1) return false;
      var arg = args[0];
      if (!arg.isStringLiteral()) return false;
      return true;
    }

    var AmdVisitor = function AmdVisitor(filedir, basedir, dependencyPaths) {
      return {
        CallExpression: function CallExpression(nodepath) {
          if (!isValidRequireCall(nodepath)) return;
          var req = nodepath.node.arguments[0].value;
          var newPath = requireToPath(req, filedir, basedir, aliases);
          nodepath.node.arguments[0].value = newPath;
          dependencyPaths.push(newPath);
        }
      };
    };

    return {
      visitor: {
        Program: {
          exit: function exit(nodepath, _ref) {
            var cwd = _ref.cwd,
                filename = _ref.filename;
            if (this.ran) return;
            this.ran = true;
            var filedir = (0, _path.dirname)(filename);
            module.js = module.js || {};
            module.js.dependencyPaths = module.js.dependencyPaths || [];
            var es6Imports = getEs6Imports(nodepath, filedir, cwd, aliases);
            es6Imports.forEach(function (dep) {
              return module.js.dependencyPaths.push(dep);
            });
            nodepath.traverse(AmdVisitor(filedir, cwd, module.js.dependencyPaths), this);
          }
        }
      }
    };
  };
};

exports.TransformImportsToCommonRoot = TransformImportsToCommonRoot;

var getEs6Imports = function getEs6Imports(path, filedir, basedir, aliases) {
  if (!(0, _helperModuleTransforms.isModule)(path)) return [];
  return path.get("body").filter(function (child) {
    return (child.isImportDeclaration() || child.isExportDeclaration()) && child.get('source').node;
  }).map(function (child) {
    var newPath = requireToPath(child.get('source').node.value, filedir, basedir, aliases);
    child.get('source').node.value = newPath;
    return newPath;
  });
};

var _default = TransformImportsToCommonRoot();

exports["default"] = _default;
