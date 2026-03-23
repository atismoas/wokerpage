precision mediump float;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uCameraPosition;
varying vec3 vNormal;
uniform vec3 uColor;

void main(){
    // Smoke 
    // vec2 smokeUv = vUv;
    // smokeUv.x *= 0.5;
    // smokeUv.y *= 0.5;
    // smokeUv.y -= uTime * 0.03;


    // float smoke = texture2D(uPerlinTexture,smokeUv).r;
    // smoke = smoothstep(0.4,1.0,smoke);

    // // smoke = 1.0;
    // smoke *= smoothstep(0.0,0.1,vUv.x);
    // smoke *= smoothstep(1.0,0.9,vUv.x);
    // smoke *= smoothstep(0.0,0.1,vUv.y);
    // smoke *= smoothstep(1.0,0.4,vUv.y);

    // gl_FragColor = vec4(1.0,1.0,1.0,smoke);
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing){
        normal *= -1.0;
    }

    float strength = mod((vPosition.y + uTime * 0.02)* 20.0 ,1.0);
    strength = pow(strength,3.0);
    // Fresnel
    vec3 viewDirection = normalize(vPosition -uCameraPosition );
    // 点积
    float fresnel = dot(viewDirection,normal) + 1.0;
    fresnel = pow(fresnel,2.0);

    // falloff
    float falloff = smoothstep(0.8,0.0,fresnel);

    // Holographic
    float holographic = strength * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    gl_FragColor = vec4(uColor,holographic);
    // 色调映射
    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}