import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AppGrid } from "@/components/AppGrid";
import { apps } from "@/data/apps";

const KORYUU_WORDS = ["Keep", "Outcomes", "Reliable;", "Yield", "Uncomplicated", "Utility."];

export default function HomePage() {
  const platformCount = new Set(apps.flatMap((app) => app.platforms)).size;

  return (
    <>
      <Nav />

      <main>
        <section id="apps" className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
          <header className="reveal mb-10 border-b border-border pb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Koryuu
            </span>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <h1
                aria-label="Keep Outcomes Reliable; Yield Uncomplicated Utility."
                className="display flex max-w-3xl flex-wrap gap-x-[0.28em] gap-y-1 text-[clamp(36px,5.4vw,62px)] font-extrabold leading-[1.04] text-foreground"
              >
                {KORYUU_WORDS.map((word) => (
                  <span key={word} className="inline-block whitespace-nowrap">
                    <span className="text-accent">{word.charAt(0)}</span>
                    {word.slice(1)}
                  </span>
                ))}
              </h1>
              <div className="lg:pb-1">
                <p className="text-base leading-relaxed text-muted">
                  Koryuu is a growing collection of focused software for production,
                  learning, macOS, and everyday systems.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground">
                  <span>{apps.length} active builds</span>
                  <span>{platformCount} platforms</span>
                  <span>Built in Tokyo</span>
                </div>
              </div>
            </div>
          </header>

          <AppGrid />
        </section>

        <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
          <div className="border-t border-border pt-12">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              What lives under Koryuu
            </span>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Products",
                  body: "Standalone software designed to solve a clear problem and grow into a dependable product.",
                },
                {
                  number: "02",
                  title: "Utilities",
                  body: "Focused tools that remove friction from production work, macOS, and everyday routines.",
                },
                {
                  number: "03",
                  title: "Experiments",
                  body: "Useful ideas tested in real workflows until they earn a lasting place in the catalogue.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
                  <span className="text-xs font-semibold text-muted">{item.number}</span>
                  <h2 className="display mt-8 text-2xl font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
