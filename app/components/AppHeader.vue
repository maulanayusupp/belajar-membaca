<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  /** Show back button. Defaults to true on non-home pages. */
  back?: boolean
  backTo?: string
}

withDefaults(defineProps<Props>(), { back: true, backTo: '/' })
</script>

<template>
  <header class="px-4 pt-4 pb-2 sm:px-8 sm:pt-6 flex items-center gap-3">
    <NuxtLink
      v-if="back"
      :to="backTo"
      class="btn-pill bg-white/80 text-slate-700 ring-1 ring-slate-200 px-3 py-2 hover:bg-white"
      aria-label="Kembali ke beranda"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </NuxtLink>
    <div class="flex-1">
      <h1 class="heading-fun text-2xl sm:text-3xl text-slate-800 leading-tight">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm sm:text-base text-slate-500">{{ subtitle }}</p>
    </div>
    <slot name="right" />
  </header>
</template>
