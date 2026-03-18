import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPublishedPosts() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt content createdAt')
      .lean();

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog Posts
          </h1>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">No blog posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article key={post._id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">{post.title}</h2>
                  <p className="text-slate-600 mb-4">
                    {post.excerpt || post.content?.slice(0, 140) || 'Read this post to explore more details.'}
                    {post.content && post.content.length > 140 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ''}
                    </span>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
