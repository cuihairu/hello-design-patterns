// 站内一致性巡检：侧栏 ↔ 文件、站内绝对链接、页面 H1。
// 用法：npm run docs:audit（不联网，纯 Node，无依赖）。
// 双语站：根=英文(root locale)，docs/zh/=中文(zh locale)。
// 骨架期英文页增量翻译，内容类检查只跑中文(完整)侧；英文侧跳过翻译中的死链。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const docs = join(root, 'docs')

function walk(dir, exclude) {
  return readdirSync(dir).flatMap((name) => {
    if (exclude.includes(name)) return []
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p, exclude) : p.endsWith('.md') ? [p] : []
  })
}

// root locale: docs/ excluding zh/, .vitepress, node_modules, review
const rootFiles = walk(docs, ['.vitepress', 'node_modules', 'review', 'zh'])
// zh locale: docs/zh/ excluding .vitepress, node_modules, review
const zhBase = join(docs, 'zh')
const zhFiles = walk(zhBase, ['.vitepress', 'node_modules', 'review'])

const rootPages = new Set(rootFiles.map((f) => '/' + relative(docs, f).replace(/\.md$/, '')))
const zhPages = new Set(zhFiles.map((f) => '/zh/' + relative(zhBase, f).replace(/\.md$/, '')))
const allPages = new Set([...rootPages, ...zhPages])

const errors = []

const config = readFileSync(join(docs, '.vitepress/config.mts'), 'utf8')

// 1. 侧栏链接 ↔ 实际文件
// 中文侧严格；英文侧翻译中的死链跳过(骨架期增量翻译)。
const homeLinks = new Set(['/', '/zh/'])
for (const [, link] of config.matchAll(/link: '(\/[^']*)'/g)) {
  if (homeLinks.has(link)) continue
  const normalized = link.replace(/\/$/, '')
  if (!allPages.has(normalized)) {
    if (!link.startsWith('/zh/')) continue
    errors.push(`sidebar link not on disk: ${link}`)
  }
}

// 2. 站内绝对链接可达
// 中文侧严格；英文侧骨架期跳过。
for (const f of zhFiles) {
  const text = readFileSync(f, 'utf8')
  for (const [, target] of text.matchAll(/\]\((\/[a-z0-9\-/]+)(?:#[^)]*)?\)/gi)) {
    const t = target.replace(/\/$/, '')
    if (!allPages.has(t)) errors.push(`${relative(root, f)}: broken link ${target}`)
  }
}

// 3. H1 存在（首页是 hero 布局、快照页是跳转页，豁免）
const h1Exempt = new Set([
  '/index',
  '/zh/index',
  '/behavioral/snapshot',
  '/zh/behavioral/snapshot'
])
for (const f of [...rootFiles, ...zhFiles]) {
  const page = f.startsWith(zhBase)
    ? '/zh/' + relative(zhBase, f).replace(/\.md$/, '')
    : '/' + relative(docs, f).replace(/\.md$/, '')
  if (h1Exempt.has(page)) continue
  if (!readFileSync(f, 'utf8').startsWith('# ')) errors.push(`${relative(root, f)}: missing H1`)
}

// 4. 各分区导读与参考索引覆盖该分区全部页面（快照跳转页豁免）— 中文侧
const coverageExempt = new Set(['/zh/behavioral/snapshot'])
const zhGroups = new Map()
for (const p of zhPages) {
  const dir = dirname(p)
  if (dir === '.' || dir === '/' || dir === '/zh') continue
  if (!zhGroups.has(dir)) zhGroups.set(dir, [])
  zhGroups.get(dir).push(p)
}
const zhIndexes = [
  [
    'docs/zh/reference.md',
    readFileSync(join(zhBase, 'reference.md'), 'utf8'),
    [...zhPages]
  ],
  ...[...zhGroups.entries()].map(([dir, list]) => {
    const ov = join(zhBase, dir.replace(/^\/zh/, ''), 'overview.md')
    if (!existsSync(ov)) errors.push(`missing overview: docs/zh/${dir.replace(/^\/zh/, '')}/overview.md`)
    return [
      `docs/zh/${dir.replace(/^\/zh/, '')}/overview.md`,
      existsSync(ov) ? readFileSync(ov, 'utf8') : '',
      list
    ]
  })
]
for (const [name, text, list] of zhIndexes) {
  const own = '/' + name.replace(/^docs\//, '').replace(/\.md$/, '').replace(/\/overview$/, '/overview')
  const linked = new Set(
    [...text.matchAll(/\]\((\/[a-z0-9\-/]+)(?:#[^)]*)?\)/gi)].map((m) => m[1].replace(/\/$/, ''))
  )
  for (const p of list) {
    if (
      coverageExempt.has(p) ||
      p.endsWith('/overview') ||
      p === '/zh/research/coverage' ||
      p === '/zh/index' ||
      p === own
    )
      continue
    if (!linked.has(p)) errors.push(`${name}: does not list ${p}`)
  }
}

// 5. coverage 页声明的计数与实际文件一致 — 中文侧
const cov = readFileSync(join(zhBase, 'research/coverage.md'), 'utf8')
const declared = [...cov.matchAll(/文档总数 (\d+)，模式正文 (\d+)/g)].pop()
const zhBodyPages = [...zhPages].filter((p) => {
  const dir = dirname(p)
  return (
    dir !== '.' &&
    dir !== '/' &&
    dir !== '/zh' &&
    !coverageExempt.has(p) &&
    !p.startsWith('/zh/research/') &&
    !p.endsWith('/overview')
  )
}).length
if (!declared) {
  errors.push('docs/zh/research/coverage.md: missing declared totals (文档总数 N，模式正文 M)')
} else {
  if (+declared[1] !== zhPages.size) errors.push(`docs/zh/research/coverage.md: declares 文档总数 ${declared[1]}, found ${zhPages.size}`)
  if (+declared[2] !== zhBodyPages) errors.push(`docs/zh/research/coverage.md: declares 模式正文 ${declared[2]}, found ${zhBodyPages}`)
}

// 6. knowledge 页声明的差异表 2b 行数与 coverage 表实际行数一致 — 中文侧
const b2Start = cov.indexOf('### 2b.')
const b2End = cov.indexOf('### 2c.')
const rows2b =
  b2Start >= 0 && b2End > b2Start
    ? cov.slice(b2Start, b2End).split('\n').filter((l) => l.startsWith('| ')).length - 2
    : -1
const declared2b = readFileSync(join(zhBase, 'knowledge.md'), 'utf8').match(/不新增的共 (\d+) 行/)
if (rows2b < 0) {
  errors.push('docs/zh/research/coverage.md: missing section 2b')
} else if (!declared2b) {
  errors.push('docs/zh/knowledge.md: missing declared 2b row count (不新增的共 N 行)')
} else if (+declared2b[1] !== rows2b) {
  errors.push(`docs/zh/knowledge.md: declares 2b rows ${declared2b[1]}, coverage has ${rows2b}`)
}

// 7. 侧栏反向覆盖：中文侧每页都要在侧栏里；英文侧骨架期跳过
const sidebarLinks = new Set(
  [...config.matchAll(/link: '(\/[^']*)'/g)].map((m) => m[1].replace(/\/$/, ''))
)
const zhSidebarExempt = new Set(['/zh/index', '/zh/behavioral/snapshot'])
for (const p of zhPages) {
  if (zhSidebarExempt.has(p)) continue
  if (!sidebarLinks.has(p)) errors.push(`zh page missing from sidebar: ${p}`)
}

// 8. 来源编号：用到的 [Sn] 都要登记在调研总览的来源清单里 — 中文侧
const overview = readFileSync(join(zhBase, 'research/overview.md'), 'utf8')
const definedSources = new Set([...overview.matchAll(/^- \[S(\d+)\] /gm)].map((m) => +m[1]))
const declSources = overview.match(/共 (\d+) 条/)
for (const f of [...rootFiles, ...zhFiles]) {
  for (const [, n] of readFileSync(f, 'utf8').matchAll(/\[S(\d+)\]/g)) {
    if (!definedSources.has(+n)) errors.push(`${relative(root, f)}: undefined source [S${n}]`)
  }
}
if (!declSources) {
  errors.push('docs/zh/research/overview.md: missing source count (共 N 条)')
} else if (+declSources[1] !== definedSources.size) {
  errors.push(`docs/zh/research/overview.md: declares ${declSources[1]} sources, listed ${definedSources.size}`)
}

// 9. 来源清单里的书籍在参考资料页都有书目条目 — 中文侧
const booksSection = overview.slice(overview.indexOf('### 书籍'), overview.indexOf('### 官方与社区文档'))
const refText = readFileSync(join(zhBase, 'reference.md'), 'utf8')
if (booksSection.length === 0) {
  errors.push('docs/zh/research/overview.md: missing 书籍 section in 来源清单')
} else {
  for (const [, title] of booksSection.matchAll(/^- \[S\d+\] .*?《([^》]+)》/gm)) {
    if (!refText.includes(title)) errors.push(`docs/zh/reference.md: missing book entry 《${title}》`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(
  `ok: ${zhPages.size} zh pages (${zhBodyPages} pattern), ${rootPages.size} root pages, sidebar, links, h1, sources, books`
)
