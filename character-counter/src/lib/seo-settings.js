export const DEFAULT_SEO_SETTINGS = {
  home: {
    metaTitle: 'Character Counter',
    metaDescription: 'Count characters, words, sentences, paragraphs, and spaces instantly with the Character Count Online Tool.',
    h1: 'Character Counter',
    h2: 'Analyze your text with confidence',
    h3: 'Statistics',
    h4: 'About This Tool',
    h5: '',
    h6: '',
  },
  aboutUs: {
    metaTitle: 'About Us | Character Count Online Tool',
    metaDescription: 'Learn about Character Count Online Tool, our mission, and how we help users analyze text quickly and accurately.',
    h1: 'About Us',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
  contactUs: {
    metaTitle: 'Contact Us | Character Count Online Tool',
    metaDescription: 'Contact Character Count Online Tool for support, questions, or feedback.',
    h1: 'Contact Us',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
  termsConditions: {
    metaTitle: 'Terms and Conditions | Character Count Online Tool',
    metaDescription: 'Read the terms and conditions for using Character Count Online Tool.',
    h1: 'Terms and Conditions',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
  disclaimer: {
    metaTitle: 'Disclaimer | Character Count Online Tool',
    metaDescription: 'Read the legal disclaimer for Character Count Online Tool.',
    h1: 'Disclaimer',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
  privacyPolicy: {
    metaTitle: 'Privacy Policy | Character Count Online Tool',
    metaDescription: 'Read the privacy policy for Character Count Online Tool.',
    h1: 'Privacy Policy',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
  blog: {
    metaTitle: 'Blog | Character Count Online Tool',
    metaDescription: 'Read the latest blog posts from Character Count Online Tool.',
    h1: 'Blog Posts',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
};

function mergePageSeo(defaultPageSeo, inputPageSeo = {}) {
  return {
    metaTitle: inputPageSeo.metaTitle ?? defaultPageSeo.metaTitle,
    metaDescription: inputPageSeo.metaDescription ?? defaultPageSeo.metaDescription,
    h1: inputPageSeo.h1 ?? defaultPageSeo.h1,
    h2: inputPageSeo.h2 ?? defaultPageSeo.h2,
    h3: inputPageSeo.h3 ?? defaultPageSeo.h3,
    h4: inputPageSeo.h4 ?? defaultPageSeo.h4,
    h5: inputPageSeo.h5 ?? defaultPageSeo.h5,
    h6: inputPageSeo.h6 ?? defaultPageSeo.h6,
  };
}

export function normalizeSeoSettings(input = {}) {
  return {
    home: mergePageSeo(DEFAULT_SEO_SETTINGS.home, input.home),
    aboutUs: mergePageSeo(DEFAULT_SEO_SETTINGS.aboutUs, input.aboutUs),
    contactUs: mergePageSeo(DEFAULT_SEO_SETTINGS.contactUs, input.contactUs),
    termsConditions: mergePageSeo(DEFAULT_SEO_SETTINGS.termsConditions, input.termsConditions),
    disclaimer: mergePageSeo(DEFAULT_SEO_SETTINGS.disclaimer, input.disclaimer),
    privacyPolicy: mergePageSeo(DEFAULT_SEO_SETTINGS.privacyPolicy, input.privacyPolicy),
    blog: mergePageSeo(DEFAULT_SEO_SETTINGS.blog, input.blog),
  };
}
