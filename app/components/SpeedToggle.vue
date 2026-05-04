<script setup lang="ts">
const { speedMultiplier, setSpeed, speak } = useSpeech()

interface SpeedOption {
  v: number
  emoji: string
  label: string
  /** Spoken when this speed is picked, so the child hears the result */
  preview: string
}

const speeds: SpeedOption[] = [
  { v: 0.7, emoji: '🐢', label: 'Pelan',  preview: 'pelan' },
  { v: 1.0, emoji: '🚶', label: 'Normal', preview: 'normal' },
  { v: 1.3, emoji: '🐇', label: 'Cepat',  preview: 'cepat' },
]

function pick(opt: SpeedOption) {
  setSpeed(opt.v)
  // small audible confirmation in the new speed
  speak(opt.preview)
}
</script>

<template>
  <div
    class="inline-flex rounded-full bg-white/95 backdrop-blur shadow-lg ring-1 ring-slate-200 p-1"
    role="radiogroup"
    aria-label="Kecepatan suara"
  >
    <button
      v-for="s in speeds"
      :key="s.v"
      type="button"
      role="radio"
      :aria-checked="speedMultiplier === s.v"
      :aria-label="`Kecepatan ${s.label}`"
      class="px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-sm transition-all active:scale-95"
      :class="
        speedMultiplier === s.v
          ? 'bg-gradient-to-br from-sun-300 to-sun-500 text-white shadow'
          : 'text-slate-500 hover:bg-slate-100'
      "
      @click="pick(s)"
    >
      <span class="mr-1">{{ s.emoji }}</span>
      <span class="hidden sm:inline">{{ s.label }}</span>
    </button>
  </div>
</template>
