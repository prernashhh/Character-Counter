import connectDB from '@/lib/db';
import SeoSetting from '@/models/SeoSetting';

const DEFAULT_HOME_SEO = {
  title: 'Free Character Counter Tool',
  description: 'Count characters, words, and text length instantly with this free online tool.',
  ogImage: '/og-image.svg',
};

const DEFAULT_SEO_BY_PAGE = {
  home: DEFAULT_HOME_SEO,
  aboutus: {
    title: 'About Us | Character Count Online Tool',
    description:
      'Learn about Character Count Online Tool, our mission, and how we help users analyze text quickly and accurately.',
    ogImage: '/og-image.svg',
  },
  contactus: {
    title: 'Contact Us | Character Count Online Tool',
    description: 'Contact Character Count Online Tool for support, questions, or feedback.',
    ogImage: '/og-image.svg',
  },
  termsconditions: {
    title: 'Terms and Conditions | Character Count Online Tool',
    description: 'Read the terms and conditions for using Character Count Online Tool.',
    ogImage: '/og-image.svg',
  },
  disclaimer: {
    title: 'Disclaimer | Character Count Online Tool',
    description: 'Read the legal disclaimer for Character Count Online Tool.',
    ogImage: '/og-image.svg',
  },
  privacypolicy: {
    title: 'Privacy Policy | Character Count Online Tool',
    description: 'Read the privacy policy for Character Count Online Tool.',
    ogImage: '/og-image.svg',
  },
  blog: {
    title: 'Blog | Character Count Online Tool',
    description: 'Read the latest blog posts from Character Count Online Tool.',
    ogImage: '/og-image.svg',
  },
};

function getDefaultSeo(page) {
  return DEFAULT_SEO_BY_PAGE[page] || DEFAULT_HOME_SEO;
}

export async function getSEO(page = 'home') {
  const normalizedPage = String(page || 'home').toLowerCase();
  const fallback = getDefaultSeo(normalizedPage);

  if (!process.env.MONGODB_URI) {
    return fallback;
  }

  try {
    await connectDB();
    const seo = await SeoSetting.findOne({ page: normalizedPage }).lean();

    return {
      title: seo?.title || fallback.title,
      description: seo?.description || fallback.description,
      ogImage: seo?.ogImage || fallback.ogImage,
    };
  } catch {
    return fallback;
  }
}