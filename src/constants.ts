export const colors = {
  pink: "#FF93AD",
  blue: "#4777FE",
}

export enum States {
  initial = 0,
  grid,
  zoomOut,
  connected,
  zoomIn,
}

export const props = {
  initial: {
    zoom: 9,
  },
  zoomOut: {
    zoom: 1,
  },
  zoomIn: {
    zoom: 10,
  },
}
