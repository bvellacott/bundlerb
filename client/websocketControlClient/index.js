import * as actions from './actions'

export const execute = (msg) => {
  const message = JSON.parse(msg)
  const { id, method, params } = message
  const action = actions[method]
  if (typeof action === 'function') {
    return action(id, params)
  }
}

export const addWebsocketControlClient = (path = '/bb-ws-control') => {
  const socket = new WebSocket(`ws://${document.location.host}${path}`);
  socket.addEventListener('open', (event) => {
    console.log('connected websocket control client')
  });

  socket.addEventListener('message', (event) => {
    console.log(event.data)
    const result = execute(event.data)
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
