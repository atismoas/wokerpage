precision mediump float;
uniform sampler2D uTextures;
uniform vec3 uColor;

void main(){
    float texture = texture2D(uTextures,gl_PointCoord).r;
    // gl_FragColor = texture;
    // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);
    gl_FragColor = vec4(uColor,texture);
}