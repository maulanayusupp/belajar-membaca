<script setup lang="ts">
useSiteSeo({
  title: 'Mode Kuis',
  description:
    'Latihan kuis mendengar — dengar suara, pilih jawaban yang benar. Tersedia kuis huruf, suku kata, kata, dan kalimat dalam bahasa Indonesia.',
  path: '/kuis',
})

const { getBest } = useQuizScores()

interface Category {
  to: string
  /** Path segment used as score key (matches /kuis/[tahap]) */
  tahap: string
  step: string
  title: string
  description: string
  emoji: string
  color: string
}

const categories: Category[] = [
  {
    to: '/kuis/huruf',
    tahap: 'huruf',
    step: 'Tahap 1',
    title: 'Kuis Huruf',
    description: 'Dengar bunyi huruf, lalu pilih huruf yang benar.',
    emoji: '🔤',
    color: 'from-rose-400 to-pink-500',
  },
  {
    to: '/kuis/suku-kata',
    tahap: 'suku-kata',
    step: 'Tahap 2',
    title: 'Kuis Suku Kata',
    description: 'Dengar suku kata, lalu pilih bentuk tulisannya.',
    emoji: '🎵',
    color: 'from-sky-400 to-blue-500',
  },
  {
    to: '/kuis/kata',
    tahap: 'kata',
    step: 'Tahap 3',
    title: 'Kuis Kata',
    description: 'Dengar kata, lalu pilih tulisan yang cocok.',
    emoji: '📖',
    color: 'from-amber-400 to-orange-500',
  },
  {
    to: '/kuis/kalimat',
    tahap: 'kalimat',
    step: 'Tahap 4',
    title: 'Kuis Kalimat',
    description: 'Dengar kalimat, lalu pilih tulisan yang sesuai.',
    emoji: '✨',
    color: 'from-emerald-400 to-teal-500',
  },
]

/** ⭐ count from best ratio — same threshold as QuizResult */
function starsFor(best: number, total: number) {
  const r = total ? best / total : 0
  if (r >= 0.9) return 3
  if (r >= 0.6) return 2
  if (r >= 0.3) return 1
  return 0
}
</script>

<template>
  <main class="flex-1 pb-12">
    <AppHeader title="Mode Kuis 🎯" subtitle="Pilih kategori kuis yang mau dimainkan" />

    <section class="px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
        <HomeMenuCard
          v-for="(c, i) in categories"
          :key="c.to"
          :to="c.to"
          :step="c.step"
          :title="c.title"
          :description="c.description"
          :emoji="c.emoji"
          :color="c.color"
          :delay="i * 100"
        >
          <template #badge>
            <ClientOnly>
              <span
                v-if="getBest(c.tahap)"
                class="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-slate-700 shadow"
                :title="`${getBest(c.tahap)!.plays} kali main`"
              >
                <span class="text-amber-500">
                  {{ '⭐'.repeat(starsFor(getBest(c.tahap)!.best, getBest(c.tahap)!.total)) || '☆' }}
                </span>
                {{ getBest(c.tahap)!.best }}/{{ getBest(c.tahap)!.total }}
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 rounded-full bg-white/30 px-3 py-1 text-xs font-bold text-white/80"
              >
                Belum dimainkan
              </span>
            </ClientOnly>
          </template>
        </HomeMenuCard>
      </div>

      <p class="mt-10 text-center text-sm text-slate-500">
        💡 Setiap kuis berisi 10 pertanyaan acak — coba lagi untuk soal baru.
      </p>
    </section>
  </main>
</template>
