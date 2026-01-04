# Vue 使用

[Vue](https://cn.vuejs.org/) 是国内最普及的前端框架，面试考察概率最高。

## 🔥Vue3 和 Vue2 的区别有哪些？说几个主要的

Vue 3 提供了更现代化、更高性能的架构，相比 Vue 2，主要优势如下：

::: details 参考答案

1.  **性能更强**:
    - **重写虚拟 DOM**: 优化 Diff 算法（静态标记 PatchFlag），只对比动态节点。
    - **静态提升**: 静态节点会被提升到渲染函数外，只创建一次。
2.  **Composition API (组合式 API)**:
    - 解决了 Option API (Vue 2) 在大型项目中逻辑分散、难以复用的问题。
    - 代码按 **逻辑关注点** 组织，更易维护和复用 (Hooks)。
3.  **响应式系统升级**:
    - **Vue 3 (Proxy)**: 可以监听对象属性增删、数组索引修改，性能更好（懒代理）。
    - **Vue 2 (Object.defineProperty)**: 初始化时递归遍历，性能开销大，且有监听局限性。
4.  **TypeScript 支持**:
    - 源码使用 TS 重写，对 TS 的支持更加友好，类型推导更强大。
5.  **新特性**:
    - **Fragment**: 支持多个根节点。
    - **Teleport**: 传送门（如将弹窗渲染到 body 下）。
    - **Suspense**: 异步组件加载状态管理。

:::

## 🔥Vue 组件的通信方式有哪些？

::: details 参考答案

1.  **父子通信**:
    - **Props / Emit**: 父传子用 Props，子传父用 Emit。
    - **v-model**: 双向绑定（Vue 3 支持多个 v-model）。
    - **Ref**: 父组件通过 `ref` 直接访问子组件实例（属性/方法）。
2.  **跨级/全局通信**:
    - **Provide / Inject**: 依赖注入，适合深层嵌套组件。
    - **Vuex / Pinia**: 全局状态管理（推荐 Pinia）。
    - **EventBus**: 事件总线（Vue 3 已移除，可用 `mitt` 库代替）。
    - **Attrs / Listeners**: 透传属性和事件。

:::

## 🔥Vue 组件的生命周期

::: details 参考答案

**Vue 2 vs Vue 3 (Hooks)**

1.  **创建阶段**:
    - `beforeCreate` / `created` -> **setup()** (Vue 3)
    - 初始化数据，此时还未挂载 DOM。
2.  **挂载阶段**:
    - `beforeMount` -> **onBeforeMount**
    - `mounted` -> **onMounted** (DOM 已挂载，可操作 DOM、发请求)
3.  **更新阶段**:
    - `beforeUpdate` -> **onBeforeUpdate**
    - `updated` -> **onUpdated**
4.  **销毁阶段**:
    - `beforeDestroy` -> **onBeforeUnmount**
    - `destroyed` -> **onUnmounted** (清理定时器、事件监听)
5.  **缓存 (KeepAlive)**:
    - `activated` / `deactivated` -> **onActivated** / **onDeactivated**

:::

## Vue 组件在哪个生命周期发送 ajax 请求？

::: details 参考答案

通常放在 **created** 或 **mounted** 中。

- **created**:
  - ✅ **更早**: 能更快获取数据。
  - ✅ **SSR**: 服务端渲染只能在 created (或 setup) 中运行。
  - ❌ **无 DOM**: 无法操作 DOM。
- **mounted**:
  - ✅ **有 DOM**: 适合需要依赖 DOM 的请求（如 echarts 初始化）。
  - ❌ **稍晚**: 可能会导致页面首屏渲染慢一点点。

> **推荐**: 如果不需要操作 DOM，优先在 **created** (Vue 3 中即 `setup`) 中请求。

:::

## Vue 父子组件生命周期调用顺序

::: details 参考答案

**加载渲染过程**:

1.  父 `beforeCreate`
2.  父 `created`
3.  父 `beforeMount`
4.  子 `beforeCreate`
5.  子 `created`
6.  子 `beforeMount`
7.  子 `mounted`
8.  父 `mounted`

> **口诀**: 父组件先开始，子组件先完成。

**更新过程**:

1.  父 `beforeUpdate`
2.  子 `beforeUpdate`
3.  子 `updated`
4.  父 `updated`

**销毁过程**:

1.  父 `beforeDestroy`
2.  子 `beforeDestroy`
3.  子 `destroyed`
4.  父 `destroyed`

:::

## 🔥v-show 和 v-if 的区别

::: details 参考答案

1.  **实现原理**:
    - **v-if**: 真正的条件渲染。为 false 时，DOM 节点会被 **销毁**，完全不存在于文档中。
    - **v-show**: 始终渲染 DOM，通过 CSS `display: none` 控制显隐。
2.  **性能开销**:
    - **v-if**: 切换开销大（涉及 DOM 创建/销毁）。
    - **v-show**: 初始渲染开销大，但切换开销小。
3.  **场景**:
    - **v-if**: 条件不经常改变（如权限控制）。
    - **v-show**: 需要频繁切换（如 Tab 切换、弹窗显隐）。

:::

## 为何 v-if 和 v-for 不能一起使用？

::: details 参考答案

1.  **优先级冲突**:
    - **Vue 2**: `v-for` 优先级高于 `v-if`。这意味着每次循环都会运行一次 if 判断，造成巨大的性能浪费。
    - **Vue 3**: `v-if` 优先级高于 `v-for`。此时 v-if 无法访问 v-for 里的变量，会导致报错。
2.  **解决方案**:
    - **外层包裹**: 在 v-for 外面套一个 `<template v-if="...">`。
    - **计算属性 (推荐)**: 先通过 `computed` 过滤出列表，再进行 v-for 渲染。

:::

## computed 和 watch 有什么区别

::: details 参考答案

1.  **Computed (计算属性)**:
    - **有缓存**: 只有依赖的数据变化时，才会重新计算。
    - **同步**: 必须返回一个值，不能进行异步操作。
    - **场景**: 一个值依赖多个值（多对一），如购物车总价。
2.  **Watch (侦听器)**:
    - **无缓存**: 数据变化立即触发。
    - **支持异步**: 可以执行异步操作（如 API 请求）。
    - **场景**: 一个值变化影响多个值或触发副作用（一对多），如搜索框输入触发搜索。

:::

## 🔥watch 和 watchEffect 的区别

::: details 参考答案

1.  **依赖收集**:
    - **watch**: 需要 **显式** 指定监听的数据源。
    - **watchEffect**: **自动** 收集回调函数中用到的响应式数据。
2.  **执行时机**:
    - **watch**: 只有当数据变化时才执行（默认懒执行，除非配置 `immediate: true`）。
    - **watchEffect**: 组件初始化时会 **立即执行** 一次，用于自动收集依赖。
3.  **场景**:
    - **watch**: 需要拿到 `newValue` 和 `oldValue`，或者需要精确控制监听时。
    - **watchEffect**: 只需要响应数据变化，不需要知道旧值时（类似 React useEffect）。

:::

## 🔥Vue3 ref 和 reactive 如何选择？

::: details 参考答案

1.  **reactive**:
    - **适用**: 对象、数组。
    - **局限**: 不能直接赋值（会丢失响应性），解构会丢失响应性（需用 `toRefs`）。
2.  **ref**:
    - **适用**: 基本类型 (String, Number) 和 对象/数组。
    - **特点**: 在 JS 中需要 `.value` 访问，模板中自动解包。
    - **底层**: 如果 ref 存的是对象，内部会自动调用 reactive。

> **官方推荐**: 优先使用 **ref**。因为它更统一、更灵活（支持基本类型），且不容易出现丢失响应性的问题。

:::

## 什么是动态组件？如何使用它？

::: details 参考答案

**动态组件** 允许在同一个挂载点动态切换不同的组件。

**使用**:
使用 `<component :is="compName">` 标签。

```vue
<component :is="currentComp"></component>
<button @click="currentComp = 'CompA'">A</button>
<button @click="currentComp = 'CompB'">B</button>
```

**配合 KeepAlive**:
通常配合 `<KeepAlive>` 使用，以缓存切走的组件状态，避免重复渲染。

:::

## 什么是 slot，有什么应用场景？

::: details 参考答案

**Slot (插槽)** 是 Vue 的内容分发机制，允许父组件向子组件内部传递模板内容。

**分类**:

1.  **默认插槽**: `<slot></slot>`，父组件传递的内容直接填入。
2.  **具名插槽**: `<slot name="header"></slot>`，父组件通过 `<template #header>` 指定内容填入特定位置。
3.  **作用域插槽**: 子组件将数据传回给父组件的插槽内容使用。
    - 子: `<slot :item="item"></slot>`
    - 父:
      ```html
      <template #default="{ item }">{{ item.name }}</template>
      ```

**场景**:

- 通用组件（如弹窗、卡片、表格），布局固定，但内容由使用者自定义。

:::

## 🚀Vue 项目可做哪些性能优化？

::: details 参考答案

1.  **代码层面**:
    - **v-if vs v-show**: 合理选择。
    - **v-for key**: 必须设置且唯一（不要用 index）。
    - **computed**: 多用计算属性缓存。
    - **KeepAlive**: 缓存组件。
    - **路由懒加载**: `import()` 拆包。
    - **Object.freeze**: 冻结不需要响应式的大数据（Vue 2）。
2.  **构建层面**:
    - **Tree Shaking**: 移除无用代码。
    - **图片压缩 / CDN**: 优化资源。
3.  **用户体验**:
    - **骨架屏 / Loading**: 减少白屏焦虑。
    - **虚拟列表**: 处理长列表渲染。

:::

## 什么是 nextTick 如何应用它

::: details 参考答案

**原理**:
Vue 的 DOM 更新是 **异步** 的。修改数据后，DOM 不会立即更新，而是放入队列等待下一次 Event Loop 更新。

**作用**:
`nextTick` 接受一个回调函数，在 **DOM 更新完成之后** 执行。

**场景**:
当你修改了数据，并希望立即获取更新后的 DOM 元素（如获取新的高度、焦点）时。

```javascript
this.message = 'new'
// console.log(this.$el.textContent) // 旧值
this.$nextTick(() => {
  // console.log(this.$el.textContent) // 新值
})
```

:::

## 使用 Vue3 Composable 组合式函数，实现 useCount

::: details 参考答案

```javascript
import { ref } from 'vue'

export function useCount(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => (count.value = initialValue)

  return { count, increment, decrement, reset }
}
```

**优势**: 逻辑复用，不再依赖 Mixins（解决了 Mixins 命名冲突、来源不清晰的问题）。

:::

## 使用 Vue3 Composable 组合式函数，实现 useRequest

::: details 参考答案

```javascript
import { ref } from 'vue'
import axios from 'axios'

export function useRequest(url) {
  const loading = ref(false)
  const data = ref(null)
  const error = ref(null)

  const fetch = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(url)
      data.value = res.data
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  fetch() // 自动触发，也可手动触发

  return { loading, data, error, fetch }
}
```

:::

## 自定义组件如何实现 v-model

::: details 参考答案

`v-model` 本质是 `props` + `emit` 的语法糖。

**Vue 2**:

- Prop: `value`
- Event: `input`

**Vue 3**:

- Prop: `modelValue`
- Event: `update:modelValue`

**Vue 3.4+ (推荐)**:
使用 `defineModel()` 宏。

```javascript
// Child.vue
const model = defineModel()

// Parent.vue
<Child v-model="count" />
```

:::

## 如何统一监听 Vue 组件报错

::: details 参考答案

1.  **全局错误**: `app.config.errorHandler`
    - 捕获所有组件的未处理错误。
    - 用于埋点上报。
2.  **组件错误**: `onErrorCaptured` (生命周期)
    - 捕获后代组件的错误。
    - 返回 `false` 可阻止错误向上传播。
3.  **异步错误**: `window.onerror` / `unhandledrejection`
    - 捕获 Promise 未 catch 的错误。

:::

## Vuex 中 mutation 和 action 有什么区别？

::: details 参考答案

1.  **Mutation**:
    - **同步**: 必须是同步函数。
    - **修改状态**: 是修改 State 的唯一合法途径。
    - 调用: `commit('xxx')`
2.  **Action**:
    - **异步**: 可以包含异步操作（如 API 请求）。
    - **提交 Mutation**: 不能直接修改 State，必须提交 Mutation。
    - 调用: `dispatch('xxx')`

> **原因**: 为了能用 DevTools 追踪状态变更快照。如果 Mutation 是异步的，就无法追踪状态是何时变更的。

:::

## Vuex 和 Pinia 有什么区别？

::: details 参考答案

Pinia 是 Vue 3 官方推荐的状态管理库 (Vuex 5 的精神继承者)。

**Pinia 优势**:

1.  **更简单**: 移除了 `Mutation`，只有 `State`, `Getters`, `Actions` (支持同步和异步)。
2.  **TypeScript**: 完美的 TS 类型推导，无需像 Vuex 那样复杂的类型定义。
3.  **更轻量**: 体积更小。
4.  **模块化**: 没有复杂的 modules 嵌套，每个 Store 都是独立的，按需引入。

:::

## Vue-router 导航守卫能用来做什么？

::: details 参考答案

**导航守卫** 用于拦截路由跳转。

**常用钩子**:

1.  **全局前置**: `router.beforeEach((to, from, next) => { ... })`
2.  **路由独享**: `beforeEnter`
3.  **组件内**: `onBeforeRouteLeave`

**应用场景**:

1.  **权限校验**: 检查 Token，未登录跳转登录页。
2.  **页面标题**: 动态修改 `document.title`。
3.  **NProgress**: 开启页面加载进度条。
4.  **取消请求**: 路由切换时取消上一个页面的 Axios 请求。

:::

## Vue-Router 的 Hash 模式和 History 模式有什么区别？

::: details 参考答案

1.  **Hash 模式** (`createWebHashHistory`):
    - URL 带 `#` 号 (如 `http://site.com/#/home`)。
    - **原理**: 监听 `hashchange` 事件。
    - **优点**: 兼容性好，无需后端配置（Hash 值的变化不会发送给服务器）。
    - **缺点**: URL 不美观，SEO 较差。
2.  **History 模式** (`createWebHistory`):
    - URL 干净 (如 `http://site.com/home`)。
    - **原理**: 利用 HTML5 `history.pushState` 和 `history.replaceState` API。
    - **优点**: URL 美观，符合标准。
    - **缺点**: **需要后端配置支持**。如果刷新页面，浏览器会向服务器请求 `/home`，如果服务器没有对应资源会 404，需配置 fallback 到 `index.html`。

:::

## 为什么 Vue 3 推荐使用 `<script setup>`？

::: details 参考答案

`<script setup>` 是 Composition API 的语法糖，相比普通的 `setup()` 函数有以下优势：

1.  **更简洁**: 无需 `return`，顶层定义的变量、函数、import 自动在模板中可用。
2.  **更好的 TS 支持**: 纯 TypeScript 编写，类型推导更自然。
3.  **更好的性能**: 编译出的代码更高效（模板直接访问闭包变量，无中间代理）。
4.  **更少的样板代码**: 引入组件后直接使用，无需注册。

:::

## Vue 3 的 Teleport 是什么？有什么用？

::: details 参考答案

**Teleport (传送门)** 允许我们将组件的 DOM 结构渲染到 **DOM 树的其他位置**（如 `body` 下），而不是局限于父组件的 DOM 结构中。

**场景**:
全屏弹窗 (Modal)、通知 (Toast)、Tooltip 等。

**优势**:
虽然 DOM 结构被移动了，但 **组件逻辑关系不变**（依然保持父子组件关系，Props/Event 正常工作）。

```html
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

:::
