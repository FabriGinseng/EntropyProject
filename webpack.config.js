// webpack.config.js
// eslint-disable-next-line import/extensions,import/no-unresolved
import AutoImport from 'unplugin-auto-import/webpack';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Components from 'unplugin-vue-components/webpack';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

module.exports = {
  // ...
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
};
