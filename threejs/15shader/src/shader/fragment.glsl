precision mediump float;


uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultipier;

varying vec2 vUv;
varying float vElevation;

void main(){
    // float x = floor(vUv.x * 8.0);
    // float y = floor(vUv.y * 8.0);
    // float strength = mod(x + y, 2.0);
    float mixStrength = (vElevation + uColorOffset) * uColorMultipier;
    vec3 color = mix(uSurfaceColor,uDepthColor,mixStrength);

    // gl_FragColor = vec4(strength,strength,strength,1.0);
    gl_FragColor = vec4(color,1.0);
}