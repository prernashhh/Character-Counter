import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

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
        instagramHandle: '',
        instagramUrl: '',
        privacyPolicyContent: '',
        footerCopyrightYear: new Date().getFullYear(),
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
      instagramHandle,
      instagramUrl,
      privacyPolicyContent,
      footerCopyrightYear,
    } = body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        aboutContent,
        aboutUsContent,
        aboutUsContacts,
        instagramHandle,
        instagramUrl,
        privacyPolicyContent,
        footerCopyrightYear: footerCopyrightYear ?? new Date().getFullYear(),
      });
    } else {
      if (aboutContent !== undefined) settings.aboutContent = aboutContent;
      if (aboutUsContent !== undefined) settings.aboutUsContent = aboutUsContent;
      if (aboutUsContacts !== undefined) settings.aboutUsContacts = aboutUsContacts;
      if (instagramHandle !== undefined) settings.instagramHandle = instagramHandle;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (privacyPolicyContent !== undefined) settings.privacyPolicyContent = privacyPolicyContent;
      if (footerCopyrightYear !== undefined) settings.footerCopyrightYear = footerCopyrightYear;

      await settings.save();
    }

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
