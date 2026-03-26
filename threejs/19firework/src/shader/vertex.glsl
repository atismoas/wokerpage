uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uTextures;
uniform float uProgress;

attribute float uTimeMutiply;
attribute float uPointSize;
attribute vec3 position;

// 重映射
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

void main(){
    vec3 newPosition = position;
    float progress = uProgress * uTimeMutiply;

    // Exploding
    float exploding = remap(progress,0.0,0.1,0.0,1.0);
    exploding = clamp(exploding , 0.0, 1.0);
    exploding = 1.0 - pow(1.0 - exploding,3.0);
    newPosition *= exploding;

    // Falling
    float falling = remap(progress,0.1,1.0,0.0,1.0);
    falling = clamp(falling,0.0,1.0);
    falling = 1.0 - pow(1.0 - falling,3.0);
    newPosition.y -= falling * 0.2;

    // Scale
    float scaleOpen = remap(progress,0.0,0.125,0.0,1.0);
    float scaleClose = remap(progress,0.125,1.0,1.0,0.0);
    float scale = min(scaleOpen,scaleClose);
    scale = clamp(scale,0.0,1.0);

    // Twinking
    float twink = remap(progress,0.2,0.8,0.0,1.0);
    twink = clamp(twink,0.0,1.0);
    float sizeTwink = sin(twink * 30.0) * 0.8 + 0.5;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uResolution.y / 40.0 * uPointSize * scale * sizeTwink;
    gl_PointSize *= 1.0 / - viewPosition.z;

    if(gl_PointSize < 1.0){
        gl_Position = vec4(999.9);
    }
}