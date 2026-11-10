import { useMemo } from 'react'
import { Part, PALETTE as C, paint, bodyPaint } from './Part'
import { Lathe, Panel, Tube } from './geom'

const WB = 1.453
const FRONT_Z = WB / 2
const REAR_Z = -WB / 2
const FRONT_Y = 0.304
const REAR_Y = 0.31
const RAKE = 0.42

function AlloyRim({ radius, width, spokes = 5 }: { radius: number; width: number; spokes?: number }) {
  const spokeRot = useMemo(
    () => Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI * 2),
    [spokes],
  )
  return (
    <group>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[radius, 0.018, 12, 64]} />
        <meshStandardMaterial {...paint(C.alloy, { metalness: 0.86, roughness: 0.18 })} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius - 0.014, 0.01, 8, 48]} />
        <meshStandardMaterial {...paint('#9aa3ad', { metalness: 0.8, roughness: 0.22 })} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.062, width * 0.72, 32]} />
        <meshStandardMaterial {...paint(C.alloy, { metalness: 0.84, roughness: 0.18 })} />
      </mesh>
      {spokeRot.map((r, i) => (
        <group key={i} rotation={[r, 0, 0]}>
          <mesh position={[0, 0, radius * 0.48]} castShadow>
            <boxGeometry args={[width * 0.22, 0.032, radius * 0.78]} />
            <meshStandardMaterial {...paint(C.alloy, { metalness: 0.84, roughness: 0.2 })} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, width + 0.01, 16]} />
        <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.4 })} />
      </mesh>
    </group>
  )
}

function Tyre({ radius, tyreR, width }: { radius: number; tyreR: number; width: number }) {
  const profile = useMemo(
    (): [number, number][] => [
      [radius + 0.006, -width * 0.42],
      [tyreR * 0.86, -width * 0.5],
      [tyreR * 0.97, -width * 0.28],
      [tyreR, 0],
      [tyreR * 0.97, width * 0.28],
      [tyreR * 0.86, width * 0.5],
      [radius + 0.006, width * 0.42],
    ],
    [radius, tyreR, width],
  )
  return (
    <group>
      <Lathe
        profile={profile}
        segments={48}
        color={C.tyre}
        metalness={0.04}
        roughness={0.94}
        rotation={[0, 0, Math.PI / 2]}
      />
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[tyreR - 0.006, 0.005, 8, 56]} />
        <meshStandardMaterial {...paint('#111', { roughness: 0.92 })} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[width * 0.38, 0, 0]}>
        <torusGeometry args={[radius + 0.012, 0.006, 8, 40]} />
        <meshStandardMaterial {...paint('#2a2a2a')} />
      </mesh>
    </group>
  )
}

function Disc({ radius }: { radius: number }) {
  const holes = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return [0, Math.sin(a) * radius * 0.62, Math.cos(a) * radius * 0.62] as [number, number, number]
      }),
    [radius],
  )
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.0045, 48]} />
        <meshStandardMaterial {...paint(C.disc, { metalness: 0.88, roughness: 0.18 })} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.38, radius * 0.38, 0.01, 24]} />
        <meshStandardMaterial {...paint('#2c3138', { metalness: 0.55 })} />
      </mesh>
      {holes.map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.006, 12]} />
          <meshStandardMaterial {...paint('#1f242a')} />
        </mesh>
      ))}
    </group>
  )
}

export function Dominar() {
  return (
    <group>
      <Part id="frame" position={[0, 0, 0]}>
        <Tube from={[-0.09, 0.78, 0.56]} to={[-0.1, 0.62, -0.08]} r={0.017} />
        <Tube from={[0.09, 0.78, 0.56]} to={[0.1, 0.62, -0.08]} r={0.017} />
        <Tube from={[-0.09, 0.78, 0.56]} to={[-0.1, 0.34, 0.18]} r={0.015} />
        <Tube from={[0.09, 0.78, 0.56]} to={[0.1, 0.34, 0.18]} r={0.015} />
        <Tube from={[-0.1, 0.34, 0.18]} to={[-0.1, 0.36, -0.14]} r={0.015} />
        <Tube from={[0.1, 0.34, 0.18]} to={[0.1, 0.36, -0.14]} r={0.015} />
        <Tube from={[-0.1, 0.62, -0.08]} to={[-0.1, 0.36, -0.14]} r={0.014} />
        <Tube from={[0.1, 0.62, -0.08]} to={[0.1, 0.36, -0.14]} r={0.014} />
        <Tube from={[-0.1, 0.36, -0.14]} to={[0.1, 0.36, -0.14]} r={0.014} />
        <Tube from={[-0.09, 0.78, 0.56]} to={[0.09, 0.78, 0.56]} r={0.012} />
        <mesh position={[0, 0.5, 0.05]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.03, 0.5]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.55 })} />
        </mesh>
      </Part>

      <Part id="headstock" position={[0, 0.8, 0.58]} rotation={[RAKE, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.042, 0.046, 0.15, 18]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.62 })} />
        </mesh>
      </Part>

      <Part id="subframe" position={[0, 0, 0]}>
        <Tube from={[-0.08, 0.62, -0.1]} to={[-0.07, 0.72, -0.72]} r={0.012} />
        <Tube from={[0.08, 0.62, -0.1]} to={[0.07, 0.72, -0.72]} r={0.012} />
        <Tube from={[-0.07, 0.72, -0.72]} to={[0.07, 0.72, -0.72]} r={0.01} />
        <Tube from={[-0.08, 0.5, -0.16]} to={[-0.07, 0.55, -0.7]} r={0.01} />
        <Tube from={[0.08, 0.5, -0.16]} to={[0.07, 0.55, -0.7]} r={0.01} />
      </Part>

      <Part id="engine-mount-front" position={[0, 0.38, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.011, 0.011, 0.24, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="engine-mount-rear" position={[0, 0.38, -0.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.011, 0.011, 0.24, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="engine-mount-upper" position={[0, 0.64, 0.12]}>
        <mesh>
          <boxGeometry args={[0.18, 0.016, 0.035]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>

      <Part id="sidestand" position={[-0.2, 0.2, 0]} rotation={[0.15, 0, 0.72]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.32, 8]} />
          <meshStandardMaterial {...paint('#3a3a3a', { metalness: 0.5 })} />
        </mesh>
        <mesh position={[0, -0.17, 0.01]}>
          <boxGeometry args={[0.045, 0.012, 0.08]} />
          <meshStandardMaterial {...paint(C.rubber)} />
        </mesh>
      </Part>
      <Part id="sidestand-switch" position={[-0.18, 0.28, 0.02]}>
        <mesh>
          <boxGeometry args={[0.028, 0.022, 0.018]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="sidestand-spring" position={[-0.16, 0.24, 0.04]}>
        <mesh rotation={[0.5, 0, 0.4]}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>

      <Part id="footpeg-l" position={[-0.22, 0.29, -0.02]}>
        <mesh>
          <boxGeometry args={[0.09, 0.016, 0.03]} />
          <meshStandardMaterial {...paint('#1a1a1a', { roughness: 0.8 })} />
        </mesh>
      </Part>
      <Part id="footpeg-r" position={[0.22, 0.29, -0.02]}>
        <mesh>
          <boxGeometry args={[0.09, 0.016, 0.03]} />
          <meshStandardMaterial {...paint('#1a1a1a', { roughness: 0.8 })} />
        </mesh>
      </Part>
      <Part id="pillion-peg-l" position={[-0.2, 0.36, -0.4]}>
        <mesh>
          <boxGeometry args={[0.07, 0.014, 0.024]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="pillion-peg-r" position={[0.2, 0.36, -0.4]}>
        <mesh>
          <boxGeometry args={[0.07, 0.014, 0.024]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="crash-guard-l" position={[-0.26, 0.34, 0.14]}>
        <mesh rotation={[1.2, 0.1, 0.2]} castShadow>
          <torusGeometry args={[0.13, 0.011, 8, 20, Math.PI * 1.1]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.65 })} />
        </mesh>
      </Part>
      <Part id="crash-guard-r" position={[0.26, 0.34, 0.14]}>
        <mesh rotation={[1.2, -0.1, -0.2]} castShadow>
          <torusGeometry args={[0.13, 0.011, 8, 20, Math.PI * 1.1]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.65 })} />
        </mesh>
      </Part>

      <Part id="engine-crankcase" position={[0, 0.34, 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.24, 28]} />
          <meshStandardMaterial {...paint(C.engine, { metalness: 0.58, roughness: 0.36 })} />
        </mesh>
        <mesh position={[0, -0.06, -0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.22, 24]} />
          <meshStandardMaterial {...paint(C.engineDark, { metalness: 0.52 })} />
        </mesh>
        <mesh position={[0, 0.02, 0.12]} rotation={[0.25, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.08, 0.2, 20]} />
          <meshStandardMaterial {...paint(C.engine)} />
        </mesh>
      </Part>
      <Part id="generator-cover" position={[-0.155, 0.34, 0.08]}>
        <Lathe
          rotation={[0, 0, Math.PI / 2]}
          color={C.engineDark}
          metalness={0.55}
          profile={[
            [0.02, -0.022],
            [0.09, -0.02],
            [0.095, 0],
            [0.088, 0.02],
            [0.03, 0.022],
          ]}
        />
      </Part>
      <Part id="stator" position={[-0.15, 0.34, 0.08]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.068, 0.018, 18]} />
          <meshStandardMaterial {...paint('#3d4a38', { metalness: 0.4 })} />
        </mesh>
      </Part>
      <Part id="flywheel" position={[-0.125, 0.34, 0.08]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.072, 0.072, 0.022, 22]} />
          <meshStandardMaterial {...paint('#2a2a2a', { metalness: 0.75 })} />
        </mesh>
      </Part>
      <Part id="clutch-cover" position={[0.155, 0.35, 0.06]}>
        <Lathe
          rotation={[0, 0, -Math.PI / 2]}
          color={C.engine}
          metalness={0.58}
          profile={[
            [0.025, -0.024],
            [0.095, -0.022],
            [0.1, 0],
            [0.09, 0.022],
            [0.03, 0.024],
          ]}
        />
        <mesh position={[0.03, 0.05, 0.02]}>
          <cylinderGeometry args={[0.016, 0.016, 0.01, 12]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="clutch-cover-gasket" position={[0.132, 0.35, 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.003, 20]} />
          <meshStandardMaterial {...paint('#5c4030')} />
        </mesh>
      </Part>
      <Part id="clutch-pack" position={[0.148, 0.35, 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.068, 0.032, 18]} />
          <meshStandardMaterial {...paint(C.gold, { metalness: 0.65, roughness: 0.32 })} />
        </mesh>
      </Part>
      <Part id="clutch-basket" position={[0.142, 0.35, 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.076, 0.076, 0.028, 16]} />
          <meshStandardMaterial {...paint(C.alloy, { metalness: 0.7 })} />
        </mesh>
      </Part>
      <Part id="clutch-hub" position={[0.152, 0.35, 0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 0.026, 12]} />
          <meshStandardMaterial {...paint('#555', { metalness: 0.6 })} />
        </mesh>
      </Part>
      <Part id="transmission" position={[0, 0.3, -0.05]}>
        <mesh>
          <boxGeometry args={[0.2, 0.11, 0.15]} />
          <meshStandardMaterial {...paint(C.engineDark, { metalness: 0.5 })} />
        </mesh>
      </Part>
      <Part id="crankshaft" position={[0, 0.3, 0.08]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.026, 0.026, 0.2, 12]} />
          <meshStandardMaterial {...paint('#4a4a4a', { metalness: 0.75 })} />
        </mesh>
      </Part>
      <Part id="balancer-shaft" position={[0.04, 0.26, -0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.15, 10]} />
          <meshStandardMaterial {...paint('#555', { metalness: 0.7 })} />
        </mesh>
      </Part>
      <Part id="cylinder" position={[0, 0.5, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.058, 0.064, 0.125, 22]} />
          <meshStandardMaterial {...paint(C.engine, { metalness: 0.52, roughness: 0.36 })} />
        </mesh>
        {[-0.04, -0.02, 0, 0.02, 0.04].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.006, 20]} />
            <meshStandardMaterial {...paint(C.engineDark)} />
          </mesh>
        ))}
      </Part>
      <Part id="connecting-rod" position={[0.02, 0.4, 0.1]} rotation={[0.12, 0, 0.08]}>
        <mesh>
          <boxGeometry args={[0.016, 0.11, 0.012]} />
          <meshStandardMaterial {...paint(C.alloy, { metalness: 0.68 })} />
        </mesh>
      </Part>
      <Part id="piston" position={[0, 0.5, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.034, 0.035, 0.048, 18]} />
          <meshStandardMaterial {...paint(C.alloy, { metalness: 0.62 })} />
        </mesh>
      </Part>
      <Part id="gudgeon-pin" position={[0, 0.49, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.007, 0.007, 0.055, 8]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="piston-rings" position={[0, 0.52, 0.1]}>
        <mesh>
          <torusGeometry args={[0.035, 0.0025, 6, 20]} />
          <meshStandardMaterial {...paint('#777')} />
        </mesh>
      </Part>
      <Part id="head-gasket" position={[0, 0.564, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.0035, 20]} />
          <meshStandardMaterial {...paint('#6b4f2a')} />
        </mesh>
      </Part>
      <Part id="cylinder-head" position={[0, 0.625, 0.1]}>
        <mesh rotation={[0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.078, 0.085, 0.09, 20]} />
          <meshStandardMaterial {...paint(C.engine, { metalness: 0.52 })} />
        </mesh>
        <mesh position={[0, 0.02, 0.02]}>
          <boxGeometry args={[0.14, 0.06, 0.12]} />
          <meshStandardMaterial {...paint(C.engine, { metalness: 0.5 })} />
        </mesh>
      </Part>
      <Part id="camshaft-intake" position={[0.03, 0.645, 0.14]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 10]} />
          <meshStandardMaterial {...paint('#444', { metalness: 0.78 })} />
        </mesh>
      </Part>
      <Part id="camshaft-exhaust" position={[-0.03, 0.645, 0.06]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 10]} />
          <meshStandardMaterial {...paint('#444', { metalness: 0.78 })} />
        </mesh>
      </Part>
      <Part id="cam-chain" position={[0.07, 0.56, 0.12]} rotation={[0.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.058, 0.005, 6, 18]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>
      <Part id="valve-cover" position={[0, 0.695, 0.1]}>
        <mesh rotation={[0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.072, 0.078, 0.04, 18]} />
          <meshStandardMaterial {...paint(C.engineDark, { metalness: 0.48 })} />
        </mesh>
      </Part>
      <Part id="valve-cover-gasket" position={[0, 0.674, 0.1]}>
        <mesh>
          <boxGeometry args={[0.145, 0.003, 0.162]} />
          <meshStandardMaterial {...paint('#4a3020')} />
        </mesh>
      </Part>
      <Part id="intake-valve" position={[0.03, 0.665, 0.15]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.01, 0.038, 8]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.82 })} />
        </mesh>
      </Part>
      <Part id="exhaust-valve" position={[-0.03, 0.665, 0.05]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.01, 0.038, 8]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.82 })} />
        </mesh>
      </Part>
      <Part id="spark-plug" position={[0, 0.745, 0.14]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.007, 0.048, 8]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="starter-motor" position={[-0.1, 0.32, -0.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 14]} />
          <meshStandardMaterial {...paint('#2a2a2a')} />
        </mesh>
      </Part>
      <Part id="oil-drain-plug" position={[0.04, 0.2, 0.06]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.018, 8]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="oil-filter" position={[0.14, 0.26, 0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.027, 0.027, 0.048, 14]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="oil-cooler" position={[0, 0.28, 0.28]}>
        <mesh>
          <boxGeometry args={[0.15, 0.055, 0.016]} />
          <meshStandardMaterial {...paint('#6a7380', { metalness: 0.62 })} />
        </mesh>
      </Part>
      <Part id="water-pump" position={[0.15, 0.28, 0.14]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.028, 12]} />
          <meshStandardMaterial {...paint(C.engine)} />
        </mesh>
      </Part>
      <Part id="gear-shifter" position={[-0.22, 0.26, 0.02]} rotation={[0, 0, 0.18]}>
        <mesh>
          <boxGeometry args={[0.09, 0.012, 0.016]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>

      <Part id="radiator" position={[0, 0.5, 0.42]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.24, 0.038]} />
          <meshStandardMaterial {...paint('#6a7580', { metalness: 0.58, roughness: 0.42 })} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.28, 0.018, 0.034]} />
          <meshStandardMaterial {...paint('#3a4048')} />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <boxGeometry args={[0.28, 0.018, 0.034]} />
          <meshStandardMaterial {...paint('#3a4048')} />
        </mesh>
      </Part>
      <Part id="radiator-grill" position={[0, 0.5, 0.442]}>
        <mesh>
          <boxGeometry args={[0.28, 0.2, 0.006]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.4, roughness: 0.55 })} />
        </mesh>
      </Part>
      <Part id="radiator-cap" position={[0.1, 0.64, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.012, 10]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="cooling-fan" position={[0, 0.5, 0.395]}>
        <mesh>
          <cylinderGeometry args={[0.085, 0.085, 0.018, 16]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="coolant-hoses" position={[0.08, 0.52, 0.28]}>
        <mesh rotation={[0.55, 0.18, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
          <meshStandardMaterial {...paint(C.hose)} />
        </mesh>
      </Part>
      <Part id="thermostat" position={[0.06, 0.63, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.028, 10]} />
          <meshStandardMaterial {...paint(C.engine)} />
        </mesh>
      </Part>

      <Part id="airbox" position={[0, 0.74, -0.04]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.1, 0.24]} />
          <meshStandardMaterial {...paint(C.plastic, { roughness: 0.55 })} />
        </mesh>
      </Part>
      <Part id="air-filter" position={[0, 0.755, -0.04]}>
        <mesh>
          <boxGeometry args={[0.22, 0.028, 0.17]} />
          <meshStandardMaterial {...paint('#d9c9a0')} />
        </mesh>
      </Part>
      <Part id="iat-sensor" position={[0.08, 0.8, -0.02]}>
        <mesh>
          <cylinderGeometry args={[0.008, 0.008, 0.028, 8]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="throttle-body" position={[0, 0.63, 0.18]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.072, 16]} />
          <meshStandardMaterial {...paint('#2c2c2c', { metalness: 0.45 })} />
        </mesh>
      </Part>
      <Part id="intake-boot" position={[0, 0.645, 0.14]}>
        <mesh rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.032, 0.05, 12]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="throttle-cables" position={[0.08, 0.8, 0.32]}>
        <mesh rotation={[0.75, 0.18, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.28, 6]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>

      <Part id="exhaust-header" position={[0.12, 0.36, 0.12]}>
        <Tube from={[0.04, 0.58, 0.16]} to={[0.12, 0.28, 0.18]} r={0.022} color={C.exhaust} metalness={0.72} roughness={0.28} />
        <Tube from={[0.12, 0.28, 0.18]} to={[0.18, 0.24, -0.02]} r={0.023} color={C.exhaust} metalness={0.72} roughness={0.28} />
      </Part>
      <Part id="exhaust-gasket" position={[0.05, 0.59, 0.16]}>
        <mesh>
          <torusGeometry args={[0.022, 0.004, 6, 12]} />
          <meshStandardMaterial {...paint('#3a3a3a')} />
        </mesh>
      </Part>
      <Part id="o2-sensor" position={[0.14, 0.38, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.008, 0.048, 8]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="exhaust-muffler" position={[0.22, 0.27, -0.3]} rotation={[0.04, 0.12, 0]}>
        <Lathe
          rotation={[Math.PI / 2, 0, 0]}
          color={C.exhaustDark}
          metalness={0.7}
          roughness={0.32}
          profile={[
            [0.038, -0.22],
            [0.055, -0.18],
            [0.06, 0],
            [0.055, 0.16],
            [0.042, 0.2],
          ]}
        />
        <mesh position={[0, 0, -0.24]}>
          <cylinderGeometry args={[0.038, 0.046, 0.05, 14]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.88 })} />
        </mesh>
      </Part>
      <Part id="exhaust-clamp" position={[0.18, 0.28, -0.1]}>
        <mesh>
          <torusGeometry args={[0.028, 0.006, 6, 12]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>
      <Part id="heat-shield" position={[0.27, 0.34, -0.3]}>
        <mesh>
          <boxGeometry args={[0.035, 0.075, 0.3]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.42 })} />
        </mesh>
      </Part>

      <Part id="tank" position={[0, 0.86, 0.08]}>
        <mesh scale={[1.12, 0.52, 1.72]} castShadow>
          <sphereGeometry args={[0.168, 32, 20]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
        <mesh position={[0, 0.04, 0.08]} scale={[0.92, 0.28, 1.05]} castShadow>
          <sphereGeometry args={[0.15, 24, 16]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
        <mesh position={[0, -0.04, -0.16]} scale={[0.88, 0.38, 0.95]} castShadow>
          <sphereGeometry args={[0.15, 22, 14]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
        <mesh position={[0, 0.01, 0.02]} scale={[1.05, 0.18, 1.55]}>
          <sphereGeometry args={[0.15, 22, 12]} />
          <meshPhysicalMaterial {...bodyPaint(C.paintAccent)} />
        </mesh>
        <mesh position={[0, -0.06, 0.18]} scale={[0.7, 0.22, 0.55]}>
          <sphereGeometry args={[0.12, 16, 10]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
      </Part>
      <Part id="fuel-cap" position={[0, 0.98, 0.22]}>
        <mesh>
          <cylinderGeometry args={[0.034, 0.034, 0.014, 18]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="fuel-pump" position={[0, 0.78, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.038, 0.038, 0.075, 12]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="fuel-line" position={[0.08, 0.72, 0.16]} rotation={[0.5, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.006, 0.006, 0.15, 6]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="fuel-sender" position={[0.06, 0.8, 0.02]}>
        <mesh>
          <boxGeometry args={[0.028, 0.038, 0.018]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>

      <Part id="fork-l" position={[-0.112, FRONT_Y + 0.17, FRONT_Z]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.028, 0.03, 0.34, 18]} />
          <meshStandardMaterial {...paint('#141414', { metalness: 0.55, roughness: 0.35 })} />
        </mesh>
        <mesh position={[0, -0.17, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.045, 12]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.5 })} />
        </mesh>
      </Part>
      <Part id="fork-tube-l" position={[-0.112, FRONT_Y + 0.46, FRONT_Z - 0.05]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.0185, 0.0185, 0.48, 16]} />
          <meshStandardMaterial {...paint(C.gold, { metalness: 0.78, roughness: 0.22 })} />
        </mesh>
      </Part>
      <Part id="fork-seal-l" position={[-0.112, FRONT_Y + 0.34, FRONT_Z - 0.02]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.022, 0.005, 8, 14]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="fork-r" position={[0.112, FRONT_Y + 0.17, FRONT_Z]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.028, 0.03, 0.34, 18]} />
          <meshStandardMaterial {...paint('#141414', { metalness: 0.55, roughness: 0.35 })} />
        </mesh>
        <mesh position={[0, -0.17, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.045, 12]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.5 })} />
        </mesh>
      </Part>
      <Part id="fork-tube-r" position={[0.112, FRONT_Y + 0.46, FRONT_Z - 0.05]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.0185, 0.0185, 0.48, 16]} />
          <meshStandardMaterial {...paint(C.gold, { metalness: 0.78, roughness: 0.22 })} />
        </mesh>
      </Part>
      <Part id="fork-seal-r" position={[0.112, FRONT_Y + 0.34, FRONT_Z - 0.02]} rotation={[RAKE * 0.35, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.022, 0.005, 8, 14]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="triple-upper" position={[0, 0.9, 0.55]}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.028, 0.07]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.58 })} />
        </mesh>
        <mesh position={[-0.112, 0, 0.01]} rotation={[RAKE * 0.35, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.04, 14]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.6 })} />
        </mesh>
        <mesh position={[0.112, 0, 0.01]} rotation={[RAKE * 0.35, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.04, 14]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.6 })} />
        </mesh>
      </Part>
      <Part id="triple-lower" position={[0, 0.62, 0.64]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.032, 0.08]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.58 })} />
        </mesh>
        <mesh position={[-0.112, 0, 0.01]} rotation={[RAKE * 0.35, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.05, 14]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.6 })} />
        </mesh>
        <mesh position={[0.112, 0, 0.01]} rotation={[RAKE * 0.35, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.05, 14]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.6 })} />
        </mesh>
        <mesh position={[0, 0.1, -0.02]} rotation={[RAKE, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.16, 10]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="steering-stem-nut" position={[0, 0.92, 0.54]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.016, 8]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.88 })} />
        </mesh>
      </Part>
      <Part id="steering-bearings" position={[0, 0.8, 0.58]}>
        <mesh>
          <torusGeometry args={[0.028, 0.006, 6, 12]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>

      <Part id="swingarm" position={[0, REAR_Y, -0.42]}>
        <mesh position={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.64]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.55, roughness: 0.34 })} />
        </mesh>
        <mesh position={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.64]} />
          <meshStandardMaterial {...paint(C.frame, { metalness: 0.55, roughness: 0.34 })} />
        </mesh>
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[0.25, 0.048, 0.055]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
        <mesh position={[-0.1, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.07, 0.1]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
        <mesh position={[0.1, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.07, 0.1]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>
      <Part id="swingarm-pivot" position={[0, 0.36, -0.14]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.24, 10]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="monoshock" position={[-0.02, 0.52, -0.28]} rotation={[0.38, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.26, 14]} />
          <meshStandardMaterial {...paint('#2a2a2a')} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.044, 0.044, 0.11, 14]} />
          <meshStandardMaterial {...paint('#c44a12')} />
        </mesh>
      </Part>
      <Part id="shock-linkage" position={[0, 0.28, -0.28]}>
        <mesh>
          <boxGeometry args={[0.08, 0.02, 0.1]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>
      <Part id="chain-slider" position={[0.09, 0.3, -0.45]}>
        <mesh>
          <boxGeometry args={[0.02, 0.018, 0.22]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>

      <Part id="handlebar" position={[0, 1.0, 0.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.013, 0.013, 0.68, 12]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.45, roughness: 0.4 })} />
        </mesh>
        <mesh rotation={[0, 0, 0.22]} position={[-0.3, 0.03, 0.02]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 10]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.4 })} />
        </mesh>
        <mesh rotation={[0, 0, -0.22]} position={[0.3, 0.03, 0.02]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 10]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.4 })} />
        </mesh>
      </Part>
      <Part id="bar-clamps" position={[0, 0.97, 0.52]}>
        <mesh>
          <boxGeometry args={[0.1, 0.028, 0.04]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>
      <Part id="bar-ends" position={[0, 1.02, 0.5]}>
        <mesh position={[-0.32, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.014, 0.038, 10]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
        <mesh position={[0.32, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.014, 0.038, 10]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="front-master-cylinder" position={[0.22, 1.01, 0.52]}>
        <mesh>
          <boxGeometry args={[0.048, 0.04, 0.068]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
        <mesh position={[0.045, -0.02, 0.02]} rotation={[0, 0.3, 0.45]}>
          <boxGeometry args={[0.085, 0.012, 0.018]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="brake-reservoir" position={[0.24, 1.05, 0.5]}>
        <mesh>
          <boxGeometry args={[0.04, 0.035, 0.04]} />
          <meshStandardMaterial {...paint('#2a2a2a', { transparent: true, opacity: 0.7 })} />
        </mesh>
      </Part>
      <Part id="clutch-lever" position={[-0.22, 1.01, 0.52]}>
        <mesh>
          <boxGeometry args={[0.048, 0.034, 0.05]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
        <mesh position={[-0.045, -0.02, 0.02]} rotation={[0, -0.3, -0.45]}>
          <boxGeometry args={[0.085, 0.012, 0.016]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="clutch-cable" position={[-0.14, 0.72, 0.3]} rotation={[0.7, -0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.004, 0.004, 0.4, 6]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="switchgear-l" position={[-0.14, 1.01, 0.5]}>
        <mesh>
          <boxGeometry args={[0.05, 0.03, 0.04]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="switchgear-r" position={[0.14, 1.01, 0.5]}>
        <mesh>
          <boxGeometry args={[0.05, 0.03, 0.04]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="throttle-grip" position={[0.28, 1.02, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 0.1, 10]} />
          <meshStandardMaterial {...paint(C.rubber, { roughness: 0.92 })} />
        </mesh>
      </Part>
      <Part id="grip-l" position={[-0.28, 1.02, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 0.1, 10]} />
          <meshStandardMaterial {...paint(C.rubber, { roughness: 0.92 })} />
        </mesh>
      </Part>
      <Part id="mirror-l" position={[-0.3, 1.12, 0.48]}>
        <mesh>
          <boxGeometry args={[0.13, 0.065, 0.012]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
        <mesh position={[0.05, -0.055, 0.02]} rotation={[0.4, 0, 0.28]}>
          <cylinderGeometry args={[0.006, 0.006, 0.085, 6]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="mirror-r" position={[0.3, 1.12, 0.48]}>
        <mesh>
          <boxGeometry args={[0.13, 0.065, 0.012]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
        <mesh position={[-0.05, -0.055, 0.02]} rotation={[0.4, 0, -0.28]}>
          <cylinderGeometry args={[0.006, 0.006, 0.085, 6]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="ignition-switch" position={[0, 0.92, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>

      <Part id="front-rim" position={[0, FRONT_Y, FRONT_Z]}>
        <AlloyRim radius={0.216} width={0.1} />
      </Part>
      <Part id="front-tyre" position={[0, FRONT_Y, FRONT_Z]}>
        <Tyre radius={0.216} tyreR={0.296} width={0.1} />
      </Part>
      <Part id="front-wheel" position={[0, FRONT_Y, FRONT_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.016, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="front-bearing" position={[0.04, FRONT_Y, FRONT_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.028, 0.006, 6, 12]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="front-axle" position={[0, FRONT_Y, FRONT_Z]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.24, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.88 })} />
        </mesh>
      </Part>
      <Part id="front-axle-spacers" position={[0.09, FRONT_Y, FRONT_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
          <meshStandardMaterial {...paint(C.alloy)} />
        </mesh>
      </Part>
      <Part id="axle-nut-f" position={[-0.12, FRONT_Y, FRONT_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, 6]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="caliper-bracket-f" position={[0.13, FRONT_Y + 0.02, FRONT_Z]}>
        <mesh>
          <boxGeometry args={[0.03, 0.05, 0.06]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>
      <Part id="rear-rim" position={[0, REAR_Y, REAR_Z]}>
        <AlloyRim radius={0.216} width={0.13} />
      </Part>
      <Part id="rear-tyre" position={[0, REAR_Y, REAR_Z]}>
        <Tyre radius={0.216} tyreR={0.304} width={0.13} />
      </Part>
      <Part id="rear-wheel" position={[0, REAR_Y, REAR_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.016, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.85 })} />
        </mesh>
      </Part>
      <Part id="rear-bearing" position={[0.04, REAR_Y, REAR_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.03, 0.006, 6, 12]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="rear-axle" position={[0, REAR_Y, REAR_Z]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.26, 10]} />
          <meshStandardMaterial {...paint(C.chrome, { metalness: 0.88 })} />
        </mesh>
      </Part>
      <Part id="axle-nut-r" position={[-0.13, REAR_Y, REAR_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.014, 6]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="cush-drive" position={[0.08, REAR_Y, REAR_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 10]} />
          <meshStandardMaterial {...paint('#3a3a3a')} />
        </mesh>
      </Part>
      <Part id="chain-adjuster-l" position={[-0.1, REAR_Y, REAR_Z + 0.04]}>
        <mesh>
          <boxGeometry args={[0.03, 0.03, 0.05]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>
      <Part id="chain-adjuster-r" position={[0.1, REAR_Y, REAR_Z + 0.04]}>
        <mesh>
          <boxGeometry args={[0.03, 0.03, 0.05]} />
          <meshStandardMaterial {...paint(C.frame)} />
        </mesh>
      </Part>

      <Part id="front-disc" position={[0.092, FRONT_Y, FRONT_Z]}>
        <Disc radius={0.15} />
      </Part>
      <Part id="front-caliper" position={[0.135, FRONT_Y + 0.045, FRONT_Z + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.048, 0.082, 0.1]} />
          <meshStandardMaterial {...paint('#1a1a1a', { metalness: 0.55 })} />
        </mesh>
      </Part>
      <Part id="front-brake-hose" position={[0.14, 0.58, 0.6]} rotation={[0.55, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.005, 0.42, 6]} />
          <meshStandardMaterial {...paint(C.hose)} />
        </mesh>
      </Part>
      <Part id="brake-pad-f" position={[0.118, FRONT_Y + 0.045, FRONT_Z + 0.02]}>
        <mesh>
          <boxGeometry args={[0.012, 0.05, 0.06]} />
          <meshStandardMaterial {...paint('#2a2a2a')} />
        </mesh>
      </Part>
      <Part id="rear-disc" position={[-0.092, REAR_Y, REAR_Z]}>
        <Disc radius={0.115} />
      </Part>
      <Part id="rear-caliper" position={[-0.13, REAR_Y + 0.03, REAR_Z + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.042, 0.068, 0.078]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="rear-brake-hose" position={[0.12, 0.32, -0.4]} rotation={[0.2, 0.4, 0]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.005, 0.36, 6]} />
          <meshStandardMaterial {...paint(C.hose)} />
        </mesh>
      </Part>
      <Part id="brake-pad-r" position={[-0.112, REAR_Y + 0.03, REAR_Z + 0.02]}>
        <mesh>
          <boxGeometry args={[0.01, 0.04, 0.05]} />
          <meshStandardMaterial {...paint('#2a2a2a')} />
        </mesh>
      </Part>
      <Part id="rear-master-cylinder" position={[0.2, 0.32, -0.02]}>
        <mesh>
          <boxGeometry args={[0.038, 0.048, 0.075]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="rear-brake-pedal" position={[0.24, 0.26, 0]} rotation={[0, 0, -0.15]}>
        <mesh>
          <boxGeometry args={[0.1, 0.012, 0.018]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>
      <Part id="abs-modulator" position={[0.1, 0.55, -0.12]}>
        <mesh>
          <boxGeometry args={[0.08, 0.058, 0.1]} />
          <meshStandardMaterial {...paint('#1c1c1c')} />
        </mesh>
      </Part>
      <Part id="abs-sensor-front" position={[-0.12, FRONT_Y + 0.04, FRONT_Z]}>
        <mesh>
          <boxGeometry args={[0.018, 0.028, 0.038]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="abs-sensor-rear" position={[-0.14, REAR_Y + 0.04, REAR_Z]}>
        <mesh>
          <boxGeometry args={[0.018, 0.028, 0.038]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>

      <Part id="side-fairing-l" position={[-0.22, 0.52, 0.14]}>
        <Panel
          path={[
            [-0.22, 0.18],
            [0.26, 0.22],
            [0.3, 0.04],
            [0.18, -0.16],
            [-0.16, -0.18],
            [-0.24, 0.02],
          ]}
          depth={0.018}
          color={C.paint}
          rotation={[0.12, Math.PI / 2, 0.18]}
        />
        <Panel
          path={[
            [-0.12, 0.06],
            [0.2, 0.08],
            [0.22, 0.0],
            [-0.1, -0.02],
          ]}
          depth={0.01}
          color={C.paintAccent}
          rotation={[0.12, Math.PI / 2, 0.18]}
          position={[-0.01, 0.02, 0]}
        />
      </Part>
      <Part id="side-fairing-r" position={[0.22, 0.52, 0.14]}>
        <Panel
          path={[
            [-0.22, 0.18],
            [0.26, 0.22],
            [0.3, 0.04],
            [0.18, -0.16],
            [-0.16, -0.18],
            [-0.24, 0.02],
          ]}
          depth={0.018}
          color={C.paint}
          rotation={[0.12, -Math.PI / 2, -0.18]}
        />
        <Panel
          path={[
            [-0.12, 0.06],
            [0.2, 0.08],
            [0.22, 0.0],
            [-0.1, -0.02],
          ]}
          depth={0.01}
          color={C.paintAccent}
          rotation={[0.12, -Math.PI / 2, -0.18]}
          position={[0.01, 0.02, 0]}
        />
      </Part>
      <Part id="tank-shroud-l" position={[-0.17, 0.78, 0.18]}>
        <Panel
          path={[
            [-0.14, 0.08],
            [0.16, 0.1],
            [0.18, -0.02],
            [-0.12, -0.06],
          ]}
          depth={0.014}
          color={C.paint}
          rotation={[0.15, Math.PI / 2, 0.28]}
        />
      </Part>
      <Part id="tank-shroud-r" position={[0.17, 0.78, 0.18]}>
        <Panel
          path={[
            [-0.14, 0.08],
            [0.16, 0.1],
            [0.18, -0.02],
            [-0.12, -0.06],
          ]}
          depth={0.014}
          color={C.paint}
          rotation={[0.15, -Math.PI / 2, -0.28]}
        />
      </Part>
      <Part id="belly-pan" position={[0, 0.2, 0.14]}>
        <Panel
          path={[
            [-0.18, 0.22],
            [0.18, 0.22],
            [0.16, -0.24],
            [-0.16, -0.24],
          ]}
          depth={0.016}
          color={C.paint}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Part>
      <Part id="tail-cowl" position={[0, 0.74, -0.58]}>
        <mesh scale={[0.95, 0.42, 1.55]} castShadow>
          <sphereGeometry args={[0.15, 24, 16]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
        <mesh position={[0, -0.02, -0.14]} scale={[0.72, 0.32, 1.05]} castShadow>
          <sphereGeometry args={[0.13, 18, 12]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
        <mesh position={[0, 0.01, -0.02]} scale={[0.88, 0.12, 1.2]}>
          <sphereGeometry args={[0.13, 16, 10]} />
          <meshPhysicalMaterial {...bodyPaint(C.paintAccent)} />
        </mesh>
      </Part>
      <Part id="front-fender" position={[0, FRONT_Y + 0.2, FRONT_Z]}>
        <mesh rotation={[0.12, 0, 0]} scale={[0.85, 0.2, 1.7]} castShadow>
          <sphereGeometry args={[0.11, 20, 12]} />
          <meshPhysicalMaterial {...bodyPaint(C.paint)} />
        </mesh>
      </Part>
      <Part id="rear-fender" position={[0, REAR_Y + 0.18, REAR_Z + 0.04]}>
        <mesh rotation={[-0.15, 0, 0]} scale={[0.9, 0.22, 1.35]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshStandardMaterial {...paint(C.plastic)} />
        </mesh>
      </Part>
      <Part id="number-plate" position={[0, 0.42, -0.94]}>
        <mesh>
          <boxGeometry args={[0.18, 0.1, 0.006]} />
          <meshStandardMaterial {...paint('#f2f2ea')} />
        </mesh>
      </Part>
      <Part id="chain-guard" position={[0.12, 0.44, -0.5]}>
        <mesh>
          <boxGeometry args={[0.028, 0.038, 0.28]} />
          <meshStandardMaterial {...paint(C.plastic)} />
        </mesh>
      </Part>
      <Part id="grab-rail" position={[0, 0.82, -0.6]}>
        <Tube from={[-0.12, 0, 0.08]} to={[-0.12, 0.02, -0.16]} r={0.01} color={C.frame} />
        <Tube from={[0.12, 0, 0.08]} to={[0.12, 0.02, -0.16]} r={0.01} color={C.frame} />
        <Tube from={[-0.12, 0.02, -0.16]} to={[0.12, 0.02, -0.16]} r={0.01} color={C.frame} />
      </Part>
      <Part id="headlight-visor" position={[0, 0.8, 0.74]}>
        <Panel
          path={[
            [-0.16, 0.02],
            [0.16, 0.02],
            [0.14, -0.04],
            [-0.14, -0.04],
          ]}
          depth={0.07}
          color={C.paint}
          rotation={[0.55, 0, 0]}
        />
      </Part>
      <Part id="battery-cover" position={[0, 0.7, -0.28]}>
        <mesh>
          <boxGeometry args={[0.2, 0.02, 0.16]} />
          <meshStandardMaterial {...paint(C.plastic)} />
        </mesh>
      </Part>
      <Part id="fuse-box" position={[0.1, 0.58, -0.3]}>
        <mesh>
          <boxGeometry args={[0.06, 0.03, 0.08]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="fastener-fairing-set" position={[0.36, 0.5, 0.3]}>
        <mesh>
          <boxGeometry args={[0.04, 0.02, 0.06]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>

      <Part id="seat-rider" position={[0, 0.9, -0.14]}>
        <mesh scale={[1.05, 0.22, 1.85]} castShadow>
          <sphereGeometry args={[0.135, 22, 14]} />
          <meshStandardMaterial {...paint(C.seat, { roughness: 0.9, metalness: 0.03 })} />
        </mesh>
        <mesh position={[0, 0.01, 0.08]} scale={[0.85, 0.16, 0.7]}>
          <sphereGeometry args={[0.12, 16, 10]} />
          <meshStandardMaterial {...paint('#1a1a1a', { roughness: 0.92 })} />
        </mesh>
      </Part>
      <Part id="seat-pillion" position={[0, 0.88, -0.46]}>
        <mesh scale={[0.92, 0.2, 1.15]} castShadow>
          <sphereGeometry args={[0.125, 18, 12]} />
          <meshStandardMaterial {...paint(C.seat, { roughness: 0.9, metalness: 0.03 })} />
        </mesh>
      </Part>

      <Part id="battery" position={[0, 0.62, -0.28]}>
        <mesh>
          <boxGeometry args={[0.12, 0.08, 0.08]} />
          <meshStandardMaterial {...paint('#1a2230')} />
        </mesh>
      </Part>
      <Part id="battery-negative-lead" position={[-0.06, 0.66, -0.28]}>
        <mesh>
          <boxGeometry args={[0.04, 0.01, 0.02]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="battery-positive-lead" position={[0.06, 0.66, -0.28]}>
        <mesh>
          <boxGeometry args={[0.04, 0.01, 0.02]} />
          <meshStandardMaterial {...paint(C.red)} />
        </mesh>
      </Part>
      <Part id="battery-strap" position={[0, 0.67, -0.28]}>
        <mesh>
          <boxGeometry args={[0.13, 0.008, 0.02]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>
      <Part id="ecu" position={[0.12, 0.62, -0.08]}>
        <mesh>
          <boxGeometry args={[0.08, 0.03, 0.1]} />
          <meshStandardMaterial {...paint('#1a1a1a')} />
        </mesh>
      </Part>
      <Part id="wiring-harness" position={[0.1, 0.58, 0.05]}>
        <mesh rotation={[0.18, 0, 0.08]}>
          <cylinderGeometry args={[0.01, 0.01, 0.7, 6]} />
          <meshStandardMaterial {...paint('#1a1208')} />
        </mesh>
      </Part>
      <Part id="ignition-coil" position={[0.08, 0.72, 0.12]}>
        <mesh>
          <boxGeometry args={[0.04, 0.058, 0.03]} />
          <meshStandardMaterial {...paint('#111')} />
        </mesh>
      </Part>
      <Part id="rectifier" position={[-0.12, 0.5, -0.32]}>
        <mesh>
          <boxGeometry args={[0.06, 0.02, 0.08]} />
          <meshStandardMaterial {...paint('#2a2a2a')} />
        </mesh>
      </Part>
      <Part id="horn" position={[-0.1, 0.42, 0.38]}>
        <mesh>
          <cylinderGeometry args={[0.028, 0.022, 0.03, 12]} />
          <meshStandardMaterial {...paint(C.chrome)} />
        </mesh>
      </Part>
      <Part id="flasher-relay" position={[0.08, 0.58, -0.35]}>
        <mesh>
          <boxGeometry args={[0.03, 0.024, 0.03]} />
          <meshStandardMaterial {...paint('#222')} />
        </mesh>
      </Part>
      <Part id="starter-relay" position={[0.08, 0.62, -0.24]}>
        <mesh>
          <boxGeometry args={[0.04, 0.03, 0.03]} />
          <meshStandardMaterial {...paint('#333')} />
        </mesh>
      </Part>

      <Part id="headlight" position={[0, 0.72, 0.78]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.14, 0.06]} />
          <meshStandardMaterial {...paint('#0e1218', { metalness: 0.5, roughness: 0.28 })} />
        </mesh>
        <mesh position={[-0.07, 0.01, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.048, 0.044, 0.022, 24]} />
          <meshStandardMaterial {...paint('#1a222c', { metalness: 0.7, roughness: 0.18 })} />
        </mesh>
        <mesh position={[0.07, 0.01, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.048, 0.044, 0.022, 24]} />
          <meshStandardMaterial {...paint('#1a222c', { metalness: 0.7, roughness: 0.18 })} />
        </mesh>
        <mesh position={[-0.07, 0.01, 0.044]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.012, 24]} />
          <meshPhysicalMaterial color={C.led} roughness={0.08} metalness={0.05} transmission={0.35} transparent opacity={0.9} emissive={C.led} emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0.07, 0.01, 0.044]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.012, 24]} />
          <meshPhysicalMaterial color={C.led} roughness={0.08} metalness={0.05} transmission={0.35} transparent opacity={0.9} emissive={C.led} emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, -0.048, 0.038]}>
          <boxGeometry args={[0.24, 0.01, 0.008]} />
          <meshStandardMaterial {...paint(C.led, { emissive: '#88aacc', emissiveIntensity: 0.55 })} />
        </mesh>
      </Part>
      <Part id="instrument-cluster" position={[0, 0.94, 0.58]}>
        <mesh rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.045]} />
          <meshStandardMaterial {...paint('#0a0a0a')} />
        </mesh>
        <mesh position={[0, 0.006, 0.02]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.15, 0.042, 0.01]} />
          <meshStandardMaterial {...paint('#1a3040', { emissive: '#143048', emissiveIntensity: 0.55 })} />
        </mesh>
      </Part>
      <Part id="tail-light" position={[0, 0.7, -0.84]}>
        <mesh>
          <boxGeometry args={[0.18, 0.042, 0.024]} />
          <meshStandardMaterial {...paint(C.red, { emissive: '#4a1010', emissiveIntensity: 0.4, transparent: true, opacity: 0.88 })} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.14, 0.018, 0.01]} />
          <meshStandardMaterial {...paint('#ff6a6a', { emissive: '#ff3030', emissiveIntensity: 0.35 })} />
        </mesh>
      </Part>
      <Part id="indicator-fl" position={[-0.2, 0.64, 0.68]}>
        <mesh>
          <boxGeometry args={[0.04, 0.02, 0.05]} />
          <meshStandardMaterial {...paint(C.amber, { emissive: C.amber, emissiveIntensity: 0.25 })} />
        </mesh>
      </Part>
      <Part id="indicator-fr" position={[0.2, 0.64, 0.68]}>
        <mesh>
          <boxGeometry args={[0.04, 0.02, 0.05]} />
          <meshStandardMaterial {...paint(C.amber, { emissive: C.amber, emissiveIntensity: 0.25 })} />
        </mesh>
      </Part>
      <Part id="indicator-rl" position={[-0.16, 0.64, -0.84]}>
        <mesh>
          <boxGeometry args={[0.04, 0.02, 0.04]} />
          <meshStandardMaterial {...paint(C.amber, { emissive: C.amber, emissiveIntensity: 0.25 })} />
        </mesh>
      </Part>
      <Part id="indicator-rr" position={[0.16, 0.64, -0.84]}>
        <mesh>
          <boxGeometry args={[0.04, 0.02, 0.04]} />
          <meshStandardMaterial {...paint(C.amber, { emissive: C.amber, emissiveIntensity: 0.25 })} />
        </mesh>
      </Part>

      <Part id="chain" position={[0.12, 0.315, (-0.06 + REAR_Z) / 2]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.333, 0.007, 6, 48]} />
          <meshStandardMaterial {...paint('#3a3a3a', { metalness: 0.62 })} />
        </mesh>
      </Part>
      <Part id="front-sprocket" position={[0.14, 0.32, -0.06]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshStandardMaterial {...paint(C.alloy, { metalness: 0.72 })} />
        </mesh>
      </Part>
      <Part id="rear-sprocket" position={[0.1, REAR_Y, REAR_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.008, 22]} />
          <meshStandardMaterial {...paint(C.alloy, { metalness: 0.68 })} />
        </mesh>
      </Part>
      <Part id="sprocket-cover" position={[0.18, 0.32, -0.06]}>
        <mesh>
          <boxGeometry args={[0.02, 0.1, 0.12]} />
          <meshStandardMaterial {...paint(C.plastic)} />
        </mesh>
      </Part>

      <Part id="paddock-stand" position={[0, 0.08, -0.55]}>
        <mesh>
          <boxGeometry args={[0.42, 0.02, 0.02]} />
          <meshStandardMaterial {...paint('#c45c12')} />
        </mesh>
        <mesh position={[-0.18, -0.04, 0.08]} rotation={[0.4, 0, 0.2]}>
          <boxGeometry args={[0.02, 0.16, 0.02]} />
          <meshStandardMaterial {...paint('#c45c12')} />
        </mesh>
        <mesh position={[0.18, -0.04, 0.08]} rotation={[0.4, 0, -0.2]}>
          <boxGeometry args={[0.02, 0.16, 0.02]} />
          <meshStandardMaterial {...paint('#c45c12')} />
        </mesh>
      </Part>
      <Part id="front-stand" position={[0, 0.18, 0.5]}>
        <mesh>
          <boxGeometry args={[0.28, 0.02, 0.02]} />
          <meshStandardMaterial {...paint('#888')} />
        </mesh>
      </Part>
    </group>
  )
}
