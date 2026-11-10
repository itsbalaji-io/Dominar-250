import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Grid, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Connectors } from '../bike/Connectors'
import { Dominar } from '../bike/Dominar'
import { CAMERA_VIEWS, useBike } from '../store'

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null)
  const nonce = useBike((s) => s.cameraNonce)
  const view = useBike((s) => s.cameraView)
  const autoRotate = useBike((s) => s.autoRotate)
  const { camera } = useThree()

  useEffect(() => {
    const v = CAMERA_VIEWS[view]
    camera.position.set(...v.pos)
    camera.lookAt(...v.target)
    controls.current?.target.set(...v.target)
    controls.current?.update()
  }, [nonce, camera, view])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={8}
      maxPolarAngle={Math.PI}
      target={[0, 0.48, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.7}
    />
  )
}

function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0c1016" roughness={0.92} metalness={0.08} />
      </mesh>
      <Grid
        position={[0, 0.002, 0]}
        args={[12, 12]}
        cellSize={0.2}
        cellThickness={0.6}
        cellColor="#1c2838"
        sectionSize={1}
        sectionThickness={1.1}
        sectionColor="#2a3d55"
        fadeDistance={9}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={8} blur={2.4} far={3} />
    </>
  )
}

export function Studio() {
  const setSelected = useBike((s) => s.setSelected)
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.4, 1.35, 2.6], fov: 42, near: 0.05, far: 40 }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={['#07090d']} />
      <fog attach="fog" args={['#07090d', 8, 16]} />
      <hemisphereLight args={['#c8d6e8', '#1a120c', 0.55]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#8eb4d8" />
      <spotLight position={[0, 5, 1]} angle={0.5} penumbra={0.6} intensity={0.4} color="#ffd9b0" />
      <Environment preset="warehouse" />
      <CameraRig />
      <Floor />
      <Dominar />
      <Connectors />
    </Canvas>
  )
}
