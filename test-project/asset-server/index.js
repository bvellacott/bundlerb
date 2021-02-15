require('bueno-repo').setupAliases()
const express = require('express')
const {
  buildIndex,
  bundlerBee,
  setupBabelSsr,
  addWatchCallback,
  addWebsocketControlServer,
} = require('bundlerb')
const { requireBundlerbConfig } = require('bundlerb/utils')

const isDev = process.env.NODE_ENV === 'development'

const config = requireBundlerbConfig()

const index = buildIndex({
  defaultBabelOptions: config.babel.client,
  syntaxPlugins: config.babel.clientSyntaxPlugins,
})

setupBabelSsr(
  index.nonJsFiles,
  index.nonJsExtensions,
)

const bundler = bundlerBee(index)

const _sendWsControl = (
  ws,
  message = {
    id: -1,
    method: 'ping',
    params: {}
  }
) => ws.send(JSON.stringify(message))

const start = (port, options) => {
  const app = express()
  require('./routes').initRoutes(app, options)
  let server = app.listen(port)
  let sendWsControl = () => {}
  if (isDev) {
    addWebsocketControlServer(server).then((wsServer) => {
      sendWsControl = (message) => wsServer.clients.forEach((ws) => _sendWsControl(ws, message))
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
    addWatchCallback(watchCallback)
  }
}

start(config.port, {
  setupSsrRoutes: require('../src/ssr').default,
  config,
  bundler,
})

if (isDev && config.mocksAppPort) {
  start(config.mocksAppPort, {
    setupSsrRoutes: require('../src/ssr/__mocks__').default,
    config,
    bundler,
  })
}
