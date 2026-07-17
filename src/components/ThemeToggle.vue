<script setup lang="ts">
// Verve · ThemeToggle
// The knob slides between ends with a smooth layout spring while the sun/moon
// icons cross-fade via the transitions.dev icon-swap recipe (250ms ease-in-out,
// blurred scale). Emits `update:modelValue` so you can wire it to your own
// theme store; defaults to self-contained state.
import { computed, ref, watch } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Sun, Moon } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = defineProps<{ modelValue?: boolean; size?: 'sm' | 'md' }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const reduced = useReducedMotion()
const isDark = ref(props.modelValue ?? false)
watch(
  () => props.modelValue,
  (v) => v !== undefined && (isDark.value = v)
)

function toggle() {
  isDark.value = !isDark.value
  emit('update:modelValue', isDark.value)
}

// The knob position uses a smooth spring; the sun/moon swap uses the icon-swap tween.
const knob = computed(() =>
  reduced.value ? { duration: 0 } : { type: 'spring' as const, stiffness: 500, damping: 32 }
)
const iconSwap = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' as const }
)

// Size variants — `sm` matches a 32px icon-button row; `md` (default) is the standalone size.
const track = computed(() => (props.size === 'sm' ? 'h-8 w-14' : 'h-9 w-16'))
const knobSize = computed(() => (props.size === 'sm' ? 'size-6' : 'size-7'))
const iconSize = computed(() => (props.size === 'sm' ? 'size-3.5' : 'size-4'))
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isDark"
    aria-label="Toggle theme"
    @click="toggle"
    :class="[
      'relative flex items-center rounded-full border p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      track,
      isDark ? 'justify-end bg-input' : 'justify-start bg-secondary'
    ]"
  >
    <motion.span
      layout
      :transition="knob"
      :class="[
        'flex items-center justify-center rounded-full bg-background text-foreground shadow-sm',
        knobSize
      ]"
    >
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-if="isDark"
          key="moon"
          :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :transition="iconSwap"
        >
          <Moon :class="iconSize" />
        </motion.span>
        <motion.span
          v-else
          key="sun"
          :initial="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="{ opacity: 0, scale: 0.25, filter: 'blur(2px)' }"
          :transition="iconSwap"
        >
          <Sun :class="iconSize" />
        </motion.span>
      </AnimatePresence>
    </motion.span>
  </button>
</template>
