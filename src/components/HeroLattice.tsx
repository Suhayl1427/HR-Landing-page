"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
   HeroLattice.tsx — ambient background for the hero.
   ----------------------------------------------------------------------------
   Not a particle field. This is an org chart:
     · nodes are people, clustered into teams (one lead, 2–4 reports)
     · hairlines are reporting lines
     · violet dots are approvals routing UP the chain to a manager

   One <canvas>, ~30 objects. Pauses off-screen and on hidden tabs, and
   renders a single static frame under prefers-reduced-motion.
   Drop it behind the hero content with position: absolute; inset: 0.
========================================================================== */

type Node = {
  bx: number;
  by: number;
  x: number;
  y: number;
  r: number;
  /** drift */
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

export default function HeroLattice({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes: Node[] = [];
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
    ): Node => ({
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

    /* ---- graph: small teams, not a random mesh ---------------------------- */
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
        const leadY = height * (0.14 + rand() * 0.4);
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
        node.y =
          node.by + Math.cos(now * node.speed * 0.82 + node.phase) * node.amp * 0.65;
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

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}