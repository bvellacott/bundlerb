const { basename } = require('path')
const { requireBundlerbConfig } = require('../../utils')

const config = requireBundlerbConfig()

let preloadContent;
let postloadContent;

const jsBundler = {
  matcher: /\.js$|\.mjs$/,
  bundle: (module, flattenedWithoutPrior, index, concat, noLoadWrap) => {
    if (!noLoadWrap) {
      if (typeof preloadContent !== 'string') {
        preloadContent = config.preloadScripts.join('\n')
      }
      concat.add(null, preloadContent)
    }
    if (index.supportAsyncRequire) {
      concat.add(null, `window.define.priorIds.push(${module.id});`)
      if (index.loadStyles) {
        concat.add(null,
          `(function() { var e = document.createElement('link'); e.setAttribute('href', '${module.path.replace(/\.js$/, '.jscss')}'); e.setAttribute('rel', 'preload'); e.setAttribute('as', 'style'); e.setAttribute('onload', "this.rel='stylesheet'"); document.getElementsByTagName('head')[0].appendChild(e); })()`
        )
      }
    }
    for (let i = 0; i < flattenedWithoutPrior.length; i++) {
      const { path, sourceMapFilename, js } = flattenedWithoutPrior[i]
      if (!js) {
        throw new Error(`the module '${path} has no js target'`)
      } else if (!js.result) {
        console.log(js)
        throw new Error(`the module '${path} has no js target result'`)
      } else if (!js.result.code) {
        throw new Error(`the module '${path} has no js target result code'`)
      }
      const { result: { code, map }} = js
      concat.add(sourceMapFilename, code, index.sourcemaps ? map : undefined)
    }
    if (!noLoadWrap) {
      if (typeof postloadContent !== 'string') {
        postloadContent = config.postloadScripts.join('\n')
      }
      concat.add(null, postloadContent)
    }
    if (index.sourcemaps) {
      concat.add(null,
        `//# sourceMappingURL=${basename(module.path)}${index.mapFileSuffix}${index.priorIdsString ?
          `?priorIds=${index.priorIdsString}` :
          ''}`
      )
    }
    module.js = module.js || { result: {} }
    module.js.result.concat = concat
    module.js.result.postprocessedContent = concat.content
    module.js.result.postprocessedMap = concat.sourceMap
  },
  invalidate: module => delete module.js,
  hasCachedResult: module => !!module.js,
  invalidateConcatCache: module => {
    if (jsBundler.hasCachedConcat(module)) {
      delete module.js.result.postprocessedContent
      delete module.js.result.postprocessedMap
    }
    Object.values(module.dependants).forEach(
      d => jsBundler.invalidateConcatCache(d),
    )
  },
  hasCachedConcat: module => !!module.js && !!module.js.result && !!module.js.result.postprocessedContent,
}

exports.jsBundler = jsBundler
