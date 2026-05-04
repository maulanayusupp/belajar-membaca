/**
 * Tracks which items in each lesson the child has practiced.
 * Persisted to localStorage so progress survives a refresh.
 */
const STORAGE_KEY = 'belajar-membaca:progress:v1'

type ProgressMap = Record<string, string[]>

const state = ref<ProgressMap>({})
const loaded = ref(false)

function load() {
  if (loaded.value || typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) state.value = JSON.parse(raw)
  } catch {
    state.value = {}
  }
  loaded.value = true
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // quota exceeded or storage disabled — silently ignore
  }
}

export function useProgress(lessonKey: string) {
  if (typeof window !== 'undefined') load()

  const completed = computed(() => state.value[lessonKey] ?? [])

  function isDone(itemKey: string) {
    return completed.value.includes(itemKey)
  }

  function markDone(itemKey: string) {
    const list = state.value[lessonKey] ?? []
    if (!list.includes(itemKey)) {
      state.value = { ...state.value, [lessonKey]: [...list, itemKey] }
      persist()
    }
  }

  function reset() {
    const next = { ...state.value }
    delete next[lessonKey]
    state.value = next
    persist()
  }

  return { completed, isDone, markDone, reset }
}
