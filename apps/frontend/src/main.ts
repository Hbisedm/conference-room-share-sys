import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './plugins/router-install'
import { setupPinia } from './plugins/pinia-install'

// import '@unocss/reset/tailwind.css'

// import './styles/main.css'
import 'uno.css'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

setupRouter(app)
setupPinia(app)

app.mount('#app')
