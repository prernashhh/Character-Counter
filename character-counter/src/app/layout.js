import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSEO } from "@/lib/seo";

const GA_MEASUREMENT_ID = "G-6H2EVG7THY";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = "https://charactercountonlinetool.com";

function resolvePublicOgImageUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return `${baseUrl}/og-image.png`;
  }

  if (/^https:\/\//i.test(raw)) {
    return raw;
  }

  if (/^http:\/\//i.test(raw)) {
    return raw.replace(/^http:\/\//i, "https://");
  }

  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(raw)) {
    return `${baseUrl}/og-image.png`;
  }

  return `${baseUrl}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export async function generateMetadata() {
  const seo = await getSEO("home");
  const ogImageUrl = resolvePublicOgImageUrl(seo?.ogImage);

  return {
    metadataBase: new URL(baseUrl),
    title: seo?.title || "Free Character Counter Tool",
    description: seo?.description || "Default description",
    openGraph: {
      title: seo?.title || "Free Character Counter Tool",
      description: seo?.description || "Default description",
      url: baseUrl,
      siteName: "Character Counter Tool",
      images: [ogImageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Free Character Counter Tool",
      description: seo?.description || "Default description",
      images: [ogImageUrl],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
