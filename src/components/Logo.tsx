import Link from "next/link";

/** The Koryuu wordmark with its final letter carrying the brand accent. */
export function Wordmark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
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
