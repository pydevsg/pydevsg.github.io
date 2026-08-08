import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/site.config";
import { CRT } from "@/components/CRT";
import { GridLines } from "@/components/GridLines";
import { CommandBar } from "@/components/CommandBar";
import { Konami } from "@/components/Konami";
import { ACCENT_KEY } from "@/components/AccentToggle";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s — ${site.domain}`,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.domain,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@jsdevsg",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0E",
  colorScheme: "dark",
};

/** Restores the visitor's accent before first paint so it never flashes. */
const accentScript = `try{var a=localStorage.getItem(${JSON.stringify(ACCENT_KEY)});document.documentElement.dataset.accent=(a==='acid'||a==='magenta')?a:${JSON.stringify(site.accent)}}catch(e){document.documentElement.dataset.accent=${JSON.stringify(site.accent)}}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company },
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  email: `mailto:${site.email}`,
  knowsAbout: [...site.stack],
  sameAs: site.socials.map((s) => s.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-accent={site.accent} className={`${mono.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative antialiased">
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:text-xs focus:text-accent"
        >
          skip to content
        </a>
        <GridLines />
        <div className="relative z-10">{children}</div>
        <CRT />
        <CommandBar />
        <Konami />
      </body>
    </html>
  );
}
