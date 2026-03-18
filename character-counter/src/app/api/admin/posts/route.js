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

function makeSlug(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  try {
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select('title slug excerpt published createdAt updatedAt')
      .lean();

    return Response.json({
      success: true,
      posts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
      })),
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('admin_token')?.value;

    if (!ensureAdmin(token)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = (body.title || '').trim();
    const content = (body.content || '').trim();
    const excerpt = (body.excerpt || '').trim();
    const published = Boolean(body.published);

    if (!title || !content) {
      return Response.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    await connectDB();

    const baseSlug = makeSlug(body.slug || title);

    if (!baseSlug) {
      return Response.json({ success: false, error: 'Could not generate slug' }, { status: 400 });
    }

    let slug = baseSlug;
    let counter = 1;

    while (await Post.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      published,
    });

    return Response.json({
      success: true,
      message: 'Post created successfully',
      post: {
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        published: post.published,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
