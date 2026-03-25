import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

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

    const post = await Post.findById(id);

    if (!post) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const update = {};

    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.content !== undefined) update.content = String(body.content).trim();
    if (body.excerpt !== undefined) update.excerpt = String(body.excerpt).trim();
    if (body.published !== undefined) update.published = Boolean(body.published);

    if (body.coverImageUrl !== undefined) {
      update.coverImageUrl = String(body.coverImageUrl || '').trim();
    }

    if (body.coverImagePublicId !== undefined) {
      const nextPublicId = String(body.coverImagePublicId || '').trim();
      update.coverImagePublicId = nextPublicId;

      if (post.coverImagePublicId && post.coverImagePublicId !== nextPublicId) {
        await deleteImageFromCloudinary(post.coverImagePublicId);
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!updatedPost) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Post updated successfully',
      post: {
        ...updatedPost,
        _id: updatedPost._id.toString(),
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

    const deleted = await Post.findById(id);

    if (!deleted) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    if (deleted.coverImagePublicId) {
      await deleteImageFromCloudinary(deleted.coverImagePublicId);
    }

    await Post.findByIdAndDelete(id);

    return Response.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
