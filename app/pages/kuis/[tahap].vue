<script setup lang="ts">
import { QUIZ_SPECS, type QuizItem } from '~/data/quiz-specs'

const route = useRoute()
const tahap = computed(() => route.params.tahap as string)
const spec = computed(() => QUIZ_SPECS[tahap.value])

if (!spec.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kuis tidak ditemukan', fatal: true })
}

useSiteSeo({
  title: spec.value.title,
  description: spec.value.description,
})

const { current, currentIndex, total, score, finished, record, next, restart } = useQuiz<QuizItem>(
  spec.value.items,
  (i) => i.id,
  { totalRounds: 10, optionCount: 4 },
)

const { speak } = useSpeech()
const { getBest, recordResult } = useQuizScores()
const { trackEngagement } = useEngagement()

const confettiTrigger = ref(0)
const feedback = ref<'correct' | 'wrong' | null>(null)
const advancing = ref(false)

// Snapshot best score at mount, before this round records its result.
// That way "Sebelumnya N/total" stays stable on the result screen.
const previousBest = ref<number | null>(null)
const isNewBest = ref(false)
const recorded = ref(false)

onMounted(() => {
  const existing = getBest(tahap.value)
  previousBest.value = existing?.best ?? null
})

// Persist result exactly once when the quiz finishes.
watch(finished, (done) => {
  if (!done || recorded.value) return
  recorded.value = true
  const result = recordResult(tahap.value, score.value, total.value)
  isNewBest.value = result.isNewBest
  // Hitung sebagai aksi bermakna — bisa unlock badge kuis & streak
  trackEngagement()
})

async function onAnswer(correct: boolean) {
  if (advancing.value) return
  record(correct)
  feedback.value = correct ? 'correct' : 'wrong'
  if (correct) confettiTrigger.value++
  advancing.value = true

  // Brief moment so the highlighted answer has time to land visually
  await new Promise((r) => setTimeout(r, 250))

  // Spoken feedback. Race against a minimum hold so devices without an
  // Indonesian voice (where speak() resolves instantly) still give the
  // child time to read the ✓/✗ overlay.
  const minHoldMs = correct ? 900 : 1300
  const speech = correct
    ? speak('Kamu benar!')
    : speak(`Kamu salah. Jawaban yang benar adalah ${current.value?.correct.audioText ?? ''}.`)
  await Promise.all([speech, new Promise((r) => setTimeout(r, minHoldMs))])

  // Small pause before the next question's audio auto-plays
  await new Promise((r) => setTimeout(r, 300))

  feedback.value = null
  next()
  advancing.value = false
}

function tryAgain() {
  // Snapshot fresh best (which now includes the round just recorded) so the
  // next result screen still shows an honest "previously" comparison.
  previousBest.value = getBest(tahap.value)?.best ?? null
  isNewBest.value = false
  recorded.value = false
  restart()
  feedback.value = null
}

const optionsForCard = computed(
  () => current.value?.options.map((o) => ({ id: o.id, label: o.label })) ?? [],
)
</script>

<template>
  <main class="flex-1 pb-12">
    <AppHeader :title="spec.title" :subtitle="spec.description" back-to="/kuis" />

    <ConfettiBurst :trigger="confettiTrigger" />

    <!-- Full-screen feedback overlay -->
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="feedback"
        class="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
        aria-hidden="true"
      >
        <div class="relative animate-pop-in">
          <Mascot
            :expression="feedback === 'correct' ? 'cheer' : 'sad'"
            :size="220"
            no-bounce
          />
          <span
            class="absolute -top-3 -right-3 text-7xl drop-shadow-2xl"
            :class="feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'"
          >
            {{ feedback === 'correct' ? '✓' : '✗' }}
          </span>
        </div>
      </div>
    </Transition>

    <section v-if="!finished" class="px-4 sm:px-8 max-w-3xl mx-auto w-full mt-2">
      <div class="flex items-center justify-between gap-4 mb-4 px-2">
        <p class="text-sm font-bold text-slate-600">
          Soal {{ currentIndex + 1 }} dari {{ total }}
        </p>
        <p class="text-sm font-bold text-emerald-600">
          ⭐ Skor: {{ score }}
        </p>
      </div>
      <ProgressDots :total="total" :current="currentIndex" />

      <div class="mt-6">
        <QuizCard
          v-if="current"
          :audio-text="current.correct.audioText"
          :audio-parts="current.correct.audioParts"
          :options="optionsForCard"
          :correct-id="current.correct.id"
          :question-label="`Pertanyaan ${currentIndex + 1}`"
          :layout="spec.layout"
          @answer="onAnswer"
        />
      </div>
    </section>

    <section v-else class="px-4 sm:px-8 mt-6">
      <QuizResult
        :score="score"
        :total="total"
        :is-new-best="isNewBest"
        :previous-best="previousBest"
        @retry="tryAgain"
      />
    </section>
  </main>
</template>
