import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinyImage - Compress Images Instantly",
  description: "Reduce image file sizes without compromising quality. Support for JPEG, PNG, and WebP formats with advanced compression settings and batch processing.",
  keywords: ["image compression", "optimize images", "reduce file size", "JPEG", "PNG", "WebP", "batch processing"],
  authors: [{ name: "Chirag Singhal", url: "https://github.com/chirag127" }],
  creator: "Chirag Singhal",
  publisher: "TinyImage",
  openGraph: {
    title: "TinyImage - Compress Images Instantly",
    description: "Reduce image file sizes without compromising quality. Support for JPEG, PNG, and WebP formats.",
    url: "https://tinyimage.vercel.app",
    siteName: "TinyImage",
    images: [
      {
        url: "/og-image.png",
        width: 400,
        height: 300,
        alt: "TinyImage - Image Compression Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyImage - Compress Images Instantly",
    description: "Reduce image file sizes without compromising quality.",
    images: ["/og-image.png"],
    creator: "@chirag127",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
