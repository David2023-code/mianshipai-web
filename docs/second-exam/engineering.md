# 前端工程化

前端工程化通过自动化工具和标准化流程，提升开发效率、代码质量和可维护性。其核心目标是优化开发、构建、测试和部署流程，减少人工干预和重复劳动，便于项目扩展和团队协作。

常见的工具，如Vite和Webpack，提供高效的构建和打包能力，显著提升开发效率并丰富前端生态。这些工具的广泛应用使前端开发更加高效，且成为近年来面试中的热门话题。

## Vite 为什么更快？

::: details 参考答案

Vite 相比传统构建工具（如 Webpack）更快🚀，主要得益于以下几个核心特性：

1.  **基于原生 ES 模块（ESM）**：

    - Vite 利用浏览器原生的 ES 模块，在开发模式下**按需加载**模块。
    - 它不进行整体打包，而是直接提供源码给浏览器（浏览器遇到 import 请求再加载），避免了冷启动时的漫长等待。

2.  **高效的热模块替换（HMR）**：

    - Vite 的 HMR 是基于 ESM 的。当文件修改时，Vite 只需要让浏览器重新请求该模块，更新速度与项目复杂度无关，始终保持毫秒级。

3.  **使用 esbuild 进行预构建**：

    - Vite 使用 **esbuild**（基于 Go 编写）来处理依赖预构建。
    - esbuild 比以 JavaScript 编写的打包器（如 Webpack）快 10-100 倍。

4.  **按需编译**：

    - Vite 只有在浏览器请求某个模块时才会编译该模块，而不是像 Webpack 那样先编译所有模块再启动服务。

5.  **缓存策略**：
    - **依赖模块**: 强缓存 (Cache-Control: max-age=31536000, immutable)。
    - **源码模块**: 协商缓存 (304 Not Modified)。

:::

## Vite 中如何使用环境变量？

::: details 参考答案

**定义**:
环境变量需以 `VITE_` 前缀开头，Vite 才会将其暴露给客户端代码。

**文件优先级**:

1.  `.env` (所有环境)
2.  `.env.local` (本地覆盖，不提交 git)
3.  `.env.[mode]` (指定模式，如 .env.development)
4.  `.env.[mode].local` (指定模式的本地覆盖)

**访问**:
使用 `import.meta.env` 对象访问。

**示例**:

`.env.development`:

```properties
VITE_API_URL=http://localhost:3000
```

`main.js`:

```javascript
console.log(import.meta.env.VITE_API_URL) // http://localhost:3000
console.log(import.meta.env.MODE) // development
console.log(import.meta.env.PROD) // false
```

:::

## Vite 如何实现多环境配置 (qa, dev, prod)？

::: details 参考答案

**方法 1: 环境变量 (推荐)**

创建不同的 `.env` 文件：

- `.env.development`
- `.env.production`
- `.env.qa`

运行脚本时指定 mode：

```json
{
  "scripts": {
    "dev": "vite",
    "build:qa": "vite build --mode qa",
    "build:prod": "vite build --mode production"
  }
}
```

**方法 2: 动态配置 (vite.config.js)**

使用 `defineConfig` 接收 `mode` 参数，根据不同环境返回不同配置。

```javascript
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 加载当前 mode 下的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // 基础配置
    plugins: [],

    // 根据 mode 做不同配置
    base: mode === 'production' ? '/prod/' : '/',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // 使用环境变量
          changeOrigin: true,
        },
      },
    },
  }
})
```

:::

## 简述 Vite 的依赖预构建机制

::: details 参考答案

**目的**:

1.  **CommonJS 和 UMD 兼容性**: 将 CommonJS / UMD 依赖转换为 ESM，因为开发阶段 Vite 服务端仅支持 ESM。
2.  **性能优化**: 将许多内部模块的依赖（如 lodash-es 有 600+ 个文件）合并为一个模块，减少 HTTP 请求次数。

**流程**:

1.  **扫描**: Vite 启动时，自动扫描源码中的 import，寻找 node_modules 中的依赖。
2.  **构建**: 使用 **esbuild** 将这些依赖转换为 ESM 格式，并打包成单个文件。
3.  **缓存**: 结果缓存到 `node_modules/.vite` 目录。
    - **文件缓存**: 只有 `package.json`、`lock` 文件或 `vite.config.js` 变化时才重新构建。
    - **浏览器缓存**: 预构建的依赖设置了强缓存。

:::

## Vite 如何处理静态资源？

::: details 参考答案

**1. 导入资源**:

```javascript
import imgUrl from './img.png' // 返回解析后的 URL
document.getElementById('hero').src = imgUrl
```

**2. 显式 URL 引入**:

```javascript
import imgUrl from './img.png?url' // 强制作为 URL 引入
```

**3. 显式源码引入**:

```javascript
import rawContent from './shader.glsl?raw' // 作为字符串引入
```

**4. Worker 引入**:

```javascript
import Worker from './worker.js?worker' // 引入为 Web Worker
```

**5. public 目录**:
放在 `public` 目录下的文件会原封不动地复制到根目录，通过绝对路径访问（如 `/icon.png`）。

**6. new URL**:

```javascript
// 适用于动态路径
const imgUrl = new URL(`./dir/${name}.png`, import.meta.url).href
```

:::

## Vite 中如何配置 CSS 预处理器？

::: details 参考答案

Vite 提供了内置支持，**无需配置 loader**，只需安装对应的预处理器依赖即可。

**1. 安装**:

```bash
npm add -D sass # 或 less, stylus
```

**2. 使用**:

```vue
<style lang="scss">
$color: red;
h1 {
  color: $color;
}
</style>
```

**3. 全局变量配置**:
在 `vite.config.js` 中配置 `css.preprocessorOptions`，自动注入全局变量。

```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
      less: {
        globalVars: {
          primary: '#fff',
        },
      },
    },
  },
})
```

:::

## Vite 项目有哪些常见优化手段？

::: details 参考答案

**1. 构建优化 (Build)**:

- **分包 (Split Chunks)**: 配置 `build.rollupOptions.output.manualChunks` 将 node_modules 单独打包。
- **Gzip 压缩**: 使用 `vite-plugin-compression`。
- **图片压缩**: 使用 `vite-plugin-imagemin`。
- **CDN 加速**: 使用 `vite-plugin-cdn-import` 将 React/Vue 等库通过 CDN 引入。

**2. 开发优化 (Dev)**:

- **预构建**: 确保常用依赖被正确预构建。
- **忽略文件**: 配置 `server.watch.ignored` 忽略不需要监听的文件。

**3. 代码层面**:

- **路由懒加载**: `const Home = () => import('./Home.vue')`。
- **按需引入**: 使用组件库的按需引入插件（如 `unplugin-vue-components`）。

:::

## 简述 Vite 插件开发流程

::: details 参考答案

Vite 插件扩展了 Rollup 的插件接口，并添加了 Vite 独有的钩子。

**核心钩子**:

1.  `config`: 修改 Vite 配置。
2.  `configResolved`: 配置解析完成后调用。
3.  `configureServer`: 配置开发服务器（添加中间件）。
4.  `transformIndexHtml`: 转换 index.html。
5.  `transform`: 转换代码（最常用）。

**示例结构**:

```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',

    config(config) {
      return { define: { 'process.env': {} } }
    },

    transform(code, id) {
      if (id.endsWith('.vue')) {
        return code.replace('old', 'new')
      }
    },
  }
}
```

**使用**:

```javascript
// vite.config.js
import myPlugin from './myPlugin'
export default {
  plugins: [myPlugin()],
}
```

:::

## Vite 如何配置代理 (Proxy)？

::: details 参考答案

解决开发环境跨域问题。

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写
      '/foo': 'http://localhost:4567',

      // 选项写法
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true, // 修改 Host 头，欺骗后端
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉 /api 前缀
      },

      // 正则写法
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
    },
  },
})
```

:::

## Webpack 的核心概念有哪些？

::: details 参考答案

1.  **Entry (入口)**: Webpack 从哪里开始构建依赖图。
2.  **Output (出口)**: 打包后的文件输出到哪里，文件名叫什么。
3.  **Loader (加载器)**: 让 Webpack 能够处理非 JS 文件（如 CSS, 图片, TS）。Webpack 本身只理解 JS/JSON。
4.  **Plugin (插件)**: 执行范围更广的任务（如打包优化, 资源管理, 注入环境变量）。
5.  **Mode (模式)**: `development` (开发) 或 `production` (生产)，自动开启对应优化。
6.  **Chunk (代码块)**: 打包过程中的代码块，最终输出为 Bundle。

:::

## Webpack 中 Loader 和 Plugin 的区别？

::: details 参考答案

| 特性         | Loader                                   | Plugin                                       |
| :----------- | :--------------------------------------- | :------------------------------------------- |
| **作用**     | **转换器**。将非 JS 模块转换为 JS 模块。 | **扩展器**。干预构建流程，执行更复杂的任务。 |
| **运行时机** | 在模块加载时执行。                       | 在整个构建周期的生命周期钩子中执行。         |
| **配置方式** | `module.rules` 中配置。                  | `plugins` 数组中 `new Plugin()`。            |
| **示例**     | `css-loader`, `babel-loader`             | `HtmlWebpackPlugin`, `DefinePlugin`          |

> **一句话总结**: Loader 负责文件转换，Plugin 负责功能扩展。

:::

## 什么是 Tree Shaking？如何在 Webpack 中启用？

::: details 参考答案

**定义**:
**Tree Shaking (摇树优化)** 是指移除 JavaScript 上下文中未引用的代码 (Dead Code)。

**原理**:
基于 **ES Module** 的静态分析。ESM 的导入导出是静态的，Webpack 可以在编译时确定哪些模块被使用了，哪些没被使用。

**启用步骤**:

1.  **使用 ES Module**: 确保代码使用 `import / export`，且 Babel 没有将其转换为 CommonJS (`modules: false`)。
2.  **开启生产模式**: 设置 `mode: 'production'`。Webpack 会自动开启 `usedExports` 标记未使用的导出，并由 `Terser` 删除它们。
3.  **配置 sideEffects**: 在 `package.json` 中配置 `"sideEffects": false`，告诉 Webpack 项目中没有副作用，可以大胆删除未使用的模块。如果有副作用（如全局 CSS），则传入数组 `["*.css"]`。

:::

## Webpack 如何实现代码分割 (Code Splitting)？

::: details 参考答案

1.  **入口配置 (Entry Points)**:
    - 手动配置多个 entry，输出多个 bundle。
2.  **动态导入 (Dynamic Imports)**:
    - 使用 `import('./module')` 语法。Webpack 会自动将动态导入的模块分离成单独的 Chunk。
    - **推荐**: 结合 Vue/React 路由懒加载使用。
3.  **SplitChunksPlugin**:
    - 配置 `optimization.splitChunks`。
    - 可以将 `node_modules` 中的第三方库提取到单独的 `vendors` chunk 中，利用浏览器缓存。

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 对同步和异步代码都进行分割
    },
  },
}
```

:::

## Webpack 构建速度慢，如何优化？

::: details 参考答案

**1. 缩小构建范围**:

- `include/exclude`: 在 Loader 配置中明确指定处理目录，排除 `node_modules`。
- `resolve.extensions`: 减少后缀列表，加快解析。

**2. 利用缓存**:

- `cache: { type: 'filesystem' }` (Webpack 5): 开启文件系统缓存。
- `babel-loader?cacheDirectory`: 开启 Babel 缓存。

**3. 多进程构建**:

- `thread-loader`: 将耗时的 Loader 放在 worker 池中运行。

**4. DllPlugin (过时但有效)**:

- 将第三方库提前打包好，构建时直接引用（Webpack 5 推荐用 HardSourceWebpackPlugin 或自带缓存替代）。

**5. 开发体验优化**:

- 开启 `HMR` (热更新)。
- `devtool`: 开发环境使用 `eval-cheap-module-source-map` (速度快)，生产环境使用 `hidden-source-map` 或不生成。

:::

## Vite 和 Webpack 的区别？

::: details 参考答案

| 特性             | Webpack                                        | Vite                                               |
| :--------------- | :--------------------------------------------- | :------------------------------------------------- |
| **构建原理**     | **Bundle-based**。先打包所有模块，再启动服务。 | **Native ESM**。先启动服务，浏览器请求时按需编译。 |
| **启动速度**     | 慢 (随项目体积增大而变慢)。                    | 快 (毫秒级，与项目体积无关)。                      |
| **热更新 (HMR)** | 重新构建依赖模块，较慢。                       | 基于 ESM，仅更新变更模块，极快。                   |
| **生产构建**     | Webpack 自身打包。                             | 使用 **Rollup** 打包。                             |
| **生态**         | 非常成熟，插件丰富，配置复杂。                 | 发展迅速，配置简单，兼容 Rollup 插件。             |
| **适用场景**     | 大型复杂项目，兼容性要求高。                   | 现代浏览器项目，追求开发体验。                     |

:::

## npm, yarn, pnpm 有什么区别？

::: details 参考答案

1.  **npm (v1-v4)**:

    - **嵌套结构**: 依赖包被嵌套安装，导致 node_modules 体积庞大，路径过深 (Windows 下可能报错)。
    - **不确定性**: 早期版本没有 lock 文件，不同时间安装的版本可能不一致。

2.  **npm (v5+) / yarn**:

    - **扁平化**: 将依赖尽可能提升到顶层 node_modules，解决了路径过深问题。
    - **幽灵依赖 (Phantom Dependencies)**: 扁平化带来了新问题，你可以访问 package.json 中未定义的包（因为它们被提升到了顶层），这可能导致潜在 Bug。
    - **Lock 文件**: `package-lock.json` / `yarn.lock` 锁定版本。

3.  **pnpm**:
    - **硬链接 (Hard Links) + 软链接 (Symlinks)**: 全局存储一份依赖，项目中使用硬链接指向全局存储，节省磁盘空间。
    - **非扁平化**: node_modules 结构严格与 package.json 一致，**彻底解决幽灵依赖**。
    - **速度快**: 安装速度通常是三者中最快的。

:::

## Babel 的原理是什么？

::: details 参考答案

Babel 是一个 JavaScript 编译器，主要用于将 ES6+ 代码转换为向后兼容的 JS 代码。

**核心流程**: **解析 (Parse) -> 转换 (Transform) -> 生成 (Generate)**

1.  **解析 (Parse)**:
    - 将源代码转换为 **AST (抽象语法树)**。
    - 分为 **词法分析** (Tokenizing) 和 **语法分析** (Parsing)。
2.  **转换 (Transform)**:
    - 遍历 AST，调用各种 **Plugin** (如 `@babel/plugin-transform-arrow-functions`) 对 AST 节点进行增删改。
    - 这是 Babel 最核心的步骤。
3.  **生成 (Generate)**:
    - 将转换后的 AST 重新生成为 JavaScript 代码字符串，并生成 Source Map。

:::

## Git Merge 和 Git Rebase 的区别？

::: details 参考答案

1.  **Merge (合并)**:

    - **行为**: 生成一个新的 "Merge Commit"，保留两个分支的完整历史。
    - **优点**: 记录真实的历史轨迹，非破坏性操作。
    - **缺点**: 提交历史会出现分叉和复杂的合并线，看起来比较乱。

2.  **Rebase (变基)**:
    - **行为**: 将当前分支的提交 "搬运" 到目标分支的最新提交之后。
    - **优点**: 提交历史是一条直线，非常干净整洁。
    - **缺点**: **破坏性操作** (修改了 Commit ID)。
    - **原则**: **永远不要在公共分支 (如 main/master) 上使用 Rebase**，只能在自己的 Feature 分支上使用。

:::

## 什么是 Source Map？生产环境怎么配？

::: details 参考答案

**定义**:
Source Map 是一个映射文件 (`.map`)，存储了源代码与构建后代码 (压缩/混淆后) 之间的映射关系。

**作用**:
当构建后的代码报错时，浏览器可以通过 Source Map 定位到**源代码**的具体位置，方便调试。

**生产环境配置建议**:

1.  **开源项目**: 使用 `source-map` (生成独立的 .map 文件)，方便开发者调试。
2.  **企业闭源项目**:
    - **推荐**: `hidden-source-map`。生成 .map 文件，但不在 bundle 中引用。
    - **做法**: 将 .map 文件上传到 **Sentry** 等监控平台，然后删除服务器上的 .map 文件。这样既能通过监控平台看到源码报错，又不会向普通用户暴露源码。
    - **不推荐**: `eval`, `inline-source-map` (体积太大，不适合生产)。

:::
