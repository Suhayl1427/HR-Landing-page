"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Circle } from "lucide-react";
import * as React from "react";

import type { FAQ } from "./faqData";

type FAQItemProps = {
  item: FAQ;
  isOpen: boolean;
  onToggle: (id: string) => void;
  index: number;
};

export default function FAQItem({ item, isOpen, onToggle, index }: FAQItemProps) {
  const reducedMotion = useReducedMotion();
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <div className="rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_20px_50px_rgba(20,19,26,0.08)]">
      <button
        id={buttonId}
        type="button"
        className={
          "w-full text-left px-6 py-5 sm:px-7 sm:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C0634] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        }
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => onToggle(item.id)}
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F8EEF4]"
          >
            <Circle size={16} className="text-[#5C0634]" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-[#14131A] sm:text-[15px]">
              {item.question}
            </p>
          </div>

          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-[2px] flex-none"
          >
            <ChevronDown size={18} className="text-[#5C0634]" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 sm:px-7 sm:pb-7">
              <p
                className="text-[14.5px] leading-relaxed text-[#6E6A7C]"
                style={{
                  // Prevent hydration differences due to inline CSS values.
                  // This is only an animation cadence token.
                  // eslint-disable-next-line react/no-unknown-property
                  animationDelay: `${Math.min(220, index * 35)}ms`,
                }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none"
        animate={{
          boxShadow: isOpen
            ? "0 20px 50px rgba(92,6,52,0.22)"
            : "0 20px 50px rgba(20,19,26,0.08)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}

