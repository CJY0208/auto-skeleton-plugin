# AutoSkeletonPlugin

基于 [jsdom](https://github.com/jsdom/jsdom) 的、自动生成骨架的 Webpack 插件，工作方式参考 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)

## 工作方式

1. 等待 webpack 完成打包

2. 启动一个本地静态服务器，按配置的 routes，用 jsdom 启动无头浏览器访问打包结果

3. jsdom 中页面完成渲染后，执行 [generateSkeleton](https://github.com/CJY0208/auto-skeleton-plugin/blob/master/src/generateSkeleton.js) 骨架生成方法，将内容转换为骨架

4. 截取当前页面的 innerHTML 作为骨架预渲染结果，输出成 html 文件

5. 根据配置的 staticDir 将 html 文件存进去，over

---

## 基本使用方式

```js
const AutoSkeletonPlugin = require('auto-skeleton-plugin')

module.exports = {
  plugins: [
    ...
    new AutoSkeletonPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: paths.appBuild,
      // Required - Routes to render.
      routes: ['/'],
    })
  ]
}
```

---

## 自定义骨架生成过程

目前的生成骨架生成规则比较简陋，需要调整生成过程以适应不同项目

```js
const AutoSkeletonPlugin = require('auto-skeleton-plugin')

module.exports = {
  plugins: [
    ...
    new AutoSkeletonPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: paths.appBuild,
      // Required - Routes to render.
      routes: ['/'],
      generateSkeleton(window, route) {
        const { document } = window
        const spinner = document.getElementById('spinner')
        spinner.parentNode.removeChild(spinner)

        return AutoSkeletonPlugin.generateSkeleton(window, route)
      },
    })
  ]
}
```

#### 默认的生成过程

```js
function generateSkeleton(window, route) {
  const { document, Text } = window
  const style = document.createElement('style')
  style.innerHTML = `
    ._ske {
      background: #f2f2f2;
      color: transparent;
      text-decoration: none;
      user-select: none;
      pointer-events: none;
    }
    ._ske_img {
      opacity: 0;
      display: inline-block;
    }
  `
  document.head.appendChild(style)

  // 文字节点
  ;[...document.querySelectorAll('*')]
    .filter(
      (node) =>
        !['script', 'style', 'html', 'body', 'head', 'title'].includes(
          node.tagName.toLowerCase()
        )
    )
    .map((node) => [...node.childNodes].filter((node) => node instanceof Text))
    .flat(Infinity)
    .forEach((node) => {
      let span = document.createElement('span')
      node.parentNode.insertBefore(span, node)
      span.appendChild(node)
      span.classList.add('_ske')
    })
  // 图标节点
  ;[...document.querySelectorAll('*')]
    .filter((node) => ['i'].includes(node.tagName.toLowerCase()))
    .forEach((node) => {
      node.classList.add('_ske')
    })
  // 图片节点
  ;[...document.querySelectorAll('*')]
    .filter((node) => ['img'].includes(node.tagName.toLowerCase()))
    .forEach((node) => {
      let span = document.createElement('span')
      node.parentNode.insertBefore(span, node)
      span.appendChild(node)
      span.classList.add('_ske')
      node.classList.add('_ske_img')
    })
}
```
