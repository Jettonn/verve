<script setup lang="ts">
import { computed, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Check, Copy } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = defineProps<{ code: string }>()
const copied = ref(false)
const reduced = useReducedMotion()

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    /* clipboard blocked — swallow and still flash the check */
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1400)
}

// Copy ↔ check icon swap — transitions.dev recipe (250ms ease-in-out, blurred scale).
const iconSwap = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' as const }
)
</script>

<template>
  <button
    type="button"
    @click="copy"
    :aria-label="copied ? 'Copied' : 'Copy source'"
    class="interactive relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.03] text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <AnimatePresence mode="popLayout" :initial="false">
      <motion.span
        v-if="copied"
        key="ok"
        :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
        :transition="iconSwap"
        class="absolute inset-0 flex items-center justify-center"
      >
        <Check class="size-4 text-primary" />
      </motion.span>
      <motion.span
        v-else
        key="copy"
        :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
        :transition="iconSwap"
        class="absolute inset-0 flex items-center justify-center"
      >
        <Copy class="size-4" />
      </motion.span>
    </AnimatePresence>
  </button>
</template>
