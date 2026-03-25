import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { normalizeSeoSettings } from '@/lib/seo-settings';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    let settings = await Settings.findOne().lean();

    if (!settings) {
      const createdSettings = await Settings.create({
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
          linkedinUrl: 'https://linkedin.com/in/prerna.9_',
          emailAddress: 'prerna.9_@gmail.com',
        },
        instagramHandle: '',
        instagramUrl: '',
        privacyPolicyContent: '',
        contactUsContent: '',
        termsConditionsContent: '',
        disclaimerContent: '',
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
      settings = createdSettings.toObject();
    }

    settings.seoSettings = normalizeSeoSettings(settings.seoSettings || {});

    if (scope === 'home') {
      return Response.json({
        success: true,
        settings: {
          aboutContent: settings.aboutContent ?? '',
          footerCopyrightYear: settings.footerCopyrightYear ?? new Date().getFullYear(),
          headingSettings: settings.headingSettings ?? {
            h1Text: 'Character Counter',
            h2Text: 'Analyze your text with confidence',
            h3Text: 'Statistics',
            h4Text: 'About This Tool',
            tone: 'professional',
          },
          seoSettings: {
            home: settings.seoSettings.home,
          },
          socialLinks: settings.socialLinks ?? {
            instagramUrl: 'https://instagram.com/prerna.9_',
            linkedinUrl: 'https://linkedin.com/in/prerna.9_',
            emailAddress: 'prerna.9_@gmail.com',
          },
        },
      });
    }

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
      contactUsContent,
      termsConditionsContent,
      disclaimerContent,
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
        contactUsContent,
        termsConditionsContent,
        disclaimerContent,
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
      if (contactUsContent !== undefined) settings.contactUsContent = contactUsContent;
      if (termsConditionsContent !== undefined) settings.termsConditionsContent = termsConditionsContent;
      if (disclaimerContent !== undefined) settings.disclaimerContent = disclaimerContent;
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
