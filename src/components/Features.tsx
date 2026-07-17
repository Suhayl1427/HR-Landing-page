"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  CircleDollarSign,
  FileText,
  Gauge,
  MessageSquare,
  Network,
  Settings,
  UserCheck,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* ============================================================================
   Features.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. Only dependency: lucide-react. Brand colour is your real
   plum #540E44, taken from the product.

   Put this at:  src/components/Features.tsx   →   <Features /> after <WhyUs />

   ---------------------------------------------------------------------------
   THE STRUCTURE

   Ten modules shown as ten equal cards is a wall — the eye bounces off it.
   They aren't equal, so they aren't presented as equal:

     · FOUR reasons someone buys       -> large cards, each with a live visual
     · SIX pieces of connective tissue -> a compact strip under a divider

   Each big card earns its size with a small purpose-built visual that animates
   when it scrolls into view: a leave balance that fills, a multi-country
   payroll stack, an approval chain that lights node by node, a headcount
   sparkline that grows. All built from divs — no chart library, no screenshots
   of the app.

   Every animation is skipped under prefers-reduced-motion.

   ---------------------------------------------------------------------------
   ⚠  THE NUMBERS ARE PLACEHOLDERS

   "12.5 days left", "approved in 40 min", "3 of 6 countries", "+4 this qtr",
   "attrition 6.2%" — these read as real because they're specific, which is
   exactly why you shouldn't ship them unverified. Swap for real figures or
   make them obviously illustrative.
========================================================================== */

type Visual = "leave" | "payroll" | "chain" | "kpi";

type Primary = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  /** The promise. Set in the display face. */
  thesis: string;
  body: string;
  visual: Visual;
};

/* The four people actually buy. */
const PRIMARY: Primary[] = [
  {
    id: "ess",
    label: "ESS",
    icon: UserRound,
    thesis: "Your team stops emailing HR",
    body: "Leave, claims, payslips and personal details — employees own their own record, so the HR inbox stops being a queue.",
    visual: "leave",
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: CircleDollarSign,
    thesis: "One run. Every country.",
    body: "CPF, IRAS and regional statutory logic ships with the product and updates when the rules do. Payslips land in ESS the moment you close the run.",
    visual: "payroll",
  },
  {
    id: "workflow",
    label: "Workflow Approval",
    icon: Workflow,
    thesis: "Approvals that don't live in a chat thread",
    body: "Draw the chain once. Every claim and request routes down it, escalates when it stalls, and lands with a trail auditors accept.",
    visual: "chain",
  },
  {
    id: "kpi",
    label: "HR KPI Manager",
    icon: Gauge,
    badge: "Beta",
    thesis: "The people numbers, without the spreadsheet",
    body: "Headcount, attrition, cost-to-hire and goal completion, computed off live records. Not a sheet somebody rebuilt on Sunday night.",
    visual: "kpi",
  },
];

/* The six that make the four work. */
const SECONDARY: Array<{ id: string; label: string; icon: LucideIcon; line: string }> = [
  {
    id: "company",
    label: "My Company",
    icon: Building2,
    line: "Entities, departments, holidays and policies — defined once, applied everywhere.",
  },
  {
    id: "admin",
    label: "Admin Approval",
    icon: UserCheck,
    line: "Profile changes, documents and exceptions in a single queue with a full trail.",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    line: "Every module feeds one reporting layer, so the numbers agree with each other.",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    line: "Roles, permissions, SSO and integrations — set centrally, honoured everywhere.",
  },
  {
    id: "org",
    label: "Organization Chart",
    icon: Network,
    line: "Reporting lines drawn from live records. Change one, and approvals follow.",
  },
  {
    id: "chat",
    label: "Team Chat",
    icon: MessageSquare,
    line: "Announcements and DMs inside the workspace, next to what you're discussing.",
  },
];

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/** Fires once when the element scrolls in. Returns true immediately if the
 *  visitor has asked for reduced motion. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, on };
}

const rise = (on: boolean) =>
  cn(
    "transition-[opacity,transform] duration-700 motion-reduce:transition-none",
    EASE,
    on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
  );

/* ========================================================================== */

export default function Features() {
  const head = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const strip = useReveal<HTMLDivElement>();

  return (
<section id="platform" className="bg-[#FAF9F7] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* --- header ------------------------------------------------------ */}
        <div ref={head.ref} className={cn("mx-auto max-w-2xl text-center", rise(head.on))}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#6E6A7C]">
            The platform
          </p>
          <h2
            className={cn(
              "mt-4 text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#14131A]",
              DISPLAY,
            )}
          >
            Ten modules. One employee record.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-[#6E6A7C]">
            Four you&apos;ll live in. Six that quietly make them work. Nothing gets
            re-keyed between them, because there is nothing to re-key.
          </p>
        </div>

        {/* --- the four ---------------------------------------------------- */}
        <div ref={grid.ref} className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-2">
          {PRIMARY.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.id}
                style={{ transitionDelay: grid.on ? `${index * 90}ms` : "0ms" }}
                className={cn(
                  "rounded-3xl border border-[#E9E6E1] bg-white p-7 sm:p-8",
                  "hover:-translate-y-0.5 hover:border-[#540E44]/20 hover:shadow-[0_18px_44px_-24px_rgba(20,19,26,0.22)]",
                  rise(grid.on),
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#F2ECF0] text-[#540E44]">
                    <Icon aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} />
                  </span>
                  <p className="flex-1 text-[13.5px] font-medium text-[#43404F]">
                    {item.label}
                  </p>
                  {item.badge && (
                    <span className="rounded-md bg-[#540E44] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    "mt-6 text-[clamp(1.35rem,2.2vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[#14131A]",
                    DISPLAY,
                  )}
                >
                  {item.thesis}
                </h3>

                <p className="mt-3 text-[14.5px] leading-relaxed text-[#6E6A7C]">
                  {item.body}
                </p>

                <div className="mt-7">
                  {item.visual === "leave" && <LeaveVisual on={grid.on} />}
                  {item.visual === "payroll" && <PayrollVisual on={grid.on} />}
                  {item.visual === "chain" && <ChainVisual on={grid.on} />}
                  {item.visual === "kpi" && <KpiVisual on={grid.on} />}
                </div>
              </article>
            );
          })}
        </div>

        {/* --- the six ----------------------------------------------------- */}
        <div ref={strip.ref}>
          <div className={cn("mt-16 flex items-center gap-5 sm:mt-20", rise(strip.on))}>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E9E6E1]" />
            <p className="whitespace-nowrap text-[12.5px] text-[#6E6A7C]">
              And the six that hold it together
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E9E6E1]" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECONDARY.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  style={{ transitionDelay: strip.on ? `${120 + index * 60}ms` : "0ms" }}
                  className={cn(
                    "rounded-2xl border border-[#E9E6E1] bg-white p-5",
                    "hover:-translate-y-0.5 hover:border-[#540E44]/20 hover:shadow-[0_12px_30px_-20px_rgba(20,19,26,0.22)]",
                    rise(strip.on),
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      aria-hidden="true"
                      className="h-[17px] w-[17px] flex-none text-[#540E44]"
                      strokeWidth={1.7}
                    />
                    <p className="text-[14px] font-medium text-[#14131A]">{item.label}</p>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#6E6A7C]">
                    {item.line}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   The four visuals. Divs only. Each animates on reveal, staggered behind its
   card so the section arrives in waves rather than all at once.
========================================================================== */

const PANEL = "rounded-2xl border border-[#E9E6E1] bg-[#FAF9F7] p-4";

/** ESS — a leave balance that fills. */
function LeaveVisual({ on }: { on: boolean }) {
  return (
    <div className={PANEL}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] text-[#6E6A7C]">Annual leave</p>
        <p className="text-[13px] font-medium text-[#14131A]">
          <span className="tabular-nums">12.5</span> days left
        </p>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E9E6E1]">
        <div
          style={{ width: on ? "62%" : "0%" }}
          className={cn(
            "h-full rounded-full bg-[#540E44]",
            "transition-[width] duration-[1100ms] [transition-delay:250ms] motion-reduce:transition-none",
            EASE,
          )}
        />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#F2ECF0] px-2 py-0.5 text-[11.5px] font-medium text-[#540E44]">
          Applied · 2 days
        </span>
        <span className="text-[11.5px] text-[#6E6A7C]">14–15 Jul · approved in 40 min</span>
      </div>
    </div>
  );
}

/** Payroll — three countries, one run. */
const RUNS = [
  { code: "SG", note: "CPF filed", done: true },
  { code: "MY", note: "EPF filed", done: true },
  { code: "PH", note: "Processing", done: false },
];

function PayrollVisual({ on }: { on: boolean }) {
  return (
    <div className={PANEL}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] text-[#6E6A7C]">June run</p>
        <p className="text-[11.5px] text-[#6E6A7C]">3 of 6 countries</p>
      </div>

      <ul className="mt-3 space-y-2">
        {RUNS.map((run, index) => (
          <li
            key={run.code}
            style={{ transitionDelay: on ? `${300 + index * 120}ms` : "0ms" }}
            className={cn(
              "flex items-center gap-2.5 transition-[opacity,transform] duration-500 motion-reduce:transition-none",
              EASE,
              on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
            )}
          >
            <span className="grid h-6 w-8 flex-none place-items-center rounded-md border border-[#E9E6E1] bg-white text-[10.5px] font-semibold tabular-nums text-[#43404F]">
              {run.code}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E9E6E1]" />
            <span
              className={cn(
                "flex flex-none items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium",
                run.done
                  ? "bg-[#F2ECF0] text-[#540E44]"
                  : "border border-[#E9E6E1] bg-white text-[#6E6A7C]",
              )}
            >
              {!run.done && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#540E44] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#540E44]" />
                </span>
              )}
              {run.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Workflow Approval — the chain lights node by node. */
const CHAIN = ["Employee", "Manager", "Finance"];

function ChainVisual({ on }: { on: boolean }) {
  return (
    <div className={PANEL}>
      <p className="text-[12px] text-[#6E6A7C]">Claim S$412 · expense</p>

      <div className="mt-4 flex items-start">
        {CHAIN.map((step, index) => (
          <div key={step} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-none flex-col items-center gap-2">
              <span
                style={{ transitionDelay: on ? `${300 + index * 280}ms` : "0ms" }}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold",
                  "transition-[background-color,border-color,color,box-shadow] duration-500 motion-reduce:transition-none",
                  EASE,
                  on
                    ? "border-[#540E44] bg-[#540E44] text-white shadow-[0_0_0_4px_rgba(84,14,68,0.08)]"
                    : "border-[#E9E6E1] bg-white text-[#C9C5CE]",
                )}
              >
                {index + 1}
              </span>
              <span className="whitespace-nowrap text-[11px] text-[#6E6A7C]">{step}</span>
            </div>

            {index < CHAIN.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-2 mt-[13px] block h-px flex-1 overflow-hidden bg-[#E9E6E1]"
              >
                <span
                  style={{
                    width: on ? "100%" : "0%",
                    transitionDelay: on ? `${420 + index * 280}ms` : "0ms",
                  }}
                  className={cn(
                    "block h-px bg-[#540E44]",
                    "transition-[width] duration-[280ms] motion-reduce:transition-none",
                    EASE,
                  )}
                />
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11.5px] text-[#6E6A7C]">
        Cleared in 2 steps · full audit trail
      </p>
    </div>
  );
}

/** HR KPI Manager — headcount grows. */
const BARS = [38, 52, 46, 61, 57, 73, 88];

function KpiVisual({ on }: { on: boolean }) {
  return (
    <div className={PANEL}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] text-[#6E6A7C]">Headcount · 7 quarters</p>
        <span className="rounded-full bg-[#F2ECF0] px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-[#540E44]">
          +4 this qtr
        </span>
      </div>

      <div className="mt-4 flex h-16 items-end gap-1.5">
        {BARS.map((height, index) => (
          <span
            key={index}
            style={{
              height: on ? `${height}%` : "4%",
              transitionDelay: on ? `${300 + index * 70}ms` : "0ms",
            }}
            className={cn(
              "flex-1 rounded-t-[3px] transition-[height] duration-[700ms] motion-reduce:transition-none",
              EASE,
              index === BARS.length - 1 ? "bg-[#540E44]" : "bg-[#E1D6DE]",
            )}
          />
        ))}
      </div>

      <p className="mt-3 text-[11.5px] text-[#6E6A7C]">
        Attrition 6.2% · computed off live records
      </p>
    </div>
  );
}