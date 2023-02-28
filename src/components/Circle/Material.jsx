import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

const CustomMaterial = shaderMaterial(
  {
    time: 0,
    aspect: 1.0001,
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

    float circle(vec2 uv, vec2 pos, float r, float blur) {
        float d = length(uv-pos);
        return smoothstep(r, r-r/2.5,d);
    }

    
    void main() {
        vec2 uv = vUv;
        uv -= .5;
        uv.x *= aspect;
        
        float r = 0.5;
        float d = 2.*r;
        float xpos = 0.5*aspect-d;
        float col = circle(uv, vec2(0.,0.), r, 0.);
        gl_FragColor = vec4(vec3(col),1.);
    }
      `
)

extend({ CustomMaterial })
export { CustomMaterial }
