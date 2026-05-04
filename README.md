# Belajar Membaca

Aplikasi belajar membaca untuk anak-anak Indonesia. Mengikuti kurikulum klasik
empat tahap: **Huruf → Suku Kata → Kata → Kalimat**, dengan pelafalan suara
bahasa Indonesia, animasi ramah anak, **mode kuis** untuk uji pemahaman, dan
progress tersimpan di perangkat.

Dibangun dengan **Nuxt 4**, **Vue 3 (Composition API)**, dan **Tailwind CSS**.
Audio menggunakan Web Speech API browser — tanpa server TTS, tanpa API key,
tanpa biaya.

## Cara menjalankan

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Build produksi:

```bash
npm run build
npm run preview              # preview lokal
# atau deploy folder .output/ ke Vercel/Netlify/Node host pilihanmu
```

## Suara bahasa Indonesia

`useSpeech.ts` membungkus `window.speechSynthesis` dengan kebijakan **strict
Indonesia-only**: utterance hanya diucapkan jika voice Indonesia terdeteksi.
Kalau perangkat tidak punya voice ID, tombol audio diam (daripada salah
melafalkan dalam bahasa Inggris) dan banner panduan tampil di home.

Voice yang dikenali:

| Platform        | Voice                                        |
| --------------- | -------------------------------------------- |
| macOS / iOS     | Damayanti                                    |
| Chrome / Edge   | Google Bahasa Indonesia                      |
| Windows         | Microsoft Andika, Microsoft Gadis            |
| Android         | Bahasa Indonesia (paket TTS sistem)          |

Cara memasang lihat panduan di banner aplikasi (muncul otomatis kalau voice
belum tersedia).

### Kecepatan suara

Toggle 🐢 Pelan / 🚶 Normal / 🐇 Cepat (multiplier `0.7×` / `1.0×` / `1.3×`)
muncul fixed di pojok kanan atas tiap halaman. Pilihan disimpan di
localStorage (`belajar-membaca:speed:v1`) dan diaplikasikan pada SEMUA
panggilan `speak()` dengan dikalikan ke `rate` per-call. Artinya, kecepatan
relatif antar mode tetap (eja-suku-kata tetap lebih lambat dari kata utuh) —
kecepatan absolutnya saja yang berubah.

## Mode kuis

Kuis acak 10 soal per putaran, untuk menguji pemahaman setelah belajar.

Tipe soal: **dengar suara → pilih jawaban yang benar**. Empat opsi (pilihan
ganda) untuk huruf/suku-kata/kata, opsi vertikal untuk kalimat (karena lebih
panjang).

Tersedia 4 kategori, masing-masing pakai data yang sama dengan tahap belajar:

| Route               | Kategori              |
| ------------------- | --------------------- |
| `/kuis/huruf`       | Pilih huruf yang benar |
| `/kuis/suku-kata`   | Pilih suku kata        |
| `/kuis/kata`        | Pilih kata             |
| `/kuis/kalimat`     | Pilih kalimat          |

Skoring: 0–3 bintang berdasarkan rasio jawaban benar (≥90% = 3, ≥60% = 2,
≥30% = 1). Hasil tampil dengan animasi sparkle + tombol "Coba lagi" yang
me-randomize pertanyaan baru.

Logic kuis ada di `useQuiz<T>(pool, keyFn)` — composable generic yang bisa
dipakai untuk dataset apapun: hanya butuh array + key function untuk
identitas. Distractor di-pick acak dari pool yang sama (mengecualikan
correct), sehingga seluruh logic stateless dan reusable.

### Skor terbaik per kategori

`useQuizScores()` simpan rekor di localStorage (`belajar-membaca:quiz-scores:v1`).
Per kategori menyimpan `{ best, total, plays }`. Saat kuis selesai:

- Runner panggil `recordResult(tahap, score, total)` → returns `{ isNewBest }`
- `QuizResult` tampilkan ribbon **🏆 Rekor!** + perbandingan "Sebelumnya N/total"
- `/kuis` index tampilkan badge `⭐⭐ 8/10` per kartu kategori (atau "Belum
  dimainkan" untuk kategori yang belum pernah disentuh)

Reset salah satu atau semua skor via `useQuizScores().reset(tahap?)`.

## Mascot — Bita

Bita adalah maskot SVG (komponen `Mascot.vue`) dengan 5 ekspresi:

| Expression | Wajah                    | Dipakai untuk                          |
| ---------- | ------------------------ | -------------------------------------- |
| `idle`     | senyum kecil + mata bulat | default, atau skor 1 bintang           |
| `happy`    | mata `^_^` + senyum lebar | skor 2 bintang                         |
| `excited`  | alis naik + mulut O      | greeting di home                        |
| `sad`      | mata droopy + tetesan air mata | jawaban kuis salah, atau skor 0 bintang |
| `cheer`    | tangan terangkat + mulut grin | jawaban kuis benar, atau skor 3 bintang |

Bentuk dasar (badan + telinga + pipi) selalu sama — hanya mata, mulut, dan
hiasan (sparkle, hands up) yang berubah berdasarkan prop `expression`.
Tidak butuh asset eksternal — semuanya inline SVG.

```vue
<Mascot expression="excited" :size="160" label="Halo!" />
```

Tempat dia muncul:
- **Home hero** — sapaan `excited` dengan speech bubble "Hai! Aku Bita 👋"
- **Kuis feedback overlay** — `cheer` saat benar, `sad` saat salah (full screen)
- **QuizResult** — ekspresi adapt ke skor (cheer/happy/idle/sad)
- **CertificateBanner** — `cheer` saat tahap selesai (banner CTA)
- **Sertifikat SVG** — `cheer` inline di kiri sertifikat

## Sertifikat

Saat anak menyelesaikan SEMUA materi di sebuah tahap, sebuah banner
**🏆 Buka Sertifikatmu** muncul di bawah tombol Sebelum/Lanjut. Klik →
halaman `/sertifikat/[tahap]`.

Sertifikat adalah SVG 1200×900 dengan:
- Border emas + 4 ornamen bintang di sudut
- Judul **SERTIFIKAT KEHEBATAN** dengan gradient gold
- Nama anak (script italic, ambil dari `useChildName`)
- Judul tahap yang diselesaikan
- Bita pose `cheer` di kiri, medali emas di kanan
- Tanggal selesai (format Indonesia, e.g. "4 Mei 2026")

Aksi:
- **Download SVG** — generate file `Sertifikat-{tahap}-{nama}.svg`, terbuka
  di browser/Preview/Photoshop/Figma. Semua style baked-in jadi tidak
  butuh font atau CSS eksternal.
- **Print / PDF** — `window.print()` dengan CSS `@media print` yang
  menyembunyikan UI sekitar dan biarkan hanya cert. Browser ngasih opsi
  "Save as PDF" — beres tanpa library tambahan.

Form nama disediakan di atas sertifikat — anak/orang tua bisa update kapan
saja. Nama disimpan di `localStorage:belajar-membaca:child-name:v1` dan
dibersihkan dari karakter selain huruf/spasi/`-`/`'` dengan max 30 karakter.

Halaman sertifikat di-gate: kalau tahap belum selesai, tampil pesan
"Sudah {N} dari {total}" + link kembali ke pelajaran.

## Latihan menulis (canvas trace)

Halaman `/menulis` melatih anak menulis huruf A–Z dengan jari (di
tablet/HP) atau mouse (di desktop). Iterate satu huruf per kartu.

**Komponen `TraceCanvas`** terdiri dari dua canvas yang ditumpuk:
- `template`: huruf abu-abu sebagai panduan, dirender sekali
- `user`: tempat anak menggambar — pakai Pointer Events (universal untuk
  mouse/touch/stylus) + `touch-action: none` supaya tidak men-scroll page

Skoring sederhana: render mask huruf di canvas offscreen, bandingkan
pixel demi pixel — `coverage = (pixel_dicat ∩ pixel_huruf) / pixel_huruf`.
Threshold default `0.5` (50%) — anak motorik halus 4–7 tahun bervariasi
luas, jadi sengaja longgar. Kami **tidak** menghukum kalau anak menggambar
di luar garis — fokus apakah bentuk huruf "tertutup".

Reaksi Bita berdasarkan skor:
| Skor       | Ekspresi | Pesan                                  |
| ---------- | -------- | -------------------------------------- |
| ≥ 80%      | cheer    | "Bagus sekali! Hurufnya mirip banget!" |
| ≥ 50%      | happy    | "Hebat! Hurufmu sudah terbentuk."      |
| ≥ 25%      | idle     | "Ayo coba lagi…"                       |
| <  25%     | sad      | "Belum kelihatan hurufnya…"            |

Aksi: 🧽 Hapus, ✓ Cek, plus tombol Sebelum/Lanjut yang sama dengan lesson
page lain. Hanya huruf dengan skor lulus yang ditandai `markDone()` di
`useProgress('tracing-letters')` — tidak otomatis diberi cap saat user
sekadar geser ke huruf berikutnya tanpa nge-cek.

## Streak harian + lencana (achievement)

Halaman `/penghargaan` menampilkan streak harian + grid 14 lencana.

**Streak (`useStreak.ts`)** — track current/longest streak + tanggal main
terakhir di `localStorage:belajar-membaca:streak:v1`. Logic
`recordVisit()`:
- Sudah dicatat hari ini → tidak ada perubahan
- Selisih persis 1 hari → streak += 1
- Selisih > 1 hari → streak reset ke 1

Pakai string `YYYY-MM-DD` di local timezone agar tidak bermasalah dengan
DST. `isActive()` true kalau anak main hari ini atau kemarin.

**Achievements (`useAchievements.ts` + `data/achievements.ts`)** — daftar
14 lencana, masing-masing punya `check()` yang memanggil composable lain
langsung (state-nya singleton, jadi aman). `checkAndUnlock()` jalankan
semua check, unlock yang baru, push ke `pendingToasts` queue.

`<AchievementToast />` global di `app.vue` memantau queue itu dan tampilkan
satu-per-satu (4 detik per badge, dengan suara TTS "Hebat! Kamu dapat
lencana baru!").

**`useEngagement.ts`** — wrapper kecil dengan `trackEngagement()` yang
panggil `recordVisit()` + `checkAndUnlock()` sekaligus. Dipanggil dari:
- 4 lesson page (huruf/suku-kata/kata/kalimat) saat klik Lanjut
- Quiz runner saat selesai 10 soal
- Menulis page saat user lulus tracing (≥50%)

Daftar lencana yang sudah ada (lihat `data/achievements.ts` untuk detail):
| Kategori | ID | Trigger |
|----------|----|----|
| Belajar | `first-letter`, `half-alphabet`, `alphabet-master`, `syllable-explorer`, `word-wizard`, `sentence-reader` | Selesaikan materi |
| Kuis | `quiz-rookie`, `quiz-marathon`, `quiz-perfect` | Jumlah main / skor 100% |
| Streak | `streak-3`, `streak-7` | Hari beruntun |
| Menulis | `trace-first`, `trace-master` | Lulus trace 1 / 10 huruf |
| Special | `all-rounder` | Selesaikan semua 4 tahap |

## Struktur proyek

```
app/
├── app.vue                       # Shell + background dekoratif
├── assets/css/main.css           # Tailwind + custom layers/utilities
├── composables/
│   ├── useSpeech.ts              # TTS Indonesia (singleton, strict ID, speed multiplier)
│   ├── useProgress.ts            # localStorage tracker per tahap
│   ├── useQuiz.ts                # Generic quiz state (questions, score, restart)
│   ├── useQuizScores.ts          # Best score per kategori (localStorage)
│   ├── useChildName.ts           # Nama anak (untuk sertifikat)
│   ├── useStreak.ts              # Daily streak counter (localStorage)
│   ├── useAchievements.ts        # Badge unlock tracker + toast queue
│   ├── useEngagement.ts          # Wrapper streak+achievements untuk page handlers
│   └── useSiteSeo.ts             # Per-page SEO helper
├── components/                   # Semua single-purpose, mudah di-compose ulang
│   ├── AppHeader.vue             # Header + tombol kembali
│   ├── AudioButton.vue           # Tombol speaker reusable (5 varian, 4 ukuran)
│   ├── ConfettiBurst.vue         # Animasi confetti saat selesai
│   ├── FloatingShapes.vue        # 8 emoji background animated
│   ├── Certificate.vue           # SVG sertifikat 1200×900 (style inline)
│   ├── CertificateBanner.vue     # Banner CTA "Buka Sertifikatmu" di lesson
│   ├── HomeMenuCard.vue          # Kartu menu home
│   ├── Mascot.vue                # Bita — maskot SVG dengan 5 ekspresi
│   ├── QuizCard.vue              # Soal kuis: audio + 4 opsi
│   ├── QuizResult.vue            # Skor akhir dengan bintang
│   ├── SpeedToggle.vue           # Switch kecepatan suara global
│   ├── LessonNav.vue             # Tombol Sebelum/Lanjut + counter
│   ├── LetterCard.vue            # Tahap 1: huruf besar/kecil + emoji + suara
│   ├── ProgressDots.vue          # Indikator progress
│   ├── SentenceCard.vue          # Tahap 4: kalimat dgn highlight per kata
│   ├── SyllableCard.vue          # Tahap 2: grid 5 suku kata
│   ├── TraceCanvas.vue           # Canvas latihan menulis (template + user)
│   ├── AchievementToast.vue      # Toast badge baru di-unlock (pasang di app.vue)
│   ├── StreakChip.vue            # Pill 🔥 jumlah hari beruntun
│   ├── VoiceWarningBanner.vue    # Banner kalau voice ID tidak terinstall
│   └── WordCard.vue              # Tahap 3: chip suku kata + Eja & Gabung
├── data/                         # Konten kurikulum — edit untuk tambah materi
│   ├── letters.ts                # 26 huruf + bunyi + contoh + emoji
│   ├── syllables.ts              # 12 konsonan × 5 vokal = 60 suku kata
│   ├── words.ts                  # 16 kata (KV-KV → KVK)
│   ├── sentences.ts              # 7 kalimat sederhana
│   └── quiz-specs.ts             # Mapping data → bentuk seragam untuk QuizCard
└── pages/
    ├── index.vue                 # Home: 4 kartu tahap + kuis + menulis
    ├── huruf.vue, suku-kata.vue, kata.vue, kalimat.vue
    ├── menulis.vue               # Latihan menulis huruf (canvas trace)
    ├── penghargaan.vue            # Streak harian + grid lencana
    ├── kuis/
    │   ├── index.vue             # Pilih kategori kuis
    │   └── [tahap].vue           # Runner kuis (huruf/suku-kata/kata/kalimat)
    └── sertifikat/
        └── [tahap].vue           # Sertifikat selesai per tahap (SVG + print)
```

### Filosofi komponen

Setiap kartu pelajaran (`LetterCard`, `SyllableCard`, `WordCard`,
`SentenceCard`) menerima **satu prop data** dan tidak tahu tentang navigasi
atau progress — itu tugas page. Page-lah yang memegang `idx`, memanggil
`useProgress`, dan men-trigger `ConfettiBurst` saat selesai. Pola ini bikin:

- Kartu mudah dipakai ulang (mis. di mode kuis nanti)
- Page kecil dan mirip satu sama lain
- Data terpusat di `data/` — tidak perlu sentuh komponen untuk tambah materi

### Alur audio

`useSpeech` adalah module-level singleton:

1. Saat komponen pertama mount, scan `getVoices()` → cari voice Indonesia.
2. Browser yang lazy-load voice (Chrome/Edge) memicu `voiceschanged` →
   re-scan otomatis.
3. `speak(text)` set `u.voice` dan `u.lang` dari voice yang terpilih.
4. Tanpa voice ID, `speak()` resolve diam — UI tetap reaktif, banner muncul.

`speakSequence(parts, gapMs)` menjalankan beberapa utterance berurutan
dengan jeda — dipakai `WordCard` untuk teknik **eja-lalu-gabung** (suku kata
satu-satu, lalu kata utuh).

## Menambahkan materi baru

Semua konten kurikulum ada di `app/data/`. Misalnya tambah huruf baru cukup
push entry ke `letters.ts`:

```ts
{ upper: 'A', lower: 'a', sound: 'a', example: 'Apel', emoji: '🍎',
  color: 'from-rose-400 to-rose-600' },
```

Field `color` adalah dua kelas Tailwind gradient (lihat bagian *Sistem
warna* di bawah). Tidak perlu edit komponen — kartu otomatis menyesuaikan.

Untuk tambah tahap baru (misal "paragraf"):

1. Buat file data di `app/data/paragraphs.ts`
2. Buat komponen `ParagraphCard.vue` di `app/components/`
3. Buat page `app/pages/paragraf.vue` (copy salah satu page lesson sebagai
   template — strukturnya identik)
4. Tambah entry di array `menus` pada `app/pages/index.vue`

## Sistem warna

Setiap kartu data menyertakan dua kelas gradient Tailwind, range **400/600**.
Saturasinya cukup pekat agar teks putih terbaca tegas (versi pastel 200/300
sebelumnya membuat teks hilang — lihat *Catatan styling* di bawah).

Custom palette `sun-50…500` dan keyframes (`pop-in`, `wiggle`, `float`,
`bounce-soft`, `glow`, `slide-up`, `confetti`, `sparkle`) didefinisikan di
`tailwind.config.ts`.

## Catatan styling

`.card-soft` (di `main.css`) sengaja **tidak** menyertakan `bg-white/80
backdrop-blur` lagi. Versi sebelumnya membuat gradient kartu terlihat pucat
karena `bg-white` (background-color) menyala berdampingan dengan
`bg-gradient-to-br` (background-image) — kabut putih 80% menutupi gradient.
Sekarang `card-soft` cuma kasih `rounded-3xl shadow-xl ring`, dan komponen
yang butuh look frosted bisa pakai utility `.card-frost` terpisah.

Utility `text-shadow-pop` memberi drop-shadow gelap berlapis untuk teks
putih besar — perlu karena `drop-shadow-lg` Tailwind sendiri masih kurang
tegas di sebagian gradient.

## Progress

`useProgress(lessonKey)` menyimpan array item yang sudah dilatih ke
`localStorage` dengan key `belajar-membaca:progress:v1`. Setiap page
lesson punya `lessonKey` sendiri (`letters`, `syllables`, `words`,
`sentences`) sehingga progress terpisah. Reset via DevTools localStorage
atau panggil `reset()` dari composable.

## SEO

Semua tag SEO penting sudah terpasang otomatis di tiap halaman:

- **Title** unik per halaman (`Belajar Huruf A sampai Z · Belajar Membaca`, dst.)
- **Meta description** spesifik per halaman (50–160 karakter)
- **Canonical URL** absolut (mengikuti `runtimeConfig.public.siteUrl`)
- **Open Graph** lengkap (`og:type`, `og:title`, `og:description`, `og:url`,
  `og:image`, `og:image:alt`, `og:site_name`, `og:locale: id_ID`)
- **Twitter Card** (`summary_large_image`)
- **JSON-LD structured data**:
  - Site-level (`WebSite` + `EducationalApplication` dengan target audience
    4–7 tahun) di `app.vue`
  - Page-level (`WebPage` / `EducationalApplication`) di tiap page via
    `useSiteSeo()`
- **`robots.txt`** + **`sitemap.xml`** (dinamis via `server/routes/sitemap.xml.ts`,
  pakai `siteUrl` dari runtimeConfig)
- **`manifest.webmanifest`** untuk PWA-lite (install ke home screen)
- Meta `theme-color`, `apple-mobile-web-app-*`, `application-name`, mask-icon

### Set base URL saat deploy

Edit di `nuxt.config.ts` atau lewat env:

```bash
NUXT_PUBLIC_SITE_URL=https://belajarmembaca.example.com npm run build
```

Variabel ini dipakai oleh:
- `useSiteSeo()` untuk canonical, og:url, og:image absolut
- `server/routes/sitemap.xml.ts` untuk loc URL

### Tambah SEO ke halaman baru

```ts
<script setup lang="ts">
useSiteSeo({
  title: 'Judul Halaman',
  description: 'Deskripsi 50–160 karakter, harus mengandung kata kunci utama.',
  // schemaType: 'EducationalApplication', // opsional, default WebPage
})
</script>
```

## Favicon & icon set

Semua icon adalah SVG (resolusi tak terbatas, ukuran kecil):

| File                      | Ukuran     | Dipakai untuk                        |
| ------------------------- | ---------- | ------------------------------------ |
| `favicon.svg`             | 64×64      | Tab browser modern                   |
| `favicon.ico`             | 32×32      | Fallback untuk browser sangat lama   |
| `apple-touch-icon.svg`    | 180×180    | Add to Home Screen di iOS            |
| `icon-192.svg`            | 192×192    | PWA install (Android)                |
| `icon-512.svg`            | 512×512    | PWA splash + maskable icon Android   |
| `og-image.svg`            | 1200×630   | Preview saat di-share di sosial media |

Desain: gradient yellow → orange → coral, huruf "Aa" putih dengan drop-shadow,
sparkle dekoratif. Konsisten dengan tone aplikasi.

> **Catatan:** Beberapa platform (iOS lama, Twitter sebelum 2024) lebih suka
> PNG. Untuk produksi penuh, generate PNG dari SVG di atas dengan
> `npx sharp-cli` atau ImageMagick:
> ```bash
> # contoh: konversi apple-touch-icon ke PNG 180x180
> magick public/apple-touch-icon.svg -resize 180x180 public/apple-touch-icon.png
> ```
> Lalu update `nuxt.config.ts` agar menunjuk file PNG. Mayoritas browser
> modern sudah men-support SVG icon, jadi langkah ini opsional.

## Aksesibilitas

- Semua tombol audio punya `aria-label` deskriptif Indonesia
- `lang="id"` di root HTML
- Voice synthesis pakai `lang="id-ID"` sehingga pembaca layar (kalau pun
  dipakai bersamaan) tahu konteks
- Animasi pakai CSS keyframes — ringan, tidak block thread

## Roadmap (ide pengembangan)

- ✅ ~~Mode kuis: dengar suara → pilih huruf/kata yang benar~~ (selesai)
- ✅ ~~Setting kecepatan suara di header~~ (selesai)
- ✅ ~~Riwayat skor kuis terbaik per kategori~~ (selesai)
- ✅ ~~Mascot karakter dengan ekspresi~~ (Bita — selesai)
- ✅ ~~Export sertifikat selesai per tahap~~ (selesai — SVG download + browser print)
- ✅ ~~Mode latihan menulis dengan canvas (trace huruf)~~ (selesai)
- ✅ ~~Daily streak / achievement badges~~ (selesai)

Roadmap baru (untuk pengembangan lanjutan):
- Export/import data progress (JSON) untuk backup ke perangkat lain
- Mode multi-anak (profile selector)
- Cloud sync via Supabase/Firebase (kalau ingin lintas perangkat)
- Lebih banyak lencana berdasarkan milestone spesifik
