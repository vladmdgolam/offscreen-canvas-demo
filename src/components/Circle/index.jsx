import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"

import { CustomMaterial } from "./Material"

export const Circle = () => {
  const ref = useRef()
  const { width, height } = useThree((state) => state.viewport)
  useFrame((state, delta) => {
    ref.current.time += delta
    // find angle of state.mouse.x and y and set position with radius 0.15
    const angle = Math.atan2(state.mouse.y, state.mouse.x)
    ref.current.position = [0.15 * Math.cos(angle), 0.15 * Math.sin(angle)]
  })

  return (
    <mesh scale={[width, height, 1]} key={CustomMaterial.key}>
      <planeGeometry />
      <customMaterial ref={ref} toneMapped={false} aspect={width / height} />
    </mesh>
  )
}
