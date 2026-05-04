<script setup lang="ts">
import { letters } from '~/data/letters'

const idx = ref(0)
const showConfetti = ref(0)
const { markDone, completed } = useProgress('letters')

const current = computed(() => letters[idx.value]!)

const completedIdxs = computed(() =>
  letters
    .map((l, i) => (completed.value.includes(l.upper) ? i : -1))
    .filter((i) => i >= 0),
)

function next() {
  markDone(current.value.upper)
  if (idx.value < letters.length - 1) {
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
    <AppHeader title="Tahap 1 · Huruf" subtitle="Kenali bunyi huruf A sampai Z" />

    <ConfettiBurst :trigger="showConfetti" />

    <section class="px-4 sm:px-8 mt-2 mb-4">
      <ProgressDots
        :total="letters.length"
        :current="idx"
        :completed="completedIdxs"
      />
    </section>

    <section class="px-4 sm:px-8">
      <LetterCard :letter="current" />
    </section>

    <section class="mt-6 sm:mt-8 px-4 sm:px-8">
      <LessonNav :current="idx" :total="letters.length" @prev="prev" @next="next" />
    </section>
  </main>
</template>
