const { addHook } = require('pirates')
const watch = require('node-watch')
const fs = require('fs')
const babel = require('@babel/core')
const { requireConfig } = require('./utils')

const setupBabelSsr = (index) => {
	const config = requireConfig()
	
	const handleNonJs = (contents, filename) => {
		index.nonJsFiles[filename] = contents
		return ''
	}
	
	const handleJSX = (contents, filename) => {
		const transformed = babel.transformSync(contents, config.babel.server)
		return transformed.code
	}
	
	addHook(handleJSX, { exts: ['.js', '.jsx'] })
	addHook(handleNonJs, { exts: index.nonJsExtensions })
	
	watch([
		process.cwd(),
	], { recursive: true }, (evt, filename) => {
		try {
			if (filename && fs.statSync(filename).isFile()) {
				delete require.cache[filename]
			}
		} catch (e) {
			console.error(e)
		}
	});
}

exports.setupBabelSsr = setupBabelSsr