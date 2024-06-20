import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

import type { App } from 'vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
