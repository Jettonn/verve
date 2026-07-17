<script setup lang="ts">
// Verve · VolumeButton
// Icon swap: two icons share one slot and cross-fade with a blurred scale, per
// the transitions.dev icon-swap recipe (250ms ease-in-out). Click to mute /
// unmute; hover gives a subtle lift. Emits `update:modelValue`.
import { computed, ref, watch } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Volume2, VolumeX } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Muted state (v-model). */
    modelValue?: boolean
    label?: string
    /** Icon-swap duration in seconds. */
    duration?: number
  }>(),
  { label: 'Volume', duration: 0.25 }
)
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const reduced = useReducedMotion()
const muted = ref(props.modelValue ?? false)
watch(
  () => props.modelValue,
  (v) => v !== undefined && (muted.value = v)
)

function toggle() {
  muted.value = !muted.value
  emit('update:modelValue', muted.value)
}

const transition = computed(() =>
  reduced.value ? { duration: 0 } : { duration: props.duration, ease: 'easeInOut' as const }
)
const whileHover = computed(() => (reduced.value ? undefined : { scale: 1.02 }))
const whilePress = computed(() => (reduced.value ? undefined : { scale: 0.96 }))
</script>

<template>
  <motion.button
    type="button"
    :aria-pressed="muted"
    :aria-label="muted ? 'Unmute' : 'Mute'"
    :while-hover="whileHover"
    :while-press="whilePress"
    @click="toggle"
    class="relative flex h-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/4 px-6 text-[13px] font-medium tracking-tight text-foreground transition-colors hover:bg-foreground/7 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <span class="relative flex size-4 shrink-0 items-center justify-center">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-if="!muted"
          key="on"
          :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :transition="transition"
          class="absolute inset-0 flex items-center justify-center"
        >
          <Volume2 class="size-4" />
        </motion.span>
        <motion.span
          v-else
          key="off"
          :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :transition="transition"
          class="absolute inset-0 flex items-center justify-center text-muted-foreground"
        >
          <VolumeX class="size-4" />
        </motion.span>
      </AnimatePresence>
    </span>
    <span class="ml-2.5">{{ label }}</span>
  </motion.button>
</template>
