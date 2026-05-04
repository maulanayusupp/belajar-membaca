<script setup lang="ts">
import { ACHIEVEMENTS } from '~/data/achievements'

useSiteSeo({
  title: 'Penghargaan',
  description: 'Lihat lencana yang sudah kamu kumpulkan dan berapa hari berturut-turut kamu belajar membaca.',
})

const { current, longest, lastPlayDate, isActive } = useStreak()
const { isUnlocked } = useAchievements()

const unlockedCount = computed(
  () => ACHIEVEMENTS.filter((a) => isUnlocked(a.id)).length,
)

const dateLabel = computed(() => {
  if (!lastPlayDate.value) return 'Belum pernah'
  const d = new Date(`${lastPlayDate.value}T00:00:00`)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<template>
  <main class="flex-1 pb-12">
    <AppHeader title="Penghargaan 🏆" subtitle="Lencana dan streak harianmu" />

    <ClientOnly>
      <section class="px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <!-- Streak overview card -->
        <div
          class="card-soft bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 p-6 sm:p-8 text-white relative overflow-hidden"
        >
          <div class="flex items-center gap-5 sm:gap-8 flex-wrap">
            <div class="text-7xl sm:text-8xl drop-shadow-lg" :class="!isActive() && 'opacity-50 grayscale'">🔥</div>
            <div class="flex-1 min-w-[200px]">
              <p class="text-xs uppercase tracking-widest font-bold opacity-90">
                Streak Saat Ini
              </p>
              <p class="font-display font-extrabold text-5xl sm:text-7xl text-shadow-pop leading-none">
                {{ current }} <span class="text-2xl sm:text-3xl">hari</span>
              </p>
              <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <p>🏅 Rekor: <b>{{ longest }} hari</b></p>
                <p>🗓️ Terakhir main: <b>{{ dateLabel }}</b></p>
              </div>
              <p v-if="!isActive() && current > 0" class="mt-2 text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full">
                ⚠️ Streak terputus — main hari ini untuk mulai lagi!
              </p>
            </div>
          </div>
        </div>

        <!-- Badges -->
        <div class="mt-6 sm:mt-8 flex items-center justify-between flex-wrap gap-2">
          <h2 class="heading-fun text-2xl text-slate-800">
            Lencana ({{ unlockedCount }} / {{ ACHIEVEMENTS.length }})
          </h2>
          <p class="text-sm text-slate-500">
            Selesaikan tantangan untuk membuka lencana baru
          </p>
        </div>

        <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="(badge, i) in ACHIEVEMENTS"
            :key="badge.id"
            class="card-soft p-4 text-center transition-transform animate-pop-in"
            :class="
              isUnlocked(badge.id)
                ? `bg-gradient-to-br ${badge.color} text-white hover:-translate-y-1`
                : 'bg-white text-slate-400'
            "
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div
              class="text-5xl sm:text-6xl drop-shadow-lg"
              :class="!isUnlocked(badge.id) && 'grayscale opacity-40'"
            >
              {{ isUnlocked(badge.id) ? badge.emoji : '🔒' }}
            </div>
            <p
              class="mt-2 font-display font-extrabold text-base sm:text-lg leading-tight"
              :class="isUnlocked(badge.id) && 'text-shadow-pop'"
            >
              {{ badge.title }}
            </p>
            <p
              class="text-xs sm:text-sm mt-1 leading-snug"
              :class="isUnlocked(badge.id) ? 'opacity-95' : 'opacity-80'"
            >
              {{ badge.description }}
            </p>
          </div>
        </div>
      </section>
    </ClientOnly>
  </main>
</template>
