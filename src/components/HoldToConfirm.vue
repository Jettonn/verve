<script setup lang="ts">
// Verve · HoldToConfirm
// A circular hold-to-delete button ringed by an SVG progress arc. On pointerdown
// the ring's stroke-dashoffset animates from full to 0 over `duration` (linear);
// hold the whole time and it fires `confirm` and flashes a green success state.
// Release early and the hold cancels — the ring snaps back on a quick ease.
// Pointer capture keeps the gesture alive if the finger drifts off the button.
import { computed, onUnmounted, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Trash2, Check } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** How long the ring takes to fill, in ms. */
    duration?: number
    label?: string
  }>(),
  { duration: 800, label: 'Hold to delete' }
)
const emit = defineEmits<{ confirm: [] }>()

const reduced = useReducedMotion()

const R = 32
const C = 2 * Math.PI * R

type Phase = 'idle' | 'holding' | 'success'
const phase = ref<Phase>('idle')
const offset = ref(C) // full = empty ring; 0 = complete
let holdTimer: ReturnType<typeof setTimeout>
let resetTimer: ReturnType<typeof setTimeout>

function onDown(e: PointerEvent) {
  if (phase.value === 'success') return
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  phase.value = 'holding'
  offset.value = 0 // the holding transition draws it over `duration`
  holdTimer = setTimeout(finish, props.duration)
}

// Held the whole way: fire once, flash success, then settle back to idle.
function finish() {
  phase.value = 'success'
  emit('confirm')
  resetTimer = setTimeout(() => {
    phase.value = 'idle'
    offset.value = C
  }, 1100)
}

// Released before the ring filled: kill the timer and snap the arc back.
function cancel() {
  if (phase.value !== 'holding') return
  clearTimeout(holdTimer)
  phase.value = 'idle'
  offset.value = C
}

onUnmounted(() => {
  clearTimeout(holdTimer)
  clearTimeout(resetTimer)
})

// Linear while filling; a quick ease for the snap-back and the success drain.
const ringStyle = computed(() => ({
  strokeDashoffset: offset.value,
  transition:
    phase.value === 'holding'
      ? `stroke-dashoffset ${props.duration}ms linear`
      : 'stroke-dashoffset 220ms ease-out'
}))

const iconTransition = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as const }
)

const ariaLabel = computed(() =>
  phase.value === 'success' ? 'Deleted' : phase.value === 'holding' ? 'Deleting…' : props.label
)
</script>

<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    @pointerdown="onDown"
    @pointerup="cancel"
    @pointercancel="cancel"
    @contextmenu.prevent
    class="relative flex size-12 touch-none items-center justify-center rounded-full border border-foreground/10 bg-card text-foreground select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <!-- Progress ring: a static track plus the arc that fills on hold. -->
    <svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
      <circle
        class="stroke-current text-foreground/12"
        cx="36"
        cy="36"
        :r="R"
        fill="none"
        stroke-width="5"
      />
      <circle
        class="stroke-current transition-colors"
        :class="phase === 'success' ? 'text-primary' : 'text-destructive'"
        cx="36"
        cy="36"
        :r="R"
        fill="none"
        stroke-width="5"
        stroke-linecap="round"
        :stroke-dasharray="C"
        :style="ringStyle"
      />
    </svg>

    <!-- Center icon: trash normally, a check on success — cross-fade with a pop. -->
    <span class="relative flex size-5 items-center justify-center">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          :key="phase === 'success' ? 'done' : 'trash'"
          :initial="{ opacity: 0, scale: 0.4 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.4 }"
          :transition="iconTransition"
          class="absolute inset-0 flex items-center justify-center"
          :class="phase === 'success' ? 'text-primary' : 'text-destructive'"
        >
          <component :is="phase === 'success' ? Check : Trash2" class="size-4" />
        </motion.span>
      </AnimatePresence>
    </span>
  </button>
</template>
