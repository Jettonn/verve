<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { Github, LayoutGrid, ArrowRight, RotateCcw } from 'lucide-vue-next'

import ComponentCard from '../site/ComponentCard.vue'
import CliInstall from '../site/CliInstall.vue'
import VerveMark from '../site/VerveMark.vue'
import { REPO_URL, SITE_URL } from '../config'
import {
  ForwardButton,
  VolumeButton,
  SegmentedControl,
  SpringSwitch,
  Tooltip,
  MagneticButton,
  ThemeToggle,
  AnimatedCounter,
  StaggeredList,
  ErrorShake,
  Accordion,
  TagInput,
  PinInput,
  RippleButton,
  Marquee
} from '../components'

import ForwardSrc from '../components/ForwardButton.vue?raw'
import VolumeSrc from '../components/VolumeButton.vue?raw'
import SegmentedSrc from '../components/SegmentedControl.vue?raw'
import SwitchSrc from '../components/SpringSwitch.vue?raw'
import TooltipSrc from '../components/Tooltip.vue?raw'
import MagneticSrc from '../components/MagneticButton.vue?raw'
import ThemeToggleSrc from '../components/ThemeToggle.vue?raw'
import CounterSrc from '../components/AnimatedCounter.vue?raw'
import StaggeredSrc from '../components/StaggeredList.vue?raw'
import ErrorShakeSrc from '../components/ErrorShake.vue?raw'
import AccordionSrc from '../components/Accordion.vue?raw'
import TagInputSrc from '../components/TagInput.vue?raw'
import PinInputSrc from '../components/PinInput.vue?raw'
import RippleButtonSrc from '../components/RippleButton.vue?raw'
import MarqueeSrc from '../components/Marquee.vue?raw'

useHead({
  title: 'Verve — Vue Motion & Micro-interaction Components',
  link: [{ rel: 'canonical', href: `${SITE_URL}/` }],
  meta: [
    {
      name: 'description',
      content:
        'Verve is an open-source library of Vue micro-interaction and motion components. Add them with the CLI or copy the source — powered by motion-v and Tailwind CSS. No runtime package, no lock-in.'
    },
    { property: 'og:url', content: `${SITE_URL}/` },
    { property: 'og:title', content: 'Verve — Vue Motion & Micro-interaction Components' }
  ]
})

const gridEl = ref<HTMLElement | null>(null)
function scrollToGrid() {
  gridEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// --- Demo state for the interactive cards. ---
const count = ref(2016)
function bumpCounter() {
  count.value = Math.round(1000 + Math.abs(Math.sin(count.value * 1.7)) * 8000)
}
const switchOn = ref(true)
// The gallery demo has its own state so it previews the toggle without flipping the site theme.
const demoDark = ref(true)
const listKey = ref(0)
const listItems = ['Spring physics', 'Gesture handling', 'Layout animation', 'Reduced motion']
const accordionItems = [
  {
    title: 'What is Verve?',
    content:
      'A curated set of micro-interaction components for Vue — copy the source, tune the spring, and ship the feel.'
  },
  {
    title: 'Do I need a runtime package?',
    content:
      'No. Add a component with the CLI or copy its file; the motion lives inside the component itself.'
  },
  {
    title: 'Does it respect reduced motion?',
    content:
      'Yes — every component falls back to instant state changes when a visitor asks for less.'
  }
]
const shakeRef = ref<InstanceType<typeof ErrorShake> | null>(null)
const tags = ref(['Vue', 'Motion'])
const pin = ref('')
const marqueeChips = [
  'Spring',
  'Stagger',
  'Ripple',
  'Tooltip',
  'Magnetic',
  'Tween',
  'Blur',
  'Overshoot'
]

const demoBtn =
  'interactive rounded-full border border-foreground/10 bg-foreground/4 px-3 py-1.5 text-xs font-medium tracking-tight text-foreground hover:bg-foreground/7'
</script>

<template>
  <main>
    <section class="mx-auto max-w-6xl px-6 pb-2 pt-16 text-center sm:pt-24">
      <VerveMark class="mx-auto mb-8 h-16 w-auto text-primary sm:h-20" />
      <h1 class="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        Motion, with <span class="text-primary">verve</span>.
      </h1>
      <p class="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        A curated set of micro-interactions components for Vue. Add them with the CLI or copy the
        source, tune the springs, and ship the feel — no runtime package, no lock-in.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          :href="REPO_URL"
          target="_blank"
          rel="noreferrer"
          class="interactive inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium tracking-tight text-background hover:opacity-90"
        >
          <Github class="size-4" />
          GitHub repo
        </a>
        <button
          @click="scrollToGrid"
          class="interactive inline-flex h-9 items-center gap-2 rounded-full border border-foreground/10 bg-foreground/4 px-5 text-[13px] font-medium tracking-tight text-foreground hover:bg-foreground/7"
        >
          <LayoutGrid class="size-4" />
          Browse components
        </button>
      </div>
    </section>

    <section id="install" class="mx-auto max-w-6xl scroll-mt-20 px-6 pb-6 pt-10">
      <div class="mb-8 text-center">
        <h2 class="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Add it with the CLI
        </h2>
        <p class="mx-auto mt-3 max-w-lg text-pretty text-sm text-muted-foreground sm:text-base">
          One line drops the component's source into your
          <code
            class="rounded bg-foreground/6 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
            >src/components/ui</code
          >, pulls in the shared composable, and installs its deps.
        </p>
      </div>
      <CliInstall />
    </section>

    <section id="components" ref="gridEl" class="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24 pt-12">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ComponentCard
          name="MagneticButton"
          interaction="Cursor-follow spring"
          :source="MagneticSrc"
        >
          <MagneticButton>Hover me</MagneticButton>
        </ComponentCard>

        <ComponentCard
          name="ThemeToggle"
          interaction="Layout + icon crossfade"
          :source="ThemeToggleSrc"
        >
          <ThemeToggle v-model="demoDark" />
        </ComponentCard>

        <ComponentCard name="AnimatedCounter" interaction="Spring number roll" :source="CounterSrc">
          <div class="flex flex-col items-center gap-4">
            <AnimatedCounter :value="count" class="text-4xl font-bold tabular-nums" />
            <button @click="bumpCounter" :class="demoBtn">Randomize</button>
          </div>
        </ComponentCard>

        <ComponentCard name="StaggeredList" interaction="Staggered reveal" :source="StaggeredSrc">
          <StaggeredList :key="listKey" :items="listItems" />
          <button
            @click="listKey++"
            aria-label="Replay"
            class="interactive absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/3 text-muted-foreground hover:bg-foreground/6 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <RotateCcw class="size-4" />
          </button>
        </ComponentCard>

        <ComponentCard name="ErrorShake" interaction="Invalid-input shake" :source="ErrorShakeSrc">
          <ErrorShake ref="shakeRef">
            <div class="relative w-56">
              <input
                readonly
                value="wrong password"
                class="w-full rounded-lg border border-foreground/12 bg-foreground/3 py-2 pl-3 pr-11 text-base sm:text-sm"
              />
              <button
                type="button"
                @click="shakeRef?.shake()"
                aria-label="Submit"
                class="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <ArrowRight class="size-4" />
              </button>
            </div>
          </ErrorShake>
        </ComponentCard>

        <ComponentCard
          name="ForwardButton"
          interaction="Slide-arrow interaction"
          :source="ForwardSrc"
        >
          <ForwardButton />
        </ComponentCard>

        <ComponentCard name="VolumeButton" interaction="Morph interaction" :source="VolumeSrc">
          <VolumeButton />
        </ComponentCard>

        <ComponentCard
          name="SegmentedControl"
          interaction="Sliding active pill"
          :source="SegmentedSrc"
        >
          <SegmentedControl :options="['Spring', 'Tween', 'Instant']" />
        </ComponentCard>

        <ComponentCard
          name="SpringSwitch"
          interaction="Springy overshoot toggle"
          :source="SwitchSrc"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground">Autoplay</span>
            <SpringSwitch v-model="switchOn" label="Autoplay" />
          </div>
        </ComponentCard>

        <ComponentCard name="Tooltip" interaction="Spring-scale tooltip" :source="TooltipSrc">
          <Tooltip content="Springy, isn't it?">
            <button
              class="interactive inline-flex h-9 items-center rounded-full border border-foreground/10 bg-foreground/4 px-6 text-[13px] font-medium tracking-tight text-foreground hover:bg-foreground/7"
            >
              Hover me
            </button>
          </Tooltip>
        </ComponentCard>

        <ComponentCard
          name="Accordion"
          interaction="Springy expand + chevron"
          :source="AccordionSrc"
        >
          <Accordion :items="accordionItems" :default-open="0" class="w-full max-w-xs" />
        </ComponentCard>

        <ComponentCard name="TagInput" interaction="Spring-pop tag pills" :source="TagInputSrc">
          <TagInput v-model="tags" placeholder="Type + Enter…" />
        </ComponentCard>

        <ComponentCard name="PinInput" interaction="Digit-pop code boxes" :source="PinInputSrc">
          <PinInput v-model="pin" />
        </ComponentCard>

        <ComponentCard
          name="RippleButton"
          interaction="Click-point ripple"
          :source="RippleButtonSrc"
        >
          <RippleButton>Press anywhere</RippleButton>
        </ComponentCard>

        <ComponentCard name="Marquee" interaction="Looping hover-pause scroll" :source="MarqueeSrc">
          <Marquee :items="marqueeChips" class="w-full" />
        </ComponentCard>
      </div>
    </section>
  </main>
</template>
