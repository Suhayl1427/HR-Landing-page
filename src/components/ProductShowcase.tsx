"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, RotateCcw } from "lucide-react";

/* ============================================================================
   ProductShowcase.tsx — Next.js (App Router) + TypeScript + Tailwind CSS
   ----------------------------------------------------------------------------
   Self-contained. Only dependency: lucide-react (already installed).

   Put this at:      src/components/ProductShowcase.tsx
   Put the assets at: public/videos/showcase.mp4
                      public/videos/showcase-poster.jpg

   Then in src/app/page.tsx:

     import SiteHeader from "../components/SiteHeader";
     import Hero from "../components/Hero";
     import ProductShowcase from "../components/ProductShowcase";

     export default function Home() {
       return (
         <>
           <SiteHeader />
           <main>
             <Hero />
             <ProductShowcase />
           </main>
         </>
       );
     }

   ---------------------------------------------------------------------------
   WHY THIS SECTION IS DARK

   Your mockup renders the MacBook on a pure #000000 background. On the paper
   canvas (#FAF9F7) that reads as a hard black rectangle. So the section runs
   on near-black, and the <video> uses mix-blend-mode: screen — with a screen
   blend, pure black becomes fully transparent, so the video's background
   disappears and the violet glow behind it bleeds around the device. No box,
   no edges. It also hides compression banding in the dark areas, because
   those pixels blend away too.

   The section needs `isolate` for the blend to stay contained. Don't remove it.

   ---------------------------------------------------------------------------
   WHY IT DOESN'T LOOP

   The clip is an intro: the MacBook swings in and settles. Its first and last
   frames are ~15% different, so looping would snap the device back to its
   entry angle every 5 seconds. Instead it plays once when it scrolls into
   view and holds on the resting frame. The poster is that same resting frame,
   so it looks correct before playback, if autoplay is blocked, and under
   prefers-reduced-motion.

   ---------------------------------------------------------------------------
   RE-ENCODING YOUR OWN CLIP

   The original was 3840x2160 @ 60fps, 23 MB — far too heavy for a landing
   page. This brings it to ~700 KB with no visible loss at display size:

     ffmpeg -i input.mp4 -an -vf "fps=30,scale=1600:-2:flags=lanczos" \
       -c:v libx264 -profile:v high -crf 26 -preset slow \
       -pix_fmt yuv420p -movflags +faststart public/videos/showcase.mp4

     ffmpeg -sseof -0.05 -i input.mp4 -frames:v 1 \
       -vf "scale=1600:-2:flags=lanczos" -q:v 3 \
       public/videos/showcase-poster.jpg

   Raise -crf for a smaller file, lower it for more quality. Skip WebM — on
   dark, gradient-heavy footage VP9 came out *larger* than H.264.
========================================================================== */

const VIDEO_SRC = "/videos/showcase.mp4";
const POSTER_SRC = "/videos/showcase-poster.jpg";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0B10]";

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export default function ProductShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  /* Play once, when it scrolls into view. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        /* If the browser blocks autoplay, the poster stays and the Play
           control below is the user's way in. Nothing to handle here. */
        void video.play().catch(() => undefined);
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setEnded(false);
    void video.play().catch(() => undefined);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0C0B10] py-24 sm:py-32">
      {/* The glow the video's black background will reveal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[58%] -z-10 h-[620px] w-[1000px] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,61,245,0.26),rgba(91,61,245,0.06)_55%,transparent)] blur-2xl"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Product tour
          </p>

          <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white font-[family-name:var(--font-grotesk,inherit)]">
            Spend Less Time Managing HR
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-white/50">
            Automate payroll, simplify attendance tracking, and generate accurate reports with one powerful platform
          </p>
        </div>

        {/* --- the device -------------------------------------------------- */}
        <div className="group relative mx-auto mt-14 aspect-[16/9] w-full max-w-5xl sm:mt-16">
          <video
            ref={videoRef}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setEnded(true);
            }}
            /* screen blend: pure black in the clip becomes transparent */
            className="h-full w-full object-contain mix-blend-screen"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          {/* Visible whenever the clip isn't running — so a blocked autoplay
              still leaves the visitor a way to start it. */}
          <button
            type="button"
            onClick={replay}
            aria-label={ended ? "Replay the product tour" : "Play the product tour"}
            className={cn(
              "absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full",
              "border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur",
              "transition-[opacity,background-color,border-color,color] duration-300 motion-reduce:transition-none",
              "hover:border-white/20 hover:bg-white/[0.12] hover:text-white",
              EASE,
              RING,
              playing ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            {ended ? (
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <Play aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {ended ? "Replay" : "Play"}
          </button>
        </div>

        {/* <div className="mt-12 text-center sm:mt-14">
          <Link
            href="/demo"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full text-[14.5px] font-medium text-white/80",
              "transition-colors duration-200 hover:text-white",
              RING,
            )}
          >
            See it on your own data
            <ArrowRight
              aria-hidden="true"
              className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none",
                EASE,
              )}
            />
          </Link>
        </div> */}
      </div>
    </section>
  );
}