<script setup lang="ts">
import type { SyllableGroup } from '~/data/syllables'

interface Props {
  group: SyllableGroup
}

defineProps<Props>()
const { speak } = useSpeech()

async function playOne(s: string) {
  await speak(s, { rate: 0.8 })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div
      class="card-soft p-6 sm:p-8 bg-gradient-to-br animate-pop-in"
      :class="group.color"
      :key="group.consonant"
    >
      <div class="flex items-center justify-between gap-4 mb-5">
        <div>
          <p class="text-white text-sm font-semibold uppercase tracking-widest text-shadow-pop">
            Konsonan
          </p>
          <p class="text-7xl sm:text-8xl font-display font-extrabold text-white drop-shadow-lg text-shadow-pop leading-none">
            {{ group.consonant }}
          </p>
        </div>
        <span class="text-7xl sm:text-8xl drop-shadow-lg animate-float">{{ group.emoji }}</span>
      </div>

      <div class="grid grid-cols-5 gap-2 sm:gap-3">
        <button
          v-for="(s, i) in group.syllables"
          :key="s"
          type="button"
          class="aspect-square rounded-2xl bg-white/90 hover:bg-white text-slate-800
                 font-display font-extrabold text-2xl sm:text-4xl shadow-lg
                 transition-transform active:scale-90 hover:-translate-y-1
                 animate-pop-in"
          :style="{ animationDelay: `${i * 80}ms` }"
          :aria-label="`Suku kata ${s}`"
          @click="playOne(s)"
        >
          {{ s }}
        </button>
      </div>

      <div class="mt-5 flex justify-center">
        <AudioButton
          :text="group.syllables.join(' ')"
          :parts="group.syllables"
          variant="plain"
          size="lg"
          label="Dengar semua"
        />
      </div>
    </div>
  </div>
</template>
