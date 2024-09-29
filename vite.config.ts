import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver, VantImports } from '@vant/auto-import-resolver';
function pathResolver(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [VantResolver()],
      dts: true,
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: [
      //路径别名
      {
        find: '@',
        replacement: pathResolver('src'),
      },
    ],
  },
  server: {
    host: true,
    port: 3003,
    proxy: {
      '/api/v1': {
        // target: 'https://api.m3.pics/',
        target: 'https://chr.cool/',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'],
  },
});
