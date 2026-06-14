import * as cheerio from 'cheerio'

export function extractContent(rawHtml: string): string {
  const $ = cheerio.load(rawHtml)

  // Remove language selector, animated headlines, shortcodes, footer CTAs, SVGs
  $('[data-widget_type="shortcode.default"]').remove()
  $('[data-widget_type="animated-headline.default"]').remove()
  $('[data-widget_type="image.default"]').remove()
  $('[data-widget_type="icon.default"]').remove()
  $('[data-widget_type="icon-box.default"]').remove()
  $('svg').remove()
  $('[class*="eael-wrapper-link"]').remove()
  $('[class*="create-together"]').remove()
  $('[class*="handshake"]').remove()

  // Remove elements that link to contact page (footer CTA)
  $('a[href*="contact"]').closest('.e-con').remove()

  // Remove the main H1 heading (already shown from data.title)
  $('[data-widget_type="heading.default"]').first().remove()

  // Collect clean content from text-editor and remaining heading widgets
  const parts: string[] = []

  $('[data-widget_type="heading.default"], [data-widget_type="text-editor.default"], [data-widget_type="table-of-contents.default"]').each((_, el) => {
    const widgetType = $(el).attr('data-widget_type') || ''

    // Skip table of contents
    if (widgetType.includes('table-of-contents')) return

    const container = $(el).find('.elementor-widget-container').first()
    const inner = container.html() || ''
    if (inner.trim()) parts.push(inner.trim())
  })

  // If nothing extracted (different structure), fall back to grabbing all paragraphs/headings
  if (parts.length === 0) {
    $('h1, h2, h3, h4, p, ul, ol, table, blockquote').each((_, el) => {
      const text = $(el).text().trim()
      if (text.length > 10) parts.push($.html(el) || '')
    })
  }

  return parts.join('\n')
}
