import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSEO } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const seo = await getSEO("home");

  return {
    metadataBase: new URL("https://charactercountonlinetool.com"),
    title: seo?.title || "Free Character Counter Tool",
    description:
      seo?.description ||
      "Count characters, words, and text length instantly with this free online tool.",
    openGraph: {
      title: seo?.title || "Free Character Counter Tool",
      description:
        seo?.description ||
        "Count characters, words, and text length instantly with this free online tool.",
      url: "https://charactercountonlinetool.com",
      siteName: "Character Counter Tool",
      images: [seo?.ogImage || "/og-image.svg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Free Character Counter Tool",
      description:
        seo?.description ||
        "Count characters, words, and text length instantly with this free online tool.",
      images: [seo?.ogImage || "/og-image.svg"],
    },
    icons: {
      icon: {
        url: "/Charater Count Favicon Logo.png",
        sizes: "192x192 256x256 512x512",
        type: "image/png",
      },
      shortcut: "/Charater Count Favicon Logo.png",
      apple: {
        url: "/Charater Count Favicon Logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    },
  };
}

export default function RootLayout({ children }) {
  return children;
}
