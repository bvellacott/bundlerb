const {
  stringLiteral,
} = require('@babel/types')
const {
  isValidDefineCall,
  pack,
} = require('../../utils')

const dontPack = {
  'exports': true,
  'module': true,
}

const TransformPackFilepaths = () => {
  return function() {
    function packFilePaths(defineCallExpression) {
      try {
        const name = defineCallExpression.node.arguments[0].value
        const { elements } = defineCallExpression.node.arguments[1]
        defineCallExpression.node.arguments[0] = stringLiteral(pack(name))
        defineCallExpression.node.arguments[1].elements = elements.map(
          ({ value }) => stringLiteral(dontPack[value] ? value : pack(value)),
        )
      } catch (e) {
        console.log(e)
      }
    }

    const AmdVisitor = () => ({
      CallExpression(callExpression) {
        if (!isValidDefineCall(callExpression)) return
        packFilePaths(callExpression)
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

exports.TransformPackFilepaths = TransformPackFilepaths

exports.default = TransformPackFilepaths();
