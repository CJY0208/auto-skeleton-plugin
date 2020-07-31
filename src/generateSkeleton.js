const { flatten } = require('szfe-tools')

function generateSkeleton(window, route) {
  const { document, Text } = window
  const style = document.createElement('style')
  style.innerHTML = `
    ._ske {
      background: #f2f2f2;
      color: transparent !important;
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
  flatten([...document.querySelectorAll('*')]
    .filter(
      (node) =>
        !['script', 'style', 'html', 'body', 'head', 'title'].includes(
          node.tagName.toLowerCase()
        )
    )
    .map((node) => [...node.childNodes].filter((node) => node instanceof Text)))
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

module.exports = generateSkeleton
