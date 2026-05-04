<script setup lang="ts">
/**
 * Decorative animated background — 8 floating pastel shapes with random delays.
 * Pure CSS, no JS animation loop, so it stays cheap.
 */
const shapes = [
  { emoji: '⭐', top: '8%',  left: '6%',  delay: '0s',   size: 'text-4xl' },
  { emoji: '🌈', top: '14%', left: '88%', delay: '0.6s', size: 'text-5xl' },
  { emoji: '☁️', top: '70%', left: '4%',  delay: '1.2s', size: 'text-5xl' },
  { emoji: '✨', top: '40%', left: '92%', delay: '1.8s', size: 'text-3xl' },
  { emoji: '🎈', top: '78%', left: '90%', delay: '0.3s', size: 'text-5xl' },
  { emoji: '🌟', top: '30%', left: '12%', delay: '2s',   size: 'text-3xl' },
  { emoji: '☀️', top: '55%', left: '50%', delay: '0.9s', size: 'text-4xl' },
  { emoji: '💫', top: '88%', left: '40%', delay: '1.5s', size: 'text-3xl' },
]
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <span
      v-for="(s, i) in shapes"
      :key="i"
      class="absolute opacity-50 animate-float"
      :class="s.size"
      :style="{ top: s.top, left: s.left, animationDelay: s.delay }"
    >
      {{ s.emoji }}
    </span>
  </div>
</template>
