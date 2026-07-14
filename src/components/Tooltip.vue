<script setup lang="ts">
// Verve · Tooltip
// A spring-scaled tooltip that grows out of the trigger it wraps. A short
// intent delay on hover keeps a passing cursor from triggering it, while focus
// and dismissal are instant — a close should never wait. Falls back to a quick
// fade under reduced motion.
import { computed, onUnmounted, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Tooltip text (or use the `content` slot for markup). */
    content?: string
    /** Which side of the trigger to appear on. */
    side?: 'top' | 'bottom'
    /** Intent delay (ms) before a hover opens it — filters passing cursors. */
    openDelay?: number
    stiffness?: number
    damping?: number
  }>(),
  { side: 'top', openDelay: 80, stiffness: 500, damping: 30 }
)

const reduced = useReducedMotion()
const open = ref(false)
const offset = computed(() => (props.side === 'top' ? 4 : -4))

// Hover waits out the intent delay; focus and any close are instant.
let timer: ReturnType<typeof setTimeout> | undefined
function openAfterDelay() {
  timer = setTimeout(() => (open.value = true), props.openDelay)
}
function show() {
  clearTimeout(timer)
  open.value = true
}
function hide() {
  clearTimeout(timer)
  open.value = false
}
onUnmounted(() => clearTimeout(timer))

const transition = computed(() =>
  reduced.value
    ? { duration: 0.12 }
    : { type: 'spring' as const, stiffness: props.stiffness, damping: props.damping }
)
</script>

<template>
  <span
    class="relative inline-flex"
    @mouseenter="openAfterDelay"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <AnimatePresence>
      <motion.span
        v-if="open"
        key="tip"
        role="tooltip"
        :initial="{ opacity: 0, scale: 0.94, y: offset }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :exit="{ opacity: 0, scale: 0.94, y: offset }"
        :transition="transition"
        :class="[
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md',
          side === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
        ]"
      >
        <slot name="content">{{ content }}</slot>
      </motion.span>
    </AnimatePresence>
  </span>
</template>
