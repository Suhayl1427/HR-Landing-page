"use client";

import { useEffect, useRef, useState } from "react";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["700"], display: "swap" });

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

function usePrefersReducedMotion() {
  // Avoid state+effect to satisfy strict eslint rules.
  return typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}


function useRevealOnScroll<T extends HTMLElement>(reduced: boolean) {
  const ref = useRef<T | null>(null);


  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fade-up on scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("opacity-100", "translate-y-0");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("opacity-100", "translate-y-0");
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}


// tokens (kept as constants for easy future matching)
const FIELD_BG = "#F7F7F7";
const FIELD_BORDER = "#EAEAEA";
const FOCUS_BORDER = "#5C0634";
const TEXT_INK = "#14131A";
const MUTED = "#6E6A7C";


function RequiredStar() {
  return <span className="text-[#E00000]"> *</span>;
}

export default function ContactSection() {
  const reduced = usePrefersReducedMotion();
  const revealRef = useRevealOnScroll<HTMLDivElement>(reduced);

  return (


    <section
      className="bg-[#FAF9F7]"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-[100px]">
        <div
          ref={revealRef}
          className={cn(
            "transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none",
            "will-change-transform",
            "translate-y-0 opacity-100",

          )}
        >
          <h2
            id="contact-heading"
            className={cn(
              raleway.className,
              "text-center font-bold text-[#14131A] tracking-[-0.02em]",
              "text-[32px] leading-[1.15] sm:text-[40px] lg:text-[48px]",
            )}
          >
            Get in Touch
          </h2>

          <div className="mt-10 grid gap-[64px] lg:grid-cols-2">
            {/* LEFT: Card + form */}
            <div className="order-2 sm:order-2 lg:order-1">
              <div className="rounded-[20px] bg-white p-[32px] shadow-[0_20px_48px_-28px_rgba(20,19,26,0.22)]">
                <form
                  onSubmit={(e) => {
                    // No backend / no submission.
                    e.preventDefault();
                  }}
                  className="grid gap-4"
                >
                  <Field
                    label="Name"
                    required
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                  />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field
                      label="Industry"
                      required
                      name="industry"
                      type="text"
                      placeholder="e.g., Technology"
                    />
                    <Field
                      label="Company"
                      required
                      name="company"
                      type="text"
                      placeholder="e.g., Your Company"
                    />
                  </div>

                  <Field
                    label="Phone"
                    required
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                  <Field
                    label="Email"
                    required
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />

                  <Field
                    label="Region"
                    name="region"
                    type="text"
                    placeholder="e.g., Singapore"
                  />

                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      className={cn(
                        "h-[48px] w-[170px] rounded-[10px]",
                        "bg-[#5C0634] px-4 text-center text-[14.5px] font-semibold text-white",
                        "shadow-[0_12px_30px_-12px_rgba(92,6,52,0.55)]",
                        "transition-[background-color] duration-300",
                        "hover:bg-[#4A042A]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C0634] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      )}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT: Placeholder */}
            <div className="order-1 sm:order-1 lg:order-2">
              <div
                className={cn(
                  "flex h-[420px] w-full flex-col items-center justify-center",
                  "rounded-[20px] border-2 border-dashed border-[#D9D9D9] bg-[#FCFCFD]",
                  "text-center",
                )}
              >
                <div className="flex flex-col items-center justify-center px-6">
                  <div className="text-[#14131A]">Image Placeholder</div>
                  <div className="mt-2 text-[14.5px] font-medium text-[#6E6A7C]">
                    Talk to an Expert Illustration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  name,
  type,
  placeholder,
}: {
  label: string;
  required?: boolean;
  name: string;
  type: string;
  placeholder: string;
}) {
  const id = `contact_${name}`;

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-[14px] font-semibold text-[#14131A]"
      >
        {label}
        {required ? <RequiredStar /> : null}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={cn(
          "h-[48px] w-full rounded-[10px]",
          "bg-[#F7F7F7]",
          "border border-[#EAEAEA]",
          "px-[16px] text-[14.5px] text-[#14131A]",
          "placeholder:text-[#6E6A7C]",
          "outline-none",
          "focus:border-[#5C0634] focus:outline-none",
          "transition-colors duration-200",
        )}
      />
    </div>
  );
}

