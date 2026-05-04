<script setup lang="ts">
import { syllables } from '~/data/syllables'

const idx = ref(0)
const showConfetti = ref(0)
const { markDone, completed } = useProgress('syllables')

const current = computed(() => syllables[idx.value]!)

const completedIdxs = computed(() =>
  syllables
    .map((g, i) => (completed.value.includes(g.consonant) ? i : -1))
    .filter((i) => i >= 0),
)

function next() {
  markDone(current.value.consonant)
  if (idx.value < syllables.length - 1) {
    idx.value++
  } else {
    showConfetti.value++
  }
}

function prev() {
  if (idx.value > 0) idx.value--
}
</script>

<template>
  <main class="flex-1 pb-10">
    <AppHeader title="Tahap 2 · Suku Kata" subtitle="Konsonan + vokal = suku kata" />

    <ConfettiBurst :trigger="showConfetti" />

    <section class="px-4 sm:px-8 mt-2 mb-4">
      <ProgressDots
        :total="syllables.length"
        :current="idx"
        :completed="completedIdxs"
      />
    </section>

    <section class="px-4 sm:px-8">
      <SyllableCard :group="current" />
    </section>

    <section class="mt-6 sm:mt-8 px-4 sm:px-8">
      <LessonNav :current="idx" :total="syllables.length" @prev="prev" @next="next" />
    </section>
  </main>
</template>
