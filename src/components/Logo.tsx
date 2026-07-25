import Link from "next/link";

/**
 * The Koryuu wordmark. The trailing "u" is rendered in the accent color
 * because it carries the brand idea: 交流 (kōryū) → Koryu + u, and the u is "you".
 */
export function Wordmark({
  className = "",
  showKanji = false,
}: {
  className?: string;
  showKanji?: boolean;
}) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      {showKanji && (
        <span className="jp text-muted/80 leading-none" aria-hidden>
          交流
        </span>
      )}
      <span className="display font-bold tracking-tight text-foreground">
        Koryu<span className="text-accent">u</span>
      </span>
    </span>
  );
}

export function LogoLink() {
  return (
    <Link
      href="/"
      aria-label="Koryuu — home"
      className="text-lg transition-opacity hover:opacity-80"
    >
      <Wordmark />
    </Link>
  );
}
