# React 原理

国内面试，大厂必考原理。

::: tip

1. 目标**不在**中大厂的同学，可以略过这一节。
2. 对 React 使用尚不熟练的同学，不要在此花费太多精力，先熟悉使用再说。

:::

## JSX 的本质是什么？

::: details 参考答案

JSX 是 JavaScript 的语法扩展，其本质是 `React.createElement` 的语法糖。

1.  **编译**: JSX 会被 Babel 编译为 `React.createElement(type, props, children)` 调用（React 17+ 是 `_jsx`）。
2.  **执行**: 执行后生成 **React Element**（一个普通的 JS 对象，即虚拟 DOM）。
3.  **渲染**: React 根据这个虚拟 DOM 树来更新真实的 DOM。

```javascript
// JSX
const el = <div className="box">Hello</div>

// 编译后
const el = React.createElement('div', { className: 'box' }, 'Hello')
```

:::

## React Fiber 架构原理

::: details 参考答案

Fiber 是 React 16 引入的新的协调引擎，核心是为了解决 **CPU 瓶颈** 导致的页面卡顿问题。

1.  **可中断渲染**: 将渲染任务拆分为一个个小的 **工作单元 (Unit of Work)**。
2.  **时间切片 (Time Slicing)**: 在浏览器空闲时间执行任务（基于 `requestIdleCallback` 或 Scheduler）。如果当前帧没有时间了，就暂停任务，把控制权交还给浏览器，避免阻塞主线程。
3.  **优先级调度**: 区分任务优先级（如用户交互优先级 > 数据获取优先级）。高优先级任务可以打断低优先级任务。
4.  **链表结构**: Fiber 节点之间通过 `child` (子), `sibling` (兄), `return` (父) 指针构成链表，方便随时中断和恢复遍历。

:::

## Fiber 节点和普通 VNode 的区别

::: details 参考答案

1.  **数据结构**:
    - **VNode**: 树形结构，只描述 UI。
    - **Fiber**: 链表结构，不仅描述 UI，还包含 **任务调度**（优先级、过期时间）和 **状态**（memoizedState）信息。
2.  **遍历方式**:
    - **VNode**: 递归遍历 (Stack Reconciler)，一旦开始无法中断，直到整棵树遍历完成。
    - **Fiber**: 循环遍历 (Fiber Reconciler)，可以随时中断、恢复。

:::

## React Diff 算法原理

::: details 参考答案

React 的 Diff 算法采用了 **分层比较** 策略，将复杂度从 O(n^3) 降低到 O(n)。

**三大策略**:

1.  **Tree Diff**: 只比较同层级的节点。如果一个节点跨层级移动，React 不会复用，而是销毁并重建。
2.  **Component Diff**:
    - 如果是同一类型的组件，继续比较其子树。
    - 如果不是同一类型，直接销毁原组件，创建新组件。
3.  **Element Diff** (核心):
    - **无 key**: 按索引顺序比较。
    - **有 key**: 通过 Map 映射，快速找到 key 相同的节点进行复用。
    - **移动策略**: 只有当新节点的 `lastIndex` (访问过的最大索引) 大于当前旧节点的 `index` 时，才需要移动，否则保持不动。**(React 采用仅右移策略)**

:::

## React vs Vue Diff 算法区别

::: details 参考答案

1.  **比较策略**:
    - **Vue**: 双端比较 (Vue 2) / 快速 Diff (Vue 3)。更倾向于通过移动节点来复用。
    - **React**: 仅右移策略。如果节点数组中有元素移动，React 会将该元素后的所有元素重新渲染或移动。
2.  **响应式粒度**:
    - **Vue**: 精确到组件级别。数据变化时，只有依赖该数据的组件会重新渲染。
    - **React**: 递归更新。状态变化时，默认从根组件向下递归更新所有子组件（需配合 `useMemo`, `React.memo` 优化）。
3.  **静态优化**:
    - **Vue**: 编译时有静态标记 (PatchFlag)，Diff 时跳过静态节点。
    - **React**: 主要依靠运行时 Diff，缺乏编译时的静态优化 (React Compiler 正在解决这个问题)。

:::

## 为什么列表需要 Key

::: details 参考答案

`key` 是 React 识别列表项的唯一标识。

1.  **Diff 核心依据**: 在 Diff 过程中，React 通过 `key` 判断新旧节点是否是同一个，从而决定是 **复用**、**移动** 还是 **重建**。
2.  **性能优化**: 没有 key 或 key 不稳定（如用 index），会导致节点无法复用，频繁销毁重建，性能下降。
3.  **状态保持**: 如果 key 变了，组件会被销毁重建，内部状态（如输入框内容）会丢失。

:::

## React 事件机制 (合成事件)

::: details 参考答案

React 没有直接将事件绑定到 DOM 元素上，而是实现了一套 **合成事件 (SyntheticEvent)** 系统。

1.  **事件委托**:
    - **React 16**: 绑定到 `document`。
    - **React 17+**: 绑定到 React 应用的 **根容器** (rootNode)。
    - 利用事件冒泡，统一在根容器处理所有事件。
2.  **合成事件对象**: 抹平了不同浏览器的兼容性差异，提供统一的 API。
3.  **批量更新**: 在事件处理函数中，React 会自动合并多个 setState，只触发一次渲染 (Batch Update)。

:::

## setState 是同步还是异步的

::: details 参考答案

**React 18 之前**:

- **异步**: 在 React 合成事件、生命周期中是异步的（批处理）。
- **同步**: 在原生 DOM 事件、`setTimeout`、`Promise` 中是同步的。

**React 18 及以后**:

- **默认异步**: 开启了 **自动批处理 (Automatic Batching)**，无论在合成事件、原生事件还是定时器中，`setState` 都是异步的（合并更新）。
- **强制同步**: 使用 `flushSync(() => { ... })` 可以强制同步执行。

:::

## React 批处理 (Batch Update) 机制

::: details 参考答案

**原理**:

1.  **锁机制**: React 内部有一个 `isBatchingUpdates` 标记。
2.  **合并**: 当触发事件时，React 将此标记设为 true。此时所有的 `setState` 不会立即更新，而是将状态存入队列。
3.  **执行**: 事件执行结束后，React 检查标记，统一处理队列中的状态，进行一次性渲染。

**React 18 改进**:

- 引入 `createRoot` 后，支持所有场景（包括 Promise, setTimeout）的自动批处理。

:::

## React 18 并发机制 (Concurrency)

::: details 参考答案

一句话：并发机制让 React 在一次渲染里可以“先保交互、后补细节”，渲染任务可 **打断/续跑/重做**，从而避免卡主线程。

面试背诵版（3 句）：

1. 目标：把“CPU 忙导致的卡顿”变成“渐进可用”，优先响应输入与动画。
2. 手段：Render 阶段可中断，React 用优先级调度不同更新，低优先级让位给高优先级。
3. 结果：用户先看到可交互的 UI，耗时更新与数据展示可以延后或分段呈现。

关键点拆解：

1. 这不是多线程
   - JS 还是单线程执行，并发指的是“可中断的调度模型”，不是同时跑多个 render。
2. 发生在哪里
   - 主要发生在 **Render 阶段**（可中断、可重做）；**Commit 阶段**仍然是一次性、不可中断的 DOM 提交。
3. 怎么区分优先级
   - React 内部把更新分成不同优先级（如输入/点击更高，列表过滤、搜索结果刷新可更低），调度时允许“高优先级插队”。
4. 你能用到哪些能力（常见 API/特性）
   - `startTransition` / `useTransition`：把一类更新标记为“非紧急”，保证输入等紧急更新更快完成。
   - `useDeferredValue`：把某个值的更新延后，让 UI 先保持流畅。
   - `Suspense`：在数据/代码未就绪时先展示 fallback，配合并发实现更平滑的加载体验。
   - `createRoot`：开启 React 18 的新根（并发能力的基础入口）。

一句话场景：输入框驱动大列表过滤时，用 transition/defer 让“输入不掉帧”，列表结果稍后更新。

:::

## React 协调 (Reconciliation) 流程

::: details 参考答案

一句话：协调就是“算出要怎么改 + 真的去改”，对应 **Render（计算）** 和 **Commit（提交）** 两阶段。

面试背诵版（口诀）：

- Render：遍历 Fiber → Diff 对比 → 打标记 → 生成 WIP 树（可中断）
- Commit：BeforeMutation → Mutation → Layout（不可中断）

1. Render 阶段（可中断，做计算）

   - 做什么：从 root 开始遍历 Fiber，执行组件函数/`render`，拿到下一次 UI 描述。
   - Diff 怎么比：同层比较为主（type + key），能复用则复用，不能复用就新建/删除。
   - 产出什么：生成 workInProgress Fiber 树，并把副作用收集成标记（常见：Placement / Update / Deletion）。

2. Commit 阶段（不可中断，做落地）
   - Before Mutation：DOM 变更前的读取类工作（如 `getSnapshotBeforeUpdate`）。
   - Mutation：真正执行 DOM 增删改，应用副作用。
   - Layout：DOM 更新完成后，同步执行布局相关副作用（如 `useLayoutEffect`、类组件的 `componentDidMount/Update`）。

常见追问点（用一句话回答）

- 为什么 Render 可中断、Commit 不可中断：Render 只是计算，打断最多重新算；Commit 直接改 DOM，打断会让 UI 处于不一致的中间态。
- key 的意义：让同层 Diff 更稳定，减少不必要的卸载/重建与状态错位。

:::

## Hooks 为什么不能在条件/循环中调用

::: details 参考答案

**链表顺序依赖**:

1.  **存储结构**: 函数组件的状态（useState, useEffect 等）是存储在 Fiber 节点的 `memoizedState` 属性上的，结构是一个 **单向链表**。
2.  **执行逻辑**: 每次渲染时，React 严格按照 Hooks 定义的 **顺序** 依次读取链表中的状态。
3.  **后果**: 如果在条件或循环中调用，导致 Hooks 的执行顺序或数量发生变化，React 就无法正确对应上之前的状态，导致状态错乱或报错。

:::

## useEffect 原理

::: details 参考答案

1.  **收集**: 在组件 Render 阶段，遇到 `useEffect`，会创建一个 Effect 对象（包含回调、依赖项），并挂载到 Fiber 节点的 `updateQueue` 链表上。
2.  **执行**:
    - **Commit 阶段**: React 完成 DOM 更新。
    - **异步调度**: 通过 `Scheduler` 或 `requestIdleCallback` 异步调度 Effect 的执行。
    - **执行回调**: 浏览器绘制完成后，执行 `useEffect` 的回调函数。
3.  **依赖比较**: 每次渲染时，对比新旧依赖项 (浅比较 `Object.is`)，如果有变化，才执行回调。

> `useLayoutEffect` 是在 DOM 更新后 **同步** 执行的，会阻塞浏览器绘制。

:::

## React Scheduler 原理 (为什么不用 requestIdleCallback)

::: details 参考答案

一句话：Scheduler 是 React 自己的“任务调度器”，用可控的时间片 + 优先级队列，把渲染工作切成小块执行，确保输入/动画等高优先级任务更快响应。

面试背诵版（3 句）：

1. 目标：别让一次渲染把主线程占满，保证 60fps 交互流畅。
2. 手段：把更新任务放进队列，按优先级挑任务做；每次只做一小段（时间片），做不完就让出主线程。
3. 结果：高优先级（输入/点击）可以插队，低优先级（列表刷新/搜索结果）延后执行。

为什么不用 `requestIdleCallback`（记 4 点）：

1. 兼容性不够：并非所有浏览器稳定支持。
2. 时机不可控：是否“空闲”由浏览器决定，触发频率和延迟波动大（切后台 Tab 时更明显）。
3. 精度不够：idle 回调给到的剩余时间不稳定，容易导致任务执行颗粒度不可预测。
4. 语义不匹配：React 需要“按优先级调度 + 可被高优先级打断”，而 rIC 只表达“有空再做”。

Scheduler 怎么做（记 2 点）：

1. 用 `MessageChannel` 触发宏任务循环，避免 `setTimeout` 的最小延迟与抖动问题。
2. 通过 `shouldYield()` 判断是否该让出主线程：到时间片边界就暂停，把剩余工作留到下一轮继续。

:::

## React Lane 模型 (优先级机制)

::: details 参考答案

一句话：Lane 模型就是用“位掩码”表示一组更新的优先级与状态，让 React 能用极低成本挑出“现在该做谁”。

面试背诵版（口诀）：

- Lane=位：一位一个车道（优先级）
- 合并=或：多个更新合成一组待处理车道
- 取最高=找最低位 1：永远先处理最高优先级车道

核心概念（抓 4 个词）：

1. Lane（车道）：一个二进制位，代表一种优先级的更新。
2. Lanes（车道集合）：一堆 Lane 的组合（位掩码），表示当前有哪些更新在排队。
3. 选优先级：从 Lanes 中取出最高优先级那条 Lane，优先执行。
4. 合并/清除：更新来了用“或”合并到 pending；处理完用“与非”清掉对应位。

为什么要用 Lane（对比旧的 expirationTime 思路）：

- 多优先级并存：同一时刻既可能有“输入更新”，也可能有“数据刷新”，需要并存并可插队。
- 位运算高效：合并、比较、选择都是 O(1) 的位运算，适合高频调度。
- 配合并发：Render 可中断/重做时，Lane 能准确表达“这次渲染处理哪些更新”。

和 Scheduler 的关系（一句话）

- Scheduler 决定“什么时候让出主线程、时间片怎么切”；Lane 决定“在这一轮里先做哪些更新”。

:::

## useState 的实现原理

::: details 参考答案

1.  **本质**: `useState` 是 `useReducer` 的语法糖。
2.  **更新队列**: 调用 `setState` 时，不会立即修改 state，而是创建一个 **Update 对象**，并将其加入到该 Hook 的 **UpdateQueue** 链表中。
3.  **计算**: 在下一次 Render 阶段，React 会遍历 UpdateQueue，基于旧的 state 依次执行更新，计算出新的 state。

:::

## React Context 原理

::: details 参考答案

Context 用于跨层级传递数据。

1.  **Provider**: 内部维护一个 `value`。
2.  **Consumer (useContext)**: 订阅 Context 的变化。
3.  **传播机制**: 当 Provider 的 `value` 发生变化时，React 会从 Provider 向下深度优先遍历 Fiber 树。
    - 找到所有消费了该 Context 的组件。
    - 强制标记这些组件为“待更新”，即使它们的父组件使用了 `React.memo` 阻断了更新。

:::

## Error Boundary (错误边界) 原理

::: details 参考答案

错误边界是 React 组件，用于捕获子组件树中的 JS 错误。

1.  **API**: 实现了 `static getDerivedStateFromError` (渲染降级 UI) 或 `componentDidCatch` (记录日志) 的类组件。
2.  **捕获范围**: 只能捕获 **渲染期间**、**生命周期** 和 **构造函数** 中的错误。
3.  **无法捕获**:
    - 事件处理函数 (需用 try-catch)。
    - 异步代码 (setTimeout, Promise)。
    - 服务端渲染 (SSR)。
    - 自身抛出的错误。

:::
