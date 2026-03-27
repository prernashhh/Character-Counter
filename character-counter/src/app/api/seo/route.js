import connectDB from '@/lib/db';
import SeoSetting from '@/models/SeoSetting';

export async function GET() {
  try {
    await connectDB();
    const seo = await SeoSetting.find().sort({ page: 1 }).lean();
    return Response.json({ success: true, seo });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    const page = String(body?.page || '').trim().toLowerCase();
    const title = String(body?.title || '').trim();
    const description = String(body?.description || '').trim();
    const ogImage = String(body?.ogImage || '').trim();

    if (!page) {
      return Response.json({ success: false, error: 'page is required' }, { status: 400 });
    }

    const seo = await SeoSetting.findOneAndUpdate(
      { page },
      {
        $set: {
          page,
          title,
          description,
          ogImage,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return Response.json({ success: true, seo });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
