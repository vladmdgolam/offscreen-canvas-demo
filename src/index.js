import "./styles.css"

import { Suspense, useContext } from "react"
import { createRoot } from "react-dom/client"
import { Context } from "src/components/Context"
import { States } from "src/constants"
import { StateContext } from "src/hooks/StateContext"

import ThreeFiberOffscreen from "./ThreeFiberOffscreen"

const Button = () => {
  const { setState } = useContext(StateContext)

  const handleClick = () => {
    // next state
    setState((state) =>
      Math.min((state + 1) % (Object.keys(States).length / 2))
    )
  }

  return <button onClick={handleClick}>next</button>
}

const Root = () => {
  return (
    <Context>
      <Suspense fallback={null}>
        <ThreeFiberOffscreen />
      </Suspense>
      <Button />
    </Context>
  )
}

createRoot(document.getElementById("root")).render(<Root />)
