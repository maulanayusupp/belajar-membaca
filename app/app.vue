<script setup lang="ts">
/**
 * Site-wide JSON-LD: WebSite + EducationalApplication.
 * Per-page WebPage JSON-LD is added on top by useSiteSeo() in each page.
 */
const config = useRuntimeConfig()
const base = (config.public.siteUrl || '').replace(/\/$/, '')
const siteName = config.public.siteName || 'Belajar Membaca'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${base}#website`,
            url: base,
            name: siteName,
            description:
              'Aplikasi belajar membaca untuk anak-anak Indonesia — huruf, suku kata, kata, kalimat dengan suara bahasa Indonesia.',
            inLanguage: 'id-ID',
          },
          {
            '@type': 'EducationalApplication',
            '@id': `${base}#app`,
            name: siteName,
            url: base,
            description:
              'Aplikasi web ramah anak untuk belajar membaca bahasa Indonesia, mengikuti kurikulum klasik 4 tahap.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Any (web)',
            inLanguage: 'id-ID',
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student',
              suggestedMinAge: 4,
              suggestedMaxAge: 7,
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'IDR',
            },
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <FloatingShapes />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
