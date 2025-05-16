import { createApp } from 'vue'
import '../src/assets/scss/main.scss';
// Vuetify
import 'vuetify/lib/styles/main.sass';
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from '../src/routers';
// import App from './App.vue';
import Main from './Main.vue';

const vuetify = createVuetify({
    components,
    directives,
})

createApp(Main).use(vuetify).use(router).mount('#app');