import HomePageClient from './HomePageClient';
import { getSEO } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? await params : (params || {});
  const baseUrl = 'https://charactercountonlinetool.com';
  const locale = resolvedParams.locale || 'en';
  const seo = await getSEO('home');

  return {
    title: seo?.title || 'Character Counter & Word Counter Tool',
    description:
      seo?.description ||
      'Free online character counter and word counter to instantly count words, characters, sentences, and paragraphs.',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Character Counter & Word Counter Tool</h1>
      <HomePageClient />
    </>
  );
}