import { unified, Plugin } from 'unified/index.js'
import markdown from 'remark-parse'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import { mdast as mdastRuby, handler as ruby } from './unified'

describe('ruby', () => {
  const processor = unified()
    .use([markdown, remarkParse, mdastRuby])
    .data('settings', { position: false })
    .use([
      [
        remark2rehype,
        {
          allowDangerousHtml: true,
          handlers: { ruby }
        }
      ],
      rehypeRaw
    ] as Plugin[])
    .use(rehypeStringify)
    .freeze()

  it('simple ruby', () => {
    const md = '{行|ぎょう}'
    const html = '<p><ruby>行<rt>ぎょう</rt></ruby></p>'

    expect(String(processor.processSync(md))).toBe(html)
  })
})
