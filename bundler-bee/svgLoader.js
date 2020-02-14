const loadSvgTarget = (module) => new Promise((resolve) => {
  module.js = module.js || { result: {} }
  module.js.contents = `export default "${module.contents.replace(/"/g, '\\"').replace(/\n/g, '')}"\n`
  return resolve(module)
})

const svgLoader = {
  matcher: /.svg$/,
  load: loadSvgTarget,
}

exports.loadSvgTarget = loadSvgTarget
exports.svgLoader = svgLoader