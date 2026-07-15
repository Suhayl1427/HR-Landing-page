"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

/* ============================================================================
   Hero.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Fully self-contained. No local imports, no Tailwind config, no globals.css
   edits. Only dependency is lucide-react, which the header already uses.

   Put this at:  src/components/Hero.tsx

   Then in src/app/page.tsx — note there is NO pt-[108px] on <main>. The hero
   owns its top padding so the lattice can run under the transparent header:

     import SiteHeader from "../components/SiteHeader";
     import Hero from "../components/Hero";

     export default function Home() {
       return (
         <>
           <SiteHeader />
           <main>
             <Hero />
           </main>
         </>
       );
     }
========================================================================== */

/* ----------------------------- content ---------------------------------- */

/** Swap for your real proof points or customer logos. */
const PROOF = [
  "Multi-country payroll",
  "Statutory filings built in",
  "Single sign-on",
];

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const RISE = "animate-[heroRise_0.75s_cubic-bezier(0.22,1,0.36,1)_both]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/* ============================================================================
   Hero
========================================================================== */

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#FAF9F7]">
      <HeroLattice />

      {/* A pool of paper light, so the copy sits clean on top of the lattice. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(56%_48%_at_50%_44%,#FAF9F7_24%,rgba(250,249,247,0.55)_58%,transparent_100%)]"
      />
      {/* Dissolve into whatever section comes next. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#FAF9F7]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-[150px] sm:pb-44 sm:pt-[190px]">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/changelog"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-[#E9E6E1] bg-white/70 py-1.5 pl-1.5 pr-3.5 text-[12.5px] backdrop-blur",
              "transition-colors duration-200 hover:border-[#5B3DF5]/25 hover:bg-white",
              RING,
              RISE,
            )}
          >
            <span className="rounded-full bg-[#5B3DF5] px-2 py-0.5 text-[11px] font-semibold text-white">
              New
            </span>
            <span className="text-[#43404F]">HR KPI Manager 2.0</span>
            <ArrowRight
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5 text-[#6E6A7C] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
                EASE,
              )}
            />
          </Link>

          {/* 'busywork' starts at full ink and recedes to muted as you read it. */}
          <h1
            className={cn(
              "mt-7 text-[clamp(2.6rem,6.4vw,4.6rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#14131A]",
              "font-[family-name:var(--font-grotesk,inherit)]",
              RISE,
              "[animation-delay:90ms]",
            )}
          >
            HR, without the{" "}
            <span className="animate-[heroRecede_1.1s_cubic-bezier(0.22,1,0.36,1)_900ms_both]">
              busywork
            </span>
          </h1>

          <p
            className={cn(
              "mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-[#6E6A7C]",
              RISE,
              "[animation-delay:170ms]",
            )}
          >
            Payroll, approvals, org structure and people metrics, all running on
            one employee record. No re-keying, no month-end scramble.
          </p>

          <div
            className={cn(
              "mt-9 flex flex-wrap items-center justify-center gap-3",
              RISE,
              "[animation-delay:250ms]",
            )}
          >
            <Link
              href="/demo"
              className={cn(
                "group relative inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-full px-5",
                "bg-[#5B3DF5] text-[15px] font-medium text-white",
                "shadow-[0_6px_18px_-6px_rgba(91,61,245,0.55)]",
                "transition-[transform,background-color,box-shadow] duration-300 motion-reduce:transition-none",
                "hover:-translate-y-px hover:bg-[#4327D9] hover:shadow-[0_12px_30px_-8px_rgba(91,61,245,0.65)]",
                "active:scale-[0.98]",
                EASE,
                RING,
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 w-3/5 -translate-x-[160%] skew-x-[-20deg] bg-white/25",
                  "transition-transform duration-[750ms] group-hover:translate-x-[260%] motion-reduce:transition-none",
                  EASE,
                )}
              />
              <span className="relative z-10 inline-flex items-center gap-1.5">
                Book a demo
                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
                    EASE,
                  )}
                />
              </span>
            </Link>

            <Link
              href="/platform"
              className={cn(
                "inline-flex h-11 items-center rounded-full border border-[#E9E6E1] bg-white px-5",
                "text-[15px] font-medium text-[#14131A]",
                "transition-[transform,border-color,box-shadow] duration-300 motion-reduce:transition-none",
                "hover:-translate-y-px hover:border-[#14131A]/20 hover:shadow-[0_10px_28px_-12px_rgba(20,19,26,0.16)]",
                EASE,
                RING,
              )}
            >
              Tour the platform
            </Link>
          </div>

          <ul
            className={cn(
              "mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-[#6E6A7C]",
              RISE,
              "[animation-delay:330ms]",
            )}
          >
            {PROOF.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#E9E6E1]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroRecede {
          from { color: #14131A; }
          to   { color: #6E6A7C; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================================
   HeroLattice — the background.

   Not a particle field. This is an org chart:
     · nodes are people, clustered into teams (one lead, 2–4 reports)
     · hairlines are reporting lines
     · violet dots are approvals routing UP the chain to a manager

   One <canvas>, ~30 objects. Pauses off-screen and on hidden tabs, caps DPR
   at 2, and renders a single static frame under prefers-reduced-motion.
========================================================================== */

type LatticeNode = {
  bx: number;
  by: number;
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  amp: number;
  lead: boolean;
  /** timestamp of the last approval arrival */
  flash: number;
};

type Edge = { a: number; b: number };
type Pulse = { edge: number; start: number; duration: number; up: boolean };

const INK = "20, 19, 26";
const BRAND = "91, 61, 245";
const TAU = Math.PI * 2;
const MAX_PULSES = 3;

/** Seeded PRNG — the same org every reload, so it never feels random. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function HeroLattice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes: LatticeNode[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let nextSpawn = 0;
    let inView = true;

    const makeNode = (
      x: number,
      y: number,
      lead: boolean,
      rand: () => number,
    ): LatticeNode => ({
      bx: x,
      by: y,
      x,
      y,
      r: lead ? 3.2 : 2.1,
      phase: rand() * TAU,
      speed: 0.00012 + rand() * 0.00016,
      amp: 3 + rand() * 4,
      lead,
      flash: -1e9,
    });

    /* Small teams, not a random mesh. */
    const build = () => {
      const rand = mulberry32(20260712);
      nodes = [];
      edges = [];
      pulses = [];

      const clusters = Math.max(3, Math.round(width / 300));
      const lane = width / clusters;
      let previousLead = -1;

      for (let c = 0; c < clusters; c += 1) {
        const leadX = lane * (c + 0.5) + (rand() - 0.5) * lane * 0.4;
        const leadY = height * (0.16 + rand() * 0.38);
        const leadIndex = nodes.length;
        nodes.push(makeNode(leadX, leadY, true, rand));

        const reports = 2 + Math.floor(rand() * 3);
        for (let r = 0; r < reports; r += 1) {
          const spread = (r - (reports - 1) / 2) * (lane * 0.36);
          const x = Math.min(width - 16, Math.max(16, leadX + spread + (rand() - 0.5) * 20));
          const y = Math.min(height - 16, leadY + 66 + rand() * 74);
          edges.push({ a: leadIndex, b: nodes.length });
          nodes.push(makeNode(x, y, false, rand));
        }

        /* a peer line across to the previous team lead */
        if (previousLead >= 0 && rand() > 0.35) {
          edges.push({ a: leadIndex, b: previousLead });
        }
        previousLead = leadIndex;
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      /* drift — the org breathes */
      for (const node of nodes) {
        node.x = node.bx + Math.sin(now * node.speed + node.phase) * node.amp;
        node.y = node.by + Math.cos(now * node.speed * 0.82 + node.phase) * node.amp * 0.65;
      }

      /* reporting lines */
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${INK}, 0.07)`;
      ctx.beginPath();
      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      /* approvals in flight */
      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const pulse = pulses[i];
        const t = (now - pulse.start) / pulse.duration;
        const edge = edges[pulse.edge];

        if (t >= 1) {
          nodes[pulse.up ? edge.a : edge.b].flash = now;
          pulses.splice(i, 1);
          continue;
        }

        /* easeInOutQuad */
        const k = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const from = pulse.up ? nodes[edge.b] : nodes[edge.a];
        const to = pulse.up ? nodes[edge.a] : nodes[edge.b];

        const x = from.x + (to.x - from.x) * k;
        const y = from.y + (to.y - from.y) * k;
        const tail = Math.max(0, k - 0.17);

        ctx.strokeStyle = `rgba(${BRAND}, 0.3)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(from.x + (to.x - from.x) * tail, from.y + (to.y - from.y) * tail);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = `rgba(${BRAND}, 0.14)`;
        ctx.beginPath();
        ctx.arc(x, y, 4.6, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(${BRAND}, 0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, TAU);
        ctx.fill();
      }

      /* people */
      for (const node of nodes) {
        const age = now - node.flash;
        const lit = age >= 0 && age < 1000 ? 1 - age / 1000 : 0;

        if (lit > 0) {
          ctx.strokeStyle = `rgba(${BRAND}, ${0.3 * lit})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 3 + (1 - lit) * 9, 0, TAU);
          ctx.stroke();
        }

        ctx.fillStyle = lit
          ? `rgba(${BRAND}, ${0.25 + 0.5 * lit})`
          : `rgba(${INK}, ${node.lead ? 0.17 : 0.12})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, TAU);
        ctx.fill();

        if (node.lead) {
          ctx.strokeStyle = `rgba(${INK}, 0.09)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 4, 0, TAU);
          ctx.stroke();
        }
      }
    };

    const frame = (now: number) => {
      /* 70% of approvals travel up the chain to a manager. */
      if (now >= nextSpawn && edges.length && pulses.length < MAX_PULSES) {
        pulses.push({
          edge: Math.floor(Math.random() * edges.length),
          start: now,
          duration: 1000 + Math.random() * 700,
          up: Math.random() < 0.7,
        });
        nextSpawn = now + 1300 + Math.random() * 1100;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf || !inView || document.hidden) return;
      nextSpawn = performance.now() + 600;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      build();
      if (reduced) draw(0);
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
    />
  );
}