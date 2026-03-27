import { getSEO } from '@/lib/seo';

const DEFAULT_SEO_SETTINGS = {
  home: {
    metaTitle: 'Character Counter',
    metaDescription:
      'Count characters, words, sentences, paragraphs, and spaces instantly with the Character Count Online Tool.',
  },
  aboutUs: {
    metaTitle: 'About Us | Character Count Online Tool',
    metaDescription:
      'Learn about Character Count Online Tool, our mission, and how we help users analyze text quickly and accurately.',
  },
  contactUs: {
    metaTitle: 'Contact Us | Character Count Online Tool',
    metaDescription: 'Contact Character Count Online Tool for support, questions, or feedback.',
  },
  termsConditions: {
    metaTitle: 'Terms and Conditions | Character Count Online Tool',
    metaDescription: 'Read the terms and conditions for using Character Count Online Tool.',
  },
  disclaimer: {
    metaTitle: 'Disclaimer | Character Count Online Tool',
    metaDescription: 'Read the legal disclaimer for Character Count Online Tool.',
  },
  privacyPolicy: {
    metaTitle: 'Privacy Policy | Character Count Online Tool',
    metaDescription: 'Read the privacy policy for Character Count Online Tool.',
  },
  blog: {
    metaTitle: 'Blog | Character Count Online Tool',
    metaDescription: 'Read the latest blog posts from Character Count Online Tool.',
  },
};

const PAGE_ALIAS = {
  home: 'home',
  aboutUs: 'aboutUs',
  contactUs: 'contactUs',
  termsConditions: 'termsConditions',
  disclaimer: 'disclaimer',
  privacyPolicy: 'privacyPolicy',
  blog: 'blog',
};

export async function getSeoSettingsServer() {
  const entries = await Promise.all(
    Object.keys(PAGE_ALIAS).map(async (pageKey) => {
      const seo = await getSEO(pageKey);
      return [
        pageKey,
        {
          metaTitle: seo.title || DEFAULT_SEO_SETTINGS[pageKey].metaTitle,
          metaDescription: seo.description || DEFAULT_SEO_SETTINGS[pageKey].metaDescription,
        },
      ];
    })
  );

  return Object.fromEntries(entries);
}

export async function getPageSeoServer(pageKey) {
  const seo = await getSEO(pageKey);
  const fallback = DEFAULT_SEO_SETTINGS[pageKey] || DEFAULT_SEO_SETTINGS.home;

  return {
    metaTitle: seo.title || fallback.metaTitle,
    metaDescription: seo.description || fallback.metaDescription,
  };
}

export { DEFAULT_SEO_SETTINGS };
