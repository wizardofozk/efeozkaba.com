'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [hovered, setHovered] = useState<'human' | 'robot' | null>(null)
  const [playing, setPlaying] = useState(false)
  const [activeSide, setActiveSide] = useState<'human' | 'robot' | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const navigatedRef = useRef(false)

  const handleClick = (side: 'human' | 'robot') => {
    if (playing) return
    setPlaying(true)
    setActiveSide(side)
    navigatedRef.current = false
    const video = videoRef.current
    if (!video) return
    video.src = side === 'robot' ? '/videos/robot-reveal.mp4' : '/videos/human-reveal.mp4'
    video.play()
    router.prefetch(side === 'robot' ? '/engineering' : '/travel')
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || navigatedRef.current) return
    if (video.duration - video.currentTime <= 0.8) {
      navigatedRef.current = true
      router.push(activeSide === 'robot' ? '/engineering' : '/travel')
    }
  }

  const handleVideoEnd = () => {
    if (!navigatedRef.current) {
      navigatedRef.current = true
      router.push(activeSide === 'robot' ? '/engineering' : '/travel')
    }
  }

  const robotDim = hovered === 'human'
  const humanDim = hovered === 'robot'

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">

      {/* Base image — always sharp and full */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
        style={{ backgroundImage: 'url(/sistine.png)', opacity: playing ? 0 : 1 }}
      />

      {/* Blurred left side — shows when hovering human (right) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: 'url(/sistine.png)',
          filter: 'blur(3px)',
          opacity: !playing && hovered === 'human' ? 1 : 0,
          maskImage: 'linear-gradient(to right, black 0%, black 25%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 25%, transparent 60%)',
        }}
      />

      {/* Blurred right side — shows when hovering robot (left) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: 'url(/sistine.png)',
          filter: 'blur(3px)',
          opacity: !playing && hovered === 'robot' ? 1 : 0,
          maskImage: 'linear-gradient(to left, black 0%, black 25%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to left, black 0%, black 25%, transparent 60%)',
        }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        playsInline
        muted
      />

      {/* Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }}
      />

      {/* Hover zones — positioned over the actual arms only */}
      {!playing && (
        <>
          {/* Robot arm — left side, middle vertical band */}
          <div
            className="absolute cursor-pointer"
            style={{ left: '0%', top: '25%', width: '45%', height: '50%', zIndex: 20 }}
            onMouseEnter={() => setHovered('robot')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick('robot')}
          />
          {/* Human arm — right side, middle vertical band */}
          <div
            className="absolute cursor-pointer"
            style={{ left: '50%', top: '25%', width: '50%', height: '50%', zIndex: 20 }}
            onMouseEnter={() => setHovered('human')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick('human')}
          />
        </>
      )}

      {/* Left label — engineer */}
      {!playing && (
        <div
          className={`absolute left-10 top-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-none ${hovered === 'robot' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          style={{ zIndex: 30 }}
        >
          <p className="text-blue-300/70 text-xs tracking-[0.3em] uppercase mb-2">The Engineer</p>
          <p className="text-white text-2xl font-thin tracking-widest">Robotics · Innovation · Tech</p>
          <div className="mt-3 h-px bg-blue-400 transition-all duration-700" style={{ width: hovered === 'robot' ? '100%' : '0' }} />
        </div>
      )}

      {/* Right label — adventurer */}
      {!playing && (
        <div
          className={`absolute right-10 top-1/2 -translate-y-1/2 text-right transition-all duration-500 pointer-events-none ${hovered === 'human' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
          style={{ zIndex: 30 }}
        >
          <p className="text-amber-300/70 text-xs tracking-[0.3em] uppercase mb-2">The Adventurer</p>
          <p className="text-white text-2xl font-thin tracking-widest">Travel · Food · Life</p>
          <div className="mt-3 h-px bg-amber-400 transition-all duration-700 ml-auto" style={{ width: hovered === 'human' ? '100%' : '0' }} />
        </div>
      )}

      {/* Center text */}
      {!playing && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ zIndex: 30 }}>
          <p className="text-white/40 text-xs tracking-[0.5em] uppercase mb-3">choose your side</p>
          <h1 className="text-white text-4xl font-thin tracking-[0.3em]">Efe Özkaba</h1>
        </div>
      )}

    </main>
  )
}
