'use client';

import React, { useState } from "react";
import {
  FaSearch, FaTimes, FaThumbsUp, FaComment,
  FaPlus, FaFire, FaHashtag, FaUsers,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
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
  liked: boolean; 
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

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const CATEGORIES = ["All", "Nutrition", "Workouts", "Weight Loss", "Mental Health", "Recipes", "Q&A", "Progress"];
const TRENDING   = ["#hydration", "#home-workout", "#healthy-food", "#meal-prep", "#sleep-better"];

const CATEGORY_EMOJI: Record<string, string> = {
  "Nutrition": "🥗", 
  "Workouts": "💪", 
  "Weight Loss": "⚖️",
  "Mental Health": "🧠", 
  "Recipes": "🍳", 
  "Q&A": "❓", 
  "Progress": "📈",
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function HealthLifeCommunity() {
  const [query,       setQuery]       = useState("");
  const [category,    setCategory]    = useState("All");
  const [showCreate,  setShowCreate]  = useState(false);
  const [posts,       setPosts]       = useState<Post[]>([]); 
  const [openComment, setOpenComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const filtered = posts.filter(p =>
    (category === "All" || p.category === category) &&
    (p.title.toLowerCase().includes(query.toLowerCase()) ||
     p.body.toLowerCase().includes(query.toLowerCase()))
  );

  const toggleLike = (id: number) =>
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));

  const addComment = (postId: number) => {
    if (!commentText.trim()) return;
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Date.now(), author: "You", text: commentText }] }
        : p
    ));
    setCommentText("");
  };

  const createPost = (data: CreatePostPayload) => {
    setPosts(prev => [{ id: Date.now(), likes: 0, liked: false, comments: [], ...data }, ...prev]);
    setShowCreate(false);
  };

  return (
    <>
      <style>{`
        /* ── Base Setup & Global Typography ── */
        .com-root {
          min-height: 100vh;
          background: var(--clr-bg, #fdfaf6);
          color: var(--clr-text, #2d1f14);
          direction: ltr; 
          font-family: inherit;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Header & Navigation ── */
        .com-nav {
          position: sticky; top: 0; z-index: 30;
          background: var(--clr-surface, #fff);
          border-bottom: 1px solid var(--clr-border, #ecddd0);
          box-shadow: 0 1px 8px rgba(74,59,47,.06);
        }
        .com-nav-inner {
          max-width: 72rem; margin: 0 auto;
          padding: .85rem 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .com-logo {
          display: flex; align-items: center; gap: .6rem;
          font-size: 1.3rem; font-weight: 500;
          color: var(--clr-primary, #4a3b2f);
        }
        .com-logo-dot {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--clr-accent-soft, #f5e6d8);
          display: flex; align-items: center; justify-content: center;
          color: var(--clr-accent, #c8956c); font-size: 1.1rem;
        }

        /* ── Action Buttons ── */
        .create-btn {
          display: flex; align-items: center; gap: .5rem;
          padding: .65rem 1.4rem; border-radius: .75rem; border: none;
          background: var(--clr-accent, #c8956c); color: #fff;
          font-size: 1rem; font-weight: 400; cursor: pointer;
          transition: background 200ms, transform 200ms;
          box-shadow: 0 3px 10px rgba(200,149,108,.3);
        }
        .create-btn:hover { background: var(--clr-accent-hov, #b5794e); transform: translateY(-1px); }
        .create-btn:focus-visible { outline: 2px solid var(--clr-accent, #c8956c); outline-offset: 3px; }

        /* ── Hero Section ── */
        .com-hero {
          background: linear-gradient(135deg, var(--clr-accent-soft, #f5e6d8) 0%, var(--clr-bg, #fdfaf6) 100%);
          border-bottom: 1px solid var(--clr-border, #ecddd0);
          padding: 3.5rem 1.5rem;
        }
        .com-hero-inner { max-width: 72rem; margin: 0 auto; }
        .com-hero-title { font-size: 2.35rem; font-weight: 500; color: var(--clr-primary, #4a3b2f); margin-bottom: .6rem; }
        .com-hero-desc { font-size: 1.15rem; color: var(--clr-text-muted, #6b5c50); line-height: 1.6; font-weight: 400; }

        /* ── Grid Layout Container ── */
        .com-container {
          max-width: 72rem; margin: 0 auto; padding: 2.5rem 1.5rem;
          display: grid; grid-template-columns: 1fr; gap: 1.75rem;
        }
        @media (min-width: 1024px) {
          .com-container { grid-template-columns: 2fr 1fr; }
        }

        .com-feed { display: flex; flex-direction: column; gap: 1.5rem; }

        /* ── Search & Filters ── */
        .filter-bar {
          display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem;
          background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.25rem;
        }
        @media (min-width: 768px) {
          .filter-bar { flex-direction: row; justify-content: space-between; align-items: center; }
        }
        .pills-wrapper { display: flex; flex-wrap: wrap; gap: .55rem; flex: 1; }

        .search-wrap { position: relative; width: 100%; }
        @media (min-width: 768px) { .search-wrap { max-width: 280px; } }
        
        .search-icon {
          position: absolute; left: .95rem; top: 50%; transform: translateY(-50%);
          color: var(--clr-muted, #7a6a5e); font-size: .95rem; pointer-events: none;
        }
        .search-input {
          width: 100%; padding: .65rem .85rem .65rem 2.4rem; box-sizing: border-box;
          border-radius: .75rem; border: 1.5px solid var(--clr-border, #ecddd0);
          background: var(--clr-bg, #fdfaf6); color: var(--clr-text, #2d1f14);
          font-size: 1rem; font-weight: 400; outline: none; transition: border-color 200ms;
        }
        .search-input:focus { border-color: var(--clr-accent, #c8956c); background: #fff; }

        /* ── Category Pills ── */
        .cat-pill {
          padding: .5rem 1.1rem; border-radius: 9999px;
          border: 1.5px solid var(--clr-border, #ecddd0); background: var(--clr-surface, #fff);
          color: var(--clr-text-muted, #6b5c50); font-size: .95rem; font-weight: 400; cursor: pointer; white-space: nowrap;
          transition: background 180ms, border-color 180ms, color 180ms;
        }
        .cat-pill:hover { background: var(--clr-accent-soft, #f5e6d8); border-color: var(--clr-accent, #c8956c); }
        .cat-pill.active { background: var(--clr-accent, #c8956c); border-color: var(--clr-accent, #c8956c); color: #fff; }

        /* ── Post Feed Card ── */
        .post-card {
          background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.35rem; padding: 1.75rem; transition: box-shadow 220ms, border-color 220ms;
        }
        .post-card:hover { box-shadow: 0 10px 28px rgba(74,59,47,.07); border-color: var(--clr-accent, #c8956c); }
        
        .post-header { display: flex; align-items: flex-start; gap: .85rem; margin-bottom: 1.25rem; }
        .post-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--clr-border, #ecddd0); }
        .post-meta-info { flex: 1; min-width: 0; }
        .post-meta-row { display: flex; align-items: center; flex-wrap: wrap; gap: .6rem; }
        .post-author { font-weight: 500; color: var(--clr-primary, #4a3b2f); font-size: 1.05rem; }
        .post-time { font-size: .85rem; color: var(--clr-muted, #7a6a5e); font-weight: 400; }
        
        .cat-badge {
          display: inline-flex; align-items: center; gap: .3rem;
          padding: .25rem .7rem; border-radius: 9999px;
          background: var(--clr-accent-soft, #f5e6d8); color: var(--clr-accent, #c8956c); font-size: .85rem; font-weight: 400;
        }
        .post-title { font-size: 1.3rem; font-weight: 500; color: var(--clr-primary, #4a3b2f); margin-top: .5rem; }
        .post-body { font-size: 1.05rem; line-height: 1.65; color: var(--clr-text-muted, #6b5c50); margin-bottom: 1.25rem; font-weight: 400; }
        .post-actions-row { display: flex; gap: .6rem; }

        /* ── Feed Action Controls ── */
        .action-btn {
          display: flex; align-items: center; gap: .45rem;
          padding: .5rem 1.1rem; border-radius: .65rem; border: none;
          background: var(--clr-bg, #fdfaf6); color: var(--clr-text-muted, #6b5c50);
          font-size: .95rem; font-weight: 400; cursor: pointer; transition: background 180ms, color 180ms;
        }
        .action-btn:hover { background: var(--clr-accent-soft, #f5e6d8); color: var(--clr-accent, #c8956c); }
        .action-btn.liked { color: var(--clr-accent, #c8956c); background: var(--clr-accent-soft, #f5e6d8); }

        /* ── Comment System ── */
        .comment-box { border-top: 1px solid var(--clr-border, #ecddd0); margin-top: 1.25rem; padding-top: 1.25rem; }
        .comments-list { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1rem; padding: 0; list-style: none; }
        .comment-item { padding: .7rem .95rem; border-radius: .75rem; background: var(--clr-bg, #fdfaf6); border: 1px solid var(--clr-border, #ecddd0); font-size: .95rem; color: var(--clr-text-muted, #6b5c50); font-weight: 400; }
        .comment-author { font-weight: 500; color: var(--clr-primary, #4a3b2f); margin-right: .3rem; }
        
        .comment-input-wrapper { display: flex; gap: .6rem; }
        .comment-input {
          flex: 1; padding: .65rem .95rem; border-radius: .75rem;
          border: 1.5px solid var(--clr-border, #ecddd0); background: var(--clr-bg, #fdfaf6);
          color: var(--clr-text, #2d1f14); font-size: .95rem; font-weight: 400; outline: none; transition: border-color 200ms;
        }
        .comment-input:focus { border-color: var(--clr-accent, #c8956c); background: #fff; }
        .comment-submit {
          padding: .65rem 1.4rem; border-radius: .75rem; border: none;
          background: var(--clr-accent, #c8956c); color: #fff; font-size: .95rem; font-weight: 400; cursor: pointer; transition: background 180ms;
        }
        .comment-submit:hover { background: var(--clr-accent-hov, #b5794e); }

        /* ── Desktop Sidebar ── */
        .com-sidebar { display: none; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 1024px) { .com-sidebar { display: flex; } }

        .sidebar-card { background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1.35rem; padding: 1.5rem; }
        .sidebar-heading { display: flex; align-items: center; gap: .5rem; font-size: 1.05rem; font-weight: 500; color: var(--clr-primary, #4a3b2f); margin-bottom: 1rem; }
        
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
        .stats-box { text-align: center; padding: .95rem; border-radius: .85rem; background: var(--clr-accent-soft, #f5e6d8); }
        .stats-val { font-size: 1.4rem; font-weight: 500; color: var(--clr-accent, #c8956c); margin: 0; }
        .stats-lbl { font-size: .85rem; color: var(--clr-text-muted, #6b5c50); margin: .25rem 0 0 0; font-weight: 400; }

        .trending-list { display: flex; flex-direction: column; gap: .6rem; padding: 0; list-style: none; margin: 0; }
        .trending-tag {
          display: flex; align-items: center; gap: .5rem; padding: .55rem .85rem; border-radius: .65rem;
          background: var(--clr-bg, #fdfaf6); border: 1px solid var(--clr-border, #ecddd0);
          color: var(--clr-text-muted, #6b5c50); font-size: .95rem; font-weight: 400; cursor: pointer; width: 100%; text-align: left; transition: background 180ms, color 180ms;
        }
        .trending-tag:hover { background: var(--clr-accent-soft, #f5e6d8); color: var(--clr-accent, #c8956c); }

        /* ── Modal Dialog ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(20,12,5,.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-card {
          background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem; padding: 2.25rem; width: 100%; max-width: 520px;
          box-shadow: 0 24px 64px rgba(74,59,47,.15); max-height: 90vh; overflow-y: auto; box-sizing: border-box;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
        .modal-close { background: none; border: none; padding: .5rem; cursor: pointer; color: var(--clr-muted, #7a6a5e); font-size: 1.15rem; display: flex; align-items: center; }
        .modal-form { display: flex; flex-direction: column; gap: 1.4rem; }
        
        .modal-label { display: block; font-size: .95rem; font-weight: 400; color: var(--clr-primary, #4a3b2f); margin-bottom: .45rem; }
        .modal-input, .modal-select, .modal-textarea {
          width: 100%; padding: .8rem 1.1rem; border-radius: .875rem; border: 1.5px solid var(--clr-border, #ecddd0);
          background: var(--clr-bg, #fdfaf6); color: var(--clr-text, #2d1f14); font-size: 1.05rem; font-weight: 400; outline: none;
          transition: border-color 200ms; box-sizing: border-box; font-family: inherit;
        }
        .modal-input:focus, .modal-select:focus, .modal-textarea:focus { border-color: var(--clr-accent, #c8956c); background: #fff; }
        .modal-submit {
          width: 100%; padding: .95rem; border-radius: .875rem; border: none;
          background: var(--clr-accent, #c8956c); color: #fff; font-size: 1.1rem; font-weight: 400; cursor: pointer;
          transition: background 200ms; box-shadow: 0 4px 12px rgba(200,149,108,.2); margin-top: .5rem;
        }
        .modal-submit:hover { background: var(--clr-accent-hov, #b5794e); }

        /* ── Empty State ── */
        .empty-state {
          background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.35rem; padding: 4.5rem 2rem; text-align: center; color: var(--clr-text-muted, #6b5c50);
        }
        .empty-state-icon { font-size: 3rem; margin-bottom: .75rem; }
        .empty-state h3 { font-size: 1.4rem; font-weight: 500; margin-bottom: .5rem; color: var(--clr-primary, #4a3b2f); }
        .empty-state p { font-size: 1.05rem; font-weight: 400; }
      `}</style>

      <div className="com-root">

        {/* ════ NAV ════ */}
        <nav className="com-nav" aria-label="Community navigation">
          <div className="com-nav-inner">
            <div className="com-logo">
              <div className="com-logo-dot" aria-hidden="true"><FaUsers /></div>
              <span>Health Life Community</span>
            </div>
            <button
              className="create-btn"
              onClick={() => setShowCreate(true)}
              aria-haspopup="dialog"
            >
              <FaPlus aria-hidden="true" />
              <span>Create Post</span>
            </button>
          </div>
        </nav>

        {/* ════ HERO ════ */}
        <section className="com-hero" aria-labelledby="community-heading">
          <div className="com-hero-inner">
            <h1 id="community-heading" className="com-hero-title">
              Welcome to your Health Community 🌿
            </h1>
            <p className="com-hero-desc">
              Share your journey, ask questions, and interact with people who share your health and fitness goals.
            </p>
          </div>
        </section>

        {/* ════ MAIN GRID ════ */}
        <div className="com-container">

          {/* ── Feed ── */}
          <main className="com-feed">

            {/* Filter bar */}
            <div className="filter-bar">
              <div className="pills-wrapper">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`cat-pill ${category === cat ? "active" : ""}`}
                    aria-pressed={category === cat}
                  >
                    {cat !== "All" && CATEGORY_EMOJI[cat]} {cat}
                  </button>
                ))}
              </div>
              <div className="search-wrap">
                <FaSearch className="search-icon" aria-hidden="true" />
                <input
                  className="search-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  aria-label="Search posts"
                  type="search"
                />
              </div>
            </div>

            {/* Posts Feed */}
            {filtered.map(post => (
              <article key={post.id} className="post-card">

                {/* Author row */}
                <div className="post-header">
                  <img
                    src={post.avatar}
                    alt={`${post.author}'s avatar`}
                    className="post-avatar"
                  />
                  <div className="post-meta-info">
                    <div className="post-meta-row">
                      <span className="post-author">{post.author}</span>
                      <span className="post-time">· {post.time}</span>
                      <span className="cat-badge">
                        {CATEGORY_EMOJI[post.category]} {post.category}
                      </span>
                    </div>
                    <h2 className="post-title">{post.title}</h2>
                  </div>
                </div>

                <p className="post-body">{post.body}</p>

                {/* Actions */}
                <div className="post-actions-row">
                  <button
                    className={`action-btn ${post.liked ? "liked" : ""}`}
                    onClick={() => toggleLike(post.id)}
                    aria-pressed={post.liked}
                    aria-label={`Like post — ${post.likes} likes`}
                  >
                    <FaThumbsUp aria-hidden="true" /> <span>{post.likes}</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setOpenComment(openComment === post.id ? null : post.id)}
                    aria-expanded={openComment === post.id}
                    aria-label={`${post.comments.length} comments`}
                  >
                    <FaComment aria-hidden="true" /> <span>{post.comments.length}</span>
                  </button>
                </div>

                {/* Comments Box */}
                {openComment === post.id && (
                  <div className="comment-box">
                    {post.comments.length > 0 && (
                      <ul className="comments-list" role="list">
                        {post.comments.map(c => (
                          <li key={c.id} className="comment-item">
                            <span className="comment-author">{c.author}:</span>
                            <span>{c.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="comment-input-wrapper">
                      <input
                        className="comment-input"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        aria-label="Write a comment"
                        onKeyDown={e => e.key === "Enter" && addComment(post.id)}
                      />
                      <button
                        className="comment-submit"
                        onClick={() => addComment(post.id)}
                        aria-label="Submit comment"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">✨</div>
                <h3>The community is waiting for your first contribution!</h3>
                <p>No posts found under this category or search query. Be the first to publish now.</p>
              </div>
            )}
          </main>

          {/* ── Sidebar ── */}
          <aside className="com-sidebar" aria-label="Community sidebar">

            {/* Stats Card */}
            <div className="sidebar-card">
              <div className="sidebar-heading">
                <FaUsers aria-hidden="true" style={{ color: "var(--clr-accent)" }} />
                Community Stats
              </div>
              <div className="stats-grid">
                <div className="stats-box">
                  <p className="stats-val">10K+</p>
                  <p className="stats-lbl">Active Members</p>
                </div>
                <div className="stats-box">
                  <p className="stats-val">{posts.length}</p>
                  <p className="stats-lbl">Total Posts</p>
                </div>
              </div>
            </div>

            {/* Trending Card */}
            <div className="sidebar-card">
              <div className="sidebar-heading">
                <FaFire aria-hidden="true" style={{ color: "var(--clr-accent)" }} />
                Trending Topics
              </div>
              <ul className="trending-list" role="list">
                {TRENDING.map(tag => (
                  <li key={tag}>
                    <button
                      className="trending-tag"
                      onClick={() => setQuery(tag.replace("#", ""))}
                    >
                      <FaHashtag aria-hidden="true" style={{ fontSize: '.85rem', opacity: .6 }} />
                      <span>{tag}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* ════ CREATE POST MODAL ════ */}
        {showCreate && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Create a new post"
            onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <div className="modal-card">
              <div className="modal-header">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 500, margin: 0, color: "var(--clr-primary, #4a3b2f)" }}>
                  Create a New Post
                </h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="modal-close"
                  aria-label="Close modal"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
              <CreatePostForm categories={CATEGORIES} onCreate={createPost} />
            </div>
          </div>
        )}

        {/* ════ FOOTER ════ */}
        <footer
          style={{
            padding: '2.5rem 1.5rem', textAlign: 'center', fontSize: '.95rem',
            borderTop: "1px solid var(--clr-border, #ecddd0)",
            color: "var(--clr-muted, #7a6a5e)", marginTop: 'auto', fontWeight: 400
          }}
        >
          © {new Date().getFullYear()} Healthy Life App · All rights reserved
        </footer>

      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   CREATE POST FORM COMPONENT
══════════════════════════════════════════ */
function CreatePostForm({
  onCreate, categories,
}: {
  onCreate: (data: CreatePostPayload) => void;
  categories: string[];
}) {
  // استدعاء الهوك هنا في المكان الصحيح والمسموح به برمجياً
  const { data: session, status } = useSession();
  
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [category, setCategory] = useState(categories[1] ?? "Nutrition");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onCreate({ 
      author: status === "authenticated" ? session?.user?.name || "You" : "You", 
      avatar: status === "authenticated" ? session?.user?.image || "https://i.pravatar.cc/40?img=3" : "https://i.pravatar.cc/40?img=3", 
      time: "Just now", 
      category, 
      title, 
      body, 
      image: null 
    });

    setTitle(""); 
    setBody("");
  }

  return (
    <form onSubmit={submit} className="modal-form" noValidate aria-label="New post form">
      <div>
        <label className="modal-label" htmlFor="post-title">Post Title</label>
        <input
          id="post-title"
          className="modal-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
      </div>

      <div>
        <label className="modal-label" htmlFor="post-category">Category</label>
        <select
          id="post-category"
          className="modal-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.filter(c => c !== "All").map(c => (
            <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="modal-label" htmlFor="post-body">Content</label>
        <textarea
          id="post-body"
          className="modal-textarea"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={5}
          placeholder="Share your thoughts, fitness tips, or questions with members..."
          required
        />
      </div>

      <button type="submit" className="modal-submit">
        Publish Post
      </button>
    </form>
  );
}