<script setup lang="ts">
const menus = [
  {
    to: '/huruf',
    step: 'Tahap 1',
    title: 'Huruf',
    description: 'Kenalan dengan A sampai Z, dengar bunyinya, lihat contoh.',
    emoji: '🔤',
    color: 'from-rose-400 to-pink-500',
  },
  {
    to: '/suku-kata',
    step: 'Tahap 2',
    title: 'Suku Kata',
    description: 'Gabungkan huruf jadi ba-bi-bu-be-bo, ma-mi-mu-me-mo.',
    emoji: '🎵',
    color: 'from-sky-400 to-blue-500',
  },
  {
    to: '/kata',
    step: 'Tahap 3',
    title: 'Kata',
    description: 'Baca kata sederhana: mama, papa, bola, susu.',
    emoji: '📖',
    color: 'from-amber-400 to-orange-500',
  },
  {
    to: '/kalimat',
    step: 'Tahap 4',
    title: 'Kalimat',
    description: 'Susun kata jadi kalimat: "Ini ibu", "Itu bola".',
    emoji: '✨',
    color: 'from-emerald-400 to-teal-500',
  },
]
</script>

<template>
  <main class="flex-1 px-4 pb-12 pt-6 sm:px-8 sm:pt-10 max-w-5xl mx-auto w-full">
    <!-- Hero -->
    <section class="text-center mb-8 sm:mb-12 animate-slide-up">
      <div class="inline-flex items-center gap-3 mb-3">
        <span class="text-6xl sm:text-7xl animate-wiggle inline-block">📚</span>
        <span class="text-6xl sm:text-7xl animate-bounce-soft inline-block">🌟</span>
      </div>
      <h1 class="heading-fun text-4xl sm:text-6xl text-slate-800 leading-tight">
        Yuk, Belajar
        <span class="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
          Membaca!
        </span>
      </h1>
      <p class="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
        Pilih tahapan di bawah. Mulai dari yang paling mudah ya 👇
      </p>
    </section>

    <ClientOnly>
      <VoiceWarningBanner />
    </ClientOnly>

    <!-- Menu grid -->
    <section class="grid sm:grid-cols-2 gap-4 sm:gap-6">
      <HomeMenuCard
        v-for="(m, i) in menus"
        :key="m.to"
        v-bind="m"
        :delay="i * 100"
      />
    </section>

    <!-- Footer note -->
    <footer class="mt-12 text-center text-sm text-slate-500">
      <p>💡 Tips: Latihan 10–15 menit setiap hari, lebih baik daripada 1 jam tapi jarang.</p>
    </footer>
  </main>
</template>
