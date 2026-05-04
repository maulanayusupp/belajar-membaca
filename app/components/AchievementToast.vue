<script setup lang="ts">
import type { AchievementDef } from '~/data/achievements'

/**
 * Toast global yang menampilkan badge baru yang baru saja di-unlock.
 * Pasang sekali di app.vue. Memantau `pendingToasts`, tampilkan satu-per-satu
 * dengan auto-dismiss 4 detik + animasi pop-in.
 */
const { pendingToasts, popToast } = useAchievements()
const { speak } = useSpeech()

const visible = ref<AchievementDef | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

function showNext() {
  if (visible.value) return
  const next = popToast()
  if (!next) return
  visible.value = next
  speak('Hebat! Kamu dapat lencana baru!')
  timer = setTimeout(() => {
    visible.value = null
    timer = null
    // Coba tampilkan badge berikutnya kalau masih ada di queue
    setTimeout(showNext, 350)
  }, 4000)
}

watch(
  () => pendingToasts.value.length,
  (n) => {
    if (n > 0) showNext()
  },
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

function dismiss() {
  if (timer) clearTimeout(timer)
  visible.value = null
  setTimeout(showNext, 200)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="-translate-y-12 opacity-0"
    leave-active-class="transition duration-200"
    leave-to-class="-translate-y-12 opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]"
    >
      <button
        type="button"
        class="block w-full text-left card-soft bg-gradient-to-br p-4 text-white shadow-2xl ring-2 ring-white animate-pop-in"
        :class="visible.color"
        @click="dismiss"
      >
        <div class="flex items-center gap-3">
          <span class="text-5xl drop-shadow-lg animate-wiggle">{{ visible.emoji }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold uppercase tracking-widest opacity-90">
              🏆 Lencana Baru
            </p>
            <p class="font-display font-extrabold text-xl text-shadow-pop truncate">
              {{ visible.title }}
            </p>
            <p class="text-sm opacity-95 line-clamp-2">{{ visible.description }}</p>
          </div>
        </div>
      </button>
    </div>
  </Transition>
</template>
