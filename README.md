# bundlerb

Bundles on the fly

This is a base project with a custom bundler that uses only babel and postcss. It doesn't have a separate build process, but instead has an asset server which will serve all assets in the project bundling all the javascript and css upon request and caching the result. The actual app works as an overview for the reasoning and architecture of the tool. Also it uses preact instead of react and redux-zero instead of redux since they are a tenth of the size.

## run development

```bash
clone

npm i

npm start
```

browse to http://localhost:4000/index.html

## build

```bash
npm run start:production

npm run build:static
```

## config

The bundlerb-config.js file at the root is used as the configuration file, see the comments in it to understand how it's used. It's not yet clear what parts should be pushed into code and what parts should be pulled into
configuration so this project will stay as a template project, until that becomes clearer.
