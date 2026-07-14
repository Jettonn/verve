<script setup lang="ts">
// Verve · Accordion
// Panels expand from 0 to their measured content height on a smooth ease-out,
// while the chevron rotates 180° with a springy overshoot. The motion is all
// Tailwind utilities toggled by state — JS only measures each panel's content
// height (fed in as the `--h` custom property) so max-height animates honestly.
import { nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface AccordionItem {
  title: string
  content: string
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[]
    /** Allow more than one panel open at a time. */
    multiple?: boolean
    /** Index to open on mount (-1 for none). */
    defaultOpen?: number
  }>(),
  { multiple: false, defaultOpen: -1 }
)

const uid = useId()
const opened = ref<Set<number>>(new Set(props.defaultOpen >= 0 ? [props.defaultOpen] : []))
const isOpen = (i: number) => opened.value.has(i)

function toggle(i: number) {
  measure()
  const next = new Set(props.multiple ? opened.value : [])
  if (opened.value.has(i)) next.delete(i)
  else next.add(i)
  opened.value = next
}

// Measure each panel's content so max-height animates to the real height.
const rootEl = ref<HTMLElement | null>(null)
const heights = ref<number[]>([])
const ready = ref(false)

function measure() {
  const inners = rootEl.value?.querySelectorAll<HTMLElement>('[data-accordion-inner]')
  if (inners) heights.value = Array.from(inners, (el) => el.scrollHeight)
}

onMounted(() => {
  measure()
  // Arm transitions a couple of frames in, so a default-open panel shows at full
  // height on load instead of animating open.
  requestAnimationFrame(() => requestAnimationFrame(() => (ready.value = true)))
  window.addEventListener('resize', measure)
  // Re-measure once webfonts settle so heights match the final metrics.
  document.fonts?.ready.then(measure)
})
onUnmounted(() => window.removeEventListener('resize', measure))
watch(
  () => props.items,
  () => nextTick(measure),
  { deep: true }
)
</script>

<template>
  <div
    ref="rootEl"
    class="w-full divide-y divide-foreground/10 overflow-hidden rounded-xl border border-foreground/10 bg-card/40"
  >
    <div v-for="(item, i) in items" :key="i">
      <button
        :id="`${uid}-header-${i}`"
        type="button"
        class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
        :aria-expanded="isOpen(i)"
        :aria-controls="`${uid}-panel-${i}`"
        @click="toggle(i)"
      >
        <span>{{ item.title }}</span>
        <!-- Chevron: rotate 180° with a springy overshoot. -->
        <ChevronDown
          class="size-4 shrink-0 text-muted-foreground"
          :class="[
            isOpen(i) ? 'rotate-180' : '',
            ready
              ? 'transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
              : ''
          ]"
          aria-hidden="true"
        />
      </button>
      <!-- Panel: height eases from 0 to the measured content height (--h). -->
      <div
        :id="`${uid}-panel-${i}`"
        role="region"
        :aria-labelledby="`${uid}-header-${i}`"
        class="overflow-hidden"
        :class="[
          isOpen(i) ? 'max-h-[var(--h)]' : 'max-h-0',
          ready
            ? 'transition-[max-height] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'
            : ''
        ]"
        :style="{ '--h': `${heights[i] ?? 0}px` }"
      >
        <div data-accordion-inner class="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
