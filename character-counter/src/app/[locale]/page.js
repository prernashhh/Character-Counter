import HomePageClient from './HomePageClient';
import { getSEO } from '@/lib/seo';
import { getHomePageSettings } from '@/lib/public-page-content';
import { buildCanonicalUrl } from '@/lib/url';

export async function generateMetadata({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? await params : (params || {});
  const locale = resolvedParams.locale || 'en';
  const seo = await getSEO('home');
  const canonicalUrl = buildCanonicalUrl('/', locale);

  return {
    title: seo?.title || 'Character Counter & Word Counter Tool',
    description:
      seo?.description ||
      'Free online character counter and word counter to instantly count words, characters, sentences, and paragraphs.',
    keywords:
      seo?.keywords ||
      'character counter, word counter, text analyzer, character count tool, online writing tool',
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function HomePage({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? await params : (params || {});
  const locale = resolvedParams.locale || 'en';
  const initialHomeSettings = await getHomePageSettings(locale);

  return (
    <>
      <HomePageClient initialHomeSettings={initialHomeSettings} />
    </>
  );
}