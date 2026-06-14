'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

type Side = 'traveler' | 'engineer' | null

export default function SistineScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    humanArm: THREE.Group
    robotArm: THREE.Group
    particles: THREE.Points
    animFrame: number
  } | null>(null)

  const [chosen, setChosen] = useState<Side>(null)
  const [hovered, setHovered] = useState<Side>(null)
  const [exploded, setExploded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.FogExp2(0x000000, 0.05)

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111111)
    scene.add(ambientLight)

    const humanLight = new THREE.PointLight(0xffd4a0, 3, 20)
    humanLight.position.set(-4, 2, 3)
    scene.add(humanLight)

    const robotLight = new THREE.PointLight(0x00aaff, 3, 20)
    robotLight.position.set(4, 2, 3)
    scene.add(robotLight)

    // --- HUMAN ARM (left side) ---
    const humanArm = new THREE.Group()

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc8956c, roughness: 0.8, metalness: 0 })

    // Upper arm
    const upperArmGeo = new THREE.CapsuleGeometry(0.18, 1.2, 8, 16)
    const upperArmMesh = new THREE.Mesh(upperArmGeo, skinMat)
    upperArmMesh.rotation.z = -Math.PI / 4
    upperArmMesh.position.set(-0.3, 0.3, 0)
    humanArm.add(upperArmMesh)

    // Forearm
    const foreArmGeo = new THREE.CapsuleGeometry(0.14, 1.0, 8, 16)
    const foreArmMesh = new THREE.Mesh(foreArmGeo, skinMat)
    foreArmMesh.rotation.z = Math.PI / 8
    foreArmMesh.position.set(0.5, -0.4, 0)
    humanArm.add(foreArmMesh)

    // Hand/finger pointing
    const handGeo = new THREE.SphereGeometry(0.16, 12, 12)
    const handMesh = new THREE.Mesh(handGeo, skinMat)
    handMesh.position.set(1.05, -0.75, 0)
    humanArm.add(handMesh)

    // Index finger
    const fingerGeo = new THREE.CapsuleGeometry(0.06, 0.35, 6, 8)
    const fingerMesh = new THREE.Mesh(fingerGeo, skinMat)
    fingerMesh.rotation.z = Math.PI / 2
    fingerMesh.position.set(1.35, -0.75, 0)
    humanArm.add(fingerMesh)

    humanArm.position.set(-3.5, 1, 0)
    humanArm.rotation.z = -0.2
    scene.add(humanArm)

    // --- ROBOT ARM (right side) ---
    const robotArm = new THREE.Group()
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.3, metalness: 0.9 })
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, roughness: 0.2, metalness: 1.0, emissive: 0x002244 })

    // Upper arm segment
    const rUpperGeo = new THREE.BoxGeometry(0.32, 1.3, 0.28)
    const rUpperMesh = new THREE.Mesh(rUpperGeo, metalMat)
    rUpperMesh.rotation.z = Math.PI / 4
    rUpperMesh.position.set(0.3, 0.3, 0)
    robotArm.add(rUpperMesh)

    // Joint sphere
    const jointGeo = new THREE.SphereGeometry(0.22, 12, 12)
    const jointMesh = new THREE.Mesh(jointGeo, accentMat)
    jointMesh.position.set(0.65, -0.28, 0)
    robotArm.add(jointMesh)

    // Forearm segment
    const rForeGeo = new THREE.BoxGeometry(0.26, 1.0, 0.22)
    const rForeMesh = new THREE.Mesh(rForeGeo, metalMat)
    rForeMesh.rotation.z = -Math.PI / 10
    rForeMesh.position.set(0.55, -0.85, 0)
    robotArm.add(rForeMesh)

    // Claw/finger
    const clawGeo = new THREE.ConeGeometry(0.08, 0.4, 6)
    const clawMesh = new THREE.Mesh(clawGeo, accentMat)
    clawMesh.rotation.z = -Math.PI / 2
    clawMesh.position.set(-1.38, -0.78, 0)
    robotArm.add(clawMesh)

    // Glow ring on joint
    const ringGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 24)
    const ringMesh = new THREE.Mesh(ringGeo, accentMat)
    ringMesh.position.set(0.65, -0.28, 0)
    robotArm.add(ringMesh)

    robotArm.position.set(3.5, 1, 0)
    robotArm.rotation.z = 0.2
    scene.add(robotArm)

    // --- CENTER SPARK ---
    const sparkGeo = new THREE.SphereGeometry(0.08, 8, 8)
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const spark = new THREE.Mesh(sparkGeo, sparkMat)
    spark.position.set(0, -0.75, 0)
    spark.scale.set(0, 0, 0)
    scene.add(spark)

    // --- PARTICLE FIELD ---
    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      // left half warm, right half cool
      const side = positions[i * 3] < 0 ? 0 : 1
      colors[i * 3] = side === 0 ? 0.9 : 0.1
      colors[i * 3 + 1] = side === 0 ? 0.6 : 0.6
      colors[i * 3 + 2] = side === 0 ? 0.2 : 1.0
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const particleMat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.6 })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Entry animation — arms slide in from sides
    gsap.fromTo(humanArm.position, { x: -10 }, { x: -3.5, duration: 2.5, ease: 'power3.out', delay: 0.3 })
    gsap.fromTo(robotArm.position, { x: 10 }, { x: 3.5, duration: 2.5, ease: 'power3.out', delay: 0.3 })

    // Idle float animation
    gsap.to(humanArm.position, { y: 1.3, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to(robotArm.position, { y: 0.7, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to(ringMesh.rotation, { z: Math.PI * 2, duration: 3, repeat: -1, ease: 'none' })

    // Render loop
    let t = 0
    const animate = () => {
      if (!sceneRef.current) return
      const id = requestAnimationFrame(animate)
      sceneRef.current.animFrame = id
      t += 0.008
      particles.rotation.y = t * 0.05
      particles.rotation.x = t * 0.02
      humanLight.intensity = 2.5 + Math.sin(t * 1.5) * 0.5
      robotLight.intensity = 2.5 + Math.cos(t * 1.8) * 0.5
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = { renderer, scene, camera, humanArm, robotArm, particles, animFrame: 0 }

    // Resize handler
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (sceneRef.current) cancelAnimationFrame(sceneRef.current.animFrame)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  const handleChoose = (side: Side) => {
    if (!sceneRef.current || exploded) return
    const { humanArm, robotArm, scene, camera } = sceneRef.current
    setChosen(side)
    setExploded(true)

    // Slam the chosen arm toward center
    const chosenArm = side === 'traveler' ? humanArm : robotArm
    const otherArm = side === 'traveler' ? robotArm : humanArm

    gsap.to(chosenArm.position, { x: side === 'traveler' ? -0.5 : 0.5, duration: 0.6, ease: 'power4.in' })
    gsap.to(otherArm.position, { x: side === 'traveler' ? -12 : 12, y: -5, duration: 1.2, ease: 'power3.in' })

    // Flash + camera shake
    setTimeout(() => {
      const flash = new THREE.AmbientLight(0xffffff, 20)
      scene.add(flash)
      gsap.to(flash, { intensity: 0, duration: 0.8, onComplete: () => scene.remove(flash) })
      gsap.to(camera.position, { x: 0.3, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' })
    }, 600)

    // Navigate after effect
    setTimeout(() => {
      window.location.href = side === 'traveler' ? '/travel' : '/engineering'
    }, 2000)
  }

  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none">

        {/* Title */}
        <div className="mb-12 text-center pointer-events-none">
          <p className="text-white/40 text-sm tracking-[0.4em] uppercase mb-3">choose your side</p>
          <h1 className="text-white text-5xl font-thin tracking-widest">Efe Özkaba</h1>
        </div>

        {/* Two choice buttons */}
        <div className="flex gap-32 pointer-events-auto">
          <button
            onMouseEnter={() => {
              setHovered('traveler')
              if (sceneRef.current) gsap.to(sceneRef.current.humanArm.position, { x: -2.5, duration: 0.4, ease: 'power2.out' })
            }}
            onMouseLeave={() => {
              setHovered(null)
              if (sceneRef.current) gsap.to(sceneRef.current.humanArm.position, { x: -3.5, duration: 0.6, ease: 'power2.out' })
            }}
            onClick={() => handleChoose('traveler')}
            className={`group flex flex-col items-center gap-3 transition-all duration-300 ${hovered === 'traveler' ? 'scale-110' : 'scale-100'}`}
          >
            <span className="text-4xl">🌍</span>
            <span className="text-white/90 text-lg font-light tracking-widest uppercase">Adventurer</span>
            <span className="text-white/40 text-xs tracking-wider">Travel · Food · Life</span>
            <div className={`h-px w-0 bg-amber-400 transition-all duration-500 group-hover:w-full`} />
          </button>

          <button
            onMouseEnter={() => {
              setHovered('engineer')
              if (sceneRef.current) gsap.to(sceneRef.current.robotArm.position, { x: 2.5, duration: 0.4, ease: 'power2.out' })
            }}
            onMouseLeave={() => {
              setHovered(null)
              if (sceneRef.current) gsap.to(sceneRef.current.robotArm.position, { x: 3.5, duration: 0.6, ease: 'power2.out' })
            }}
            onClick={() => handleChoose('engineer')}
            className={`group flex flex-col items-center gap-3 transition-all duration-300 ${hovered === 'engineer' ? 'scale-110' : 'scale-100'}`}
          >
            <span className="text-4xl">⚙️</span>
            <span className="text-white/90 text-lg font-light tracking-widest uppercase">Engineer</span>
            <span className="text-white/40 text-xs tracking-wider">Robotics · Innovation · Tech</span>
            <div className={`h-px w-0 bg-blue-400 transition-all duration-500 group-hover:w-full`} />
          </button>
        </div>
      </div>

      {/* Chosen overlay */}
      {chosen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className={`text-6xl font-thin tracking-[0.5em] uppercase animate-pulse ${chosen === 'traveler' ? 'text-amber-400' : 'text-blue-400'}`}>
            {chosen === 'traveler' ? 'Wandering...' : 'Connecting...'}
          </p>
        </div>
      )}
    </div>
  )
}
