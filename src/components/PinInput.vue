<script setup lang="ts">
// Verve · PinInput
// A one-time-code field of single-character boxes. Typing a digit fills its box
// (accent border), gives it a brief back-eased pop, and advances focus; the pop
// lives on a wrapper so the input never loses focus mid-scale. Backspace in an
// empty box steps focus back. The active box keeps its focus ring. Reduced
// motion drops the pop.
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** The code (v-model). */
    modelValue?: string
    /** Number of boxes. */
    length?: number
  }>(),
  { modelValue: '', length: 4 }
)
const emit = defineEmits<{
  'update:modelValue': [string]
  /** Fires once every box holds a digit. */
  complete: [string]
}>()

const reduced = useReducedMotion()

const digits = ref<string[]>(seed(props.modelValue))
const scales = ref<number[]>(Array(props.length).fill(1))
const inputs = ref<HTMLInputElement[]>([])
const timers: ReturnType<typeof setTimeout>[] = []

function seed(v: string) {
  return Array.from({ length: props.length }, (_, i) => v[i] ?? '')
}

// Reseed if the parent sets the code externally.
watch(
  () => props.modelValue,
  (v) => {
    if (v !== digits.value.join('')) digits.value = seed(v)
  }
)

function focusAt(i: number) {
  const el = inputs.value[i]
  if (el) {
    el.focus()
    el.select()
  }
}

// One box scales to 1.14 on the back-eased curve, then settles home — the
// overshoot in that curve is what makes it feel like a pop.
function pop(i: number) {
  if (reduced.value) return
  scales.value[i] = 1.14
  clearTimeout(timers[i])
  timers[i] = setTimeout(() => (scales.value[i] = 1), 130)
}

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const ch = el.value.replace(/\D/g, '').slice(-1) // keep only the last digit typed
  el.value = ch
  digits.value[i] = ch
  emit('update:modelValue', digits.value.join(''))
  if (ch) {
    pop(i)
    focusAt(i + 1)
    if (digits.value.every(Boolean)) emit('complete', digits.value.join(''))
  }
}

// Native backspace clears a filled box; on an already-empty box we step back.
function onBackspace(i: number) {
  if (!digits.value[i]) focusAt(i - 1)
}

const transition = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.18, ease: [0.34, 1.56, 0.64, 1] as const }
)
</script>

<template>
  <div class="flex items-center gap-2.5">
    <motion.div
      v-for="(_, i) in digits"
      :key="i"
      :animate="{ scale: scales[i] }"
      :transition="transition"
      class="inline-flex"
    >
      <input
        :ref="
          (el) => {
            if (el) inputs[i] = el as HTMLInputElement
          }
        "
        :value="digits[i]"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        :aria-label="`Digit ${i + 1}`"
        @input="onInput(i, $event)"
        @keydown.delete="onBackspace(i)"
        @focus="($event.target as HTMLInputElement).select()"
        :class="[
          'size-12 rounded-lg border bg-foreground/3 text-center text-lg font-semibold text-foreground caret-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          digits[i] ? 'border-primary' : 'border-foreground/12'
        ]"
      />
    </motion.div>
  </div>
</template>
