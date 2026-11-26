"use client";

import { useEffect, useRef } from "react";
import { nivelAlto, puntero } from "@/lib/perf";

/* Fondo del hero: seda de luz generada en la GPU (WebGL1, un solo fragment shader, sin librerías).
   Reacciona al mouse (--px/--py) y al scroll. Se dibuja a baja resolución y se escala por CSS.
   Se pausa fuera de pantalla, con la pestaña oculta, con pausa manual o con reduced motion (queda un cuadro fijo).
   Si WebGL no está disponible, se quita el canvas y queda la escena SVG de abajo. */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
  p+=(m-.5)*vec2(.16,-.12);
  p.y+=s*.35;
  float k=t*.07;
  vec2 q=vec2(fbm(p*1.5+k),fbm(p*1.5-k+5.2));
  vec2 w=vec2(fbm(p*1.3+q*2.+vec2(1.7,9.2)+k*1.4),fbm(p*1.3+q*2.+vec2(8.3,2.8)-k));
  float f=fbm(p*1.15+w*2.3);
  float l=0.;
  for(int i=0;i<4;i++){float lv=.40+float(i)*.075;l+=smoothstep(.016,.0,abs(f-lv))*(1.-.2*float(i));}
  float g=smoothstep(.32,.8,f);
  vec3 y=vec3(1.,.9,0.);
  vec3 col=vec3(.039);
  col+=y*g*g*.34*(1.-uv.y*.55);
  col+=y*l*.85;
  col+=vec3(.96,.96,.94)*l*l*.35;
  float mm=smoothstep(.55,0.,length(uv-m));
  col+=y*mm*.10;
  col*=smoothstep(1.45,.25,length((uv-.5)*vec2(1.1,1.5)));
  gl_FragColor=vec4(col,1.);
}`;

export function HeroGL() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!nivelAlto()) {
      canvas.remove(); /* dispositivos livianos: queda el póster (imagen) con una deriva suave */
      return;
    }
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.remove();
      return;
    }
    const compilar = (tipo: number, src: string) => {
      const sh = gl.createShader(tipo)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = compilar(gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.remove();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.remove();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");
    const uS = gl.getUniformLocation(prog, "s");

    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let raf = 0;
    let mx = 0.5;
    let my = 0.5;
    const t0 = performance.now();

    const tamano = () => {
      const esc = Math.min(1, 800 / Math.max(canvas.clientWidth, 1)) * Math.min(devicePixelRatio, 1.25) * 0.6;
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * esc));
      canvas.height = Math.max(2, Math.round(canvas.clientHeight * esc));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const dibujar = (ahora: number) => {
      mx += (puntero.x - mx) * 0.06;
      my += (1 - puntero.y - my) * 0.06;
      const y = Math.min(scrollY / Math.max(innerHeight, 1), 1.4);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (ahora - t0) / 1000 + 12);
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uS, y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    /* Vigilante: si el promedio de los primeros cuadros supera ~28 ms (menos de ~35 fps), se apaga y queda el póster. */
    let cuadros = 0;
    let acum = 0;
    let previo = 0;
    const animar = (ahora: number) => {
      if (previo && cuadros > 20 && cuadros <= 100) acum += ahora - previo;
      previo = ahora;
      cuadros++;
      if (cuadros === 100 && acum / 80 > 28) {
        canvas.remove();
        return;
      }
      dibujar(ahora);
      raf = 0;
      pedir();
    };
    const activo = () => visible && !reduce.matches && root.dataset.motion !== "paused" && document.visibilityState === "visible";
    function pedir() {
      if (!raf && activo()) raf = requestAnimationFrame(animar);
    }
    const estatico = () => {
      tamano();
      dibujar(t0 + 4000);
      pedir();
    };

    tamano();
    estatico();
    const ro = new ResizeObserver(estatico);
    ro.observe(canvas);
    const io = new IntersectionObserver((es) => {
      visible = es[0]?.isIntersecting ?? true;
      pedir();
    });
    io.observe(canvas);
    const alCambio = () => {
      if (!activo() && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      pedir();
    };
    document.addEventListener("visibilitychange", alCambio);
    reduce.addEventListener("change", alCambio);
    const mo = new MutationObserver(alCambio);
    mo.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    const perdido = (e: Event) => {
      e.preventDefault();
      canvas.remove();
    };
    canvas.addEventListener("webglcontextlost", perdido);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", alCambio);
      reduce.removeEventListener("change", alCambio);
      canvas.removeEventListener("webglcontextlost", perdido);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="x-gl" aria-hidden="true" />;
}
