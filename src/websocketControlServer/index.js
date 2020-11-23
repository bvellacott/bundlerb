const WebSocket = require('ws')
const url = require('url')
const actions = require('./actions')

const execute = (msg) => {
  const message = JSON.parse(msg)
  const { id, method, params } = message
  const action = actions[method]
  if (typeof action === 'function') {
    return action(id, params)
  }
}

const addWebsocketControlServer = (server, path = '/bb-ws-control') => new Promise((resolve, reject) => {
  try {
    const websocketControl = new WebSocket.Server({ noServer: true })
    websocketControl.on('connection', (ws, request, client) => {
      const sendWsControl = (
        message = {
          id: -1,
          method: 'ping',
          params: {}
        }
      ) => ws.send(JSON.stringify(message))
      resolve(sendWsControl)
      console.log('connected websocket control server')
  
      ws.on('message', (msg) => {
        console.log(msg)
        const result = execute(msg)
        if (result && typeof result === 'object') {
          ws.send(JSON.stringify(result))
        }
      })
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
