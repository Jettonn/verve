<script setup lang="ts">
// Verve · ForwardButton
// Slide-arrow interaction: on hover the leading icon slides out to the left as
// a trailing arrow slides in from the right, and the label re-centers between
// them (popLayout). A faithful port of the Amicro slide-arrow button.
//
// Reusable:
//   <ForwardButton label="Reply" />                      · just change the text
//   <ForwardButton><template #leading><Send /></template> · swap either icon
//   <ForwardButton :stiffness="500" :damping="30" />      · retune the spring
import { computed, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Mail, ArrowRight } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Text shown between the two icons. */
    label?: string
    /** Spring tension for the icon slide. */
    stiffness?: number
    /** Spring friction for the icon slide. */
    damping?: number
  }>(),
  { label: 'Forward email', stiffness: 450, damping: 26 }
)

const reduced = useReducedMotion()
const hovered = ref(false)

// Instant swap when the visitor asks for reduced motion; a spring otherwise.
const transition = computed(() =>
  reduced.value
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: props.stiffness, damping: props.damping }
)
const whileHover = computed(() => (reduced.value ? undefined : { scale: 1.02 }))
const whilePress = computed(() => (reduced.value ? undefined : { scale: 0.96 }))
</script>

<template>
  <motion.button
    type="button"
    :while-hover="whileHover"
    :while-press="whilePress"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    class="relative flex h-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 text-[13px] font-medium tracking-tight text-foreground transition-colors duration-150 hover:bg-foreground/[0.07] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <AnimatePresence mode="popLayout">
      <motion.div
        v-if="!hovered"
        key="leading"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :exit="{ opacity: 0, x: -10 }"
        :transition="transition"
        class="mr-2.5 flex shrink-0 items-center"
      >
        <slot name="leading"><Mail class="size-4" /></slot>
      </motion.div>
    </AnimatePresence>

    <span>{{ label }}</span>

    <AnimatePresence mode="popLayout">
      <motion.div
        v-if="hovered"
        key="trailing"
        :initial="{ opacity: 0, x: 10 }"
        :animate="{ opacity: 1, x: 0 }"
        :exit="{ opacity: 0, x: 10 }"
        :transition="transition"
        class="ml-2.5 flex shrink-0 items-center"
      >
        <slot name="trailing"><ArrowRight class="size-4" /></slot>
      </motion.div>
    </AnimatePresence>
  </motion.button>
</template>
