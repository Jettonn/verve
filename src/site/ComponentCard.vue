<script setup lang="ts">
import { computed, ref } from 'vue'
import { Code } from 'lucide-vue-next'
import CodeDialog from './CodeDialog.vue'

const props = defineProps<{
  name: string
  /** Short interaction label, e.g. "Slide-arrow interaction". */
  interaction: string
  source: string
}>()

const open = ref(false)
// PascalCase → kebab-case, matching the registry slugs (ForwardButton → forward-button).
const slug = computed(() => props.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
</script>

<template>
  <section
    class="group flex flex-col rounded-2xl border border-foreground/10 bg-card/60 transition-colors duration-200 hover:border-foreground/20"
  >
    <div
      class="dot-grid relative flex min-h-45 flex-1 items-center justify-center rounded-t-2xl p-8"
    >
      <slot />
    </div>
    <div class="flex items-center justify-between gap-3 border-t border-foreground/10 px-4 py-3">
      <div class="min-w-0">
        <h3 class="truncate text-sm font-medium tracking-tight text-foreground">
          <RouterLink :to="`/components/${slug}`" class="transition-colors hover:text-primary">
            {{ name }}
          </RouterLink>
        </h3>
        <p class="truncate text-xs text-muted-foreground">{{ interaction }}</p>
      </div>
      <button
        type="button"
        @click="open = true"
        class="interactive inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/3 px-2.5 text-xs font-medium text-muted-foreground hover:bg-foreground/6 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Code class="size-3.5" />
        Code
      </button>
    </div>

    <CodeDialog :open="open" :name="name" :slug="slug" :source="source" @close="open = false" />
  </section>
</template>
