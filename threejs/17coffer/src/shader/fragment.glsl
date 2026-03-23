precision mediump float;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;
uniform float uTime;

void main(){
    // Smoke 
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.5;
    smokeUv.y -= uTime * 0.03;


    float smoke = texture2D(uPerlinTexture,smokeUv).r;
    smoke = smoothstep(0.4,1.0,smoke);

    // smoke = 1.0;
    smoke *= smoothstep(0.0,0.1,vUv.x);
    smoke *= smoothstep(1.0,0.9,vUv.x);
    smoke *= smoothstep(0.0,0.1,vUv.y);
    smoke *= smoothstep(1.0,0.4,vUv.y);

    gl_FragColor = vec4(1.0,1.0,1.0,smoke);
    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    // 色调映射
    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}