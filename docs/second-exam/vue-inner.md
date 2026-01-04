# Vue 原理

国内面试，大厂必考原理。

::: tip

1. 目标**不在**中大厂的同学，可以略过这一节。
2. 对 Vue 使用尚不熟练的同学，不要在此花费太多精力，先熟悉使用再说。

:::

## 什么是 MVVM

::: details 参考答案

**MVVM (Model-View-ViewModel)** 是一种架构模式，核心是将 **数据模型 (Model)** 和 **视图 (View)** 分离，并通过 **ViewModel** 进行连接。

1.  **Model (模型)**: 负责数据存储和业务逻辑（如后端 API 数据）。
2.  **View (视图)**: 负责页面展示（HTML/CSS）。
3.  **ViewModel (视图模型)**: Vue 的核心实例。它通过 **Data Binding (数据绑定)** 让 Model 的变化自动更新 View，通过 **DOM Listeners (事件监听)** 让 View 的交互自动修改 Model。

![](../imgs/vue/mvvm.png)

:::

## 什么是 VDOM，它和 DOM 有什么关系

::: details 参考答案

**Virtual DOM (虚拟 DOM)** 是用 JavaScript 对象来模拟真实的 DOM 结构。

**关系与作用**：

1.  **轻量级副本**：VDOM 是真实 DOM 的轻量级 JS 对象表示。
2.  **性能优化**：直接操作真实 DOM 代价高昂。Vue 通过比较新旧 VDOM 的差异（Diff 算法），计算出最小的更新路径，然后再去更新真实 DOM，从而提升性能。
3.  **跨平台**：VDOM 本质是 JS 对象，可以渲染到浏览器、Weex、小程序或 SSR 服务端。

:::

## 手写 VNode 对象

::: details 参考答案

Vue 的 `h` 函数（渲染函数）用于创建 VNode。

```javascript
// 目标 HTML
// <div class="container">
//   <img src="x1.png" />
//   <p>hello</p>
// </div>

// VNode 表示
const vnode = {
  type: 'div',
  props: { class: 'container' },
  children: [
    { type: 'img', props: { src: 'x1.png' } },
    { type: 'p', children: 'hello' },
  ],
}
```

:::

## Vue 组件初始化流程

::: details 参考答案

1.  **Init (初始化)**: 初始化生命周期、事件中心、Props、Data、Computed、Watch 等，并建立响应式系统。
2.  **Compile (编译)**: (如果使用 template) 将模板编译为 Render 函数。
3.  **Mount (挂载)**:
    - 执行 Render 函数生成 VNode。
    - 通过 Patch 算法将 VNode 转换为真实 DOM。
    - 将 DOM 挂载到页面上。

:::

## Vue 双向绑定原理

::: details 参考答案

Vue 的双向绑定主要由 **数据劫持** 和 **发布-订阅模式** 构成。

1.  **数据劫持 (Observer)**:
    - **Vue 2**: 使用 `Object.defineProperty` 劫持各个属性的 `getter` 和 `setter`。
    - **Vue 3**: 使用 `Proxy` 代理整个对象。
2.  **依赖收集 (Dep)**: 当渲染函数读取数据时，触发 `getter`，将当前的 Watcher（订阅者）加入到依赖列表中。
3.  **派发更新 (Watcher)**: 当数据变化时，触发 `setter`，通知依赖列表中的 Watcher 执行回调，从而更新视图。

![](../imgs/vue/数据绑定2.png)

:::

## Vue 模板编译原理

::: details 参考答案

模板编译是将 `template` 字符串转换为 `render` 函数的过程，主要分为三步：

1.  **Parse (解析)**: 将模板字符串解析为 **AST (抽象语法树)**。
2.  **Optimize (优化)**: 遍历 AST，标记 **静态节点** (Static Nodes)。Diff 算法会跳过静态节点，减少比较开销。
3.  **Generate (生成)**: 将优化后的 AST 转换为可执行的 **Render 函数** 代码字符串。

:::

## Vue 2 vs Vue 3 响应式原理

::: details 参考答案

**Vue 2 (Object.defineProperty)**

- **原理**: 递归遍历对象属性，设置 `getter/setter`。
- **缺点**:
  - 无法监听对象属性的新增和删除（需用 `Vue.set`）。
  - 无法监听数组下标和长度的变化（需重写数组方法）。
  - 初始化时递归遍历，性能开销大。

**Vue 3 (Proxy)**

- **原理**: 使用 ES6 `Proxy` 代理整个对象。
- **优点**:
  - 可以监听属性的新增、删除。
  - 可以监听数组下标和 length 变化。
  - **懒代理**: 只有访问嵌套对象时才进行代理，性能更好。

| 特性         | Vue 2 (Object.defineProperty) | Vue 3 (Proxy) |
| :----------- | :---------------------------- | :------------ |
| 动态增删属性 | ❌ (需 API)                   | ✅ 支持       |
| 数组下标修改 | ❌ (需 Hack)                  | ✅ 支持       |
| 性能         | ⚠️ 初始化递归                 | ✅ 懒代理     |
| 兼容性       | IE9+                          | 不支持 IE     |

:::

## v-for 为什么要用 key

::: details 参考答案

`key` 是 VNode 的唯一标识。

1.  **准确性 (Diff 算法核心)**: 在 Diff 过程中，Vue 通过 `key` 判断两个节点是否是同一个，从而决定是 **复用** 还是 **销毁重建**。
2.  **性能优化**: 有 `key` 可以最小化 DOM 操作。例如在列表头部插入一项，有 key 时只需移动 DOM，无 key 时可能需要更新所有后续 DOM。
3.  **状态维持**: 防止组件状态错乱（如输入框内容不对应）。

:::

## Vue Diff 算法原理

::: details 参考答案

Diff 算法用于比较新旧 VNode，找出最小变化。

**核心策略**:

1.  **同层比较**: 只比较同一层级的节点，不跨层级。
2.  **深度优先**: 递归比较子节点。

**Vue 2 (双端比较)**:

- 使用 4 个指针：旧头、旧尾、新头、新尾。
- 通过头头、尾尾、头尾、尾头 4 种方式匹配，尽可能复用节点。

**Vue 3 (快速 Diff)**:

- 预处理：先处理头尾相同的节点。
- 核心：对剩余的乱序部分，使用 **最长递增子序列 (LIS)** 算法，计算出最小移动路径。

:::

## Vue 3 做了哪些编译优化

::: details 参考答案

Vue 3 在编译阶段做了很多静态分析，以提升运行时性能：

1.  **静态标记 (PatchFlag)**: 编译时给动态节点打上标记（如 `TEXT`, `CLASS`），Diff 时只比较动态内容，跳过静态属性。
2.  **静态提升 (Static Hoisting)**: 将完全静态的节点提升到渲染函数外，只创建一次，重复使用。
3.  **事件缓存 (cacheHandlers)**: 缓存事件处理函数，避免每次渲染都重新创建函数导致子组件重新渲染。

:::

## Vue vs React Diff 算法区别

::: details 参考答案

1.  **比较策略**:
    - **Vue**: 双端比较 (Vue 2) / 快速 Diff (Vue 3)。更倾向于通过移动节点来复用。
    - **React**: 仅右移策略。如果节点数组中有元素移动，React 会将该元素后的所有元素重新渲染或移动（在 Fiber 架构下有优化，但核心 Diff 思想仍较简单）。
2.  **响应式粒度**:
    - **Vue**: 精确到组件级别。数据变化时，只有依赖该数据的组件会重新渲染。
    - **React**: 递归更新。状态变化时，默认从根组件向下递归更新所有子组件（需配合 `useMemo`, `React.memo` 优化）。

:::

## Vue 异步更新机制 (nextTick)

::: details 参考答案

**原理**:

1.  **异步队列**: Vue 更新 DOM 是异步的。数据变化时，Watcher 不会立即更新视图，而是开启一个队列，将 Watcher 推入（并去重）。
2.  **批量执行**: 在下一次 Event Loop (微任务或宏任务) 中，清空队列，执行更新。

**nextTick 作用**:

- 因为 DOM 更新是异步的，修改数据后立即获取 DOM 还是旧的。
- `$nextTick(callback)` 会将回调函数推入同一个微任务队列，确保在 DOM 更新完成后执行。

```javascript
this.message = 'new value'
console.log(this.$el.textContent) // 旧值
this.$nextTick(() => {
  console.log(this.$el.textContent) // 新值
})
```

:::

## Keep-alive 原理

::: details 参考答案

`keep-alive` 是 Vue 的内置组件，用于缓存组件实例。

1.  **缓存管理**: 内部维护一个 `Map` (LRU 算法) 存储已渲染的组件实例 (VNode)。
2.  **渲染逻辑**:
    - 首次渲染：将组件实例存入 Map。
    - 再次渲染：从 Map 中取出实例，直接复用，不走 mount 流程。
3.  **生命周期**:
    - `activated`: 组件被激活（从缓存取出）时触发。
    - `deactivated`: 组件被停用（放入缓存）时触发。

:::

## Ref 为什么需要 .value

::: details 参考答案

1.  **基本类型限制**: JS 的 `Proxy` 或 `Object.defineProperty` 只能代理 **对象**，无法拦截基本数据类型（String, Number 等）的读写。
2.  **包装对象**: 为了让基本类型也能响应式，Vue 将其封装在一个对象中，通常命名为 `value` 属性。
3.  **统一性**: `ref` 也可以包裹对象，此时 `.value` 指向该对象的 Proxy 代理。

:::

## Vue.use() 原理

::: details 参考答案

`Vue.use()` 用于安装 Vue 插件。

**原理流程**:

1.  **检查缓存**: 插件如果已经安装过，直接返回，避免重复安装。
2.  **处理参数**: 将 `Vue` 构造函数作为第一个参数，和其他参数合并。
3.  **执行安装**:
    - 如果插件是 **对象**，调用它的 `install` 方法。
    - 如果插件是 **函数**，直接执行该函数。
4.  **记录缓存**: 将插件标记为已安装。

```javascript
// 核心逻辑简写
Vue.use = function (plugin, ...args) {
  if (plugin.installed) return
  const newArgs = [this, ...args]
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, newArgs)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, newArgs)
  }
  plugin.installed = true
}
```

:::

## 组件 data 为什么必须是函数

::: details 参考答案

1.  **复用性**: 组件是可复用的。如果 `data` 是一个对象，对象是引用类型，那么所有组件实例将 **共享** 同一个 data 对象。修改一个实例的数据会影响所有实例。
2.  **隔离性**: 将 `data` 定义为函数，每次创建组件实例时，都会调用该函数返回一个新的 data 对象副本。这样每个实例都有自己 **独立** 的数据作用域，互不干扰。

> **根实例** (new Vue) 的 data 可以是对象，因为根实例通常只有一个，不需要复用。

:::

## Computed 和 Watch 的原理区别

::: details 参考答案

它们本质都是 `Watcher`，但类型和行为不同。

**Computed (计算属性)**:

1.  **Lazy Watcher**: 只有在被读取时才会计算（懒执行）。
2.  **缓存**: 内部有一个 `dirty` 标志。依赖变化时，仅将 `dirty` 设为 `true`，不会立即计算。下次读取时，若 `dirty` 为 true 才重新计算，否则直接返回缓存值。
3.  **场景**: 适合由多个值衍生出一个新值（一对多）。

**Watch (侦听器)**:

1.  **User Watcher**: 数据变化时，**立即** 执行回调。
2.  **无缓存**: 每次变化都会触发。
3.  **场景**: 适合执行异步操作或开销较大的副作用（多对一）。

:::

## Scoped CSS 的实现原理

::: details 参考答案

Vue 通过 **PostCSS** 实现组件样式隔离。

1.  **添加属性**: 给组件内的 DOM 元素添加一个唯一的自定义属性 (如 `data-v-xxxx`)。
2.  **转换选择器**: 编译 CSS 时，给选择器末尾加上该属性选择器。

```css
/* 源码 */
.example {
  color: red;
}

/* 编译后 */
.example[data-v-f3f3eg9] {
  color: red;
}
```

这样，样式就只会应用到当前组件带有该属性的元素上，实现了隔离。

:::

## Vue Router 的原理 (Hash vs History)

::: details 参考答案

Vue Router 核心是监听 URL 变化并渲染对应的组件，且 **不刷新页面**。

**1. Hash 模式 (默认)**:

- **URL**: `http://yoursite.com/#/home`
- **原理**: 基于 `window.onhashchange` 事件。
- **特点**: `#` 后面的内容不会发送给服务器，兼容性好，无需后端配置。

**2. History 模式**:

- **URL**: `http://yoursite.com/home`
- **原理**: 基于 HTML5 `history.pushState` 和 `history.replaceState` 修改 URL，通过 `window.onpopstate` 监听浏览器前进/后退。
- **特点**: URL 美观。但需要 **后端配置** 支持 (如 Nginx 将所有 404 请求指向 `index.html`)，否则刷新页面会报 404 错误。

:::
