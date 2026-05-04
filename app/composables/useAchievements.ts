/**
 * Tracker badge unlock + queue toast.
 *
 * `checkAndUnlock()` dijalankan setelah aksi bermakna (selesaikan materi,
 * skor kuis, dll). Setiap badge yg `check()`-nya sekarang `true` tapi
 * belum ada di list unlocked, akan ditambahkan + di-push ke `pendingToasts`
 * untuk ditampilkan oleh `<AchievementToast />` global.
 */
import { ACHIEVEMENTS, type AchievementDef } from '~/data/achievements'

const STORAGE_KEY = 'belajar-membaca:achievements:v1'

const unlocked = ref<string[]>([])
/** Queue badge yang baru di-unlock — toast component memakainya. */
const pendingToasts = ref<AchievementDef[]>([])
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) unlocked.value = JSON.parse(raw)
  } catch {
    unlocked.value = []
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked.value))
  } catch {
    // ignore
  }
}

export function useAchievements() {
  if (typeof window !== 'undefined') load()

  const isUnlocked = (id: string) => unlocked.value.includes(id)

  /** Jalankan semua check, unlock yang baru. Return list yang baru di-unlock. */
  function checkAndUnlock(): AchievementDef[] {
    const newly: AchievementDef[] = []
    for (const def of ACHIEVEMENTS) {
      if (unlocked.value.includes(def.id)) continue
      try {
        if (def.check()) {
          unlocked.value.push(def.id)
          newly.push(def)
        }
      } catch {
        // jangan biarkan satu check error merusak yang lain
      }
    }
    if (newly.length) {
      persist()
      pendingToasts.value.push(...newly)
    }
    return newly
  }

  /** Diambil oleh toast component setelah ditampilkan. */
  function popToast(): AchievementDef | null {
    return pendingToasts.value.shift() ?? null
  }

  function reset() {
    unlocked.value = []
    pendingToasts.value = []
    persist()
  }

  return {
    unlocked,
    pendingToasts,
    isUnlocked,
    checkAndUnlock,
    popToast,
    reset,
    all: ACHIEVEMENTS,
  }
}
