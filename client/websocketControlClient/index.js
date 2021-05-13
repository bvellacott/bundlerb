import * as defaultActions from './actions'

export const execute = (msg, actions) => {
  const message = JSON.parse(msg)
  const { id, method, params } = message
  const action = actions[method]
  if (typeof action === 'function') {
    return action(id, params)
  }
}

export const addWebsocketControlClient = (options = {}) => {
  const {
    actions = {},
    path = '/bb-ws-control',
  } = options
  const allActions = { ...defaultActions, ...actions }

  const { protocol } = document.location
  const websocketProtocol = protocol === 'https:' ? 'wss:' : 'ws:'

  const socket = new WebSocket(`${websocketProtocol}//${document.location.host}${path}`);
  socket.addEventListener('open', (event) => {
    console.log('connected websocket control client')
  });

  socket.addEventListener('message', (event) => {
    console.log(event.data)
    const result = execute(event.data, allActions)
    if (result && typeof result === 'object') {
      socket.send(JSON.stringify(result))
    }
  })

  window.sendWsControl = (
    message = {
      id: -1,
      method: 'ping',
      params: {}
    }
  ) => socket.send(JSON.stringify(message))  
}
