<script setup lang="ts">
/**
 * Celebration confetti — emits ~80 colorful pieces falling from the top.
 * Self-cleaning: pieces are unmounted after 3.2s.
 */
interface Props {
  /** When this counter increments, a new burst is played. */
  trigger: number
}

const props = defineProps<Props>()

interface Piece {
  id: number
  left: string
  delay: string
  duration: string
  bg: string
  rotate: string
}

const pieces = ref<Piece[]>([])

const palette = [
  '#fbbf24',
  '#f87171',
  '#60a5fa',
  '#34d399',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
  '#fde047',
]

watch(
  () => props.trigger,
  (n) => {
    if (!n) return
    const batch: Piece[] = []
    for (let i = 0; i < 80; i++) {
      batch.push({
        id: Date.now() + i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 0.4 + 's',
        duration: 2.4 + Math.random() * 1 + 's',
        bg: palette[i % palette.length] ?? '#fbbf24',
        rotate: Math.random() * 360 + 'deg',
      })
    }
    pieces.value = batch
    setTimeout(() => (pieces.value = []), 3500)
  },
)
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
    <span
      v-for="p in pieces"
      :key="p.id"
      class="absolute -top-4 w-2.5 h-3 rounded-sm"
      :style="{
        left: p.left,
        background: p.bg,
        transform: `rotate(${p.rotate})`,
        animation: `confetti ${p.duration} cubic-bezier(0.2,0.6,0.4,1) ${p.delay} forwards`,
      }"
    />
  </div>
</template>
