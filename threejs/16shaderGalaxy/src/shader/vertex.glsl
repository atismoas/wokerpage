uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform float uSize;
uniform float uTime;
uniform vec3 aRandom;

attribute float aScale;
attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = 1.0 / distanceToCenter * uTime * 0.2;
    modelPosition.x = sin(angle + angleOffset) * distanceToCenter;
    modelPosition.z = cos(angle + angleOffset) * distanceToCenter;

    modelPosition.x += aRandom.x;
    modelPosition.y += aRandom.y;
    modelPosition.z += aRandom.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;
    vColor = color;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= 1.0/ -viewPosition.z;
}