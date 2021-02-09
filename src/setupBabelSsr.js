const fs = require('fs')
const { resolve } = require('path')
const { addHook } = require('pirates')
const watch = require('node-watch')
const babel = require('@babel/core')
const nodeModulesRegex = require('node-modules-regexp')
const BBError = require('./BBError')
const { requireBundlerbConfig } = require('../utils')

const config = requireBundlerbConfig()
const { filter =  () => true } = config.nodeWatch
const watchFilter = typeof filter.test === 'function'
	? (f) => filter.test(f)
	: filter

const isDev = process.env.NODE_ENV === 'development'

const watchCallbacks = []
const addWatchCallback = (watchCb) => {
	if (typeof watchCb === 'function') {
		watchCallbacks.push(watchCb)
	}
}

const setupBabelSsr = (
	nonJsFiles = {},
	nonJsExtensions = [],
	watchCb,
) => {
	addWatchCallback(watchCb)
	const handleNonJs = (contents, filename) => {
		nonJsFiles[filename] = contents
		return ''																																			
	}

	const handleJsx = (contents, filename) => {
		if (nodeModulesRegex.test(filename) && !filename.includes('node_modules/@coppi/')) {
			return contents
		}

		const transformed = babel.transformSync(contents, config.babel.server)
		return transformed.code
	}
	
	addHook(handleJsx, {
		exts: ['.js', '.jsx'],
		ignoreNodeModules: false,
	})
	addHook(handleNonJs, {
		exts: nonJsExtensions,
		ignoreNodeModules: false,
	})
	
	if (isDev) {
		watch(
			(config.nodeWatchPaths || []).map(
				path => resolve(process.cwd(), path)
			),
			config.nodeWatch,
			(evt, filename) => {
				try {
					if (filename && fs.statSync(filename).isFile()) {
						watchCallbacks.forEach(watchCb => watchCb(filename))
						console.log(`clearing ${filename} from cache`)
						try {
							module = require.cache[filename]
							require.cache[filename] = {}
							const parents = clearParentsFromCache(require.cache, [module])
							delete require.cache[filename]
							parents.forEach(({ filename }) => require(filename))
							require(filename)
						} catch (e) {
							throw new BBError(`failed to clear parent modules from cache for: ${filename}`, e)
						}
					}
				} catch (e) {
					console.error(e)
				}
			});
	}
}

const clearParentsFromCache = (cache, modules) => {
	const parents = getParentsFromCache(cache, modules)
	if (parents.length) {
		parents.forEach(({ filename }) => {
			console.log(`clearing ${filename} from cache`)
			delete require.cache[filename]
		})
		try {
			clearParentsFromCache(cache, parents)
		} catch (e) {
			throw new BBError('failed to clear parent modules from cache', e)
		}
	}
	return parents || []
}

const getParentsFromCache = (cache, modules) => {
	return Object.values(cache)
		.filter((module) => module && watchFilter(module.filename))
		.filter(({ filename }) => watchFilter(filename))
		.filter(({ children = [] }) => modules
			.filter((module) => module && watchFilter(module.filename))
			.some(({ filename }) => children
				.find(({ filename: childFilename }) => childFilename === filename)))
}

exports.setupBabelSsr = setupBabelSsr
exports.addWatchCallback = addWatchCallback
