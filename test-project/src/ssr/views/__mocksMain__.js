import { h } from 'preact'
import { Provider } from 'redux-zero/preact'
import render from 'preact-render-to-string';
import { configureStore } from '@/store'
import { App } from '@/components/App/__mocks__';

export default (req) => {
  const store = configureStore()
  console.log('req.path', req.path)
  return render(
    <html>
    <head>
      <title>BundlerB - Mocks app</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <link rel="stylesheet" href="/src/index.jscss" />
    </head>
    <body>
      <div id="root">
        <Provider store={store}>
          <App path={req.path} />
        </Provider>
      </div>
      <script>
        {`window.process = {env: {NODE_ENV: '${process.env.NODE_ENV}'}}`}
      </script>
      <script src="/src/__mocks__.js"></script>
    </body>
  </html>)
}
