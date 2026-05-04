<script setup lang="ts">
/**
 * Sertifikat SVG — 1200×900, semua style inline supaya hasil download bisa
 * dibuka & di-print di app apapun tanpa font/CSS eksternal.
 */
interface Props {
  /** Tahap key (huruf, suku-kata, kata, kalimat) — untuk filename */
  tahapKey: string
  /** Judul tahap di sertifikat (e.g., "Tahap 1: Huruf") */
  tahapTitle: string
  /** Nama anak (boleh kosong — placeholder garis underline) */
  childName: string
  /** Tanggal selesai dalam format Indonesia, e.g., "4 Mei 2026" */
  dateStr: string
}

const props = defineProps<Props>()

const displayName = computed(() => props.childName.trim() || '____________________')
</script>

<template>
  <svg
    viewBox="0 0 1200 900"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-amber-200"
    role="img"
    :aria-label="`Sertifikat ${tahapTitle} untuk ${childName}`"
  >
    <!-- ============ DEFS ============ -->
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#fffbeb"/>
        <stop offset="50%"  stop-color="#fef3c7"/>
        <stop offset="100%" stop-color="#fde68a"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#fbbf24"/>
        <stop offset="55%"  stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#b45309"/>
        <stop offset="50%"  stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
      <radialGradient id="mascotBody" cx="50%" cy="40%" r="65%">
        <stop offset="0%"   stop-color="#fed7aa"/>
        <stop offset="60%"  stop-color="#fb923c"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </radialGradient>
      <radialGradient id="mascotEar" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="#fdba74"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </radialGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.18"/>
      </filter>
    </defs>

    <!-- ============ BACKGROUND ============ -->
    <rect x="0" y="0" width="1200" height="900" fill="url(#bg)"/>

    <!-- Subtle dotted pattern hint via radial dots in corners -->
    <g opacity="0.18" fill="#f59e0b">
      <circle cx="60"   cy="60"  r="3"/>
      <circle cx="100"  cy="40"  r="2"/>
      <circle cx="40"   cy="120" r="2"/>
      <circle cx="1140" cy="60"  r="3"/>
      <circle cx="1100" cy="40"  r="2"/>
      <circle cx="1160" cy="120" r="2"/>
      <circle cx="60"   cy="840" r="3"/>
      <circle cx="100"  cy="860" r="2"/>
      <circle cx="40"   cy="780" r="2"/>
      <circle cx="1140" cy="840" r="3"/>
      <circle cx="1100" cy="860" r="2"/>
      <circle cx="1160" cy="780" r="2"/>
    </g>

    <!-- ============ BORDERS ============ -->
    <rect x="30"  y="30"  width="1140" height="840" rx="24"
          fill="none" stroke="url(#gold)" stroke-width="6"/>
    <rect x="50"  y="50"  width="1100" height="800" rx="18"
          fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>

    <!-- Corner ornaments — gold stars -->
    <g fill="url(#gold)" filter="url(#softShadow)">
      <path d="M 100 100 L 108 124 L 132 130 L 108 136 L 100 160 L 92 136 L 68 130 L 92 124 Z"/>
      <path d="M 1100 100 L 1108 124 L 1132 130 L 1108 136 L 1100 160 L 1092 136 L 1068 130 L 1092 124 Z"/>
      <path d="M 100 800 L 108 824 L 132 830 L 108 836 L 100 860 L 92 836 L 68 830 L 92 824 Z"/>
      <path d="M 1100 800 L 1108 824 L 1132 830 L 1108 836 L 1100 860 L 1092 836 L 1068 830 L 1092 824 Z"/>
    </g>

    <!-- ============ HEADER ============ -->
    <text x="600" y="170" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-weight="700"
          font-size="28" fill="#92400e" letter-spacing="8">
      ✦ ✦ ✦
    </text>
    <text x="600" y="240" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-weight="900"
          font-size="64" fill="url(#title)" letter-spacing="6"
          filter="url(#softShadow)">
      SERTIFIKAT
    </text>
    <text x="600" y="290" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-weight="700"
          font-size="32" fill="#b45309" letter-spacing="14">
      KEHEBATAN
    </text>
    <line x1="400" y1="320" x2="800" y2="320" stroke="url(#gold)" stroke-width="3" stroke-linecap="round"/>

    <!-- ============ BODY ============ -->
    <text x="600" y="385" text-anchor="middle"
          font-family="Georgia, serif" font-size="26" fill="#475569" font-style="italic">
      Diberikan dengan bangga kepada
    </text>

    <!-- Child name — script-y serif italic for that classic cert feel -->
    <text x="600" y="490" text-anchor="middle"
          font-family="'Brush Script MT', 'Lucida Handwriting', cursive" font-weight="700"
          font-size="84" fill="#0f172a" filter="url(#softShadow)">
      {{ displayName }}
    </text>
    <line x1="240" y1="520" x2="960" y2="520" stroke="#0f172a" stroke-width="2" opacity="0.6"/>

    <text x="600" y="575" text-anchor="middle"
          font-family="Georgia, serif" font-size="26" fill="#475569" font-style="italic">
      atas keberhasilan menyelesaikan
    </text>

    <!-- Tahap title -->
    <text x="600" y="640" text-anchor="middle"
          font-family="Georgia, serif" font-weight="900"
          font-size="42" fill="#b45309" letter-spacing="2"
          filter="url(#softShadow)">
      {{ tahapTitle }}
    </text>

    <!-- ============ BITA mascot (cheer pose) — left side ============ -->
    <g transform="translate(160 670) scale(0.8)" filter="url(#softShadow)">
      <!-- Hands raised -->
      <ellipse cx="32"  cy="92"  rx="14" ry="12" fill="url(#mascotEar)"/>
      <ellipse cx="168" cy="92"  rx="14" ry="12" fill="url(#mascotEar)"/>
      <!-- Ears -->
      <ellipse cx="55"  cy="58" rx="22" ry="26" fill="url(#mascotEar)"/>
      <ellipse cx="145" cy="58" rx="22" ry="26" fill="url(#mascotEar)"/>
      <ellipse cx="55"  cy="62" rx="11" ry="14" fill="#f9a8d4"/>
      <ellipse cx="145" cy="62" rx="11" ry="14" fill="#f9a8d4"/>
      <!-- Body -->
      <ellipse cx="100" cy="115" rx="78" ry="72" fill="url(#mascotBody)"/>
      <!-- Cheeks -->
      <ellipse cx="55"  cy="130" rx="14" ry="9" fill="#f9a8d4" opacity="0.75"/>
      <ellipse cx="145" cy="130" rx="14" ry="9" fill="#f9a8d4" opacity="0.75"/>
      <!-- Eyes — happy crescents -->
      <path d="M 68 108 Q 78 96 88 108"   stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 112 108 Q 122 96 132 108" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Mouth — big grin -->
      <path d="M 75 132 Q 100 162 125 132 Q 100 152 75 132 Z" fill="#0f172a"/>
      <ellipse cx="100" cy="148" rx="11" ry="5" fill="#fb7185"/>
    </g>

    <!-- ============ MEDAL/STAR cluster — right side ============ -->
    <g transform="translate(960 720)" filter="url(#softShadow)">
      <!-- Ribbon -->
      <path d="M -40 -50 L -10 60 L 0 50 L 10 60 L 40 -50 Z" fill="url(#ribbon)"/>
      <!-- Medal circle -->
      <circle cx="0" cy="-50" r="60" fill="url(#gold)" stroke="#92400e" stroke-width="3"/>
      <circle cx="0" cy="-50" r="46" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.6"/>
      <!-- Star inside medal -->
      <path d="M 0 -88 L 11 -56 L 44 -56 L 18 -38 L 28 -10 L 0 -28 L -28 -10 L -18 -38 L -44 -56 L -11 -56 Z"
            fill="#fffbeb" stroke="#92400e" stroke-width="1"/>
    </g>

    <!-- ============ FOOTER ============ -->
    <line x1="600" y1="780" x2="900" y2="780" stroke="#0f172a" stroke-width="1" opacity="0.4"/>
    <text x="750" y="810" text-anchor="middle"
          font-family="Georgia, serif" font-size="18" fill="#475569">
      {{ dateStr }}
    </text>
    <text x="750" y="833" text-anchor="middle"
          font-family="Georgia, serif" font-size="14" fill="#94a3b8" letter-spacing="2">
      Belajar Membaca · Yuk Bisa Baca!
    </text>
  </svg>
</template>
