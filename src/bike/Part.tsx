import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PARTS_BY_ID, CATEGORIES } from '../data/catalogue'
import { useBike } from '../store'
import { DISASSEMBLY_STEPS, ASSEMBLY_STEPS } from '../data/training'

interface PartProps {
  id: string
  children: React.ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number] | number
}

export function Part({ id, children, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PartProps) {
  const group = useRef<THREE.Group>(null)
  const part = PARTS_BY_ID[id]
  const selectedId = useBike((s) => s.selectedId)
  const hoveredId = useBike((s) => s.hoveredId)
  const explode = useBike((s) => s.explode)
  const removed = useBike((s) => s.removed[id])
  const isolating = useBike((s) => s.isolating)
  const hidden = useBike((s) => (part ? s.hiddenCategories[part.category] : false))
  const ghost = useBike((s) => s.ghostRemoved)
  const showLabels = useBike((s) => s.showLabels)
  const mode = useBike((s) => s.mode)
  const trainingMode = useBike((s) => s.trainingMode)
  const trainingIndex = useBike((s) => s.trainingIndex)
  const setSelected = useBike((s) => s.setSelected)
  const setHovered = useBike((s) => s.setHovered)
  const toggleRemoved = useBike((s) => s.toggleRemoved)

  const catColor = useMemo(() => {
    const c = CATEGORIES.find((x) => x.id === part?.category)?.color ?? '#888'
    return c
  }, [part])

  const isFocus = selectedId === id
  const isHover = hoveredId === id
  const steps = trainingMode === 'disassembly' ? DISASSEMBLY_STEPS : ASSEMBLY_STEPS
  const step = mode === 'training' ? steps[trainingIndex] : undefined
  const inStep = !!step?.partIds.includes(id)

  const restPos = useMemo(() => new THREE.Vector3(...position), [position])
  const restRot = useMemo(() => new THREE.Euler(...rotation), [rotation])
  const target = useMemo(() => new THREE.Vector3(), [])
  const explodeVec = useMemo(
    () => new THREE.Vector3(...(part?.explodedOffset ?? [0, 0.2, 0])),
    [part],
  )

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const t = Math.min(1, dt * 6)
    const e = explode
    target.copy(restPos).addScaledVector(explodeVec, e)
    if (removed) {
      target.addScaledVector(explodeVec, 0.55)
      target.y += 0.12
    }
    g.position.lerp(target, t)
    g.rotation.x += (restRot.x - g.rotation.x) * t
    g.rotation.y += (restRot.y - g.rotation.y) * t
    g.rotation.z += (restRot.z - g.rotation.z) * t
    const hide = hidden || (removed && !ghost) || (isolating && selectedId && selectedId !== id && !inStep)
    const want = hide ? 0 : 1
    g.visible = want > 0.02 || ghost
    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial
        if (!mat || !('emissive' in mat)) return
        mat.transparent = true
        const op = removed && ghost ? 0.22 : hide ? 0 : 1
        mat.opacity += (op - mat.opacity) * t
        mat.depthWrite = mat.opacity > 0.85
        if (isFocus) mat.emissive.set('#3aa0ff')
        else if (inStep) mat.emissive.set('#e8b923')
        else if (isHover) mat.emissive.set('#6ee7b7')
        else mat.emissive.set('#000000')
        mat.emissiveIntensity = isFocus || inStep || isHover ? 0.45 : 0
      })
    })
  })

  if (!part) return null

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        setSelected(id)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        toggleRemoved(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(null)
        document.body.style.cursor = 'auto'
      }}
    >
      {children}
      {showLabels && (isFocus || isHover) && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div
            className="part-tag"
            style={{ borderColor: catColor, color: '#e8eef6' }}
          >
            <b>{part.name}</b>
            <span>{part.geometry === 'cutaway' ? 'cutaway' : part.geometry === 'tool' ? 'tool' : part.id}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export function paint(color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return { color, metalness: 0.35, roughness: 0.42, ...extra }
}

export const PALETTE = {
  paint: '#1e262e',
  paintAccent: '#c45c12',
  frame: '#2a3038',
  engine: '#4a5560',
  engineDark: '#2f3640',
  alloy: '#c5ccd4',
  tyre: '#1a1a1a',
  rubber: '#222',
  disc: '#9aa3ad',
  gold: '#c49a3c',
  exhaust: '#8a9098',
  exhaustDark: '#4c5258',
  seat: '#141414',
  plastic: '#1c2228',
  chrome: '#d7dde4',
  glass: '#89b4e0',
  led: '#dce8f5',
  amber: '#e8a317',
  hose: '#2b2b2b',
  red: '#8b1e1e',
  copper: '#8a5a32',
}

export function bodyPaint(color: string) {
  return {
    color,
    metalness: 0.42,
    roughness: 0.26,
    clearcoat: 0.55,
    clearcoatRoughness: 0.22,
  }
}
