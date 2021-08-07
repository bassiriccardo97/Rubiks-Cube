#version 300 es

precision mediump float;

in vec2 uvCoord;
uniform sampler2D sampler;
out vec4 outColor;

void main() {
  outColor=texture(sampler, uvCoord);
}