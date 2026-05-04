/**
 * Quiz best-score tracker, persisted to localStorage.
 *
 * One record per kategori (`huruf`, `suku-kata`, `kata`, `kalimat`):
 *   - best:  skor benar tertinggi yang pernah dicapai
 *   - total: jumlah soal di putaran terbaik (untuk hitung persentase)
 *   - plays: total kali kategori ini dimainkan
 *
 * Module-scoped state (singleton) — semua komponen lihat data yang sama
 * tanpa perlu prop drilling.
 */
const STORAGE_KEY = 'belajar-membaca:quiz-scores:v1'

export interface QuizScoreRecord {
  best: number
  total: number
  plays: number
}

type ScoresMap = Record<string, QuizScoreRecord>

const state = ref<ScoresMap>({})
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) state.value = JSON.parse(raw)
  } catch {
    state.value = {}
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // quota / disabled — ignore
  }
}

export function useQuizScores() {
  if (typeof window !== 'undefined') load()

  function getBest(tahap: string): QuizScoreRecord | null {
    return state.value[tahap] ?? null
  }

  /**
   * Catat hasil putaran. Return `isNewBest` agar UI bisa kasih kejutan
   * (badge, animasi sparkle) saat anak pecahkan rekor.
   */
  function recordResult(tahap: string, score: number, total: number) {
    const existing = state.value[tahap]
    const isNewBest = !existing || score > existing.best
    state.value = {
      ...state.value,
      [tahap]: {
        best: isNewBest ? score : existing!.best,
        total: isNewBest ? total : existing!.total,
        plays: (existing?.plays ?? 0) + 1,
      },
    }
    persist()
    return { isNewBest }
  }

  function reset(tahap?: string) {
    if (tahap) {
      const next = { ...state.value }
      delete next[tahap]
      state.value = next
    } else {
      state.value = {}
    }
    persist()
  }

  return { scores: state, getBest, recordResult, reset }
}
