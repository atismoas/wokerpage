precision mediump float;

varying vec3 vColor;

void main () {
    // float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    // float s = 1.0 - step(0.5,distanceToCenter);

    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    distanceToCenter *= 2.0;
    float s = 1.0 - distanceToCenter;
    // s = pow(s,2.0);

    vec3 color = mix(vec3(0.0),vColor,s);
    gl_FragColor = vec4(color,1.0);
}