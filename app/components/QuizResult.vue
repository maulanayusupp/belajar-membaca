<script setup lang="ts">
interface Props {
  score: number
  total: number
  /** Set true ketika skor ini memecahkan rekor sebelumnya — beri sparkle */
  isNewBest?: boolean
  /** Skor terbaik sebelumnya — null/undefined = belum pernah bermain */
  previousBest?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ retry: [] }>()

const ratio = computed(() => (props.total ? props.score / props.total : 0))

const stars = computed(() => {
  if (ratio.value >= 0.9) return 3
  if (ratio.value >= 0.6) return 2
  if (ratio.value >= 0.3) return 1
  return 0
})

const message = computed(() => {
  if (ratio.value >= 0.9) return 'Luar biasa! 🌟'
  if (ratio.value >= 0.7) return 'Hebat! Terus latihan 💪'
  if (ratio.value >= 0.5) return 'Bagus! Ayo coba lagi 😊'
  return 'Jangan menyerah, pasti bisa! 💖'
})

// Hanya tampil kalau anak pernah main sebelumnya — supaya pertama kali
// tidak salah ngasih kesan "rekor" untuk satu-satunya skor yang ada.
const showNewBestBadge = computed(
  () => props.isNewBest && (props.previousBest ?? -1) >= 0,
)

// Pilih ekspresi Bita sesuai performa.
const mascotExpression = computed(() => {
  if (stars.value === 3) return 'cheer' as const
  if (stars.value === 2) return 'happy' as const
  if (stars.value === 1) return 'idle' as const
  return 'sad' as const
})
</script>

<template>
  <div
    class="card-soft p-8 sm:p-12 max-w-lg mx-auto text-center bg-gradient-to-br from-amber-300 to-orange-500 animate-pop-in relative overflow-hidden"
  >
    <!-- Rekor baru ribbon -->
    <div
      v-if="showNewBestBadge"
      class="absolute -top-1 -right-12 rotate-45 bg-rose-500 text-white text-xs font-extrabold tracking-widest px-12 py-1 shadow-lg uppercase"
    >
      🏆 Rekor!
    </div>

    <!-- Bita memberikan reaksi -->
    <div class="flex justify-center mb-2">
      <Mascot :expression="mascotExpression" :size="140" />
    </div>

    <div class="flex justify-center gap-3 mb-3">
      <span
        v-for="i in 3"
        :key="i"
        class="text-5xl sm:text-6xl drop-shadow-lg"
        :class="i <= stars ? 'animate-sparkle' : 'opacity-30 grayscale'"
        :style="{ animationDelay: `${i * 200}ms` }"
      >
        ⭐
      </span>
    </div>

    <p class="font-display font-extrabold text-5xl sm:text-7xl text-white text-shadow-pop mb-2 leading-none">
      {{ score }} <span class="opacity-80 text-3xl sm:text-5xl">/ {{ total }}</span>
    </p>

    <p class="mt-3 text-white text-xl sm:text-2xl font-bold text-shadow-pop">
      {{ message }}
    </p>

    <p
      v-if="showNewBestBadge"
      class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-extrabold text-rose-600 animate-bounce-soft"
    >
      🎉 Rekor baru! Sebelumnya {{ previousBest }}/{{ total }}
    </p>
    <p
      v-else-if="(previousBest ?? -1) >= 0"
      class="mt-3 text-sm font-semibold text-white/90 text-shadow-pop"
    >
      Skor terbaikmu: {{ previousBest }}/{{ total }}
    </p>

    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="btn-pill bg-white text-slate-800 px-6 py-3 text-lg"
        @click="emit('retry')"
      >
        🔄 Coba lagi
      </button>
      <NuxtLink
        to="/kuis"
        class="btn-pill bg-white/95 text-slate-800 px-6 py-3 text-lg"
      >
        🎯 Pilih kuis lain
      </NuxtLink>
      <NuxtLink
        to="/"
        class="btn-pill bg-white/80 text-slate-700 px-6 py-3 text-lg"
      >
        🏠 Beranda
      </NuxtLink>
    </div>
  </div>
</template>
