import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"

import { CustomMaterial } from "./Material"

export const Circle = () => {
  const ref = useRef()
  const { width, height } = useThree((state) => state.viewport)
  useFrame((state, delta) => {
    ref.current.time += delta
    ref.current.position = state.mouse
  })

  return (
    <mesh scale={[width, height, 1]} key={CustomMaterial.key}>
      <planeGeometry />
      <customMaterial ref={ref} toneMapped={false} aspect={width / height} />
    </mesh>
  )
}
