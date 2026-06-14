import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GUIDES } from '@/lib/content'
import { extractContent } from '@/lib/extractContent'

const GUIDE_META: Record<string, { tag: string; time: string }> = {
  'japanese-food': { tag: 'Japan · Food', time: '15 min read' },
  'japanese-culture': { tag: 'Japan · Culture', time: '15 min read' },
  'japanese-history': { tag: 'Japan · History', time: '15 min read' },
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = GUIDES[slug]
  if (!data) notFound()

  const meta = GUIDE_META[slug] || { tag: 'Japan', time: 'Read' }

  const cleanContent = extractContent(data.content)

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <nav className="flex items-center justify-between px-12 py-8 border-b border-stone-100">
        <Link href="/travel" className="text-stone-400 text-xs tracking-[0.4em] uppercase hover:text-stone-700 transition-colors">
          ← Deep Travel
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-amber-500 text-xs tracking-[0.3em] uppercase">{meta.tag}</span>
          <span className="text-stone-300 text-xs">{meta.time}</span>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-stone-800 text-4xl font-light leading-tight mb-12"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: cleanContent }} />
      </article>
    </main>
  )
}
