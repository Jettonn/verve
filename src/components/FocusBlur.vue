<script setup lang="ts">
// Verve · FocusBlur
// A row of links where hovering one blurs and dims the rest, pulling focus to
// the link under the cursor — which lifts to the accent color. An optional
// dashed bracket springs in around the focused link. Keyboard focus drives the
// same state as hover. Reduced motion keeps the focus pull but drops the blur
// and makes every change instant.
import { computed, ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

interface FocusBlurItem {
  /** Visible text. */
  label: string
  /** Link target. */
  href?: string
}

const props = withDefaults(
  defineProps<{
    /** The links to render. */
    items?: FocusBlurItem[]
    /** Blur radius (px) applied to the un-focused links. */
    blurAmount?: number
    /** Opacity of the un-focused links, 0–1. */
    opacityAmount?: number
    /** Draw the dashed bracket around the focused link. */
    showBrackets?: boolean
  }>(),
  {
    items: () => [
      { label: '@Twitter', href: '#' },
      { label: '@Threads', href: '#' },
      { label: '@Instagram', href: '#' },
      { label: '@GitHub', href: '#' }
    ],
    blurAmount: 4,
    opacityAmount: 0.4,
    showBrackets: true
  }
)

const reduced = useReducedMotion()
const active = ref<number | null>(null)

// Every link but the active one dims; the blur is decorative, so reduced motion
// skips it and keeps only the opacity cue.
function linkStyle(i: number) {
  const inactive = active.value !== null && active.value !== i
  return {
    filter: inactive && !reduced.value ? `blur(${props.blurAmount}px)` : 'none',
    opacity: inactive ? props.opacityAmount : 1
  }
}

// Faithful to the original bracket spring; instant when a visitor asks for less.
const bracketTransition = computed(() =>
  reduced.value ? { duration: 0 } : { type: 'spring' as const, stiffness: 350, damping: 20 }
)
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-6 px-10 py-6">
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="item.href ?? '#'"
      @mouseenter="active = i"
      @mouseleave="active = null"
      @focusin="active = i"
      @focusout="active = null"
      :style="linkStyle(i)"
      :class="[
        'relative text-base font-semibold no-underline outline-none select-none transition-[filter,opacity,color] ease-out sm:text-lg',
        reduced ? 'duration-0' : 'duration-300',
        active === i ? 'text-primary' : 'text-foreground'
      ]"
    >
      <span class="relative z-10">{{ item.label }}</span>

      <AnimatePresence v-if="showBrackets">
        <motion.span
          v-if="active === i"
          key="bracket"
          aria-hidden="true"
          :initial="{ opacity: 0, scale: 1.3 }"
          :animate="{ opacity: 1, scale: 1.1 }"
          :exit="{ opacity: 0, scale: 1.3 }"
          :transition="bracketTransition"
          class="pointer-events-none absolute -inset-x-2 -inset-y-1 z-0 rounded-lg border-2 border-dashed border-primary/50"
        />
      </AnimatePresence>
    </a>
  </div>
</template>
