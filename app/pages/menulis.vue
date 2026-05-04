<script setup lang="ts">
import { letters } from '~/data/letters'
import type { MascotExpression } from '~/components/Mascot.vue'

useSiteSeo({
  title: 'Latihan Menulis Huruf',
  description:
    'Latihan menulis huruf A sampai Z dengan jari atau mouse. Trace di atas garis panduan, dapatkan skor langsung. Bagian dari Belajar Membaca.',
})

const idx = ref(0)
const showConfetti = ref(0)
const { speak } = useSpeech()
const { markDone, completed } = useProgress('tracing-letters')
const { trackEngagement } = useEngagement()

const current = computed(() => letters[idx.value]!)
const completedIdxs = computed(() =>
  letters
    .map((l, i) => (completed.value.includes(l.upper) ? i : -1))
    .filter((i) => i >= 0),
)

const traceRef = ref<InstanceType<typeof import('~/components/TraceCanvas.vue')['default']> | null>(null)

const lastScore = ref<number | null>(null)
const checking = ref(false)

const PASS_THRESHOLD = 0.5

const passed = computed(() => (lastScore.value ?? 0) >= PASS_THRESHOLD)

const mascotExpression = computed<MascotExpression>(() => {
  const s = lastScore.value
  if (s == null) return 'idle'
  if (s >= 0.8) return 'cheer'
  if (s >= PASS_THRESHOLD) return 'happy'
  if (s >= 0.25) return 'idle'
  return 'sad'
})

const feedbackMessage = computed(() => {
  const s = lastScore.value
  if (s == null) return null
  if (s >= 0.8) return 'Bagus sekali! Hurufnya mirip banget!'
  if (s >= PASS_THRESHOLD) return 'Hebat! Hurufmu sudah terbentuk.'
  if (s >= 0.25) return 'Ayo coba lagi, isi seluruh garis abu-abunya ya.'
  return 'Belum kelihatan hurufnya — coba ikuti garis abu-abu.'
})

async function check() {
  if (!traceRef.value || checking.value) return
  checking.value = true
  const score = traceRef.value.check()
  lastScore.value = score
  if (score >= PASS_THRESHOLD) {
    // Lulus — markDone + hitung sebagai engagement (untuk streak & badges)
    markDone(current.value.upper)
    trackEngagement()
  }
  if (score >= 0.8) {
    showConfetti.value++
    await speak('Bagus sekali!')
  } else if (score >= PASS_THRESHOLD) {
    await speak('Hebat!')
  } else {
    await speak('Coba lagi ya')
  }
  checking.value = false
}

function clearCanvas() {
  traceRef.value?.clear()
  lastScore.value = null
}

async function playLetterSound() {
  await speak(current.value.sound, { rate: 0.85 })
}

function next() {
  // markDone sudah dipanggil di check() saat lulus — tidak perlu di sini lagi
  if (idx.value < letters.length - 1) {
    idx.value++
    lastScore.value = null
  } else {
    showConfetti.value++
  }
}

function prev() {
  if (idx.value > 0) {
    idx.value--
    lastScore.value = null
  }
}

// Saat huruf berganti, otomatis ucapkan bunyinya.
watch(
  () => current.value.upper,
  () => {
    setTimeout(playLetterSound, 350)
  },
  { immediate: true },
)
</script>

<template>
  <main class="flex-1 pb-12">
    <AppHeader title="Latihan Menulis ✏️" subtitle="Trace huruf di atas garis panduan abu-abu" />

    <ConfettiBurst :trigger="showConfetti" />

    <section class="px-4 sm:px-8 mt-2 mb-4 max-w-3xl mx-auto w-full">
      <ProgressDots :total="letters.length" :current="idx" :completed="completedIdxs" />
    </section>

    <section class="px-4 sm:px-8 max-w-3xl mx-auto w-full">
      <div class="card-soft bg-white p-5 sm:p-7">
        <div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <p class="text-xs uppercase tracking-widest font-bold text-slate-500">
              Huruf ke-{{ idx + 1 }}
            </p>
            <p class="font-display font-extrabold text-4xl text-slate-800 leading-none">
              {{ current.upper }} {{ current.lower }}
            </p>
          </div>
          <AudioButton
            :text="current.sound"
            :rate="0.85"
            variant="sun"
            size="md"
            label="Bunyi"
          />
        </div>

        <ClientOnly>
          <TraceCanvas ref="traceRef" :letter="current.upper" :size="600" />
        </ClientOnly>

        <!-- Tombol aksi trace -->
        <div class="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            type="button"
            class="btn-pill bg-white text-slate-700 ring-1 ring-slate-200 px-5 py-3"
            @click="clearCanvas"
          >
            🧽 Hapus
          </button>
          <button
            type="button"
            class="btn-pill bg-gradient-to-br from-emerald-400 to-teal-500 text-white px-6 py-3 text-lg"
            :disabled="checking"
            @click="check"
          >
            ✓ Cek
          </button>
        </div>

        <!-- Feedback -->
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0"
        >
          <div
            v-if="lastScore != null"
            class="mt-5 flex items-center gap-4 rounded-2xl p-4 ring-1"
            :class="
              passed
                ? 'bg-emerald-50 ring-emerald-200'
                : 'bg-rose-50 ring-rose-200'
            "
          >
            <Mascot :expression="mascotExpression" :size="80" no-bounce />
            <div class="flex-1">
              <p class="font-bold" :class="passed ? 'text-emerald-700' : 'text-rose-700'">
                {{ feedbackMessage }}
              </p>
              <p class="text-sm text-slate-600 mt-0.5">
                Skor: {{ Math.round((lastScore ?? 0) * 100) }}%
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <section class="mt-6 sm:mt-8 px-4 sm:px-8">
      <LessonNav :current="idx" :total="letters.length" @prev="prev" @next="next" />
    </section>
  </main>
</template>
