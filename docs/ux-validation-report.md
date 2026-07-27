# Career GenUI 前端体验校验报告

校验日期：2026-07-28  
构建标识：`career-genui-ux-polish-20260728-0122`

## 结论

本轮改动通过静态、交互、响应式、可访问性与完整动线校验。故事线作为新增的推荐演示入口存在，没有替代或删除能力全集：四阶段能力导航仍保留 4 + 9 + 4 + 4 共 21 张可见功能卡，内部 22 个能力 ID、APP_STATE、reducer、dispatch、Artifact、localStorage、Sheet、全屏工作台、撤销、重置、清空与状态写回机制均继续存在。

## 自动化静态校验

运行：

```bash
node scripts/validate-demo.mjs
```

结果：27 项全部通过，包括：

- `demo/` 中只有 `index.html` 一个公开 HTML；
- 内联 JavaScript 可成功解析；
- 静态 DOM ID 无重复；
- 21 项可见能力入口和四阶段导航完整；
- 十阶段故事线与能力全集并存；
- 场景区无“原型、开发者、Demo、Prompt”等研发口吻；
- 元宝主模型 → 文本判断 → GenUI 准入 → Artifact Plan → Schema 校验 → 执行 → 确认写回 → 回到主模型链条完整；
- APP_STATE、reducer、dispatch、localStorage、Sheet、全屏、撤销、重置、清空等关键机制保留；
- 响应式变量、焦点样式和减少动态效果规则存在。

## 响应式画幅

| 视口 | 手机宽×高 | 上/下留白 | 手机宽高比 | 报告区宽 | 横向溢出 |
|---|---:|---:|---:|---:|---:|
| 1280×720 | 367×704 | 8 / 8 | 0.5208 | 675 | 0 |
| 1366×768 | 392×752 | 8 / 8 | 0.5208 | 722 | 0 |
| 1440×900 | 460×884 | 8 / 8 | 0.5208 | 763 | 0 |
| 1536×1024 | 525×1008 | 8 / 8 | 0.5208 | 816 | 0 |
| 1920×1080 | 554×1064 | 8 / 8 | 0.5208 | 1027 | 0 |

桌面布局保持手机 45%、报告 55% 的结构意图；手机始终接近满高，比例稳定，页面无横向溢出。

## 交互校验

| 校验项 | 结果 |
|---|---|
| 自动体验完整跑完十阶段 | 通过；最终进入“完整成长路径已形成” |
| 自动体验重复首条用户消息 | 通过；完整运行仅出现 1 次首条目标消息 |
| Thinking 状态 | 通过；`aria-live="polite"`，高度 34px，持续时间被限制在 1.2–1.8 秒 |
| 暂停 | 通过；暂停后 2.2 秒状态、Artifact 数量不变，Thinking 节点为 0 |
| 恢复 | 通过；保留已有 Artifact，不重复创建当前阶段能力卡 |
| 手动模式 | 通过；等待 7.2 秒仍停留在第 1 阶段，点击“下一阶段”后才进入第 2 阶段 |
| 连续五次重置 | 通过；最终 Artifact 0、Thinking 0、暂停/恢复控件 0，回到初始故事线入口 |
| 本地状态恢复 | 通过；刷新前后聊天 Artifact 数量与内容一致 |
| Sheet 焦点 | 通过；打开后焦点进入关闭按钮，Escape 关闭并恢复到“修改每周时间”触发按钮 |
| 运行策略与技术架构正文 | 通过；可见正文最小字号均为 12px |
| 功能全集 | 通过；21 个唯一 `data-open-feature` 入口，阶段分布 4 / 9 / 4 / 4 |
| 控制台与 Promise 异常 | 通过；完整自动动线后 warning/error 为 0 |

## 视觉校验图

- [初始态 1440×900](validation-screenshots/01-initial-1440.png)
- [初始态 1920×1080](validation-screenshots/02-initial-1920.png)
- [AI Thinking 状态](validation-screenshots/03-thinking.png)
- [材料学习阶段](validation-screenshots/04-material.png)
- [模考与阶段复盘](validation-screenshots/05-exam-review.png)
- [面试训练阶段](validation-screenshots/06-interview.png)
- [职业证据沉淀](validation-screenshots/07-evidence.png)
- [完整自动体验完成态](validation-screenshots/08-final.png)

## 参考与边界

- 开源交互参考及采用/不采用说明见 [ux-reference-audit.md](ux-reference-audit.md)。
- 对外演示叙事与主模型决策链见 [demo-storyline.md](demo-storyline.md)。
- 当前仍是单文件前端作品，不连接真实模型、文件解析、麦克风或后端状态服务；界面内已避免把未连接能力描述成真实已执行结果。
