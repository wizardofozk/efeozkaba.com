'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const WRITTEN_COUNTRIES = ['JP', 'TR', 'MY']
const VISITED_COUNTRIES = ['JP', 'TR', 'MY', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'US', 'TH', 'SG', 'AE', 'GR', 'PT', 'HR', 'CZ', 'AT']

const COUNTRY_INFO: Record<string, { name: string; slug: string; desc: string; lat: number; lng: number; flag: string }> = {
  JP: { name: 'Japan', slug: 'japan', desc: 'Tokyo, Kyoto, Osaka, Nara, Kobe — full guides', lat: 36, lng: 138, flag: '🇯🇵' },
  TR: { name: 'Turkey', slug: 'turkey', desc: 'Home country — coming soon', lat: 39, lng: 35, flag: '🇹🇷' },
  MY: { name: 'Malaysia', slug: 'malaysia', desc: 'Kuala Lumpur — coming soon', lat: 4, lng: 109, flag: '🇲🇾' },
}

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default function TravelGlobe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)
  const [flagPositions, setFlagPositions] = useState<{ iso: string; x: number; y: number; visible: boolean }[]>([])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = 500
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 3.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Globe sphere
    const globeGeo = new THREE.SphereGeometry(1, 64, 64)
    const textureLoader = new THREE.TextureLoader()
    const earthTex = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    const globeMat = new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x222222), shininess: 15 })
    const globeMesh = new THREE.Mesh(globeGeo, globeMat)
    scene.add(globeMesh)

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.06, 64, 64)
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0xffaa00, transparent: true, opacity: 0.06, side: THREE.BackSide
    })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // Lights
    scene.add(new THREE.AmbientLight(0x333333))
    const sun = new THREE.DirectionalLight(0xffffff, 1.2)
    sun.position.set(5, 3, 5)
    scene.add(sun)

    // Country marker dots
    const markerGroup = new THREE.Group()
    scene.add(markerGroup)

    const markerMeshes: { mesh: THREE.Mesh; iso: string }[] = []

    Object.entries(COUNTRY_INFO).forEach(([iso, info]) => {
      const pos = latLngToVec3(info.lat, info.lng, 1.02)
      const isWritten = WRITTEN_COUNTRIES.includes(iso)

      // Glowing dot
      const geo = new THREE.SphereGeometry(isWritten ? 0.025 : 0.015, 12, 12)
      const mat = new THREE.MeshBasicMaterial({
        color: isWritten ? 0xfbbf24 : 0xfbbf24,
        transparent: true,
        opacity: isWritten ? 1 : 0.4,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos)
      markerGroup.add(mesh)
      markerMeshes.push({ mesh, iso })

      // Outer ring for written countries
      if (isWritten) {
        const ringGeo = new THREE.RingGeometry(0.032, 0.042, 24)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.position.copy(pos)
        ring.lookAt(new THREE.Vector3(0, 0, 0))
        markerGroup.add(ring)
      }
    })

    // Visited country arcs (subtle lines between visited places)
    // Auto-rotate
    let autoRotate = true
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    let rotY = 2.0
    let camZ = 3.2

    // Zoom with scroll
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camZ = Math.max(1.5, Math.min(6, camZ + e.deltaY * 0.005))
      camera.position.z = camZ
    }
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      autoRotate = false
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => {
      isDragging = false
      setTimeout(() => { autoRotate = true }, 2000)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x
        rotY += dx * 0.005
        prevMouse = { x: e.clientX, y: e.clientY }
      }

      // Tooltip raycasting
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(markerMeshes.map(m => m.mesh))
      if (hits.length > 0) {
        const hit = markerMeshes.find(m => m.mesh === hits[0].object)
        if (hit && COUNTRY_INFO[hit.iso]) {
          mount.style.cursor = 'pointer'
          setTooltip({ name: COUNTRY_INFO[hit.iso].name, x: e.clientX - rect.left, y: e.clientY - rect.top })
        }
      } else {
        mount.style.cursor = 'grab'
        setTooltip(null)
      }
    }
    const onClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(markerMeshes.map(m => m.mesh))
      if (hits.length > 0) {
        const hit = markerMeshes.find(m => m.mesh === hits[0].object)
        if (hit && WRITTEN_COUNTRIES.includes(hit.iso)) setSelected(hit.iso)
      }
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)

    let frame = 0
    let t = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      t += 0.01
      if (autoRotate) rotY += 0.002
      globeMesh.rotation.y = rotY
      markerGroup.rotation.y = rotY

      // Pulse written country markers
      markerMeshes.forEach(({ mesh, iso }) => {
        if (WRITTEN_COUNTRIES.includes(iso)) {
          const s = 1 + Math.sin(t * 2) * 0.2
          mesh.scale.setScalar(s)
        }
      })

      renderer.render(scene, camera)

      // Project flag positions to screen
      const flags = WRITTEN_COUNTRIES.map(iso => {
        const info = COUNTRY_INFO[iso]
        const worldPos = latLngToVec3(info.lat, info.lng, 1.12)
        // Apply globe rotation
        const rotated = worldPos.clone().applyEuler(new THREE.Euler(0, rotY, 0))
        const projected = rotated.clone().project(camera)
        const x = (projected.x + 1) / 2 * W
        const y = -(projected.y - 1) / 2 * H
        const visible = projected.z < 1 && rotated.z > 0
        return { iso, x, y, visible }
      })
      setFlagPositions(flags)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth
      camera.aspect = w / H
      camera.updateProjectionMatrix()
      renderer.setSize(w, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
      renderer.domElement.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative">
      <div ref={mountRef} className="w-full rounded-xl" style={{ height: 500, cursor: 'grab' }} />

      {/* Flag overlays */}
      {flagPositions.map(({ iso, x, y, visible }) => visible && (
        <div
          key={iso}
          className="absolute pointer-events-none select-none transition-opacity duration-300"
          style={{ left: x - 16, top: y - 40, opacity: visible ? 1 : 0 }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl drop-shadow-lg">{COUNTRY_INFO[iso].flag}</span>
            <span className="text-white/60 text-[10px] tracking-wider bg-black/40 px-1 rounded">{COUNTRY_INFO[iso].name}</span>
          </div>
        </div>
      ))}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute pointer-events-none z-10 px-3 py-2 rounded text-xs text-white border border-amber-400/30"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10, background: 'rgba(13,10,6,0.95)' }}>
          {tooltip.name}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-white/40 text-xs">Guide written</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400/30" />
          <span className="text-white/40 text-xs">Visited</span>
        </div>
      </div>

      {/* Selected country panel */}
      {selected && COUNTRY_INFO[selected] && (
        <div className="mt-6 border border-amber-400/30 rounded-lg p-6 flex items-center justify-between"
          style={{ background: 'rgba(40,20,5,0.6)', backdropFilter: 'blur(10px)' }}>
          <div>
            <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mb-1">Selected destination</p>
            <h3 className="text-white text-2xl font-thin">{COUNTRY_INFO[selected].name}</h3>
            <p className="text-white/40 text-sm mt-1">{COUNTRY_INFO[selected].desc}</p>
          </div>
          <a href={`/travel/${COUNTRY_INFO[selected].slug}`}
            className="px-6 py-3 border border-amber-400/50 text-amber-400 text-xs tracking-widest uppercase hover:bg-amber-400/10 transition-colors rounded">
            Explore →
          </a>
        </div>
      )}
    </div>
  )
}
