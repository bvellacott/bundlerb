require('bueno-repo').setupAliases()
const express = require('express')

const isDev = process.env.NODE_ENV === 'development'

const initRoutes = (app, {
  setupSsrRoutes = () => {},
  config,
  bundler,
} = {}) => {
  app.get('*', (req, res, next) => {
    // console.log('CALLING:', req.path)
    next()
  })
  if (config.discardPaths) {
    app.get(config.discardPaths, (req, res, next) => {
      res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
      res.send('')
      // console.log('DISCARDED:', req.path)
    })
  }
  app.use(express.static('static'))
  if (isDev) {
    app.get(['/*.js', '/*.js.map', '/*.mjs', '/*.mjs.map', '/*.scss', '/*.scss.map', '/*.css', '/*.css.map'],
      (req, res, next) => {
        req.modulePath = req.path
        return bundler(req, res, next)
      })
    app.get(['/*.jscss', '/*.jscss.map'], (req, res, next) => {
      req.modulePath = req.path.replace(/\.jscss($|\..*)/, '.js')
      req.resourcePath = req.path.replace(/\.map$/, '')
      return bundler(req, res, next)
    })
    app.get(['/*.js', '/*.mjs'], (req, res) => {
      res.setHeader('Content-Type', 'text/javascript;charset=UTF-8')
      res.send(req.module.js.result.postprocessedContent)
    })
    app.get(['/*.js.map', '/*.mjs.map'], (req, res) => {
      res.setHeader('Content-Type', 'application/json;charset=UTF-8')
      res.send(req.module.js.result.postprocessedMap)
    })
    app.get('/*.jscss', (req, res) => {
      res.setHeader('Content-Type', 'text/css;charset=UTF-8')
      res.send(req.module.jsCss.result.postprocessedContent)
    })
    app.get('/*.jscss.map', (req, res) => {
      res.setHeader('Content-Type', 'text/css;charset=UTF-8')
      res.send(req.module.jsCss.result.postprocessedMap)
    })
    app.get(['/*.scss', '/*.css'], (req, res) => {
      res.setHeader('Content-Type', 'text/css;charset=UTF-8')
      res.send(req.module.css.result.postprocessedContent)
    })
    app.get(['/*.scss.map', '/*.css.map'], (req, res) => {
      res.setHeader('Content-Type', 'application/json;charset=UTF-8')
      res.send(req.module.css.result.postprocessedMap)
    })
  } else {
    app.get(['/src/*.js', '/src/*.js.map'],
      (req, res, next) => {
        req.modulePath = req.path
        return bundler(req, res, next)
      })
    app.get(['/src/*.jscss', '/src/*.jscss.map'],
      (req, res, next) => {
        req.modulePath = req.path.replace(/\.jscss($|\..*)/, '.js')
        req.resourcePath = req.path.replace(/\.map$/, '')
        return bundler(req, res, next)
      })
    app.get(['/src/*.js'],
      (req, res) => {
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8')
        res.send(req.module.js.result.postprocessedContent)
      })
    app.get(['/src/*.js.map'], (req, res) => {
      res.setHeader('Content-Type', 'application/json;charset=UTF-8')
      res.send(req.module.js.result.postprocessedMap)
    })
    app.get('/src/*.jscss',
    (req, res) => {
      res.setHeader('Content-Type', 'text/css;charset=UTF-8')
      res.send(req.module.jsCss.result.postprocessedContent)
    })
    app.get('/src/*.jscss.map', (req, res) => {
      res.setHeader('Content-Type', 'text/css;charset=UTF-8')
      res.send(req.module.jsCss.result.postprocessedMap)
    })
  }
  setupSsrRoutes(app)
}

exports.initRoutes = initRoutes
