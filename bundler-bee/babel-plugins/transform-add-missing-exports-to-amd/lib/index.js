'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformImportsToCommonRoot = undefined;

var _path = require('path');

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _nodeLibsBrowser = require('node-libs-browser');

var _nodeLibsBrowser2 = _interopRequireDefault(_nodeLibsBrowser);

var _types = require('@babel/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TransformImportsToCommonRoot = exports.TransformImportsToCommonRoot = function TransformImportsToCommonRoot() {
  var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var aliases = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function () {
    function isValidDefineCall(nodepath) {
      if (!nodepath.isCallExpression()) return false;
      if (!nodepath.get("callee").isIdentifier({ name: "define" })) {
        return false;
      }
      // if (nodepath.scope.getBinding("require")) return false;

      var args = nodepath.get("arguments");
      if (args.length !== 3) return false;

      if (!args[0].isStringLiteral() || !args[1].isArrayExpression() || !args[2].isFunctionExpression()) {
        return false;
      }

      return true;
    }

    function hasUnpassedExports(nodepath) {
      try {
        var arrayExpression = nodepath.get("arguments")[1];
        var functionExpression = nodepath.get("arguments")[2];
        var elements = arrayExpression.get('elements');
        var params = functionExpression.get('params');
        for (var i = 0; i < params.length; i += 1) {
          var _ref = params[i] || {},
              type = _ref.type,
              name = _ref.name;

          if (type === 'Identifier' && name === 'exports') {
            return false;
          }
        }
        var body = functionExpression.get("body").get("body");
        for (var _i = 0; _i < body.length; _i += 1) {
          var child = body[_i];
          if (child.isExpressionStatement() && child.get('expression').isAssignmentExpression() && child.get('expression').get('left').isMemberExpression() && child.get('expression').get('left').get('object').isIdentifier() && child.get('expression').get('left').get('object').node.name === 'exports') {
            elements.unshift((0, _types.stringLiteral)('exports'));
            params.unshift((0, _types.identifier)('exports'));
            functionExpression.set('params', params);
            arrayExpression.set('elements', elements);
            break;
          }
        };
      } catch (e) {
        console.log(e);
      }
    }

    var AmdVisitor = function AmdVisitor() {
      return {
        CallExpression: function CallExpression(nodepath) {
          if (!isValidDefineCall(nodepath) || !hasUnpassedExports(nodepath)) return;
        }
      };
    };

    return {
      visitor: {
        Program: {
          exit: function exit(nodepath, _ref2) {
            var cwd = _ref2.cwd,
                filename = _ref2.filename;

            if (this.ran) return;
            this.ran = true;

            nodepath.traverse(AmdVisitor(), this);
          }
        }
      }
    };
  };
};

exports.default = TransformImportsToCommonRoot();
