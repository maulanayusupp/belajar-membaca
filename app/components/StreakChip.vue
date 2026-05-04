<script setup lang="ts">
/**
 * Chip kecil menampilkan streak hari berturut. Hanya tampil saat streak > 0.
 * Klik → `/penghargaan`.
 */
const { current, isActive } = useStreak()
const visible = computed(() => current.value > 0)
const flameClass = computed(() => (isActive() ? 'opacity-100' : 'opacity-50 grayscale'))
</script>

<template>
  <NuxtLink
    v-if="visible"
    to="/penghargaan"
    class="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur shadow-md ring-1 ring-amber-200 px-3 py-1.5 font-bold text-sm text-amber-700 hover:bg-white transition-all"
    :title="isActive() ? 'Streak aktif!' : 'Streak terputus — main lagi yuk!'"
  >
    <span class="text-base" :class="flameClass">🔥</span>
    <span>{{ current }} hari</span>
  </NuxtLink>
</template>
