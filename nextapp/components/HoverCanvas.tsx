'use client'
import { useEffect, useRef } from 'react'

type Side = 'robot' | 'human' | null

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

export default function HoverCanvas({ hovered }: { hovered: Side }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef<Side>(hovered)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Fingertip positions — calibrated to the Sistine image
    const getFingerL = () => ({ x: canvas.width * 0.47, y: canvas.height * 0.50 })
    const getFingerR = () => ({ x: canvas.width * 0.545, y: canvas.height * 0.50 })

    const spawnParticle = (side: Side): Particle => {
      // Spawn from the relevant arm area
      const isRobot = side === 'robot'
      const baseX = isRobot ? canvas.width * 0.2 : canvas.width * 0.7
      return {
        x: baseX + (Math.random() - 0.5) * canvas.width * 0.12,
        y: canvas.height * 0.58 + Math.random() * canvas.height * 0.08,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        life: 0,
        maxLife: 80 + Math.random() * 60,
        size: Math.random() * 2.5 + 0.5,
      }
    }

    // Draw lightning bolt between two points
    const drawLightning = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, alpha: number, segments = 8) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 12
      ctx.shadowColor = color
      ctx.beginPath()
      ctx.moveTo(x1, y1)

      const dx = (x2 - x1) / segments
      const dy = (y2 - y1) / segments
      for (let i = 1; i < segments; i++) {
        const px = x1 + dx * i + (Math.random() - 0.5) * 28
        const py = y1 + dy * i + (Math.random() - 0.5) * 18
        ctx.lineTo(px, py)
      }
      ctx.lineTo(x2, y2)
      ctx.stroke()

      // Thinner brighter core
      ctx.lineWidth = 0.5
      ctx.globalAlpha = alpha * 0.8
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.restore()
    }

    let t = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const side = hoveredRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!side) {
        particlesRef.current = []
        return
      }

      t++
      const isRobot = side === 'robot'
      const color = isRobot ? '#00aaff' : '#ffb830'
      const glowColor = isRobot ? 'rgba(0,150,255,0.6)' : 'rgba(255,180,40,0.6)'
      const fl = getFingerL()
      const fr = getFingerR()

      // --- ELECTRICITY between fingertips ---
      if (t % 2 === 0) { // flicker every other frame
        const arcAlpha = 0.4 + Math.random() * 0.5
        drawLightning(ctx, fl.x, fl.y, fr.x, fr.y, color, arcAlpha)
        // Second thinner arc
        if (Math.random() > 0.4) {
          drawLightning(ctx, fl.x, fl.y, fr.x, fr.y, color, arcAlpha * 0.4, 6)
        }
      }

      // Glow orb at each fingertip
      const drawOrb = (x: number, y: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 30)
        g.addColorStop(0, glowColor)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 30, 0, Math.PI * 2)
        ctx.fill()
      }
      drawOrb(fl.x, fl.y)
      drawOrb(fr.x, fr.y)

      // --- PARTICLES ---
      // Spawn new ones
      if (t % 3 === 0) {
        particlesRef.current.push(spawnParticle(side))
        if (Math.random() > 0.6) particlesRef.current.push(spawnParticle(side))
      }

      // Update + draw
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife)
      for (const p of particlesRef.current) {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.008 // slight acceleration upward
        p.vx += (Math.random() - 0.5) * 0.1

        const progress = p.life / p.maxLife
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8

        ctx.save()
        ctx.globalAlpha = alpha * 0.85
        ctx.fillStyle = color
        ctx.shadowBlur = 6
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
