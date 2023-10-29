import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import type { App } from 'vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
