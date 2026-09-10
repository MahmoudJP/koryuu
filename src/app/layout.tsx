import type { Metadata } from "next";
import { Inter, Sora, Noto_Sans_JP } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/components/ThemeToggle";
import { ReadyGate } from "@/components/ReadyGate";
import { IntroReveal } from "@/components/IntroReveal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://koryuu.com"),
  title: {
    default: "Koryuu — focused software products",
    template: "%s · Koryuu",
  },
  description:
    "Focused software products, utilities, and experiments for work, learning, macOS, and everyday systems.",
  keywords: ["Koryuu", "software products", "macOS apps", "learning tools", "Tokyo"],
  openGraph: {
    title: "Koryuu — focused software products",
    description:
      "Focused software products, utilities, and experiments for work, learning, macOS, and everyday systems.",
    url: "https://koryuu.com",
    siteName: "Koryuu",
    type: "website",
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${notoJp.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <IntroReveal />
        <div className="bg-aurora" aria-hidden />
        {children}
        <ReadyGate />
      </body>
    </html>
  );
}
