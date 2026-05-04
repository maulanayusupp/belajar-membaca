<script setup lang="ts">
/**
 * Bita — mascot maskot ramah anak.
 *
 * Bentuk dasar (badan + telinga + pipi) selalu sama. Hanya **mata** dan
 * **mulut** yang berubah berdasarkan `expression`. Ditambah dekorasi
 * (sparkle, tetesan air mata) di state tertentu.
 *
 * Pakai `viewBox` 200×200 — caller cukup set `size` untuk penampilan.
 */

export type MascotExpression = 'idle' | 'happy' | 'excited' | 'sad' | 'cheer'

interface Props {
  expression?: MascotExpression
  /** Pixel size — width = height (square box) */
  size?: number
  /** Disable the gentle idle bounce */
  noBounce?: boolean
  /** Optional accessible label */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  expression: 'idle',
  size: 160,
  noBounce: false,
})

const animClass = computed(() => {
  if (props.noBounce) return ''
  if (props.expression === 'cheer') return 'animate-wiggle'
  if (props.expression === 'sad') return ''
  return 'animate-bounce-soft'
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
    class="select-none drop-shadow-lg"
    :class="animClass"
    role="img"
    :aria-label="label ?? `Bita ${expression}`"
  >
    <defs>
      <radialGradient id="mascotBody" cx="50%" cy="40%" r="65%">
        <stop offset="0%"   stop-color="#fed7aa"/>
        <stop offset="60%"  stop-color="#fb923c"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </radialGradient>
      <radialGradient id="mascotEar" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="#fdba74"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </radialGradient>
    </defs>

    <!-- Hands raised (cheer pose) -->
    <template v-if="expression === 'cheer'">
      <g>
        <ellipse cx="32"  cy="92"  rx="14" ry="12" fill="url(#mascotEar)"/>
        <ellipse cx="168" cy="92"  rx="14" ry="12" fill="url(#mascotEar)"/>
      </g>
    </template>

    <!-- Ears -->
    <g>
      <ellipse cx="55"  cy="58" rx="22" ry="26" fill="url(#mascotEar)"/>
      <ellipse cx="145" cy="58" rx="22" ry="26" fill="url(#mascotEar)"/>
      <ellipse cx="55"  cy="62" rx="11" ry="14" fill="#f9a8d4"/>
      <ellipse cx="145" cy="62" rx="11" ry="14" fill="#f9a8d4"/>
    </g>

    <!-- Body / head -->
    <ellipse cx="100" cy="115" rx="78" ry="72" fill="url(#mascotBody)"/>

    <!-- Cheek blush -->
    <ellipse cx="55"  cy="130" rx="14" ry="9" fill="#f9a8d4" opacity="0.75"/>
    <ellipse cx="145" cy="130" rx="14" ry="9" fill="#f9a8d4" opacity="0.75"/>

    <!-- Eyes -->
    <!-- idle / excited / sad — open round eyes (sad ones droop) -->
    <template v-if="expression === 'idle' || expression === 'excited'">
      <circle cx="78"  cy="105" r="10" fill="#0f172a"/>
      <circle cx="122" cy="105" r="10" fill="#0f172a"/>
      <circle cx="81"  cy="101" r="3.5" fill="#ffffff"/>
      <circle cx="125" cy="101" r="3.5" fill="#ffffff"/>
      <!-- excited: extra eyebrows up -->
      <template v-if="expression === 'excited'">
        <path d="M 68 88 Q 78 82 88 88"  stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 112 88 Q 122 82 132 88" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
      </template>
    </template>

    <!-- happy / cheer — closed crescent eyes ^_^ -->
    <template v-else-if="expression === 'happy' || expression === 'cheer'">
      <path d="M 68 108 Q 78 96 88 108"   stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 112 108 Q 122 96 132 108" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
    </template>

    <!-- sad — droopy ovals + tear -->
    <template v-else-if="expression === 'sad'">
      <ellipse cx="78"  cy="108" rx="6" ry="9" fill="#0f172a" transform="rotate(20 78 108)"/>
      <ellipse cx="122" cy="108" rx="6" ry="9" fill="#0f172a" transform="rotate(-20 122 108)"/>
      <path d="M 132 116 Q 138 124 134 132 Q 130 124 132 116 Z" fill="#7dd3fc"/>
    </template>

    <!-- Mouth -->
    <template v-if="expression === 'idle'">
      <path d="M 85 138 Q 100 148 115 138" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
    </template>
    <template v-else-if="expression === 'happy'">
      <path d="M 80 134 Q 100 156 120 134" stroke="#0f172a" stroke-width="5" fill="#fff1f2" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="expression === 'excited'">
      <ellipse cx="100" cy="142" rx="14" ry="11" fill="#0f172a"/>
      <ellipse cx="100" cy="148" rx="9" ry="5" fill="#fb7185"/>
    </template>
    <template v-else-if="expression === 'sad'">
      <path d="M 86 146 Q 100 138 114 146" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
    </template>
    <template v-else-if="expression === 'cheer'">
      <path d="M 75 132 Q 100 162 125 132 Q 100 152 75 132 Z" fill="#0f172a"/>
      <ellipse cx="100" cy="148" rx="11" ry="5" fill="#fb7185"/>
    </template>

    <!-- Sparkles around the head when excited / cheer -->
    <template v-if="expression === 'excited' || expression === 'cheer'">
      <g class="animate-sparkle" style="transform-origin: 30px 40px;">
        <path d="M 30 30 L 33 38 L 41 40 L 33 42 L 30 50 L 27 42 L 19 40 L 27 38 Z" fill="#fde047"/>
      </g>
      <g class="animate-sparkle" style="transform-origin: 170px 40px; animation-delay: 0.4s;">
        <path d="M 170 30 L 173 38 L 181 40 L 173 42 L 170 50 L 167 42 L 159 40 L 167 38 Z" fill="#fde047"/>
      </g>
      <g class="animate-sparkle" style="transform-origin: 100px 16px; animation-delay: 0.8s;">
        <circle cx="100" cy="16" r="4" fill="#fde047"/>
      </g>
    </template>
  </svg>
</template>
