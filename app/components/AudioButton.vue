<script setup lang="ts">
interface Props {
  /** Text to speak in Indonesian */
  text: string
  /** Optional sequence — if provided, parts are spoken with a small gap (used for syllable practice) */
  parts?: string[]
  /** Visual size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Override label shown inside the button */
  label?: string
  /** Hide label, show only icon */
  iconOnly?: boolean
  /** Color theme */
  variant?: 'sun' | 'sky' | 'rose' | 'mint' | 'plain'
  /** Speech rate (1 = normal). Lower = slower */
  rate?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  iconOnly: false,
  variant: 'sun',
  rate: 0.9,
})

const emit = defineEmits<{ done: [] }>()

const { speak, speakSequence, speaking } = useSpeech()

const sizeClass = computed(
  () =>
    ({
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-3',
      xl: 'text-xl px-6 py-4',
    })[props.size],
)

const iconSize = computed(
  () =>
    ({
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    })[props.size],
)

const variantClass = computed(
  () =>
    ({
      sun: 'bg-gradient-to-br from-sun-300 to-sun-400 text-white hover:brightness-110',
      sky: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white hover:brightness-110',
      rose: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white hover:brightness-110',
      mint: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white hover:brightness-110',
      plain: 'bg-white text-slate-700 ring-1 ring-slate-200',
    })[props.variant],
)

async function play() {
  if (props.parts && props.parts.length > 1) {
    await speakSequence(props.parts, 250)
  } else {
    await speak(props.text, { rate: props.rate })
  }
  emit('done')
}
</script>

<template>
  <button
    type="button"
    class="btn-pill no-tap-highlight"
    :class="[sizeClass, variantClass, speaking && 'animate-pulse']"
    :aria-label="`Putar suara ${text}`"
    :disabled="speaking"
    @click="play"
  >
    <svg
      :class="[iconSize, speaking && 'animate-bounce-soft']"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5l-4 4H4a1 1 0 0 0-1 1z" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M19 6a8 8 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="!iconOnly">{{ label ?? 'Dengar' }}</span>
  </button>
</template>
