import { createApp } from 'vue';
import 'default-passive-events';
import './style.css';
import 'vant/es/toast/style';
import App from './App.vue';
import { setupRouter } from './router';
import { setupI18n } from './i18n';

// import pinia from '@/stores';

import { WagmiPlugin } from '@wagmi/vue';
import { config } from './plugins/config.js';
import { VueQueryPlugin } from '@tanstack/vue-query';

// import Vue3Marquee from 'vue3-marquee';
const setupApp = async () => {
  const app = createApp(App);
  await setupI18n(app);
  setupRouter(app);
  app.use(WagmiPlugin, { config });
  app.use(VueQueryPlugin);
  // app.use(Vue3Marquee);
  // app.use(pinia);
  app.mount('#app');
};

setupApp();
