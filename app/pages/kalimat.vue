<script setup lang="ts">
import { sentences } from '~/data/sentences'

useSiteSeo({
  title: 'Belajar Membaca Kalimat',
  description:
    'Baca kalimat sederhana sehari-hari: "Ini ibu", "Itu bola", "Sapi minum susu". Tahap 4 (terakhir) dari kurikulum belajar membaca anak Indonesia.',
})

const idx = ref(0)
const showConfetti = ref(0)
const { markDone, completed } = useProgress('sentences')

const current = computed(() => sentences[idx.value]!)

const completedIdxs = computed(() =>
  sentences
    .map((s, i) => (completed.value.includes(s.text) ? i : -1))
    .filter((i) => i >= 0),
)

function onSentenceDone() {
  markDone(current.value.text)
}

function next() {
  markDone(current.value.text)
  if (idx.value < sentences.length - 1) {
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
    <AppHeader title="Tahap 4 · Kalimat" subtitle="Baca kalimat sederhana sehari-hari" />

    <ConfettiBurst :trigger="showConfetti" />

    <section class="px-4 sm:px-8 mt-2 mb-4">
      <ProgressDots
        :total="sentences.length"
        :current="idx"
        :completed="completedIdxs"
      />
    </section>

    <section class="px-4 sm:px-8">
      <SentenceCard :sentence="current" @done="onSentenceDone" />
    </section>

    <section class="mt-6 sm:mt-8 px-4 sm:px-8">
      <LessonNav :current="idx" :total="sentences.length" @prev="prev" @next="next" />
    </section>
  </main>
</template>
