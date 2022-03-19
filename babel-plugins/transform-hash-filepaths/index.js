const {
  stringLiteral,
} = require('@babel/types')
const {
  isValidRequireCall,
  isValidDefineCall,
} = require('../../utils')
const hashSum = require('../../utils/hash-sum')

const isProd = process.env.NODE_ENV === 'production'

const dontHash = {
  exports: true,
  module: true,
  require: true,
}

function hashUrl(url) {
  if (
    isProd
    && !url.startsWith('!-')
    && url !== 'module'
    && url !== 'exports'
    && url !== 'require'
  ) {
    return '!-' + hashSum(url)
  }
  return url
}

const TransformHashFilepaths = () => {
  return function() {
    function hashFilePaths(defineCallExpression) {
      try {
        const name = defineCallExpression.node.arguments[0].value
        const { elements } = defineCallExpression.node.arguments[1]
        defineCallExpression.node.arguments[0] = stringLiteral(hashUrl(name))
        defineCallExpression.node.arguments[1].elements = elements.map(
          ({ value }) => stringLiteral(dontHash[value] ? value : hashUrl(value)),
        )
      } catch (e) {
        console.log(e)
      }
    }

    const AmdVisitor = () => ({
      CallExpression(callExpression) {
        if (isValidRequireCall(callExpression)) {
          const argument = callExpression.node.arguments[0]
          argument.value = hashUrl(argument.value)
        } else if (isValidDefineCall(callExpression)) {
          hashFilePaths(callExpression)
        }
      },
    });

    return {
      visitor: {
        Program: {
          exit(nodepath, { cwd, filename }) {
            if (this.ran) return;
            this.ran = true;

            nodepath.traverse(
              AmdVisitor(),
              this,
            );
          },
        },
      },
    };
  };
};

exports.TransformHashFilepaths = TransformHashFilepaths

exports.default = TransformHashFilepaths();
