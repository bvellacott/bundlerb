const { basename } = require('path')

const jsCssBundler = {
  matcher: /\.js$/,
  bundle: (module, flattenedWithoutPrior, index, concat, noLoadWrap) => {
    flattenedWithoutPrior
      .filter(module => module.css)
      .forEach(({ sourceMapFilename, css: { result: { css, map }}}) =>
      concat.add(sourceMapFilename, css, index.sourcemaps && map ? map.toString() : undefined))
    module.jsCss = module.jsCss || { result: {} }
    module.jsCss.result.concat = concat
    const filename = basename(module.path).replace(/\.js$/, '.jscss')
    if (index.sourcemaps) {
      concat.add(null,
        `/*# sourceMappingURL=${filename}${index.mapFileSuffix}${index.priorIdsString ?
          `?priorIds=${index.priorIdsString} */` :
          ' */'}`
      )
    }
  },
  invalidate: module => delete module.jsCss,
  hasCachedResult: module => !!module.jsCss,
  invalidateConcatCache: module => {
    if (jsCssBundler.hasCachedConcat(module)) {
      delete module.jsCss.result.concat
    }
    Object.values(module.dependants).forEach(
      d => jsCssBundler.invalidateConcatCache(d),
    )
  },
  hasCachedConcat: module => (
    !!module.jsCss && !!module.jsCss.result && !!module.jsCss.result.concat
  ),
}

exports.jsCssBundler = jsCssBundler
