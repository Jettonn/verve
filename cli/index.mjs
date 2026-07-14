#!/usr/bin/env node
// verve — add Verve micro-interaction motion components to your Vue app.
//
// It fetches a component's registry item from the Verve registry, walks its
// registryDependencies (the shared composable, etc.), writes every file into
// your project, and installs the npm deps with your package manager. No config
// file required — the components assume the conventional `@ -> src` alias.
//
// Usage:
//   npx @jettonn/verve@latest add <component...>
//   npx @jettonn/verve@latest add --all
//   npx @jettonn/verve@latest list

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, basename, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const DEFAULT_REGISTRY = process.env.VERVE_REGISTRY || 'https://verve.jettonn.dev/r'
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`
}

const HELP = `${c.bold('verve')} — micro-interaction motion components for Vue

${c.bold('Usage')}
  npx @jettonn/verve@latest add <component...>   Add one or more components
  npx @jettonn/verve@latest add --all            Add every component
  npx @jettonn/verve@latest list                 List available components

${c.bold('Options')}
  --all              Add all components
  --overwrite        Overwrite files that already exist
  --no-install       Skip installing npm dependencies
  --ui <dir>         Component target dir  ${c.dim('(default src/components/ui)')}
  --lib <dir>        Composable target dir ${c.dim('(default src/lib)')}
  --cwd <dir>        Project root          ${c.dim('(default .)')}
  --registry <url>   Registry base URL

${c.bold('Examples')}
  npx @jettonn/verve@latest add forward-button
  npx @jettonn/verve@latest add forward-button volume-button
  npx @jettonn/verve@latest add --all
`

function parse(args) {
  const opts = { _: [], install: true }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--all') opts.all = true
    else if (a === '--overwrite') opts.overwrite = true
    else if (a === '--no-install') opts.install = false
    else if (a === '--cwd') opts.cwd = args[++i]
    else if (a === '--ui') opts.ui = args[++i]
    else if (a === '--lib') opts.lib = args[++i]
    else if (a === '--registry') opts.registry = args[++i]
    else if (a.startsWith('-')) throw new Error(`Unknown option: ${a}`)
    else opts._.push(a)
  }
  return opts
}

function toUrl(name, base) {
  return name.startsWith('http') ? name : `${base}/${name.replace(/\.json$/, '')}.json`
}

async function fetchJson(url) {
  let res
  try {
    res = await fetch(url)
  } catch (e) {
    throw new Error(`could not reach ${url} (${e.message})`)
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res.json()
}

// Fetch every requested item plus everything it (transitively) depends on.
async function collect(startUrls) {
  const items = new Map() // name -> item
  const visited = new Set()
  const queue = [...startUrls]
  while (queue.length) {
    const url = queue.shift()
    if (visited.has(url)) continue
    visited.add(url)
    const item = await fetchJson(url)
    if (!items.has(item.name)) items.set(item.name, item)
    for (const dep of item.registryDependencies || []) queue.push(dep)
  }
  return [...items.values()]
}

function targetDir(type, opts) {
  if (type === 'registry:lib') return opts.lib || 'src/lib'
  if (type === 'registry:ui') return opts.ui || 'src/components/ui'
  return 'src'
}

function detectPackageManager(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun'
  return 'npm'
}

async function add(opts) {
  const base = opts.registry || DEFAULT_REGISTRY
  const cwd = opts.cwd ? resolve(process.cwd(), opts.cwd) : process.cwd()

  let names = opts._
  if (opts.all) {
    const index = await fetchJson(`${base}/registry.json`)
    names = (index.items || []).filter((i) => i.type === 'registry:ui').map((i) => i.name)
  }
  if (!names.length) throw new Error('nothing to add — pass a component name or --all')

  console.log(c.dim(`Resolving ${names.length} component${names.length > 1 ? 's' : ''}…`))
  const items = await collect(names.map((n) => toUrl(n, base)))

  const written = []
  const skipped = []
  for (const item of items) {
    for (const file of item.files || []) {
      const dir = join(cwd, targetDir(file.type, opts))
      const dest = join(dir, basename(file.path))
      if (existsSync(dest) && !opts.overwrite) {
        skipped.push(dest)
        continue
      }
      mkdirSync(dir, { recursive: true })
      writeFileSync(dest, file.content)
      written.push(dest)
    }
  }

  for (const f of written) console.log(`  ${c.green('+')} ${relative(cwd, f)}`)
  for (const f of skipped) console.log(`  ${c.dim('•')} ${relative(cwd, f)} ${c.dim('(exists, --overwrite to replace)')}`)

  const deps = [...new Set(items.flatMap((i) => i.dependencies || []))]
  if (opts.install && deps.length) {
    const pm = detectPackageManager(cwd)
    const args = pm === 'npm' ? ['install', ...deps] : ['add', ...deps]
    console.log(c.dim(`\nInstalling deps with ${pm}: ${deps.join(', ')}`))
    const r = spawnSync(pm, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
    if (r.status !== 0) console.log(c.red(`\n${pm} exited with code ${r.status} — install the deps manually: ${deps.join(' ')}`))
  } else if (deps.length) {
    console.log(c.dim(`\nSkipped install. Dependencies: ${deps.join(' ')}`))
  }

  console.log(c.green(`\n✓ Done — ${written.length} file${written.length === 1 ? '' : 's'} written.`))
}

async function list(opts) {
  const base = opts.registry || DEFAULT_REGISTRY
  const index = await fetchJson(`${base}/registry.json`)
  const ui = (index.items || []).filter((i) => i.type === 'registry:ui')
  console.log(c.bold(`\n${index.name || 'verve'} — ${ui.length} components\n`))
  for (const i of ui) console.log(`  ${c.cyan(i.name.padEnd(20))} ${c.dim(i.description || i.title || '')}`)
  console.log(c.dim(`\nAdd one with:  npx @jettonn/verve@latest add <name>\n`))
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(HELP)
    return
  }
  if (command === '--version' || command === '-v') {
    console.log(pkg.version)
    return
  }

  const opts = parse(rest)
  if (command === 'add') return add(opts)
  if (command === 'list' || command === 'ls') return list(opts)

  throw new Error(`Unknown command: ${command}\nRun \`npx @jettonn/verve@latest --help\`.`)
}

main().catch((err) => {
  console.error(c.red(`\nverve: ${err.message}`))
  process.exit(1)
})
