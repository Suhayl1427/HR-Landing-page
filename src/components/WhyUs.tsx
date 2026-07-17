"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GitBranch,
  Landmark,
  Layers,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ============================================================================
   WhyUs.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. Only dependency: lucide-react (already installed).

   Put this at:  src/components/WhyUs.tsx

     import SiteHeader from "../components/SiteHeader";
     import Hero from "../components/Hero";
     import ProductShowcase from "../components/ProductShowcase";
     import WhyUs from "../components/WhyUs";

     export default function Home() {
       return (
         <>
           <SiteHeader />
           <main>
             <Hero />
             <ProductShowcase />
             <WhyUs />
           </main>
         </>
       );
     }

   ---------------------------------------------------------------------------
   THE LAYOUT

   Not a 3x2 icon grid. A sticky thesis on the left, and the reasons on the
   right threaded onto a vertical approval chain — the same node-and-line
   language as the hero lattice, so the page argues in its own visual dialect.

   Two scroll behaviours, deliberately on different beats:
     · the violet spine FILLS continuously, tracking scroll position 1:1
     · each reason FADES UP as it arrives, and its node LIGHTS 200ms later

   Both are skipped entirely under prefers-reduced-motion — the section just
   renders, fully revealed, spine filled.

   ---------------------------------------------------------------------------
   ⚠  VERIFY THE NUMBERS BEFORE YOU SHIP

   STATS and the first chip of each reason contain hard claims ("6 countries",
   "3-week average"). They are placeholders shaped like good claims — they
   make the section persuasive precisely because they are falsifiable, which
   also means shipping them unverified is a real problem. Replace with numbers
   you can defend.
========================================================================== */

const SECTION = {
  eyebrow: "Why YourOffice HR",
  /* Change to a literal "Why choose YourOffice HR?" if you prefer the question. */
  heading: "HR breaks in the gaps between systems",
  sub: "Leave sits in one tool, payroll in another, approvals in a chat thread. Every gap is somewhere a request goes missing or a number quietly drifts. We removed the gaps.",
};

const STATS = [
  { value: "6", label: "countries, one payroll run" },
  { value: "3 wks", label: "typical go-live" },
  { value: "0", label: "CSV exports between modules", accent: true },
];

type Reason = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** First chip is brand-tinted — put the hard number there. */
  chips: [string, string];
};

const REASONS: Reason[] = [
  {
    icon: Layers,
    title: "One record, not six systems",
    body: "Leave, claims, payroll, reviews and org structure all write to the same employee record. Move someone's reporting line once and the approval chain, the org chart and the payroll cost centre follow it.",
    chips: ["No re-keying", "No CSV exports"],
  },
  {
    icon: Landmark,
    title: "Payroll that already knows the statutes",
    body: "CPF, IRAS, EPF, SSS. The statutory logic ships with the product and updates when the rules do. One run covers every country you operate in.",
    chips: ["6 countries, one run", "IRAS-ready files"],
  },
  {
    icon: GitBranch,
    title: "Approvals that don't live in a chat thread",
    body: "Every claim, leave request and adjustment routes down a chain you drew, and lands with a timestamped audit trail. Finance stops chasing. Auditors stop asking.",
    chips: ["Full audit trail", "Escalation rules"],
  },
  {
    icon: TrendingUp,
    title: "Numbers your board will actually read",
    body: "Headcount, attrition, cost-to-hire and goal completion, computed off live records. Not a spreadsheet somebody rebuilt on Sunday night.",
    chips: ["Live, not exported", "Board-ready"],
  },
  {
    icon: Zap,
    title: "Live in weeks, not quarters",
    body: "Bring your existing employee data in, map it once, go live. Your team keeps working through the whole migration.",
    chips: ["3-week average", "Guided migration"],
  },
];

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5c0634] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/* ========================================================================== */

export default function WhyUs() {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const [reduced, setReduced] = useState(false);
  const [fill, setFill] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>(() => REASONS.map(() => false));

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* The spine tracks scroll 1:1 — no CSS transition, or it would lag behind. */
  useEffect(() => {
    if (reduced) {
      setFill(1);
      return;
    }

    let queued = false;

    const update = () => {
      queued = false;
      const list = listRef.current;
      if (!list) return;

      const rect = list.getBoundingClientRect();
      /* "now" sits at 52% of the viewport — slightly above centre reads better */
      const anchor = window.innerHeight * 0.52;
      const progress = (anchor - rect.top) / Math.max(1, rect.height);
      setFill(Math.min(1, Math.max(0, progress)));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  /* Reveal each reason once, then stop watching it. */
  useEffect(() => {
    if (reduced) {
      setRevealed(REASONS.map(() => true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);

          setRevealed((previous) => {
            if (previous[index]) return previous;
            const next = [...previous];
            next[index] = true;
            return next;
          });

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -12% 0px" },
    );

    for (const item of itemRefs.current) {
      if (item) observer.observe(item);
    }
    return () => observer.disconnect();
  }, [reduced]);

  return (
<section id="why-us" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
        {/* --- the thesis, sticky ------------------------------------------ */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#6E6A7C]">
            {SECTION.eyebrow}
          </p>

          <h2
            className={cn(
              "mt-4 text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#14131A]",
              DISPLAY,
            )}
          >
            {SECTION.heading}
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-[#6E6A7C]">
            {SECTION.sub}
          </p>

          <div className="mt-9 grid grid-cols-3 gap-5 border-t border-[#F2EFEB] pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p
                  className={cn(
                    "text-[26px] font-semibold tracking-[-0.02em]",
                    DISPLAY,
                    stat.accent ? "text-[#5c0634]" : "text-[#14131A]",
                  )}
                >
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11.5px] leading-snug text-[#6E6A7C]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/demo"
            className={cn(
              "group relative mt-9 inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-full px-5",
              "bg-[#5c0634] text-[14.5px] font-medium text-white",
              "shadow-[0_6px_18px_-6px_rgba(91,61,245,0.55)]",
              "transition-[transform,background-color,box-shadow] duration-300 motion-reduce:transition-none",
              "hover:-translate-y-px hover:bg-[#4A042A] hover:shadow-[0_12px_30px_-8px_rgba(91,61,245,0.65)]",
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
        </div>

        {/* --- the chain --------------------------------------------------- */}
        <ol ref={listRef} className="relative">
          {/* track */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1.5 left-4 w-px bg-[#E9E6E1]"
          >
            {/* fill — no transition, it follows the scrollbar directly */}
            <div
              style={{ height: `${fill * 100}%` }}
              className="w-px bg-gradient-to-b from-[#5B3DF5] to-[#5B3DF5]/30"
            />
          </div>

          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            const on = revealed[index];

            return (
              <li
                key={reason.title}
                data-index={index}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={cn(
                  "relative pl-12 pb-12 last:pb-0 sm:pb-14",
                  "transition-[opacity,transform] duration-700 motion-reduce:transition-none",
                  EASE,
                  on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                {/* the node lights 200ms after its row arrives — two beats */}
                <span
                  className={cn(
                    "absolute left-0 top-0.5 grid h-8 w-8 place-items-center rounded-full border bg-white",
                    "transition-[background-color,border-color,color,box-shadow,transform] duration-500 [transition-delay:200ms] motion-reduce:transition-none",
                    EASE,
                    on
                      ? "scale-100 border-[#5C0634]/30 text-[#5C0634] shadow-[0_0_0_4px_rgba(92,6,52,0.08)]"
                      : "scale-95 border-[#E9E6E1] text-[#C9C5CE]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                </span>

                <p className="text-[10.5px] font-semibold tracking-[0.16em] text-[#B4B0BC]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-1.5 text-[18px] font-semibold tracking-[-0.015em] text-[#14131A]">
                  {reason.title}
                </h3>

                <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-[#6E6A7C]">
                  {reason.body}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {reason.chips.map((chip, chipIndex) => (
                    <span
                      key={chip}
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-medium",
                        chipIndex === 0
                          ? "bg-[#F8EEF4] text-[#5C0634]"
                          : "border border-[#E9E6E1] bg-[#FAF9F7] text-[#6E6A7C]",
                      )}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}