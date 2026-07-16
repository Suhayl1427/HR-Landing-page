"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";


/* ============================================================================
   site-header.tsx  —  Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Navigation simplified per requirements:
   - Only keep: Logo (left), Sign In, Book a Demo
   - Remove: all dropdown/mega-menu logic and nav items
   - Do NOT change design / colors / typography / spacing / height / animations.
========================================================================== */

const BRAND = {
  name: "Verta",
  signIn: { label: "Sign in", href: "/sign-in" },
  demo: { label: "Book a demo", href: "/demo" },
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY =
  "font-[family-name:var(--font-grotesk,inherit)] font-semibold tracking-[-0.02em]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/* ============================================================================
   SiteHeader
========================================================================== */

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // No navigation dropdown state anymore; keep the original fixed header shell.
  const noop = useCallback(() => {}, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={noop}>
      <div className="px-3 sm:px-5">
        <div
          className={cn(
            "relative mx-auto border px-2 backdrop-blur-xl",
            "transition-[max-width,height,margin-top,background-color,border-color,box-shadow] duration-[600ms] motion-reduce:transition-none",
            EASE,
            scrolled
              ? "mt-2.5 h-14 max-w-5xl rounded-full border-[#E9E6E1] bg-[#FAF9F7]/75 shadow-[0_1px_2px_rgba(20,19,26,0.04),0_10px_28px_-12px_rgba(20,19,26,0.16)]"
              : "mt-0 h-[72px] max-w-7xl rounded-full border-transparent bg-transparent shadow-none",
          )}
        >
          <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex min-w-0 justify-start">
              <Logo />
            </div>

            {/* Removed desktop navigation entirely */}

            <div className="flex items-center justify-end gap-1">
              {/* Responsive: keep existing breakpoint hiding */}
              <SignInLink className="hidden sm:inline-flex" />
              <DemoButton />

              {/* Mobile menu toggle removed (no navigation remains) */}
            </div>
          </div>
        </div>
      </div>

      {/* MobileNav removed (no dropdown/accordion remains) */}
    </header>
  );
}

/* ============================================================================
   Logo
========================================================================== */

function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className="inline-flex items-center"
    >
      <Image
        src="/images/logo.png"
        alt="YourOfficeHR"
        width={220}
        height={60}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}

/* ============================================================================
   Actions
========================================================================== */

function SignInLink({ className }: { className?: string }) {
  return (
    <Link
      href={BRAND.signIn.href}
      className={cn(
        "group relative inline-flex h-9 items-center rounded-full px-3 text-[13.5px] font-medium",
        "text-[#43404F] transition-colors duration-200 hover:text-[#14131A]",
        RING,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-3 bottom-[7px] h-px origin-left scale-x-0 bg-[#14131A]",
          "transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none",
          EASE,
        )}
      />
      {BRAND.signIn.label}
    </Link>
  );
}

function DemoButton() {
  return (
    <Link
      href={BRAND.demo.href}
      className={cn(
        "group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-4",
        "bg-[#5c0634] text-[13.5px] font-medium text-white",
        "shadow-[0_6px_18px_-6px_rgba(91,61,245,0.55)]",
        "transition-[transform,background-color,box-shadow] duration-300 motion-reduce:transition-none",
        "hover:-translate-y-px hover:bg-[#4327D9] hover:shadow-[0_10px_26px_-8px_rgba(91,61,245,0.65)]",
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
        {BRAND.demo.label}
        <ArrowRight
          aria-hidden="true"
          className={cn(
            "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
            EASE,
          )}
        />
      </span>
    </Link>
  );
}

