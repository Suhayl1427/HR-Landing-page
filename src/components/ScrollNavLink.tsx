"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavKey = "why" | "platform" | "pricing" | "faq";

export type ScrollNavItem = {
  key: NavKey;
  label: string;
  href: string;
};

export default function ScrollNavLink({
  item,
}: {
  item: ScrollNavItem;
}) {
  const id = item.href.startsWith("#") ? item.href.slice(1) : item.href;
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            return;
          }
        }
        setActive(false);
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <Link
      href={item.href}
      className={
        "relative inline-flex h-9 items-center rounded-full px-3 text-[13.5px] font-medium transition-colors duration-200 " +
        (active ? "text-[#5C0634]" : "text-[#43404F] hover:text-[#14131A]")
      }
    >
      {item.label}
    </Link>
  );
}

