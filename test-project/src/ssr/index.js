import './serverPolyfills'
import renderMain from './views/main'

export default (app) => {
  app.get([
      '/index.html',
      '/introduction.html',
      '/approach.html',
      '/finally.html',
      '/error/404.html',
      '/error/500.html',
    ], (req, res, next) => {
      res.setHeader('Content-Type', 'text/html;charset=UTF-8')
      res.send(renderMain(req, res, next))
    },
  )
}
