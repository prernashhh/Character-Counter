import Link from 'next/link';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug, published: true })
      .select('title slug excerpt content createdAt')
      .lean();

    if (!post) {
      return null;
    }

    return {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
    };
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors">
            Back to Blog
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
          <p className="mt-3 text-slate-600">The requested post is unavailable or unpublished.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors">
          Back to Blog
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{post.title}</h1>

        <p className="text-sm text-slate-500 mb-8">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
        </p>

        {post.excerpt && (
          <p className="text-lg text-slate-700 mb-6 font-medium">{post.excerpt}</p>
        )}

        <div
          className="prose prose-slate max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
