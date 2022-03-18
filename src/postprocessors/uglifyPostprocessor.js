const { minify } = require('uglify-js')
const { requireBundlerbConfig } = require('../../utils')
const BBError = require('../BBError')

const config = requireBundlerbConfig()

const options = config.uglifyjs || {}

const uglifyJsTarget = (module, index) => new Promise((resolve, reject) => {
  const { sourceMapFilename } = module
  const { concat } = module.js.result
  const postprocessedContent = concat.content.toString('utf8')
  const postprocessedMap = concat.sourceMap.toString('utf8')
  module
  const {
    code,
    map,
    error,
  } = minify({ [sourceMapFilename]: postprocessedContent }, {
    ...options,
    sourceMap: {
      includeSources: true,
      content: postprocessedMap,
      filename: sourceMapFilename,
      url: `${sourceMapFilename}${index.mapFileSuffix}`,
      ...(options.sourceMap || {}),
    },
  })
  if (error) {
    return reject(new BBError('Uglify failed to minify the code', error))
  }
  concat.postprocessedContent = code
  concat.postprocessedMap = map
  resolve(module)
})

const uglifyPostprocessor = {
  matcher: /\.js$|\.mjs$/,
  postprocess: uglifyJsTarget,
}

exports.uglifyJsTarget = uglifyJsTarget
exports.uglifyPostprocessor = uglifyPostprocessor
