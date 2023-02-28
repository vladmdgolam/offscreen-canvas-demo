import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"

import { WaveMaterial } from "./Material"

export const Circle = () => {
  const ref = useRef()
  const { width, height } = useThree((state) => state.viewport)
  useFrame((_, delta) => (ref.current.time += delta))
  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry />
      <waveMaterial
        ref={ref}
        key={WaveMaterial.key}
        toneMapped={true}
        colorStart={"#505050"}
        colorEnd={"black"}
      />
    </mesh>
  )
}
