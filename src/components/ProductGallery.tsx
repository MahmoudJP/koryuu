"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AppScreenshot } from "@/data/apps";

interface ProductGalleryProps {
  appName: string;
  accent: string;
  primary: AppScreenshot;
  gallery?: AppScreenshot[];
  intro?: string;
  fit?: "cover" | "contain";
}

export function ProductGallery({
  appName,
  accent,
  primary,
  gallery = [],
  intro,
  fit = "cover",
}: ProductGalleryProps) {
  const items = useMemo(() => [primary, ...gallery], [primary, gallery]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const close = () => setActiveIndex(null);
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + direction + items.length) % items.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft" && items.length > 1) {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + items.length) % items.length,
        );
      }
      if (event.key === "ArrowRight" && items.length > 1) {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % items.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [activeIndex, items.length]);

  const open = (index: number, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setActiveIndex(index);
  };

  return (
    <section id="interface" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-3xl">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          Product interface
        </p>
        <h2 className="display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          See {appName} in context.
        </h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item, index) => (
          <figure
            key={item.src}
            className={`overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_64px_-44px_rgba(0,0,0,0.6)] ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              className="group/image relative block w-full cursor-zoom-in overflow-hidden border-b border-border bg-surface-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
              aria-label={`Enlarge ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={1536}
                height={1024}
                priority={index === 0}
                className={`h-auto max-h-[720px] w-full transition-transform duration-500 group-hover/image:scale-[1.012] ${
                  index === 0 && fit === "contain" ? "object-contain p-6 sm:p-10" : "object-cover object-top"
                }`}
                sizes={index === 0 ? "(min-width: 1152px) 1088px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              />
              <span className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                Enlarge ↗
              </span>
            </button>
            <figcaption className="p-5 sm:p-6">
              <h3 className="display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/90 p-3 backdrop-blur-xl sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${appName} screenshot viewer`}
            tabIndex={-1}
            className="relative flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0f] shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{items[activeIndex].title}</p>
                <p className="text-xs text-white/55">
                  {activeIndex + 1} of {items.length}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-xl text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close screenshot viewer"
              >
                ×
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-black">
              <Image
                src={items[activeIndex].src}
                alt={items[activeIndex].alt}
                width={1920}
                height={1280}
                className="max-h-[calc(95vh-10rem)] w-full object-contain"
                sizes="100vw"
              />
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/65 text-xl text-white backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
                    aria-label="Previous screenshot"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/65 text-xl text-white backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
                    aria-label="Next screenshot"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/65 sm:px-5">
              {items[activeIndex].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
