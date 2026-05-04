<script setup lang="ts">
const { supported, ready, hasIndonesianVoice } = useSpeech()

// Only show after voice detection has actually run on the client.
const visible = computed(() => ready.value && supported.value && !hasIndonesianVoice.value)

const expanded = ref(false)
</script>

<template>
  <div
    v-if="visible"
    class="card-soft mx-auto my-4 max-w-3xl border-l-4 border-amber-400 bg-amber-50/90 p-4 text-sm text-amber-900"
    role="status"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl" aria-hidden="true">🔇</span>
      <div class="flex-1">
        <p class="font-bold">Suara bahasa Indonesia belum tersedia di perangkat ini</p>
        <p class="mt-1 leading-relaxed">
          Aplikasi tetap bisa dipakai, tapi tombol suara akan diam.
          Pasang suara Indonesia agar pelafalan benar.
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
          <p><b>Chrome desktop:</b> biasanya sudah otomatis dapat <i>Google Bahasa Indonesia</i> setelah refresh.</p>
        </div>
      </div>
    </div>
  </div>
</template>
