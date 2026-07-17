<script setup lang="ts">
// Verve · TagInput
// A tag/token field. Enter commits the typed value as a pill that springs in
// from scale(0.4) with a back-eased pop — the >1 control point is what makes it
// overshoot before it settles. Each pill's × removes it with a quick scale-down
// fade; Backspace in the empty field pops the last one. The pills and input
// share one bordered container that lifts on focus-within. Reduced motion swaps
// every animation for an instant change.
import { computed, ref, watch } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { X } from 'lucide-vue-next'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** The tags (v-model). */
    modelValue?: string[]
    placeholder?: string
    /** Enter-pop duration in seconds. */
    duration?: number
  }>(),
  { placeholder: 'Add a tag…', duration: 0.26 }
)
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const reduced = useReducedMotion()

// Pills carry a stable id so AnimatePresence can track exits across reorders —
// two tags with the same text still animate independently.
let seq = 0
type Tag = { id: number; label: string }
const tags = ref<Tag[]>((props.modelValue ?? []).map((label) => ({ id: seq++, label })))
const draft = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const labels = computed(() => tags.value.map((t) => t.label))

// Reconcile when the parent replaces the list, reusing ids for labels we still
// hold so unchanged pills don't re-pop.
watch(
  () => props.modelValue,
  (next) => {
    if (!next || sameLabels(next, labels.value)) return
    const pool = new Map(tags.value.map((t) => [t.label, t.id]))
    tags.value = next.map((label) => ({ id: pool.get(label) ?? seq++, label }))
  }
)

function sameLabels(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function commit() {
  const label = draft.value.trim()
  draft.value = ''
  if (!label || labels.value.includes(label)) return
  tags.value = [...tags.value, { id: seq++, label }]
  emit('update:modelValue', labels.value)
}

function removeId(id: number) {
  tags.value = tags.value.filter((t) => t.id !== id)
  emit('update:modelValue', labels.value)
}

// Backspace on an empty field pops the last pill instead of doing nothing.
function onBackspace() {
  if (draft.value || !tags.value.length) return
  removeId(tags.value[tags.value.length - 1].id)
}

const enter = computed(() =>
  reduced.value
    ? { duration: 0 }
    : { duration: props.duration, ease: [0.34, 1.56, 0.64, 1] as const }
)
const exit = computed(() =>
  reduced.value ? { duration: 0 } : { duration: 0.12, ease: 'easeOut' as const }
)
</script>

<template>
  <!-- Clicking anywhere in the container focuses the input; the whole thing
       lifts on focus-within. -->
  <div
    @click="inputEl?.focus()"
    class="flex w-full max-w-xs cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-foreground/12 bg-foreground/[0.03] px-2 py-2 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
  >
    <AnimatePresence>
      <motion.span
        v-for="tag in tags"
        :key="tag.id"
        :initial="{ scale: 0.4, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :exit="{ scale: 0.7, opacity: 0, transition: exit }"
        :transition="enter"
        layout
        class="inline-flex items-center gap-1 rounded-md bg-primary/12 py-1 pl-2 pr-1 text-xs font-medium text-foreground"
      >
        {{ tag.label }}
        <button
          type="button"
          @click.stop="removeId(tag.id)"
          :aria-label="`Remove ${tag.label}`"
          class="flex size-4 items-center justify-center rounded text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X class="size-3" />
        </button>
      </motion.span>
    </AnimatePresence>

    <input
      ref="inputEl"
      v-model="draft"
      type="text"
      :placeholder="tags.length ? '' : placeholder"
      @keydown.enter.prevent="commit"
      @keydown.delete="onBackspace"
      class="min-w-[6ch] flex-1 bg-transparent px-1 py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
  </div>
</template>
