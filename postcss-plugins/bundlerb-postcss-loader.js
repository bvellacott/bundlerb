const { join, dirname } = require('path')

module.exports = (module) => ({
  postcssPlugin: 'bundlerb-postcss-loader',
  AtRule: {
    import(atRule, { result }) {
      if (typeof atRule.params !== 'string') {
        result.warn('Unable to resolve import', { node: atRule })
      }
      const matchResult = /\s*["']\s*([^'"\s]+){1}\s*["']\s*/.exec(atRule.params)
      if (!matchResult) {
        result.warn('Unable to resolve import', { node: atRule })
      }
      const relativePath = matchResult[1]
      const dependencyPath = `./${join(dirname(module.path), relativePath)}`
      module.css.dependencyPaths.push(dependencyPath)
      atRule.remove()
    }        
  } 
})

module.exports.postcss = true
