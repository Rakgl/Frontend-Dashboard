import { createApp } from 'vue'
import '../src/assets/scss/main.scss';
import 'vuetify/lib/styles/main.sass';
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from '../src/routers';
import Main from './Main.vue';
import VueApexCharts from "vue3-apexcharts";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: { dark: false },
            dark: { dark: true },
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
})

createApp(Main)
    .use(vuetify)
    .use(VueApexCharts)
    .use(router)
    .mount('#app');