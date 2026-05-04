// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  // Override at deploy time with NUXT_PUBLIC_SITE_URL=https://your-domain
  runtimeConfig: {
    public: {
      siteUrl: 'http://localhost:3000',
      siteName: 'Belajar Membaca',
      twitterHandle: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      // Default title — per-page useSiteSeo() overrides this with a full title
      // already including the site name (no template, deterministic).
      title: 'Belajar Membaca - Yuk Bisa Baca!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#fbbf24' },
        { name: 'color-scheme', content: 'light' },
        { name: 'format-detection', content: 'telephone=no' },

        // Mobile web app
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Belajar Membaca' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: 'Belajar Membaca' },

        // Robots
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.svg' },
        { rel: 'mask-icon', href: '/favicon.svg', color: '#fbbf24' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Baloo+2:wght@500;700;800&display=swap',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      // Pre-build robots.txt + sitemap.xml as static at deploy time.
      routes: ['/robots.txt', '/sitemap.xml'],
    },
  },
})
