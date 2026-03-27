precision mediump float;

uniform vec3 uColor;
uniform vec3 cameraPosition;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 ambientLight(vec3 color, float lightIntensity) {

    return color * lightIntensity;
}

vec3 directionalLight(vec3 color, float lightIntensity , vec3 direction ,vec3 normal,
 vec3 viewPosition, float specularPower
) {

    vec3 lightDirection = normalize(direction);
    float shading = dot(lightDirection,normal);
    shading = max(0.0,shading);

    vec3 reflectLight = reflect(-lightDirection, normal);
    float reflectDot = - dot(reflectLight,viewPosition);
    reflectDot = max(0.0,reflectDot);
    reflectDot = pow(reflectDot,specularPower);

    return color * lightIntensity * (shading + reflectDot);
}

vec3 pointLight(vec3 color, float lightIntensity , vec3 direction ,vec3 normal,
 vec3 viewPosition,float specularPower , vec3 position,float lightDecay
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
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;
    vec3 ambient = ambientLight( vec3(1.0,1.0,1.0) , 0.03);
    vec3 direction = directionalLight(
        vec3(1.0,0.1,0.1),
        0.2,
        vec3(0.0,0.0,3.0),
        normal,
        viewDirection,
        2.0
    );
    vec3 pointL = pointLight(
        vec3(1.0,0.1,1.0),
        1.0,
        vec3(2.0,2.0,2.0),
        normal,
        viewDirection,
        20.0,
        vPosition,
        0.25
    );    
    color = color * (
    direction +
    ambient +
    pointL
    );

    gl_FragColor = vec4(color,1.0);
}