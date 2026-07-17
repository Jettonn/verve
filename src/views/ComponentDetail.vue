<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'

import CliInstall from '../site/CliInstall.vue'
import CopyButton from '../site/CopyButton.vue'
import ClientOnly from '../site/ClientOnly.vue'
import { CATALOG, findEntry } from '../catalog'
import { SITE_URL, REPO_URL } from '../config'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const entry = computed(() => findEntry(slug.value))

// Two-way v-model demo binding, generic across any component that exposes one.
const model = ref<unknown>(entry.value?.demoModel)
watch(entry, (e) => (model.value = e?.demoModel))

// A dynamic <component> ref — kept as unknown and narrowed when we call the
// exposed action, so neither the template binding nor eslint's no-any complains.
const demoRef = ref<unknown>(null)

const bindings = computed(() => {
  const e = entry.value
  if (!e) return {}
  const hasModel = e.demoModel !== undefined
  return {
    ...e.demoProps,
    ...(hasModel
      ? { modelValue: model.value, 'onUpdate:modelValue': (v: unknown) => (model.value = v) }
      : {})
  }
})

function runAction() {
  const method = entry.value?.action?.method
  if (!method) return
  const exposed = demoRef.value as Record<string, (() => void) | undefined> | null
  exposed?.[method]?.()
}

// A few sibling components to cross-link — pure internal-linking for crawlers.
const related = computed(() => {
  const i = CATALOG.findIndex((c) => c.slug === slug.value)
  if (i === -1) return CATALOG.slice(0, 4)
  return [1, 2, 3, 4].map((n) => CATALOG[(i + n) % CATALOG.length])
})

const canonical = computed(() => `${SITE_URL}/components/${slug.value}`)

useHead(
  computed(() => {
    const e = entry.value
    if (!e)
      return {
        title: 'Component not found — Verve',
        meta: [{ name: 'robots', content: 'noindex' }]
      }
    const title = `${e.name} — Vue ${e.tagline.toLowerCase()} | Verve`
    return {
      title,
      link: [{ rel: 'canonical', href: canonical.value }],
      meta: [
        { name: 'description', content: e.description },
        { name: 'keywords', content: e.keywords.join(', ') },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonical.value },
        { property: 'og:title', content: title },
        { property: 'og:description', content: e.description },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: e.description }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Verve', item: `${SITE_URL}/` },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Components',
                    item: `${SITE_URL}/#components`
                  },
                  { '@type': 'ListItem', position: 3, name: e.name, item: canonical.value }
                ]
              },
              {
                '@type': 'SoftwareSourceCode',
                name: e.name,
                description: e.description,
                url: canonical.value,
                codeRepository: REPO_URL,
                programmingLanguage: 'Vue',
                keywords: e.keywords.join(', '),
                license: 'https://opensource.org/licenses/MIT'
              }
            ]
          })
        }
      ]
    }
  })
)
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 pb-24 pt-10">
    <template v-if="entry">
      <!-- Breadcrumb -->
      <nav
        aria-label="Breadcrumb"
        class="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <RouterLink to="/" class="transition-colors hover:text-foreground">Verve</RouterLink>
        <ChevronRight class="size-3" />
        <RouterLink to="/#components" class="transition-colors hover:text-foreground">
          Components
        </RouterLink>
        <ChevronRight class="size-3" />
        <span class="text-foreground">{{ entry.name }}</span>
      </nav>

      <header class="mb-8">
        <span
          class="inline-block rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-tight text-muted-foreground"
        >
          {{ entry.tagline }}
        </span>
        <h1 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{{ entry.name }}</h1>
        <p class="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {{ entry.description }}
        </p>
      </header>

      <!-- Live demo -->
      <section class="mb-12">
        <div
          class="dot-grid relative flex min-h-[220px] items-center justify-center rounded-2xl border border-foreground/10 bg-card/60 p-8"
          :class="entry.wide ? 'overflow-hidden' : ''"
        >
          <ClientOnly>
            <component :is="entry.component" ref="demoRef" v-bind="bindings">
              <template v-if="entry.demoSlot">{{ entry.demoSlot }}</template>
            </component>
            <template #fallback>
              <span class="text-sm text-muted-foreground">Loading demo…</span>
            </template>
          </ClientOnly>
          <button
            v-if="entry.action"
            type="button"
            @click="runAction"
            class="interactive absolute right-3 top-3 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {{ entry.action.label }}
          </button>
        </div>
      </section>

      <!-- Install -->
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold tracking-tight">Installation</h2>
        <CliInstall :initial-slug="entry.slug" />
      </section>

      <!-- Source -->
      <section class="mb-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold tracking-tight">Source</h2>
          <CopyButton :code="entry.source" />
        </div>
        <pre
          class="max-h-[28rem] overflow-auto rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 text-xs leading-relaxed"
        ><code>{{ entry.source }}</code></pre>
      </section>

      <!-- Related -->
      <section>
        <h2 class="mb-4 text-xl font-semibold tracking-tight">More components</h2>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <RouterLink
            v-for="r in related"
            :key="r.slug"
            :to="`/components/${r.slug}`"
            class="group flex items-center justify-between rounded-xl border border-foreground/10 bg-card/60 px-4 py-3 transition-colors hover:border-foreground/20"
          >
            <span>
              <span class="block text-sm font-medium tracking-tight text-foreground">{{
                r.name
              }}</span>
              <span class="block text-xs text-muted-foreground">{{ r.tagline }}</span>
            </span>
            <ChevronRight
              class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
          </RouterLink>
        </div>
        <RouterLink
          to="/#components"
          class="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft class="size-4" />
          All components
        </RouterLink>
      </section>
    </template>

    <!-- Unknown slug -->
    <template v-else>
      <div class="py-24 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Component not found</h1>
        <p class="mt-3 text-sm text-muted-foreground">That component doesn't exist (yet).</p>
        <RouterLink
          to="/#components"
          class="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft class="size-4" />
          Browse all components
        </RouterLink>
      </div>
    </template>
  </main>
</template>
