/**
 * Helper tunggal untuk mencatat aksi bermakna anak —
 * panggil ini setelah: selesai satu materi, selesai kuis, lulus trace, dll.
 *
 * Kegunaan:
 *  1. Update streak harian
 *  2. Cek apakah ada badge baru yang di-unlock
 *
 * Pages tinggal panggil `trackEngagement()` di handler-nya.
 */
export function useEngagement() {
  const { recordVisit } = useStreak()
  const { checkAndUnlock } = useAchievements()

  function trackEngagement() {
    recordVisit()
    checkAndUnlock()
  }

  return { trackEngagement }
}
