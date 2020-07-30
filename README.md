# AutoSkeletonPlugin

基于 jsdom 的、自动生成骨架的 Webpack 插件，工作方式参考 Prerender-SPA-Plugin

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

        return SkeletonPlugin.generateSkeleton(window, route)
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
