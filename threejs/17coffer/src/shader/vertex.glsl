uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mediump float uTime;
uniform sampler2D uPerlinTexture;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle){
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c,s,-s,c);
    return m * value;
}

void main(){
    vec3 newPosition = position;
    float twisPerlin = texture2D(uPerlinTexture, vec2(0.5,uv.y * 0.2 - uTime * 0.005)).r;
    float angle = twisPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz,angle);
    // newPosition.xz += vec2(sin(uTime),sin(uTime));

    // wind
    vec2 windOffset = vec2(
        texture2D(uPerlinTexture,vec2(0.25,uTime * 0.01)).r - 0.5,
        texture2D(uPerlinTexture,vec2(0.75,uTime * 0.01)).r - 0.5

    );
    windOffset *= pow(uv.y,2.0) * 10.0;
    newPosition.xz += windOffset;

    vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);
    

    

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;
}