# Career GenUI 前端交互参考审查

> 调研日期：2026-07-28  
> 调研目标：为单文件、无外部运行依赖的 Career GenUI Demo 提供可验证的交互设计参考。  
> 采用原则：只借鉴交互模式和状态管理思想，全部以原生 HTML/CSS/JavaScript 重写，不复制框架实现。

## 结论先行

本轮采用 6 类模式：

1. **单一滚动所有权**：聊天区只有一个控制器负责锚定底部，用户主动向上滚动后暂停自动跟随。
2. **显式生成状态**：用户消息、thinking、回复/Artifact 分帧出现，状态可取消、可恢复、可读屏。
3. **受控转场生命周期**：阶段切换统一经过“进入、执行、确认、完成、清理”，禁止分散 timer 互相竞争。
4. **弹层焦点闭环**：打开 Sheet/全屏后焦点进入，Escape 关闭，关闭后焦点回到触发按钮。
5. **局部更新优先**：状态变化不重建整个聊天列表，避免布局跳动和滚动位置丢失。
6. **减少动态效果偏好**：在 `prefers-reduced-motion` 下取消非必要转场和持续动画。

不采用 React、Vue、Svelte、Web Components 或任何组件库运行时，也不直接复制参考项目源码。

## 参考项目

### 1. assistant-ui/assistant-ui

- 仓库：[assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui)
- 调研快照：11,274 Stars；最近推送 2026-07-27
- License：MIT
- 实际查看：
  - [`apps/docs/components/docs/assistant/thread.tsx`](https://github.com/assistant-ui/assistant-ui/blob/main/apps/docs/components/docs/assistant/thread.tsx)
- 值得参考：
  - Thread、Viewport、Messages、ViewportFooter 被拆成明确区域。
  - 输入区作为 sticky footer，消息区独立滚动。
  - 通过专门的 ScrollToBottom 控件表达“自动跟随已暂停”。
- 原生重写：
  - 保留一个 `.chat` 滚动根节点和一个 Scroll Controller。
  - 输入区继续固定在手机底部，不参与聊天区高度动画。
- 是否采用：**采用模式，不采用代码**。
- 未直接采用原因：项目依赖 React primitive 与运行时状态，超出单文件边界。

### 2. vercel/chatbot

- 仓库：[vercel/chatbot](https://github.com/vercel/chatbot)
- 调研快照：20,686 Stars；最近推送 2026-07-08
- License：Apache-2.0
- 实际查看：
  - [`hooks/use-scroll-to-bottom.tsx`](https://github.com/vercel/chatbot/blob/main/hooks/use-scroll-to-bottom.tsx)
  - [`components/chat/message-reasoning.tsx`](https://github.com/vercel/chatbot/blob/main/components/chat/message-reasoning.tsx)
- 值得参考：
  - 同时记录 `isAtBottom` 与 `isUserScrolling`，只有用户仍在底部时才自动跟随。
  - MutationObserver 与 ResizeObserver 都汇总到同一个滚动入口。
  - reasoning/streaming 是明确状态，而不是把“结果卡”与用户消息同时插入。
- 原生重写：
  - 使用 `ResizeObserver` 监听聊天区内容尺寸，但最终滚动由单一调度函数执行。
  - thinking 作为稳定高度消息节点，结束后再替换为 AI 回复。
- 是否采用：**采用**。
- 未直接采用原因：参考实现依赖 React hooks；本项目改写为可取消的原生控制器。

### 3. vercel/ai

- 仓库：[vercel/ai](https://github.com/vercel/ai)
- 调研快照：25,839 Stars；最近推送 2026-07-27
- License：Apache-2.0
- 实际查看：
  - [`packages/react/src/use-chat.ts`](https://github.com/vercel/ai/blob/main/packages/react/src/use-chat.ts)
- 值得参考：
  - 生成过程公开 `status`、`error`、`stop`、`resumeStream`，交互层不需要猜测模型是否正在运行。
  - 中断和恢复是一等能力。
- 原生重写：
  - Guided Journey 统一维护 `idle / user_message / thinking / artifact / awaiting_user / completed / paused` 状态。
  - pause、restart、manual switch 统一取消 timer 和 thinking 节点。
- 是否采用：**采用状态思想**。
- 未直接采用原因：Demo 不接真实流式 API，不需要引入 SDK。

### 4. radix-ui/primitives

- 仓库：[radix-ui/primitives](https://github.com/radix-ui/primitives)
- 调研快照：19,098 Stars；最近推送 2026-07-25
- License：MIT
- 实际查看：
  - [`packages/react/dialog/src/dialog.tsx`](https://github.com/radix-ui/primitives/blob/main/packages/react/dialog/src/dialog.tsx)
  - `packages/react/focus-scope/src/focus-scope.tsx`
- 值得参考：
  - Dialog 明确管理 `aria-expanded`、`aria-controls`、焦点捕获和关闭后的焦点恢复。
  - Overlay、DismissableLayer、FocusScope 各自职责清楚。
- 原生重写：
  - 记录最后一个触发按钮。
  - Sheet/全屏打开后聚焦首个可操作项，Escape 关闭，关闭后恢复焦点。
  - 使用 `role="dialog"`、`aria-modal="true"` 和可读标题。
- 是否采用：**采用**。
- 未直接采用原因：无需引入 React primitives；原生 DOM 足以覆盖 Demo 的弹层场景。

### 5. tailwindlabs/headlessui

- 仓库：[tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui)
- 调研快照：28,675 Stars；最近推送 2026-04-13
- License：MIT
- 实际查看：
  - [`packages/@headlessui-react/src/components/transition/transition.tsx`](https://github.com/tailwindlabs/headlessui/blob/main/packages/@headlessui-react/src/components/transition/transition.tsx)
- 值得参考：
  - 父子 transition 有统一的进入/退出边界。
  - 离场完成前不卸载节点，避免闪断。
  - transition 可整体关闭，但状态生命周期仍可工作。
- 原生重写：
  - 统一 Transition Controller，先更新状态，再安排最小 DOM 变化。
  - reduced motion 只关闭动效，不跳过业务阶段。
- 是否采用：**采用生命周期思想**。
- 未直接采用原因：Tailwind class orchestration 与 React context 不适合当前单文件原型。

### 6. shoelace-style/shoelace

- 仓库：[shoelace-style/shoelace](https://github.com/shoelace-style/shoelace)
- 调研快照：13,856 Stars；最近推送 2026-05-14
- License：MIT
- 实际查看：
  - [`src/components/drawer/drawer.component.ts`](https://github.com/shoelace-style/shoelace/blob/next/src/components/drawer/drawer.component.ts)
- 值得参考：
  - Drawer 在动画前移除 autofocus，避免 Safari 自动滚动导致抖动。
  - 使用 `focus({ preventScroll: true })`。
  - 动画完成后再发出 after-show/after-hide，并恢复触发器焦点。
- 原生重写：
  - Sheet 打开后下一帧聚焦，且 `preventScroll`。
  - 关闭后恢复触发按钮，不额外改变聊天滚动。
- 是否采用：**采用**。
- 未直接采用原因：不引入 Web Components 运行时。

### 7. mckaywrigley/chatbot-ui

- 仓库：[mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)
- 调研快照：33,316 Stars；最后推送 2024-08-03
- License：MIT
- 实际查看：
  - [`components/chat/chat-hooks/use-scroll.tsx`](https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-scroll.tsx)
- 值得参考：
  - 生成中只有在用户未主动向上滚动时才保持底部。
  - `isAutoScrolling` 用于区分产品触发滚动和用户滚动。
- 原生重写：
  - 用 `programmatic` 标志防止滚动事件反向修改用户意图。
- 是否采用：**部分采用**。
- 未完全采用原因：
  - 仓库维护活跃度低于其他参考。
  - 参考实现使用延迟 `scrollIntoView`，本项目改为容器级 `scrollTo`，避免多个节点竞争滚动。

## 采用矩阵

| 问题 | 采用模式 | 本项目实现 |
|---|---|---|
| 用户消息与结果同帧出现 | 显式生成状态 | user message → thinking 1.2-1.8s → AI/Artifact |
| 自动播放像幻灯片 | 可中断状态机 | 每阶段有用户意图、AI 判断、界面任务、确认结果 |
| 聊天区抖动 | 单一滚动所有权 | 一个 Scroll Controller + 用户滚动保护 |
| Sheet/全屏可访问性不足 | 焦点闭环 | 初始焦点、Escape、焦点恢复 |
| timer 残留 | stop/resume 生命周期 | 统一 registry，pause/restart/manual 全量清理 |
| 动画影响布局 | transition boundary | 只做 opacity/clip，active 不做 transform/尺寸动画 |
| 框架过重 | 思路迁移 | 全部原生重写，无运行时依赖 |

## 明确不采用

- 不引入 React、Vue、Svelte、Tailwind、Radix、Headless UI、Shoelace 或 Vercel AI SDK。
- 不复制任何组件源代码。
- 不使用持续运行的 `requestAnimationFrame`。
- 不用自动 smooth scroll 掩盖布局不稳定。
- 不把“思考过程”伪装成模型真实 CoT，只展示面向用户的进度状态。

