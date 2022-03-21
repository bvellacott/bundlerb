const WebSocket = require('ws')
const url = require('url')
const defaultActions = require('./actions')

const execute = (msg, actions) => {
  const message = JSON.parse(msg)
  const { id, method, params } = message
  const action = actions[method]
  if (typeof action === 'function') {
    return action(id, params)
  }
}

const addWebsocketControlServer = (
  server,
  options = {}
) => new Promise((resolve, reject) => {
  const {
    actions = {},
    path = '/bb-ws-control',
  } = options
  const allActions = { ...defaultActions, ...actions }
  try {
    const websocketControl = new WebSocket.Server({
      noServer: true,
      clientTracking: true,
    })
    websocketControl.on('connection', (ws, request, client) => {      
      ws.on('message', (msg) => {
        const result = execute(msg, allActions)
        if (result && typeof result === 'object') {
          ws.send(JSON.stringify(result))
        }
      })
      console.log('connected websocket control server')
      resolve(websocketControl)
    })
    
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = url.parse(request.url).pathname
     
      if (pathname === path) {
        websocketControl.handleUpgrade(request, socket, head, function done(ws) {
          websocketControl.emit('connection', ws, request)
        });
      } else {
        socket.destroy()
      }
    })
  } catch (e) {
    reject(e)
  }
})

exports.execute = execute
exports.addWebsocketControlServer = addWebsocketControlServer
