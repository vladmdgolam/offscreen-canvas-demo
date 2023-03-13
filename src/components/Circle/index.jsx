import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { MathUtils, NormalBlending } from "three"

import { CustomMaterial } from "./Material"

const r = 0.09
const c = 0.35

export const Circle = ({ i = 0, ...props }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.time += delta
    // find angle of state.mouse.x and y and set position with radius 0.15
    // const angle = Math.atan2(state.mouse.y, state.mouse.x)
    // ref.current.position = [0.15 * Math.cos(angle), 0.15 * Math.sin(angle)]
    let futurePosition = [0, 0]
    futurePosition[0] = MathUtils.mapLinear(state.mouse.x, -c, c, -r, r)
    futurePosition[1] = MathUtils.mapLinear(state.mouse.y, -c, c, -r, r)

    // lerp
    ref.current.position[0] = MathUtils.lerp(
      ref.current.position[0],
      futurePosition[0],
      0.1
    )
    ref.current.position[1] = MathUtils.lerp(
      ref.current.position[1],
      futurePosition[1],
      0.1
    )
  })

  return (
    <mesh key={CustomMaterial.key} {...props}>
      <planeGeometry />
      <customMaterial
        ref={ref}
        seed={i}
        toneMapped={false}
        blending={NormalBlending}
        alphaTest={0.1}
        transparent
      />
    </mesh>
  )
}
