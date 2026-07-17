/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Enumerate the pages to prerender straight from the registry, so every
// component ships a static HTML page without depending on link-crawling.
const registry = JSON.parse(readFileSync(new URL('./registry.json', import.meta.url), 'utf8'))
const componentRoutes = registry.items
  .filter((i: { type: string }) => i.type === 'registry:ui')
  .map((i: { name: string }) => `/components/${i.name}`)

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ssgOptions: {
    formatting: 'minify',
    includedRoutes: () => ['/', ...componentRoutes]
  }
})
