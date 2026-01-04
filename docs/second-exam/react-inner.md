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

**核心**: 允许渲染过程被 **中断** 和 **恢复**。

1.  **Concurrent Mode**: 不是一个具体的 API，而是一种底层能力。
2.  **特性**:
    - **useTransition**: 将某些更新标记为“非紧急”，允许高优先级更新插队。
    - **useDeferredValue**: 延迟更新某个值，类似防抖/节流。
    - **Streaming SSR**: 服务端流式渲染，渐进式展示页面。

:::

## React 协调 (Reconciliation) 流程

::: details 参考答案

1.  **Render 阶段** (可中断):
    - 遍历 Fiber 树，执行组件的 render 函数。
    - 对比新旧 Fiber 节点 (Diff)，打上标记 (EffectTag: Placement, Update, Deletion)。
    - 生成一棵新的 Fiber 树 (WorkInProgress Tree)。
2.  **Commit 阶段** (不可中断):
    - **Before Mutation**: 执行 `getSnapshotBeforeUpdate`。
    - **Mutation**: 执行 DOM 操作（增删改）。
    - **Layout**: DOM 更新完成，执行 `useLayoutEffect`, `componentDidMount`, `componentDidUpdate`。

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

React 实现了自己的调度器 **Scheduler**，而没有直接使用浏览器的 `requestIdleCallback` (rIC)。

**原因**:

1.  **兼容性**: rIC 只有部分浏览器支持。
2.  **触发频率不稳定**: rIC 的触发频率受很多因素影响（如切换 Tab），不稳定（可能 20fps）。
3.  **实现方式**: Scheduler 内部使用 **MessageChannel** 实现时间切片。
    - **MessageChannel**: 宏任务，执行时机比 `setTimeout(fn, 0)` 更快（4ms 延迟问题），且不会像微任务那样阻塞 UI 渲染。

:::

## React Lane 模型 (优先级机制)

::: details 参考答案

**Lane (车道) 模型** 是 React 用于管理任务优先级的机制。

1.  **位运算**: 使用 **二进制位 (Bit)** 来表示优先级。例如 `0b0001`、`0b0010`。
2.  **优势**: 位运算（与、或、非）速度极快，内存占用小。
3.  **原理**:
    - 不同的位代表不同的“车道”（优先级）。
    - 高优先级任务（如用户点击）会占用高位车道。
    - 调度器会优先处理高位车道的任务。

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
