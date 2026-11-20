import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// next/font downloads these at build time and serves them with the site, so there is
// no extra request and less layout shift. Each exposes a CSS variable that
// globals.css maps to Tailwind's font-sans and font-heading.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

// The address used to turn relative metadata URLs (like the Open Graph image) into full ones.
// On Vercel it is the production domain; locally it is localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Site-wide defaults. A page can set its own title (the template adds the site name) and
// description. app/opengraph-image.png is picked up automatically as the share preview image.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sacrament Meeting Planner | Maple Grove Ward",
    template: "%s | Sacrament Meeting Planner",
  },
  description: "Plan, view and print sacrament meeting programs for Maple Grove Ward.",
  openGraph: {
    siteName: "Sacrament Meeting Planner",
    type: "website",
    title: "Sacrament Meeting Planner",
    description: "Plan, view and print sacrament meeting programs for Maple Grove Ward.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${lora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
