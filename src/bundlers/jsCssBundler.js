const { basename } = require('path')

const jsCssBundler = {
  matcher: /\.js$/,
  bundle: (module, flattenedWithoutPrior, index, concat, noLoadWrap) => {
    [...flattenedWithoutPrior, module]
      .filter(module => module.css)
      .forEach(({ sourceMapFilename, css: { result: { css, map }}}) => (
        concat.add(sourceMapFilename, css, index.sourcemaps && map ? map.toString() : undefined)
      ))
    const filename = basename(module.path).replace(/\.js$/, '.jscss')
    if (index.sourcemaps) {
      concat.add(filename, '')
      concat.add(null,
        `/*# sourceMappingURL=${filename}${index.mapFileSuffix}${index.priorIdsString ?
          `?priorIds=${index.priorIdsString} */` :
          ' */'}`
      )
    }
    module.jsCss = module.jsCss || { result: {} }
    module.jsCss.result.concat = concat
    module.jsCss.result.postprocessedContent = concat.content
    module.jsCss.result.postprocessedMap = concat.sourceMap
  },
  invalidate: module => delete module.jsCss,
  hasCachedResult: module => !!module.jsCss,
  invalidateConcatCache: (module, allDependants) => {
    allDependants = allDependants || {}
    allDependants[module.path] = module
    if (jsCssBundler.hasCachedConcat(module)) {
      delete module.jsCss.result.postprocessedContent
      delete module.jsCss.result.postprocessedMap
    }
    Object.values(module.dependants).forEach(
      d => (!allDependants[d.path] && jsCssBundler.invalidateConcatCache(d, allDependants)),
    )
  },
  hasCachedConcat: module => (
    !!module.jsCss && !!module.jsCss.result && !!module.jsCss.result.postprocessedContent
  ),
}

exports.jsCssBundler = jsCssBundler
