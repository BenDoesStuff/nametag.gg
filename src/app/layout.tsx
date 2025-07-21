import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import UserSession from "@/components/UserSession";
import { Analytics } from "@vercel/analytics/react";
import { initAnalytics } from "@/lib/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://nametag.gg'),
  title: {
    default: "Nametag - Your Ultimate Gamer Profile",
    template: "%s | Nametag"
  },
  description: "Create your ultimate gamer profile with Nametag. Link your accounts, show off your stats, and share your gaming identity with the world.",
  keywords: ["gaming", "profile", "esports", "gamer", "social", "friends", "steam", "discord", "twitch"],
  authors: [{ name: "Nametag Team" }],
  creator: "Nametag",
  publisher: "Nametag",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nametag",
    title: "Nametag - Your Ultimate Gamer Profile",
    description: "Create your ultimate gamer profile with Nametag. Link your accounts, show off your stats, and share your gaming identity with the world.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Nametag - Your Ultimate Gamer Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nametag - Your Ultimate Gamer Profile",
    description: "Create your ultimate gamer profile with Nametag. Link your accounts, show off your stats, and share your gaming identity with the world.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen font-sans">
        <nav className="w-full sticky top-0 z-50 bg-gray-950/90 border-b border-neon-green/30 shadow flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="text-neon-green font-extrabold text-lg sm:text-xl tracking-wide drop-shadow hover:underline">Nametag</Link>
          <div className="flex gap-2 sm:gap-4 items-center">
            <UserSession />
          </div>
        </nav>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                ${initAnalytics.toString()}
                initAnalytics();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
