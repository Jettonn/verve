<script setup lang="ts">
// Verve · Marquee
// An infinite horizontal chip loop. The list is rendered twice and the track
// slides translateX 0 → -50% on a linear infinite keyframe — since half the
// track is exactly one copy, the seam is invisible. Each chip carries its own
// right margin (not flex gap) so -50% lands the duplicate precisely on the
// original. Hover pauses via animation-play-state; edge mask-image fades the
// ends. Pure CSS — reduced motion stops the scroll.
withDefaults(
  defineProps<{
    items: string[]
    /** Seconds for one full loop. */
    duration?: number
    /** Scroll rightward instead of left. */
    reverse?: boolean
    /** Freeze the track while hovered. */
    pauseOnHover?: boolean
  }>(),
  { duration: 24, reverse: false, pauseOnHover: true }
)
</script>

<template>
  <div class="marquee relative overflow-hidden py-1.5" :class="{ 'marquee--pause': pauseOnHover }">
    <div
      class="track flex w-max"
      :style="{
        animationDuration: `${duration}s`,
        animationDirection: reverse ? 'reverse' : 'normal'
      }"
    >
      <span
        v-for="(chip, i) in items"
        :key="`a-${i}`"
        class="mr-3 shrink-0 rounded-full border border-foreground/10 bg-foreground/4 px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-foreground"
      >
        {{ chip }}
      </span>
      <!-- Duplicate copy: hidden from assistive tech, present only for the loop. -->
      <span
        v-for="(chip, i) in items"
        :key="`b-${i}`"
        aria-hidden="true"
        class="mr-3 shrink-0 rounded-full border border-foreground/10 bg-foreground/4 px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-foreground"
      >
        {{ chip }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
}
.track {
  animation: verve-marquee linear infinite;
  will-change: transform;
}
.marquee--pause:hover .track {
  animation-play-state: paused;
}
@keyframes verve-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}
</style>
