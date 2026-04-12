import { getPageSeoServer } from '@/lib/seo-server';
import { buildCanonicalUrl } from '@/lib/url';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seo = await getPageSeoServer('disclaimer');
  const canonicalUrl = buildCanonicalUrl('/disclaimer', locale);

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

export default function DisclaimerLayout({ children }) {
  return children;
}