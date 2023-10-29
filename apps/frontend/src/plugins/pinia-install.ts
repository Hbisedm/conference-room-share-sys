import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

export function setupPinia(app: App<Element>) {
  app.use(pinia)
}
