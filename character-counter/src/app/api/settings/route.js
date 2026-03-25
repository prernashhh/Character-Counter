import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { normalizeSeoSettings } from '@/lib/seo-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        aboutContent: '',
        aboutUsContent: {
          sections: [],
          closingText: '',
        },
        aboutUsContacts: {
          instagramUrl: '',
          gmail: '',
          linkedinUrl: '',
        },
        socialLinks: {
          instagramUrl: 'https://instagram.com/prerna.9_',
          twitterUrl: 'https://twitter.com/prerna.9_',
          emailAddress: 'prerna.9_@gmail.com',
        },
        instagramHandle: '',
        instagramUrl: '',
        privacyPolicyContent: '',
        footerCopyrightYear: new Date().getFullYear(),
        headingSettings: {
          h1Text: 'Character Counter',
          h2Text: 'Analyze your text with confidence',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        },
        seoSettings: normalizeSeoSettings({}),
      });
    }

    settings.seoSettings = normalizeSeoSettings(settings.seoSettings || {});

    return Response.json({
      success: true,
      settings,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      aboutContent,
      aboutUsContent,
      aboutUsContacts,
      socialLinks,
      instagramHandle,
      instagramUrl,
      privacyPolicyContent,
      footerCopyrightYear,
      headingSettings,
      seoSettings,
    } = body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        aboutContent,
        aboutUsContent,
        aboutUsContacts,
        socialLinks,
        instagramHandle,
        instagramUrl,
        privacyPolicyContent,
        footerCopyrightYear: footerCopyrightYear ?? new Date().getFullYear(),
        headingSettings: headingSettings ?? {
          h1Text: 'Character Counter',
          h2Text: 'Analyze your text with confidence',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        },
        seoSettings: normalizeSeoSettings(seoSettings || {}),
      });
    } else {
      if (aboutContent !== undefined) settings.aboutContent = aboutContent;
      if (aboutUsContent !== undefined) settings.aboutUsContent = aboutUsContent;
      if (aboutUsContacts !== undefined) settings.aboutUsContacts = aboutUsContacts;
      if (socialLinks !== undefined) settings.socialLinks = socialLinks;
      if (instagramHandle !== undefined) settings.instagramHandle = instagramHandle;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (privacyPolicyContent !== undefined) settings.privacyPolicyContent = privacyPolicyContent;
      if (footerCopyrightYear !== undefined) settings.footerCopyrightYear = footerCopyrightYear;
      if (headingSettings !== undefined) settings.headingSettings = headingSettings;
      if (seoSettings !== undefined) settings.seoSettings = normalizeSeoSettings(seoSettings);

      await settings.save();
    }

    settings.seoSettings = normalizeSeoSettings(settings.seoSettings || {});

    return Response.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
