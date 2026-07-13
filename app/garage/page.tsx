import { CarBuilder } from "@/components/garage/car-builder";

export const metadata = {
  title: "The Garage — BOXBOX",
  description:
    "Build a car in 3D: pick the engine, gearbox, brakes and tyres, spin it around, and see straight through the bodywork to every part inside.",
};

export default function GaragePage() {
  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 pb-12 pt-24 md:pb-24 md:pt-32">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          The Garage
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Build a car in 3D. Pick a template, choose real parts on the left and right, and
          spin the car in the middle in any direction — the X-ray body lets you see the
          engine, gearbox and everything else inside. Hover any part to learn what it does.
        </p>
      </div>
      <CarBuilder />
    </div>
  );
}
