<script setup lang="ts">
// Verve · QuantityStepper
// − and + buttons flanking a number. Each change clamps to [min, max], emits
// `update:modelValue`, and briefly pops the digit — scale springs to 1.3 and
// settles on the back-eased curve, the overshoot doing the "pop". The pressed
// button dips to scale(0.9) via a quick CSS :active. tabular-nums keeps the
// glyphs a fixed width so the number never shifts as it changes. Reduced motion
// drops the pop.
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'
import { Minus, Plus } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** The quantity (v-model). */
    modelValue?: number
    /** Lower bound the value clamps to. */
    min?: number
    /** Optional upper bound; omit for no ceiling. */
    max?: number
    /** Amount added or removed per press. */
    step?: number
    label?: string
  }>(),
  { modelValue: 1, min: 1, step: 1, label: 'Quantity' }
)
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const reduced = useReducedMotion()

const clamp = (v: number) =>
  Math.max(props.min, props.max !== undefined ? Math.min(props.max, v) : v)

const value = ref(clamp(props.modelValue))
watch(
  () => props.modelValue,
  (v) => (value.value = clamp(v))
)

const atMin = computed(() => value.value <= props.min)
const atMax = computed(() => props.max !== undefined && value.value >= props.max)

// The pop lives on a scale ref: jump to 1.3, then settle back to 1 after a beat.
// Both legs ride the back-eased curve, whose overshoot is what reads as a pop.
const scale = ref(1)
let timer: ReturnType<typeof setTimeout>
function pop() {
  if (reduced.value) return
  scale.value = 1.3
  clearTimeout(timer)
  timer = setTimeout(() => (scale.value = 1), 150)
}

function nudge(delta: number) {
  const next = clamp(value.value + delta * props.step)
  if (next === value.value) return
  value.value = next
  emit('update:modelValue', next)
  pop()
}

const transition = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.28, ease: [0.34, 1.56, 0.64, 1] as const }
)
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    class="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/4 p-1"
  >
    <button
      type="button"
      :disabled="atMin"
      aria-label="Decrease"
      @click="nudge(-1)"
      class="flex size-9 items-center justify-center rounded-full text-foreground transition-[transform,background-color] duration-100 ease-out hover:bg-foreground/7 active:scale-90 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Minus class="size-4" />
    </button>

    <motion.span
      :animate="{ scale }"
      :transition="transition"
      aria-live="polite"
      class="min-w-[2.5ch] text-center text-[15px] font-semibold tabular-nums text-foreground"
    >
      {{ value }}
    </motion.span>

    <button
      type="button"
      :disabled="atMax"
      aria-label="Increase"
      @click="nudge(1)"
      class="flex size-9 items-center justify-center rounded-full text-foreground transition-[transform,background-color] duration-100 ease-out hover:bg-foreground/7 active:scale-90 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Plus class="size-4" />
    </button>
  </div>
</template>
