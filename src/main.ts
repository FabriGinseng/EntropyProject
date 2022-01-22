import { createApp } from 'vue';
import VNetworkGraph from 'v-network-graph';
import 'v-network-graph/lib/style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).use(ElementPlus).use(VNetworkGraph)
  .mount('#app');
