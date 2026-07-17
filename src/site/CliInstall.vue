<script setup lang="ts">
// Verve · CLI install panel
// Builds the `verve` add command for any component (or all at once) across
// package managers, with a copy button. Purely informational — no network calls.
import { computed, ref } from 'vue'
import CopyButton from './CopyButton.vue'
import { CATALOG } from '../catalog'

const props = withDefaults(defineProps<{ initialSlug?: string }>(), { initialSlug: '' })

const managers = [
  { id: 'npm', exec: 'npx' },
  { id: 'pnpm', exec: 'pnpm dlx' },
  { id: 'yarn', exec: 'yarn dlx' },
  { id: 'bun', exec: 'bunx' }
] as const
type Manager = (typeof managers)[number]['id']

const ALL = '--all'

// Driven off the catalog so the picker never drifts from the shipped components.
const components = [
  { name: 'All components', slug: ALL },
  ...CATALOG.map((c) => ({ name: c.name, slug: c.slug }))
]

const pm = ref<Manager>('npm')
const slug = ref(props.initialSlug || 'forward-button')

const exec = computed(() => managers.find((m) => m.id === pm.value)!.exec)
const addCmd = computed(() => `${exec.value} @jettonn/verve@latest add ${slug.value}`)
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <!-- Package-manager tabs + component picker -->
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex gap-1.5">
        <button
          v-for="m in managers"
          :key="m.id"
          type="button"
          @click="pm = m.id"
          :class="[
            'rounded-full px-3 py-1 text-xs font-medium tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            pm === m.id
              ? 'bg-foreground text-background'
              : 'border border-foreground/10 bg-foreground/[0.03] text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ m.id }}
        </button>
      </div>
      <label class="flex items-center gap-2 text-xs text-muted-foreground">
        Component
        <select
          v-model="slug"
          class="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option v-for="c in components" :key="c.slug" :value="c.slug">{{ c.name }}</option>
        </select>
      </label>
    </div>

    <!-- The command -->
    <div
      class="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3"
    >
      <code class="min-w-0 flex-1 break-all font-mono text-sm leading-relaxed text-foreground">
        <span class="select-none text-primary">$ </span>{{ addCmd }}
      </code>
      <CopyButton :code="addCmd" />
    </div>

    <!-- What it does -->
    <p class="mt-3 text-center text-xs text-muted-foreground">
      Copies the source into
      <code class="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-foreground"
        >src/components/ui/</code
      >
      and installs its deps — no config, no runtime package.
    </p>
  </div>
</template>
