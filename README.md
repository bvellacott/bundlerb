# bundlerb

Bundles on the fly

This is a base project with a custom bundler that uses only babel and postcss. It doesn't have a separate build process, but instead has an asset server which will serve all assets in the project bundling all the javascript and css upon request and caching the result. The actual app works as an overview for the reasoning and architecture of the tool. Also it uses preact instead of react and redux-zero instead of redux since they are a tenth of the size.

## what does it support
* builds using essentially babel and postcss plugins
* ssr
* static site building
* dynamic requires without dependency overlap (although not in use in the example)

## how does it do it?
It uses an asset server to serve files as bundles. I.e. which ever file you would request in the project, it will try to bundle and serve it. It uses babel and postcss plugins do bundle the files, resolving dependencies and ensuring cjs compatibility etc. There are three steps in bundling a file:

1. Resolve
  * Check has the file been loaded, if so has it's timestamp changed, if so has its contents changed, if so clear the cache for that file and reload the contents.
2. Load
  * Several loaders may run on a single file. If it is a css file imported from a js file, for instance, you'll want to run all your postcss plugins on it, but you might also want to create a js target for it which exports all the classnames in a js object. The loading phase is where all the heavy lifting must be done, because it operates on a file by file basis, meaning that a single file change will result in the heavy operations being run on only that file. All dependencies are resolved in the loading phase. Whenever a new dependency is encountered a new Resolve - Load sequence is started for it.
3. Bundle
  * Once all dependencies have resolved and loaded, they are returned in a bundle. Bundlers are used for this, and they essentially return a concatenated result of all the loaded files.

So as you see the problem is a type of an `expand - map - reduce` problem and solved as such. This is what gives the tool major performance benefits over the current tools available, meaning that it doesn't matter if it bundles the dependencies as well as the native code.

## run development

```bash
clone

npm i

npm start
```

browse to http://localhost:4000/index.html

To see a bundled js file, run 
http://localhost:4000/src/index.js

And to see the styles bundle for that js file, run
http://localhost:4000/src/index.jscss

And corresponding sourcemaps at
http://localhost:4000/src/index.js.map & http://localhost:4000/src/index.jscss.map

## static file build

```bash
npm run start:production

npm run build:static
```

## config

The bundlerb.config.js file at the root is used as the configuration file, see the comments in it to understand how it's used. It's not yet clear what parts should be pushed into code and what parts should be pulled into
configuration so this project will stay as a template project, until that becomes clearer.
