import { PARTS, PARTS_BY_ID } from '../data/catalogue'
import { useBike } from '../store'

export function Connectors() {
  const show = useBike((s) => s.showConnectors)
  const selectedId = useBike((s) => s.selectedId)
  const explode = useBike((s) => s.explode)
  if (!show || !selectedId) return null
  const part = PARTS_BY_ID[selectedId]
  if (!part) return null
  const related = PARTS.filter((p) => p.dependsOn.includes(selectedId) || part.dependsOn.includes(p.id))
  return (
    <group>
      {related.map((p) => {
        const a = part.explodedOffset
        const b = p.explodedOffset
        const mid: [number, number, number] = [
          ((a[0] + b[0]) / 2) * explode * 0.2,
          0.5 + ((a[1] + b[1]) / 2) * explode * 0.2,
          ((a[2] + b[2]) / 2) * explode * 0.2,
        ]
        return (
          <mesh key={p.id} position={mid}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#e8b923" emissive="#e8b923" emissiveIntensity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}
