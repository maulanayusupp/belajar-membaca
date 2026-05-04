<script setup lang="ts">
import type { Word } from '~/data/words'

interface Props {
  word: Word
}

const props = defineProps<Props>()
const emit = defineEmits<{ done: [] }>()

const { speak, speakSequence } = useSpeech()

const highlightedPart = ref<number | null>(null)
const fullPlayed = ref(false)

watch(
  () => props.word,
  () => {
    highlightedPart.value = null
    fullPlayed.value = false
  },
)

async function playPart(idx: number) {
  highlightedPart.value = idx
  await speak(props.word.parts[idx]!, { rate: 0.8 })
  highlightedPart.value = null
}

/** Read syllable-by-syllable, then the full word — classic blending technique. */
async function playBlended() {
  for (let i = 0; i < props.word.parts.length; i++) {
    highlightedPart.value = i
    await speak(props.word.parts[i]!, { rate: 0.75 })
    await new Promise((r) => setTimeout(r, 200))
  }
  highlightedPart.value = null
  await new Promise((r) => setTimeout(r, 250))
  await speak(props.word.text, { rate: 0.95 })
  fullPlayed.value = true
  emit('done')
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto">
    <div
      class="card-soft p-6 sm:p-10 text-center bg-gradient-to-br animate-pop-in"
      :class="word.color"
      :key="word.text"
    >
      <span class="text-7xl sm:text-9xl drop-shadow-lg inline-block animate-float">
        {{ word.emoji }}
      </span>

      <!-- Syllable chips -->
      <div class="mt-6 flex justify-center items-center gap-2 flex-wrap">
        <template v-for="(p, i) in word.parts" :key="i">
          <button
            type="button"
            class="rounded-2xl px-5 py-3 sm:px-6 sm:py-4 bg-white/95 hover:bg-white
                   font-display font-extrabold text-3xl sm:text-5xl text-slate-800
                   shadow-lg transition-all active:scale-90"
            :class="{ 'animate-glow ring-4 ring-sun-300 scale-110': highlightedPart === i }"
            :aria-label="`Suku kata ${p}`"
            @click="playPart(i)"
          >
            {{ p }}
          </button>
          <span
            v-if="i < word.parts.length - 1"
            class="text-3xl sm:text-5xl font-display font-extrabold text-white text-shadow-pop"
          >
            +
          </span>
        </template>
      </div>

      <!-- Full word -->
      <div class="mt-5">
        <p class="text-white text-sm font-semibold tracking-widest uppercase text-shadow-pop">Bunyi gabungan</p>
        <p
          class="font-display font-extrabold text-5xl sm:text-7xl text-white drop-shadow-lg text-shadow-pop leading-none"
          :class="fullPlayed && 'animate-bounce-soft'"
        >
          {{ word.text }}
        </p>
      </div>

      <!-- Action buttons -->
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <AudioButton
          :text="word.text"
          variant="plain"
          size="lg"
          label="Dengar utuh"
          @done="emit('done')"
        />
        <button
          type="button"
          class="btn-pill text-lg px-5 py-3 bg-white/90 text-slate-800 hover:bg-white"
          @click="playBlended"
        >
          <span class="text-xl">🔗</span>
          Eja & Gabung
        </button>
      </div>
    </div>
  </div>
</template>
