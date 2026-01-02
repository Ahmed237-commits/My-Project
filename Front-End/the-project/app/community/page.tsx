'use client';

import React, { useState } from "react";

/* =======================
   Types
======================= */
interface Comment {
  id: number;
  author: string;
  text: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  category: string;
  title: string;
  body: string;
  likes: number;
  comments: Comment[];
  image: string | null;
}

interface CreatePostPayload {
  author: string;
  avatar: string;
  time: string;
  category: string;
  title: string;
  body: string;
  image: string | null;
}

/* =======================
   Main Component
======================= */
export default function HealthLifeCommunity() {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Mariam",
      avatar: "https://i.pravatar.cc/40?img=5",
      time: "2h",
      category: "Nutrition",
      title: "Healthy breakfast ideas?",
      body: "I want easy healthy breakfasts for school mornings — any quick recipes?",
      likes: 12,
      comments: [
        { id: 1, author: "Omar", text: "Overnight oats with milk + fruit!" }
      ],
      image: null,
    },
    {
      id: 2,
      author: "Khaled",
      avatar: "https://i.pravatar.cc/40?img=12",
      time: "1d",
      category: "Workouts",
      title: "15-min home workout",
      body: "A simple routine with no equipment to keep muscle during exams.",
      likes: 34,
      comments: [],
      image: null,
    }
  ]);

  const categories: string[] = [
    "All",
    "Nutrition",
    "Workouts",
    "Weight Loss",
    "Mental Health",
    "Recipes",
    "Q&A",
    "Progress"
  ];

  /* =======================
     Create Post
  ======================= */
  function createPost(data: CreatePostPayload) {
    const newPost: Post = {
      id: Date.now(),
      likes: 0,
      comments: [],
      ...data,
    };

    setPosts(prev => [newPost, ...prev]);
    setShowCreate(false);
  }

  /* =======================
     Filtering
  ======================= */
  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      category === "All" || post.category === category;

    const matchesSearch =
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /* =======================
     Render
  ======================= */
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 text-white font-bold rounded-full flex items-center justify-center">
              HL
            </div>
            <span className="font-semibold text-lg">Health Life</span>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-2 bg-green-600 text-white rounded-md text-sm"
          >
            Create Post
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-50 to-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Join the Health Life Community
          </h1>
          <p className="text-slate-600 mt-2">
            Share your journey, ask questions, and get motivated.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Categories */}
          <div className="bg-white p-3 rounded-md shadow-sm flex gap-2 overflow-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  category === cat
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}

            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search..."
              className="ml-auto text-sm border px-3 py-1 rounded-md"
            />
          </div>

          {/* Posts */}
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-white p-4 rounded-md shadow-sm"
            >
              <div className="flex gap-3">
                <img
                  src={post.avatar}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />

                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold">{post.author}</span>
                    <span className="text-xs text-slate-500 ml-2">
                      • {post.time}
                    </span>
                  </div>

                  <h3 className="font-semibold mt-1">{post.title}</h3>
                  <p className="text-sm text-slate-700 mt-2">{post.body}</p>

                  <div className="mt-3 text-sm text-slate-600 flex gap-4">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filteredPosts.length === 0 && (
            <div className="bg-white p-6 text-center rounded-md text-slate-500">
              No posts found.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">Trending Topics</h4>
            <ul className="mt-2 text-sm text-slate-600 space-y-1">
              <li>#hydration</li>
              <li>#home-workout</li>
              <li>#healthy-food</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Create Post</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-slate-500"
              >
                Close
              </button>
            </div>

            <CreatePostForm
              categories={categories}
              onCreate={createPost}
            />
          </div>
        </div>
      )}

      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Health Life
      </footer>
    </div>
  );
}

/* =======================
   Create Post Form
======================= */
function CreatePostForm({
  onCreate,
  categories,
}: {
  onCreate: (data: CreatePostPayload) => void;
  categories: string[];
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(categories[1] ?? "Nutrition");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) return;

    onCreate({
      author: "You",
      avatar: "https://i.pravatar.cc/40?img=3",
      time: "now",
      category,
      title,
      body,
      image: null,
    });

    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border px-3 py-2 rounded-md"
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      >
        {categories
          .filter(c => c !== "All")
          .map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
      </select>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={5}
        placeholder="Write your post..."
        className="w-full border px-3 py-2 rounded-md"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Publish
      </button>
    </form>
  );
}
