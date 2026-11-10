import { useMemo } from 'react'
import * as THREE from 'three'
import { paint, PALETTE as C } from './Part'

export function Tube({
  from,
  to,
  r = 0.016,
  color = C.frame,
  metalness = 0.62,
  roughness = 0.32,
}: {
  from: [number, number, number]
  to: [number, number, number]
  r?: number
  color?: string
  metalness?: number
  roughness?: number
}) {
  const xform = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const len = Math.max(dir.length(), 0.001)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    return { mid, quat, len }
  }, [from[0], from[1], from[2], to[0], to[1], to[2]])
  return (
    <mesh position={xform.mid} quaternion={xform.quat} scale={[1, xform.len, 1]} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, 1, 12]} />
      <meshStandardMaterial {...paint(color, { metalness, roughness })} />
    </mesh>
  )
}

export function Lathe({
  profile,
  segments = 28,
  color,
  metalness = 0.45,
  roughness = 0.32,
  rotation,
  position,
}: {
  profile: [number, number][]
  segments?: number
  color: string
  metalness?: number
  roughness?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
}) {
  const pts = useMemo(
    () => profile.map(([x, y]) => new THREE.Vector2(x, y)),
    [profile],
  )
  return (
    <mesh rotation={rotation} position={position} castShadow receiveShadow>
      <latheGeometry args={[pts, segments]} />
      <meshStandardMaterial {...paint(color, { metalness, roughness })} />
    </mesh>
  )
}

export function Panel({
  path,
  depth = 0.02,
  color,
  metalness = 0.38,
  roughness = 0.3,
  position,
  rotation,
  clearcoat = 0.5,
}: {
  path: [number, number][]
  depth?: number
  color: string
  metalness?: number
  roughness?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  clearcoat?: number
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(path[0][0], path[0][1])
    for (let i = 1; i < path.length; i++) s.lineTo(path[i][0], path[i][1])
    s.closePath()
    return s
  }, [path])
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <extrudeGeometry
        args={[
          shape,
          { depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 },
        ]}
      />
      <meshPhysicalMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.28}
      />
    </mesh>
  )
}

export function Capsule({
  r,
  h,
  color,
  rotation,
  position,
  metalness = 0.5,
  roughness = 0.35,
}: {
  r: number
  h: number
  color: string
  rotation?: [number, number, number]
  position?: [number, number, number]
  metalness?: number
  roughness?: number
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <capsuleGeometry args={[r, h, 6, 16]} />
      <meshStandardMaterial {...paint(color, { metalness, roughness })} />
    </mesh>
  )
}
