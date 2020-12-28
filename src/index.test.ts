import assert from 'assert'
import unified from 'unified'
import markdown from 'remark-parse'
import gfm from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
import raw from 'rehype-raw'
import unistInspect from 'unist-util-inspect'
import ruby from './index'

describe('ruby', () => {
  const processor = unified()
    .use([markdown, gfm, ruby])
    .data('settings', { position: false })
    .use([
      [
        remark2rehype,
        {
          allowDangerousHtml: true
        }
      ],
      raw
    ] as unified.PluggableList<unified.Settings>)
    .use(html)
    .freeze()

  it('simple ruby', () => {
    const md = '{a|b}'
    const html = '<p><ruby>a<rt>b</rt></ruby></p>'
    const mdast = `
root[1]
└─0 paragraph[1]
    └─0 ruby[1]
        │ data: {"hName":"ruby","rubyText":"b"}
        └─0 text "a"
`.trim()

    processor.processSync(md)
    //expect(String(processor.processSync(md))).toBe(html)
    //expect(unistInspect.noColor(processor.parse(md))).toBe(mdast)
  })
})
