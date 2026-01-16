# HTTP 网络请求

HTTP 和 Ajax 是前后端沟通的桥梁，面试重点考察，无论工作经验长短。

## TCP 三次握手和四次挥手

::: details 参考答案

三次握手

- 客户端向服务端发送建立连接请求，客户端进入 SYN-SEND 状态
- 服务端收到建立连接请求后，向客户端发送一个应答，服务端进入 SYN-RECEIVED 状态
- 客户端接收到应答后，向服务端发送确认接收到应答，客户端进入 ESTABLISHED 状态

四次挥手

- 客户端向服务端发送断开连接请求
- 服务端收到断开连接请求后，告诉应用层去释放 tcp 连接
- 服务端向客户端发送最后一个数据包 FINBIT ，服务端进入 LAST-ACK 状态
- 客户端收到服务端的断开连接请求后，向服务端确认应答

> 三次握手四次挥手，客户端都是主动方，服务端都是被动方。在状态方面：三次握手的客户端和服务端都是由原来的 closed 变为 established，四次挥手的客户端和服务端都是由原来的 established 变为 closed。

:::

## 为什么 TCP 需要三次握手？

::: details 参考答案

一句话：三次握手的目标是**让双方确认“能收能发”并同步初始序列号（ISN）**，避免历史重复报文导致服务端误建连接、白白占用资源。

拆开说（按面试表达）：

1. **确认双向通信能力**：
   - 第一次（SYN）：客户端 → 服务端，证明“客户端能发、服务端能收”。
   - 第二次（SYN+ACK）：服务端 → 客户端，证明“服务端能发、客户端能收”，同时也对客户端的 SYN 做确认。
   - 第三次（ACK）：客户端 → 服务端，证明“客户端也能收并确认服务端的 SYN”，服务端收到后才敢认为连接真的建立完成。
2. **同步双方初始序列号（ISN）**：
   - TCP 需要双方各自的起始序列号来保证可靠、有序传输，三次握手完成双方 ISN 的交换与确认。
3. **防止“已失效/延迟的连接请求”造成误连接**：
   - 如果只有两次握手，某些延迟到达的旧 SYN 可能让服务端进入已连接或半连接状态并分配资源，但客户端并不认为自己要建立这条连接。
   - 第三次 ACK 相当于“最终确认”，服务端收不到就不会进入 ESTABLISHED（只会等待并超时回收）。

:::

## HTTP 1.0, 1.1, 2.0, 3.0 的区别

::: details 参考答案

1. **HTTP 1.0**:

   - **短连接**: 每次请求都建立新的 TCP 连接。
   - 无 Host 头。

2. **HTTP 1.1** (主流):

   - **长连接 (Keep-Alive)**: 默认开启，复用 TCP 连接。
   - **管道化 (Pipelining)**: 可并发发送请求，但响应必须按顺序返回 (导致**队头阻塞**)。
   - **断点续传**: 支持 Range 头。
   - 新增 Host 头，支持虚拟主机。

3. **HTTP 2.0**:

   - **多路复用 (Multiplexing)**: 一个 TCP 连接并发处理所有请求，解决了 HTTP 队头阻塞。
   - **二进制分帧**: 数据传输单位是帧 (Frame)，更高效。
   - **头部压缩 (HPACK)**: 压缩请求头，减少体积。
   - **服务端推送 (Server Push)**。

4. **HTTP 3.0 (QUIC)**:

   - **基于 UDP**: 彻底解决 TCP 队头阻塞问题。
   - **0-RTT 建连**: 连接建立更快。
   - **向前纠错**: 丢包重传机制更优。

:::

## HTTP 常见的状态码

::: details 参考答案

- **2xx (成功)**
  - `200 OK`: 请求成功。
  - `204 No Content`: 请求成功但无响应体。
  - `206 Partial Content`: 断点续传/视频流。
- **3xx (重定向)**
  - `301 Moved Permanently`: 永久重定向 (浏览器会缓存)。
  - `302 Found`: 临时重定向。
  - `304 Not Modified`: 协商缓存命中 (未修改)。
- **4xx (客户端错误)**
  - `400 Bad Request`: 参数错误。
  - `401 Unauthorized`: 未登录/Token 过期。
  - `403 Forbidden`: 无权限。
  - `404 Not Found`: 资源未找到。
- **5xx (服务端错误)**
  - `500 Internal Server Error`: 服务器炸了。
  - `502 Bad Gateway`: 网关错误 (如 Nginx 连不上后端)。
  - `503 Service Unavailable`: 超载或维护。
  - `504 Gateway Timeout`: 网关超时。

:::

## HTTP 常见 Header

::: details 参考答案

**请求头 (Request Headers)**

- `Accept`: 客户端可接收的内容类型。
- `Accept-Encoding`: 客户端支持的压缩算法 (gzip, br)。
- `Authorization`: 认证信息 (Bearer Token)。
- `Cookie`: 携带的 Cookie。
- `Origin`: 跨域请求的源。
- `User-Agent`: 客户端信息。

**响应头 (Response Headers)**

- `Content-Type`: 返回内容的类型 (application/json, text/html)。
- `Content-Encoding`: 返回内容的压缩方式。
- `Cache-Control`: 缓存策略。
- `Set-Cookie`: 设置 Cookie。
- `Access-Control-Allow-Origin`: 允许跨域的源。

:::

## GET 和 POST 请求的区别

::: details 参考答案

| 特性         | GET                          | POST                               |
| :----------- | :--------------------------- | :--------------------------------- |
| **语义**     | 获取资源 (读)                | 提交/修改资源 (写)                 |
| **参数位置** | URL Query 参数               | Request Body (请求体)              |
| **数据大小** | 受浏览器/服务器 URL 长度限制 | 理论无限制                         |
| **缓存**     | 浏览器主动缓存               | 默认不缓存                         |
| **安全性**   | 参数暴露在 URL，不安全       | 相对安全 (但 HTTPS 才是真正的安全) |
| **幂等性**   | 是 (多次请求结果一致)        | 否                                 |

> **注意**: 底层都是 TCP 连接，本质无区别，区别在于 HTTP 规范和浏览器实现。

:::

## 什么是 HTTPS？加密原理是什么？

::: details 参考答案

**HTTPS = HTTP + SSL/TLS**

**核心目标**: 身份验证、数据加密、完整性校验。

**加密流程 (混合加密)**:

1. **握手阶段 (非对称加密为主)**:
   - 服务端发送**证书** (包含公钥) 给客户端。
   - 客户端验证证书合法性。
   - 客户端生成随机数 (Pre-master secret)，用**服务器公钥**加密发给服务端。
   - 服务端用**服务器私钥**解密，拿到随机数。
2. **密钥派生**:
   - 双方利用这个随机数生成**会话密钥 (Session Key)**。
3. **传输阶段 (对称加密)**:
   - 后续所有数据传输都用会话密钥做**对称加密** (如 AES)，因为对称加密速度快。
4. **完整性与身份**:
   - 通过证书链校验确认“你连的是谁”，通过 MAC/AEAD 等机制保证数据未被篡改。

:::

## 浏览器缓存策略 (强缓存 & 协商缓存)

::: details 参考答案

浏览器每次发起请求，会先在浏览器缓存中查找结果以及缓存标识。

**1. 强缓存 (本地缓存)**
如果不失效，直接使用本地缓存，**不发请求** (状态码 200，显示 `from memory/disk cache`)。

- **Cache-Control** (HTTP/1.1):
  - `max-age=3600`: 3600秒内有效。
  - `no-cache`: 不使用强缓存，必须去服务端验证 (协商缓存)。
  - `no-store`: 禁止任何缓存。
- **Expires** (HTTP/1.0): 绝对时间，受客户端时间影响，已过时。

**2. 协商缓存 (弱缓存)**
强缓存失效后，浏览器会“带标识去问一次服务器”，资源没变就直接用本地的。

- **ETag / If-None-Match** (优先级高):
  - 服务器生成的文件指纹 (Hash)。
  - 如果指纹一致，服务器返回 `304 Not Modified`，客户端读取本地缓存。
- **Last-Modified / If-Modified-Since**:
  - 文件的最后修改时间。
  - 精度只有秒级，可能不准确。

**面试时可以按这个决策顺序回答**:

1. 先看“有没有缓存”；没有就直接请求，返回 `200`。
2. 有缓存先看强缓存是否过期（`Cache-Control/Expires`）；没过期就直接用本地，不发请求。
3. 强缓存过期再走协商缓存：带上 `If-None-Match` 或 `If-Modified-Since` 去问。
4. 服务器判断没变返回 `304`；变了返回 `200` + 新资源 + 新标识。

:::

## 什么是跨域？解决方案有哪些？

::: details 参考答案

**同源策略**: 协议、域名、端口必须完全一致。

**解决方案**:

1. **CORS (跨域资源共享) - 推荐**:
   - 服务端设置 `Access-Control-Allow-Origin`。
   - **简单请求**: 直接发送。
   - **复杂请求** (如 PUT, 自定义 Header): 浏览器先发 **OPTIONS** 预检请求。
2. **Nginx 反向代理**:
   - 前端请求本地 `/api`，Nginx 转发到跨域地址。
3. **开发环境 Proxy**:
   - Vite/Webpack Dev Server 配置 `proxy`。
4. **JSONP**:
   - 利用 `<script>` 标签不跨域特性。只支持 GET，已过时。
5. **WebSocket**: 天然支持跨域。

:::

## 什么是 CSRF 和 XSS 攻击？如何防御？

::: details 参考答案

**1. XSS (跨站脚本攻击)**

- **原理**: 攻击者在页面注入恶意 JS 代码 (如获取 Cookie 发送给黑客)。
- **防御**:
  - **转义**: 对用户输入内容进行 HTML 转义。
  - **CSP (内容安全策略)**: 限制加载外部资源。
  - **HttpOnly**: Cookie 设置 HttpOnly，禁止 JS 读取。

**2. CSRF (跨站请求伪造)**

- **原理**: 用户登录 A 网站，访问 B 网站。B 网站诱导用户点击链接，利用用户在 A 网站的登录态 (Cookie) 发送恶意请求。
- **防御**:
  - **SameSite**: Cookie 设置 `SameSite=Strict/Lax`，禁止跨域发送 Cookie。
  - **CSRF Token**: 请求需携带随机 Token，攻击者拿不到。
  - **验证 Referer**: 检查请求来源。

:::

## Cookie, Session, LocalStorage, SessionStorage 的区别

::: details 参考答案

| 特性         | Cookie                   | Session                    | LocalStorage | SessionStorage     |
| :----------- | :----------------------- | :------------------------- | :----------- | :----------------- |
| **存储位置** | 客户端                   | **服务端**                 | 客户端       | 客户端             |
| **数据大小** | 4KB                      | 无限制                     | 5MB          | 5MB                |
| **有效期**   | 设置的过期时间           | 会话结束 (可配置)          | **永久有效** | **窗口关闭**即清除 |
| **网络传输** | **自动携带**在 Header 中 | 不传输 (通过 Cookie 传 ID) | 不传输       | 不传输             |
| **安全性**   | 易被截获/XSS             | 较安全                     | 易被 XSS     | 易被 XSS           |

:::

## Ajax, Fetch, Axios 的区别

::: details 参考答案

**1. Ajax (XHR)**:

- 原生 `XMLHttpRequest` 对象。
- 基于回调，容易产生回调地狱。
- API 设计较老，配置繁琐。

```javascript
// Ajax 示例
const xhr = new XMLHttpRequest()
xhr.open('GET', '/api/user')
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText))
  }
}
xhr.send()
```

**2. Fetch**:

- **原生** API，基于 **Promise**。
- 语法简洁。
- **缺点**: 默认不带 Cookie，**HTTP 错误码 (404/500) 不会 Reject** (只有网络断了才 Reject)，不支持超时/取消 (需配合 AbortController)。

```javascript
// Fetch 示例
fetch('/api/user')
  .then((res) => {
    if (!res.ok) throw new Error('Network response was not ok')
    return res.json()
  })
  .then((data) => console.log(data))
  .catch((err) => console.error('Fetch error:', err))
```

**3. Axios**:

- **第三方库** (基于 XHR 封装，Node 环境基于 http 模块)。
- 支持 **拦截器** (Interceptors)。
- 自动转换 JSON。
- 支持取消请求、超时配置。
- **推荐使用**。

```javascript
// Axios 示例
axios
  .get('/api/user')
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err))
```

:::

## 什么是 JWT？原理是什么？

::: details 参考答案

**JWT (JSON Web Token)** 是一种无状态的认证机制。

**结构**: `Header.Payload.Signature`

1. **Header**: 算法信息。
2. **Payload**: 业务数据 (用户 ID, 角色, 过期时间)。**不要放敏感信息** (Base64 可解码)。
3. **Signature**: 签名。`HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`

**流程**:

1. 用户登录，服务端生成 JWT 返回。
2. 客户端存入 LocalStorage。
3. 后续请求在 Header 中携带 `Authorization: Bearer <token>`。
4. 服务端验证签名，解析 Payload 获取用户信息。

**优点**: 无状态 (服务端不存 Session)，适合分布式/微服务。
**缺点**: 一旦签发无法撤销 (除非等过期或黑名单)。

:::

## JWT 如何实现自动刷新 Token？

::: details 参考答案

**双 Token 机制**: `Access Token` (短效) + `Refresh Token` (长效)。

**流程**:

1. 登录获取双 Token。
2. 请求接口，如果返回 `401 Unauthorized` (Access Token 过期)。
3. **拦截请求**，使用 `Refresh Token` 请求刷新接口获取新的 `Access Token`。
4. **重发原请求**。
5. 如果 `Refresh Token` 也过期了，跳转登录页。

:::

## 浏览器输入 URL 到页面展示发生了什么？

::: details 参考答案

这是一个极其经典的综合题，建议分阶段回答：

1. **URL 解析**: 检查 URL 合法性，判断是搜索还是网址。
2. **DNS 解析**: 域名 -> IP 地址 (浏览器缓存 -> 系统缓存 -> 路由器 -> DNS 服务器)。
3. **TCP 连接**: 三次握手。
4. **发送 HTTP 请求**: 发送报文 (请求行、头、体)。
5. **服务器处理**: Nginx 反向代理 -> 后端逻辑 -> 数据库 -> 返回响应。
6. **浏览器渲染**:
   - 解析 HTML 生成 **DOM 树**。
   - 解析 CSS 生成 **CSSOM 树**。
   - 合并生成 **Render 树**（只包含可见节点 + 需要渲染的样式）。
   - **布局 (Layout/Reflow)**: 计算几何信息（位置、尺寸）。
   - **绘制 (Paint)**: 把边框、文字、颜色等绘制成位图。
   - **合成 (Composite)**: 分层后交给 GPU 合成，得到最终画面。
7. **断开连接**: 四次挥手。

:::

## 什么是 CDN？原理是什么？

::: details 参考答案

**CDN (内容分发网络)**

**原理**:
通过在网络各处放置节点服务器，将网站内容（静态资源如图片、JS、CSS）缓存到离用户最近的节点上。

**流程**:

1. 用户访问域名。
2. DNS 解析将域名指向 **CDN 负载均衡服务器** (CNAME)。
3. 负载均衡服务器根据用户 IP，返回**最近/最快**的边缘节点 IP。
4. 用户向该节点请求资源。
   - 有缓存: 直接返回。
   - 无缓存: 节点向源站请求资源 (回源)，缓存后返回给用户。

**优点**: 加速访问，减轻源站压力，隐藏源站 IP (安全)。

:::

## WebSocket 也是基于 HTTP 的吗？

::: details 参考答案

**不完全是**。

- **握手阶段**: WebSocket **利用 HTTP 协议建立连接**。客户端发送 `Upgrade: websocket` 头，告诉服务器我要升级协议。
- **传输阶段**: 一旦握手成功，连接升级为 **WebSocket 协议** (TCP 长连接)，后续数据传输完全脱离 HTTP，是全双工的二进制帧传输。

所以：WebSocket **握手**依赖 HTTP，**传输**不依赖 HTTP。

:::

## Script 标签 defer 和 async 的区别？

::: details 参考答案

两者都是异步下载脚本，区别在于**执行时机**：

1. **async**:
   - 下载完**立即执行**，会阻塞 HTML 解析。
   - 执行顺序不确定 (谁先下载完谁执行)。
   - **场景**: 独立的统计脚本 (Google Analytics)。
2. **defer**:
   - 下载完不执行，等待 **HTML 解析完成** (DOMContentLoaded 之前) 执行。
   - 执行顺序**按照书写顺序**。
   - **场景**: 业务逻辑脚本 (推荐)。

:::

## 什么是预加载 (Preload, Prefetch, DNS-Prefetch)？

::: details 参考答案

1. **DNS-Prefetch**: 提前解析域名 IP。
   `<link rel="dns-prefetch" href="//example.com">`
2. **Preconnect**: 提前建立 TCP 连接 (DNS + TCP + SSL)。
   `<link rel="preconnect" href="//example.com">`
3. **Preload**: 提前加载**当前页面**急需的资源 (高优先级)。
   `<link rel="preload" href="style.css" as="style">`
4. **Prefetch**: 提前加载**下个页面**可能用到的资源 (低优先级，空闲时加载)。
   `<link rel="prefetch" href="next-page.js">`

:::

## 前端常见的网络优化手段有哪些？

::: details 参考答案

这是面试中高频的"加分题"，建议从以下几个维度回答：

**1. 减少请求数量**

- **合并资源**: 虽然 HTTP/2 多路复用减弱了合并的必要性，但对于大量小文件（如雪碧图 CSS Sprites）仍然有效。
- **图片处理**: 小图片使用 Base64 内联，减少 HTTP 请求。
- **懒加载 (Lazy Load)**: 图片、组件等进入视口再加载。

**2. 减小请求体积**

- **压缩代码**: Webpack/Vite 生产环境自动压缩 JS/CSS/HTML。
- **开启 Gzip/Brotli**: 服务端 Nginx 开启压缩 (通常能压缩 60%-80%)。
- **图片格式优化**: 使用 WebP 格式 (比 PNG/JPG 小 30% 以上)。

**3. 优化网络传输**

- **CDN**: 将静态资源分发到边缘节点，减少延迟。
- **HTTP/2**: 利用多路复用、头部压缩，解决队头阻塞。
- **DNS 预解析**: 使用 `dns-prefetch` 提前解析域名。

**4. 缓存策略**

- **强缓存**: 对静态资源 (JS/CSS/Img) 设置长过期时间 (`max-age=31536000`)。
- **协商缓存**: 对 HTML 页面设置 `no-cache`，确保及时更新。
- **本地存储**: 利用 LocalStorage 缓存一些不常变的数据。

**5. 加载顺序优化**

- **Script 标签**: 使用 `defer` 或 `async` 避免阻塞 HTML 解析。
- **SSR (服务端渲染)**: 首屏直出 HTML，减少首屏白屏时间。
- **预加载**: 使用 `preload` 加载关键资源。

:::
