# Belajar Membaca

Aplikasi belajar membaca untuk anak-anak Indonesia. Mengikuti kurikulum klasik
empat tahap: **Huruf → Suku Kata → Kata → Kalimat**, dengan pelafalan suara
bahasa Indonesia, animasi ramah anak, dan progress tersimpan di perangkat.

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

## Struktur proyek

```
app/
├── app.vue                       # Shell + background dekoratif
├── assets/css/main.css           # Tailwind + custom layers/utilities
├── composables/
│   ├── useSpeech.ts              # TTS Indonesia (singleton, strict ID)
│   └── useProgress.ts            # localStorage tracker per tahap
├── components/                   # Semua single-purpose, mudah di-compose ulang
│   ├── AppHeader.vue             # Header + tombol kembali
│   ├── AudioButton.vue           # Tombol speaker reusable (5 varian, 4 ukuran)
│   ├── ConfettiBurst.vue         # Animasi confetti saat selesai
│   ├── FloatingShapes.vue        # 8 emoji background animated
│   ├── HomeMenuCard.vue          # Kartu menu home
│   ├── LessonNav.vue             # Tombol Sebelum/Lanjut + counter
│   ├── LetterCard.vue            # Tahap 1: huruf besar/kecil + emoji + suara
│   ├── ProgressDots.vue          # Indikator progress
│   ├── SentenceCard.vue          # Tahap 4: kalimat dgn highlight per kata
│   ├── SyllableCard.vue          # Tahap 2: grid 5 suku kata
│   ├── VoiceWarningBanner.vue    # Banner kalau voice ID tidak terinstall
│   └── WordCard.vue              # Tahap 3: chip suku kata + Eja & Gabung
├── data/                         # Konten kurikulum — edit untuk tambah materi
│   ├── letters.ts                # 26 huruf + bunyi + contoh + emoji
│   ├── syllables.ts              # 12 konsonan × 5 vokal = 60 suku kata
│   ├── words.ts                  # 16 kata (KV-KV → KVK)
│   └── sentences.ts              # 7 kalimat sederhana
└── pages/
    ├── index.vue                 # Home dengan 4 kartu tahap
    ├── huruf.vue, suku-kata.vue, kata.vue, kalimat.vue
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

- Mode kuis: dengar suara → pilih huruf/kata yang benar
- Mascot karakter dengan ekspresi
- Setting kecepatan suara di header
- Mode latihan menulis dengan canvas (trace huruf)
- Export sertifikat selesai per tahap
