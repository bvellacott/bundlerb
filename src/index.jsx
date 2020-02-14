import { h } from 'preact'
import render from 'preact-render-to-string';
import './index.css';
import App from './App';

export default (req, res) => render(
  <html>
  <head>
    <title>Create React App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="stylesheet" href="/src/index.jscss" />
  </head>
  <body>
    <App />
    <script>
      {"window.ASSET_ROOT = 'http://localhost:4000/';"}
      {"window.process = {"}
      {"  env: {"}
      {"    NODE_ENV: 'development',"}
      {"  },"}
      {"}"}
    </script>
    <script src="browser-require.js"></script>
    <script src="/src/index.js"></script>
  </body>
</html>);
