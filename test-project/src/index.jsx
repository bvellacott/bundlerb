import { h } from 'preact'
import { Provider } from 'redux-zero/preact'
import render from 'preact-render-to-string';
import { configureStore } from '@/store'
import { App } from '@/components/App';


export default (req, res) => {
  const store = configureStore()
  return render(
    <html>
    <head>
      <title>BundlerB</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <link rel="stylesheet" href="/src/index.jscss" />
    </head>
    <body>
      <Provider store={store}>
        <App path={req.path} />
      </Provider>
      <script>
        {`window.process = {env: {NODE_ENV: '${process.env.NODE_ENV}'}}`}
      </script>
      <script src="/src/index.js"></script>
    </body>
  </html>);
}
