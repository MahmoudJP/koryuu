/**
 * LegalDoc — renders a plain-text legal document (the verbatim EULA / Privacy
 * Policy shipped with the apps) as styled, readable HTML.
 *
 * The source files in src/legal/*.txt use a fixed, consistent layout:
 *   ====...====   document title border        (=== / TITLE / ===)
 *   ----...----   section heading border        (--- / "N. TITLE" / ---)
 *   • ...         bullet items (wrapped lines indented underneath)
 *   Label:   val  contact / definition rows (two+ spaces after the colon)
 *   Version / Effective date ...               document metadata lines
 *   everything else = paragraph text (wrapped across lines, re-joined here)
 *
 * The legal wording is never altered — this only adds structure/links so the
 * finalized text reads well on the web. Keep the .txt files as the source of
 * truth (copied from versions/v1.5/{EULA,PRIVACY_POLICY}.txt).
 */
import * as React from "react";

type Node =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string; id: string }
  | { kind: "p"; text: string }
  | { kind: "li"; text: string }
  | { kind: "def"; text: string }
  | { kind: "meta"; text: string };

function isDivider(line: string, ch: "=" | "-"): boolean {
  const t = line.trim();
  return t.length >= 3 && [...t].every((c) => c === ch);
}

function isStandalone(t: string): boolean {
  return (
    /^version\b/i.test(t) ||
    /^effective date/i.test(t) ||
    /^last updated/i.test(t) ||
    /^[\w/&() .-]+:\s{2,}\S/.test(t)
  );
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parse(text: string): Node[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const nodes: Node[] = [];
  let i = 0;
  let titleDone = false;
  let para: string | null = null;

  const flush = () => {
    if (para !== null) {
      nodes.push({ kind: "p", text: para });
      para = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    // Title block: === / TITLE / ===
    if (isDivider(line, "=")) {
      if (!titleDone && i + 2 < lines.length && isDivider(lines[i + 2], "=")) {
        flush();
        nodes.push({ kind: "h1", text: lines[i + 1].trim() });
        titleDone = true;
        i += 3;
        continue;
      }
      i += 1; // lone / closing border
      continue;
    }

    // Section heading: --- / HEADING / ---
    if (isDivider(line, "-")) {
      if (i + 2 < lines.length && isDivider(lines[i + 2], "-")) {
        flush();
        const heading = lines[i + 1].trim();
        nodes.push({ kind: "h2", text: heading, id: slug(heading) });
        i += 3;
        continue;
      }
      i += 1;
      continue;
    }

    if (t === "") {
      flush();
      i += 1;
      continue;
    }

    if (t.startsWith("•")) {
      flush();
      nodes.push({ kind: "li", text: t.replace(/^•\s*/, "") });
      i += 1;
      continue;
    }

    if (isStandalone(t)) {
      flush();
      nodes.push({ kind: /:\s{2,}/.test(t) ? "def" : "meta", text: t });
      i += 1;
      continue;
    }

    // Indented continuation of the previous bullet.
    const last = nodes[nodes.length - 1];
    if (para === null && /^\s/.test(line) && last && last.kind === "li") {
      last.text += " " + t;
      i += 1;
      continue;
    }

    // Paragraph text — re-join wrapped lines with a space.
    para = para === null ? t : para + " " + t;
    i += 1;
  }
  flush();
  return nodes;
}

function linkify(text: string, keyBase: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re =
    /(https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  let last = 0;
  let idx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    let token = m[0];
    let trail = "";
    while (/[.,;:)]$/.test(token)) {
      trail = token.slice(-1) + trail;
      token = token.slice(0, -1);
    }
    const isUrl = token.startsWith("http");
    parts.push(
      <a
        key={`${keyBase}-${idx}`}
        href={isUrl ? token : `mailto:${token}`}
        className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
        {...(isUrl ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {token}
      </a>,
    );
    if (trail) parts.push(trail);
    last = re.lastIndex;
    idx++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function LegalDoc({ text }: { text: string }) {
  const nodes = parse(text);
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < nodes.length) {
    const n = nodes[i];

    if (n.kind === "li") {
      const items: React.ReactNode[] = [];
      while (i < nodes.length && nodes[i].kind === "li") {
        const node = nodes[i] as Extract<Node, { kind: "li" }>;
        items.push(
          <li key={key} className="text-[15px] leading-relaxed text-muted">
            {linkify(node.text, key)}
          </li>,
        );
        key++;
        i++;
      }
      out.push(
        <ul
          key={key++}
          className="mt-4 list-disc space-y-2 pl-5 marker:text-accent"
        >
          {items}
        </ul>,
      );
      continue;
    }

    if (n.kind === "def") {
      const rows: React.ReactNode[] = [];
      while (i < nodes.length && nodes[i].kind === "def") {
        const node = nodes[i] as Extract<Node, { kind: "def" }>;
        const [label, ...rest] = node.text.split(/:\s{2,}/);
        const value = rest.join(": ");
        rows.push(
          <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="min-w-40 font-medium text-foreground">{label}:</dt>
            <dd className="text-muted">{linkify(value, key)}</dd>
          </div>,
        );
        key++;
        i++;
      }
      out.push(
        <dl
          key={key++}
          className="mt-5 space-y-2 rounded-2xl border border-border bg-surface p-5 text-[15px]"
        >
          {rows}
        </dl>,
      );
      continue;
    }

    switch (n.kind) {
      case "h1":
        out.push(
          <h1
            key={key++}
            className="display text-[clamp(28px,5vw,40px)] font-extrabold leading-tight text-foreground"
          >
            {n.text}
          </h1>,
        );
        break;
      case "meta":
        out.push(
          <p key={key++} className="mt-1 text-sm text-muted">
            {n.text}
          </p>,
        );
        break;
      case "h2":
        out.push(
          <h2
            key={key++}
            id={n.id}
            className="display mt-12 scroll-mt-24 text-xl font-semibold text-foreground"
          >
            {n.text}
          </h2>,
        );
        break;
      case "p":
        out.push(
          <p key={key++} className="mt-4 text-[15px] leading-relaxed text-muted">
            {linkify(n.text, key)}
          </p>,
        );
        break;
    }
    i++;
  }

  return <div>{out}</div>;
}
