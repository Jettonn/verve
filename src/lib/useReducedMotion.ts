import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Reactive `prefers-reduced-motion`. Verve components fall back to instant
 * state changes when this is true — motion should never get in the way.
 */
export function useReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList | null = null
  const update = () => {
    if (mq) reduced.value = mq.matches
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.addEventListener('change', update)
  })
  onUnmounted(() => mq?.removeEventListener('change', update))

  return reduced
}
