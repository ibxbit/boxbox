"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Check, RotateCcw, Save, Trash2 } from "lucide-react";

import {
  IconDisc,
  IconElectric,
  IconEngineV10,
  IconEngineV6,
  IconF1,
  IconGear,
  IconGT,
  IconKart,
  IconTyre,
} from "@/components/garage/part-icons";
import { InfoTip } from "@/components/info-tip";
import { Button } from "@/components/ui/button";
import { bumpStreak } from "@/lib/gamification";
import {
  BRAKES,
  carStats,
  DEFAULT_CAR,
  deleteCar,
  ENGINES,
  GEARBOXES,
  PAINTS,
  PART_INFO,
  readGarage,
  saveCar,
  TEMPLATES,
  TYRES,
  type CarConfig,
  type PartId,
  type SavedCar,
  type TyreCompound,
} from "@/lib/garage";

// three.js needs the browser — load the canvas client-side only.
const Car3D = dynamic(() => import("./car-3d").then((m) => m.Car3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      Rolling the car out of the truck…
    </div>
  ),
});

const DND_TYPE = "application/x-boxbox-part";

const ENGINE_ICONS = {
  v6hybrid: <IconEngineV6 />,
  v10: <IconEngineV10 />,
  electric: <IconElectric />,
};
const TEMPLATE_ICONS = { f1: <IconF1 />, gt: <IconGT />, kart: <IconKart /> };

export function CarBuilder() {
  const [config, setConfig] = useState<CarConfig>(DEFAULT_CAR);
  const [garage, setGarage] = useState<SavedCar[]>([]);
  const [hovered, setHovered] = useState<PartId | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setGarage(readGarage());
  }, []);

  function set<K extends keyof CarConfig>(key: K, value: CarConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  function handleSave() {
    setGarage(saveCar(config));
    bumpStreak();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    try {
      const { key, value } = JSON.parse(e.dataTransfer.getData(DND_TYPE));
      if (["template", "engine", "gearbox", "brakes", "tyres", "body"].includes(key)) {
        set(key as keyof CarConfig, value);
      }
    } catch {
      // not one of our tiles
    }
  }

  const stats = carStats(config);
  const info = hovered ? PART_INFO[hovered] : null;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_280px]">
        {/* ---- LEFT: mechanical parts ---- */}
        <div className="flex flex-col gap-4 lg:order-1">
          <Panel title="Engine" tip={PART_INFO.engine.desc}>
            <div className="grid grid-cols-3 gap-2">
              {ENGINES.map((o) => (
                <PartTile
                  key={o.id}
                  label={o.label}
                  icon={ENGINE_ICONS[o.id]}
                  selected={config.engine === o.id}
                  onClick={() => set("engine", o.id)}
                  payload={{ key: "engine", value: o.id }}
                  desc={o.desc}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {ENGINES.find((o) => o.id === config.engine)?.desc}
            </p>
          </Panel>

          <Panel title="Gearbox" tip={PART_INFO.gearbox.desc}>
            <div className="grid grid-cols-2 gap-2">
              {GEARBOXES.map((o) => (
                <PartTile
                  key={o.id}
                  label={o.label}
                  icon={<IconGear double={o.id === "seamless"} />}
                  selected={config.gearbox === o.id}
                  onClick={() => set("gearbox", o.id)}
                  payload={{ key: "gearbox", value: o.id }}
                  desc={o.desc}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {GEARBOXES.find((o) => o.id === config.gearbox)?.desc}
            </p>
          </Panel>

          <Panel title="Brakes" tip={PART_INFO.brakes.desc}>
            <div className="grid grid-cols-2 gap-2">
              {BRAKES.map((o) => (
                <PartTile
                  key={o.id}
                  label={o.label}
                  icon={<IconDisc carbon={o.id === "carbon"} />}
                  selected={config.brakes === o.id}
                  onClick={() => set("brakes", o.id)}
                  payload={{ key: "brakes", value: o.id }}
                  desc={o.desc}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {BRAKES.find((o) => o.id === config.brakes)?.desc}
            </p>
          </Panel>
        </div>

        {/* ---- CENTER: the 3D car (drop parts here) ---- */}
        <div className="order-first flex flex-col gap-4 lg:order-2">
          <div
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes(DND_TYPE)) {
                e.preventDefault();
                setDragOver(true);
              }
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-2xl bg-[#0a111f] ring-1 transition-all ${
              dragOver ? "ring-2 ring-orange-400" : "ring-border/50"
            }`}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-baseline justify-between gap-2 px-4 pt-3 md:px-6">
              <h2 className="truncate text-lg font-black uppercase tracking-tight text-white md:text-xl">
                {config.name || "Unnamed Car"}
              </h2>
              <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-slate-400">
                {TEMPLATES.find((t) => t.id === config.template)?.label}
              </span>
            </div>
            <div className="h-[400px] md:h-[500px]">
              <Car3D config={config} onHover={setHovered} />
            </div>
            {dragOver && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-orange-400/10">
                <span className="rounded-full bg-slate-950/80 px-4 py-2 text-sm font-bold text-orange-300">
                  Release to install the part 🔧
                </span>
              </div>
            )}
            {/* part encyclopedia overlay */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur md:inset-x-5 md:bottom-4">
              {info ? (
                <>
                  <div className="text-sm font-bold text-white">{info.name}</div>
                  <p className="mt-0.5 text-xs leading-snug text-slate-400">{info.desc}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  🖱️ Drag to spin · scroll to zoom ·{" "}
                  <span className="font-semibold text-slate-100">
                    hover any part to learn what it does
                  </span>{" "}
                  · drag a tile from the sides onto the car to install it
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <StatBar label="Power" value={stats.power} />
            <StatBar label="Top Speed" value={stats.speed} />
            <StatBar label="Braking" value={stats.braking} />
            <StatBar label="Grip" value={stats.grip} />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleSave}>
              {justSaved ? (
                <>
                  <Check className="size-4" /> Saved to your garage!
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save this build
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setConfig(DEFAULT_CAR)} title="Start over">
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>

        {/* ---- RIGHT: template & style ---- */}
        <div className="flex flex-col gap-4 lg:order-3">
          <Panel title="Template" tip="Pick what kind of machine to build — each one has a different layout of parts inside.">
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <PartTile
                  key={t.id}
                  label={t.label}
                  icon={TEMPLATE_ICONS[t.id]}
                  selected={config.template === t.id}
                  onClick={() => set("template", t.id)}
                  payload={{ key: "template", value: t.id }}
                  desc={t.desc}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {TEMPLATES.find((t) => t.id === config.template)?.desc}
            </p>
          </Panel>

          <Panel title="Tyres" tip={PART_INFO.wheels.desc}>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(TYRES) as TyreCompound[]).map((t) => (
                <PartTile
                  key={t}
                  label={TYRES[t].label}
                  icon={<IconTyre color={TYRES[t].color} />}
                  selected={config.tyres === t}
                  onClick={() => set("tyres", t)}
                  payload={{ key: "tyres", value: t }}
                  desc={TYRES[t].desc}
                  compact
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{TYRES[config.tyres].desc}</p>
          </Panel>

          <Panel title="Body" tip={PART_INFO.chassis.desc}>
            <div className="flex flex-wrap gap-2">
              <Chip selected={config.xray} onClick={() => set("xray", true)}>
                📐 Blueprint
              </Chip>
              <Chip selected={!config.xray} onClick={() => set("xray", false)}>
                🎨 Painted
              </Chip>
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Paint {config.xray && <span className="normal-case tracking-normal">(shown in Painted mode)</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {PAINTS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("body", c)}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData(DND_TYPE, JSON.stringify({ key: "body", value: c }))
                  }
                  aria-label={`Paint ${c}`}
                  style={{ backgroundColor: c }}
                  className={`size-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-110 ${
                    config.body === c ? "ring-foreground" : "ring-border/50"
                  }`}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Name" tip="Every great car deserves a name — teams name their chassis every year (MP4/4, F2004, RB19…).">
            <input
              type="text"
              maxLength={24}
              value={config.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Name your machine…"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-semibold outline-none transition-colors focus:border-ring"
            />
          </Panel>
        </div>
      </div>

      {/* ---- Saved builds ---- */}
      {garage.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
            Your Builds{" "}
            <span className="text-sm font-medium normal-case tracking-normal text-muted-foreground">
              {garage.length} / 12 garage slots
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {garage.map((car) => {
              const engine = ENGINES.find((x) => x.id === car.config.engine);
              return (
                <div
                  key={car.id}
                  className="group flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-border/50 transition-all hover:ring-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-[#0a111f] p-1.5 text-slate-200 ring-1 ring-border/50">
                      {TEMPLATE_ICONS[car.config.template] ?? <IconF1 />}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold">{car.config.name || "Unnamed"}</div>
                      <div className="truncate text-[10px] text-muted-foreground">
                        {engine?.label ?? "V6 Turbo Hybrid"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="secondary" size="sm" className="h-7 flex-1 text-xs" onClick={() => setConfig(car.config)}>
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      title="Scrap this build"
                      onClick={() => setGarage(deleteCar(car.id))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Panel({ title, tip, children }: { title: string; tip: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-border/50">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
        <InfoTip className="ml-1.5" text={tip} />
      </h3>
      {children}
    </div>
  );
}

// A draggable part tile drawn in the same white-line style as the car.
// Click to install, or drag it onto the car.
function PartTile({
  label,
  icon,
  selected,
  onClick,
  payload,
  desc,
  compact = false,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  payload: { key: string; value: string };
  desc: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      draggable
      onDragStart={(e) => e.dataTransfer.setData(DND_TYPE, JSON.stringify(payload))}
      title={desc}
      className={`flex cursor-grab flex-col items-center gap-1.5 rounded-xl bg-[#0a111f] p-2.5 ring-1 transition-all active:cursor-grabbing ${
        selected
          ? "text-orange-300 ring-2 ring-orange-400"
          : "text-slate-300 ring-border/50 hover:text-slate-100 hover:ring-slate-500"
      }`}
    >
      <span className={compact ? "h-8 w-8" : "h-10 w-full max-w-14"}>{icon}</span>
      <span className="text-center text-[10px] font-bold leading-tight">{label}</span>
    </button>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition-all ${
        selected
          ? "bg-foreground text-background ring-foreground"
          : "bg-card text-muted-foreground ring-border/50 hover:text-foreground hover:ring-border"
      }`}
    >
      {children}
    </button>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-xs font-bold">{value}</span>
    </div>
  );
}
