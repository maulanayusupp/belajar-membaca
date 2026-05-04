<script setup lang="ts">
import { words } from '~/data/words'

const idx = ref(0)
const showConfetti = ref(0)
const { markDone, completed } = useProgress('words')

const current = computed(() => words[idx.value]!)

const completedIdxs = computed(() =>
  words
    .map((w, i) => (completed.value.includes(w.text) ? i : -1))
    .filter((i) => i >= 0),
)

function onWordDone() {
  markDone(current.value.text)
}

function next() {
  markDone(current.value.text)
  if (idx.value < words.length - 1) {
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
    <AppHeader title="Tahap 3 · Kata" subtitle="Gabungkan suku kata jadi sebuah kata" />

    <ConfettiBurst :trigger="showConfetti" />

    <section class="px-4 sm:px-8 mt-2 mb-4">
      <ProgressDots
        :total="words.length"
        :current="idx"
        :completed="completedIdxs"
      />
    </section>

    <section class="px-4 sm:px-8">
      <WordCard :word="current" @done="onWordDone" />
    </section>

    <section class="mt-6 sm:mt-8 px-4 sm:px-8">
      <LessonNav :current="idx" :total="words.length" @prev="prev" @next="next" />
    </section>
  </main>
</template>
