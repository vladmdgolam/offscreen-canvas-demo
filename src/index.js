import "./styles.css"

import { Suspense } from "react"
import { createRoot } from "react-dom/client"

import ThreeFiberOffscreen from "./components/three-fiber-offscreen"

const Root = () => {
  return (
    <Suspense fallback={null}>
      <ThreeFiberOffscreen />
    </Suspense>
  )
}

createRoot(document.getElementById("root")).render(<Root />)
