/* config-overrides.js */
module.exports = function override(config, env) {
  // Desabilitar o uso do PostCSS
  const cssRule = config.module.rules.find(rule => 
    rule.test && rule.test.toString().includes('css')
  );
  if (cssRule) {
    // Encontrar a regra do PostCSS e remover
    const loaders = cssRule.use || cssRule.loader;
    if (Array.isArray(loaders)) {
      const postcssLoaderIndex = loaders.findIndex(loader => 
        loader && loader.loader && loader.loader.includes('postcss-loader')
      );
      if (postcssLoaderIndex !== -1) {
        loaders.splice(postcssLoaderIndex, 1);
      }
    }
  }
  return config;
} 