import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { AdditiveBlending } from "three"

import { CustomMaterial } from "./Material"

export const Circle = ({ i = 0, ...props }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.time += delta
    // find angle of state.mouse.x and y and set position with radius 0.15
    const angle = Math.atan2(state.mouse.y, state.mouse.x)
    ref.current.position = [0.15 * Math.cos(angle), 0.15 * Math.sin(angle)]
  })

  return (
    <mesh key={CustomMaterial.key} {...props}>
      <planeGeometry />
      <customMaterial
        ref={ref}
        seed={i}
        toneMapped={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
