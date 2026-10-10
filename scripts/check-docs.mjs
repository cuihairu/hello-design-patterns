// 站内一致性巡检：侧栏 ↔ 文件、站内绝对链接、页面 H1。
// 用法：npm run docs:audit（不联网，纯 Node，无依赖）。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const docs = join(root, 'docs')

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name === '.vitepress' || name === 'node_modules') return []
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
  })
}

const files = walk(docs)
const pages = new Set(files.map((f) => '/' + relative(docs, f).replace(/\.md$/, '')))
const errors = []

// 1. 侧栏链接 ↔ 实际文件
const config = readFileSync(join(docs, '.vitepress/config.mts'), 'utf8')
for (const [, link] of config.matchAll(/link: '(\/[^']*)'/g)) {
  if (link !== '/' && !pages.has(link.replace(/\/$/, ''))) {
    errors.push(`sidebar link not on disk: ${link}`)
  }
}

// 2. 站内绝对链接可达
for (const f of files) {
  const text = readFileSync(f, 'utf8')
  for (const [, target] of text.matchAll(/\]\((\/[a-z0-9\-/]+)(?:#[^)]*)?\)/gi)) {
    const t = target.replace(/\/$/, '')
    if (!pages.has(t)) errors.push(`${relative(root, f)}: broken link ${target}`)
  }
}

// 3. H1 存在（快照页是跳转页、首页是 hero 布局，豁免）
const h1Exempt = new Set(['/index', '/behavioral/snapshot'])
for (const f of files) {
  const page = '/' + relative(docs, f).replace(/\.md$/, '')
  if (h1Exempt.has(page)) continue
  if (!readFileSync(f, 'utf8').startsWith('# ')) errors.push(`${relative(root, f)}: missing H1`)
}

// 4. 各分区导读与参考索引覆盖该分区全部页面（快照跳转页豁免）
const coverageExempt = new Set(['/behavioral/snapshot'])
const groups = new Map()
for (const p of pages) {
  const dir = dirname(p)
  if (dir === '.' || dir === '/') continue
  if (!groups.has(dir)) groups.set(dir, [])
  groups.get(dir).push(p)
}
const indexes = [
  ['docs/reference.md', readFileSync(join(docs, 'reference.md'), 'utf8'), [...pages]],
  ...[...groups.entries()].map(([dir, list]) => {
    const ov = join(docs, dir, 'overview.md')
    if (!existsSync(ov)) errors.push(`missing overview: docs/${dir}/overview.md`)
    return [`docs/${dir}/overview.md`, existsSync(ov) ? readFileSync(ov, 'utf8') : '', list]
  })
]
for (const [name, text, list] of indexes) {
  const own = '/' + name.replace(/^docs\//, '').replace(/\.md$/, '').replace(/\/overview$/, '/overview')
  const linked = new Set([...text.matchAll(/\]\((\/[a-z0-9\-/]+)(?:#[^)]*)?\)/gi)].map((m) => m[1].replace(/\/$/, '')))
  for (const p of list) {
    if (coverageExempt.has(p) || p.endsWith('/overview') || p === '/research/coverage' || p === '/index' || p === own) continue
    if (!linked.has(p)) errors.push(`${name}: does not list ${p}`)
  }
}

// 5. coverage 页声明的计数与实际文件一致（口径见该页「计数口径」）
const cov = readFileSync(join(docs, 'research/coverage.md'), 'utf8')
const declared = [...cov.matchAll(/文档总数 (\d+)，模式正文 (\d+)/g)].pop()
const bodyPages = [...pages].filter((p) => {
  const dir = dirname(p)
  return dir !== '.' && dir !== '/' && !coverageExempt.has(p) && !p.startsWith('/research/') && !p.endsWith('/overview')
}).length
if (!declared) {
  errors.push('docs/research/coverage.md: missing declared totals (文档总数 N，模式正文 M)')
} else {
  if (+declared[1] !== pages.size) errors.push(`docs/research/coverage.md: declares 文档总数 ${declared[1]}, found ${pages.size}`)
  if (+declared[2] !== bodyPages) errors.push(`docs/research/coverage.md: declares 模式正文 ${declared[2]}, found ${bodyPages}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`ok: ${pages.size} pages (${bodyPages} pattern), sidebar, links, h1`)
