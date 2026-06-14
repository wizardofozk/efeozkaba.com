'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Engineering() {
  const [revealed, setRevealed] = useState(false)
  const [flashDone, setFlashDone] = useState(false)

  useEffect(() => {
    // Flash in matching the video's blue burst
    setTimeout(() => setRevealed(true), 100)
    setTimeout(() => setFlashDone(true), 1200)
  }, [])

  return (
    <main className="relative min-h-screen bg-[#020817] overflow-hidden">

      {/* Blue flash overlay — matches video ending */}
      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.95) 0%, rgba(0,60,180,0.7) 40%, rgba(0,0,20,0) 80%)',
          opacity: flashDone ? 0 : revealed ? 0.9 : 1,
        }}
      />

      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,150,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing orb top center */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,120,255,0.4) 0%, transparent 70%)' }}
      />

      {/* Nav */}
      <nav className={`relative z-10 flex items-center justify-between px-12 py-8 transition-all duration-1000 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <Link href="/" className="text-white/40 text-xs tracking-[0.4em] uppercase hover:text-white transition-colors">
          ← Efe Özkaba
        </Link>
        <div className="flex gap-8">
          {['Projects', 'Research', 'About'].map(item => (
            <a key={item} href="#" className="text-white/40 text-xs tracking-[0.3em] uppercase hover:text-blue-400 transition-colors">
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className={`relative z-10 px-12 pt-16 pb-24 transition-all duration-1000 delay-300 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-blue-400/70 text-xs tracking-[0.5em] uppercase mb-6">The Engineer</p>
        <h1 className="text-white text-6xl font-thin tracking-tight leading-tight mb-6">
          Robotics.<br />
          <span className="text-blue-400">Innovation.</span><br />
          Future.
        </h1>
        <p className="text-white/40 text-lg font-light max-w-lg leading-relaxed">
          Exploring the intersection of technology and human potential. From autonomous systems to the machines that will define tomorrow.
        </p>
      </section>

      {/* Dummy post cards */}
      <section className={`relative z-10 px-12 pb-24 transition-all duration-1000 delay-500 ${flashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'The Future of Robotics', tag: 'Robotics', date: 'Jun 2026' },
            { title: 'Innovation in Smart Cities', tag: 'Innovation', date: 'May 2026' },
            { title: 'AI & Beyond', tag: 'Technology', date: 'Apr 2026' },
          ].map((post, i) => (
            <div
              key={i}
              className="group border border-white/5 rounded-lg p-6 hover:border-blue-400/30 transition-all duration-300 cursor-pointer"
              style={{ background: 'rgba(0,30,60,0.4)', backdropFilter: 'blur(10px)' }}
            >
              <p className="text-blue-400/60 text-xs tracking-[0.3em] uppercase mb-3">{post.tag}</p>
              <h3 className="text-white text-lg font-light leading-snug mb-4 group-hover:text-blue-200 transition-colors">{post.title}</h3>
              <p className="text-white/25 text-xs">{post.date}</p>
              <div className="mt-4 h-px w-0 bg-blue-400/50 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
