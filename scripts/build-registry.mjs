// Build the public Verve registry from registry.json.
//
// For each item we inline the source file's contents and expand bare
// registryDependencies (e.g. "use-reduced-motion") into absolute URLs on the
// published origin, so a consumer's `shadcn-vue add <url>` can resolve the whole
// dependency chain over the network. Output lands in public/r/, which Vite
// copies to the site root at build time — served at ${BASE_URL}/<name>.json.
//
// Run: node scripts/build-registry.mjs  (also runs automatically before `build`)

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'r')

// Where the registry will be published. Update this if the domain changes.
// Overridable via VERVE_ORIGIN for local end-to-end testing of the CLI.
const ORIGIN = process.env.VERVE_ORIGIN || 'https://verve.jettonn.dev'
const BASE_URL = `${ORIGIN}/r`

const ITEM_SCHEMA = 'https://shadcn-vue.com/schema/registry-item.json'

// In-registry display path for a source file, grouped by its type.
function registryPath(sourcePath, type) {
  const base = sourcePath.split('/').pop()
  if (type === 'registry:ui') return `ui/${base}`
  if (type === 'registry:lib') return `lib/${base}`
  return base
}

// Bare name -> absolute URL on this registry; leave full URLs untouched.
function resolveDep(dep) {
  return dep.startsWith('http') ? dep : `${BASE_URL}/${dep}.json`
}

const registry = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf8'))

// Start from a clean output dir so removed components don't linger.
rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

const index = []

for (const item of registry.items) {
  const files = item.files.map((file) => ({
    path: registryPath(file.path, file.type),
    content: readFileSync(join(ROOT, file.path), 'utf8'),
    type: file.type
  }))

  const built = {
    $schema: ITEM_SCHEMA,
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies?.length
      ? { registryDependencies: item.registryDependencies.map(resolveDep) }
      : {}),
    files
  }

  writeFileSync(join(OUT_DIR, `${item.name}.json`), JSON.stringify(built, null, 2) + '\n')

  index.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    url: `${BASE_URL}/${item.name}.json`
  })
}

// A lightweight index of everything, handy for listing / a future `verve add`.
writeFileSync(
  join(OUT_DIR, 'registry.json'),
  JSON.stringify(
    {
      $schema: 'https://shadcn-vue.com/schema/registry.json',
      name: registry.name,
      homepage: registry.homepage,
      items: index
    },
    null,
    2
  ) + '\n'
)

const written = readdirSync(OUT_DIR).length
console.log(`✓ Verve registry: ${index.length} items -> public/r/ (${written} files) @ ${BASE_URL}`)

// --- Sitemap ---------------------------------------------------------------
// Kept in lockstep with the registry: the home page plus one URL per UI
// component page (/components/<slug>), so a new component is indexed the
// moment it lands in registry.json.
const today = new Date().toISOString().slice(0, 10)
const componentSlugs = registry.items.filter((i) => i.type === 'registry:ui').map((i) => i.name)

const urls = [
  { loc: `${ORIGIN}/`, changefreq: 'weekly', priority: '1.0' },
  ...componentSlugs.map((slug) => ({
    loc: `${ORIGIN}/components/${slug}`,
    changefreq: 'monthly',
    priority: '0.8'
  }))
]

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`

writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap)
console.log(`✓ Verve sitemap: ${urls.length} URLs -> public/sitemap.xml`)
