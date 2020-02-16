module.exports = function(api) {
  api.cache(true);
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  return {
    "presets": process.env.NODE_ENV === 'prod' ? [
      "@babel/preset-env",
      "minify",
    ] : undefined,
    "plugins": [
      "@babel/plugin-transform-destructuring",
      ["@babel/plugin-transform-react-jsx", {
        "pragma": "h",
        "pragmaFrag": "\"span\"",
        "throwIfNamespace": false,
      }],
    ],
    "sourceMaps": true
  };
}
