import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div>
            <Wordmark showKanji className="text-xl" />
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
              Focused software products, utilities, and experiments built to solve
              real problems.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/" className="text-muted transition-colors hover:text-foreground">
              Products
            </Link>
            <Link href="/about/" className="text-muted transition-colors hover:text-foreground">
              About Koryuu
            </Link>
            <Link href="/legal/privacy/" className="text-muted transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms/" className="text-muted transition-colors hover:text-foreground">
              Terms
            </Link>
            <a
              href="mailto:hello@koryuu.com"
              className="text-muted transition-colors hover:text-foreground"
            >
              hello@koryuu.com
            </a>
            <a
              href="https://mahmoud.jp"
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted transition-colors hover:text-foreground"
            >
              mahmoud.jp ↗
            </a>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Koryuu. All rights reserved.</span>
          <span>A product studio based in Tokyo · 東京</span>
        </div>
      </div>
    </footer>
  );
}
