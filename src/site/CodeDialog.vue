<script setup lang="ts">
// Verve · CodeDialog
// Previews a component's source and shows the one-line CLI command to add it.
// Open/close animated with motion-v (scale-up in, softer out); backdrop click and
// Escape close it; body scroll is locked while open. Respects reduced motion.
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { X } from 'lucide-vue-next'
import CopyButton from './CopyButton.vue'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = defineProps<{
  open: boolean
  name: string
  slug: string
  source: string
}>()
const emit = defineEmits<{ close: [] }>()

const reduced = useReducedMotion()
const closeEl = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const command = computed(() => `npx @jettonn/verve@latest add ${props.slug}`)

const backdropT = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const }
)
const panelT = computed(() =>
  reduced.value ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 30 }
)
const panelInitial = computed(() =>
  reduced.value ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }
)
const panelExit = computed(() =>
  reduced.value ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }
)

function close() {
  emit('close')
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function teardown() {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
      nextTick(() => closeEl.value?.focus())
    } else {
      teardown()
      lastFocused?.focus?.()
    }
  }
)

onUnmounted(teardown)
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        key="backdrop"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="backdropT"
        @click="close"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          :aria-label="`${name} source`"
          @click.stop
          :initial="panelInitial"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="panelExit"
          :transition="panelT"
          class="flex h-[85vh] max-h-[720px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-2xl"
        >
          <!-- Header -->
          <div
            class="flex shrink-0 items-center justify-between gap-3 border-b border-foreground/10 px-5 py-3.5"
          >
            <div class="min-w-0">
              <h3 class="truncate text-sm font-semibold tracking-tight text-foreground">
                {{ name }}
              </h3>
              <p class="text-xs text-muted-foreground">Preview &amp; install</p>
            </div>
            <button
              ref="closeEl"
              type="button"
              @click="close"
              aria-label="Close"
              class="interactive flex size-8 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.03] text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X class="size-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex min-h-0 flex-1 flex-col gap-4 px-5 py-4">
            <!-- CLI command (pinned) -->
            <div class="shrink-0">
              <p
                class="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                Add with the CLI
              </p>
              <div
                class="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-2.5"
              >
                <code class="min-w-0 flex-1 break-all font-mono text-sm text-foreground">
                  <span class="select-none text-primary">$ </span>{{ command }}
                </code>
                <CopyButton :code="command" />
              </div>
            </div>

            <!-- Source (the only scroll area) -->
            <div class="flex min-h-0 flex-1 flex-col">
              <p
                class="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {{ name }}.vue
              </p>
              <div
                class="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02]"
              >
                <div class="absolute right-4 top-2.5 z-10 rounded-lg bg-card">
                  <CopyButton :code="source" />
                </div>
                <pre
                  class="scrollbar-subtle h-full overflow-auto py-4 pl-4 pr-14 font-mono text-xs leading-relaxed text-muted-foreground"
                ><code>{{ source }}</code></pre>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>
