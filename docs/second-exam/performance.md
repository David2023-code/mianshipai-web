# 性能优化

性能优化是前端高阶面试必考题，也是区分初级和高级工程师的分水岭。建议从 **加载时** 和 **运行时** 两个维度来回答。

## 前端项目性能优化可以从哪些方面入手？

::: details 参考答案

面试回答可以按“先定位，再分层优化”的结构：

**0. 先做性能分析与指标**

- 指标：FCP/LCP/CLS/INP(或 FID)/TTFB，首屏耗时、白屏、卡顿、内存
- 工具：Chrome DevTools（Network/Performance/Memory）、Lighthouse、Web Vitals、线上监控
- 原则：先用数据定位瓶颈，再做针对性优化，避免“拍脑袋优化”

**1. 网络与缓存（让资源更快到达）**

- CDN、HTTP/2/3、Gzip/Brotli、DNS 预解析/预连接
- 强缓存/协商缓存、合理的 Cache-Control、静态资源 hash、Service Worker（可选）

**2. 资源体积与请求（让资源更小更少）**

- 代码分割、路由懒加载、按需加载组件/图片
- Tree Shaking、移除未使用代码、压缩 JS/CSS、减少第三方依赖
- 图片优化：WebP/AVIF、响应式图片、懒加载、占位与明确宽高避免 CLS

**3. 渲染与交互（让页面更快可用）**

- SSR/SSG/预渲染（按业务选择），骨架屏/渐进渲染
- 长列表虚拟化、避免大 DOM、减少回流重绘、动画用 `transform/opacity`

**4. JS 运行时（让主线程更空闲）**

- 拆分长任务、用 `requestIdleCallback`/分片处理、Web Worker（计算密集型）
- 降低高频事件开销：防抖/节流，减少不必要的状态更新与重渲染

**5. 持续治理（让优化可持续）**

- CI 里加体积/性能门禁（bundle size、Lighthouse CI）
- 线上监控 + 报警 + 回归验证，形成闭环

:::

## 🔥 首屏加载优化有哪些方案？

这是一个非常宏大的问题，建议按流程顺序，挑选重点回答。

::: details 参考答案

**1. 网络层面 (减少请求时间)**

- **CDN 分发**: 让用户就近获取静态资源。
- **HTTP/2**: 开启多路复用，头部压缩。
- **Gzip/Brotli 压缩**: Nginx 开启压缩，减少文件体积 (通常可减少 70%)。
- **DNS 预解析**: `<link rel="dns-prefetch" href="//example.com">`。

**2. 资源层面 (减少资源体积/数量)**

- **路由懒加载**: Vue/React 路由按需加载，避免首屏加载全部代码。
- **组件/图片懒加载**: 不在视口内的资源先不加载。
- **Tree Shaking**: 移除未使用的代码 (ESM)。
- **图片优化**: 使用 WebP 格式，小图使用 Base64。
- **第三方库按需引入**: 如 ElementUI/Antd 只引入用到的组件。

**3. 渲染层面 (提升渲染速度)**

- **SSR (服务端渲染)**: 直接返回 HTML，解决 SPA 首屏白屏问题。
- **骨架屏**: 在数据加载前展示占位 UI，提升感官体验。
- **预渲染 (Prerender)**: 构建时生成静态 HTML (适合静态站)。
- **Script 标签**: 使用 `defer` 避免阻塞 HTML 解析。

:::

## 🔥 什么是回流 (Reflow) 和重绘 (Repaint)？如何避免？

::: details 参考答案

**1. 概念区别**

- **回流 (Reflow / Layout)**: 布局引擎计算元素的位置和大小。当元素的**几何属性** (宽、高、位置、隐藏) 发生变化时触发。
  - _影响范围大，开销大_。
- **重绘 (Repaint / Paint)**: 绘制页面的像素。当元素的**外观** (颜色、背景、阴影) 发生变化但**不影响布局**时触发。
  - _开销较小_。

> **注意**: **回流一定会触发重绘，但重绘不一定触发回流**。

**2. 触发场景**

- **回流**: 改变窗口大小、改变字体大小、添加/删除 DOM、读取 `offsetWidth/scrollTop` (会强制刷新渲染队列)。
- **重绘**: `color`, `background-color`, `visibility`.

**3. 如何避免**

- **批量修改 DOM**: 先 `display: none` (1次回流)，修改完再显示；或者使用 `DocumentFragment`。
- **CSS 优化**: 避免使用 `table` 布局；使用 `transform` 代替 `top/left` 做动画 (GPU 加速，不回流)。
- **缓存布局信息**: 不要频繁读取 `offsetWidth`，用变量存起来。

:::

## 什么是防抖 (Debounce) 和节流 (Throttle)？

::: details 参考答案

它们都是为了**降低高频事件触发的频率** (如 resize, scroll, input)。

**1. 防抖 (Debounce)**

- **原理**: 事件触发后等待 N 秒再执行。如果在 N 秒内又被触发，则**重新计时**。
- **比喻**: 坐电梯，没人进来了电梯才关门；如果有人进来，就重新等待。
- **场景**: 搜索框输入联想 (输入停顿后再发请求)、窗口 Resize。

```javascript
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

**2. 节流 (Throttle)**

- **原理**: 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
- **比喻**: 技能冷却 CD，点再快也只能等 CD 好了才能放。
- **场景**: 滚动加载 (Scroll)、按钮防止重复点击。

```javascript
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime > delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

:::

## 如何优化大量的 DOM 操作？(虚拟列表)

::: details 参考答案

当页面需要渲染成千上万条数据 (如长列表) 时，直接渲染会导致 DOM 节点过多，页面卡顿。

**解决方案**: **虚拟列表 (Virtual List)**

**原理**:
只渲染**可视区域 (Viewport)** 内的 DOM 节点，非可视区域的节点不渲染 (或只渲染占位)。

**实现步骤**:

1.  计算可视区域能放下多少个元素 (如 10 个)。
2.  计算列表总高度 (总数量 \* 单个高度)，设置给容器撑开滚动条。
3.  监听滚动事件，根据 `scrollTop` 计算当前应该显示哪一段数据 (StartIndex, EndIndex)。
4.  利用 `transform: translateY` 偏移列表，让渲染的内容始终在可视区。

**优点**: 无论数据多少，页面上始终只有几十个 DOM 节点，极大地提升性能。

:::

## 图片懒加载的原理是什么？

::: details 参考答案

**原理**:
图片先不设置 `src` (或者设为占位图)，把真实地址存在 `data-src` 中。当图片**进入可视区域**时，再把 `data-src` 赋值给 `src`。

**检测进入可视区域的方法**:

1.  **监听 Scroll 事件 + getBoundingClientRect**:

    - 计算 `img.getBoundingClientRect().top < window.innerHeight`。
    - _缺点_: Scroll 事件频繁触发，需要节流，且计算位置会引起回流。

2.  **IntersectionObserver (推荐)**:
    - 浏览器原生提供的 API，专门用于观察元素是否进入视口。
    - 性能好，不阻塞主线程。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img) // 加载完就停止观察
    }
  })
})

document.querySelectorAll('img').forEach((img) => observer.observe(img))
```

:::

## 如何对大量图片进行优化？

::: details 参考答案

大量图片优化要从“体积更小、加载更少、渲染更快”三条线回答。

**1. 降低体积（传输）**

- **选对格式**：优先 WebP/AVIF；图标优先 SVG；照片类用有损压缩
- **多规格输出**：同一张图生成多份尺寸，避免移动端下载大图
- **上 CDN + 缓存**：图片走 CDN，配合 `Cache-Control` 长缓存（带 hash 的静态资源）

**2. 少加载（调度）**

- **懒加载**：首屏外的图片延后加载（`loading="lazy"` 或 IntersectionObserver）
- **控制优先级**：首屏大图可 `fetchpriority="high"`，必要时 `preload` 关键图
- **占位与渐进**：LQIP/模糊占位，先小图后大图，降低白屏感

**3. 渲染更快（体验）**

- **避免 CLS**：给图片设置明确 `width/height`（或容器固定比例），减少布局抖动
- **减少解码阻塞**：`decoding="async"`，避免图片解码阻塞主线程

**4. 列表场景（大量缩略图）**

- **分页/无限滚动 + 虚拟列表**：一次只渲染/加载可视区域附近的图片
- **缩略图优先**：列表展示用缩略图，点击/预览再加载原图

**示例（响应式 + 懒加载）**

```html
<img
  src="/img/cover-placeholder.webp"
  data-src="/img/cover-640.webp"
  data-srcset="/img/cover-640.webp 640w, /img/cover-1280.webp 1280w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="640"
  height="360"
  loading="lazy"
  decoding="async"
  alt=""
/>
```

```js
const images = document.querySelectorAll('img[data-src]')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const img = entry.target
      img.src = img.dataset.src
      if (img.dataset.srcset) img.srcset = img.dataset.srcset
      observer.unobserve(img)
    })
  },
  { rootMargin: '200px 0px' }
)

images.forEach((img) => observer.observe(img))
```

:::

## 什么是 CDN？为什么它能加速？

::: details 参考答案

**CDN (Content Delivery Network)** 即内容分发网络。

**核心原理**:
把源站的资源 (JS, CSS, 图片) **缓存**到全国/全球各地的**边缘节点**服务器上。

**为什么能加速**:

1.  **物理距离近**: 用户访问时，DNS 会将域名解析到**离用户最近**的节点 IP (如北京用户访问北京节点)，减少网络延迟。
2.  **减轻源站压力**: 大部分流量被 CDN 挡住了，源站只处理动态请求和少量的回源请求。
3.  **链路优化**: CDN 服务商之间有专用的高速传输链路。

:::

## 如何在 Webpack 和 Vite 项目中使用 CDN？

::: details 参考答案

思路：把“稳定且体积大的静态资源”（如 React/Vue、组件库、工具库）从打包产物里剥离出来，改为在 HTML 中通过 CDN 引入，并让打包器不要把它们再打进去。

常见做法分两类：

**1. UMD/IIFE 模式（通过 script 引入，全局变量使用）**

特点：兼容性强，配置清晰，适合把 React/Vue 这类大库改走 CDN。

Webpack（核心点：externals + 注入 script）：

```js
// webpack.config.js
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
```

```html
<!-- public/index.html 或 HtmlWebpackPlugin 模板 -->
<script src="https://cdn.example.com/react/18/react.production.min.js"></script>
<script src="https://cdn.example.com/react-dom/18/react-dom.production.min.js"></script>
```

Vite（核心点：rollup external + globals + 注入 script）：

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
```

```html
<!-- index.html -->
<script src="https://cdn.example.com/react/18/react.production.min.js"></script>
<script src="https://cdn.example.com/react-dom/18/react-dom.production.min.js"></script>
```

**2. ESM 模式（通过 importmap/ESM CDN，把依赖映射到 CDN）**

特点：更现代，依赖以 ESM 形式加载；适合依赖本身提供 ESM CDN 的场景。

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom": "https://esm.sh/react-dom@18"
    }
  }
</script>
```

注意事项（面试加分）：

- 版本锁定：CDN URL 固定版本号，避免线上被“漂移更新”影响
- 缓存策略：CDN 资源强缓存；业务产物带 hash，可长期缓存
- 安全：第三方 CDN 可加 SRI（`integrity`）与 `crossorigin`
- 兜底：核心库可准备回源/备用 CDN，避免单点故障

:::

## Webpack 做过哪些构建优化？

::: details 参考答案

**1. 提升构建速度 (开发体验)**

- **Cache**: 开启 `babel-loader` 缓存 (`cacheDirectory: true`) 或 `cache-loader`。
- **多进程打包**: 使用 `thread-loader` (适合大项目)。
- **缩小构建范围**: 配置 `include/exclude`，只处理 `src` 目录。
- **DllPlugin**: (老方案) 提前打包第三方库。

**2. 减小打包体积 (加载性能)**

- **Tree Shaking**: 生产环境默认开启，去除无用代码 (必须用 ESM)。
- **SplitChunks**: 代码分割，提取公共代码 (Vendor) 和业务代码。
- **压缩**: `TerserPlugin` 压缩 JS，`CssMinimizerPlugin` 压缩 CSS。
- **动态引入**: `import()` 路由懒加载。
- **Externals**: 将 React/Vue 等大库排除，通过 CDN 引入。

:::

## 浏览器渲染一帧的过程？(像素管道)

::: details 参考答案

为了保证 60FPS 的流畅动画，浏览器需要在 **16.6ms** 内完成以下一帧的工作：

1.  **JS**: 处理 JavaScript 事件 (如定时器、交互)。
2.  **Style**: 计算样式 (Recalculate Styles)。
3.  **Layout**: 布局计算 (回流)。
4.  **Paint**: 绘制 (重绘)。
5.  **Composite**: 合成层 (将不同图层合并)。

**优化启示**:
尽量跳过 Layout 和 Paint 阶段，只触发 Composite (如使用 `transform`, `opacity` 做动画)，这样开销最小，能利用 GPU 加速。

:::
