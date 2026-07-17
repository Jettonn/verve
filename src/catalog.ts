// The component catalog — one entry per Verve component. This is the single
// source of truth the gallery, the per-component pages, the CLI install picker
// and the sitemap all read from, so adding a component here wires it everywhere.
import type { Component } from 'vue'

import MagneticButton from './components/MagneticButton.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import AnimatedCounter from './components/AnimatedCounter.vue'
import StaggeredList from './components/StaggeredList.vue'
import ErrorShake from './components/ErrorShake.vue'
import ForwardButton from './components/ForwardButton.vue'
import VolumeButton from './components/VolumeButton.vue'
import SegmentedControl from './components/SegmentedControl.vue'
import SpringSwitch from './components/SpringSwitch.vue'
import Tooltip from './components/Tooltip.vue'
import Accordion from './components/Accordion.vue'
import TagInput from './components/TagInput.vue'
import PinInput from './components/PinInput.vue'
import RippleButton from './components/RippleButton.vue'
import Marquee from './components/Marquee.vue'

import MagneticSrc from './components/MagneticButton.vue?raw'
import ThemeToggleSrc from './components/ThemeToggle.vue?raw'
import CounterSrc from './components/AnimatedCounter.vue?raw'
import StaggeredSrc from './components/StaggeredList.vue?raw'
import ErrorShakeSrc from './components/ErrorShake.vue?raw'
import ForwardSrc from './components/ForwardButton.vue?raw'
import VolumeSrc from './components/VolumeButton.vue?raw'
import SegmentedSrc from './components/SegmentedControl.vue?raw'
import SwitchSrc from './components/SpringSwitch.vue?raw'
import TooltipSrc from './components/Tooltip.vue?raw'
import AccordionSrc from './components/Accordion.vue?raw'
import TagInputSrc from './components/TagInput.vue?raw'
import PinInputSrc from './components/PinInput.vue?raw'
import RippleButtonSrc from './components/RippleButton.vue?raw'
import MarqueeSrc from './components/Marquee.vue?raw'

export type CatalogEntry = {
  /** Registry slug, e.g. "magnetic-button". Also the page path segment. */
  slug: string
  /** PascalCase component name. */
  name: string
  /** Short interaction label shown under the gallery card. */
  tagline: string
  /** Sentence-level description — the indexable prose on the detail page. */
  description: string
  /** Long-tail search terms this component should rank for. */
  keywords: string[]
  /** The component itself, for the live demo. */
  component: Component
  /** Raw single-file source, for the copy/code view. */
  source: string
  /** Static props for the detail-page demo. */
  demoProps?: Record<string, unknown>
  /** Initial v-model value; the detail page binds it two-way generically. */
  demoModel?: unknown
  /** Default-slot text for components that wrap a child (buttons, tooltip). */
  demoSlot?: string
  /** An exposed method to trigger from a demo button, e.g. ErrorShake.shake(). */
  action?: { label: string; method: string }
  /** Demo needs the full panel width (marquee). */
  wide?: boolean
}

const FAQ = [
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

export const CATALOG: CatalogEntry[] = [
  {
    slug: 'magnetic-button',
    name: 'MagneticButton',
    tagline: 'Cursor-follow spring',
    description:
      'A Vue button that eases toward the cursor on a spring while hovered, then snaps back home on leave. A subtle magnetic pull that makes primary actions feel physical and responsive.',
    keywords: ['vue magnetic button', 'cursor follow button', 'spring hover button'],
    component: MagneticButton,
    source: MagneticSrc,
    demoSlot: 'Hover me'
  },
  {
    slug: 'theme-toggle',
    name: 'ThemeToggle',
    tagline: 'Layout + icon crossfade',
    description:
      'A day/night theme switch for Vue: the knob springs across the track while sun and moon cross-fade with a blurred scale. A polished dark-mode toggle built on motion-v.',
    keywords: ['vue theme toggle', 'vue dark mode switch', 'day night toggle'],
    component: ThemeToggle,
    source: ThemeToggleSrc,
    demoModel: true
  },
  {
    slug: 'animated-counter',
    name: 'AnimatedCounter',
    tagline: 'Spring number roll',
    description:
      'A number that springs to each new value with tabular, roll-style motion. Ideal for Vue dashboards, stat tiles and live metrics where a value change should read as movement.',
    keywords: ['vue animated counter', 'vue number roll', 'animated stat counter'],
    component: AnimatedCounter,
    source: CounterSrc,
    demoProps: { value: 2016, class: 'text-4xl font-bold tabular-nums' }
  },
  {
    slug: 'staggered-list',
    name: 'StaggeredList',
    tagline: 'Staggered reveal',
    description:
      'List items that spring in one after another with a blurred rise. A Vue stagger animation for menus, search results and empty-state reveals.',
    keywords: ['vue staggered list', 'vue stagger animation', 'list reveal animation'],
    component: StaggeredList,
    source: StaggeredSrc,
    demoProps: {
      items: ['Spring physics', 'Gesture handling', 'Layout animation', 'Reduced motion']
    }
  },
  {
    slug: 'error-shake',
    name: 'ErrorShake',
    tagline: 'Invalid-input shake',
    description:
      'Wraps a field and shakes it on invalid submit, exposing a shake() method you call from your own validation. A classic form-error micro-interaction for Vue.',
    keywords: ['vue error shake', 'form validation shake', 'invalid input animation'],
    component: ErrorShake,
    source: ErrorShakeSrc,
    demoSlot: 'Invalid input',
    action: { label: 'Shake', method: 'shake' }
  },
  {
    slug: 'forward-button',
    name: 'ForwardButton',
    tagline: 'Slide-arrow interaction',
    description:
      'A slide-arrow action button for Vue — the arrow leads and the label follows on a spring. A confident "next" or "continue" control.',
    keywords: ['vue forward button', 'slide arrow button', 'next step button'],
    component: ForwardButton,
    source: ForwardSrc
  },
  {
    slug: 'volume-button',
    name: 'VolumeButton',
    tagline: 'Morph interaction',
    description:
      'A mute toggle whose icon morphs between states with a blurred scale swap. A tidy Vue media control with satisfying state transitions.',
    keywords: ['vue volume button', 'mute toggle', 'icon morph button'],
    component: VolumeButton,
    source: VolumeSrc
  },
  {
    slug: 'segmented-control',
    name: 'SegmentedControl',
    tagline: 'Sliding active pill',
    description:
      'A Vue segmented control with a pill that slides between options. Keyboard-navigable and accessible — a refined alternative to radio buttons or tabs.',
    keywords: ['vue segmented control', 'sliding pill tabs', 'ios style segmented control'],
    component: SegmentedControl,
    source: SegmentedSrc,
    demoProps: { options: ['Spring', 'Tween', 'Instant'] }
  },
  {
    slug: 'spring-switch',
    name: 'SpringSwitch',
    tagline: 'Springy overshoot toggle',
    description:
      'An on/off switch whose thumb overshoots with a springy settle. A tactile Vue toggle with just enough bounce to feel alive.',
    keywords: ['vue spring switch', 'vue toggle switch', 'bouncy toggle'],
    component: SpringSwitch,
    source: SwitchSrc,
    demoModel: true,
    demoProps: { label: 'Autoplay' }
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    tagline: 'Spring-scale tooltip',
    description:
      'A Vue tooltip that springs open after an intent delay and closes instantly. Grows out of the trigger it wraps, with a quick fade under reduced motion.',
    keywords: ['vue tooltip', 'spring tooltip', 'hover tooltip component'],
    component: Tooltip,
    source: TooltipSrc,
    demoProps: { content: "Springy, isn't it?" },
    demoSlot: 'Hover me'
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    tagline: 'Springy expand + chevron',
    description:
      'Collapsible panels that expand to their content height on a smooth ease, with a chevron that rotates with a springy overshoot. A pure-CSS Vue accordion — no runtime motion library.',
    keywords: ['vue accordion', 'vue collapse component', 'expandable panel'],
    component: Accordion,
    source: AccordionSrc,
    demoProps: { items: FAQ, defaultOpen: 0, class: 'w-full max-w-md' }
  },
  {
    slug: 'tag-input',
    name: 'TagInput',
    tagline: 'Spring-pop tag pills',
    description:
      'A Vue tag input: Enter pops a pill in with a back-eased overshoot, its × fades it out, and Backspace clears the last tag. The field and pills share one bordered container that highlights on focus.',
    keywords: ['vue tag input', 'vue token input', 'tags field component'],
    component: TagInput,
    source: TagInputSrc,
    demoModel: ['Vue', 'Motion'],
    demoProps: { placeholder: 'Type + Enter…' }
  },
  {
    slug: 'pin-input',
    name: 'PinInput',
    tagline: 'Digit-pop code boxes',
    description:
      'A one-time-code / PIN input for Vue. Each digit pops in with a back-eased scale and auto-advances focus; Backspace on an empty box steps back. Emits a complete event when full.',
    keywords: ['vue pin input', 'vue otp input', 'one time code input'],
    component: PinInput,
    source: PinInputSrc,
    demoModel: ''
  },
  {
    slug: 'ripple-button',
    name: 'RippleButton',
    tagline: 'Click-point ripple',
    description:
      'A Vue button with a material-style ripple that starts at the exact click point, scaling out and fading over the press. Multiple presses stack, and reduced motion skips the ripple.',
    keywords: ['vue ripple button', 'material ripple vue', 'click ripple effect'],
    component: RippleButton,
    source: RippleButtonSrc,
    demoSlot: 'Press anywhere'
  },
  {
    slug: 'marquee',
    name: 'Marquee',
    tagline: 'Looping hover-pause scroll',
    description:
      'An infinite horizontal marquee of chips for Vue that pauses on hover, with edge mask fades. The list is duplicated and slid for a seamless loop — pure CSS, no runtime library.',
    keywords: ['vue marquee', 'infinite scroll chips', 'logo marquee component'],
    component: Marquee,
    source: MarqueeSrc,
    demoProps: { items: ['Spring', 'Stagger', 'Ripple', 'Tooltip', 'Magnetic', 'Tween', 'Blur'] },
    wide: true
  }
]

export function findEntry(slug: string): CatalogEntry | undefined {
  return CATALOG.find((c) => c.slug === slug)
}
