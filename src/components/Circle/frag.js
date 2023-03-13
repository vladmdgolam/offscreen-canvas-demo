import glsl from "babel-plugin-glsl/macro"

const frag = glsl`
    uniform float time;
    varying vec2 vUv;
    uniform vec3 pink;
    uniform vec3 blue;
    uniform float blur;
    uniform vec2 position;
    uniform float radius;
    uniform float seed;
    #define PI 3.1415926535897932384626433832795

    #pragma glslify: blendDifference = require(glsl-blend/difference)
    #pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

    float circle(vec2 uv, vec2 pos, float r, float blur) {
        float d = length(uv-pos);
        float result = smoothstep(r, r-blur, d);
        return result;
    }

    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    
    void main() {
        vec2 uv = vUv;
        uv -= .5;
        
        float r = 0.5 * 0.8;

        // 1. PINK CIRCLE
        // derive pos from radius = 0.15 and angle = 30 degrees
        // get random angle from seed
        float angle = rand(vec2(seed)) * 2.0 * PI;
        vec2 pos = vec2(radius * cos(angle), radius * sin(angle));
        vec3 pinkCircle = circle(uv, pos, r * 0.9, 0.2) * pink ;
        vec3 col = pinkCircle;

        // 2. WHITE VIGNETTE
        // use noise and radius to calculate position
        angle = rand(gl_FragCoord.xy + time) * 2.0 * PI;
  
        // Apply noise to the angle
        float noiseScale = 0.1;
        float noiseStrength = 0.1;
        float noise = snoise2(vec2(angle * noiseScale + time * 0.1));
        angle += noise * noiseStrength;

        pos = vec2(radius * cos(angle), radius * sin(angle));
        float whiteCircle = circle(uv, pos, r * 0.75, 0.2);
        // col += whiteCircle * vec3(1.5);
        
        // 3. WHITE CIRCLE
        // calculate radius using noise
        float noiseScale2 = 10.5;
        float noise2 = snoise2(vec2(noiseScale2 + time * 0.1));
        float noiseRad = map(noise2, 0.0, 1.0, 0.8, 0.9);

        // random start angle
        float sAngle = rand(vec2(seed, seed * 23.7)) * 2.0 * PI;
        pos = vec2(cos(sAngle + time), sin(sAngle + time)) * 0.15;
        whiteCircle = circle(uv, pos, r*noiseRad, 0.2);
        col += whiteCircle * vec3(1.);

        // 4. BLUE CIRCLE
        float blueCircleRad = map(sin(time), -1.0, 1.0, 0.85, 1.);
        
        float blueCircle = circle(uv, position, r*blueCircleRad, 0.2);
        vec3 blueCircleFilled = blueCircle * blue;
        
        col = blendDifference(col, blueCircleFilled);
        col = clamp(col, 0., 1.);

        // 5. BLACK CIRCLE
        float black = circle(uv, vec2(0.,0.), r, 0.1);
        col -= vec3(black)*2.0;
        
        gl_FragColor = vec4(col,1.);
    }
      `

export default frag
