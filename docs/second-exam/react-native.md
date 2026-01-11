# React Native

适合 3 年经验前端的 React Native 章节，按“能落地 + 面试高频”的方式组织：先讲核心原理，再讲工程化与性能、最后讲与原生协作。

## React Native 是什么？和 Web React 的核心区别是什么？

::: details 参考答案

React Native（RN）用 React 的开发范式（组件、状态、Hooks）来开发 iOS/Android 原生应用。它不是在 WebView 里跑网页，而是把组件映射为原生控件（如 `View/Text/Image`）。

核心差异：

- 渲染目标：Web 是 DOM/CSS；RN 是原生视图树（布局由 Yoga 计算）。
- 样式体系：RN 仅支持 CSS 子集（主要是 Flexbox），没有级联/选择器/伪类等完整 CSS。
- 运行环境：Web 是浏览器；RN 是 JS Runtime + 原生宿主（App）。
- 构建链路：Web 常用 Vite/Webpack；RN 用 Metro 打包 JS/资源，原生侧用 Gradle/Xcode 构建。

:::

## RN 里有哪些“元素/组件”？和 Web 的区别是什么？

::: details 参考答案

一句话：Web 用 HTML 标签（`div/span/img`），RN 用“基础组件”去对应原生控件（`View/Text/Image`）。

RN 常见基础组件（面试高频）：

- 容器：`View`（≈ `div`）、`SafeAreaView`
- 文本：`Text`（Web 里文本可直接放，RN 必须放在 `Text` 里）
- 图片：`Image`（对应原生图片控件，样式与缓存策略和 Web 不同）
- 输入：`TextInput`（能力更接近原生输入框，类型/键盘/行为按平台分）
- 点击：`Pressable`/`Touchable*`（没有 DOM 事件冒泡那套，更偏“手势/触摸”）
- 滚动：`ScrollView`、`FlatList`/`SectionList`（长列表优先用 `FlatList`）
- 弹层：`Modal`
- 反馈：`ActivityIndicator`、`RefreshControl`

和 Web 的核心区别（背诵版）：

- 不是 DOM：RN 没有 `document/window`、没有真实 HTML 标签，最终渲染是原生视图树
- 样式不是 CSS：没有选择器/级联/伪类，样式是对象；布局主要靠 Flexbox（Yoga）
- 单位与布局：RN 通常用“逻辑像素”数值，不写 `px/rem/vw`；很多 CSS 能力不一致
- 事件模型：Web 有 capture/bubble；RN 更强调触摸与手势体系，事件细节因平台而异
- 性能关注点：Web 更多是 DOM/布局/重绘；RN 还要关注 JS 线程、UI 线程与跨层通信成本

:::

## RN 的整体架构和渲染流程是什么？

::: details 参考答案

一句话：RN 把“JS 计算出的 UI 变更”同步到“原生 UI”，最终由原生绘制到屏幕。

流程（概念化）：

1. JS 侧：React 计算组件树变化，得到更新意图。
2. 布局：Yoga 计算布局结果。
3. 原生侧：根据更新意图创建/更新原生视图，提交到 UI 线程渲染。

理解要点：

- Render/计算在 JS 侧完成，真实绘制在原生 UI 线程完成。
- 性能问题通常来自：JS 线程忙、UI 线程忙、或跨层通信过于频繁。

:::

## RN 为什么会卡顿？如何区分是 JS 卡还是 UI 卡？

::: details 参考答案

常见卡顿来源：

- JS 线程卡：重渲染、重计算、频繁 setState、列表 renderItem 过重、动画跑在 JS 上等。
- UI 线程卡：视图层级太深、图片过大、阴影/圆角等高开销绘制、原生布局/测量频繁等。
- 通信卡：JS 与 Native 之间高频交互，序列化/调度开销堆积。

排查思路：

1. 先看症状：输入/滚动掉帧、动画不跟手、点击延迟。
2. 再定位线程：分别观察 JS FPS 与 UI FPS（或对应性能面板指标）。
3. 最后对症下药：减少渲染、优化列表、把动画/手势下沉、减少跨层调用、控制视图复杂度与图片体积。

:::

## Hermes 是什么？为什么能提升 RN 性能？

::: details 参考答案

Hermes 是为 React Native 优化的 JavaScript 引擎。常见收益：

- 启动更快：可将 JS 预编译为字节码，降低解析/编译成本。
- 内存更省：针对移动端与 RN 场景做过优化。
- 线上定位更友好：结合 SourceMap 可更稳定地还原 JS 堆栈（依赖工程配置）。

是否启用与收益需要结合业务体量与机型做压测验证。

:::

## Metro Bundler 是什么？常用配置/问题有哪些？

::: details 参考答案

Metro 是 RN 默认的打包器，负责：

- 打包 JS Bundle（开发时配合 Fast Refresh）
- 打包静态资源（图片、字体等）
- 维护依赖图与缓存，做增量构建

常见问题方向：

- 缓存污染：改配置或依赖后构建异常，通常需要清缓存再跑。
- Monorepo/多包：需要处理 resolver 与 watchFolders，避免重复依赖与解析失败。
- 包体积：关注图片资源、第三方依赖、按需引入与拆分策略（RN 的拆分方式与 Web 不同）。

:::

## RN 的样式与布局体系是什么？有哪些坑？

::: details 参考答案

布局核心：Yoga + Flexbox。

常见坑点：

- 没有 CSS 选择器与级联，样式是对象组合。
- iOS/Android 表现不完全一致，尤其是字体、阴影、滚动容器、状态栏安全区等。
- 过度嵌套会拖慢布局与渲染，布局抖动通常来自频繁测量或条件渲染导致的尺寸变化。

:::

## FlatList 为什么容易卡？怎么优化？

::: details 参考答案

FlatList 卡顿常见原因：

- `renderItem` 过重、频繁创建匿名函数导致子项重复渲染
- key 不稳定导致卸载重建
- 图片大/布局复杂导致渲染开销大
- 首屏一次渲染太多项

优化手段（面试常答）：

- 稳定 key：`keyExtractor` 返回稳定唯一值
- 减少重渲染：拆子项组件 + `memo`，稳定 props 引用
- 控制渲染窗口：合理设置 `initialNumToRender`、`windowSize`、`maxToRenderPerBatch`
- 可行时提供 `getItemLayout`，减少测量成本
- 图片优化：尺寸/格式/缓存策略，避免超大图直接渲染

:::

## RN 动画与手势怎么做？为什么强调“下沉到原生”？

::: details 参考答案

动画/手势的核心目标是“跟手”，也就是避免受 JS 线程负载影响。

一般规律：

- 动画如果依赖 JS 每帧计算并下发更新，JS 忙时会掉帧。
- 把动画/手势计算放到更接近渲染的层（原生侧/专用运行时），可以显著提升稳定性。

面试表达：滚动、拖拽、转场等高频交互，优先选择能绕开 JS 线程瓶颈的方案。

:::

## RN 导航（页面栈）怎么理解？常见坑是什么？

::: details 参考答案

页面栈模型：

- push：压栈一个新页面实例
- pop：回到上一个页面实例
- replace：替换栈顶页面

常见坑：

- 页面卸载不彻底：监听器、定时器、全局事件没有清理导致泄漏与重复触发
- 重资源页面：视频、地图、长列表需要在不可见时暂停/释放
- 深链与回退：需要统一处理 deep link、物理返回键、手势返回等行为一致性

:::

## RN 如何与原生协作？Native Module 和 Native UI Component 有什么区别？

::: details 参考答案

两种典型接入方式：

- Native Module：把原生能力（相机、蓝牙、文件、加密等）封装为 JS API（Promise/回调）。
- Native UI Component：把原生 UI 控件封装成 RN 组件（地图、播放器、复杂控件）。

工程化关注点：

- 接口设计：入参校验、错误码、权限申请、降级策略
- 性能：避免高频跨层调用；耗时任务不要阻塞 UI 线程
- 平台一致性：iOS/Android 行为差异、权限模型差异与厂商 ROM 差异

:::

## RN 的调试与线上问题定位怎么做？

::: details 参考答案

常见手段：

- 开发期：看日志、断点、性能面板，定位 JS/渲染/网络问题
- 线上：崩溃与异常监控 + SourceMap 符号化，结合设备信息、版本、页面路径复现

关键点：

- Release 包验证：很多问题只在 Release 才出现（混淆、资源、权限、签名、性能差异）。
- SourceMap 管理：保证版本与 SourceMap 一一对应，否则堆栈无法还原。

:::

## RN 打包与发布流程大致是怎样的？工程化关注点有哪些？

::: details 参考答案

典型链路：

- JS/资源：Metro 打包生成 JS Bundle 与 assets
- Android：Gradle 构建 APK/AAB（签名、混淆、资源压缩、渠道）
- iOS：Xcode 构建 IPA（证书、Profile、上架配置）

工程化关注点：

- 多环境：dev/stage/prod 的 API、开关、埋点一致性
- 性能基线：启动、页面切换、列表滚动、内存峰值
- 发布质量：灰度、回滚、崩溃率与核心链路监控

:::

## RN 项目里“屏幕适配”通常怎么做？

::: details 参考答案

适配常见分三块：安全区、状态栏/刘海、不同尺寸与字体缩放。

- 安全区：iOS 刘海屏/底部 Home 指示条等，需要让内容避开不可用区域。
- 尺寸适配：用弹性布局（Flex）优先，其次再做按屏幕宽高的比例计算。
- 字体与无障碍：字体可能随系统设置放大，布局要能撑开，避免写死高度。

面试表达：优先用 Flex + 自适应组件，必要时基于 `Dimensions`/`useWindowDimensions` 做少量比例计算，并确保安全区正确处理。

:::

## RN 常见的状态管理方案有哪些？怎么选型？

::: details 参考答案

选型按“状态范围 + 复杂度 + 团队习惯”：

- 组件内状态：`useState/useReducer`
- 跨组件共享：Context + 自定义 Hooks（中小规模足够）
- 复杂业务/多人协作：引入成熟状态库（重点是可预测、可调试、模块化）

面试回答要点：

- 不要一上来就“全局 store”，先按业务域拆状态，避免全局大杂烩。
- 需要持久化的状态（登录态、用户设置）要考虑安全与版本迁移。

:::

## RN 的网络请求怎么做？如何做超时、取消与重试？

::: details 参考答案

常见做法是基于 `fetch` 或封装统一请求层，补齐工程能力：

- 统一 baseURL、headers、错误码映射、日志/埋点
- 超时：用 `AbortController` + 定时器
- 取消：页面离开或搜索输入变化时取消旧请求，避免竞态
- 重试：对网络抖动（如 502/超时）做有限次数退避重试

示例（超时 + 取消）：

```ts
export async function requestWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}
```

:::

## RN 如何做本地存储？有哪些坑？

::: details 参考答案

常见分类：

- 轻量 KV：用户偏好、开关、少量缓存
- 结构化数据：列表缓存、离线数据，需要查询/事务/迁移能力
- 敏感信息：token/密钥，必须走安全存储（依赖平台能力）

常见坑：

- 不能把大 JSON 当 KV 长期无上限缓存，容易造成空间膨胀与卡顿。
- 需要版本迁移：字段变更时要有兼容与清理策略。
- 敏感信息不要明文存储。

:::

## RN 图片加载为什么容易出问题？怎么做优化？

::: details 参考答案

常见问题：

- 图片尺寸太大导致内存飙升或掉帧
- 列表里大量图片导致滚动卡顿
- 不同平台缓存策略差异导致闪烁/重复加载

优化思路：

- 控制尺寸：服务端下发合适分辨率，避免原图直出
- 控制渲染：列表项复用 + 避免频繁重渲染
- 缓存策略：对频繁出现的图片做缓存，必要时使用支持缓存与占位的方案

:::

## RN 键盘弹起遮挡输入框怎么处理？

::: details 参考答案

常见处理思路：

- 页面整体可滚动：让输入框在键盘弹起时仍能滚动到可视区域。
- 订阅键盘事件：拿到键盘高度后调整布局（不同平台事件与行为不同）。
- 避免写死高度：多用 Flex 与自适应布局，减少“遮挡”发生概率。

面试表达：用“可滚动容器 + 键盘避让策略”兜底，并在 iOS/Android 分别验证。

:::

## RN 权限（相机/相册/定位）申请流程怎么做？要注意什么？

::: details 参考答案

流程要点：

- 申请前解释：先给用户说明用途，再触发系统弹窗，提升通过率。
- 状态处理：未授权/已拒绝/永久拒绝（需要跳系统设置）要区分。
- 平台差异：iOS/Android 权限文案、行为、回调不同，需要封装统一接口。

工程化要点：

- 权限与功能绑定：没权限要有降级 UI，而不是直接报错。
- 记录拒绝原因与漏斗：帮助产品优化转化。

:::

## RN 崩溃/错误监控怎么接入？哪些问题只能在 Release 暴露？

::: details 参考答案

建议分两类看：

- JS 异常：需要上传 SourceMap 做符号化，否则堆栈难还原。
- 原生崩溃：需要原生符号文件与版本对应，才能定位到具体方法与行。

Release 才常见的问题：

- 混淆/压缩导致的异常
- 资源路径、权限声明、签名、证书相关问题
- 性能差异（开发包调试开销大，Release 更接近线上）

:::

## RN 如何做 OTA（热更新）？有哪些边界与风险？

::: details 参考答案

一句话：OTA 只适合更新 JS 与资源，不适合改原生能力与原生依赖。

边界与风险：

- 原生接口变更：JS 调用的原生模块签名变化会直接崩，必须做版本兼容。
- 灰度与回滚：必须支持分批投放与一键回滚，配合崩溃率/核心链路监控。
- 版本绑定：包体版本、JS 版本、SourceMap/符号文件要严格对应，避免定位困难。

:::

## RN + Expo 项目常用的哪些原生模块？

::: details 参考答案

按“业务常用 + Expo Managed 工作流可直接用”来记：

- 权限与设备信息：`expo-device`、`expo-application`、`expo-constants`
- 安全存储（登录态/敏感配置）：`expo-secure-store`
- 网络与可达性：`expo-network`
- 路由/深链：`expo-linking`
- 相机/相册与媒体：`expo-camera`、`expo-image-picker`、`expo-media-library`
- 定位与地图能力：`expo-location`
- 推送通知：`expo-notifications`
- 文件与分享：`expo-file-system`、`expo-sharing`
- 音视频播放与录制：`expo-av`
- 传感器与触感：`expo-sensors`、`expo-haptics`
- 二维码/条码：`expo-barcode-scanner`
- 剪贴板：`expo-clipboard`

面试加分点：

- “能装包就能用”不等于“装了就生效”：很多模块需要配置权限与系统能力（iOS 的 Info.plist、Android 的权限/特性），Expo 通常通过 `app.json/app.config` + 预构建/构建流程注入。
- 超出 Expo SDK 能力时：要么用支持 Config Plugin 的第三方库接入（配合 EAS Build），要么切到更自由的工作流再写原生代码。
- 选型原则：尽量复用 Expo 官方模块；确实需要自定义原生能力时，优先把接口做薄、可降级、少跨层调用。

:::
