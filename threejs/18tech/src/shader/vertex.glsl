uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mediump float uTime;
uniform sampler2D uPerlinTexture;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

vec2 rotate2D(vec2 value, float angle){
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c,s,-s,c);
    return m * value;
}

float random2D(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main(){
    vec3 newPosition = position;
    // float twisPerlin = texture2D(uPerlinTexture, vec2(0.5,uv.y * 0.2 - uTime * 0.005)).r;
    // float angle = twisPerlin * 10.0;
    // newPosition.xz = rotate2D(newPosition.xz,angle);
    // // newPosition.xz += vec2(sin(uTime),sin(uTime));

    // // wind
    // vec2 windOffset = vec2(
    //     texture2D(uPerlinTexture,vec2(0.25,uTime * 0.01)).r - 0.5,
    //     texture2D(uPerlinTexture,vec2(0.75,uTime * 0.01)).r - 0.5

    // );
    // windOffset *= pow(uv.y,2.0) * 10.0;
    // newPosition.xz += windOffset;

    vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);

    float glitchTIme = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTIme) + sin(glitchTIme * 3.45) + sin(glitchTIme*8.76);
    glitchStrength = smoothstep(0.3,1.0,glitchStrength);
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;
    // 去除平移
    vec4 modelNormal = modelMatrix * vec4(normal,0.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
}