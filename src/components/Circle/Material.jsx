import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
// import guid from "short-uuid"
import { Color } from "three"

import { colors } from "../../constants"

const CustomMaterial = shaderMaterial(
  {
    time: 0,
    aspect: 1.0001,
    color: new Color(colors.pink),
    blue: new Color(colors.blue),
    blur: 0.0,
  },
  /* glsl */ `
      varying vec2 vUv;
      void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPosition = projectionMatrix * viewPosition;
          gl_Position = projectionPosition;
          vUv = uv;
        }`,
  /* glsl */ `
        uniform float time;
        varying vec2 vUv;
        uniform float aspect;
        uniform vec3 color;
        uniform vec3 blue;
        uniform float blur;

    float circle(vec2 uv, vec2 pos, float r, float blur) {
        float d = length(uv-pos);
        float result = smoothstep(r, r-blur, d);
        return result;
    }

    
    void main() {
        vec2 uv = vUv;
        uv -= .5;
        uv.x *= aspect;
        
        float r = 0.5 * 0.8;
        float d = 2.*r;
        float xpos = 0.5*aspect-d;
        float pinkCircle = circle(uv, vec2(-0.1,-0.15), r*0.75, 0.2);
        vec3 col = pinkCircle * color;

        float whiteCircle = circle(uv, vec2(0.1,0.15), r*0.75, 0.2);
        col += whiteCircle * vec3(1.);

        float blueCircle = circle(uv, vec2(0.11,-0.15), r*0.75, 0.2);
        col += blueCircle * blue;

        // clamp
        col = clamp(col, 0., 1.);

        float black = circle(uv, vec2(0.,0.), r, 0.001);
        col -= vec3(black);

        gl_FragColor = vec4(col,1.);
    }
      `
)

// CustomMaterial.key = guid.generate()

extend({ CustomMaterial })
export { CustomMaterial }
