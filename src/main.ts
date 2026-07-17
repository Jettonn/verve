import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router'

// Uncut Sans — self-hosted via Fontsource (the weights the UI actually uses).
import '@fontsource/uncut-sans/400.css'
import '@fontsource/uncut-sans/500.css'
import '@fontsource/uncut-sans/600.css'
import '@fontsource/uncut-sans/700.css'

import './style.css'

// vite-ssg builds the router, prerenders each route to static HTML, and hydrates
// on the client. The named export is what the SSG build looks for.
export const createApp = ViteSSG(App, { routes, scrollBehavior })
