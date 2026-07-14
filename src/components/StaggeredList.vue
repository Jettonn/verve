<script setup lang="ts">
// Verve · StaggeredList
// Children spring in one after another using a parent/child variant
// cascade. Great for menus, search results and empty-state reveals.
import { motion } from 'motion-v'
import { useReducedMotion } from '@/lib/useReducedMotion'

const props = withDefaults(
  defineProps<{
    items: string[]
    /** Seconds between each child. */
    stagger?: number
  }>(),
  { stagger: 0.04 }
)

const reduced = useReducedMotion()

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: reduced.value ? 0 : props.stagger }
  }
}

const item = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 320, damping: 24 }
  }
}
</script>

<template>
  <motion.ul
    :variants="container"
    initial="hidden"
    animate="show"
    class="flex w-full max-w-xs flex-col gap-2"
  >
    <motion.li
      v-for="entry in items"
      :key="entry"
      :variants="item"
      class="rounded-md border bg-card px-3 py-2 text-sm text-card-foreground"
    >
      {{ entry }}
    </motion.li>
  </motion.ul>
</template>
