<script setup lang="ts">
interface Props {
  current: number
  total: number
  /** Show "Selesai" instead of "Lanjut" on the last item */
  finishLabel?: string
}

withDefaults(defineProps<Props>(), { finishLabel: 'Selesai 🎉' })

const emit = defineEmits<{ prev: []; next: [] }>()
</script>

<template>
  <div class="flex items-center justify-between gap-3 max-w-2xl mx-auto px-2">
    <button
      type="button"
      class="btn-pill bg-white text-slate-700 ring-1 ring-slate-200 px-5 py-3 disabled:opacity-40"
      :disabled="current === 0"
      @click="emit('prev')"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Sebelum
    </button>

    <div class="text-sm font-bold text-slate-500">
      {{ current + 1 }} / {{ total }}
    </div>

    <button
      type="button"
      class="btn-pill bg-gradient-to-br from-sun-300 to-sun-400 text-white px-5 py-3"
      @click="emit('next')"
    >
      <template v-if="current < total - 1">
        Lanjut
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </template>
      <template v-else>
        {{ finishLabel }}
      </template>
    </button>
  </div>
</template>
