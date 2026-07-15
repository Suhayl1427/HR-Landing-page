"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Banknote,
  ChartNoAxesColumn,
  ChevronDown,
  ListChecks,
  MessagesSquare,
  Network,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

/* ============================================================================
   site-header.tsx  —  Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Drop-in. Only dependency:  npm i lucide-react
   No Tailwind config needed — every colour is a literal arbitrary value.

   Usage in app/page.tsx:
     import SiteHeader from "@/components/site-header";
     export default function Home() {
       return (
         <>
           <SiteHeader />
           <main className="pt-[108px]">…</main>   // header is fixed: pad the page
         </>
       );
     }

   Optional: wire Space Grotesk in app/layout.tsx with next/font
   (variable: "--font-grotesk") and the wordmark picks it up automatically.
========================================================================== */

/* ----------------------------- content ---------------------------------- */

const BRAND = {
  name: "Verta",
  signIn: { label: "Sign in", href: "/sign-in" },
  demo: { label: "Book a demo", href: "/demo" },
};

const ANNOUNCEMENT = {
  label: "HR KPI Manager 2.0 is live",
  linkLabel: "Read the changelog",
  href: "/changelog",
};

type MenuKey = "platform";

type NavItem = {
  label: string;
  href: string;
  /** Present = opens a dropdown instead of navigating on hover. */
  menu?: MenuKey;
};

/** Four items. Any more and "minimal" stops being true. */
const NAV: NavItem[] = [
  { label: "Platform", href: "/platform", menu: "platform" },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/resources" },
];

type Module = {
  label: string;
  href: string;
  /** One line, written from the user's side of the screen. */
  blurb: string;
  icon: LucideIcon;
  badge?: string;
};

const MODULES: Module[] = [
  {
    label: "Employee Self Service",
    href: "/platform/self-service",
    blurb: "Leave, claims and payslips, owned by employees.",
    icon: UserRound,
  },
  {
    label: "HR KPI Manager",
    href: "/platform/kpi",
    blurb: "Goals, reviews and live people metrics on one board.",
    icon: ChartNoAxesColumn,
    badge: "New",
  },
  {
    label: "Payroll",
    href: "/platform/payroll",
    blurb: "Multi-country runs with CPF and statutory filings.",
    icon: Banknote,
  },
  {
    label: "Workflow Approval",
    href: "/platform/workflows",
    blurb: "Approval chains with a full audit trail.",
    icon: ListChecks,
  },
  {
    label: "Org Chart",
    href: "/platform/org-chart",
    blurb: "Current structure, headcount and reporting lines.",
    icon: Network,
  },
  {
    label: "Team Chat",
    href: "/platform/chat",
    blurb: "Announcements and DMs inside the HR workspace.",
    icon: MessagesSquare,
  },
];

/* ------------------------------ tokens ----------------------------------- */
/* Literal strings so Tailwind's scanner still sees the classes.
   paper #FAF9F7 · ink #14131A · muted #6E6A7C · line #E9E6E1 · brand #5B3DF5 */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DISPLAY = "font-[family-name:var(--font-grotesk,inherit)] font-semibold tracking-[-0.02em]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

const CLOSE_DELAY_MS = 130;

/* ============================================================================
   SiteHeader
========================================================================== */

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  /** Hover intent: open instantly, close on a grace period so you can cross
   *  the gap from the trigger into the panel without it snapping shut. */
  const handleHover = useCallback(
    (menu?: MenuKey) => {
      clearCloseTimer();
      if (menu) setOpenMenu(menu);
      else scheduleClose();
    },
    [clearCloseTimer, scheduleClose],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* Lock the page behind the mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={scheduleClose}>
      <AnnouncementBar collapsed={scrolled} />

      <div className="px-3 sm:px-5">
        {/* The morph: full-bleed bar at rest, glass island once you scroll. */}
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
          {/* 1fr | auto | 1fr — the nav is centred on the PAGE, not merely
              between the logo and the buttons. justify-between can't do this. */}
          <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex min-w-0 justify-start">
              <Logo />
            </div>

            <nav aria-label="Main" className="hidden justify-center lg:flex">
              <DesktopNav
                openMenu={openMenu}
                onHover={handleHover}
                onToggle={(menu) =>
                  setOpenMenu((current) => (current === menu ? null : menu))
                }
              />
            </nav>

            <div className="flex items-center justify-end gap-1">
              <SignInLink className="hidden sm:inline-flex" />
              <DemoButton />
              <MenuToggle
                open={mobileOpen}
                onClick={() => setMobileOpen((value) => !value)}
              />
            </div>
          </div>

          <PlatformMenu
            open={openMenu === "platform"}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          />
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

/* ============================================================================
   Logo — a three-node reporting line: one manager, two reports.
   The Org Chart module, reduced to its smallest legible form.
========================================================================== */

function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className={cn("group inline-flex items-center gap-2.5 rounded-xl", RING)}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-[10px] bg-[#14131A] text-white",
          "transition-transform duration-500 group-hover:-rotate-6 motion-reduce:transition-none",
          EASE,
        )}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
          <path
            d="M12 8.6v3.1M12 11.7H7.6v2.9M12 11.7h4.4v2.9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="opacity-45 transition-opacity duration-500 group-hover:opacity-90"
          />
          <circle
            cx="12"
            cy="6.2"
            r="2.3"
            className="fill-white transition-colors duration-500 group-hover:fill-[#5B3DF5]"
          />
          <circle cx="7.6" cy="16.9" r="2" className="fill-white" />
          <circle cx="16.4" cy="16.9" r="2" className="fill-white" />
        </svg>
      </span>

      <span className={cn("text-[19px] text-[#14131A]", DISPLAY)}>{BRAND.name}</span>
    </Link>
  );
}

/* ============================================================================
   AnnouncementBar — collapses to zero height on scroll so the island
   can float clean. Dismissible.
========================================================================== */

function AnnouncementBar({ collapsed }: { collapsed: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const hidden = dismissed || collapsed;

  return (
    <div
      aria-hidden={hidden}
      className={cn(
        "overflow-hidden bg-[#14131A] text-white transition-[height,opacity] duration-500 motion-reduce:transition-none",
        EASE,
        hidden ? "h-0 opacity-0" : "h-9 opacity-100",
      )}
    >
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center gap-2.5 px-4">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#5B3DF5]" />
        <p className="text-[12.5px] text-white/70">{ANNOUNCEMENT.label}</p>

        <Link
          href={ANNOUNCEMENT.href}
          tabIndex={hidden ? -1 : 0}
          className={cn(
            "group inline-flex items-center gap-1 rounded-full text-[12.5px] font-medium text-white",
            "transition-colors duration-200 hover:text-[#F0EDFF]",
            RING,
          )}
        >
          {ANNOUNCEMENT.linkLabel}
          <ArrowRight
            aria-hidden="true"
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
              EASE,
            )}
          />
        </Link>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          tabIndex={hidden ? -1 : 0}
          aria-label="Dismiss announcement"
          className={cn(
            "absolute right-4 grid h-6 w-6 place-items-center rounded-full text-white/40",
            "transition-colors duration-200 hover:bg-white/10 hover:text-white",
            RING,
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   DesktopNav — the signature. A pill tracks the pointer between items with
   an expo ease, quoting the row-highlight motion the app itself uses in
   Org Chart and the approval queue. The nav moves like the product moves.
========================================================================== */

type Pill = { x: number; w: number; visible: boolean };

function DesktopNav({
  openMenu,
  onHover,
  onToggle,
}: {
  openMenu: MenuKey | null;
  onHover: (menu?: MenuKey) => void;
  onToggle: (menu: MenuKey) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [pill, setPill] = useState<Pill>({ x: 0, w: 0, visible: false });
  const [hovering, setHovering] = useState(false);

  const slideTo = useCallback((element: HTMLElement | null) => {
    const list = listRef.current;
    if (!element || !list) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = element.getBoundingClientRect();
    setPill({ x: itemBox.left - listBox.left, w: itemBox.width, visible: true });
  }, []);

  /* Pointer left the list: park the pill on the open trigger rather than
     snapping it away, otherwise the panel looks orphaned. */
  useEffect(() => {
    if (hovering) return;
    const anchor = NAV.find((item) => item.menu && item.menu === openMenu);
    if (anchor) {
      slideTo(itemRefs.current[anchor.label]);
      return;
    }
    setPill((previous) => ({ ...previous, visible: false }));
  }, [hovering, openMenu, slideTo]);

  const itemClass = cn(
    "flex items-center gap-1 rounded-full px-3 py-2 text-[13.5px] font-medium",
    "text-[#43404F] transition-colors duration-200 hover:text-[#14131A]",
    RING,
  );

  return (
    <ul
      ref={listRef}
      className="relative flex items-center gap-0.5"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onBlur={(event) => {
        if (!listRef.current?.contains(event.relatedTarget as Node)) {
          setHovering(false);
        }
      }}
    >
      <span
        aria-hidden="true"
        style={{
          transform: `translate3d(${pill.x}px, -50%, 0)`,
          width: `${pill.w}px`,
          opacity: pill.visible ? 1 : 0,
        }}
        className={cn(
          "pointer-events-none absolute left-0 top-1/2 h-9 rounded-full bg-black/[0.055]",
          "transition-[transform,width,opacity] duration-[450ms] motion-reduce:transition-none",
          EASE,
        )}
      />

      {NAV.map((item) => {
        const isTrigger = Boolean(item.menu);
        const isOpen = isTrigger && openMenu === item.menu;

        return (
          <li
            key={item.label}
            ref={(node) => {
              itemRefs.current[item.label] = node;
            }}
            className="relative z-10"
            onMouseEnter={(event) => {
              slideTo(event.currentTarget);
              onHover(item.menu);
            }}
          >
            {isTrigger ? (
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls="platform-menu"
                aria-haspopup="true"
                onFocus={(event) => slideTo(event.currentTarget.parentElement)}
                onClick={() => item.menu && onToggle(item.menu)}
                className={cn(itemClass, isOpen && "text-[#14131A]")}
              >
                {item.label}
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className={cn(
                    "h-3.5 w-3.5 text-[#6E6A7C] transition-transform duration-300 motion-reduce:transition-none",
                    EASE,
                    isOpen && "rotate-180 text-[#14131A]",
                  )}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                onFocus={(event) => slideTo(event.currentTarget.parentElement)}
                className={itemClass}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ============================================================================
   PlatformMenu — the six modules, plus a rail that earns the panel's width
   by booking the demo.
========================================================================== */

function PlatformMenu({
  open,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      id="platform-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "absolute left-1/2 top-full z-40 w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 pt-3",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "origin-top rounded-3xl border border-[#E9E6E1] bg-white/95 p-2 backdrop-blur-xl",
          "shadow-[0_24px_60px_-20px_rgba(20,19,26,0.18),0_4px_12px_-4px_rgba(20,19,26,0.06)]",
          "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
          EASE,
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="grid gap-2 md:grid-cols-[1fr_260px]">
          <div className="grid gap-0.5 sm:grid-cols-2">
            {MODULES.map((module, index) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    "group/module flex gap-3 rounded-2xl p-3 transition-colors duration-200",
                    "hover:bg-[#F0EDFF] focus-visible:bg-[#F0EDFF]",
                    RING,
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-[10px]",
                      "border border-[#E9E6E1] bg-[#FAF9F7] text-[#6E6A7C] transition-colors duration-200",
                      "group-hover/module:border-[#5B3DF5]/25 group-hover/module:bg-white group-hover/module:text-[#5B3DF5]",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>

                  <span
                    style={{ transitionDelay: open ? `${40 + index * 22}ms` : "0ms" }}
                    className={cn(
                      "min-w-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                      EASE,
                      open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-medium text-[#14131A]">
                        {module.label}
                      </span>
                      {module.badge && (
                        <span className="rounded-full bg-[#5B3DF5]/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-[#5B3DF5]">
                          {module.badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6E6A7C]">
                      {module.blurb}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#14131A] p-4 text-white">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#5B3DF5]/40 blur-2xl"
            />

            <div className="relative">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Live demo
              </p>
              <p className="mt-2.5 text-[14.5px] font-medium leading-snug">
                See payroll, approvals and KPIs run on one employee record.
              </p>
            </div>

            <Link
              href={BRAND.demo.href}
              tabIndex={open ? 0 : -1}
              className={cn(
                "group/rail relative mt-6 inline-flex items-center gap-1.5 self-start rounded-full",
                "bg-white px-3.5 py-2 text-[13px] font-medium text-[#14131A]",
                "transition-transform duration-300 hover:-translate-y-px motion-reduce:transition-none",
                EASE,
              )}
            >
              {BRAND.demo.label}
              <ArrowRight
                aria-hidden="true"
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300 group-hover/rail:translate-x-0.5 motion-reduce:transition-none",
                  EASE,
                )}
              />
            </Link>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-[#F2EFEB] px-3 pb-1 pt-3">
          <p className="text-[12.5px] text-[#6E6A7C]">One record. Every module.</p>
          <Link
            href="/pricing"
            tabIndex={open ? 0 : -1}
            className={cn(
              "rounded-full text-[12.5px] font-medium text-[#5B3DF5] transition-colors duration-200 hover:text-[#4327D9]",
              RING,
            )}
          >
            Compare plans
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Actions
========================================================================== */

/** Text button. An underline wipes in from the left. */
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

/** Solid violet. Lifts, deepens, and a skewed sheen sweeps across on hover. */
function DemoButton() {
  return (
    <Link
      href={BRAND.demo.href}
      className={cn(
        "group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-4",
        "bg-[#5B3DF5] text-[13.5px] font-medium text-white",
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

/** Two bars that cross into an X. No icon swap, no flicker. */
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  const bar = cn(
    "absolute h-[1.5px] w-4 rounded-full bg-[#14131A] transition-transform duration-300 motion-reduce:transition-none",
    EASE,
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn(
        "relative ml-1 grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 hover:bg-black/[0.05] lg:hidden",
        RING,
      )}
    >
      <span className={cn(bar, open ? "translate-y-0 rotate-45" : "-translate-y-[3px]")} />
      <span className={cn(bar, open ? "translate-y-0 -rotate-45" : "translate-y-[3px]")} />
    </button>
  );
}

/* ============================================================================
   MobileNav — sheet with a Platform accordion and a staggered reveal.
========================================================================== */

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 -z-10 bg-[#14131A]/20 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "relative mx-3 mt-2 origin-top overflow-hidden rounded-3xl border bg-white lg:hidden",
          "shadow-[0_24px_60px_-20px_rgba(20,19,26,0.18)]",
          "transition-[max-height,opacity,transform,border-color] duration-[450ms] motion-reduce:transition-none",
          EASE,
          open
            ? "max-h-[calc(100dvh-7rem)] translate-y-0 border-[#E9E6E1] opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 border-transparent opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="overflow-y-auto p-2">
          {NAV.map((item, index) => (
            <div
              key={item.label}
              style={{ transitionDelay: open ? `${60 + index * 40}ms` : "0ms" }}
              className={cn(
                "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                EASE,
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
            >
              {item.menu ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((value) => !value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium text-[#14131A]",
                      "transition-colors duration-200 hover:bg-[#F2EFEB]",
                      RING,
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className={cn(
                        "h-4 w-4 text-[#6E6A7C] transition-transform duration-300 motion-reduce:transition-none",
                        EASE,
                        expanded && "rotate-180 text-[#14131A]",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-[400ms] motion-reduce:transition-none",
                      EASE,
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="ml-4 border-l border-[#E9E6E1] pl-2">
                        {MODULES.map((module) => {
                          const Icon = module.icon;
                          return (
                            <li key={module.href}>
                              <Link
                                href={module.href}
                                onClick={onClose}
                                tabIndex={open && expanded ? 0 : -1}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] text-[#43404F]",
                                  "transition-colors duration-200 hover:bg-[#F0EDFF] hover:text-[#14131A]",
                                  RING,
                                )}
                              >
                                <Icon
                                  aria-hidden="true"
                                  className="h-4 w-4 flex-none text-[#6E6A7C]"
                                  strokeWidth={1.6}
                                />
                                {module.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-[15px] font-medium text-[#14131A]",
                    "transition-colors duration-200 hover:bg-[#F2EFEB]",
                    RING,
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-2 flex flex-col gap-2 border-t border-[#F2EFEB] p-2 pt-4">
            <Link
              href={BRAND.signIn.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-full border border-[#E9E6E1]",
                "text-[15px] font-medium text-[#14131A] transition-colors duration-200 hover:bg-[#FAF9F7]",
                RING,
              )}
            >
              {BRAND.signIn.label}
            </Link>

            <Link
              href={BRAND.demo.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={cn(
                "group inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full",
                "bg-[#5B3DF5] text-[15px] font-medium text-white",
                "shadow-[0_6px_18px_-6px_rgba(91,61,245,0.55)] transition-colors duration-200 hover:bg-[#4327D9]",
                RING,
              )}
            >
              {BRAND.demo.label}
              <ArrowRight
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
                  EASE,
                )}
              />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}