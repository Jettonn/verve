<script setup lang="ts">
// Renders its slot only after mount, so heavy interactive widgets (motion-v
// demos) never run during prerender. The default slot's SEO value is the text
// around it, not the widget — so keeping the widget client-only costs nothing.
import { onMounted, ref } from 'vue'
const mounted = ref(false)
onMounted(() => (mounted.value = true))
</script>

<template>
  <slot v-if="mounted" />
  <slot v-else name="fallback" />
</template>
