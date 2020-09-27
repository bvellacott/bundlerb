const postcssNested = require('postcss-nested')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')

const addMissingRequireMisc = require('bundlerb/babel-plugins/transform-add-missing-require-misc-to-amd').default

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
            jsxPluginConfig, // keep for default bundling
            '@babel/plugin-transform-classes',
            '@babel/plugin-transform-destructuring',
          ],
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

  nodeWatch: {
    // this configures file watching for ssr
    recursive: true,
  },
  nodeWatchPaths: [
    // this configures which paths are watched for ssr
    'src',
  ], 
  ssrIndex: '/src/index.jsx', // which file is used to render ssr
  // entry file names for ssr - by default *.html files are ssr'ed if the ssrIndex is setup
  // but if the file doesn't end .html or the you want to create a static file build by
  // running `npm run build:static`, you need to specify the path in the array below
  ssrPaths: [
    '/index.html',
    '/introduction.html',
    '/approach.html',
    '/finally.html',
    '/404.html',
  ],
  port: 4001,
}
