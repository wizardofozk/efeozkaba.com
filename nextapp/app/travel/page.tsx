'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Destinations from '@/components/Destinations'

const STATS = [
  { label: 'Countries', value: 28 },
  { label: 'Continents', value: 3 },
  { label: 'Kilometers', value: 87420 },
  { label: 'Guides Written', value: 12 },
]

const GUIDES = [
  {
    title: 'The Ultimate eSIM Guide',
    hook: 'Roaming charges are a scam. There is a better way — and most travelers still don\'t know it exists.',
    slug: 'esim',
    icon: '📡',
    time: '10 min read',
  },
  {
    title: 'Mastering Google Maps',
    hook: 'You\'ve been using 10% of this app. Offline maps, indoor navigation, hidden local gems — it\'s all in there.',
    slug: 'google-maps',
    icon: '🗺️',
    time: '8 min read',
  },
  {
    title: "Traveler's Toolbox",
    hook: 'Every app, trick and tool I actually use — not what travel bloggers get paid to recommend.',
    slug: 'toolkit',
    icon: '🧰',
    time: '12 min read',
  },
]

const DEEP_DIVES = [
  {
    title: 'Japanese Food in 15 Minutes',
    hook: 'You will sit in front of a bowl of ramen in Tokyo and have no idea what you just ordered — or why it costs ¥1,800. This changes that.',
    slug: 'japanese-food',
    tag: 'Japan',
    time: '15 min read',
  },
  {
    title: 'Japanese Culture & Daily Life',
    hook: 'Psychology says knowledge tied to experience sticks forever. Read this before you land and you will notice things most tourists never see.',
    slug: 'japanese-culture',
    tag: 'Japan',
    time: '15 min read',
  },
  {
    title: "Japan's History in 15 Minutes",
    hook: 'Samurai, emperors, atomic bombs, and bullet trains — all in one island nation. Understanding how Japan got here changes how you see everything there.',
    slug: 'japanese-history',
    tag: 'Japan',
    time: '15 min read',
  },
]

function useCountUp(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, started])
  return count
}

function StatCard({ label, value, started }: { label: string; value: number; started: boolean }) {
  const count = useCountUp(value, 2000, started)
  return (
    <div className="text-center">
      <p className="text-amber-500 text-5xl font-light tabular-nums">
        {count.toLocaleString()}{label === 'Kilometers' ? '+' : ''}
      </p>
      <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mt-2">{label}</p>
    </div>
  )
}

export default function Travel() {
  const [revealed, setRevealed] = useState(false)
  const [flashDone, setFlashDone] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setRevealed(true), 100)
    setTimeout(() => setFlashDone(true), 1400)
    setTimeout(() => setStatsVisible(true), 1800)
  }, [])

  return (
    <main className="relative min-h-screen bg-[#faf7f2] overflow-x-hidden">

      {/* Warm golden flash */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,200,80,0.95) 0%, rgba(180,90,20,0.6) 40%, rgba(250,247,242,0) 80%)',
          opacity: flashDone ? 0 : revealed ? 0.85 : 1,
          transition: 'opacity 1.4s ease-out',
        }}
      />

      {/* Nav */}
      <nav className={`relative z-10 flex items-center justify-between px-12 py-8 transition-all duration-1000 ${flashDone ? 'opacity-100' : 'opacity-0'}`}>
        <Link href="/" className="text-stone-400 text-xs tracking-[0.4em] uppercase hover:text-stone-700 transition-colors">
          ← Efe Özkaba
        </Link>
        <div className="flex gap-8">
          {['Destinations', 'Deep Dives', 'Toolkit'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-stone-400 text-xs tracking-[0.3em] uppercase hover:text-amber-600 transition-colors">
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className={`relative z-10 px-12 pt-8 pb-16 transition-all duration-1000 delay-200 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-6">Deep Travel</p>
        <h1 className="text-stone-800 text-6xl font-light leading-tight mb-8">
          Not just seeing.<br />
          <span className="text-amber-500">Understanding.</span>
        </h1>
        <div className="max-w-2xl space-y-5">
          <p className="text-stone-600 text-lg font-light leading-relaxed">
            Since moving to Germany at 18 for university, I've been exploring the world with an endless curiosity. For me, traveling isn't just about seeing a place — it's about truly understanding it. Wherever I go, I dive into the history, culture, cuisine, and the unique stories that make each place special.
          </p>
          <p className="text-stone-600 text-lg font-light leading-relaxed">
            That's why I describe my approach as <span className="text-amber-500 italic">Deep Travel</span> — going beyond the surface, connecting with the spirit of a place, and carrying the lessons and experiences with you long after you've left.
          </p>
          <p className="text-stone-400 text-base font-light leading-relaxed">
            Before I go anywhere, while I'm there, and even after I return — I'm always researching and learning. This is for curious travelers like me.
          </p>
        </div>
      </section>

      {/* Stats counter — centered */}
      <section className={`relative z-10 px-12 pb-20 transition-all duration-1000 delay-300 ${flashDone ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-4 gap-8 max-w-3xl mx-auto border-y border-stone-200 py-12">
          {STATS.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} started={statsVisible} />
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className={`relative z-10 px-12 pb-24 transition-all duration-1000 delay-400 ${flashDone ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-stone-400 text-xs tracking-[0.4em] uppercase mb-2">Destinations</p>
        <h2 className="text-stone-800 text-3xl font-light mb-2">Where I've been</h2>
        <p className="text-stone-400 text-sm mb-10">Highlighted = guide written · Click to explore</p>
        <Destinations />
      </section>

      {/* Deep Dives */}
      <section id="deep-dives" className={`relative z-10 px-12 pb-24 transition-all duration-1000 delay-500 ${flashDone ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-stone-400 text-xs tracking-[0.4em] uppercase mb-2">Deep Dives</p>
        <h2 className="text-stone-800 text-3xl font-light mb-10">Long reads worth your time</h2>
        <div className="grid grid-cols-3 gap-6 max-w-5xl">
          {DEEP_DIVES.map((d, i) => (
            <a key={i} href={`/travel/guides/${d.slug}`}
              className="group flex flex-col justify-between border border-stone-200 rounded-xl p-8 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 bg-white min-h-64">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-amber-500 text-xs tracking-[0.3em] uppercase">{d.tag}</p>
                  <p className="text-stone-300 text-xs">{d.time}</p>
                </div>
                <h3 className="text-stone-800 text-xl font-light leading-snug mb-4 group-hover:text-stone-900 transition-colors">{d.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed italic">{d.hook}</p>
              </div>
              <div className="flex items-center gap-2 mt-8 text-stone-300 group-hover:text-amber-500 transition-colors">
                <span className="text-xs tracking-widest uppercase">Read</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Toolkit */}
      <section id="toolkit" className={`relative z-10 px-12 pb-32 transition-all duration-1000 delay-600 ${flashDone ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-stone-400 text-xs tracking-[0.4em] uppercase mb-2">Traveler's Toolkit</p>
        <h2 className="text-stone-800 text-3xl font-light mb-10">Tools that actually work</h2>
        <div className="grid grid-cols-3 gap-6 max-w-5xl">
          {GUIDES.map((g, i) => (
            <a key={i} href={`/travel/toolkit/${g.slug}`}
              className="group flex flex-col justify-between border border-stone-200 rounded-xl p-8 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 bg-white min-h-64">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl">{g.icon}</span>
                  <p className="text-stone-300 text-xs">{g.time}</p>
                </div>
                <h3 className="text-stone-800 text-xl font-light leading-snug mb-4 group-hover:text-stone-900 transition-colors">{g.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed italic">{g.hook}</p>
              </div>
              <div className="flex items-center gap-2 mt-8 text-stone-300 group-hover:text-amber-500 transition-colors">
                <span className="text-xs tracking-widest uppercase">Read</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  )
}
