<script setup lang="ts">
useSiteSeo({
  title: 'Mode Kuis',
  description:
    'Latihan kuis mendengar — dengar suara, pilih jawaban yang benar. Tersedia kuis huruf, suku kata, kata, dan kalimat dalam bahasa Indonesia.',
  path: '/kuis',
})

const categories = [
  {
    to: '/kuis/huruf',
    step: 'Tahap 1',
    title: 'Kuis Huruf',
    description: 'Dengar bunyi huruf, lalu pilih huruf yang benar.',
    emoji: '🔤',
    color: 'from-rose-400 to-pink-500',
  },
  {
    to: '/kuis/suku-kata',
    step: 'Tahap 2',
    title: 'Kuis Suku Kata',
    description: 'Dengar suku kata, lalu pilih bentuk tulisannya.',
    emoji: '🎵',
    color: 'from-sky-400 to-blue-500',
  },
  {
    to: '/kuis/kata',
    step: 'Tahap 3',
    title: 'Kuis Kata',
    description: 'Dengar kata, lalu pilih tulisan yang cocok.',
    emoji: '📖',
    color: 'from-amber-400 to-orange-500',
  },
  {
    to: '/kuis/kalimat',
    step: 'Tahap 4',
    title: 'Kuis Kalimat',
    description: 'Dengar kalimat, lalu pilih tulisan yang sesuai.',
    emoji: '✨',
    color: 'from-emerald-400 to-teal-500',
  },
]
</script>

<template>
  <main class="flex-1 pb-12">
    <AppHeader title="Mode Kuis 🎯" subtitle="Pilih kategori kuis yang mau dimainkan" />

    <section class="px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
        <HomeMenuCard
          v-for="(c, i) in categories"
          :key="c.to"
          v-bind="c"
          :delay="i * 100"
        />
      </div>

      <p class="mt-10 text-center text-sm text-slate-500">
        💡 Setiap kuis berisi 10 pertanyaan acak — coba lagi untuk soal baru.
      </p>
    </section>
  </main>
</template>
