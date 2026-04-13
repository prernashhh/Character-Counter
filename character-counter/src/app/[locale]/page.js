import HomePageClient from './HomePageClient';

export async function generateMetadata({ params }) {
  const resolvedParams = typeof params.then === "function"
    ? await params
    : params;

  const { locale } = resolvedParams;

  return {
    title: "Character Counter - Count Words & Characters Online",
    description: "Free online character counter tool to count words, characters, sentences, and more instantly. Fast, accurate, and easy to use."
  };
}

export default function HomePage() {
  return <HomePageClient />;
}