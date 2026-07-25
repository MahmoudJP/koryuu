import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-6xl place-items-center px-5 py-28 text-center sm:px-8">
        <div>
          <div className="jp text-7xl font-bold text-accent">迷</div>
          <h1 className="display mt-6 text-4xl font-bold text-foreground">
            Lost in translation.
          </h1>
          <p className="mt-3 text-muted">The page you&apos;re looking for isn&apos;t here.</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
