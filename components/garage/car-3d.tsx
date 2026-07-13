"use client";

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Edges, OrbitControls } from "@react-three/drei";

import { TYRES, type CarConfig, type PartId } from "@/lib/garage";

const SKETCH = "#dbe7ff"; // blueprint white
const HOT = "#fdba74"; // hovered part lines
const CARBON = "#3f3f46";
const TYRE = "#1c1c20";

// ---------------------------------------------------------------- hover ----

interface HoverCtx {
  hovered: PartId | null;
  setHovered: Dispatch<SetStateAction<PartId | null>>;
}
const HoverContext = createContext<HoverCtx>({ hovered: null, setHovered: () => {} });

// Wraps a group of meshes as one named, hoverable car part.
function Part({ id, children }: { id: PartId; children: React.ReactNode }) {
  const { setHovered } = useContext(HoverContext);
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered((p) => (p === id ? null : p));
      }}
    >
      {children}
    </group>
  );
}

// Every piece of the car goes through this: white line sketch in blueprint
// mode, solid material in painted mode. Hovered parts glow orange.
function SMesh({
  id,
  xray,
  color,
  position,
  rotation,
  metalness = 0.4,
  roughness = 0.4,
  noRay = false,
  children,
}: {
  id: PartId;
  xray: boolean;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  metalness?: number;
  roughness?: number;
  noRay?: boolean;
  children: React.ReactNode;
}) {
  const { hovered } = useContext(HoverContext);
  const glow = hovered === id;
  return (
    <mesh position={position} rotation={rotation} raycast={noRay ? () => null : undefined}>
      {children}
      {xray ? (
        <meshBasicMaterial color="#3b5b8c" transparent opacity={0.06} depthWrite={false} />
      ) : (
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          emissive={glow ? "#f97316" : "#000000"}
          emissiveIntensity={glow ? 0.8 : 0}
        />
      )}
      {xray && <Edges color={glow ? HOT : SKETCH} threshold={15} />}
    </mesh>
  );
}

// ---------------------------------------------------------------- wheels ---

function Wheel({
  position,
  radius,
  width,
  tyreColor,
  brakeColor,
  xray,
}: {
  position: [number, number, number];
  radius: number;
  width: number;
  tyreColor: string;
  brakeColor: string;
  xray: boolean;
}) {
  const side = position[0] > 0 ? 1 : -1;
  return (
    <group position={position}>
      <Part id="wheels">
        <SMesh id="wheels" xray={xray} color={TYRE} roughness={0.85} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius, radius, width, 28]} />
        </SMesh>
        {/* compound stripe keeps its real colour — that's how you read tyres */}
        <mesh position={[side * (width / 2 + 0.002), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius * 0.8, 0.016, 8, 36]} />
          <meshBasicMaterial color={tyreColor} />
        </mesh>
      </Part>
      <Part id="brakes">
        <SMesh id="brakes" xray={xray} color={brakeColor} metalness={0.7} roughness={0.35} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.52, radius * 0.52, width + 0.02, 24]} />
        </SMesh>
      </Part>
    </group>
  );
}

// ------------------------------------------------------------ powertrain ---

function Powertrain({
  config,
  enginePos,
  gearboxPos,
  fuelPos,
  exhaustPos,
  batteryPos,
}: {
  config: CarConfig;
  enginePos: [number, number, number];
  gearboxPos: [number, number, number];
  fuelPos: [number, number, number];
  exhaustPos: [number, number, number];
  batteryPos: [number, number, number];
}) {
  const xray = config.xray;
  const electric = config.engine === "electric";
  const engineColor =
    config.engine === "v10" ? "#b91c1c" : config.engine === "v6hybrid" ? "#cbd5e1" : "#22d3ee";
  const engineLen = config.engine === "v10" ? 0.85 : 0.62;

  return (
    <group>
      <Part id="engine">
        {electric ? (
          <SMesh id="engine" xray={xray} color={engineColor} metalness={0.6} roughness={0.25} position={enginePos} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.5, 20]} />
          </SMesh>
        ) : (
          <SMesh id="engine" xray={xray} color={engineColor} metalness={0.6} roughness={0.3} position={enginePos}>
            <boxGeometry args={[0.5, 0.4, engineLen]} />
          </SMesh>
        )}
      </Part>

      {config.engine === "v6hybrid" && (
        <Part id="turbo">
          <SMesh
            id="turbo"
            xray={xray}
            color="#f97316"
            metalness={0.5}
            position={[enginePos[0], enginePos[1] + 0.06, enginePos[2] - engineLen / 2 - 0.12]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
          </SMesh>
        </Part>
      )}

      {(electric || config.engine === "v6hybrid") && (
        <Part id="battery">
          <SMesh id="battery" xray={xray} color="#0891b2" position={batteryPos}>
            <boxGeometry args={electric ? [0.6, 0.16, 1.0] : [0.4, 0.13, 0.35]} />
          </SMesh>
        </Part>
      )}

      {!electric && (
        <Part id="fuel">
          <SMesh id="fuel" xray={xray} color="#a16207" roughness={0.7} metalness={0.1} position={fuelPos}>
            <boxGeometry args={[0.44, 0.32, 0.4]} />
          </SMesh>
        </Part>
      )}

      <Part id="gearbox">
        <SMesh
          id="gearbox"
          xray={xray}
          color={config.gearbox === "seamless" ? "#eab308" : "#6b7280"}
          metalness={0.65}
          roughness={0.3}
          position={gearboxPos}
        >
          <boxGeometry args={[0.3, 0.28, 0.48]} />
        </SMesh>
      </Part>

      {!electric && (
        <Part id="exhaust">
          <SMesh id="exhaust" xray={xray} color="#71717a" metalness={0.8} roughness={0.25} position={exhaustPos} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.7, 12]} />
          </SMesh>
        </Part>
      )}
    </group>
  );
}

// -------------------------------------------------------------- F1 model ---

function F1Model({ config }: { config: CarConfig }) {
  const tyreColor = TYRES[config.tyres].color;
  const brakeColor = config.brakes === "carbon" ? "#3b3b40" : "#9ca3af";
  const xray = config.xray;

  return (
    <group>
      {/* floor */}
      <Part id="chassis">
        <SMesh id="chassis" xray={xray} color={CARBON} roughness={0.6} position={[0, 0.07, 0.1]}>
          <boxGeometry args={[1.5, 0.05, 3.4]} />
        </SMesh>
      </Part>

      {/* bodywork */}
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0, 0.38, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.21, 1.2, 16]} />
      </SMesh>
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0, 0.42, 1.0]}>
        <boxGeometry args={[0.62, 0.42, 1.7]} />
      </SMesh>
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0, 0.5, -0.75]}>
        <boxGeometry args={[0.5, 0.44, 1.5]} />
      </SMesh>
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[-0.62, 0.28, -0.1]}>
        <boxGeometry args={[0.45, 0.32, 1.5]} />
      </SMesh>
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0.62, 0.28, -0.1]}>
        <boxGeometry args={[0.45, 0.32, 1.5]} />
      </SMesh>

      {/* wings */}
      <Part id="frontwing">
        <SMesh id="frontwing" xray={xray} color={CARBON} position={[0, 0.14, 2.95]}>
          <boxGeometry args={[1.85, 0.04, 0.45]} />
        </SMesh>
        <SMesh id="frontwing" xray={xray} color={CARBON} position={[-0.92, 0.26, 2.95]}>
          <boxGeometry args={[0.03, 0.22, 0.45]} />
        </SMesh>
        <SMesh id="frontwing" xray={xray} color={CARBON} position={[0.92, 0.26, 2.95]}>
          <boxGeometry args={[0.03, 0.22, 0.45]} />
        </SMesh>
      </Part>
      <Part id="rearwing">
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0, 0.88, -2.25]}>
          <boxGeometry args={[1.45, 0.04, 0.38]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0, 0.7, -2.3]}>
          <boxGeometry args={[1.45, 0.03, 0.3]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[-0.74, 0.74, -2.25]}>
          <boxGeometry args={[0.03, 0.42, 0.5]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0.74, 0.74, -2.25]}>
          <boxGeometry args={[0.03, 0.42, 0.5]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0, 0.55, -2.15]}>
          <boxGeometry args={[0.07, 0.45, 0.07]} />
        </SMesh>
      </Part>

      {/* halo + driver */}
      <Part id="halo">
        <SMesh id="halo" xray={xray} color="#52525b" metalness={0.8} roughness={0.3} position={[0, 0.74, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.31, 0.035, 10, 28]} />
        </SMesh>
        <SMesh id="halo" xray={xray} color="#52525b" metalness={0.8} position={[0, 0.62, 1.28]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 10]} />
        </SMesh>
      </Part>
      <Part id="seat">
        <SMesh id="seat" xray={xray} color="#facc15" roughness={0.35} position={[0, 0.62, 0.85]}>
          <sphereGeometry args={[0.14, 20, 20]} />
        </SMesh>
        <SMesh id="seat" xray={xray} color="#27272a" roughness={0.8} position={[0, 0.42, 0.95]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.55]} />
        </SMesh>
      </Part>

      {/* internals */}
      <Powertrain
        config={config}
        enginePos={[0, 0.45, -0.65]}
        gearboxPos={[0, 0.4, -1.4]}
        fuelPos={[0, 0.4, 0.1]}
        exhaustPos={[0.13, 0.5, -1.75]}
        batteryPos={config.engine === "electric" ? [0, 0.18, 0.2] : [0, 0.16, -0.2]}
      />
      <Part id="radiator">
        <SMesh id="radiator" xray={xray} color="#b45309" metalness={0.6} position={[-0.62, 0.28, -0.1]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.05, 0.24, 1.15]} />
        </SMesh>
        <SMesh id="radiator" xray={xray} color="#b45309" metalness={0.6} position={[0.62, 0.28, -0.1]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.05, 0.24, 1.15]} />
        </SMesh>
      </Part>
      <Part id="suspension">
        {([
          [-0.45, 0.34, 1.55],
          [0.45, 0.34, 1.55],
          [-0.45, 0.36, -1.45],
          [0.45, 0.36, -1.45],
        ] as [number, number, number][]).map((p, i) => (
          <SMesh key={i} id="suspension" xray={xray} color="#71717a" metalness={0.7} position={p} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.68, 8]} />
          </SMesh>
        ))}
      </Part>

      <Wheel position={[-0.8, 0.34, 1.55]} radius={0.34} width={0.3} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.8, 0.34, 1.55]} radius={0.34} width={0.3} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[-0.8, 0.36, -1.45]} radius={0.36} width={0.36} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.8, 0.36, -1.45]} radius={0.36} width={0.36} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
    </group>
  );
}

// -------------------------------------------------------------- GT model ---

function GTModel({ config }: { config: CarConfig }) {
  const tyreColor = TYRES[config.tyres].color;
  const brakeColor = config.brakes === "carbon" ? "#3b3b40" : "#9ca3af";
  const xray = config.xray;
  const electric = config.engine === "electric";

  return (
    <group>
      <Part id="chassis">
        <SMesh id="chassis" xray={xray} color={CARBON} roughness={0.6} position={[0, 0.09, 0]}>
          <boxGeometry args={[1.7, 0.06, 4.2]} />
        </SMesh>
      </Part>

      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0, 0.46, 0]}>
        <boxGeometry args={[1.7, 0.44, 4.2]} />
      </SMesh>
      <SMesh id="chassis" xray={xray} noRay={xray} color={config.body} position={[0, 0.88, -0.35]}>
        <boxGeometry args={[1.42, 0.42, 1.7]} />
      </SMesh>

      <Part id="rearwing">
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0, 0.78, -2.0]}>
          <boxGeometry args={[1.25, 0.03, 0.28]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[-0.5, 0.7, -2.0]}>
          <boxGeometry args={[0.03, 0.14, 0.2]} />
        </SMesh>
        <SMesh id="rearwing" xray={xray} color={CARBON} position={[0.5, 0.7, -2.0]}>
          <boxGeometry args={[0.03, 0.14, 0.2]} />
        </SMesh>
      </Part>

      <Powertrain
        config={config}
        enginePos={electric ? [0, 0.42, -1.35] : [0, 0.48, 1.35]}
        gearboxPos={[0, 0.36, 0.7]}
        fuelPos={[0, 0.32, -1.5]}
        exhaustPos={[0.4, 0.2, -1.6]}
        batteryPos={electric ? [0, 0.2, 0] : [0.5, 0.4, 1.05]}
      />
      <Part id="radiator">
        <SMesh id="radiator" xray={xray} color="#b45309" metalness={0.6} position={[0, 0.42, 1.95]}>
          <boxGeometry args={[0.75, 0.3, 0.06]} />
        </SMesh>
      </Part>
      {!electric && (
        <Part id="driveshaft">
          <SMesh id="driveshaft" xray={xray} color="#a1a1aa" metalness={0.75} position={[0, 0.3, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.9, 10]} />
          </SMesh>
        </Part>
      )}
      <Part id="seat">
        <SMesh id="seat" xray={xray} color="#27272a" roughness={0.8} position={[-0.36, 0.56, -0.3]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.36, 0.42, 0.45]} />
        </SMesh>
        <SMesh id="seat" xray={xray} color="#27272a" roughness={0.8} position={[0.36, 0.56, -0.3]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.36, 0.42, 0.45]} />
        </SMesh>
      </Part>
      <Part id="suspension">
        <SMesh id="suspension" xray={xray} color="#71717a" metalness={0.7} position={[0, 0.34, 1.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 1.45, 8]} />
        </SMesh>
        <SMesh id="suspension" xray={xray} color="#71717a" metalness={0.7} position={[0, 0.34, -1.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 1.45, 8]} />
        </SMesh>
      </Part>

      <Wheel position={[-0.82, 0.34, 1.4]} radius={0.34} width={0.26} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.82, 0.34, 1.4]} radius={0.34} width={0.26} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[-0.82, 0.34, -1.4]} radius={0.34} width={0.26} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.82, 0.34, -1.4]} radius={0.34} width={0.26} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
    </group>
  );
}

// ------------------------------------------------------------- Kart model --

function KartModel({ config }: { config: CarConfig }) {
  const tyreColor = TYRES[config.tyres].color;
  const brakeColor = config.brakes === "carbon" ? "#3b3b40" : "#9ca3af";
  const electric = config.engine === "electric";
  const xray = config.xray;

  return (
    <group scale={1.7}>
      <Part id="frame">
        <SMesh id="frame" xray={xray} color={config.body} roughness={0.5} position={[0, 0.12, 0.15]}>
          <boxGeometry args={[0.66, 0.03, 1.0]} />
        </SMesh>
        {([
          { p: [-0.34, 0.14, 0] as [number, number, number], r: [Math.PI / 2, 0, 0] as [number, number, number], l: 1.6 },
          { p: [0.34, 0.14, 0] as [number, number, number], r: [Math.PI / 2, 0, 0] as [number, number, number], l: 1.6 },
          { p: [0, 0.14, 0.9] as [number, number, number], r: [0, 0, Math.PI / 2] as [number, number, number], l: 0.72 },
          { p: [0, 0.14, -0.8] as [number, number, number], r: [0, 0, Math.PI / 2] as [number, number, number], l: 0.84 },
        ]).map((t, i) => (
          <SMesh key={i} id="frame" xray={xray} color={config.body} roughness={0.45} metalness={0.5} position={t.p} rotation={t.r}>
            <cylinderGeometry args={[0.026, 0.026, t.l, 10]} />
          </SMesh>
        ))}
      </Part>

      <Part id="seat">
        <SMesh id="seat" xray={xray} color="#27272a" roughness={0.8} position={[0, 0.32, -0.2]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.36, 0.4, 0.34]} />
        </SMesh>
      </Part>

      <group position={[0.42, 0.15, -0.2]} scale={0.55}>
        <Powertrain
          config={config}
          enginePos={[0, 0.25, 0]}
          gearboxPos={[0, 0.2, -0.55]}
          fuelPos={[-1.5, 0.25, 0.9]}
          exhaustPos={[0.15, 0.2, -1.0]}
          batteryPos={electric ? [-1.5, 0.2, 0.2] : [-0.6, 0.15, 0.5]}
        />
      </group>

      <Part id="steering">
        <SMesh id="steering" xray={xray} color="#52525b" metalness={0.7} position={[0, 0.32, 0.42]} rotation={[-0.9, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
        </SMesh>
        <SMesh id="steering" xray={xray} color="#18181b" roughness={0.6} position={[0, 0.47, 0.32]} rotation={[Math.PI / 2 - 0.9, 0, 0]}>
          <torusGeometry args={[0.12, 0.022, 8, 24]} />
        </SMesh>
      </Part>

      <Part id="driveshaft">
        <SMesh id="driveshaft" xray={xray} color="#a1a1aa" metalness={0.75} position={[0, 0.15, -0.62]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 1.0, 10]} />
        </SMesh>
      </Part>

      <Wheel position={[-0.44, 0.15, 0.62]} radius={0.15} width={0.14} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.44, 0.15, 0.62]} radius={0.15} width={0.14} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[-0.5, 0.17, -0.62]} radius={0.17} width={0.18} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
      <Wheel position={[0.5, 0.17, -0.62]} radius={0.17} width={0.18} tyreColor={tyreColor} brakeColor={brakeColor} xray={xray} />
    </group>
  );
}

// ----------------------------------------------------------------- scene ---

export function Car3D({
  config,
  onHover,
}: {
  config: CarConfig;
  onHover?: (id: PartId | null) => void;
}) {
  const [hovered, setHovered] = useState<PartId | null>(null);

  useEffect(() => {
    onHover?.(hovered);
  }, [hovered, onHover]);

  return (
    <div
      className="h-full w-full"
      style={{
        cursor: hovered ? "pointer" : "grab",
        background: "radial-gradient(ellipse at 50% 35%, #14213a 0%, #0a111f 75%)",
      }}
    >
      <Canvas camera={{ position: [4.2, 2.4, 4.8], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 3]} intensity={1.3} />
        <directionalLight position={[-5, 4, -5]} intensity={0.45} />
        <HoverContext.Provider value={{ hovered, setHovered }}>
          {config.template === "f1" && <F1Model config={config} />}
          {config.template === "gt" && <GTModel config={config} />}
          {config.template === "kart" && <KartModel config={config} />}
        </HoverContext.Provider>
        {/* blueprint grid floor */}
        <gridHelper args={[26, 52, "#2b4a76", "#16283f"]} position={[0, -0.005, 0]} />
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={11} blur={2.2} far={3} />
        <OrbitControls
          makeDefault
          autoRotate={hovered === null}
          autoRotateSpeed={1.1}
          enablePan={false}
          minDistance={2.5}
          maxDistance={9}
          target={[0, 0.4, 0]}
        />
      </Canvas>
    </div>
  );
}
