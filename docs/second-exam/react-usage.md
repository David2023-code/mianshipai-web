# React 使用

React 是全球应用最广泛的框架，国内大厂多用 React

## React 组件生命周期

::: details 参考答案

React 组件生命周期主要分为三个阶段：**挂载**、**更新**、**卸载**。

**1. 类组件 (Class Component)**

- **挂载阶段 (Mounting)**:
  - `constructor()`: 初始化 state，绑定 methods。
  - `render()`: 计算 UI。
  - `componentDidMount()`: DOM 挂载完成，可进行 API 请求、订阅。
- **更新阶段 (Updating)**:
  - `render()`: 重新计算 UI。
  - `componentDidUpdate()`: 更新完成，可操作 DOM 或发起新的请求。
- **卸载阶段 (Unmounting)**:
  - `componentWillUnmount()`: 组件销毁前，清理定时器、取消订阅。

**2. 函数组件 (Function Component)**

函数组件没有生命周期钩子，使用 `useEffect` 模拟。

- **Mount (挂载)**: `useEffect(() => { ... }, [])`
- **Update (更新)**: `useEffect(() => { ... }, [dep])`
- **Unmount (卸载)**: `useEffect(() => { return () => { ... } }, [])`

:::

## React 父子组件生命周期调用顺序

::: details 参考答案

**挂载阶段**:

1.  父 `render`
2.  子 `render`
3.  子 `componentDidMount` (或 `useEffect`)
4.  父 `componentDidMount` (或 `useEffect`)

> **口诀**: 父组件先开始渲染，子组件先完成挂载。

**更新阶段**:

1.  父 `render`
2.  子 `render`
3.  子 `componentDidUpdate` (或 `useEffect`)
4.  父 `componentDidUpdate` (或 `useEffect`)

**卸载阶段**:

1.  父 `componentWillUnmount` (清理函数)
2.  子 `componentWillUnmount` (清理函数)
3.  子 `Unmounted`
4.  父 `Unmounted`

:::

## React 组件通讯方式

::: details 参考答案

1.  **父传子 (Props)**:
    - 父组件通过属性传递数据，子组件通过 `props` 接收。
2.  **子传父 (Callback)**:
    - 父组件传递一个函数给子组件，子组件调用该函数并传递数据。
3.  **跨层级 (Context)**:
    - `createContext` 创建上下文，`Provider` 提供数据，`useContext` (或 `Consumer`) 消费数据。
    - **场景**: 主题、用户信息、语言包。
4.  **Ref (引用)**:
    - 父组件使用 `useRef`，子组件使用 `forwardRef` + `useImperativeHandle` 暴露方法给父组件调用。
5.  **状态管理库**:
    - **Redux / Toolkit**: 单向数据流，适合大型应用。
    - **MobX**: 响应式，简单灵活。
    - **Zustand**: 轻量级，API 简洁 (推荐)。
6.  **EventBus (事件总线)**:
    - 使用 `pubsub-js` 等库进行发布订阅。
    - **注意**: 不推荐在 React 中频繁使用，难以追踪数据流。

:::

## state 和 props 有什么区别？

::: details 参考答案

| 特性       | Props (属性)         | State (状态)                     |
| :--------- | :------------------- | :------------------------------- |
| **来源**   | 父组件传递           | 组件自身定义 (useState)          |
| **可变性** | **只读** (Immutable) | **可变** (Mutable, via setState) |
| **作用**   | 组件间通信 (配置)    | 组件内部状态管理                 |
| **更新**   | 父组件重新渲染时更新 | 调用 setState 时更新             |

:::

## Class Component 和 Function Component 的区别

::: details 参考答案

1.  **思维模式**:
    - **Class**: 面向对象 (OOP)，关注**生命周期**和 `this`。
    - **Function**: 函数式编程 (FP)，关注**状态同步**和**副作用** (`useEffect`)。
2.  **状态管理**:
    - **Class**: `this.state` (对象)，`this.setState` (合并更新)。
    - **Function**: `useState` (独立变量)，`setState` (替换更新)。
3.  **逻辑复用**:
    - **Class**: HOC (高阶组件)、Render Props (渲染属性)，容易导致嵌套地狱。
    - **Function**: **Custom Hooks** (自定义 Hooks)，逻辑复用极其优雅。
4.  **性能**:
    - Function 组件通常更轻量，编译后代码更少。

> **官方推荐**: 新项目优先使用 **Function Component + Hooks**。

:::

## React 有哪些内置 Hooks ？

::: details 参考答案

可以按照功能分类：

1.  **状态管理**:
    - `useState`: 管理局部状态。
    - `useReducer`: 管理复杂状态 (类似 Redux)。
2.  **副作用**:
    - `useEffect`: 处理副作用 (API, DOM, 订阅)。
    - `useLayoutEffect`: DOM 更新后同步触发 (防闪烁)。
3.  **上下文**:
    - `useContext`: 消费 Context。
4.  **引用**:
    - `useRef`: 引用 DOM 或 存储不触发渲染的变量。
    - `useImperativeHandle`: 暴露实例方法给父组件。
5.  **性能优化**:
    - `useMemo`: 缓存计算结果 (值)。
    - `useCallback`: 缓存函数引用。
6.  **React 18 并发**:
    - `useTransition`: 标记非紧急更新。
    - `useDeferredValue`: 延迟更新值。
    - `useId`: 生成唯一 ID。

:::

## useEffect 和 useLayoutEffect 的区别

::: details 参考答案

1.  **执行时机**:
    - **useEffect**: **异步**执行，在浏览器**渲染 (Paint) 之后**。
    - **useLayoutEffect**: **同步**执行，在 DOM 更新后，浏览器**渲染之前**。
2.  **阻塞渲染**:
    - **useEffect**: 不阻塞，用户体验好。
    - **useLayoutEffect**: 会阻塞，可能导致页面卡顿。
3.  **应用场景**:
    - **useEffect**: 绝大多数场景 (API 请求、事件监听)。
    - **useLayoutEffect**: 需要在界面显示前测量 DOM 尺寸、修改 DOM 样式以避免**闪烁**时使用。

:::

## 为何 dev 模式下 useEffect 执行两次？

::: details 参考答案

**原因**: React **Strict Mode (严格模式)**。

在开发环境下 (Development)，React 会故意将组件挂载、卸载、再挂载一次，或者执行两次 Effect。

**目的**:
帮助开发者发现 **不纯的副作用** 或 **未正确清理的副作用** (如未清除定时器、未取消订阅)。

**解决**:
不需要解决，这是为了帮你找 Bug。生产环境 (Production) 不会执行两次。

:::

## React 闭包陷阱

::: details 参考答案

**现象**: 在 `useEffect` 或 `useCallback` 中访问到了**旧的 state**。

```js
const [count, setCount] = useState(0)

useEffect(() => {
  const timer = setInterval(() => {
    console.log(count) // 永远是 0
  }, 1000)
  return () => clearInterval(timer)
}, []) // 依赖为空
```

**原因**:
JS 函数闭包机制。Hook 回调函数创建时，捕获了当时的 `count` (0)。由于依赖数组为空，Effect 不会重新执行，回调函数也就不会重新创建，内部引用的 `count` 始终是初始值。

**解决**:

1.  **添加依赖**: `[count]` (会导致定时器频繁重置)。
2.  **函数式更新 (推荐)**: `setCount(prev => prev + 1)`。
3.  **使用 useRef**: Ref 的 `current` 属性是可变的，可以穿透闭包。

:::

## React state 不可变数据 (Immutable)

::: details 参考答案

**含义**: 永远不要直接修改 state (如 `state.arr.push(1)`), 而是创建一个新副本 (如 `[...state.arr, 1]`)。

**原因**:

1.  **性能**: React (尤其是 `memo`, `PureComponent`) 使用**浅比较** (Shallow Compare) 检测变化。如果对象引用没变，React 认为数据没变，不会触发更新。
2.  **可预测性**: 避免副作用，便于调试 (Time Travel)。

**实现**:

- **数组**: `concat`, `map`, `filter`, `slice`, 展开运算符 `...`。
- **对象**: `Object.assign`, 展开运算符 `...`。
- **工具库**: `Immer.js` (推荐，支持写可变语法，自动转为不可变), `Immutable.js`。

:::

## React state 异步更新与合并

::: details 参考答案

1.  **异步 (Batching)**:
    - React 会将多次 `setState` 合并为一次更新，以减少渲染次数，提高性能。
    - **React 18**: 引入**自动批处理 (Automatic Batching)**，无论在事件处理、Promise、setTimeout 中，都会自动合并更新。
2.  **合并**:
    - **类组件**: `this.setState` 会自动**浅合并** (Merge) 对象。
    - **函数组件**: `useState` 的 setter 是**直接替换** (Replace)。更新对象时需手动合并: `setUser({ ...user, name: 'New' })`。

:::

## 什么是 React 受控组件？

::: details 参考答案

**受控组件 (Controlled Component)**:
表单元素 (`input`, `select`) 的值由 React `state` 控制，并由 `onChange` 事件统一管理。

```jsx
<input value={text} onChange={(e) => setText(e.target.value)} />
```

**非受控组件 (Uncontrolled Component)**:
表单数据由 DOM 自身管理，通过 `useRef` 获取值。

:::

## 什么是 React Fiber？

::: details 参考答案

**React Fiber** 是 React 16 引入的新的**协调引擎 (Reconciliation Engine)**。

**核心目标**: 解决 JS 单线程长时间占用导致页面卡顿的问题。

**原理**:

1.  **任务分割**: 将渲染更新任务拆分为一个个小的 **Unit of Work (工作单元)**。
2.  **时间切片 (Time Slicing)**: 利用浏览器空闲时间 (`requestIdleCallback` / `Scheduler`) 执行任务。如果一帧内没时间了，就暂停任务，把控制权交还给浏览器响应用户操作，下一帧再继续。
3.  **优先级**: 为不同任务分配优先级 (如用户输入优先级 > 动画 > 数据更新)。

**架构**:

- **Scheduler**: 调度任务。
- **Reconciler**: 找出变化的组件 (Diff)，可中断。
- **Renderer**: 将变化渲染到页面 (Commit)，不可中断。

:::

## 什么是 Virtual DOM？

::: details 参考答案

**Virtual DOM (虚拟 DOM)** 是用 JavaScript 对象来模拟真实的 DOM 结构。

**价值**:

1.  **声明式编程**: 开发者只需关注数据状态，无需手动操作 DOM。
2.  **跨平台**: 虚拟 DOM 可以渲染到浏览器 (ReactDOM)、手机 App (React Native)、PDF 等。
3.  **性能优化 (Diff)**: 通过比较新旧 Virtual DOM，计算出最小变更，批量更新真实 DOM (虽然不一定比手动极致优化快，但保证了下限和开发效率)。

:::

## 使用 React Hook 实现 useCount

::: details 参考答案

```javascript
import { useState, useEffect } from 'react'

export function useTimer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return { count }
}
```

:::

## 使用 React Hook 实现 useRequest

::: details 参考答案

```javascript
import { useState, useEffect } from 'react'

export function useRequest(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false // 防止竞态条件

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed')
        const json = await res.json()
        if (!ignore) setData(json)
      } catch (err) {
        if (!ignore) setError(err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchData()
    return () => {
      ignore = true
    }
  }, [url])

  return { data, loading, error }
}
```

:::

## React 项目可做哪些性能优化？

::: details 参考答案

1.  **减少不必要的渲染**:
    - **React.memo**: 缓存组件，仅当 props 变化时渲染。
    - **useMemo**: 缓存复杂计算结果。
    - **useCallback**: 缓存函数引用，避免子组件无效重渲染。
    - **合理设置 State**: 避免将无关数据放入 state，避免在 render 中派生数据。
2.  **代码分割 (Code Splitting)**:
    - `React.lazy` + `Suspense`: 路由懒加载，组件懒加载。
3.  **列表优化**:
    - **Key**: 列表渲染必须设置唯一且稳定的 Key。
    - **虚拟列表**: `react-window` / `react-virtualized`，仅渲染可视区域 DOM。
4.  **其他**:
    - 避免在 render 中定义内联对象/函数 (导致引用变化)。
    - 使用 Production 构建版本。

:::

## 如何统一监听 React 组件报错

::: details 参考答案

1.  **Error Boundaries (错误边界)**:

    - 类组件实现 `componentDidCatch` 或 `getDerivedStateFromError`。
    - 只能捕获**渲染期间**、**生命周期**、**构造函数**中的错误。
    - **不能**捕获: 事件处理、异步代码、服务端渲染、Error Boundary 自身错误。

    ```jsx
    <ErrorBoundary fallback={<p>出错了</p>}>
      <App />
    </ErrorBoundary>
    ```

2.  **全局错误监听**:
    - `window.onerror`: 捕获 JS 运行时错误。
    - `window.onunhandledrejection`: 捕获 Promise 错误。

:::

## React 19 有哪些新特性？

::: details 参考答案

1.  **Actions**: 自动处理 Pending 状态、错误、乐观更新 (`useTransition` 增强)。
2.  **useOptimistic**: 更方便地实现乐观 UI 更新。
3.  **use API**: 在渲染中直接读取 Promise 或 Context (`const data = use(promise)`), 支持 Suspense。
4.  **Ref 增强**: `ref` 可以直接作为 prop 传递，不再需要 `forwardRef`。
5.  **Document Metadata**: 直接在组件中编写 `<title>`, `<meta>`。
6.  **Server Components**: 服务端组件更加成熟。

:::

## 简述 Redux 单向数据流

::: details 参考答案

**流程**:

1.  **View**: 用户触发操作。
2.  **Action**: `dispatch(action)` 发出指令。
3.  **Middleware**: 处理副作用 (如异步请求)。
4.  **Reducer**: `(oldState, action) => newState` 纯函数计算新状态。
5.  **Store**: 更新 State。
6.  **View**: 订阅 State 变化，重新渲染。

**特点**:

- **单一数据源 (Single Source of Truth)**。
- **State 只读 (Read-only)**: 只能通过 Action 修改。
- **Reducer 是纯函数**: 保证结果可预测。

:::

## 用过哪些 Redux 中间件？

::: details 参考答案

1.  **redux-thunk**:
    - 最常用。允许 Action 返回函数，用于处理简单的异步逻辑。
2.  **redux-saga**:
    - 基于 Generator，功能强大，适合复杂的异步流控制 (取消、竞态)。
3.  **redux-promise**:
    - 允许 Action 返回 Promise。
4.  **redux-logger**:
    - 日志记录。

:::

## 你用过哪些 React 状态管理库？

::: details 参考答案

1.  **Redux / Redux Toolkit (RTK)**:
    - **特点**: 行业标准，生态丰富，但样板代码多 (RTK 已简化很多)。
    - **场景**: 大型复杂应用。
2.  **Zustand**:
    - **特点**: 极简 API (Hook 风格)，无需 Provider，体积小。
    - **场景**: 中小型应用，现代 React 项目首选。
3.  **MobX**:
    - **特点**: OOP 风格，响应式自动更新，开发效率高。
    - **场景**: 习惯 Vue/OOP 的团队。
4.  **Recoil / Jotai**:
    - **特点**: Atomic (原子化) 状态管理，细粒度更新。
    - **场景**: 状态依赖关系复杂的应用。

:::

## 是否用过 SSR 服务端渲染？

::: details 参考答案

**SSR (Server-Side Rendering)**: 在服务端将 React 组件渲染成 HTML 字符串返回给浏览器。

**优势**:

1.  **SEO 友好**: 爬虫能直接抓取内容。
2.  **首屏加载快 (FCP)**: 用户无需等待 JS 下载执行即可看到页面。

**框架**:

- **Next.js**: React 官方推荐的生产级框架。提供了 SSR (服务端渲染)、SSG (静态生成)、ISR (增量静态再生) 等能力。
- **Remix**: 另一个流行的全栈 React 框架。

**原理**:

1.  **Server**: `renderToString` 生成 HTML。
2.  **Client**: `hydrateRoot` (注水) 绑定事件，接管页面。

:::

## 什么是 React 合成事件 (Synthetic Event)？

::: details 参考答案

**定义**:
React 不直接使用原生 DOM 事件 (如 `onclick`), 而是实现了一套跨浏览器的 **事件机制**，称为合成事件。

**特点**:

1.  **跨浏览器兼容**: 抹平了不同浏览器的差异。
2.  **性能优化**: 使用 **事件委托 (Event Delegation)**。
    - **React 16**: 绑定到 `document`。
    - **React 17+**: 绑定到 **Root 容器** (`#root`)。
3.  **统一接口**: 拥有与原生事件相同的接口 (如 `stopPropagation`, `preventDefault`)。

**注意**:
合成事件中不能直接通过 `return false` 阻止默认行为，必须显式调用 `e.preventDefault()`。

:::

## 什么是高阶组件 (HOC)？

::: details 参考答案

**定义**:
**HOC (Higher-Order Component)** 是一个 **函数**，它接收一个组件作为参数，并返回一个新的组件。
`const EnhancedComponent = withHOC(WrappedComponent);`

**作用**:
逻辑复用 (Reuse Logic)。

**常见例子**:

1.  **Redux**: `connect(mapStateToProps)(App)`
2.  **Router**: `withRouter(App)`
3.  **权限控制**: `withAuth(App)`

**缺点**:

1.  **嵌套地狱**: 多个 HOC 嵌套 (`withA(withB(withC(App)))`) 导致调试困难。
2.  **Props 冲突**: 容易覆盖原组件的 Props。
3.  **Ref 传递**: 需要特殊处理 (`React.forwardRef`)。

> **现状**: 大部分 HOC 场景已被 **Hooks** 取代。

:::

## React Portals (传送门) 有什么用？

::: details 参考答案

**定义**:
`ReactDOM.createPortal(child, container)` 可以将子节点渲染到 **父组件以外的 DOM 节点** (如 `body`) 中。

**场景**:

1.  **Modal (弹窗)**
2.  **Tooltip (提示框)**
3.  **Toast (消息通知)**

**特点**:
虽然 DOM 结构被移动到了外部，但在 React 组件树中，它仍然是父组件的子节点。因此 **事件冒泡 (Event Bubbling)** 仍然会沿着 React 组件树向上传递，而不是 DOM 树。

:::

## React.memo 和 useMemo 的区别？

::: details 参考答案

两者都用于性能优化，但对象不同。

1.  **React.memo**:

    - **对象**: **组件**。
    - **作用**: 类似于 `PureComponent`。如果组件的 **Props** 没有变化，则跳过渲染。
    - **使用**: `const MemoizedComponent = React.memo(MyComponent);`

2.  **useMemo**:
    - **对象**: **值 (Value)**。
    - **作用**: 缓存计算结果。只有当依赖项变化时才重新计算。
    - **使用**: `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

:::
