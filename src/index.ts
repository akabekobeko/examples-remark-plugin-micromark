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
  const regexp = /{(.+?)\|(.+?)}/g
  const value = typeof node.value === 'string' ? node.value.trim() : ''
  if (!value) {
    return
  }

  const match = regexp.exec(value)

  console.log(match)
  console.log(index)
  console.log(parent)
  console.log(node)
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
