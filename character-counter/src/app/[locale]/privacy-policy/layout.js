import { getPageSeoServer } from '@/lib/seo-server';
import { buildCanonicalUrl } from '@/lib/url';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seo = await getPageSeoServer('privacyPolicy');
  const canonicalUrl = buildCanonicalUrl('/privacy-policy', locale);

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

export default function PrivacyPolicyLayout({ children }) {
  return children;
}