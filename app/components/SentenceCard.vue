<script setup lang="ts">
import type { Sentence } from '~/data/sentences'

interface Props {
  sentence: Sentence
}

const props = defineProps<Props>()
const emit = defineEmits<{ done: [] }>()

const { speak } = useSpeech()
const activeWord = ref<number | null>(null)

watch(
  () => props.sentence,
  () => {
    activeWord.value = null
  },
)

async function playWord(i: number) {
  activeWord.value = i
  await speak(props.sentence.words[i]!, { rate: 0.85 })
  activeWord.value = null
}

async function playSentence() {
  for (let i = 0; i < props.sentence.words.length; i++) {
    activeWord.value = i
    await speak(props.sentence.words[i]!, { rate: 0.85 })
    await new Promise((r) => setTimeout(r, 200))
  }
  activeWord.value = null
  emit('done')
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div
      class="card-soft p-6 sm:p-10 text-center bg-gradient-to-br animate-pop-in"
      :class="sentence.color"
      :key="sentence.text"
    >
      <span class="text-7xl sm:text-9xl drop-shadow-lg inline-block animate-float">
        {{ sentence.emoji }}
      </span>

      <!-- Sentence as clickable words -->
      <div class="mt-6 flex justify-center items-center gap-2 flex-wrap">
        <button
          v-for="(w, i) in sentence.words"
          :key="i"
          type="button"
          class="rounded-2xl px-4 py-2 sm:px-5 sm:py-3 bg-white/95 hover:bg-white
                 font-display font-extrabold text-2xl sm:text-4xl text-slate-800
                 shadow-md transition-all active:scale-90"
          :class="{ 'ring-4 ring-sun-300 scale-110 animate-glow': activeWord === i }"
          :aria-label="`Kata ${w}`"
          @click="playWord(i)"
        >
          {{ w }}
        </button>
      </div>

      <p class="mt-5 text-white text-sm font-semibold text-shadow-pop">
        Tekan kata untuk dengar satu per satu
      </p>

      <div class="mt-5 flex justify-center gap-2">
        <AudioButton
          :text="sentence.text"
          variant="plain"
          size="lg"
          label="Baca cepat"
          @done="emit('done')"
        />
        <button
          type="button"
          class="btn-pill text-lg px-5 py-3 bg-white/90 text-slate-800 hover:bg-white"
          @click="playSentence"
        >
          <span class="text-xl">🐢</span>
          Baca pelan
        </button>
      </div>
    </div>
  </div>
</template>
