import connectDB from '@/lib/db';
import SeoSetting from '@/models/SeoSetting';

const DEFAULT_HOME_SEO = {
  title: 'Free Character Counter Tool',
  description: 'Count characters, words, and text length instantly with this free online tool.',
  ogImage: '/og-image.svg',
};

const DEFAULT_SEO_BY_PAGE = {
  home: DEFAULT_HOME_SEO,
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