import { useFrame } from "@react-three/fiber"
import { States, props } from "src/constants"

import { Circles } from "../Circles"

export const Orchestra = ({ state: sceneState }) => {
  useFrame((state, delta) => {
    if (sceneState === States.initial) {
      state.camera.zoom = 9
    } else if (props[States[sceneState]] && props[States[sceneState]].zoom) {
      const desiredZoom = props[States[sceneState]].zoom
      state.camera.zoom += (desiredZoom - state.camera.zoom) * delta * 10
    }
    state.camera.updateProjectionMatrix()
  })

  return <Circles state={sceneState} />
}
