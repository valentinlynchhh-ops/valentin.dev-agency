/* Escenas de horizonte: SVG en capas (masa carbón, halo amarillo localizado, borde de luz nítido, luz que viaja).
   Decorativas: aria-hidden, sin eventos. Cada variante usa coordenadas propias para que las secciones se conecten sin
   repetir el mismo arco. La animación es CSS (transform en grupos + dashoffset en la chispa); no hay JS ni WebGL. */

type Capa = { rim: string; masa?: string; glow?: { x: number; y: number; r: number; o?: number }[]; plata?: boolean; deriva?: "a" | "b"; chispa?: number };

function Capa({ id, c, i, ligera }: { id: string; c: Capa; i: number; ligera?: boolean }) {
  const rim = `url(#${id}-${c.plata ? "plata" : "rim"})`;
  return (
    <g className={`vd-drift-${c.deriva ?? (i % 2 ? "b" : "a")}`}>
      {c.glow?.map((g, k) => (
        <circle key={k} cx={g.x} cy={g.y} r={g.r} fill={`url(#${id}-glow)`} opacity={g.o ?? 0.8} />
      ))}
      {c.masa && <path d={c.masa} fill={`url(#${id}-masa)`} />}
      <path d={c.rim} fill="none" stroke={rim} strokeWidth={ligera ? 7 : 12} opacity={ligera ? 0.28 : 0.7} filter={ligera ? undefined : `url(#${id}-blur)`} />
      <path d={c.rim} fill="none" stroke={rim} strokeWidth="2.2" strokeLinecap="round" />
      {!ligera && <path d={c.rim} fill="none" stroke="#F5F5F0" strokeWidth="1.4" strokeLinecap="round" pathLength={100} strokeDasharray="7 93" className="vd-spark" style={{ animationDelay: `${(c.chispa ?? i * 3.1).toFixed(1)}s` }} />}
    </g>
  );
}

const ESCENAS: Record<string, Capa[]> = {
  hero: [
    { rim: "M600 420C730 260 930 118 1090 116C1270 114 1450 222 1600 332", masa: "M600 420C730 260 930 118 1090 116C1270 114 1450 222 1600 332L1600 520C1380 380 1180 300 960 330C800 352 690 392 600 420Z", glow: [{ x: 1500, y: 250, r: 380 }], deriva: "a" },
    { rim: "M0 568C130 546 262 560 402 642C470 684 546 730 650 792", masa: "M0 568C130 546 262 560 402 642C470 684 546 730 650 792L650 900L0 900Z", glow: [{ x: 280, y: 900, r: 430 }, { x: 0, y: 560, r: 200, o: 0.45 }], plata: true, deriva: "b" },
    { rim: "M1600 560C1400 640 1150 760 880 900", masa: "M1600 560C1400 640 1150 760 880 900L1600 900Z", glow: [{ x: 1180, y: 840, r: 300 }], plata: true, deriva: "a", chispa: 5 },
  ],
  proyectos: [{ rim: "M0 18C300-14 560 72 800 62C1050 52 1300 0 1600 40", masa: "M0 18C300-14 560 72 800 62C1050 52 1300 0 1600 40L1600-20L0-20Z", glow: [{ x: 1180, y: -40, r: 340, o: 0.6 }], deriva: "a" }],
  agenda: [
    { rim: "M760 560C960 430 1240 340 1600 372", masa: "M760 560C960 430 1240 340 1600 372L1600 620C1300 560 1000 600 760 560Z", glow: [{ x: 1420, y: 420, r: 340 }], deriva: "a" },
    { rim: "M0 822C250 762 520 790 800 850C1050 900 1300 820 1600 758", masa: "M0 822C250 762 520 790 800 850C1050 900 1300 820 1600 758L1600 900L0 900Z", glow: [{ x: 200, y: 900, r: 360 }, { x: 1500, y: 800, r: 280 }], deriva: "b", chispa: 4 },
  ],
  about: [
    { rim: "M0 838C300 796 600 822 800 782C1010 740 1300 762 1600 830", masa: "M0 838C300 796 600 822 800 782C1010 740 1300 762 1600 830L1600 900L0 900Z", glow: [{ x: 240, y: 900, r: 380 }, { x: 1400, y: 860, r: 300, o: 0.6 }], deriva: "b" },
    { rim: "M0 240C240 170 380 140 540 60", glow: [{ x: 60, y: 260, r: 260, o: 0.35 }], deriva: "a", chispa: 7 },
  ],
  vendedores: [
    { rim: "M0 792C250 756 480 782 800 842C1100 892 1350 800 1600 842", masa: "M0 792C250 756 480 782 800 842C1100 892 1350 800 1600 842L1600 900L0 900Z", glow: [{ x: 1300, y: 900, r: 380 }, { x: 100, y: 820, r: 260, o: 0.5 }], plata: true, deriva: "a" },
    { rim: "M980 70C1140 30 1380 30 1600 96", glow: [{ x: 1480, y: 60, r: 320, o: 0.7 }], deriva: "b", chispa: 6 },
  ],
  final: [
    { rim: "M0 38C300 94 500 100 800 40C1000 0 1300 30 1600 62", masa: "M0 38C300 94 500 100 800 40C1000 0 1300 30 1600 62L1600-20L0-20Z", glow: [{ x: 120, y: 20, r: 320, o: 0.6 }], deriva: "a" },
    { rim: "M0 560C300 470 560 470 800 530C1050 592 1300 548 1600 420", masa: "M0 560C300 470 560 470 800 530C1050 592 1300 548 1600 420L1600 900L0 900Z", glow: [{ x: 60, y: 520, r: 360 }, { x: 1560, y: 430, r: 340 }], plata: true, deriva: "b", chispa: 3 },
  ],
};

/** `ligera`: una sola capa y sin filtros; para páginas con muchas escenas (el museo). */
export function HorizonScene({ variante, id, ligera = false }: { variante: keyof typeof ESCENAS; id: string; ligera?: boolean }) {
  return (
    <div className={`vd-horizon vd-horizon--${variante}`} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id={`${id}-rim`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#F5F5F0" stopOpacity="0" />
            <stop offset="0.35" stopColor="#F5F5F0" stopOpacity="0.9" />
            <stop offset="0.75" stopColor="#FFE600" />
            <stop offset="1" stopColor="#FFE600" />
          </linearGradient>
          <linearGradient id={`${id}-plata`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FFE600" />
            <stop offset="0.35" stopColor="#F5F5F0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#F5F5F0" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={`${id}-masa`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2b2b29" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0A0A0A" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#FFE600" stopOpacity="0.95" />
            <stop offset="0.42" stopColor="#FFE600" stopOpacity="0.3" />
            <stop offset="1" stopColor="#FFE600" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-blur`} x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>
        {(ligera ? ESCENAS[variante].slice(0, 1) : ESCENAS[variante]).map((c, i) => (
          <Capa key={i} id={id} c={c} i={i} ligera={ligera} />
        ))}
      </svg>
    </div>
  );
}
