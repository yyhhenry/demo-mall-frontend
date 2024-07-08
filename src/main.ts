import '@yyhhenry/element-extra/dist/style.css';

import { createApp } from 'vue';
import App from './App.vue';
import { useColorMode, useTitle } from '@vueuse/core';
import { websiteName } from './utils/website-name';
import router from './router';

const app = createApp(App);

useColorMode();
useTitle(websiteName);
app.use(router);

app.mount('#app');
