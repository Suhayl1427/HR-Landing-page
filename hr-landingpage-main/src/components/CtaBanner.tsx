"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";

/* ============================================================================
   CtaBanner.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. Dependency: lucide-react. Brand plum #540E44.

   Put this at:   src/components/CtaBanner.tsx  →  <CtaBanner /> after <Pricing />
   Put the photo: public/images/dubai-skyline.jpg

   ---------------------------------------------------------------------------
   SOURCING THE PHOTO

   Unsplash (free commercial licence). Search "Dubai skyline dusk" or
   "Dubai Marina blue hour". Two things matter:

     · DUSK, not midday. The scrim has to blend into the sky; a bright blue
       sky fights it and the whole card goes muddy.
     · TOWERS RIGHT OF CENTRE, open sky on the left. The gradient runs dark
       on the left where the headline sits, and clears on the right so the
       skyline is actually visible. A wall of buildings edge-to-edge kills it.

   Prep to ~250 KB:

     magick dubai.jpg -resize 2400x -gravity center -crop 2400x1500+0+0 \
       -modulate 88 -quality 82 public/images/dubai-skyline.jpg

   The card sits on #1E0418 underneath, so there's no white flash before the
   image loads. next/image handles AVIF/WebP and responsive sizes.

   ---------------------------------------------------------------------------
   WHY ONE PHOTO CARD AND NOT THREE

   If all three cards carry a skyline the section becomes wallpaper and nothing
   converts. One large photo banner holds the primary CTA; two quiet cards hold
   the secondary paths. Hierarchy is what makes a closing CTA strong — three
   equal cards dilute it into a menu.

   ---------------------------------------------------------------------------
   SCROLL ANIMATION

   Two layers, both off under prefers-reduced-motion:
     · the photo PARALLAXES — translates against the scroll at 0.5x, so the
       skyline drifts behind the card as the page moves past it
     · the content RISES in on arrival, staggered

   The image wrapper is 128% tall and offset -14%, so a ±44px translate never
   exposes an edge. rAF-throttled; translate3d to stay on the compositor.
========================================================================== */

const PHOTO = "/images/dubai-skyline.jpg";

/* ------------------------------ tokens ----------------------------------- */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)]";
const PARALLAX = 44;

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/** Fires once when the element scrolls in. */
function useReveal<T extends HTMLElement>(reduced: boolean) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reduced) {
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
  }, [reduced]);

  return { ref, on };
}

const rise = (on: boolean) =>
  cn(
    "transition-[opacity,transform] duration-700 motion-reduce:transition-none",
    EASE,
    on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
  );

/* ========================================================================== */

export default function CtaBanner() {
  const reduced = usePrefersReducedMotion();
  const banner = useReveal<HTMLDivElement>(reduced);
  const side = useReveal<HTMLDivElement>(reduced);

  const cardRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  /* Parallax: -1 when the card is entering from below, +1 when it's leaving. */
  useEffect(() => {
    if (reduced) return;

    let queued = false;

    const update = () => {
      queued = false;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const viewport = window.innerHeight;
      const centre = rect.top + rect.height / 2;
      const progress = (viewport / 2 - centre) / (viewport / 2 + rect.height / 2);

      setShift(Math.max(-1, Math.min(1, progress)));
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

  return (
    <section id="cta" className="bg-[#FAF9F7] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
          {/* ================= the banner ================================== */}
          <div
            ref={cardRef}
            className="relative isolate flex min-h-[460px] overflow-hidden rounded-[28px] bg-[#1E0418] ring-1 ring-inset ring-white/10 sm:min-h-[520px]"
          >
            {/* the photo — taller than the card, so parallax never shows an edge */}
            <div
              aria-hidden="true"
              style={{ transform: `translate3d(0, ${shift * PARALLAX}px, 0)` }}
              className="absolute inset-x-0 -top-[14%] h-[128%] will-change-transform"
            >
              <Image
                src={PHOTO}
                alt=""
                fill
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            {/* scrim: dark plum on the left where the type sits, clearing to
                the right so the skyline is still legible */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(100deg,rgba(24,3,19,0.95)_0%,rgba(38,6,30,0.88)_32%,rgba(84,14,68,0.55)_66%,rgba(84,14,68,0.18)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,3,19,0.65)_0%,transparent_55%)]"
            />

            <div
              ref={banner.ref}
              className="relative z-10 mt-auto max-w-xl p-8 sm:p-10 lg:p-12"
            >
              <p
                className={cn(
                  "text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/50",
                  rise(banner.on),
                )}
              >
                Ready when you are
              </p>

              <h2
                style={{ transitionDelay: banner.on ? "90ms" : "0ms" }}
                className={cn(
                  "mt-4 text-[clamp(1.9rem,3.6vw,2.8rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white",
                  DISPLAY,
                  rise(banner.on),
                )}
              >
                Your next payroll run doesn&apos;t have to feel like the last one
              </h2>

              <p
                style={{ transitionDelay: banner.on ? "170ms" : "0ms" }}
                className={cn(
                  "mt-5 max-w-md text-[15.5px] leading-relaxed text-white/65",
                  rise(banner.on),
                )}
              >
                Twenty minutes with our team, on your own org and your own numbers.
                You&apos;ll see exactly what comes off your plate — and what doesn&apos;t.
              </p>

              <div
                style={{ transitionDelay: banner.on ? "250ms" : "0ms" }}
                className={cn("mt-8 flex flex-wrap gap-3", rise(banner.on))}
              >
                <Link
                  href="/demo"
                  className={cn(
                    "group relative inline-flex h-12 items-center gap-1.5 overflow-hidden rounded-full bg-white px-6",
                    "text-[15px] font-medium text-[#540E44]",
                    "transition-[transform,box-shadow] duration-300 motion-reduce:transition-none",
                    "hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.5)] active:scale-[0.98]",
                    "outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A0621]",
                    EASE,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-y-0 left-0 w-3/5 -translate-x-[160%] skew-x-[-20deg] bg-[#540E44]/10",
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
                  href="/signup"
                  className={cn(
                    "inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-[15px] font-medium text-white backdrop-blur-sm",
                    "transition-[transform,background-color,border-color] duration-300 motion-reduce:transition-none",
                    "hover:-translate-y-px hover:border-white/50 hover:bg-white/10",
                    "outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A0621]",
                    EASE,
                  )}
                >
                  Start free trial
                </Link>
              </div>

              <ul
                style={{ transitionDelay: banner.on ? "330ms" : "0ms" }}
                className={cn(
                  "mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-white/50",
                  rise(banner.on),
                )}
              >
                {["No credit card", "Live in 3 weeks", "Migration handled for you"].map(
                  (point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-white/35"
                      />
                      {point}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* ================= the two secondary paths ==================== */}
          <div ref={side.ref} className="grid gap-3">
            {/* migration — white */}
            <Link
              href="/migration"
              style={{ transitionDelay: side.on ? "140ms" : "0ms" }}
              className={cn(
                "group flex flex-col justify-between rounded-[28px] border border-[#E9E6E1] bg-white p-7",
                "transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[#540E44]/25 hover:shadow-[0_20px_48px_-28px_rgba(20,19,26,0.28)]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#540E44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]",
                rise(side.on),
              )}
            >
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F2ECF0] text-[#540E44]">
                  <ArrowLeftRight aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
                </span>

                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-[#14131A]">
                  Already on another HRIS?
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#6E6A7C]">
                  We move your employee records, leave balances and payroll history.
                  Your team keeps working while we do it.
                </p>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#540E44]">
                See how migration works
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none",
                    EASE,
                  )}
                />
              </span>
            </Link>

            {/* talk to a human — plum */}
            <Link
              href="/contact"
              style={{ transitionDelay: side.on ? "220ms" : "0ms" }}
              className={cn(
                "group flex flex-col justify-between rounded-[28px] border border-[#540E44] bg-[#540E44] p-7",
                "transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-24px_rgba(84,14,68,0.6)]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#540E44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]",
                rise(side.on),
              )}
            >
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
                  <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
                </span>

                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-white">
                  Prefer to just ask?
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/65">
                  Get a straight answer on pricing, statutory coverage or your
                  particular edge case. No deck, no discovery call.
                </p>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white">
                Talk to an expert
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none",
                    EASE,
                  )}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}