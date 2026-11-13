import type { App as VueApp } from 'vue'
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp(): { app: VueApp<Element> } {
  const app = createSSRApp(App)
  return {
    app,
  }
}
