<script setup lang="ts">
import { LESSON_META, formatDateID } from '~/data/lesson-meta'
import { downloadSvg } from '~/utils/downloadSvg'

const route = useRoute()
const tahapKey = computed(() => route.params.tahap as string)
const meta = computed(() => LESSON_META[tahapKey.value])

if (!meta.value) {
  throw createError({ statusCode: 404, statusMessage: 'Sertifikat tidak ditemukan', fatal: true })
}

useSiteSeo({
  title: `Sertifikat ${meta.value.certTitle}`,
  description: `Sertifikat kehebatan setelah menyelesaikan ${meta.value.certTitle} di Belajar Membaca.`,
})

const { childName, setName } = useChildName()
const { completed } = useProgress(meta.value.progressKey)

const isComplete = computed(() => completed.value.length >= meta.value.total)
const dateStr = ref(formatDateID())

// Snapshot tanggal di mount supaya tidak ganti saat user revisit hari berikutnya.
// Idealnya kita simpan tanggal completion ke localStorage juga, tapi tahap ini
// belum ada — jadi gunakan tanggal saat halaman dibuka pertama kali.
onMounted(() => {
  dateStr.value = formatDateID()
})

const nameInput = ref('')
watch(childName, (v) => (nameInput.value = v), { immediate: true })

function saveName() {
  setName(nameInput.value)
}

function onDownload() {
  // Ambil SVG dari DOM — lebih reliable daripada chain ref ke child component
  const svg = document.querySelector<SVGElement>('#cert-print-area svg')
  if (!svg) return
  const safeName = (childName.value || 'anak').replace(/\s+/g, '-')
  downloadSvg(svg, `Sertifikat-${tahapKey.value}-${safeName}.svg`)
}

function onPrint() {
  // Browser native print — tata letak diatur via @media print di style block
  window.print()
}
</script>

<template>
  <main class="flex-1 pb-12 print:pb-0">
    <div class="print:hidden">
      <AppHeader
        :title="`Sertifikat — ${meta.certTitle}`"
        subtitle="Cetak atau download untuk kenang-kenangan"
        :back-to="meta.lessonPath"
      />
    </div>

    <section class="px-4 sm:px-8 max-w-5xl mx-auto w-full mt-2">
      <!-- Belum selesai — guard -->
      <ClientOnly>
        <div
          v-if="!isComplete"
          class="card-soft bg-white p-8 text-center max-w-xl mx-auto print:hidden"
        >
          <Mascot expression="idle" :size="120" class="mx-auto" />
          <h2 class="heading-fun text-2xl text-slate-800 mt-3">
            Tahap belum selesai
          </h2>
          <p class="mt-2 text-slate-600">
            Selesaikan dulu semua materi di
            <NuxtLink :to="meta.lessonPath" class="font-bold text-amber-600 underline">
              {{ meta.certTitle }}
            </NuxtLink>
            untuk membuka sertifikat. Sudah {{ completed.length }} dari {{ meta.total }}.
          </p>
        </div>

        <!-- Selesai — tampilkan cert -->
        <template v-else>
          <!-- Form nama (selalu tampak supaya bisa diubah) -->
          <div class="card-soft bg-white p-4 sm:p-5 mb-5 max-w-2xl mx-auto print:hidden">
            <label class="block text-sm font-bold text-slate-700 mb-2">
              ✏️ Nama yang muncul di sertifikat
            </label>
            <div class="flex gap-2 flex-wrap">
              <input
                v-model="nameInput"
                type="text"
                placeholder="Tulis namamu di sini"
                maxlength="30"
                class="flex-1 min-w-[180px] rounded-full bg-slate-50 ring-1 ring-slate-200 px-4 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                @keydown.enter="saveName"
              />
              <button
                type="button"
                class="btn-pill bg-gradient-to-br from-sun-300 to-sun-500 text-white px-5 py-2"
                @click="saveName"
              >
                Simpan
              </button>
            </div>
            <p v-if="!childName" class="mt-2 text-xs text-slate-500">
              Tulis nama lalu tekan Simpan — sertifikat akan otomatis update.
            </p>
          </div>

          <!-- Sertifikat -->
          <div id="cert-print-area" class="bg-white rounded-2xl overflow-hidden">
            <Certificate
              :tahap-key="tahapKey"
              :tahap-title="meta.certTitle"
              :child-name="childName"
              :date-str="dateStr"
            />
          </div>

          <!-- Aksi -->
          <div class="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
            <button
              type="button"
              class="btn-pill bg-gradient-to-br from-emerald-400 to-teal-500 text-white px-6 py-3 text-lg"
              @click="onDownload"
            >
              ⬇️ Download SVG
            </button>
            <button
              type="button"
              class="btn-pill bg-gradient-to-br from-sky-400 to-blue-500 text-white px-6 py-3 text-lg"
              @click="onPrint"
            >
              🖨️ Print / PDF
            </button>
            <NuxtLink
              :to="meta.lessonPath"
              class="btn-pill bg-white text-slate-700 ring-1 ring-slate-200 px-6 py-3 text-lg"
            >
              Kembali ke pelajaran
            </NuxtLink>
          </div>
        </template>
      </ClientOnly>
    </section>
  </main>
</template>

<style scoped>
/* Saat print, sembunyikan UI lain dan biarkan hanya area sertifikat. */
@media print {
  :global(body) {
    background: white !important;
  }
  #cert-print-area {
    box-shadow: none;
  }
}
</style>
