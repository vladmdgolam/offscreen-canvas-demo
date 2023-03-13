import { Line } from "@react-three/drei"
import PoissonDiscSampler from "poisson-disc-sampler"
import { useMemo } from "react"
import { States } from "src/constants"
import { Vector3 } from "three"

import { Circle } from "../Circle"

export const Circles = ({ state }) => {
  const [positions, centralIndex] = useMemo(() => {
    const NUM_CIRCLES = 20
    const RADIUS = 1.0
    const SPACING = 1.4

    const sampler = PoissonDiscSampler(10, 10, RADIUS * SPACING)
    const circles: Vector3[] = []

    let sample: number[] | undefined
    while ((sample = sampler())) {
      const x = sample[0] * SPACING
      const y = sample[1] * SPACING
      const z = 0.0
      const position = new Vector3(x, y, z)
      circles.push(position)
      if (circles.length >= NUM_CIRCLES) break
    }

    // Find the center position of all the circles
    const center = new Vector3()
    circles.forEach((p) => center.add(p))
    center.divideScalar(circles.length)

    // Find the central circle
    let minDist = Infinity
    let centralIndex = 0
    circles.forEach((p, i) => {
      const distSq = p.distanceToSquared(center)
      if (distSq < minDist) {
        minDist = distSq
        centralIndex = i
      }
    })

    // Subtract the position of the central circle from all the positions
    const centralPosition = circles[centralIndex].clone()
    circles.forEach((p) => p.sub(centralPosition))

    return [circles, centralIndex]
  }, [])

  const centralPos = positions[centralIndex].toArray()

  return (
    <>
      {positions.map((position, index) => (
        <group key={index}>
          <Circle i={index} position={position} />
          {state === States.connected && (
            <Line
              points={[position.toArray(), centralPos]}
              color="white"
              transparent
              opacity={0.3}
            />
          )}
        </group>
      ))}
    </>
  )
}
