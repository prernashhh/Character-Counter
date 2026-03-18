import { getPageSeoServer } from '@/lib/seo-server';

export async function generateMetadata() {
  const seo = await getPageSeoServer('contactUs');
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };
}

export default function ContactUsLayout({ children }) {
  return children;
}
