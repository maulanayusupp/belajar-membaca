<script setup lang="ts">
/**
 * Banner status suara di home — gabungan diagnostik + warning.
 *
 * Tiga state yang ditampilkan:
 *   1. Belum ready  → "Mendeteksi suara…"
 *   2. Voice ID ada → chip kecil OK + tombol Tes Suara + selector
 *   3. Voice ID tidak ada → warning + panduan instalasi
 */
const {
  supported,
  ready,
  speaking,
  hasIndonesianVoice,
  voice,
  voiceCount,
  indonesianVoices,
  setVoice,
  speak,
} = useSpeech()

const expanded = ref(false)

async function testSound() {
  await speak('Halo! Aku Bita.')
}

function onVoiceChange(e: Event) {
  const name = (e.target as HTMLSelectElement).value
  setVoice(name)
  testSound()
}
</script>

<template>
  <!-- Browser tidak support speech sama sekali -->
  <div
    v-if="!supported"
    class="card-soft mx-auto my-4 max-w-3xl border-l-4 border-rose-400 bg-rose-50/95 p-4 text-sm text-rose-900"
    role="status"
  >
    <p class="font-bold">🚫 Browser ini tidak mendukung suara</p>
    <p class="mt-1">Coba buka di Chrome, Safari, Edge, atau Firefox versi terbaru.</p>
  </div>

  <!-- Belum ready (voice list belum loaded) -->
  <div
    v-else-if="!ready"
    class="card-soft mx-auto my-4 max-w-3xl bg-slate-50/90 p-3 text-xs text-slate-600 ring-1 ring-slate-200"
  >
    <p>⏳ Mendeteksi suara… ({{ voiceCount }} voice ditemukan)</p>
  </div>

  <!-- Voice ID tidak ada -->
  <div
    v-else-if="!hasIndonesianVoice"
    class="card-soft mx-auto my-4 max-w-3xl border-l-4 border-amber-400 bg-amber-50/95 p-4 text-sm text-amber-900"
    role="status"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl" aria-hidden="true">🔇</span>
      <div class="flex-1">
        <p class="font-bold">
          Suara bahasa Indonesia belum tersedia di perangkat ini
        </p>
        <p class="mt-1 leading-relaxed">
          Aplikasi tetap bisa dipakai, tapi tombol suara akan diam.
          Total {{ voiceCount }} voice terdeteksi tapi tidak ada yang bahasa Indonesia.
        </p>
        <button
          type="button"
          class="mt-2 inline-flex items-center gap-1 font-bold underline underline-offset-2"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Sembunyikan' : 'Cara memasang' }}
        </button>
        <div v-if="expanded" class="mt-3 space-y-2 text-amber-800">
          <p><b>Mac:</b> System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → centang <i>Damayanti (Indonesian)</i> → Apply.</p>
          <p><b>Windows:</b> Settings → Time &amp; Language → Speech → Add voices → pilih <i>Indonesian</i>.</p>
          <p><b>Android:</b> Settings → System → Languages &amp; input → Text-to-speech output → install paket <i>Bahasa Indonesia</i>.</p>
          <p><b>iOS:</b> Settings → Accessibility → Spoken Content → Voices → Bahasa Indonesia.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Voice ID ada — chip diagnostik + tombol tes + selector -->
  <div
    v-else
    class="mx-auto my-3 max-w-3xl flex items-center justify-center gap-2 flex-wrap text-xs"
  >
    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-3 py-1 font-bold text-emerald-700">
      ✓ Suara siap
    </span>
    <select
      v-if="indonesianVoices.length > 1"
      :value="voice?.name"
      :disabled="speaking"
      class="rounded-full bg-white ring-1 ring-slate-200 px-3 py-1 font-mono text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      @change="onVoiceChange"
    >
      <option v-for="v in indonesianVoices" :key="v.name" :value="v.name">
        {{ v.name }} ({{ v.lang }}){{ v.localService === false ? ' [online]' : '' }}
      </option>
    </select>
    <span v-else class="font-mono text-slate-700">{{ voice?.name }}</span>
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-slate-200 px-3 py-1 font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
      :disabled="speaking"
      @click="testSound"
    >
      🔊 {{ speaking ? 'Memutar…' : 'Tes Suara' }}
    </button>
  </div>
</template>
