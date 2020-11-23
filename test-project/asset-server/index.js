require('bueno-repo').setupAliases()
const { join } = require('path')
const express = require('express')
const {
  buildIndex,
  bundlerBee,
  setupBabelSsr,
  addWebsocketControlServer,
} = require('bundlerb')
const { requireBundlerbConfig } = require('bundlerb/utils')

const config = requireBundlerbConfig()
const app = express();

const index = buildIndex({
  defaultBabelOptions: config.babel.client,
  syntaxPlugins: config.babel.clientSyntaxPlugins,
})

const bundler = bundlerBee(index)

const ssrJsx = (relativeModulePath, req, res) => {
  const modulePath = join(process.cwd(), relativeModulePath)
  const render = require(modulePath).default
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  res.send(render(req, res))
}

app.get('*', (req, res, next) => {
  // console.log('CALLING:', req.path)
  next()
})
config.discardPaths && app.get(config.discardPaths, (req, res, next) => {
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
  res.send('')
  // console.log('DISCARDED:', req.path)
})
app.use(express.static('static'))
if (config.ssrIndex) {
  app.get(
    [...(config.ssrPaths || []), '/*.html'],
    (req, res, next) => ssrJsx(config.ssrIndex, req, res, next),
  )
}
app.get(['/*.jsx'], ssrJsx)
app.get(['/*.js', '/*.js.map', '/*.mjs', '/*.mjs.map', '/*.scss', '/*.scss.map', '/*.css', '/*.css.map'],
  (req, res, next) => {
    req.modulePath = req.path
    return bundler(req, res, next)
  })
app.get(['/*.jscss', '/*.jscss.map'], (req, res, next) => {
  req.modulePath = req.path.replace(/\.jscss/, '.js')
  return bundler(req, res, next)
})
app.get(['/*.js', '/*.mjs'], (req, res) => {
  res.setHeader('Content-Type', 'text/javascript;charset=UTF-8')
  res.send(req.module.js.result.concat.content)
})
app.get(['/*.js.map', '/*.mjs.map'], (req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  res.send(req.module.js.result.concat.sourceMap)
})
app.get('/*.jscss', (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.jsCss.result.concat.content)
})
app.get('/*.jscss.map', (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.jsCss.result.concat.sourceMap)
})
app.get(['/*.scss', '/*.css'], (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.css.result.concat.content)
})
app.get(['/*.scss.map', '/*.css.map'], (req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  res.send(req.module.css.result.concat.sourceMap)
})
app.use(express.static(process.cwd()))

const server = app.listen(config.port)

let sendWsControl = () => {}
addWebsocketControlServer(server).then((send) => {
  sendWsControl = send
  sendWsControl()
})

let changeId = 0
const watchCallback = (filename) => {
  sendWsControl({
    id: `file-changed-${changeId}`,
    method: 'fileChanged',
    params: {
      filename,
    },
  })
}

setupBabelSsr(
  index.nonJsFiles,
  index.nonJsExtensions,
  watchCallback,
)
