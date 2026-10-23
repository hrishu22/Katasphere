import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katasphere.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#090D16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Katasphere — Master Coding Interviews with Real Practice",
    template: "%s | Katasphere",
  },
  description:
    "A high-performance full-stack coding platform. Solve algorithmic problems, execute code across Java, Python, C++, and JavaScript, and master technical interviews with real-time test verification.",
  applicationName: "Katasphere",
  keywords: [
    "coding interview practice",
    "leetcode alternative",
    "algorithm practice",
    "data structures",
    "system design",
    "python online compiler",
    "java code execution",
    "c++ algorithm runner",
    "blind 75 solutions",
    "competitive programming",
    "technical interview prep",
  ],
  authors: [{ name: "Katasphere Team", url: siteUrl }],
  creator: "Katasphere",
  publisher: "Katasphere",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Katasphere",
    title: "Katasphere — Master Coding Interviews with Real Practice",
    description:
      "Practice algorithmic challenges with real multi-language execution, instant judge feedback, and comprehensive test telemetry.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Katasphere — Full-Stack Coding Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katasphere — Master Coding Interviews with Real Practice",
    description:
      "Practice algorithmic challenges with real multi-language execution, instant judge feedback, and comprehensive test telemetry.",
    images: ["/og-image.png"],
    creator: "@katasphere",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased selection:bg-brand-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
