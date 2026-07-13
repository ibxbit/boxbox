import Link from "next/link";
import {
  AlarmClock,
  CalendarDays,
  Car,
  CircleDot,
  Crown,
  Flag,
  Gavel,
  ShieldAlert,
  Trophy,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "How F1 Works — BOXBOX",
  description:
    "Every rule of Formula 1 explained simply: qualifying, points, flags, tyres, pit stops, DRS, safety cars, penalties and more.",
};

const SECTIONS = [
  { id: "basics", label: "The Basics", icon: Car },
  { id: "weekend", label: "Race Weekend", icon: CalendarDays },
  { id: "qualifying", label: "Qualifying", icon: AlarmClock },
  { id: "points", label: "Points", icon: Trophy },
  { id: "flags", label: "Flags", icon: Flag },
  { id: "tyres", label: "Tyres", icon: CircleDot },
  { id: "pitstops", label: "Pit Stops", icon: Wrench },
  { id: "drs", label: "DRS", icon: Wind },
  { id: "safety", label: "Safety Car", icon: ShieldAlert },
  { id: "penalties", label: "Penalties", icon: Gavel },
  { id: "sprint", label: "Sprints", icon: Zap },
  { id: "championships", label: "The Titles", icon: Crown },
];

const POINTS: [string, number][] = [
  ["1st", 25], ["2nd", 18], ["3rd", 15], ["4th", 12], ["5th", 10],
  ["6th", 8], ["7th", 6], ["8th", 4], ["9th", 2], ["10th", 1],
];

const FLAGS: { color: string; name: string; meaning: string }[] = [
  { color: "bg-green-500", name: "Green", meaning: "Track is clear — race at full speed." },
  { color: "bg-yellow-400", name: "Yellow", meaning: "Danger ahead — slow down, no overtaking." },
  { color: "bg-yellow-400", name: "Double Yellow", meaning: "Serious hazard — slow right down, be ready to stop." },
  { color: "bg-red-600", name: "Red", meaning: "Session stopped — everyone returns to the pits." },
  { color: "bg-blue-500", name: "Blue", meaning: "A faster car is lapping you — let it through." },
  { color: "bg-white border", name: "White", meaning: "A slow vehicle (like a recovery truck) is on track." },
  { color: "bg-linear-to-br from-black to-red-600", name: "Black & Orange", meaning: "Your car is damaged — pit immediately to fix it." },
  { color: "bg-black", name: "Black", meaning: "You're disqualified. Into the pits, race over." },
  { color: "bg-[conic-gradient(#000_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg)]", name: "Chequered", meaning: "The race is finished — the first car past it wins." },
];

export default function RulesPage() {
  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-12 px-4 pb-16 pt-24 md:pb-24 md:pt-32">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          How F1 Works
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Everything you need to enjoy a Grand Prix, explained without the jargon. Ten
          minutes here and every race you rate on BOXBOX will make sense.
        </p>
        {/* Quick nav */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:text-foreground hover:ring-border"
            >
              <s.icon className="size-3.5" /> {s.label}
            </a>
          ))}
        </div>
      </div>

      <Section id="basics" icon={Car} title="The Basics">
        <p>
          Formula 1 is the top level of single-seater motor racing. <strong>10 teams</strong>{" "}
          (called <strong>constructors</strong> — Ferrari, McLaren, Red Bull, Mercedes…) each
          enter <strong>2 drivers</strong>, so 20 cars line up for every race.
        </p>
        <p>
          A season is a <strong>World Championship</strong> of ~24 races called{" "}
          <strong>Grands Prix</strong> ("big prizes" in French), held in different countries
          from March to December. Every Grand Prix awards points; whoever has the most at the
          end of the year is World Champion.
        </p>
        <p>
          Crucially, teams build their own cars. That&apos;s why some seasons one team
          dominates — their car is simply faster — and why a great driver in a slow car can
          finish 12th and still have driven brilliantly.
        </p>
        <Callout>
          &ldquo;Formula&rdquo; refers to the set of rules every car must follow — engine
          size, dimensions, weight. &ldquo;1&rdquo; means it&apos;s the fastest, highest
          category of them all.
        </Callout>
      </Section>

      <Section id="weekend" icon={CalendarDays} title="The Race Weekend">
        <p>A Grand Prix isn&apos;t just Sunday — it&apos;s a three-day event:</p>
        <ul>
          <li>
            <strong>Friday — Practice.</strong> Two one-hour sessions (FP1, FP2) where teams
            test setups and learn the track. No points, no pressure.
          </li>
          <li>
            <strong>Saturday — Final practice, then Qualifying.</strong> The hour that
            decides the starting order for the race.
          </li>
          <li>
            <strong>Sunday — The Race.</strong> Around 305 km of racing (about 1.5–2 hours).
            This is what you rate on BOXBOX.
          </li>
        </ul>
      </Section>

      <Section id="qualifying" icon={AlarmClock} title="Qualifying">
        <p>
          Qualifying is a knockout competition to set the starting grid — the faster you
          lap, the further up you start:
        </p>
        <ul>
          <li>
            <strong>Q1 (18 min):</strong> all 20 cars run; the slowest 5 are eliminated and
            fill grid slots 16–20.
          </li>
          <li>
            <strong>Q2 (15 min):</strong> the remaining 15 run; the slowest 5 take slots
            11–15.
          </li>
          <li>
            <strong>Q3 (12 min):</strong> the top 10 shoot out for the front. The fastest
            takes <strong>pole position</strong> — first place on the grid.
          </li>
        </ul>
        <Callout>
          Starting position matters enormously — overtaking is hard, so a bad Saturday can
          ruin a Sunday. It&apos;s also why a driver charging from 15th to the podium makes
          for a highly-rated race.
        </Callout>
      </Section>

      <Section id="points" icon={Trophy} title="The Points System">
        <p>
          The top 10 finishers score points; everyone else gets nothing. Points decide both
          world titles.
        </p>
        <div className="not-prose overflow-hidden rounded-xl ring-1 ring-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {POINTS.map(([pos, pts]) => (
                <tr key={pos} className="border-t">
                  <td className="px-4 py-1.5 font-semibold">{pos}</td>
                  <td className="px-4 py-1.5 text-right font-mono">{pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          In many seasons an extra point went to whoever set the <strong>fastest lap</strong>{" "}
          (if they finished in the top 10), and half points can be awarded if a race is
          stopped early.
        </p>
      </Section>

      <Section id="flags" icon={Flag} title="The Flags">
        <p>
          Marshals around the track wave coloured flags to talk to the drivers. Learn these
          and you&apos;ll always know what&apos;s happening:
        </p>
        <div className="not-prose flex flex-col gap-2">
          {FLAGS.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-lg bg-card px-4 py-2.5 ring-1 ring-border/50"
            >
              <span className={`h-4 w-6 shrink-0 rounded-sm ${f.color}`} />
              <span className="w-32 shrink-0 text-sm font-bold">{f.name}</span>
              <span className="text-sm text-muted-foreground">{f.meaning}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="tyres" icon={CircleDot} title="Tyres">
        <p>
          Tyres are F1&apos;s biggest strategic variable. Three dry compounds are available
          each weekend:
        </p>
        <ul>
          <li>
            <strong>Soft (red stripe):</strong> fastest grip, wears out quickly.
          </li>
          <li>
            <strong>Medium (yellow):</strong> the all-rounder.
          </li>
          <li>
            <strong>Hard (white):</strong> slowest but lasts the longest.
          </li>
        </ul>
        <p>
          In a dry race every driver <strong>must use at least two different compounds</strong>,
          which forces at least one pit stop and creates strategy: stop early on fast tyres,
          or run long on slow ones? For rain there are intermediates (green) and full wets
          (blue).
        </p>
      </Section>

      <Section id="pitstops" icon={Wrench} title={<>Pit Stops &amp; &ldquo;Box Box&rdquo;</>}>
        <p>
          During the race, cars dive into the <strong>pit lane</strong> where the crew swaps
          all four tyres in about <strong>2–3 seconds</strong> — one of the most impressive
          team feats in sport.
        </p>
        <p>
          When the team wants their driver to pit, they radio{" "}
          <strong>&ldquo;box, box&rdquo;</strong> — from the German word{" "}
          <em>Boxenstopp</em> for pit stop, and clearer to hear over a screaming engine than
          &ldquo;pit&rdquo;. Yes — that&apos;s where this site&apos;s name comes from. 🏁
        </p>
        <p>
          An <strong>undercut</strong> is pitting before your rival to gain time on fresh
          tyres; an <strong>overcut</strong> is staying out longer and hoping clean air does
          the job.
        </p>
      </Section>

      <Section id="drs" icon={Wind} title="DRS — the Overtaking Aid">
        <p>
          <strong>Drag Reduction System</strong>: a flap in the rear wing that opens to
          reduce drag and add ~10–15 km/h of straight-line speed.
        </p>
        <p>
          A driver may only use it in marked <strong>DRS zones</strong>, and only when
          within <strong>one second</strong> of the car ahead — a deliberate boost for the
          attacker to make overtaking possible on tracks where following closely is hard.
        </p>
      </Section>

      <Section id="safety" icon={ShieldAlert} title="Safety Car & Virtual Safety Car">
        <p>
          After a crash, the <strong>Safety Car</strong> comes out and the whole field bunches
          up behind it at reduced speed while marshals clear the track. No overtaking allowed.
        </p>
        <p>
          A <strong>Virtual Safety Car (VSC)</strong> does the same job without a physical
          car — every driver must stick to a slow lap-time limit, keeping the gaps roughly
          frozen.
        </p>
        <Callout>
          Safety cars shake races up: pit stops become &ldquo;cheap&rdquo; while everyone is
          slow, and restarts bunch the field for a sprint to the flag. Many of the
          highest-rated races on BOXBOX turned on a late safety car.
        </Callout>
      </Section>

      <Section id="penalties" icon={Gavel} title="Penalties">
        <p>
          The <strong>stewards</strong> (race judges) punish rule-breaking — causing a
          collision, speeding in the pit lane, gaining an advantage off track:
        </p>
        <ul>
          <li>
            <strong>Time penalties (5s / 10s):</strong> added at a pit stop or to the final
            race time.
          </li>
          <li>
            <strong>Drive-through / stop-go:</strong> drive down the pit lane (or stop in the
            box for 10s) without service.
          </li>
          <li>
            <strong>Grid penalties:</strong> start further back at the next race — also given
            for using too many engine parts in a season.
          </li>
          <li>
            <strong>Black flag:</strong> disqualification, the ultimate sanction.
          </li>
        </ul>
      </Section>

      <Section id="sprint" icon={Zap} title="Sprint Weekends">
        <p>
          A handful of weekends per season add a <strong>Sprint</strong>: a short ~100 km
          race (about 30 minutes, no mandatory pit stop) held on Saturday, with its own
          shorter qualifying on Friday.
        </p>
        <p>
          The Sprint awards points to the top 8 (8-7-6-5-4-3-2-1) and doesn&apos;t decide
          the Sunday grid — the main Grand Prix still has its own qualifying and full
          points.
        </p>
      </Section>

      <Section id="championships" icon={Crown} title="The Two Championships">
        <p>Every point a driver scores counts twice:</p>
        <ul>
          <li>
            <strong>Drivers&apos; Championship:</strong> the individual title. The driver
            with the most points is World Champion.
          </li>
          <li>
            <strong>Constructors&apos; Championship:</strong> both drivers&apos; points
            combined per team. Huge prestige — and it decides how the sport&apos;s prize
            money is split.
          </li>
        </ul>
        <p>
          They don&apos;t always go together: a team can win the constructors&apos; title
          while its drivers split wins and lose the individual crown.
        </p>
      </Section>

      {/* CTA */}
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-8 ring-1 ring-border/50">
        <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
          Rules down. Now watch a banger.
        </h2>
        <p className="text-sm text-muted-foreground">
          Put your new knowledge to work — spin up a random Grand Prix or start with the
          all-time classics on the home page.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/random" className={buttonVariants({ variant: "default" })}>
            Random race
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            The classics
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-4">
      <h2 className="flex items-center gap-2.5 text-xl font-black uppercase tracking-tight md:text-2xl">
        <span className="flex size-8 items-center justify-center rounded-lg bg-card ring-1 ring-border/50">
          <Icon className="size-4" />
        </span>
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground md:text-base [&_li]:mt-1.5 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-l-4 border-primary bg-card p-4 text-sm leading-relaxed">
      <span className="mb-1 block text-xs font-black uppercase tracking-widest text-muted-foreground">
        💡 Did you know
      </span>
      {children}
    </div>
  );
}
