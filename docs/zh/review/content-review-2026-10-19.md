# 结构改动内容复核（2026-10-19）

## 复核范围

先执行 `git fetch origin && git pull --rebase origin main`，结果为 `Already up to date`；复核前工作区干净。以仓库真实历史最近 4 个提交为范围（含审计报告提交；不只限 A/B/C 三个功能提交）：

- `4bbcef7` Add structure audit report
- `0393e70` Clarify sidebar as navigation source（A）
- `00d887b` Consolidate repeated source facts（B）
- `23bb79d` Align homepage with notes scope（C）

范围差异：`HEAD~4..HEAD` 共 7 个文件变化，新增结构审计报告 1 份；没有 `SUMMARY.md`。本报告在复核提交中新增，审计脚本将 `docs/review/` 排除在站点页计数之外。

## 四项核查

### 1. 内容丢失 — 未发现明确丢失

- B 的唯一删除内容在 `docs/knowledge.md:115`。前版本为“来源编号 S1–S28 的完整清单在[调研总览]……”，现版本为“来源编号与书籍出版信息以[调研总览的来源清单]……为准”。删除的是重复出现的范围数字 S1–S28，不是来源条目；权威页 `docs/research/overview.md:31-33` 仍声明“共 28 条”，且 `:37` 起保留带编号的完整来源清单。该页脚注/引用口径也仍在 `:84-87`。因此此处是去重，没有证据表明信息未迁移。
- 逐看 diff 的其他删除行为均为短文案替换或末尾换行规范化；没有被删的段落、整条页面或正文条目需要补回。B 没有删除或移动 Markdown 正文页。
- 仓库没有 `SUMMARY.md`，本范围也没有大幅精简导航清单的改动。
- 计数复核：`npm run docs:audit` 报 `87 pages (68 pattern)`；独立文件计数为排除 `docs/review/` 后 87 篇 Markdown，`docs/*.md` 根页 5 篇。正文分区目录为 anti-patterns 6、behavioral 15、concurrency 12、creational 9、evolution 7、integration 5、other 7、research 5、structural 16，合计 82；加根页 5 为 87。`docs/public/` 有静态资源目录，不是 Markdown 目录或正文分区。

### 2. 表述被改错 — 发现 1 处审计报告事实写错，已修

- README 的范围定位改为个人笔记/游戏开发者视角：`README.md:20`、`README.zh.md:20`。新旧文案都列 C++、Java、Go；没有数字或篇数声称，也没有把某技术能力的“支持/不支持”方向改反。首页 `docs/index.md:5-7` 改标题和定位，示例语言仍列 C++、Java、Go。
- 明确错误位于被复核提交新增的 `docs/review/structure-audit-2026-10-19.md` 原 `:128`：旧句称“首页原称‘兼顾 Python、C#’”。逐字查看父版本 `docs/index.md`（`23bb79d^`）可见原句实际是“涵盖 C++、Java、Go 多语言实现，从基础概念到实战应用”，没有 Python 或 C#。这句错误地描述了改动前状态。已在独立修复提交 `c7c8eb4` 改为准确说明首页定位变化而语言清单前后相同；修订后见 `docs/review/structure-audit-2026-10-19.md:128`。
- 新增简介 `docs/introduction.md:3` 将用途清单称为快速定位，并区分术语定义与正文实现。抽查其锚点和目标：创建型标题锚点存在，术语链接落到单例词条，正文链接落到 `docs/creational/singleton.md`，主题匹配。代理相关链接在本 diff 中没有改写。

### 3. 链接与导航 — 自动检查通过，抽样目标匹配

- A 没有更改侧栏条目或路由，仅在 README 加入侧栏配置链接及维护说明（`README.md:28`、`README.zh.md:28`）；链接目标 `docs/.vitepress/config.mts` 存在。`scripts/check-docs.mjs` 新增对 `review` 目录的排除（diff 行 `scripts/check-docs.mjs:11`），没有改松 sidebar、站内链接或标题校验规则。
- 执行 `npm run docs:audit`：`ok: 87 pages (68 pattern), sidebar, links, h1, sources, books`。该检查核对侧栏页面与文件、内部链接和文档覆盖。配置中抽查的创建型、结构型、行为型、并发、调研入口均指向同主题文件；没有新增或删除侧栏条目。
- 人工目标抽查：简介的单例速览指向单例术语定义与单例正文；来源权威链接指向含 S1–S28 的调研来源清单。未发现“目标存在但主题不符”。
- 未核实：全部外部 URL 当前可访问性、所有 Markdown 锚点的渲染器差异，以及完整站点构建行为；本次未运行 `docs:build`。审计脚本通过不代表这些范围已验证。

### 4. 结论分类

- **没问题的方面：** 未发现 B 删除独有内容、导航文件缺失、侧栏链接指向错误主题、README/首页数字失实，或技术含义被改反。来源数字已去重但权威清单完整；样本导航目标匹配；`docs:audit` 通过。
- **有问题的方面：** 结构审计报告错误描述了首页旧文案（见上文）。已直接修正，修复提交 `c7c8eb4 Correct homepage audit note`，未改写任何被复核提交历史。
- **未核实：** 外链在线状态、全部锚点渲染和生产构建；原因是本次采用仓库审计脚本及人工抽样，没有运行构建或逐个探测外网链接。
- **须用户拍板：** 无。本次发现属于可由父版本直接证实的事实错误，不涉及有争议的删并取舍。

## 问题清单

| 严重度 | 问题与证据 | 是否已修 | 修复提交 |
|---|---|---|---|
| 低 | 审计报告把首页旧语言清单误写为 Python、C#；父版本 `docs/index.md` 实际为 C++、Java、Go。 | 是 | `c7c8eb4` |

## 验收结论

发现 1 处问题，已修复；未发现内容丢失或改动中的链接错指。就发现的问题而言已清零。**修复后的结构改动可视为已验收**；外链、全部锚点渲染和构建仍属未核实范围。
