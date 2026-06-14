'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Travel() {
  const [revealed, setRevealed] = useState(false)
  const [flashDone, setFlashDone] = useState(false)

  useEffect(() => {
    setTimeout(() => setRevealed(true), 100)
    setTimeout(() => setFlashDone(true), 1400)
  }, [])

  return (
    <main className="relative min-h-screen bg-[#0d0a06] overflow-hidden">

      {/* Warm golden flash — matches human eye video ending */}
      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1200"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,200,80,0.95) 0%, rgba(180,90,20,0.6) 40%, rgba(10,5,0,0) 80%)',
          opacity: flashDone ? 0 : revealed ? 0.85 : 1,
          transition: 'opacity 1.4s ease-out',
        }}
      />

      {/* Warm texture background */}
      <div className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(255,160,40,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180,100,20,0.3) 0%, transparent 50%)',
        }}
      />

      {/* Glowing orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(220,140,30,0.3) 0%, transparent 70%)' }}
      />

      {/* Nav */}
      <nav className={`relative z-10 flex items-center justify-between px-12 py-8 transition-all duration-1000 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <Link href="/" className="text-white/40 text-xs tracking-[0.4em] uppercase hover:text-white transition-colors">
          ← Efe Özkaba
        </Link>
        <div className="flex gap-8">
          {['Destinations', 'Food', 'Stories'].map(item => (
            <a key={item} href="#" className="text-white/40 text-xs tracking-[0.3em] uppercase hover:text-amber-400 transition-colors">
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className={`relative z-10 px-12 pt-16 pb-24 transition-all duration-1000 delay-300 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-amber-400/70 text-xs tracking-[0.5em] uppercase mb-6">The Adventurer</p>
        <h1 className="text-white text-6xl font-thin tracking-tight leading-tight mb-6">
          Wander.<br />
          <span className="text-amber-400">Taste.</span><br />
          Experience.
        </h1>
        <p className="text-white/40 text-lg font-light max-w-lg leading-relaxed">
          From hidden ramen bars in Tokyo to waterfalls in Bali. Every place has a story — these are mine.
        </p>
      </section>

      {/* Dummy post cards */}
      <section className={`relative z-10 px-12 pb-24 transition-all duration-1000 delay-500 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'Tokyo — The City That Never Sleeps', tag: 'Japan', date: 'Jun 2026' },
            { title: 'Best Wagyu in Osaka', tag: 'Gastronomy', date: 'May 2026' },
            { title: 'Kyoto in Cherry Blossom Season', tag: 'Japan', date: 'Apr 2026' },
          ].map((post, i) => (
            <div
              key={i}
              className="group border border-white/5 rounded-lg p-6 hover:border-amber-400/30 transition-all duration-300 cursor-pointer"
              style={{ background: 'rgba(40,20,5,0.5)', backdropFilter: 'blur(10px)' }}
            >
              <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mb-3">{post.tag}</p>
              <h3 className="text-white text-lg font-light leading-snug mb-4 group-hover:text-amber-200 transition-colors">{post.title}</h3>
              <p className="text-white/25 text-xs">{post.date}</p>
              <div className="mt-4 h-px w-0 bg-amber-400/50 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
