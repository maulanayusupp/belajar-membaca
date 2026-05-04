/**
 * Persist child's name (used on certificates) to localStorage.
 * Singleton state — one source of truth across all components.
 */
const STORAGE_KEY = 'belajar-membaca:child-name:v1'

const childName = ref<string>('')
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) childName.value = raw
  } catch {
    // ignore
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    if (childName.value) localStorage.setItem(STORAGE_KEY, childName.value)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // quota / disabled — ignore
  }
}

const MAX_LEN = 30

export function useChildName() {
  if (typeof window !== 'undefined') load()

  function setName(value: string) {
    // Allow letters (incl. unicode), spaces, hyphens, apostrophes — strip the rest.
    // Cap length so it always fits the certificate.
    const cleaned = value
      .replace(/[^\p{L}\s'-]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_LEN)
    childName.value = cleaned
    persist()
  }

  function clear() {
    childName.value = ''
    persist()
  }

  return { childName, setName, clear, MAX_LEN }
}
