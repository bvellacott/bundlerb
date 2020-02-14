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
		if (filename.endsWith('.svg')) {
			contents = `
import { h } from 'preact'
export default () => ${contents.replace(/\n/g, '')}
`
		}
		const transformed = babel.transformSync(contents, config.babel.server)
		return transformed.code
	}
	
	addHook(handleJSX, { exts: ['.js', '.jsx', '.svg'] })
	addHook(handleNonJs, { exts: index.nonJsExtensions })
	
	watch([
		process.cwd(),
	], { recursive: true }, (evt, filename) => {
		try {
			if (filename && fs.statSync(filename).isFile()) {
				console.log('clearing caches')
				Object.keys(require.cache).forEach(key => delete require.cache[key])
			}
		} catch (e) {
			console.error(e)
		}
	});
}

exports.setupBabelSsr = setupBabelSsr