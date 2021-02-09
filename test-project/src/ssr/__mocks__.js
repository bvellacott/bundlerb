import renderMain from './views/__mocksMain__'

export default (app) => {
  app.get([
      '/',
    ], (req, res, next) => {
      res.setHeader('Content-Type', 'text/html;charset=UTF-8')
      res.send(renderMain(req, res, next))
    },
  )
}
