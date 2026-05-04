<script setup lang="ts">
interface Props {
  score: number
  total: number
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
</script>

<template>
  <div
    class="card-soft p-8 sm:p-12 max-w-lg mx-auto text-center bg-gradient-to-br from-amber-300 to-orange-500 animate-pop-in"
  >
    <div class="flex justify-center gap-3 mb-5">
      <span
        v-for="i in 3"
        :key="i"
        class="text-6xl sm:text-7xl drop-shadow-lg"
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
