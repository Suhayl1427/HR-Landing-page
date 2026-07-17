"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

/* ============================================================================
   site-header.tsx  —  Next.js (App Router) + TypeScript + Tailwind CSS

   Navigation only (no redesign):
   - Desktop (lg+): Logo | Why Us | Platform | Pricing | FAQ | Sign In | Book a Demo
   - Tablet/Mobile (<lg): Logo | Hamburger | Sign In | Book a Demo
   - Hamburger panel (smooth): white, rounded, shadow, padding 24px
     containing ONLY: Why Us / Platform / Pricing / FAQ
========================================================================== */

const BRAND = {
  name: "YourOfficeHR",
  signIn: { label: "Sign In", href: "/sign-in" },
  demo: { label: "Book a Demo", href: "#contact" },
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

const NAV = [
  { label: "Why Us", href: "#why-us" },
  { label: "Platform", href: "#platform" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

type NavItem = (typeof NAV)[number];

function getIdFromHref(href: string): string {
  return href.startsWith("#") ? href.slice(1) : href;
}

/* Small helper to keep active highlighting via IntersectionObserver, without
   adding dropdowns or changing colors/typography outside of the active text. */
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Avoid calling setState synchronously within effect body.
    const initial = (() => {
      const hash = window.location.hash;
      if (!hash) return null;
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      return ids.includes(id) ? id : null;
    })();

    if (initial) setActiveId(initial);

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (!intersecting.length) return;

        intersecting.sort((a, b) => {
          const ar = a.intersectionRatio ?? 0;
          const br = b.intersectionRatio ?? 0;
          return br - ar;
        });

        const top = intersecting[0].target as HTMLElement;
        if (top?.id) setActiveId(top.id);
      },
      {
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const noop = useCallback(() => {}, []);

  const sectionIds = useMemo(() => NAV.map((n) => getIdFromHref(n.href)), []);
  const activeId = useActiveSection(sectionIds);

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

            {/* Desktop navigation (lg+) */}
            <div className="hidden items-center justify-center gap-12 lg:flex">
              {NAV.map((item) => {
                const id = getIdFromHref(item.href);
                const isActive = activeId === id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-[13.5px] font-medium text-[#43404F] no-underline transition-colors duration-200"
                    style={isActive ? { color: "#5C0634" } : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Tablet/Mobile actions (hamburger on right) */}
            <div className="flex items-center justify-end gap-1">
              <div className="lg:hidden">
                <HamburgerButton
                  open={mobileOpen}
                  onToggle={() => setMobileOpen((v) => !v)}
                />
              </div>

              <SignInLink className="hidden sm:inline-flex lg:inline-flex" />
              <DemoButton />
            </div>
          </div>

          {/* Mobile menu panel */}
          <div
            className={cn(
              "lg:hidden",
              "overflow-hidden",
              "transition-[max-height,opacity] duration-300 motion-reduce:transition-none",
              mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="mx-2 mb-2 rounded-[18px] bg-white p-6 shadow-[0_18px_44px_-24px_rgba(20,19,26,0.22)]">
              <nav className="flex flex-col gap-5">
                {NAV.map((item) => {
                  const id = getIdFromHref(item.href);
                  const isActive = activeId === id;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-[15px] font-medium text-[#43404F] no-underline transition-colors duration-200 hover:text-[#5C0634]"
                      style={isActive ? { color: "#5C0634" } : undefined}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="YourOfficeHR home" className="inline-flex items-center">
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

function HamburgerButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent",
        "text-[#43404F] transition-colors duration-200",
        "hover:text-[#5C0634]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C0634]",
      )}
    >
      <Menu aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

