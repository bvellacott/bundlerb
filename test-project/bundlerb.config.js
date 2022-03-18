const { join } = require('path')
const { readFileSync } = require('fs')
const postcssNested = require('postcss-nested')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')

const addMissingRequireMisc = require('bundlerb/babel-plugins/transform-add-missing-require-misc-to-amd').default
const transformPackFilepaths = require('bundlerb/babel-plugins/transform-pack-filepaths').default

const isProd = process.env.NODE_ENV === 'production'

const jsxPluginConfig = [
  '@babel/plugin-transform-react-jsx', {
    pragma: 'h',
    pragmaFrag: 'Fragment',
    throwIfNamespace: false,
  },
]

module.exports = {
  // loaded before babel.config.js
  babel: {
    // run before dependencies are resolved
    // ensures that babel is able to parse the files, but doesn't
    // need to perform any transformations
    clientSyntaxPlugins: [
      '@babel/plugin-syntax-jsx',
    ],
    client: {
      // runs after all dependecies are resolved
      // these should perform all necessary transformations
      // for the browser
      // ... understanding plugin and preset ordering is essential here
      presets: [
        {
          plugins: [
            addMissingRequireMisc, // keep for default bundling
            isProd ? transformPackFilepaths : null, // keep for minification
            jsxPluginConfig, // keep for default bundling
            '@babel/plugin-transform-classes',
            '@babel/plugin-transform-destructuring',
          ].filter(plugin => plugin),
        }, [
          '@babel/preset-env', {
            modules: 'amd', // keep for default bundling
          },
        ], 
      ],
      sourceMaps: true,
      minified: isProd,
      compact: isProd,
      comments: !isProd,
      retainLines: !isProd,
    },
    server: {
      // plugins to ensure ssr runs
      plugins: [
        jsxPluginConfig,
        '@babel/plugin-transform-modules-commonjs', // keep for es6 support on ssr
      ],
    },
  },
  postcss: {
    plugins: [
      postcssNested,
      postcssCustomProperties({
        importFrom: [
          './postcssCustomProperties/constants.css',
        ],
        preserve: false,
      }),
      process.env.NODE_ENV === 'production' ? cssnano({
        preset: 'default',
      }) : undefined,
    ].filter(plugin => plugin),
  },
  // https://www.npmjs.com/package/uglify-js#user-content-minify-options-structure
  uglifyjs: {
    // parse: {},
    compress: false,
    mangle: true,
    output: {
      // output options
    },
    // sourceMap: {},
    // nameCache: null, // or specify a name cache object
    toplevel: false,
    warnings: false,
  },
  preloadScripts: [
    readFileSync(require.resolve(`bundlerb/client/bequire${isProd ? '.min' : ''}`, 'utf8')),
    'define.suspend()',
  ],
  postloadScripts: [
    'define.resume()',
  ],
  nodeWatch: {
    // this configures file watching for ssr
    recursive: true,
    filter: new RegExp(join(process.cwd(), 'src')) // stop parents from being watched outside of src
  },
  nodeWatchPaths: [
    // this configures which paths are watched for ssr
    'src',
  ],
  port: 3000,
  mocksAppPort: 5000,
}
