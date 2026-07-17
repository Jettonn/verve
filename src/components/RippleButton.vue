<script setup lang="ts">
// Verve · RippleButton
// A material-style ripple that starts at the exact click point. Each press
// spawns an absolutely-positioned accent-green circle at the pointer coords
// inside the overflow-hidden ghost button; it scales from 0 to 2.6 while fading
// out over 0.6s, then removes itself. Reduced motion skips the ripple entirely.
import { onUnmounted, ref } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Ripple lifetime in seconds. */
    duration?: number
  }>(),
  { duration: 0.6 }
)

const reduced = useReducedMotion()

type Ripple = { id: number; x: number; y: number; size: number }
let seq = 0
const ripples = ref<Ripple[]>([])
const timers: ReturnType<typeof setTimeout>[] = []

// pointerdown (not click) so the ripple leads the press, and works for touch.
function spawn(e: PointerEvent) {
  if (reduced.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  // Cover the whole button from any origin: diameter = its longest side, so a
  // corner click still floods across at scale 2.6.
  const size = Math.max(rect.width, rect.height)
  const id = seq++
  ripples.value.push({ id, x: e.clientX - rect.left, y: e.clientY - rect.top, size })
  timers.push(
    setTimeout(() => {
      ripples.value = ripples.value.filter((r) => r.id !== id)
    }, props.duration * 1000)
  )
}

onUnmounted(() => timers.forEach(clearTimeout))
</script>

<template>
  <button
    type="button"
    @pointerdown="spawn"
    class="interactive relative isolate inline-flex h-9 items-center justify-center overflow-hidden rounded-full border border-foreground/10 bg-foreground/[0.04] px-6 text-[13px] font-medium tracking-tight text-foreground outline-none transition-colors hover:bg-foreground/[0.07] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <span class="relative z-10"><slot>Click me</slot></span>

    <motion.span
      v-for="r in ripples"
      :key="r.id"
      :initial="{ scale: 0, opacity: 0.4 }"
      :animate="{ scale: 2.6, opacity: 0 }"
      :transition="{ duration, ease: 'easeOut' }"
      aria-hidden="true"
      class="pointer-events-none absolute -z-0 rounded-full bg-primary"
      :style="{
        left: `${r.x - r.size / 2}px`,
        top: `${r.y - r.size / 2}px`,
        width: `${r.size}px`,
        height: `${r.size}px`
      }"
    />
  </button>
</template>
