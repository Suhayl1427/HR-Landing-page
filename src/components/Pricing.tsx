"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/* ============================================================================
   Pricing.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. Only dependency: lucide-react. Brand plum #540E44.

   Put this at:  src/components/Pricing.tsx   →   <Pricing /> after <Features />

   ---------------------------------------------------------------------------
   THE DESIGN

   Pricing has one job: let a buyer work out what they'd actually pay without
   emailing you. For HR software the price depends on headcount, so a static
   "S$9/user" table makes every visitor do arithmetic — and a chunk of them
   just leave instead. So the headcount slider is the section, not an add-on.
   Drag once; all three plans reprice.

   Two other deliberate choices:

   · No "Most Popular" ribbon. The recommended tier is simply the dark plum
     card. Inversion carries the emphasis; a ribbon is a sticker.

   · No three identical checklists. Each tier says "everything in the last one,
     PLUS", so the eye reads only the difference. Repeating twelve rows three
     times is the classic pricing-table sin — it makes the tiers look the same.

   Numbers are formatted with a regex, not toLocaleString(), so the server and
   client render byte-identical strings. toLocaleString() can differ between
   Node's ICU and the browser's and will throw a hydration mismatch.

   ---------------------------------------------------------------------------
   ⚠  EVERY PRICE HERE IS INVENTED

   S$4 and S$9 per employee, the S$120 platform fee, "2 months free" on annual,
   the module packaging, "data hosted in Singapore" — all placeholders shaped
   like real pricing. Nothing on a landing page is more dangerous to ship
   wrong. Replace all of it before this goes live.
========================================================================== */

const CONFIG = {
  min: 10,
  max: 500,
  step: 5,
  default: 120,
  currency: "S$",
  /** Annual = 2 months free. */
  annualFactor: 10 / 12,
};

type Plan = {
  id: string;
  name: string;
  pitch: string;
  /** null = custom pricing */
  perEmployee: number | null;
  platformFee: number;
  featured?: boolean;
  includesLabel: string;
  includes: string[];
  cta: { label: string; href: string };
};

const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    pitch: "Get the records straight.",
    perEmployee: 4,
    platformFee: 0,
    includesLabel: "Includes",
    includes: [
      "ESS",
      "My Company",
      "Organization Chart",
      "Admin Approval",
      "Team Chat",
    ],
    cta: { label: "Start free trial", href: "/signup" },
  },
  {
    id: "growth",
    name: "Growth",
    pitch: "Run payroll and approvals.",
    perEmployee: 9,
    platformFee: 120,
    featured: true,
    includesLabel: "Everything in Essential, plus",
    includes: ["Payroll", "Workflow Approval", "Reports"],
    cta: { label: "Book a demo", href: "/demo" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    pitch: "Groups, multi-entity, regulated.",
    perEmployee: null,
    platformFee: 0,
    includesLabel: "Everything in Growth, plus",
    includes: [
      "HR KPI Manager (Beta)",
      "SSO & SCIM provisioning",
      "Multi-entity & multi-currency",
      "Dedicated CSM · 99.9% SLA",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

const FOOTNOTE = "Unlimited admins · no setup fee · data hosted in Singapore";

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#540E44] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/** Deterministic on both server and client — unlike toLocaleString(). */
const money = (value: number) =>
  CONFIG.currency +
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

export default function Pricing() {
  const [headcount, setHeadcount] = useState(CONFIG.default);
  const [annual, setAnnual] = useState(false);

  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  const factor = annual ? CONFIG.annualFactor : 1;
  const filled = ((headcount - CONFIG.min) / (CONFIG.max - CONFIG.min)) * 100;
  const atCeiling = headcount >= CONFIG.max;

  return (
<section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={head.ref} className={cn("mx-auto max-w-2xl text-center", rise(head.on))}>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#6E6A7C]">
            Pricing
          </p>
          <h2
            className={cn(
              "mt-4 text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#14131A]",
              DISPLAY,
            )}
          >
            Price it before you talk to us
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-[#6E6A7C]">
            Per employee, per month. Drag your headcount and every plan reprices —
            no quote form, no arithmetic.
          </p>
        </div>

        <div ref={body.ref}>
          {/* --- the control strip ---------------------------------------- */}
          <div
            className={cn(
              "mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 rounded-2xl border border-[#E9E6E1] bg-[#FAF9F7] px-5 py-4 sm:mt-14",
              rise(body.on),
            )}
          >
            <div className="min-w-[240px] flex-1">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="headcount"
                  className="text-[12.5px] text-[#6E6A7C]"
                >
                  Headcount
                </label>
                <output
                  htmlFor="headcount"
                  className={cn(
                    "text-[17px] font-semibold tabular-nums text-[#14131A]",
                    DISPLAY,
                  )}
                >
                  {atCeiling ? `${CONFIG.max}+` : headcount}
                </output>
              </div>

              <input
                id="headcount"
                type="range"
                min={CONFIG.min}
                max={CONFIG.max}
                step={CONFIG.step}
                value={headcount}
                onChange={(event) => setHeadcount(Number(event.target.value))}
                aria-valuetext={`${headcount} employees`}
                style={{
                  background: `linear-gradient(to right, #540E44 ${filled}%, #E9E6E1 ${filled}%)`,
                }}
                className="pricing-range mt-2.5"
              />
            </div>

            {/* billing toggle — a sliding pill, same language as the nav */}
            <div
              role="radiogroup"
              aria-label="Billing period"
              className="relative flex rounded-full border border-[#E9E6E1] bg-white p-[3px]"
            >
              <span
                aria-hidden="true"
                style={{ transform: `translateX(${annual ? "100%" : "0%"})` }}
                className={cn(
                  "pointer-events-none absolute inset-y-[3px] left-[3px] w-[82px] rounded-full bg-[#540E44]",
                  "transition-transform duration-[350ms] motion-reduce:transition-none",
                  EASE,
                )}
              />
              {(
                [
                  { value: false, label: "Monthly" },
                  { value: true, label: "Annual" },
                ] as const
              ).map((option) => (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={annual === option.value}
                  onClick={() => setAnnual(option.value)}
                  className={cn(
                    "relative z-10 w-[82px] rounded-full py-1.5 text-[12.5px] font-medium",
                    "transition-colors duration-200 motion-reduce:transition-none",
                    annual === option.value ? "text-white" : "text-[#43404F] hover:text-[#14131A]",
                    RING,
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {annual && (
              <p className="text-[12px] font-medium text-[#540E44]">
                2 months free
              </p>
            )}
          </div>

          {/* --- the plans -------------------------------------------------- */}
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {PLANS.map((plan, index) => {
              const dark = Boolean(plan.featured);
              const total =
                plan.perEmployee === null
                  ? null
                  : (plan.perEmployee * headcount + plan.platformFee) * factor;

              return (
                <div
                  key={plan.id}
                  style={{ transitionDelay: body.on ? `${120 + index * 90}ms` : "0ms" }}
                  className={cn(
                    "flex flex-col rounded-3xl border p-6 sm:p-7",
                    dark
                      ? "border-[#540E44] bg-[#540E44]"
                      : "border-[#E9E6E1] bg-white",
                    rise(body.on),
                  )}
                >
                  <p
                    className={cn(
                      "text-[9.5px] font-bold uppercase tracking-[0.14em]",
                      dark ? "text-[#D9B6CE]" : "text-transparent select-none",
                    )}
                  >
                    {dark ? "Recommended" : "·"}
                  </p>

                  <p
                    className={cn(
                      "mt-2.5 text-[15px] font-semibold",
                      dark ? "text-white" : "text-[#14131A]",
                    )}
                  >
                    {plan.name}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[12.5px]",
                      dark ? "text-white/55" : "text-[#6E6A7C]",
                    )}
                  >
                    {plan.pitch}
                  </p>

                  {/* --- the live price --- */}
                  <p
                    className={cn(
                      "mt-5 text-[30px] font-semibold tabular-nums tracking-[-0.03em]",
                      DISPLAY,
                      dark ? "text-white" : "text-[#14131A]",
                    )}
                  >
                    {total === null ? (
                      "Custom"
                    ) : (
                      <>
                        {money(total)}
                        <span
                          className={cn(
                            "text-[14px] font-medium",
                            dark ? "text-white/50" : "text-[#6E6A7C]",
                          )}
                        >
                          {" "}
                          /month
                        </span>
                      </>
                    )}
                  </p>

                  <p
                    className={cn(
                      "mt-1.5 text-[12px] tabular-nums",
                      dark ? "text-white/55" : "text-[#6E6A7C]",
                    )}
                  >
                    {total === null
                      ? "Priced on your structure"
                      : `${money(total / headcount)} per employee${annual ? " · billed yearly" : ""}`}
                  </p>

                  {/* --- only the difference --- */}
                  <div
                    className={cn(
                      "mt-6 border-t pt-4",
                      dark ? "border-white/[0.14]" : "border-[#F2EFEB]",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[11px] font-semibold",
                        dark ? "text-white/50" : "text-[#6E6A7C]",
                      )}
                    >
                      {plan.includesLabel}
                    </p>

                    <ul className="mt-2.5 space-y-2.5">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            aria-hidden="true"
                            strokeWidth={2.4}
                            className={cn(
                              "mt-[3px] h-3.5 w-3.5 flex-none",
                              dark ? "text-[#E4C9DC]" : "text-[#540E44]",
                            )}
                          />
                          <span
                            className={cn(
                              "text-[13px] leading-relaxed",
                              dark ? "text-white/80" : "text-[#43404F]",
                            )}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={plan.cta.href}
                    className={cn(
                      "group mt-7 inline-flex h-11 items-center justify-center gap-1.5 rounded-full text-[14px] font-medium",
                      "transition-[transform,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
                      "hover:-translate-y-px active:scale-[0.98]",
                      dark
                        ? "bg-white text-[#540E44] hover:shadow-[0_10px_26px_-8px_rgba(0,0,0,0.35)]"
                        : "border border-[#E9E6E1] text-[#14131A] hover:border-[#540E44]/25 hover:shadow-[0_10px_28px_-14px_rgba(20,19,26,0.2)]",
                      EASE,
                      dark
                        ? "outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#540E44]"
                        : RING,
                      /* push the CTA to the bottom so cards of different
                         heights still line their buttons up */
                      "mt-auto",
                    )}
                  >
                    {plan.cta.label}
                    <ArrowRight
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
                        EASE,
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          <p
            className={cn(
              "mt-8 text-center text-[12px] text-[#6E6A7C]",
              rise(body.on),
            )}
          >
            {FOOTNOTE}
          </p>
        </div>
      </div>

      {/* Range inputs can't be styled with utility classes alone — the thumb
          and track are vendor pseudo-elements. */}
      <style>{`
        .pricing-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }
        .pricing-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        .pricing-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          margin-top: -7px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #540E44;
          box-shadow: 0 2px 8px rgba(20, 19, 26, 0.2);
          cursor: grab;
          transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pricing-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
        .pricing-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        .pricing-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #540E44;
          box-shadow: 0 2px 8px rgba(20, 19, 26, 0.2);
          cursor: grab;
        }
        .pricing-range:focus-visible {
          outline: 2px solid #540E44;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .pricing-range::-webkit-slider-thumb { transition: none; }
        }
      `}</style>
    </section>
  );
}