/**
 * Per-page SEO helper.
 *
 * Sets the standard set of tags every page needs:
 *  - <title> + meta description
 *  - canonical URL
 *  - Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
 *  - Twitter Card
 *  - JSON-LD structured data (WebPage / EducationalApplication)
 *
 * The base URL comes from runtimeConfig.public.siteUrl, so it stays correct
 * across local / staging / production without code changes.
 */

interface SiteSeoOptions {
  /** Page title — combined with the global template into "<title> · Belajar Membaca" */
  title: string
  /** 50-160 char description that will be shown in search snippets and previews */
  description: string
  /** Path of this page (without origin), e.g. "/huruf". Defaults to current route */
  path?: string
  /** Optional OG image. Defaults to /og-image.svg */
  image?: string
  /** Optional Schema.org type. Defaults to WebPage */
  schemaType?: 'WebPage' | 'EducationalApplication' | 'WebSite' | 'CreativeWork'
}

export function useSiteSeo(opts: SiteSeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()

  const base = (config.public.siteUrl || '').replace(/\/$/, '')
  const path = opts.path ?? route.path
  const url = `${base}${path}`
  const image = `${base}${opts.image ?? '/og-image.svg'}`
  const siteName = config.public.siteName || 'Belajar Membaca'
  // Home keeps its own punchy title; other pages get the site-name suffix.
  const fullTitle = path === '/' ? `${siteName} – ${opts.title}` : `${opts.title} · ${siteName}`

  useSeoMeta({
    title: fullTitle,
    description: opts.description,

    // Open Graph
    ogType: 'website',
    ogTitle: fullTitle,
    ogDescription: opts.description,
    ogUrl: url,
    ogImage: image,
    ogImageAlt: opts.title,
    ogSiteName: siteName,
    ogLocale: 'id_ID',

    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: opts.description,
    twitterImage: image,
    twitterImageAlt: fullTitle,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': opts.schemaType ?? 'WebPage',
          name: fullTitle,
          description: opts.description,
          url,
          inLanguage: 'id-ID',
          image,
          isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: base,
          },
        }),
      },
    ],
  })
}
