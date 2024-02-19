import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import Coba from './Coba.vue'

const app = createApp(Coba)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.mount('#app')
