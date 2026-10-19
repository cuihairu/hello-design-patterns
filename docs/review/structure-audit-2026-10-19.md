# hello-design-patterns 目录与内容组织审计（2026-10-19）

审计范围：源 Markdown 与 `docs/.vitepress/config.mts`，排除 `docs/.vitepress/dist` 构建产物。未改动现有文档与配置。目录行数按文件换行符计，去除结尾换行差异可能相差 1 行。

## 量化事实

### docs 下一级目录与文档量

| 下一级目录 | Markdown 数 | 总行数 |
|---|---:|---:|
| anti-patterns | 6 | 633 |
| behavioral | 15 | 3,262 |
| concurrency | 12 | 1,949 |
| creational | 9 | 1,885 |
| evolution | 7 | 787 |
| integration | 5 | 473 |
| other | 7 | 1,187 |
| research | 5 | 522 |
| structural | 16 | 3,098 |
| 根页（docs/*.md） | 5 | 1,083 |
| **合计** | **87** | **14,879** |

### 组织轴盘点

按内容功能归并为 **4 套组织轴**；不是四套互斥目录，而是分类正文加导航/索引等辅助入口：

| 组织轴/目录 | 条目数 | 命名规律 | 有无编号 | 编号是否连续 |
|---|---:|---|---|---|
| 模式分类正文：`creational`、`structural`、`behavioral`、`concurrency`、`other`、`integration`、`anti-patterns`、`evolution` | 77 篇（含 8 篇 overview） | 小写英文目录；文件用小写 kebab-case；每分区 `overview.md` 加主题页 | 文件名无序号；简介页分类清单局部编号 | 不适用文件名；`docs/introduction.md:19-220` 各分类清单均从 1 连续编号至末项，重新起号是分组编号，不是断档 |
| 导航与入门：根页 `index.md`、`introduction.md`、各分区 `overview.md` | 1 首页 + 1 简介 + 8 导读（与上一轴的 overview 重叠） | 英文文件路径，中文显示标题 | 无 | 不适用 |
| 交叉索引/知识参考：`knowledge.md`、`glossary.md`、`reference.md` | 3 | 描述性单页文件名 | 无 | 不适用 |
| 调研证据：`research/` | 5 | 小写 kebab-case，overview/books/coverage 等职能名 | 无；来源 ID 为 S1–S28 | 连续性按文档自检，`docs/research/overview.md`；`docs:audit` 通过 |

本仓库没有独立的 API 文档轴或 history/changelog 轴（数量 0）；`docs/reference.md` 是参考资料索引，不是 API 参考。`docs/review` 本报告是新增审计归档目录，当前此前不存在。

### 编号核查

- 文件路径未采用数字前缀，因此不存在文件序号跳号、重复或断档。
- 正文编号仅在 `docs/introduction.md` 的分类条目使用：创建型 1–8（19–52 行）、结构型 1–11（60–101 行）、行为型 1–13（107–155 行）、并发 1–11（163–198 行）、其他 1–6（204–220 行），各自连续，无重复项；不同分类从 1 重新编号是合理分组。
- 结论：未发现编号断档/跳号/重复。文内大量有序列表（如 `docs/creational/object-pool.md:28`）是步骤或利弊条目，不应当作全站章节编号。

### 侧边栏与文件对账

检查依据：`docs/.vitepress/config.mts:27-195` sidebar；源页集合 87 篇。配置中的页面链接均存在，**配置了但文件不存在：0 条**。反向对账有 2 个文件不在 sidebar：

| 文件 | 原因/判断 |
|---|---|
| `docs/index.md` | VitePress 首页由根路径 `/` 展示，配置不需要显式列为侧栏项；预期豁免 |
| `docs/behavioral/snapshot.md` | 备忘录/快照同义跳转页，overview 与 reference 明确交叉链接；作为兼容落点不进目录合理（`docs/behavioral/overview.md:17`、`docs/reference.md:154`） |

不存在缺失文件的已配置链接；配置条目中的根链接 `/` 映射首页约定，不算缺文件。侧栏总量适合做列表导航，问题主要在体量，不在失配。

### 命名、主题交叉与杂散

1. **轻度命名不一致（低）**：正文路径统一为小写英文 kebab-case，但显示标题中英文/大小写混合，如 `docs/concurrency/future.md:1` 的 `Future 模式`、`docs/creational/singleton.md:1` 的中文标题、`docs/behavioral/dsl.md` 的 DSL；属于术语表达差异，不是文件系统命名混乱。`docs/behavioral/snapshot.md` 为额外同义词路径，且没有采用 overview 中“模式”后缀的标题风格（`docs/behavioral/overview.md:17`）。
2. **主题重复呈现（中）**：主题分别在正文、简介、分区导读、知识点/术语/参考索引出现，属于不同用途的重复入口；例如单例出现在 `docs/creational/singleton.md`、`docs/introduction.md:19`、`docs/creational/overview.md:8`、`docs/glossary.md:7`、`docs/reference.md:44`。代理族横跨 `docs/structural/proxy.md`、`remote-proxy.md`、`virtual-proxy.md`、`protection-proxy.md`、`dynamic-proxy.md`、`remote-facade.md`，并由概览/索引交叉链接（`docs/introduction.md:68-71,101`；`docs/structural/overview.md:10-14`）。这是索引层级的多处呈现，不等于重复正文；概览说明边界，正文讲实现，现状基本有意。
3. **小主题不对称（低）**：`docs/behavioral/snapshot.md` 仅 22 行，而同目录其余正文多篇在 200 行以上；该页是指向备忘录正文的别名/跳转落点，薄页符合兼容入口用途（`docs/behavioral/snapshot.md`、`docs/behavioral/overview.md:17`）。
4. **根目录文件（低）**：根有 `README.md` 与 `README.zh.md` 两份语言入口，属合理双语仓库说明，不是重复 README；文档主体统一在 `docs/`。未发现根级临时 `*.tmp`、备份 `*~` 或非 docs 的其他 Markdown（除这两份 README）。构建产物在 `docs/.vitepress/dist/`，受 `.gitignore` 管理且不属于源内容统计口径。
5. **跨文档主题相似（低/需区分）**：模式总览与参考/术语页都会提及具体模式，这是导航、定义、书目索引各自职责造成；如 `docs/knowledge.md:3` 明确说明与 research、glossary 的分工。暂未找到必须合并的重复正文证据。

### 死链与检查结果

运行 `npm run docs:audit`，结果：`ok: 87 pages (68 pattern), sidebar, links, h1, sources, books`。脚本 `scripts/check-docs.mjs` 覆盖侧栏↔文件、站内绝对链接、H1、overview/reference 覆盖、coverage 计数、S 来源登记及书目对照；因此这些范围内**未发现死链**。它不扫描外链是否仍在线、Markdown 相对链接或所有锚点是否存在，这些未核实。未运行构建，以免触碰仓库内已跟踪的 `docs/.vitepress/dist` 文件。

## 问题清单与严重度

| 严重度 | 证据 | 判断 |
|---|---|---|
| 中 | `docs/.vitepress/config.mts:27-195`；`docs/introduction.md:19-220`；`docs/reference.md:37-100` | 入口清单多处呈现，维护时存在更新不同步风险；当前 `docs:audit` 与分区导读覆盖检查通过，属于维护成本而非当前导航故障。 |
| 中 | `docs/structural/overview.md:10-20`；`docs/structural/proxy.md`、`remote-proxy.md`、`dynamic-proxy.md` 等；`docs/reference.md:58-66` | 代理变体及远程外观分散在结构型分类内多个页面，读者要跨页辨析；overview/reference 已建立关系链接，分散符合按模式拆页，是否合并要看教学目标。 |
| 低 | `docs/behavioral/snapshot.md`；`docs/behavioral/overview.md:17`；`docs/reference.md:154` | 快照作为备忘录别名单独占页会让目录扫描显得多一项，但它作为稳定跳转/搜索入口有兼容价值。 |
| 低 | 根目录 `README.md`、`README.zh.md`；`docs/concurrency/future.md:1`、`docs/creational/singleton.md:1` | 中英文与术语大小写表现不同，但路由命名已统一且两份 README 对应语言，不值得为了表面一致全局改名。 |

## 判断与推荐

现有可辨识的组织轴为 **4 套**；建议概念上收敛为 **3 套**，而非把所有内容硬压进单一分类：

1. **主题知识库**：保留按模式/架构主题分区的正文（含 integration、anti-patterns、evolution）；这是主要分类轴，读者按领域找内容，目录与分区导读一致。
2. **阅读导航**：首页、简介、分区 overview 和侧边栏视为同一导航轴；区分首页入口、概览索引与逐页导航，避免将它们误判为三套互相竞争的分类。
3. **证据与索引**：将 research、knowledge、glossary、reference 视为辅助索引轴，各自职责为来源核验、综合结论、术语定义、书目/延伸阅读。现阶段可保持分文件，因为用户目标不同。

推荐保留目前物理目录布局，后续优先降低重复清单的维护风险（自动校验或以单一目录源生成导航）；不建议仅因“看起来重复”就合并模式正文或删除索引页。未发现编号失序、侧栏断链或根目录杂乱等高严重度结构缺陷。

### 其实不乱、不用动

- 八个主题目录使用稳定英文目录名，绝大多数正文文件用小写 kebab-case，按主题归类明确。
- 八个分区均有 overview；侧栏分组与分类相匹配，配置路径全部存在，audit 通过。
- 分类目录的局部编号连续；无数字文件名前缀造成的断号。
- 首页、简介、分区导读、知识点、术语表、参考、调研并非同一内容的简单复制；它们分别服务导航、背景说明、主题选择、综合理解、术语查询、书目追溯、来源核查。
- `README.md` / `README.zh.md` 是双语入口；首页与快照页不在侧栏有合理原因。
- 当前可自动检查的内部链接、页面标题和索引覆盖均通过，不需要为整理而大规模移动文件。

## 三期收口方案

| 阶段 | 动作清单 | 影响范围 | 链接/搜索/外链风险 | 用户拍板 |
|---|---|---|---|---|
| 一期：机械整理（≤1 小时） | 先补一份维护说明，明确三套概念轴及目录/命名约定；在 docs audit 中记录首页与快照的预期豁免；盘点待修复的大小写/拼写，仅修正文案，不批量改路由。现状 audit 已通过，所以不需要机械搬目录。 | `docs/review`、可能的 `scripts/check-docs.mjs`，如实施；本次审计不修改后者。 | 低；不改路径，无外链影响；只增说明页时应决定是否链接侧栏。 | 是：是否把维护说明纳入公开站点/侧栏；本次仅报告，不执行。 |
| 二期：侧栏与重定向 | 若决定保留别名页，显式记录 snapshot 是兼容入口；必要时整理侧栏次序/长分组；若改路径，使用 VitePress redirects 并维护旧 URL。现配置匹配完整，无必需变更。 | `docs/.vitepress/config.mts`、受影响页面、部署重定向规则。 | 中到高：路由变化会影响搜索索引、书签及外链；须保留旧 URL 或提供重定向。 | **必须拍板**：是否将 snapshot 纳入菜单、侧栏是否需拆组、旧路由兼容策略。 |
| 三期：内容深度重构 | 评估 `introduction.md` 是否由正文/overview 自动生成；评估代理族是否按阅读路径重排；决定快照页并入 memento 或保留别名；明确 research/knowledge/reference/glossary 的长期边界。之后才考虑合并/拆分章节。 | 简介、分类 overview、代理相关正文、索引页及可能的 canonical URL。 | 高：删并页面会影响搜索收录、锚点和外链；需逐 URL 映射、迁移链接并保留历史落点。 | **必须拍板**：受众与讲解深度、哪些页面成为 canonical、是否允许章节合并/删除、兼容周期。 |

## 最该先做的三件事

1. 保持主题目录结构，建立“正文—导读—索引”职责约定；不要先搬目录。
2. 将 `docs:audit` 作为改侧栏/改路由的门槛，并明确首页与 snapshot 两个豁免的理由，减少今后误报。
3. 在任何合并前先拍板别名与 URL 兼容政策；重点审阅代理族与 snapshot，不删除已经可被外链引用的落点。

## 收口执行记录（2026-10-19）

### A：导航真源

- 未发现 `SUMMARY.md` 或其他手写全站导航副本；`docs/.vitepress/config.mts` 是侧栏定义（约 27–195 行），README 中明确其为权威源并要求新增/移动页面时更新侧栏（`README.md:27`、`README.zh.md:28`）。
- 对 sidebar 内 86 个根路径链接计数，86 个唯一，重复链接 0；不改侧栏路由。
- `scripts/check-docs.mjs` 遍历站点页时跳过 `docs/review/` 内部审计归档，以维持审计既有的 87 页站点口径；其侧栏、站内链接、标题和覆盖校验未放宽。

### B：跨轴重复二分及证据

| 组 | 分类/动作 | 两处文本证据与角度 |
|---|---|---|
| 来源清单数量 | **真重复，1 组**。`docs/research/overview.md:33` 保留“共 28 条”及完整清单作为唯一权威；`docs/knowledge.md:115` 改为“来源编号与书籍出版信息以[调研总览的来源清单](/research/overview#来源清单)为准”，不再复制数字。前者维护来源登记，后者讲知识结论。 |
| 单例 | **不同角度，保留**。`docs/introduction.md:21` 写“确保一个类只有一个实例”和数据库连接池等用途，作为分类用途速览；`docs/glossary.md:7` 写“保证一个类只有一个实例”，配英文术语、出处及正文入口，作为术语查询；实现细节留在 `docs/creational/singleton.md`。`docs/introduction.md:9` 标明速览与术语表/正文角度不同并互链。 |
| 代理 | **不同角度，保留**。`docs/introduction.md:70-73` 写统一意图并列出四变体，供分类定位；`docs/structural/overview.md:27` 给选择建议，`docs/glossary.md:89-91` 给术语定义，`docs/structural/proxy.md:3` 展开访问控制与调用前后行为。简介中的变体链接指向各自正文，概览也链接代理页；职责与结论不同，不硬并。 |

本次确认 **合并真重复 1 组，保留不同角度 2 组**；不删除 Markdown 页面或改变 URL。

### C：文案和条目对账

- `README.md` 与 `README.zh.md` 没有篇数或目录逐项清单，无需修数字/删不存在目录；口径改为个人笔记与开发者分享，见 `README.md:20,28`、`README.zh.md:20,28`。
- 首页原称“兼顾 Python、C#”，与实际展示的 C++、Java、Go 示例不符；改为只列实际示例语言，见 `docs/index.md:5-7`。
- 侧栏没有过期“第 N 讲”或篇数注释；配置条目缺文件 0；重要 overview 均在侧栏中。构建及审计均通过。
