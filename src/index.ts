import { Transformer, Plugin } from 'unified'
import { Handler } from 'mdast-util-to-hast'
import all from 'mdast-util-to-hast/lib/all'
import u from 'unist-builder'
import visit from 'unist-util-visit'
import { MdastNode, Parent } from './mdast-node'

const visitor = (
  node: MdastNode,
  index: number,
  parent: Parent | undefined
) => {
  // ruby never becomes the root
  if (!parent) {
    return
  }

  const value = typeof node.value === 'string' ? node.value.trim() : ''
  if (!value) {
    return
  }

  const result: any[] = []
  const regexp = /{(.+?)\|(.+?)}/g
  let start = 0
  let position = 0
  let match = regexp.exec(value)

  while (match) {
    position = match.index
    if (start !== position) {
      result.push({ type: 'text', value: node.value.slice(start, position) })
    }

    const [targetText, baseText, rubyText] = match
    result.push({
      type: 'ruby',
      data: { hName: 'ruby', rubyText },
      children: [{ type: 'text', value: baseText }]
    })

    start = position + targetText.length
    match = regexp.exec(node.value)
  }

  if (0 < result.length) {
    if (start < node.value.length) {
      result.push({ type: 'text', value: node.value.slice(start) })
    }

    // Replace this
    parent.children = parent.children
      .slice(0, index)
      .concat(result, parent.children.slice(index + 1, parent.children.length))

    return index + result.length
  }
}

const transformer: Transformer = (tree) => {
  visit<MdastNode>(tree, 'text', visitor)
}

export const mdast: Plugin = function () {
  return transformer
}

export const handler: Handler = (h, node) => {
  if (!node.data) node.data = {}
  const rtNode = h(
    {
      type: 'element'
    },
    'rt',
    [u('text', node.data.rubyText as string)]
  )

  return h(node, 'ruby', [...all(h, node), rtNode])
}
