module.exports = function (msg, causeE) {
  try {
    return new Error(`${causeE.message}: ${causeE.stack}\n ----------- CAUSES -----------\n${msg}`)
  } catch (e) {
    return new Error(msg)
  }
}
