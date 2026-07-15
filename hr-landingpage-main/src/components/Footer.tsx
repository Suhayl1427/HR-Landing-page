"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ============================================================================
   Footer.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. No dependencies at all — not even lucide.

   Put this at:  src/components/Footer.tsx

     <main>
       ...
       <CtaBanner />
     </main>
     <Footer />          ← outside <main>, it isn't main content

   ---------------------------------------------------------------------------
   WHAT A FOOTER IS, WITH NO NAV AND NO SOCIAL

   It can't be a sitemap, and the CTA banner is directly above it — repeating
   "Book a demo" here would read as desperate. So this is the credits, not the
   finale. Three things:

     · the sign-off      — the page's whole thesis in one line
     · the contact block — the details a real buyer needs (email, phone, office)
     · the legal strip   — copyright, Privacy, Terms

   ---------------------------------------------------------------------------
   THE CLOSING BEAT

   The page's motif is a chain: the hero lattice, the WhyUs spine, the approval
   chain in Features. So the divider hairline here IS that chain, with three
   nodes on it. When the footer scrolls into view, a single plum pulse travels
   the line, lights each node as it passes, and exits. The nodes stay lit.

   It fires ONCE. It never loops. The system runs one last approval and goes
   quiet — which is the only thing a footer should do.

   Under prefers-reduced-motion the nodes are simply lit, no travel.

   ---------------------------------------------------------------------------
   ⚠  PLACEHOLDERS

   Everything in CONTACT and COMPANY is invented. Replace before shipping.

   Privacy and Terms are the ONLY links in this file. They're legal, not
   navigation — but if you meant literally zero links, delete the LEGAL array
   and the strip that renders it.
========================================================================== */

const COMPANY = {
  name: "YourOffice HR",
  entity: "YourOffice HR Pte Ltd",
  signOff: "One employee record. Everything else follows.",
};

const CONTACT = [
  { label: "hello@youroffice.hr", href: "mailto:hello@youroffice.hr" },
  { label: "+65 6123 4567", href: "tel:+6561234567" },
  { label: "Level 12, 1 Raffles Place, Singapore 048616", href: null },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/* Node positions along the divider, as a percentage of its width. */
const NODES = [20, 50, 80];
/** How long the pulse takes to cross the whole line. */
const TRAVEL_MS = 2600;

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#540E44] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/* Module scope: evaluated once on the server and once on the client. */
const YEAR = new Date().getFullYear();

/* ========================================================================== */

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const [travelling, setTravelling] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /* Reduced motion: the nodes are simply already lit. No travel. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLit(true);
        setTravelling(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="border-t border-[#E9E6E1] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* --- the sign-off ------------------------------------------------ */}
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#14131A] text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8.6v3.1M12 11.7H7.6v2.9M12 11.7h4.4v2.9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    className="opacity-45"
                  />
                  <circle cx="12" cy="6.2" r="2.3" className="fill-white" />
                  <circle cx="7.6" cy="16.9" r="2" className="fill-white" />
                  <circle cx="16.4" cy="16.9" r="2" className="fill-white" />
                </svg>
              </span>
              <span
                className={cn(
                  "text-[19px] font-semibold tracking-[-0.02em] text-[#14131A]",
                  DISPLAY,
                )}
              >
                {COMPANY.name}
              </span>
            </div>

            <p
              className={cn(
                "mt-7 max-w-sm text-[clamp(1.3rem,2.4vw,1.7rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-[#14131A]",
                DISPLAY,
              )}
            >
              {COMPANY.signOff}
            </p>
          </div>

          {/* --- contact --- */}
          <address className="not-italic sm:text-right">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#B4B0BC]">
              Talk to us
            </p>

            <ul className="mt-4 space-y-2.5">
              {CONTACT.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={cn(
                        "rounded text-[14px] text-[#43404F] transition-colors duration-200 hover:text-[#540E44]",
                        RING,
                      )}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="block max-w-[16rem] text-[14px] leading-relaxed text-[#6E6A7C] sm:ml-auto">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </address>
        </div>

        {/* --- the chain, at rest ------------------------------------------ */}
        <div className="relative mt-16 h-px w-full bg-[#E9E6E1] sm:mt-20">
          {NODES.map((position, index) => (
            <span
              key={position}
              aria-hidden="true"
              style={{
                left: `${position}%`,
                /* each node lights exactly as the pulse reaches it */
                transitionDelay: travelling
                  ? `${(position / 100) * TRAVEL_MS}ms`
                  : "0ms",
              }}
              className={cn(
                "absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white",
                "transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none",
                EASE,
                lit
                  ? "border-[#540E44] bg-[#540E44] shadow-[0_0_0_3px_rgba(84,14,68,0.10)]"
                  : "border-[#E9E6E1]",
              )}
            />
          ))}

          {/* the single pulse — one crossing, then gone for good */}
          {travelling && (
            <>
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#540E44]/15 blur-[2px] animate-[footerPulse_2600ms_cubic-bezier(0.45,0,0.55,1)_forwards]"
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#540E44] animate-[footerPulse_2600ms_cubic-bezier(0.45,0,0.55,1)_forwards]"
              />
            </>
          )}
        </div>

        {/* --- legal -------------------------------------------------------- */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p
            suppressHydrationWarning
            className="text-[12.5px] text-[#6E6A7C]"
          >
            © {YEAR} {COMPANY.entity}
          </p>

          <ul className="flex items-center gap-5">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded text-[12.5px] text-[#6E6A7C] transition-colors duration-200 hover:text-[#14131A]",
                    RING,
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes footerPulse {
          0%   { left: 0%;   opacity: 0; }
          6%   {             opacity: 1; }
          94%  {             opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </footer>
  );
}