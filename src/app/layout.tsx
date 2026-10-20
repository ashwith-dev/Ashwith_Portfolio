import type { Metadata } from "next";
import { Geist, Geist_Mono, Doto } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/ui/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true, // above-the-fold name
});

export const metadata: Metadata = {
  title: {
    default: "Ashwith Thatipally — AI & Full-Stack Developer",
    template: "%s · Ashwith",
  },
  description:
    "Portfolio of Ashwith Thatipally — Applied AI & Data Science student at IIT Jodhpur, building full-stack and AI-powered applications.",
  openGraph: {
    title: "Ashwith Thatipally",
    description:
      "Applied AI & Data Science student · full-stack & AI application developer.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwith.dev",
    siteName: "Ashwith Thatipally",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwith Thatipally",
    description: "Applied AI & Data Science student · full-stack & AI developer.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${doto.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
