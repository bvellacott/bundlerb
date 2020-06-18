const postcssNested = require('postcss-nested')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')

const addMissingRequireMisc = require('./bundlerb/babel-plugins/transform-add-missing-require-misc-to-amd').default

module.exports = {
  // loaded before babel.config.js
  babel: {
    // run before dependencies are resolved
    // ensures that babel is able to parse the files, but doesn't
    // need to perform any transformations
    clientSyntaxPlugins: [
      '@babel/plugin-syntax-jsx',
      '@babel/plugin-proposal-class-properties',
    ],
    client: {
      // runs after all dependecies are resolved
      // these should perform all necessary transformations
      // for the browser
      presets: process.env.NODE_ENV === 'prod' ? [
        '@babel/preset-env',
        'minify',
      ] : undefined,
      plugins: [
        '@babel/plugin-transform-classes',
        ['@babel/plugin-transform-modules-amd'],
        addMissingRequireMisc,
      ],
      sourceMaps: true
    },
    server: {
      // plugins to ensure ssr runs
      plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-transform-modules-commonjs',
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
      process.env.NODE_ENV === 'prod' ? cssnano({
        preset: 'default',
      }) : undefined,
    ].filter(plugin => plugin),
  },
  nodeWatch: {
    reqursive: true,
  },
  nodeWatchPaths: [
    'src',
  ],
  ssrIndex: '/src/index.jsx',
  ssrPaths: [
    '/aapp.html',
    '/aapp/bapp.html',
  ],
}
