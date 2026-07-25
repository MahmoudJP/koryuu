/**
 * The name & logo explanation — the most important section of the site.
 * Decodes 交流 (kōryū) → "Koryu" → the trailing "u" that means *you*.
 */
export function LogoStory() {
  return (
    <section id="the-name" className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="reveal overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid gap-px bg-border md:grid-cols-[1.05fr_1fr]">
          {/* Left — the mark */}
          <div className="relative flex flex-col items-center justify-center bg-surface-2 px-8 py-16 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              The name
            </span>

            <div className="jp mt-8 text-[clamp(72px,14vw,150px)] font-bold leading-none text-foreground">
              交流
            </div>
            <div className="mt-4 text-sm font-medium tracking-[0.3em] text-muted">
              KŌ · RYŪ
            </div>

            {/* The transformation: 交流 → Koryu → Koryu·u */}
            <div className="mt-10 flex items-center gap-3 text-lg font-medium text-muted">
              <span className="jp text-foreground">交流</span>
              <span className="text-accent">→</span>
              <span className="display font-semibold text-foreground">Koryu</span>
              <span className="text-accent">→</span>
              <span className="display font-bold text-foreground">
                Koryu<span className="text-accent">u</span>
              </span>
            </div>
          </div>

          {/* Right — the meaning */}
          <div className="flex flex-col justify-center gap-7 bg-surface px-8 py-12 sm:px-10">
            <p className="text-lg leading-relaxed text-foreground">
              <span className="jp font-semibold">交流</span> —{" "}
              <em className="not-italic font-semibold text-accent">kōryū</em> — is
              Japanese for <strong className="font-semibold">exchange</strong>: people,
              ideas, and cultures flowing toward one another and meeting in the middle.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Kanji char="交" reading="kō" meaning="to cross, to mix, to exchange" />
              <Kanji char="流" reading="ryū" meaning="a flow, a current, a stream" />
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <p className="text-base leading-relaxed text-foreground">
                Romanized, it reads{" "}
                <span className="display font-semibold">Koryu</span> — with one more
                letter kept: the trailing{" "}
                <span className="display text-xl font-bold text-accent">u</span>. That{" "}
                <span className="font-semibold text-accent">u</span> is{" "}
                <span className="font-semibold text-accent">you</span> — the person on
                the other side of the exchange. Every app here exists for someone, and
                that someone is built right into the name.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kanji({
  char,
  reading,
  meaning,
}: {
  char: string;
  reading: string;
  meaning: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4">
      <div className="flex items-baseline gap-3">
        <span className="jp text-4xl font-bold leading-none text-foreground">{char}</span>
        <span className="text-sm font-medium text-accent">{reading}</span>
      </div>
      <p className="mt-2.5 text-sm leading-snug text-muted">{meaning}</p>
    </div>
  );
}
