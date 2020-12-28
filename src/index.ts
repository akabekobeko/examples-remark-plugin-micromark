import { Attacher, Transformer } from 'unified'
import visit from 'unist-util-visit-parents'

const transformer: Transformer = (tree, _file) => {
  visit(tree, 'text', (node, parents) => {
    const value = typeof node.value === 'string' ? node.value.trim() : ''
    if (!value) {
      return
    }

    const match = /^{(.+?)\|(.+?)}/.exec(value)

    console.log(match)
    console.log(node)
  })
}

const mdast: Attacher = () => transformer

export default mdast
