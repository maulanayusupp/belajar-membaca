/**
 * Generic quiz state machine.
 *
 * Given a pool of items and a key extractor, generates `totalRounds`
 * questions. Each question has 1 correct answer + (optionCount - 1)
 * distractors, all shuffled. The composable tracks progress and score
 * — the page decides UI and feedback.
 */

export interface QuizQuestion<T> {
  correct: T
  options: T[]
  /** Index of the correct item within `options` */
  correctIndex: number
}

interface UseQuizOpts {
  totalRounds?: number
  optionCount?: number
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function useQuiz<T>(
  pool: readonly T[],
  keyFn: (item: T) => string,
  opts: UseQuizOpts = {},
) {
  const totalRounds = Math.min(opts.totalRounds ?? 10, pool.length)
  const optionCount = Math.min(opts.optionCount ?? 4, pool.length)

  function buildQuestions(): QuizQuestion<T>[] {
    const correctSet = shuffle(pool).slice(0, totalRounds)
    return correctSet.map((correct) => {
      const distractors = shuffle(pool.filter((p) => keyFn(p) !== keyFn(correct))).slice(
        0,
        optionCount - 1,
      )
      const options = shuffle([correct, ...distractors])
      return {
        correct,
        options,
        correctIndex: options.findIndex((o) => keyFn(o) === keyFn(correct)),
      }
    })
  }

  const questions = ref<QuizQuestion<T>[]>(buildQuestions()) as Ref<QuizQuestion<T>[]>
  const currentIndex = ref(0)
  const score = ref(0)
  const total = computed(() => questions.value.length)
  const finished = computed(() => currentIndex.value >= questions.value.length)
  const current = computed(() => questions.value[currentIndex.value] ?? null)

  function record(correct: boolean) {
    if (correct) score.value++
  }

  function next() {
    if (!finished.value) currentIndex.value++
  }

  function restart() {
    questions.value = buildQuestions()
    currentIndex.value = 0
    score.value = 0
  }

  return { questions, current, currentIndex, total, score, finished, record, next, restart }
}
