// The Garage: build-your-own car in 3D. Types, part catalogues, the
// educational part encyclopedia and localStorage persistence.

export type Template = "f1" | "gt" | "kart";
export type EngineType = "v6hybrid" | "v10" | "electric";
export type GearboxType = "standard" | "seamless";
export type BrakeType = "steel" | "carbon";
export type TyreCompound = "soft" | "medium" | "hard" | "inter" | "wet";

export interface CarConfig {
  name: string;
  template: Template;
  engine: EngineType;
  gearbox: GearboxType;
  brakes: BrakeType;
  tyres: TyreCompound;
  body: string; // paint colour
  xray: boolean; // transparent body so the internals show
}

export interface SavedCar {
  id: string;
  config: CarConfig;
}

export const TEMPLATES: { id: Template; label: string; emoji: string; desc: string }[] = [
  { id: "f1", label: "F1 Car", emoji: "🏎️", desc: "A modern Formula 1 single-seater — wings, halo and all." },
  { id: "gt", label: "Sports Car", emoji: "🚗", desc: "A two-seat road-going sports car with the engine up front." },
  { id: "kart", label: "Go-Kart", emoji: "🛞", desc: "Where every F1 champion started — a bare frame, an engine and a seat." },
];

export const ENGINES: { id: EngineType; label: string; desc: string }[] = [
  { id: "v6hybrid", label: "V6 Turbo Hybrid", desc: "What today's F1 uses: a small 1.6L turbo engine plus electric motors — about 1,000 hp combined." },
  { id: "v10", label: "V10 Screamer", desc: "The legendary 3.0L engines of the 2000s — 19,000 rpm and a sound fans still miss." },
  { id: "electric", label: "Electric", desc: "No fuel, no exhaust — a big battery and instant torque from a standstill." },
];

export const GEARBOXES: { id: GearboxType; label: string; desc: string }[] = [
  { id: "standard", label: "Standard", desc: "A regular sequential gearbox — reliable and simple." },
  { id: "seamless", label: "Seamless Shift", desc: "F1-spec: swaps gears in a few milliseconds with no interruption in power." },
];

export const BRAKES: { id: BrakeType; label: string; desc: string }[] = [
  { id: "steel", label: "Steel Discs", desc: "Road-car brakes — heavy but cheap and predictable." },
  { id: "carbon", label: "Carbon Discs", desc: "F1 brakes glow orange at over 1,000°C and stop the car from 300 km/h in about 4 seconds." },
];

export const TYRES: Record<TyreCompound, { label: string; color: string; desc: string }> = {
  soft: { label: "Soft", color: "#ef4444", desc: "Fastest rubber, melts quickly." },
  medium: { label: "Medium", color: "#facc15", desc: "The balanced all-rounder." },
  hard: { label: "Hard", color: "#e4e4e7", desc: "Slow but runs forever." },
  inter: { label: "Inters", color: "#22c55e", desc: "For a damp track." },
  wet: { label: "Full Wet", color: "#3b82f6", desc: "Monsoon spec." },
};

export const PAINTS = [
  "#e10600", "#ff8000", "#c8c8d0", "#1e41ff", "#00a19c",
  "#16a34a", "#18181b", "#f4f4f5", "#ec4899", "#7c3aed",
];

export const DEFAULT_CAR: CarConfig = {
  name: "My BOXBOX Special",
  template: "f1",
  engine: "v6hybrid",
  gearbox: "seamless",
  brakes: "carbon",
  tyres: "medium",
  body: "#e10600",
  xray: true,
};

// ----- The part encyclopedia (shown when you hover parts in 3D) -----------

export type PartId =
  | "chassis" | "engine" | "turbo" | "battery" | "gearbox" | "fuel"
  | "radiator" | "exhaust" | "brakes" | "suspension" | "halo" | "seat"
  | "wheels" | "frontwing" | "rearwing" | "frame" | "driveshaft" | "steering";

export const PART_INFO: Record<PartId, { name: string; desc: string }> = {
  chassis: { name: "Chassis / Monocoque", desc: "The car's skeleton — in F1 it's a carbon-fibre survival cell strong enough to protect the driver in a 300 km/h crash." },
  engine: { name: "Engine", desc: "The heart of the car. It burns fuel (or drains a battery) to spin the rear wheels — F1 power units make around 1,000 horsepower." },
  turbo: { name: "Turbocharger", desc: "Uses hot exhaust gas to spin a turbine at ~100,000 rpm, ramming extra air into the engine for more power from less fuel." },
  battery: { name: "Battery / ERS", desc: "Stores electrical energy. In hybrid F1 cars it's charged by braking and gives a ~160 hp boost each lap." },
  gearbox: { name: "Gearbox", desc: "Sits behind the engine and turns its screaming rpm into usable wheel speed — F1 boxes shift 8 gears in milliseconds." },
  fuel: { name: "Fuel Cell", desc: "A puncture-proof rubber bag holding up to ~110 kg of fuel, placed right behind the driver for safety and balance." },
  radiator: { name: "Radiators", desc: "Hidden inside the sidepods, they cool the engine — that's what the big openings on the car's flanks are for." },
  exhaust: { name: "Exhaust", desc: "Carries hot gases out of the engine. That's where the sound comes from." },
  brakes: { name: "Brake Discs", desc: "F1 carbon discs glow orange at 1,000°C and pull nearly 6g — the hardest braking of any race car." },
  suspension: { name: "Suspension", desc: "The arms connecting wheels to chassis. They absorb bumps and keep the tyres pressed onto the track." },
  halo: { name: "Halo", desc: "The titanium hoop above the cockpit — it can hold the weight of a double-decker bus and has already saved lives." },
  seat: { name: "Driver's Seat", desc: "Moulded to each driver's exact body shape. Drivers lie almost flat, feet up at the front axle." },
  wheels: { name: "Wheels & Tyres", desc: "The only parts touching the road. The stripe colour shows the compound — red soft, yellow medium, white hard." },
  frontwing: { name: "Front Wing", desc: "The first thing to meet the air — it generates downforce and steers airflow around the whole car." },
  rearwing: { name: "Rear Wing", desc: "Creates huge downforce at the back. Its flap opens on straights (DRS) to cut drag for overtaking." },
  frame: { name: "Tube Frame", desc: "A go-kart has no bodywork at all — just welded steel tubes. It flexes on purpose, because karts have no suspension." },
  driveshaft: { name: "Driveshaft", desc: "The spinning shaft that carries power from the gearbox to the wheels." },
  steering: { name: "Steering", desc: "Direct and unassisted in a kart — you feel every stone. F1 wheels carry ~25 buttons and cost six figures." },
};

// ----- Fun performance stats ----------------------------------------------

export function carStats(c: CarConfig): { power: number; speed: number; braking: number; grip: number } {
  let power = 0, speed = 0;
  if (c.engine === "v6hybrid") { power = 92; speed = 88; }
  if (c.engine === "v10") { power = 96; speed = 92; }
  if (c.engine === "electric") { power = 86; speed = 78; }

  if (c.template === "f1") speed += 8;
  if (c.template === "gt") speed -= 6;
  if (c.template === "kart") { speed -= 42; power -= 30; }

  if (c.gearbox === "seamless") speed += 4;

  let braking = c.brakes === "carbon" ? 94 : 68;
  if (c.template === "kart") braking -= 20;

  let grip = 60;
  if (c.tyres === "soft") grip = 92;
  if (c.tyres === "medium") grip = 78;
  if (c.tyres === "hard") grip = 64;
  if (c.tyres === "inter") grip = 55;
  if (c.tyres === "wet") grip = 48;
  if (c.template === "f1") grip += 8;

  const clamp = (n: number) => Math.max(5, Math.min(100, n));
  return { power: clamp(power), speed: clamp(speed), braking: clamp(braking), grip: clamp(grip) };
}

// ----- Persistence ---------------------------------------------------------

export const GARAGE_KEY = "boxbox-garage";
export const GARAGE_EVENT = "boxbox-garage-changed";

export function readGarage(): SavedCar[] {
  try {
    const list = JSON.parse(localStorage.getItem(GARAGE_KEY) ?? "[]");
    if (!Array.isArray(list)) return [];
    // Merge over defaults so builds saved by older versions still load.
    return list
      .filter((c) => c && c.id && c.config)
      .map((c) => ({ id: c.id, config: { ...DEFAULT_CAR, ...c.config } }));
  } catch {
    return [];
  }
}

export function saveCar(config: CarConfig): SavedCar[] {
  const car: SavedCar = { id: `car-${Date.now()}`, config };
  const next = [car, ...readGarage()].slice(0, 12);
  localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(GARAGE_EVENT));
  return next;
}

export function deleteCar(id: string): SavedCar[] {
  const next = readGarage().filter((c) => c.id !== id);
  localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(GARAGE_EVENT));
  return next;
}
