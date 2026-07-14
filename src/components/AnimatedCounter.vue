<script setup lang="ts">
// Verve · AnimatedCounter
// Spring-interpolates to the target value. Change `value` and the number
// eases across with weight instead of snapping.
import { onUnmounted, ref, watch } from 'vue'
import { useSpring } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    value: number
    /** Decimal places to render. */
    decimals?: number
    stiffness?: number
    damping?: number
  }>(),
  { decimals: 0, stiffness: 120, damping: 20 }
)

const reduced = useReducedMotion()
const spring = useSpring(props.value, { stiffness: props.stiffness, damping: props.damping })
const text = ref('')

const format = (v: number) =>
  v.toLocaleString('en-US', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  })

text.value = format(props.value)
const stop = spring.on('change', (v: number) => (text.value = format(v)))

watch(
  () => props.value,
  (v) => (reduced.value ? spring.jump(v) : spring.set(v))
)

onUnmounted(() => stop())
</script>

<template>
  <span class="tabular-nums">{{ text }}</span>
</template>
