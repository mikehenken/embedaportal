/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three'
import { useRef, ReactNode, Suspense, useState, useEffect } from 'react'
import { Canvas, extend, useFrame, useThree, ThreeElement } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Text, Preload, Environment, useTexture, Gltf } from '@react-three/drei'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import { ErrorBoundary } from 'react-error-boundary'

// Extend R3F with maath's roundedPlaneGeometry
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

// Add type for the custom geometry
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedPlaneGeometry: ThreeElement<typeof geometry.RoundedPlaneGeometry>
  }
}

const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export interface Resort {
  id: string
  name: string
  location: string
  bg: string
  image: string
  position: [number, number, number]
  rotation: [number, number, number]
}

export interface AppProps {
  resorts?: Resort[]
  bgColor?: string
  fontColor?: string
}

function PortalImage({ url }: { url: string }) {
  const texture = useTexture(url)
  return (
    <mesh scale={100} rotation={[0, Math.PI / 2, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  )
}

interface FrameProps {
  id: string
  name: string
  author: string
  bg: string
  image: string
  width?: number
  height?: number
  fontColor?: string
  isActive: boolean
  setActivePortal: (id: string | null) => void
  lastEnterTime: React.MutableRefObject<number>
  children?: ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function FrameContent({ id, name, author, bg, image, width = 1, height = 1.618, fontColor = '#1a1a1a', isActive, setActivePortal, lastEnterTime, children }: FrameProps) {
  const portal = useRef<any>(null)
  const [hovered, hover] = useState(false)
  useCursor(hovered)

  useFrame((_state, dt) => {
    if (portal.current) {
      easing.damp(portal.current, 'blend', isActive ? 1 : 0, 0.2, dt)
    }
  })

  const mediumFont = suspend(medium) as any
  const regularFont = suspend(regular) as any
  
  const isGLB = image.toLowerCase().endsWith('.glb') || image.toLowerCase().endsWith('.gltf')

  return (
    <>
      <Text
        font={mediumFont.default}
        fontSize={0.1875}
        color={fontColor}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        font={regularFont.default}
        fontSize={0.075}
        color={fontColor}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        font={regularFont.default}
        fontSize={0.03}
        color={fontColor}
        anchorX="right"
        position={[0.4, -0.72, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={id}
        onDoubleClick={(e) => {
          e.stopPropagation()
          if (!isActive) {
            lastEnterTime.current = Date.now()
            setActivePortal(id)
          }
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={isActive} side={THREE.DoubleSide} blur={0} resolution={1024}>
          <color attach="background" args={[bg]} />
          <Environment preset="sunset" />
          {isGLB ? (
            <Gltf src={image} scale={2} position={[0, -1, 0]} />
          ) : (
            <PortalImage url={image} />
          )}
          {children}
        </MeshPortalMaterial>
      </mesh>
    </>
  )
}

function Frame(props: FrameProps) {
  return (
    <group position={props.position} rotation={props.rotation}>
      <ErrorBoundary fallback={<Text color="red" fontSize={0.1}>Error loading portal</Text>}>
        <Suspense fallback={<Text color={props.fontColor || "gray"} fontSize={0.1}>Loading...</Text>}>
          <FrameContent {...props} />
        </Suspense>
      </ErrorBoundary>
    </group>
  )
}

function Rig({ activePortal, position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }: { activePortal: string | null, position?: THREE.Vector3, focus?: THREE.Vector3 }) {
  const { controls, scene } = useThree()

  useEffect(() => {
    const active = activePortal ? scene.getObjectByName(activePortal) : null
    if (active) {
      active.parent?.localToWorld(position.set(0, 0.5, 0.25))
      active.parent?.localToWorld(focus.set(0, 0, -2))
    } else {
      position.set(0, 0, 2)
      focus.set(0, 0, 0)
    }
    if (controls) {
      // @ts-ignore
      controls.setLookAt(...position.toArray(), ...focus.toArray(), true)
    }
  }, [activePortal, scene, controls, position, focus])

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}

export default function App({ resorts = [], bgColor = 'transparent', fontColor = '#1a1a1a' }: AppProps) {
  const [activePortal, setActivePortal] = useState<string | null>(null)
  const lastEnterTime = useRef(0)

  return (
    <div 
      className="w-full h-full relative" 
      style={{ backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor }}
      onDoubleClick={() => {
        if (activePortal && Date.now() - lastEnterTime.current > 300) {
          setActivePortal(null)
        }
      }}
    >
      <Canvas
        flat
        gl={{ alpha: bgColor === 'transparent' }}
        camera={{ fov: 75, position: [0, 0, 20] }}
      >
        {bgColor !== 'transparent' && <color attach="background" args={[bgColor]} />}
        <Suspense fallback={<Text position={[0, 0, 0]} fontSize={0.1} color={fontColor}>Loading Portals...</Text>}>
          {resorts.map((resort) => (
            <Frame
              key={resort.id}
              id={resort.id}
              name={resort.name}
              author={resort.location}
              bg={resort.bg}
              image={resort.image}
              position={resort.position}
              rotation={resort.rotation}
              fontColor={fontColor}
              isActive={activePortal === resort.id}
              setActivePortal={setActivePortal}
              lastEnterTime={lastEnterTime}
            />
          ))}
        </Suspense>
        <Rig activePortal={activePortal} />
        <Preload all />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-10" style={{ color: fontColor }}>
        <div className="flex justify-between items-start pointer-events-auto">
          <button
            onClick={() => setActivePortal(null)}
            className="text-sm font-medium uppercase tracking-widest cursor-pointer hover:opacity-50 transition-opacity"
            style={{ display: activePortal ? 'block' : 'none' }}
          >
            &larr; Back to Resorts
          </button>
          {!activePortal && (
            <div className="text-sm font-medium uppercase tracking-widest opacity-50">
              Double click to enter portal
            </div>
          )}
        </div>

        <div className="flex justify-between items-end pointer-events-auto">
          <div className="flex flex-col">
            <div className="text-xl font-bold tracking-tighter">PORTALS</div>
            <div className="text-xs opacity-50">IMMERSIVE 3D EXPERIENCES</div>
          </div>
        </div>
      </div>
    </div>
  )
}
