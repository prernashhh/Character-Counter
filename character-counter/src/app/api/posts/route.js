import connectDB from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get('limit'));
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 20)
      : 6;

    await connectDB();

    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title slug excerpt createdAt')
      .lean();

    return Response.json({
      success: true,
      posts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
      })),
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message, posts: [] }, { status: 500 });
  }
}
