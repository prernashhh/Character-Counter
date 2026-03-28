import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function ensureAdmin(token) {
  if (!token) return false;
  const { valid } = verifyToken(token);
  return valid;
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const requestedType = String(formData.get('type') || 'blog-content').trim();
    const type = requestedType === 'blog-cover'
      ? 'blog-cover'
      : requestedType === 'seo-og'
        ? 'seo-og'
        : 'blog-content';

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: 'Image file is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'Only image uploads are allowed' }, { status: 400 });
    }

    const maxSizeInBytes = type === 'blog-cover' || type === 'seo-og'
      ? 8 * 1024 * 1024
      : 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return Response.json({ success: false, error: 'Image is too large' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageToCloudinary(buffer, type);

    return Response.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      type,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
