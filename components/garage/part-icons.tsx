// White-line icons for the part tiles — same sketch style as the 3D car.
// All stroke currentColor so the tile controls the colour.

function Svg({ children, viewBox = "0 0 48 40" }: { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconEngineV6() {
  return (
    <Svg>
      <rect x={8} y={16} width={24} height={16} rx={2} />
      {[13, 19, 25].map((x) => (
        <path key={x} d={`M${x} 16 V9 M${x - 2.5} 9 h5`} />
      ))}
      <circle cx={38} cy={26} r={5} />
      <path d="M33 26 h-1" />
    </Svg>
  );
}

export function IconEngineV10() {
  return (
    <Svg>
      <rect x={4} y={16} width={34} height={16} rx={2} />
      {[9, 14, 19, 24, 29, 34].map((x) => (
        <path key={x} d={`M${x} 16 V10 M${x - 2} 10 h4`} />
      ))}
    </Svg>
  );
}

export function IconElectric() {
  return (
    <Svg>
      <circle cx={24} cy={20} r={13} />
      <path d="M26 11 L19 22 h5 l-2 8 8 -12 h-5 z" />
    </Svg>
  );
}

export function IconGear({ double = false }: { double?: boolean }) {
  const teeth = (cx: number, cy: number, r: number) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(a) * (r + 3.4);
      const y2 = cy + Math.sin(a) * (r + 3.4);
      return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
    });
  return double ? (
    <Svg>
      <circle cx={17} cy={18} r={8} />
      <circle cx={17} cy={18} r={3} />
      {teeth(17, 18, 8)}
      <circle cx={33} cy={26} r={6} />
      <circle cx={33} cy={26} r={2.2} />
      {teeth(33, 26, 6)}
    </Svg>
  ) : (
    <Svg>
      <circle cx={24} cy={20} r={9} />
      <circle cx={24} cy={20} r={3.4} />
      {teeth(24, 20, 9)}
    </Svg>
  );
}

export function IconDisc({ carbon = false }: { carbon?: boolean }) {
  return (
    <Svg>
      <circle cx={24} cy={20} r={12} />
      <circle cx={24} cy={20} r={4.5} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={(24 + Math.cos(a) * 8).toFixed(1)}
            cy={(20 + Math.sin(a) * 8).toFixed(1)}
            r={1.2}
          />
        );
      })}
      {carbon && <circle cx={24} cy={20} r={15.5} strokeDasharray="3 4" />}
    </Svg>
  );
}

export function IconTyre({ color }: { color: string }) {
  return (
    <Svg>
      <circle cx={24} cy={20} r={13} />
      <circle cx={24} cy={20} r={6} />
      <circle cx={24} cy={20} r={9.5} stroke={color} />
    </Svg>
  );
}

export function IconF1() {
  return (
    <Svg viewBox="0 0 64 28">
      {/* rear wing */}
      <path d="M4 6 v10 M2 6 h8 M2 10 h8" />
      {/* body */}
      <path d="M8 18 L16 18 L20 12 h12 l6 4 h16 l6 2 v2 H8 z" />
      {/* halo */}
      <path d="M24 12 q4 -5 9 0" />
      {/* front wing */}
      <path d="M56 22 h7" />
      <circle cx={17} cy={22} r={4} />
      <circle cx={46} cy={22} r={4} />
    </Svg>
  );
}

export function IconGT() {
  return (
    <Svg viewBox="0 0 64 28">
      <path d="M6 20 q0 -6 8 -7 l8 -6 q10 -3 18 2 l6 4 q12 1 14 5 v2 H6 z" />
      <path d="M24 7 l-2 6 h16 l-4 -7" />
      <circle cx={17} cy={22} r={4.5} />
      <circle cx={48} cy={22} r={4.5} />
    </Svg>
  );
}

export function IconKart() {
  return (
    <Svg viewBox="0 0 64 28">
      {/* frame */}
      <path d="M8 21 H56" />
      {/* seat */}
      <path d="M28 21 v-9 q6 -2 6 3 v6" />
      {/* steering */}
      <path d="M42 21 l4 -9 M42 12 h8" />
      <circle cx={16} cy={22} r={4} />
      <circle cx={48} cy={22} r={4} />
    </Svg>
  );
}
