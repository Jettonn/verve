<script setup lang="ts">
// Verve · MagneticButton
// Springs toward the cursor while hovered, then snaps back on leave.
import { motion, useMotionValue, useSpring } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** How far it follows the cursor, 0–1. */
    strength?: number
    /** Spring tension. */
    stiffness?: number
    /** Spring friction. */
    damping?: number
  }>(),
  { strength: 0.4, stiffness: 260, damping: 18 }
)

const reduced = useReducedMotion()
const x = useMotionValue(0)
const y = useMotionValue(0)
const springX = useSpring(x, { stiffness: props.stiffness, damping: props.damping })
const springY = useSpring(y, { stiffness: props.stiffness, damping: props.damping })

function onMove(e: MouseEvent) {
  if (reduced.value) return
  // `currentTarget` is the <button> the listener is bound to — a template ref on
  // <motion.button> resolves to the motion-v component instance, not the DOM node.
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  x.set((e.clientX - (rect.left + rect.width / 2)) * props.strength)
  y.set((e.clientY - (rect.top + rect.height / 2)) * props.strength)
}

function reset() {
  x.set(0)
  y.set(0)
}
</script>

<template>
  <motion.button
    :style="{ x: springX, y: springY }"
    :while-press="{ scale: 0.94 }"
    @mousemove="onMove"
    @mouseleave="reset"
    class="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <slot>Magnetic</slot>
  </motion.button>
</template>
