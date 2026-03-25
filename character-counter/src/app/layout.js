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
