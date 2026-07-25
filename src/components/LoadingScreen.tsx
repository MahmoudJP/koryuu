"use client";

import { useEffect, useMemo, useState } from "react";
import { apps } from "@/data/apps";

/**
 * "Confluence" — Koryuu's intro loading screen.
 *
 * The site is a home for many apps, and 交流 (kōryū) means *exchange / flow*.
 * So the many projects — each a point in its own accent color — stream inward
 * along curved currents and merge into a single luminous core, which resolves
 * into the 交流 kanji and the Koryuu wordmark. Many → one → you.
 *
 * It lives in the root layout, so it plays once on a real page load and stays
 * out of the way during client-side navigation (the layout never remounts).
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  // One inbound current per app, fanned around a ring in the app's own accent.
  const currents = useMemo(() => {
    const n = apps.length;
    return apps.map((app, i) => {
      // Even fan with a touch of deterministic variation for an organic feel.
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2 + (i % 2 ? 0.18 : -0.14);
      const radius = 168 + ((i * 37) % 90); // 168–258px out from center
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      return {
        color: app.accent,
        tx: `${tx.toFixed(1)}px`,
        ty: `${ty.toFixed(1)}px`,
        delay: `${(i * 55).toFixed(0)}ms`,
      };
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("kr-loading");

    // The full confluence plays for everyone — it's the brand's hero moment.
    // Reduced-motion users still get it, just without the exit blur (handled
    // in CSS), so the experience is calmer but never empty.
    const holdMs = 2150;
    const exitMs = 720;

    const t1 = window.setTimeout(() => setExiting(true), holdMs);
    const t2 = window.setTimeout(() => {
      // Unlock scroll the moment the curtain is gone. The component then
      // renders null but never unmounts (it lives in the root layout), so
      // this can't be left to effect cleanup.
      root.classList.remove("kr-loading");
      setDone(true);
    }, holdMs + exitMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      root.classList.remove("kr-loading");
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`kr-loader${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading Koryuu"
      aria-live="polite"
    >
      <div className="kr-loader__glow" aria-hidden />

      <div className="kr-stage" aria-hidden>
        {/* Inbound currents — one per app, in its own accent color. */}
        <div className="kr-field">
          {currents.map((c, i) => (
            <span
              key={i}
              className="kr-dot"
              style={
                {
                  "--tx": c.tx,
                  "--ty": c.ty,
                  "--c": c.color,
                  "--d": c.delay,
                } as React.CSSProperties
              }
            />
          ))}
          {/* The core they all merge into. */}
          <span className="kr-core" />
        </div>

        {/* The mark that emerges from the confluence. */}
        <div className="kr-mark">
          <span className="kr-kanji jp">交流</span>
          <span className="kr-word display">
            Koryu<span className="kr-u">u</span>
          </span>
          <span className="kr-meter">
            <span className="kr-meter__fill" />
          </span>
        </div>
      </div>
    </div>
  );
}
