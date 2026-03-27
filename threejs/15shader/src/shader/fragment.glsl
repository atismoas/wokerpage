precision mediump float;


uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultipier;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;



// 点光源
vec3 pointLight(vec3 color, float lightIntensity , vec3 direction ,vec3 normal, vec3 viewPosition,float specularPower , vec3 position,float lightDecay
) {

    vec3 lightDelta = direction - position;
    float lightDis = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    float shading = dot(lightDirection,normal);
    shading = max(0.0,shading);

    vec3 reflectLight = reflect(-lightDirection, normal);
    float reflectDot = - dot(reflectLight,viewPosition);
    reflectDot = max(0.0,reflectDot);
    reflectDot = pow(reflectDot,specularPower);

    float decay = 1.0 - lightDis * lightDecay;
    decay = max(0.0,decay);

    return color * lightIntensity *  decay * (shading + reflectDot);
}

void main(){
    // float x = floor(vUv.x * 8.0);
    // float y = floor(vUv.y * 8.0);
    // float strength = mod(x + y, 2.0);
    vec3 viewPosition = normalize(vPosition - cameraPosition);
    float mixStrength = (vElevation + uColorOffset) * uColorMultipier;
    vec3 color = mix(uSurfaceColor,uDepthColor,mixStrength);

    vec3 light = pointLight(
        vec3(1.0,1.0,1.0),
        1.0,
        vec3(-1.0,0.5,0.0),
        vNormal,
        viewPosition,
        30.0,
        vPosition,
        0.95
    );
    color *= light;


    // gl_FragColor = vec4(strength,strength,strength,1.0);
    gl_FragColor = vec4(color,1.0);
}