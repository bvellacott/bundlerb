const loadSvgTarget = (module) => new Promise((resolve) => {
  module.js = module.js || { result: {} }
  module.js.contents = `
import { h } from 'preact'
export default () => ${module.contents.replace(/\n/g, '')}
`
  return resolve(module)
})

const svgLoader = {
  matcher: /.svg$/,
  load: loadSvgTarget,
}

exports.loadSvgTarget = loadSvgTarget
exports.svgLoader = svgLoader