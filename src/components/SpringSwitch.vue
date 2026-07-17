<script setup lang="ts">
// Verve · SpringSwitch
// A toggle whose thumb springs across the track with a touch of overshoot —
// the low damping is what gives it that satisfying, slightly bouncy settle.
// Emits `update:modelValue`; falls back to an instant slide for reduced motion.
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** On/off state (v-model). */
    modelValue?: boolean
    label?: string
    /** Spring tension. */
    stiffness?: number
    /** Spring friction — lower means more overshoot. */
    damping?: number
  }>(),
  { stiffness: 600, damping: 26 }
)
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const reduced = useReducedMotion()
const on = ref(props.modelValue ?? false)
watch(
  () => props.modelValue,
  (v) => v !== undefined && (on.value = v)
)

function toggle() {
  on.value = !on.value
  emit('update:modelValue', on.value)
}

const transition = computed(() =>
  reduced.value
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: props.stiffness, damping: props.damping }
)
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="on"
    :aria-label="label ?? 'Toggle'"
    @click="toggle"
    :class="[
      'relative inline-flex h-7 w-12 items-center justify-start rounded-full border border-foreground/10 p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      on ? 'bg-primary' : 'bg-foreground/10'
    ]"
  >
    <!-- The thumb springs 18px across the track; low damping gives the overshoot. -->
    <motion.span
      :animate="{ x: on ? 18 : 0 }"
      :transition="transition"
      class="size-5 rounded-full bg-white shadow-sm"
    />
  </button>
</template>
