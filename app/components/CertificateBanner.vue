<script setup lang="ts">
/**
 * Banner perayaan + CTA ke halaman sertifikat. Tampil di bawah lesson nav
 * ketika semua materi sudah dijalani (`completedCount >= total`).
 *
 * Sengaja dibungkus ClientOnly oleh caller — `useProgress` baca localStorage.
 */
interface Props {
  /** Path tahap, misalnya "huruf", "kata" */
  tahapKey: string
  /** Jumlah item sudah selesai */
  completedCount: number
  /** Total item dalam tahap ini */
  total: number
}

const props = defineProps<Props>()

const isUnlocked = computed(() => props.completedCount >= props.total)
</script>

<template>
  <div v-if="isUnlocked" class="max-w-2xl mx-auto px-2 mt-6 animate-pop-in">
    <NuxtLink
      :to="`/sertifikat/${tahapKey}`"
      class="block card-soft bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 p-5 sm:p-6 text-white text-center hover:-translate-y-0.5 transition-transform"
    >
      <div class="flex items-center justify-center gap-4 flex-wrap">
        <Mascot expression="cheer" :size="80" />
        <div class="text-left">
          <p class="text-xs font-bold uppercase tracking-widest opacity-90">
            Selamat! Tahap selesai
          </p>
          <p class="heading-fun text-2xl sm:text-3xl text-shadow-pop">
            🏆 Buka Sertifikatmu
          </p>
          <p class="text-sm opacity-95 mt-0.5">
            Kamu sudah menyelesaikan semua {{ total }} materi.
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
