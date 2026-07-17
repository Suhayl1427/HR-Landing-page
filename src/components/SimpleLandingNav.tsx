"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MENU = [
  { label: "Why Us", href: "#why-us" },
  { label: "Platform", href: "#platform" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function getActiveIdFromHash(hash: string) {
  if (!hash) return null;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (["why-us", "platform", "pricing", "faq"].includes(id)) return id;
  return null;
}

export default function SimpleLandingNav({
  onDemo,
}: {
  onDemo?: (e: React.MouseEvent) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      MENU.map((item) => {
        const id = item.href.replace("#", "");
        return { ...item, id };
      }),
    [],
  );

  useEffect(() => {
    // Initial active from hash (if user loads with #...)
    setActiveId(getActiveIdFromHash(window.location.hash));

    const sectionIds = items.map((i) => i.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section.
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
        // Make activation feel stable while scrolling.
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      },
    );

    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  const activeColor = "#5C0634";

  return (
    <nav className="hidden items-center gap-2 sm:flex">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            key={item.href}
            href={item.href}
            className="text-[13.5px] font-medium text-[#43404F] no-underline transition-colors duration-200"
            style={isActive ? { color: activeColor } : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </a>
        );
      })}

      {/* Keep Sign In + Book a Demo visible in the header; this component only renders the simple nav links. */}

      {/* Intentionally no dropdowns. */}
      {/* Demo CTA is handled by SiteHeader so we preserve existing styling. */}
      {/* This component only supplies the nav items. */}
    </nav>
  );
}

