<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { Github } from 'lucide-vue-next'

import VerveMark from './site/VerveMark.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { REPO_URL, SITE_URL } from './config'

// Site-wide head defaults. Each view's useHead runs after this and overrides
// title / description / canonical / og:url per route (unhead dedupes by
// name+property, last registration wins).
useHead({
  title: 'Verve — Vue Motion & Micro-interaction Components',
  meta: [
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
    { name: 'author', content: 'Jeton Korenica' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Verve' },
    { property: 'og:image', content: `${SITE_URL}/og.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Verve — motion components for Vue' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${SITE_URL}/og.png` },
    { name: 'twitter:image:alt', content: 'Verve — motion components for Vue' }
  ]
})

// --- Theme: dark-first, light still works, remembered across visits. ---
// index.html ships class="dark" on <html> so the prerendered HTML paints dark;
// this only reconciles with the visitor's saved choice after hydration.
const dark = ref(true)
onMounted(() => {
  const saved = localStorage.getItem('verve-theme')
  if (saved) dark.value = saved === 'dark'
})
watch(
  dark,
  (v) => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', v)
    localStorage.setItem('verve-theme', v ? 'dark' : 'light')
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen">
    <header
      class="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <RouterLink to="/" class="flex items-center gap-2.5" aria-label="Verve home">
          <VerveMark class="h-7 w-auto text-primary" />
          <span class="text-sm font-semibold tracking-tight">Verve</span>
        </RouterLink>
        <nav class="hidden items-center gap-1 sm:flex">
          <RouterLink
            to="/#components"
            class="rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
          >
            Components
          </RouterLink>
          <RouterLink
            to="/#install"
            class="rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground"
          >
            Install
          </RouterLink>
        </nav>
        <div class="flex items-center gap-2">
          <a
            :href="REPO_URL"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            class="interactive flex size-8 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/3 text-muted-foreground hover:text-foreground"
          >
            <Github class="size-4" />
          </a>
          <ThemeToggle v-model="dark" size="sm" />
        </div>
      </div>
    </header>

    <RouterView />

    <footer class="border-t border-foreground/10">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row"
      >
        <p>Verve · MIT · built with Vue, Tailwind &amp; motion-v</p>
        <RouterLink to="/#components" class="transition-colors hover:text-foreground">
          Browse components
        </RouterLink>
      </div>
    </footer>
  </div>
</template>
