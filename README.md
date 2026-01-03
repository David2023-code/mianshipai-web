# 面试派

系统专业的前端面试导航（VitePress 文档站）。

## 贡献题目和答案

欢迎提交 PR 来贡献题目和答案。

具体步骤如下。

### fork 这个项目

在 GitHub fork 这个项目到你的空间，然后 git clone 下载这个项目到本地，本地运行项目

```
npm i
npm run docs:dev
```

### 修改代码

可以新增题目，也可以修改现有题目的答案（如你有更好的答案）

每个题目的格式如下

```md
## 前端常见的设计模式有哪些？以及应用场景

参考答案

::: details

（简明扼要的写出答案的核心内容，给出必要的解释、代码示例、截图）

（注意，这里不要写的太过于详细，篇幅适中，适合在面试中 2-3 分钟解答完毕）

（更详细的内容可写到你的博客里，贴到下面）

（最后，可以参考 AI 给出的答案，但不要无脑照抄 AI ，要对自己产出的内容负责）

:::

参考资料 （如没有，就不写）

::: details

- 你的博客链接

:::
```

PS. 如有图片，统一放在 `docs/imgs` 目录下。

### 提交 PR

把修改的代码 git commit 和 push 到你自己的 GitHub 项目

然后提交 PR 到 [mianshipai-web](https://github.com/David2023-code/mianshipai-web#) 的 `main` 分支

管理员会每日查看 PR 并审核

## 发布上线

管理员会统一提交 PR ，把 `main` 合并到 `prod-deploy` 分支，合并后即可触发 [actions](https://github.com/David2023-code/mianshipai-web/actions) 并发布上线。
