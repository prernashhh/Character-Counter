import { getPageSeoServer } from '@/lib/seo-server';

export async function generateMetadata() {
  const seo = await getPageSeoServer('termsConditions');
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };
}

export default function TermsConditionsLayout({ children }) {
  return children;
}
