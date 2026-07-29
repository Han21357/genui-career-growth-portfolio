# 职路成长 GenUI 作品集

这是一个面向非 K12 学习与职业成长场景的 GenUI 产品作品集，包含可交互 Demo 与市场、竞品及商业化分析。

## 作品内容

### 1. 职路成长 GenUI Demo

路径：[`demo/index.html`](demo/index.html)

GitHub Pages 中发布的是对外展示副本，已移除特定平台名称、品牌标识和可识别项目名。

核心设计：

- 以“目标诊断 → 理解建构 → 练习计划 → 实战转化”串联学习与职业成长。
- 新增“学习闭环 → 证据转译 → 职业闭环”的推荐演示故事线；它只是展示入口，四阶段 21 项功能卡仍可独立进入。
- 使用 Artifact 承载可操作、可验证、可继续的生成式界面。
- 将用户确认后的结果写回能力、计划、材料、面试与职业证据状态。
- 覆盖资料学习、岗位匹配、简历证据、模拟面试、模拟考试、阶段复盘等多类场景。
- 单文件纯 HTML/CSS/JavaScript 原型，无外部依赖，可直接本地运行。

设计与校验材料：

- [`docs/project-handoff.md`](docs/project-handoff.md)：项目定位、完整演示动线、产品机制、代码结构、验证与发布交接。
- [`docs/demo-storyline.md`](docs/demo-storyline.md)：对外演示故事线与元宝主模型进入 GenUI 的决策链。
- [`docs/ux-reference-audit.md`](docs/ux-reference-audit.md)：开源交互方案调研与采用边界。
- [`docs/ux-validation-report.md`](docs/ux-validation-report.md)：响应式、状态、可访问性与完整动线校验。

### 2. 非 K12 市场调研与商业化分析

路径：[`research/competitive-analysis.html`](research/competitive-analysis.html)

分析内容包括：

- 非 K12 学习与成长市场的竞品运营模式。
- 关键产品的功能机制与用户价值。
- 商业化路径、付费设计与增长逻辑。
- 对职路成长 GenUI 产品设计的市场依据与机会判断。

## 本地查看

直接用现代浏览器打开两个 HTML 文件即可。也可在仓库目录启动静态服务：

```bash
python3 -m http.server 8000
```

然后访问：

- Demo: `http://localhost:8000/demo/`
- 竞品分析: `http://localhost:8000/research/competitive-analysis.html`

## 仓库结构

```text
.
├── demo/
│   └── index.html
├── docs/
│   ├── demo-storyline.md
│   ├── project-handoff.md
│   ├── ux-reference-audit.md
│   └── ux-validation-report.md
├── research/
│   └── competitive-analysis.html
├── scripts/
│   └── validate-demo.mjs
└── README.md
```

## 说明

本仓库为公开作品集，用于产品方案展示、求职沟通与后续迭代。Demo 中的专业数据、案例与识别结果均为受控示例，不代表真实服务调用或个人结论。
