module.exports = function (msg, causeE) {
  try {
    const depth = (causeE.depth || 0)
    if (depth > 1) {
      return causeE
    }
    const error = new Error(`${causeE.message}: ${causeE.stack}\n ----------- CAUSES -----------\n${msg}`)
    error.depth = depth + 1
    return error
  } catch (e) {
    return new Error(msg)
  }
}
