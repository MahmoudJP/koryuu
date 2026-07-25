"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/apps/", label: "Apps", match: (p: string) => p.startsWith("/apps") },
  { href: "/about/", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function Nav() {
  const pathname = usePathname() || "/";
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <LogoLink />
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center">
            {links.map((l) => {
              const active = l.match(pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="ml-1 sm:ml-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
