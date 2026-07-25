"use client";

import { useEffect } from "react";

/** Adds `.ready` to <body> after first paint so entrance animations run once. */
export function ReadyGate() {
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.body.classList.add("ready")),
    );
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
