'use client';

import { useEffect, useState } from 'react';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch {
      setMessage('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.error || 'Failed to create post');
        setSaving(false);
        return;
      }

      setForm({ title: '', excerpt: '', content: '', published: true });
      setMessage('Post created successfully');
      await fetchPosts();
    } catch {
      setMessage('Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (post) => {
    try {
      const response = await fetch(`/api/admin/posts/${post._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchPosts();
      }
    } catch {
      setMessage('Failed to update post status');
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchPosts();
      }
    } catch {
      setMessage('Failed to delete post');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
        <p className="mt-2 text-gray-600">Create and manage blog posts for your public blog page</p>
      </div>

      {message && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
        <form className="space-y-4" onSubmit={handleCreate}>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            required
          />
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Short excerpt"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 resize-none"
          />
          <textarea
            rows={7}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write post content"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 resize-none"
            required
          />

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Publish immediately
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Create Post'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Posts</h3>

        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-500">/{post.slug}</p>
                    {post.excerpt && <p className="text-sm text-gray-700 mt-2">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`px-3 py-1.5 rounded text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
