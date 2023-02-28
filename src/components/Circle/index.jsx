import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"

import { CustomMaterial } from "./Material"

export const Circle = () => {
  const ref = useRef()
  const { width, height } = useThree((state) => state.viewport)
  useFrame((_, delta) => (ref.current.time += delta))
  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry />
      <customMaterial
        ref={ref}
        key={CustomMaterial.key}
        // toneMapped={true}
        aspect={width / height}
      />
    </mesh>
  )
}
