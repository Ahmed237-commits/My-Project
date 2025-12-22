'use client';
import React, { useState } from "react";

// Single-file React component for the "HealthLife" Community page.
// Built with Tailwind CSS only. No shadcn. Meant to be used in a Next.js or CRA app.

export default function HealthLifeCommunity() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [posts, setPosts] = useState([
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

  const categories = [
    "All",
    "Nutrition",
    "Workouts",
    "Weight Loss",
    "Mental Health",
    "Recipes",
    "Q&A",
    "Progress"
  ];

  function createPost(newPost: { id: number; author: string; avatar: string; time: string; category: string; title: string; body: string; likes: number; comments: { id: number; author: string; text: string; }[]; image: null; }) {
    setPosts(prev => [{ id: Date.now(), ...newPost, likes:0, comments:[] }, ...prev]);
    setShowCreate(false);
  }

  const filtered = posts.filter(p => (category === "All" || p.category === category) &&
    (p.title.toLowerCase().includes(query.toLowerCase()) || p.body.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center font-bold text-white">HL</div>
              <span className="font-semibold text-lg">Health Life</span>
            </div>
            <nav className="hidden md:flex gap-4 text-sm text-slate-600">
              <a className="hover:text-slate-900">Home</a>
              <a className="hover:text-slate-900">Articles</a>
              <a className="hover:text-slate-900">Workout Plans</a>
              <a className="text-green-600 font-medium">Community</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-green-500 text-white rounded-md text-sm">Create Post</button>
            <div className="hidden md:flex items-center gap-2">
              <button title="Notifications" className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-50 to-white py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Join the Health Life Community</h1>
            <p className="text-slate-600 mb-4">Share your journey, ask questions, and get motivated by people who care about health and fitness.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white rounded-md">Start Posting</button>
              <button className="px-4 py-2 border rounded-md">Explore Topics</button>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-600">Trending challenge</p>
              <h3 className="font-semibold mt-2">7-Day Hydration Challenge</h3>
              <p className="text-xs text-slate-500 mt-2">Drink at least 2L of water each day and share your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Categories bar */}
          <div className="bg-white p-3 rounded-md shadow-sm flex items-center gap-3 overflow-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${category===cat ? 'bg-green-500 text-white' : 'bg-gray-100 text-slate-700'}`}>
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search posts" className="text-sm px-3 py-1 rounded-md border" />
            </div>
          </div>

          {/* Posts list */}
          <div className="space-y-4">
            {filtered.map(post => (
              <article key={post.id} className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{post.author}</span>
                          <span className="text-xs text-slate-500">• {post.time}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{post.category}</span>
                        </div>
                        <h3 className="font-semibold mt-2">{post.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 mt-2">{post.body}</p>

                    {post.image && <img src={post.image} className="mt-3 rounded-md max-h-60 w-full object-cover" alt="post" />}

                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                      <button className="flex items-center gap-2 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-2-2m0 0L10 9m2-2v12" /></svg>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 6-9 9-9 9s-9-3-9-9a9 9 0 0118 0z" /></svg>
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-slate-800">Share</button>

                      <button className="ml-auto text-xs px-2 py-1 rounded bg-gray-100">View</button>
                    </div>

                    {/* Preview comment */}
                    {post.comments[0] && (
                      <div className="mt-3 border-t pt-3 text-sm text-slate-700">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                          <div>
                            <div className="text-xs text-slate-500">{post.comments[0].author}</div>
                            <div className="mt-1">{post.comments[0].text}</div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white p-6 rounded-md text-center text-slate-600">No posts found. Try a different category or create the first post!</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">Top Contributors</h4>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/40?img=32" className="w-9 h-9 rounded-full" />
                <div>
                  <div className="text-sm font-medium">Salma</div>
                  <div className="text-xs text-slate-500">18 posts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/40?img=44" className="w-9 h-9 rounded-full" />
                <div>
                  <div className="text-sm font-medium">Youssef</div>
                  <div className="text-xs text-slate-500">12 posts</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">Trending Topics</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>#best-diet</li>
              <li>#morning-routine</li>
              <li>#hydration</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">Upcoming Challenges</h4>
            <div className="mt-3 text-sm text-slate-600">7-Day Hydration • 15-min Home Workout • No-Sugar Week</div>
          </div>
        </aside>
      </main>

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create Post</h3>
              <button onClick={()=>setShowCreate(false)} className="text-slate-500">Close</button>
            </div>

            <CreatePostForm onCreate={createPost} categories={categories} />
          </div>
        </div>
      )}

      <footer className="py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Health Life</footer>
    </div>
  );
}

function CreatePostForm({ onCreate, categories }){
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cat, setCat] = useState(categories[1] || 'Nutrition');

  function submit(e){
    e.preventDefault();
    if(!title.trim() || !body.trim()) return;
    onCreate({ author: 'You', avatar: 'https://i.pravatar.cc/40?img=3', time: 'now', category: cat, title, body, image: null });
    setTitle(''); setBody('');
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded-md" />
      <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full border px-3 py-2 rounded-md">
        {categories.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} placeholder="Write your post..." className="w-full border px-3 py-2 rounded-md" />
      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Publish</button>
        <span className="text-sm text-slate-500">You can add images later (not implemented in demo)</span>
      </div>
    </form>
  );
}
