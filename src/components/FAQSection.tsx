"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HelpCircle, Info, Search, Shield, Sparkles, Zap } from "lucide-react";
import * as React from "react";

import FAQItem from "./FAQItem";
import { FAQS } from "./faqData";

type TopicBadge = {
  label: string;
  icon: React.ReactNode;
};

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

const BADGES: TopicBadge[] = [
  { label: "Payroll", icon: <Zap size={16} className="text-[#5C0634]" /> },
  {
    label: "Attendance",
    icon: <Search size={16} className="text-[#5C0634]" />,
  },
  { label: "Leave", icon: <Info size={16} className="text-[#5C0634]" /> },
  {
    label: "Security",
    icon: <Shield size={16} className="text-[#5C0634]" />,
  },
];

function useScrollFade() {
  const reducedMotion = useReducedMotion();
  const [on, setOn] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      setOn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return {
    ref,
    motionClass: cn(
      "transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none",
      on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
    ),
  };
}

export default function FAQSection() {
  const reducedMotion = useReducedMotion();
  const { ref, motionClass } = useScrollFade();

  const [openId, setOpenId] = React.useState<string>(FAQS[0]?.id ?? "");



  return (
    <section className="bg-[#FAF9F7]" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1280px] px-6 pt-[100px] pb-[100px]">
        <div className={motionClass} ref={ref}>
          <div className="flex flex-col items-center text-center">
            <span
              className="inline-flex items-center rounded-full bg-[rgba(92,6,52,0.08)] px-4 py-2 text-[12.5px] font-semibold text-[#5C0634]"
              aria-label="FAQ badge"
            >
              FAQ
            </span>

            <h2
              id="faq-heading"
              className="mt-5 text-[48px] font-bold leading-[1.02] tracking-[-0.03em] text-[#14131A] font-[family-name:var(--font-grotesk,inherit)] sm:text-[40px]"
            >
              Frequently Asked Questions
            </h2>

            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[#6E6A7C]">
              Answers for teams evaluating HRFlow—built to reduce process drift across
              payroll, timekeeping, leave, hiring, and secure employee records.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-[880px]">
            <motion.div
              initial={false}
              className="flex flex-col gap-6"
            >
              {FAQS.map((item, index) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  index={index}
                  isOpen={openId === item.id}
                  onToggle={(id) => setOpenId((prev) => (prev === id ? prev : id))}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Keep motion reduced-motion compliant without inline animation CSS. */}
      {reducedMotion ? null : null}
    </section>
  );
}

