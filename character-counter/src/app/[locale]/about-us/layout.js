import { getPageSeoServer } from '@/lib/seo-server';

export async function generateMetadata() {
  const seo = await getPageSeoServer('aboutUs');
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };
}

export default function AboutUsLayout({ children }) {
  return children;
}
