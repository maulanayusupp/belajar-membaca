<script setup lang="ts">
/**
 * Generic quiz question card.
 *
 * Plays an audio prompt, shows N options, locks after pick. Emits `answer`
 * with the correctness flag — page handles next-question advance + scoring.
 */
export interface QuizOption {
  id: string
  /** Visible label inside the option button (text or short word) */
  label: string
}

interface Props {
  /** Full text spoken when "Putar lagi" is pressed */
  audioText: string
  /** Optional segments — read with small gaps for blended-syllable practice */
  audioParts?: string[]
  options: QuizOption[]
  correctId: string
  /** Optional numbering shown above the audio button */
  questionLabel?: string
  /** Visual size of option buttons — kalimat needs single column for long text */
  layout?: 'grid' | 'stack'
}

const props = withDefaults(defineProps<Props>(), { layout: 'grid' })
const emit = defineEmits<{ answer: [correct: boolean] }>()

const { speak, speakSequence } = useSpeech()
const selectedId = ref<string | null>(null)
const locked = computed(() => selectedId.value !== null)

async function playAudio() {
  if (props.audioParts && props.audioParts.length > 1) {
    await speakSequence(props.audioParts, 250)
  } else {
    await speak(props.audioText)
  }
}

// Auto-play on mount + every time the question changes
onMounted(() => {
  setTimeout(playAudio, 400)
})
watch(
  () => props.audioText,
  () => {
    selectedId.value = null
    setTimeout(playAudio, 250)
  },
)

function pick(id: string) {
  if (locked.value) return
  selectedId.value = id
  emit('answer', id === props.correctId)
}

function buttonClass(id: string) {
  if (!locked.value) {
    return 'bg-white hover:bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:-translate-y-0.5'
  }
  if (id === props.correctId) {
    return 'bg-gradient-to-br from-emerald-400 to-green-500 text-white ring-2 ring-emerald-300 animate-pulse'
  }
  if (id === selectedId.value) {
    return 'bg-gradient-to-br from-rose-400 to-red-500 text-white ring-2 ring-rose-300'
  }
  return 'bg-white text-slate-400 ring-1 ring-slate-200 opacity-50'
}

const optionGridClass = computed(() =>
  props.layout === 'stack'
    ? 'grid-cols-1'
    : 'grid-cols-2',
)
const optionPadClass = computed(() =>
  props.layout === 'stack'
    ? 'px-4 py-4 text-xl sm:text-2xl'
    : 'px-5 py-6 sm:py-8 text-3xl sm:text-5xl',
)
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="card-soft bg-white p-6 sm:p-8 text-center animate-pop-in" :key="audioText">
      <p v-if="questionLabel" class="text-xs font-bold text-slate-500 uppercase tracking-widest">
        {{ questionLabel }}
      </p>
      <p class="mt-1 text-base sm:text-lg font-semibold text-slate-700">
        Dengarkan suaranya 👂
      </p>

      <button
        type="button"
        class="btn-pill mt-4 text-xl sm:text-2xl px-7 py-4 sm:py-5 bg-gradient-to-br from-sun-300 to-sun-500 text-white"
        @click="playAudio"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 11 5l-4 4H4a1 1 0 0 0-1 1z" />
          <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M19 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Putar lagi
      </button>

      <p class="mt-7 text-base sm:text-lg font-bold text-slate-700">
        Mana yang benar?
      </p>

      <div class="grid gap-3 mt-3" :class="optionGridClass">
        <button
          v-for="(opt, i) in options"
          :key="opt.id"
          type="button"
          class="rounded-2xl font-display font-extrabold shadow-lg transition-all active:scale-95 animate-pop-in"
          :class="[buttonClass(opt.id), optionPadClass]"
          :style="{ animationDelay: `${i * 80}ms` }"
          :disabled="locked"
          :aria-label="`Pilihan ${opt.label}`"
          @click="pick(opt.id)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>
