import connectDB from '@/lib/db';
import SeoSetting from '@/models/SeoSetting';

const DEFAULT_SEO_SETTINGS = {
  home: {
    metaTitle: 'Character Counter',
    metaDescription:
      'Count characters, words, sentences, paragraphs, and spaces instantly with the Character Count Online Tool.',
    ogImage: '/og-image.svg',
    h1: 'Character Counter',
    h2: '',
    h3: 'Statistics',
    h4: 'About This Tool',
    h5: '',
    h6: '',
  },
  aboutUs: {
    metaTitle: 'About Us | Character Count Online Tool',
    metaDescription:
      'Learn about Character Count Online Tool, our mission, and how we help users analyze text quickly and accurately.',
    ogImage: '/og-image.svg',
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
    ogImage: '/og-image.svg',
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
    ogImage: '/og-image.svg',
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
    ogImage: '/og-image.svg',
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
    ogImage: '/og-image.svg',
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
    ogImage: '/og-image.svg',
    h1: 'Blog Posts',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    h6: '',
  },
};

const UI_PAGE_KEYS = Object.keys(DEFAULT_SEO_SETTINGS);

const DB_PAGE_KEY_BY_UI = {
  home: 'home',
  aboutUs: 'aboutus',
  contactUs: 'contactus',
  termsConditions: 'termsconditions',
  disclaimer: 'disclaimer',
  privacyPolicy: 'privacypolicy',
  blog: 'blog',
};

const UI_PAGE_KEY_BY_DB = Object.entries(DB_PAGE_KEY_BY_UI).reduce((acc, [uiKey, dbKey]) => {
  acc[dbKey] = uiKey;
  return acc;
}, {});

function normalizePageKeyForDb(pageKey) {
  const normalized = String(pageKey || '').trim();
  if (!normalized) return 'home';
  if (DB_PAGE_KEY_BY_UI[normalized]) return DB_PAGE_KEY_BY_UI[normalized];
  if (UI_PAGE_KEY_BY_DB[normalized]) return normalized;
  return normalized.toLowerCase();
}

function uiPageKeyFromDb(dbKey) {
  return UI_PAGE_KEY_BY_DB[dbKey] || 'home';
}

function mapDocToSeoPage(pageKey, doc) {
  const fallback = DEFAULT_SEO_SETTINGS[pageKey] || DEFAULT_SEO_SETTINGS.home;

  return {
    metaTitle: doc?.title || fallback.metaTitle,
    metaDescription: doc?.description || fallback.metaDescription,
    ogImage: doc?.ogImage || fallback.ogImage,
    h1: doc?.h1 || fallback.h1,
    h2: doc?.h2 || fallback.h2,
    h3: doc?.h3 || fallback.h3,
    h4: doc?.h4 || fallback.h4,
    h5: doc?.h5 || fallback.h5,
    h6: doc?.h6 || fallback.h6,
  };
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const onlyPage = searchParams.get('page');
    const onlyDbPage = onlyPage ? normalizePageKeyForDb(onlyPage) : null;

    const dbPageKeys = Object.values(DB_PAGE_KEY_BY_UI);

    const pageFilter = onlyDbPage ? { page: onlyDbPage } : { page: { $in: dbPageKeys } };
    const docs = await SeoSetting.find(pageFilter).lean();

    const mapByPage = docs.reduce((acc, doc) => {
      acc[doc.page] = doc;
      return acc;
    }, {});

    const seoSettings = UI_PAGE_KEYS.reduce((acc, uiPageKey) => {
      const dbPageKey = DB_PAGE_KEY_BY_UI[uiPageKey];
      acc[uiPageKey] = mapDocToSeoPage(uiPageKey, mapByPage[dbPageKey]);
      return acc;
    }, {});

    if (onlyPage) {
      const resolvedUiPageKey = uiPageKeyFromDb(onlyDbPage);
      return Response.json({
        success: true,
        page: resolvedUiPageKey,
        seo: seoSettings[resolvedUiPageKey] || null,
      });
    }

    return Response.json({ success: true, seoSettings });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const incomingSeoSettings = body?.seoSettings || {};

    const ops = UI_PAGE_KEYS.map((uiPageKey) => {
      const dbPageKey = DB_PAGE_KEY_BY_UI[uiPageKey];
      const fallback = DEFAULT_SEO_SETTINGS[uiPageKey];
      const incoming = incomingSeoSettings[uiPageKey] || {};

      return {
        updateOne: {
          filter: { page: dbPageKey },
          update: {
            $set: {
              page: dbPageKey,
              title: incoming.metaTitle ?? fallback.metaTitle,
              description: incoming.metaDescription ?? fallback.metaDescription,
              ogImage: incoming.ogImage ?? fallback.ogImage,
              h1: incoming.h1 ?? fallback.h1,
              h2: incoming.h2 ?? fallback.h2,
              h3: incoming.h3 ?? fallback.h3,
              h4: incoming.h4 ?? fallback.h4,
              h5: incoming.h5 ?? fallback.h5,
              h6: incoming.h6 ?? fallback.h6,
            },
          },
          upsert: true,
        },
      };
    });

    if (ops.length > 0) {
      await SeoSetting.bulkWrite(ops, { ordered: false });
    }

    const docs = await SeoSetting.find({ page: { $in: Object.values(DB_PAGE_KEY_BY_UI) } }).lean();
    const mapByPage = docs.reduce((acc, doc) => {
      acc[doc.page] = doc;
      return acc;
    }, {});

    const seoSettings = UI_PAGE_KEYS.reduce((acc, uiPageKey) => {
      const dbPageKey = DB_PAGE_KEY_BY_UI[uiPageKey];
      acc[uiPageKey] = mapDocToSeoPage(uiPageKey, mapByPage[dbPageKey]);
      return acc;
    }, {});

    return Response.json({
      success: true,
      message: 'SEO settings updated successfully',
      seoSettings,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
