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

export const metadata = {
  metadataBase: new URL("https://charactercountonlinetool.com"),
  
  title: {
    default: "Free Character Counter Tool",
    template: "%s | Character Counter Tool"
  },
  
  description: "Count characters, words, and text length instantly with this free online tool.",
  
  openGraph: {
    title: "Free Character Counter Tool",
    description: "Count characters, words, and text length instantly with this free online tool.",
    url: "https://charactercountonlinetool.com",
    siteName: "Character Counter Tool",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Free Character Counter Tool",
    description: "Count characters and words instantly.",
    images: ["/og-image.svg"]
  },
  
  icons: {
    icon: {
      url: '/Charater Count Favicon Logo.png',
      sizes: '192x192 256x256 512x512',
      type: 'image/png',
    },
    shortcut: '/Charater Count Favicon Logo.png',
    apple: {
      url: '/Charater Count Favicon Logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({ children }) {
  return children;
}
