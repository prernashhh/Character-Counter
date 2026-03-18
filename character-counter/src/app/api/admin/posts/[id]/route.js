import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function ensureAdmin(token) {
  if (!token) return false;
  const { valid } = verifyToken(token);
  return valid;
}

export async function PATCH(request, { params }) {
  try {
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const update = {};

    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.content !== undefined) update.content = String(body.content).trim();
    if (body.excerpt !== undefined) update.excerpt = String(body.excerpt).trim();
    if (body.published !== undefined) update.published = Boolean(body.published);

    const post = await Post.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!post) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Post updated successfully',
      post: {
        ...post,
        _id: post._id.toString(),
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
