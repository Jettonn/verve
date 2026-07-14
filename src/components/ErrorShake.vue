<script setup lang="ts">
// Verve · ErrorShake
// Call `shake()` (or toggle the `error` prop) to play a short, weighted
// horizontal shake — the classic "wrong password" nudge.
import { ref, watch } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = defineProps<{ error?: boolean }>()
const reduced = useReducedMotion()
const controls = ref(0)

function shake() {
  if (reduced.value) return
  controls.value++
}

watch(
  () => props.error,
  (v) => v && shake()
)

defineExpose({ shake })
</script>

<template>
  <motion.div
    :animate="controls > 0 ? { x: [0, -8, 8, -6, 6, -3, 0] } : {}"
    :transition="{ duration: 0.45, ease: 'easeInOut' }"
    :key="controls"
  >
    <slot />
  </motion.div>
</template>
