<script setup lang="ts">
// Verve · SegmentedControl
// The active pill glides between segments via a shared-element layout
// animation (one `layoutId`, so motion morphs it from the old segment to the
// new one). Emits `update:modelValue`. Keyboard-navigable with arrow keys.
import { computed, ref, useId, watch } from 'vue'
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Segment labels. */
    options: string[]
    /** Selected label (v-model). */
    modelValue?: string
    stiffness?: number
    damping?: number
  }>(),
  { stiffness: 400, damping: 32 }
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const reduced = useReducedMotion()
const uid = useId()
const active = ref(props.modelValue ?? props.options[0])
watch(
  () => props.modelValue,
  (v) => v !== undefined && (active.value = v)
)

function select(opt: string) {
  active.value = opt
  emit('update:modelValue', opt)
}

function move(dir: number) {
  const i = props.options.indexOf(active.value)
  const next = props.options[(i + dir + props.options.length) % props.options.length]
  select(next)
}

const transition = computed(() =>
  reduced.value
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: props.stiffness, damping: props.damping }
)
</script>

<template>
  <div
    role="tablist"
    class="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/4 p-1"
    @keydown.left.prevent="move(-1)"
    @keydown.right.prevent="move(1)"
  >
    <button
      v-for="opt in options"
      :key="opt"
      type="button"
      role="tab"
      :aria-selected="active === opt"
      :tabindex="active === opt ? 0 : -1"
      @click="select(opt)"
      class="relative rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
      :class="
        active === opt ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
      "
    >
      <motion.span
        v-if="active === opt"
        :layout-id="`seg-${uid}`"
        :transition="transition"
        class="absolute inset-0 rounded-full bg-primary"
      />
      <span class="relative z-10">{{ opt }}</span>
    </button>
  </div>
</template>
