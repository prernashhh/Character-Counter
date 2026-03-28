import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    let settings = await Settings.findOne().lean();

    if (!settings) {
      const now = new Date();
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
          emailAddress: 'iamdineshswami@gmail.com',
        },
        instagramHandle: '',
        instagramUrl: '',
        privacyPolicyContent: '',
        contactUsContent: '',
        contactUsEmail: 'iamdineshswami@gmail.com',
        termsConditionsContent: '',
        disclaimerContent: '',
        footerCopyrightYear: new Date().getFullYear(),
        headingSettings: {
          h1Text: 'Character Counter',
          h2Text: '',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        },
        staticPagesLastUpdated: {
          aboutUs: now,
          contactUs: now,
          termsConditions: now,
          privacyPolicy: now,
          disclaimer: now,
        },
        pageClosingTexts: {
          aboutUs: 'We value your trust and will keep improving this tool for you.',
          contactUs: 'Thank you for reaching out. We appreciate your time and feedback.',
          termsConditions: 'By continuing to use this service, you agree to these terms and conditions.',
          privacyPolicy: 'Your privacy matters to us and we are committed to protecting your data.',
          disclaimer: 'Please use this tool responsibly and review this disclaimer regularly.',
          blog: 'Thanks for reading. Check back soon for more helpful updates.',
        },
      });
      settings = createdSettings.toObject();
    }

    const fallbackDate = settings.updatedAt || settings.createdAt || new Date();
    settings.staticPagesLastUpdated = {
      aboutUs: settings.staticPagesLastUpdated?.aboutUs || fallbackDate,
      contactUs: settings.staticPagesLastUpdated?.contactUs || fallbackDate,
      termsConditions: settings.staticPagesLastUpdated?.termsConditions || fallbackDate,
      privacyPolicy: settings.staticPagesLastUpdated?.privacyPolicy || fallbackDate,
      disclaimer: settings.staticPagesLastUpdated?.disclaimer || fallbackDate,
    };

    if (scope === 'home') {
      return Response.json(
        {
          success: true,
          settings: {
            aboutContent: settings.aboutContent ?? '',
            footerCopyrightYear: settings.footerCopyrightYear ?? new Date().getFullYear(),
            headingSettings: settings.headingSettings ?? {
              h1Text: 'Character Counter',
              h2Text: '',
              h3Text: 'Statistics',
              h4Text: 'About This Tool',
              tone: 'professional',
            },
            socialLinks: settings.socialLinks ?? {
              instagramUrl: 'https://instagram.com/prerna.9_',
              linkedinUrl: 'https://linkedin.com/in/prerna.9_',
              emailAddress: 'iamdineshswami@gmail.com',
            },
          },
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          },
        }
      );
    }

    if (scope === 'public-pages') {
      return Response.json(
        {
          success: true,
          settings: {
            aboutUsContent: settings.aboutUsContent ?? { sections: [], closingText: '' },
            contactUsContent: settings.contactUsContent ?? '',
            contactUsEmail: settings.contactUsEmail ?? settings.socialLinks?.emailAddress ?? 'iamdineshswami@gmail.com',
            termsConditionsContent: settings.termsConditionsContent ?? '',
            privacyPolicyContent: settings.privacyPolicyContent ?? '',
            disclaimerContent: settings.disclaimerContent ?? '',
            pageClosingTexts: settings.pageClosingTexts ?? {
              aboutUs: 'We value your trust and will keep improving this tool for you.',
              contactUs: 'Thank you for reaching out. We appreciate your time and feedback.',
              termsConditions: 'By continuing to use this service, you agree to these terms and conditions.',
              privacyPolicy: 'Your privacy matters to us and we are committed to protecting your data.',
              disclaimer: 'Please use this tool responsibly and review this disclaimer regularly.',
              blog: 'Thanks for reading. Check back soon for more helpful updates.',
            },
            staticPagesLastUpdated: settings.staticPagesLastUpdated,
            updatedAt: settings.updatedAt,
            createdAt: settings.createdAt,
          },
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=120, stale-while-revalidate=600',
          },
        }
      );
    }

    const settingsWithoutSeo = { ...settings };
    delete settingsWithoutSeo.seoSettings;

    return Response.json({
      success: true,
      settings: settingsWithoutSeo,
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
      contactUsEmail,
      termsConditionsContent,
      disclaimerContent,
      pageClosingTexts,
      footerCopyrightYear,
      headingSettings,
    } = body;

    const toComparable = (value) => {
      if (value && typeof value.toObject === 'function') {
        return value.toObject();
      }

      return value ?? null;
    };

    const hasChanged = (currentValue, nextValue) => {
      return JSON.stringify(toComparable(currentValue)) !== JSON.stringify(toComparable(nextValue));
    };

    const now = new Date();

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
        contactUsEmail,
        termsConditionsContent,
        disclaimerContent,
        footerCopyrightYear: footerCopyrightYear ?? new Date().getFullYear(),
        headingSettings: headingSettings ?? {
          h1Text: 'Character Counter',
          h2Text: '',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        },
        staticPagesLastUpdated: {
          aboutUs: now,
          contactUs: now,
          termsConditions: now,
          privacyPolicy: now,
          disclaimer: now,
        },
        pageClosingTexts,
      });
    } else {
      if (!settings.staticPagesLastUpdated) {
        settings.staticPagesLastUpdated = {
          aboutUs: now,
          contactUs: now,
          termsConditions: now,
          privacyPolicy: now,
          disclaimer: now,
        };
      }

      if (aboutContent !== undefined) settings.aboutContent = aboutContent;
      if (aboutUsContent !== undefined) {
        if (hasChanged(settings.aboutUsContent, aboutUsContent)) {
          settings.staticPagesLastUpdated.aboutUs = now;
        }
        settings.aboutUsContent = aboutUsContent;
      }
      if (aboutUsContacts !== undefined) settings.aboutUsContacts = aboutUsContacts;
      if (socialLinks !== undefined) settings.socialLinks = socialLinks;
      if (instagramHandle !== undefined) settings.instagramHandle = instagramHandle;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (privacyPolicyContent !== undefined) {
        if (hasChanged(settings.privacyPolicyContent, privacyPolicyContent)) {
          settings.staticPagesLastUpdated.privacyPolicy = now;
        }
        settings.privacyPolicyContent = privacyPolicyContent;
      }
      if (contactUsContent !== undefined) {
        if (hasChanged(settings.contactUsContent, contactUsContent)) {
          settings.staticPagesLastUpdated.contactUs = now;
        }
        settings.contactUsContent = contactUsContent;
      }
      if (contactUsEmail !== undefined) {
        if (hasChanged(settings.contactUsEmail, contactUsEmail)) {
          settings.staticPagesLastUpdated.contactUs = now;
        }
        settings.contactUsEmail = contactUsEmail;
      }
      if (termsConditionsContent !== undefined) {
        if (hasChanged(settings.termsConditionsContent, termsConditionsContent)) {
          settings.staticPagesLastUpdated.termsConditions = now;
        }
        settings.termsConditionsContent = termsConditionsContent;
      }
      if (disclaimerContent !== undefined) {
        if (hasChanged(settings.disclaimerContent, disclaimerContent)) {
          settings.staticPagesLastUpdated.disclaimer = now;
        }
        settings.disclaimerContent = disclaimerContent;
      }
      if (pageClosingTexts !== undefined) {
        if (hasChanged(settings.pageClosingTexts?.aboutUs, pageClosingTexts.aboutUs)) {
          settings.staticPagesLastUpdated.aboutUs = now;
        }
        if (hasChanged(settings.pageClosingTexts?.contactUs, pageClosingTexts.contactUs)) {
          settings.staticPagesLastUpdated.contactUs = now;
        }
        if (hasChanged(settings.pageClosingTexts?.termsConditions, pageClosingTexts.termsConditions)) {
          settings.staticPagesLastUpdated.termsConditions = now;
        }
        if (hasChanged(settings.pageClosingTexts?.privacyPolicy, pageClosingTexts.privacyPolicy)) {
          settings.staticPagesLastUpdated.privacyPolicy = now;
        }
        if (hasChanged(settings.pageClosingTexts?.disclaimer, pageClosingTexts.disclaimer)) {
          settings.staticPagesLastUpdated.disclaimer = now;
        }

        settings.pageClosingTexts = pageClosingTexts;
      }
      if (footerCopyrightYear !== undefined) settings.footerCopyrightYear = footerCopyrightYear;
      if (headingSettings !== undefined) settings.headingSettings = headingSettings;

      await settings.save();
    }

    const settingsObject = typeof settings?.toObject === 'function' ? settings.toObject() : settings;
    const settingsWithoutSeo = { ...settingsObject };
    delete settingsWithoutSeo.seoSettings;

    return Response.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsWithoutSeo,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
