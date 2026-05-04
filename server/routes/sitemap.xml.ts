/**
 * Dynamic sitemap. Reads base URL from runtimeConfig.public.siteUrl so the
 * same build can be deployed to staging/production without hardcoded hosts.
 */
const PAGES = [
  { path: '/',                changefreq: 'monthly', priority: '1.0' },
  { path: '/huruf',           changefreq: 'monthly', priority: '0.9' },
  { path: '/suku-kata',       changefreq: 'monthly', priority: '0.9' },
  { path: '/kata',            changefreq: 'monthly', priority: '0.9' },
  { path: '/kalimat',         changefreq: 'monthly', priority: '0.9' },
  { path: '/kuis',            changefreq: 'monthly', priority: '0.8' },
  { path: '/kuis/huruf',      changefreq: 'monthly', priority: '0.7' },
  { path: '/kuis/suku-kata',  changefreq: 'monthly', priority: '0.7' },
  { path: '/kuis/kata',       changefreq: 'monthly', priority: '0.7' },
  { path: '/kuis/kalimat',    changefreq: 'monthly', priority: '0.7' },
]

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const base = (config.public.siteUrl || '').replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)

  const urls = PAGES.map(
    (p) => `  <url>
    <loc>${base}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  ).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
