<script setup lang="ts">
// Verve · FilterChips
// A row of toggle chips. Clicking one flips its .on state — the chip fills with
// the accent color and its text flips to the dark background color — and gives
// it a brief back-eased pop (scale 1.12, the overshoot doing the pop). Many
// chips can be on at once; the value is the array of selected options. Reduced
// motion drops the pop.
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Selectable labels. */
    options: string[]
    /** The selected labels (v-model). */
    modelValue?: string[]
  }>(),
  { modelValue: () => [] }
)
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const reduced = useReducedMotion()

const selected = ref<string[]>([...props.modelValue])
watch(
  () => props.modelValue,
  (v) => (selected.value = [...v])
)

const isOn = (opt: string) => selected.value.includes(opt)

// One pop per chip: scale to 1.12, then settle home after a beat. Both legs ride
// the back-eased curve whose overshoot reads as the pop.
const scales = ref<Record<string, number>>({})
const timers: Record<string, ReturnType<typeof setTimeout>> = {}
function pop(opt: string) {
  if (reduced.value) return
  scales.value[opt] = 1.12
  clearTimeout(timers[opt])
  timers[opt] = setTimeout(() => (scales.value[opt] = 1), 150)
}

function toggle(opt: string) {
  selected.value = isOn(opt) ? selected.value.filter((o) => o !== opt) : [...selected.value, opt]
  emit('update:modelValue', selected.value)
  pop(opt)
}

const transition = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.28, ease: [0.34, 1.56, 0.64, 1] as const }
)
</script>

<template>
  <div role="group" class="flex flex-wrap items-center gap-2">
    <motion.button
      v-for="opt in options"
      :key="opt"
      type="button"
      :aria-pressed="isOn(opt)"
      :animate="{ scale: scales[opt] ?? 1 }"
      :transition="transition"
      @click="toggle(opt)"
      :class="[
        'inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] font-medium tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        isOn(opt)
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-foreground/12 bg-foreground/4 text-foreground hover:bg-foreground/7'
      ]"
    >
      {{ opt }}
    </motion.button>
  </div>
</template>
