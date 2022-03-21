const { basename } = require('path')
const postcss = require('postcss')
const BBError = require('../BBError')
const { requireBundlerbConfig } = require('../../utils')
const bundlerbPostcssLoader = require('../../postcss-plugins/bundlerb-postcss-loader')

const config = requireBundlerbConfig()

const loadCssTarget = api => (module, index) => new Promise((resolve, reject) => {
  module.css = module.css || {}
  module.css.dependencyPaths = module.css.dependencyPaths || []
  postcss(config.postcss.plugins)
    .use(bundlerbPostcssLoader(module))
    .process(module.contents, {
      from: module.sourceMapFilename,
      to: basename(module.sourceMapFilename),
      map: {
        inline: false,
        annotation: false,
        sourcesContent: true,
      },
    })
    .then(async result => {
      module.dependencies.push(...(await api.resolveModules(module.css.dependencyPaths, index)))
      module.css.result = result
      resolve(module)
    })
    .catch(e => reject(new BBError(`Failed to load css target '${module.path}'`, e)))
})

const postcssLoader = api => ({
  matcher: /.css$|.scss$/,
  load: loadCssTarget(api),
})

exports.loadCssTarget = loadCssTarget
exports.postcssLoader = postcssLoader
