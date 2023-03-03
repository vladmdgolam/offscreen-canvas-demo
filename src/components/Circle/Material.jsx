import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import glsl from "babel-plugin-glsl/macro"
import { Color } from "three"

import { colors } from "../../constants"

const CustomMaterial = shaderMaterial(
  {
    time: 0,
    aspect: 1.0001,
    color: new Color(colors.pink),
    blue: new Color(colors.blue),
    blur: 0.0,
    position: [0.11, -0.15],
  },
  glsl`
      varying vec2 vUv;
      void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPosition = projectionMatrix * viewPosition;
          gl_Position = projectionPosition;
          vUv = uv;
        }`,
  glsl`
    uniform float time;
    varying vec2 vUv;
    uniform float aspect;
    uniform vec3 color;
    uniform vec3 blue;
    uniform float blur;
    uniform vec2 position;

    #pragma glslify: blendDifference = require(glsl-blend/difference)

    float circle(vec2 uv, vec2 pos, float r, float blur) {
        float d = length(uv-pos);
        float result = smoothstep(r, r-blur, d);
        return result;
    }

    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    // rand from https://www.shadertoy.com/view/4djSRW
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    
    void main() {
        vec2 uv = vUv;
        uv -= .5;
        uv.x *= aspect;
        
        float r = 0.5 * 0.8;
        float d = 2.*r;
        // float xpos = 0.5*aspect-d;

        vec2 pinkPos = vec2(-0.1,-0.15);
        //vec2(cos(-time+34.0), sin(-time+34.0)) * 0.15;
        //vec2(-0.1,-0.15);
        float pinkCircle = circle(uv, pinkPos, r*0.75, 0.2);
        vec3 col = pinkCircle * color;

        // derive position from cos(time) and radius = 0.5
        vec2 pos = vec2(cos(time), sin(time)) * 0.15;
        //0.1,0.15

        float whiteCircle = circle(uv, pos, r*0.75, 0.2);
        col += whiteCircle * vec3(1.);


        float blueCircleRad = map(sin(time), -1.0, 1.0, 0.75, 0.85);
        
        float blueCircle = circle(uv, position, r*blueCircleRad, 0.2);
        vec3 blueCircleFilled = blueCircle * blue;
        
        vec3 finalCol = blendDifference(col, blueCircleFilled);

        // clamp
        col = clamp(finalCol, 0., 1.);

        float black = circle(uv, vec2(0.,0.), r, 0.001);
        col -= vec3(black);

        gl_FragColor = vec4(col,1.);
    }
      `
)

// CustomMaterial.key = guid.generate()

extend({ CustomMaterial })
export { CustomMaterial }
