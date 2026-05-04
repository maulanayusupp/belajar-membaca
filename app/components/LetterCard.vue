<script setup lang="ts">
import type { Letter } from '~/data/letters'

interface Props {
  letter: Letter
}

const props = defineProps<Props>()

const { speak } = useSpeech()

const showExample = ref(false)

async function playLetter() {
  await speak(props.letter.sound, { rate: 0.85 })
}

async function playExample() {
  showExample.value = true
  await speak(props.letter.example, { rate: 0.9 })
}

watch(
  () => props.letter,
  () => {
    showExample.value = false
  },
)
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div
      class="card-soft p-6 sm:p-10 text-center bg-gradient-to-br animate-pop-in"
      :class="letter.color"
      :key="letter.upper"
    >
      <div class="grid grid-cols-2 gap-4 items-center">
        <div class="text-[7rem] sm:text-[10rem] leading-none font-display font-extrabold text-white drop-shadow-lg text-shadow-pop">
          {{ letter.upper }}
        </div>
        <div class="text-[6rem] sm:text-[9rem] leading-none font-display font-extrabold text-white drop-shadow-lg text-shadow-pop">
          {{ letter.lower }}
        </div>
      </div>

      <div class="mt-4 flex items-center justify-center gap-3">
        <AudioButton
          :text="letter.sound"
          :rate="0.85"
          variant="plain"
          size="lg"
          label="Bunyi huruf"
        />
      </div>

      <div class="mt-6 pt-5 border-t border-white/40">
        <button
          type="button"
          class="group inline-flex items-center gap-3 transition-transform active:scale-95"
          @click="playExample"
          aria-label="Putar suara contoh kata"
        >
          <span class="text-6xl sm:text-7xl group-hover:animate-wiggle drop-shadow-lg">
            {{ letter.emoji }}
          </span>
          <span class="text-3xl sm:text-4xl font-display font-extrabold text-white drop-shadow text-shadow-pop">
            {{ letter.example }}
          </span>
        </button>
        <p class="mt-2 text-white text-sm font-semibold text-shadow-pop">
          Tekan gambar untuk mendengar
        </p>
      </div>
    </div>
  </div>
</template>
