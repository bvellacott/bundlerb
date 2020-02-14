module.exports = function(api) {
  api.cache(true);
  return {
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
