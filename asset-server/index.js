const { join } = require('path')
const express = require('express')
const { setupBabelSsr } = require('../bundler-bee/setupBabelSsr')
const { buildIndex, bundlerBee } = require('../bundler-bee')
const { moduleAliases } = require('../package.json')
const { requireConfig } = require('../bundler-bee/utils')

const config = requireConfig()

const app = express();

const index = buildIndex({
  aliases: moduleAliases,
  defaultBabelOptions: config.babel.client,
  syntaxPlugins: config.babel.clientSyntaxPlugins,
})

setupBabelSsr(index)
const bundler = bundlerBee(index)

const aliases = Object.keys(moduleAliases || {}).map(alias => ({
  regex: new RegExp(`/^${alias}/`),
  aliasedPath: moduleAliases[alias],
}))
const transformAlias = (path) => {
  for (let i = 0; i < aliases.length; i++) {
    const { regex, aliasedPath } = aliases[i];
    if (regex.test(path)) {
      const noAlias = path.replace(regex, '')
      return path.join(aliasedPath, noAlias)
    }
  }
  return path;
}

const ssrJsx = (relativeModulePath, req, res) => {
  const modulePath = join(process.cwd(), transformAlias(relativeModulePath))
  const render = require(modulePath).default
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  res.send(render(req, res))
}

app.get([
  '/aapp.html',
  '/aapp/bapp.html',
], (req, res, next) => ssrJsx('/src/index.jsx', req, res, next))
app.get(['/*.jsx'], ssrJsx)
app.get(['/*.js', '/*.js.map', '/*.mjs', '/*.mjs.map', '/*.scss', '/*.scss.map', '/*.css', '/*.css.map'],
  (req, res, next) => {
    req.modulePath = transformAlias(req.path)
    return bundler(req, res, next)
  })
app.get(['/*.jscss', '/*.jscss.map'], (req, res, next) => {
  req.modulePath = transformAlias(req.path.replace(/\.jscss$/, '.js'))
  return bundler(req, res, next)
})
app.get(['/*.js', '/*.mjs'], (req, res) => {
  res.setHeader('Content-Type', 'text/javascript;charset=UTF-8')
  res.send(req.module.js.result.concat.content)
})
app.get(['/*.js.map', '/*.mjs.map'], (req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  res.send(req.module.js.result.concat.sourceMap)
})
app.get('/*.scss', (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.css.result.concat.content)
})
app.get('/*.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.css.result.concat.content)
})
app.get('/*.jscss', (req, res) => {
  res.setHeader('Content-Type', 'text/css;charset=UTF-8')
  res.send(req.module.jsCss.result.concat.content)
})
app.get('/*.scss.map', (req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  res.send(req.module.css.result.concat.sourceMap)
})
app.get('/*.css.map', (req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  res.send(req.module.css.result.concat.sourceMap)
})
app.use(express.static(process.cwd()))

app.listen(4000);
