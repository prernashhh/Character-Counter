import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import SeoSetting from '@/models/SeoSetting';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

function ensureAdmin(token) {
  if (!token) return false;
  const { valid } = verifyToken(token);
  return valid;
}

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
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const page = String(body?.page || '').trim().toLowerCase();
    const title = String(body?.title || '').trim();
    const description = String(body?.description || '').trim();
    const keywords = String(body?.keywords || '').trim();
    const ogImage = String(body?.ogImage || '').trim();
    const ogImagePublicId = String(body?.ogImagePublicId || '').trim();

    if (!page) {
      return Response.json({ success: false, error: 'page is required' }, { status: 400 });
    }

    const existing = await SeoSetting.findOne({ page }).lean();

    if (existing?.ogImagePublicId && existing.ogImagePublicId !== ogImagePublicId) {
      await deleteImageFromCloudinary(existing.ogImagePublicId);
    }

    const seo = await SeoSetting.findOneAndUpdate(
      { page },
      { title, description, keywords, ogImage, ogImagePublicId },
      { upsert: true, new: true }
    ).lean();

    return Response.json({ success: true, seo });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
