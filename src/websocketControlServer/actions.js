const ping = (id) => ({
  id,
  method: 'pong',
  params: {},
})

exports.ping = ping
