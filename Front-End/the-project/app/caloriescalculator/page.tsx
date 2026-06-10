"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from 'sweetalert2';
import {
  FaCamera, FaSearch, FaPlus, FaUtensils,
  FaWeightHanging, FaFire, FaDrumstickBite,
  FaArrowLeft, FaCheck,
} from "react-icons/fa";
import { useHealth } from '../context/HealthContext';
import Link from "next/link";

type Tab = 'manual' | 'create' | 'upload';

export default function CaloriesUploader() {
  const { data: session }  = useSession();
  const { refreshHealthData } = useHealth();

  const [activeTab, setActiveTab] = useState<Tab>('manual');

  // Upload state
  const [form,          setForm]          = useState({ name: "", email: "" });
  const [image,         setImage]         = useState<File | null>(null);
  const [uploadResult,  setUploadResult]  = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Manual state
  const [manualFood,    setManualFood]    = useState("");
  const [manualWeight,  setManualWeight]  = useState("100");
  const [manualResult,  setManualResult]  = useState<any>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // Create state
  const [createForm,    setCreateForm]    = useState({ name: "", calories: "", protein: "" });
  const [createLoading, setCreateLoading] = useState(false);

  /* ── Handlers ── */
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFood.trim()) return;
    setManualLoading(true); setManualResult(null);
    try {
      const res  = await fetch("http://localhost:8000/api/food/calculate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: manualFood, weight: manualWeight }),
      });
      setManualResult(await res.json());
    } catch { setManualResult({ error: true, message: "Failed to calculate." }); }
    finally  { setManualLoading(false); }
  };

  const addToDailyLog = async () => {
    if (!session?.user?.email) { Swal.fire('Error', 'You must be logged in.', 'error'); return; }
    if (!manualResult) return;
    try {
      const res = await fetch("http://localhost:8000/api/daily-intake/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email, foodName: manualResult.foodName,
          calories: manualResult.calories, protein: manualResult.protein,
        }),
      });
      if (res.ok) {
        Swal.fire({ title: 'Added!', text: `${manualResult.calories} kcal logged.`, icon: 'success', timer: 2000, showConfirmButton: false });
        setManualFood(""); setManualResult(null); refreshHealthData();
      } else { Swal.fire('Error', 'Failed to save.', 'error'); }
    } catch { Swal.fire('Error', 'Network error.', 'error'); }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setCreateLoading(true);
    try {
      const res  = await fetch("http://localhost:8000/api/food/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createForm.name, calories: Number(createForm.calories), protein: Number(createForm.protein), email: session?.user?.email }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('Success', 'Food created!', 'success');
        setCreateForm({ name: "", calories: "", protein: "" });
        setActiveTab('manual'); setManualFood(data.food.name);
      } else { Swal.fire('Error', data.error || 'Failed to create food', 'error'); }
    } catch { Swal.fire('Error', 'Network error', 'error'); }
    finally  { setCreateLoading(false); }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setUploadLoading(true); setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name); formData.append("email", form.email);
      if (image) formData.append("image", image);
      const res  = await fetch("http://localhost:8000/caloriescalculator", { method: "POST", body: formData });
      const data = await res.json();
      setUploadResult(res.ok ? { error: false, ai: data.result } : { error: true, message: data.error || "Failed" });
    } catch { setUploadResult({ error: true, message: "Failed to send data." }); }
    finally  { setUploadLoading(false); }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'manual', label: 'Search Food',    icon: <FaSearch  aria-hidden="true" /> },
    { id: 'create', label: 'Add New Food',   icon: <FaPlus    aria-hidden="true" /> },
    { id: 'upload', label: 'AI Scan',        icon: <FaCamera  aria-hidden="true" /> },
  ];

  return (
    <>
      <style>{`
        .cal-root {
          min-height: 100vh; background: var(--clr-bg, #fdfaf6);
          padding: 2.5rem 1.5rem 5rem;
        }

        .cal-back {
          display: inline-flex; align-items: center; gap: .45rem;
          font-size: .9rem; font-weight: normal;
          color: var(--clr-accent, #c8956c); text-decoration: none;
          padding: .35rem .7rem; border-radius: .5rem;
          transition: background 180ms, transform 180ms; margin-bottom: 1.75rem;
        }
        .cal-back:hover { background: var(--clr-accent-soft, #f5e6d8); transform: translateX(-3px); }

        .cal-badge {
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--clr-accent-soft, #f5e6d8);
          display: flex; align-items: center; justify-content: center;
          color: var(--clr-accent, #c8956c); font-size: 1.5rem; margin-bottom: 1rem;
        }
        .cal-divider {
          width: 2.5rem; height: 3px; border-radius: 9px;
          background: var(--clr-accent, #c8956c); margin: .6rem 0 1.5rem;
        }

        /* ── Tabs ── */
        .tab-bar {
          display: flex; gap: .4rem; padding: .35rem;
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1rem; margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .tab-btn {
          display: flex; align-items: center; gap: .45rem;
          padding: .6rem 1.1rem; border-radius: .75rem; border: none;
          font-size: .9rem; font-weight: normal; cursor: pointer; white-space: nowrap;
          color: var(--clr-text-muted, #6b5c50); background: transparent;
          transition: background 180ms, color 180ms;
          flex: 1; justify-content: center;
        }
        .tab-btn:hover { background: var(--clr-accent-soft, #f5e6d8); }
        .tab-btn.active { background: var(--clr-accent, #c8956c); color: #fff; }
        .tab-btn:focus-visible { outline: 2px solid var(--clr-accent, #c8956c); outline-offset: 2px; border-radius: .75rem; }

        /* ── Card ── */
        .cal-card {
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem; padding: 2rem;
          box-shadow: 0 8px 32px rgba(74,59,47,.07);
        }

        /* ── Inputs ── */
        .cal-input {
          width: 100%; padding: .8rem 1rem .8rem 2.6rem;
          border-radius: .875rem;
          border: 1.5px solid var(--clr-border, #ecddd0);
          background: var(--clr-bg, #fdfaf6); color: var(--clr-text, #2d1f14);
          font-size: 1rem; font-weight: normal; outline: none;
          transition: border-color 200ms, box-shadow 200ms; box-sizing: border-box;
        }
        .cal-input.no-icon { padding-left: 1rem; }
        .cal-input:focus {
          border-color: var(--clr-accent, #c8956c);
          box-shadow: 0 0 0 3px rgba(200,149,108,.12);
        }
        .cal-input::placeholder { color: var(--clr-muted, #7a6a5e); opacity: .7; }

        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: .9rem; top: 50%; transform: translateY(-50%);
          color: var(--clr-muted, #7a6a5e); font-size: .9rem; pointer-events: none;
        }
        .field-label {
          display: block; font-size: .875rem; font-weight: normal;
          color: var(--clr-primary, #4a3b2f); margin-bottom: .4rem;
        }

        /* ── Primary button ── */
        .cal-btn {
          width: 100%; padding: .9rem; border-radius: .875rem; border: none;
          background: var(--clr-accent, #c8956c); color: #fff;
          font-size: 1rem; font-weight: normal; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          transition: background 200ms, transform 200ms, box-shadow 200ms;
          box-shadow: 0 4px 14px rgba(200,149,108,.3);
        }
        .cal-btn:hover:not(:disabled) { background: var(--clr-accent-hov, #b5794e); transform: translateY(-1px); }
        .cal-btn:active:not(:disabled) { transform: translateY(0); }
        .cal-btn:disabled { opacity: .65; cursor: not-allowed; }
        .cal-btn:focus-visible { outline: 2.5px solid var(--clr-accent, #c8956c); outline-offset: 3px; }

        /* ── Result card ── */
        .result-box {
          background: var(--clr-accent-soft, #f5e6d8);
          border: 1.5px solid rgba(200,149,108,.4);
          border-radius: 1.25rem; padding: 1.5rem; margin-top: 1.25rem;
        }
        .result-stat {
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1rem; padding: 1rem; text-align: center;
        }
        .add-log-btn {
          width: 100%; padding: .8rem; border-radius: .875rem; border: none;
          background: var(--clr-primary, #4a3b2f); color: #fff;
          font-size: .95rem; font-weight: normal; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          transition: background 200ms, transform 200ms;
          margin-top: 1rem;
        }
        .add-log-btn:hover { background: var(--clr-primary-hov, #362a20); transform: translateY(-1px); }
        .add-log-btn:focus-visible { outline: 2px solid var(--clr-primary, #4a3b2f); outline-offset: 3px; }

        /* ── Upload drop zone ── */
        .drop-zone {
          position: relative;
          border: 2px dashed var(--clr-border, #ecddd0);
          border-radius: 1rem; padding: 2.5rem 1rem; text-align: center;
          transition: border-color 200ms, background 200ms; cursor: pointer;
        }
        .drop-zone:hover { border-color: var(--clr-accent, #c8956c); background: var(--clr-accent-soft, #f5e6d8); }
        .drop-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

        /* ── Section title ── */
        .section-title { font-size: 1.1rem; font-weight: normal; color: var(--clr-primary, #4a3b2f); margin-bottom: .3rem; }
        .section-sub   { font-size: .875rem; font-weight: normal; color: var(--clr-text-muted, #6b5c50); margin-bottom: 1.25rem; }
      `}</style>

      <div className="cal-root">
        <div className="max-w-xl mx-auto">

          {/* ── Back ── */}
          <Link href="/dashBoard" className="cal-back" aria-label="Back to Dashboard">
            <FaArrowLeft aria-hidden="true" className="text-xs" /> Back to Dashboard
          </Link>

          {/* ── Header ── */}
          <div className="cal-badge" aria-hidden="true"><FaUtensils /></div>
          <h1 className="text-3xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
            Calories Calculator
          </h1>
          <div className="cal-divider" aria-hidden="true" />
          <p className="text-base font-normal mb-6" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
            Track your nutrition with manual search or AI food scanning.
          </p>

          {/* ── Tabs ── */}
          <div className="tab-bar" role="tablist" aria-label="Calculator mode">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
                role="tab"
                aria-selected={activeTab === t.id}
                aria-controls={`panel-${t.id}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ══════════ MANUAL ══════════ */}
          {activeTab === 'manual' && (
            <div className="cal-card" id="panel-manual" role="tabpanel">
              <p className="section-title">Search Food</p>
              <p className="section-sub">Enter food name and weight to calculate nutrition.</p>

              <form onSubmit={handleManualSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="food-name">Food Name</label>
                  <div className="field-wrap">
                    <FaUtensils className="field-icon" aria-hidden="true" />
                    <input
                      id="food-name" type="text" className="cal-input"
                      placeholder="e.g. Rice, Chicken breast…"
                      value={manualFood} onChange={e => setManualFood(e.target.value)}
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="food-weight">Weight (g)</label>
                  <div className="field-wrap">
                    <FaWeightHanging className="field-icon" aria-hidden="true" />
                    <input
                      id="food-weight" type="number" min="1" className="cal-input"
                      placeholder="Default: 100 g"
                      value={manualWeight} onChange={e => setManualWeight(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="cal-btn" disabled={manualLoading} aria-busy={manualLoading}>
                  <FaSearch aria-hidden="true" />
                  {manualLoading ? "Calculating…" : "Calculate Calories"}
                </button>
              </form>

              {/* Result */}
              {manualResult && !manualResult.error && (
                <div className="result-box" aria-live="polite">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-normal capitalize" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {manualResult.foodName}
                      </p>
                      <p className="text-sm font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                        {manualResult.weight}g serving
                      </p>
                    </div>
                    {!manualResult.found && (
                      <span
                        className="text-xs font-normal px-3 py-1 rounded-full"
                        style={{ background: "rgba(232,130,74,.15)", color: "#e8824a" }}
                      >
                        Estimated
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="result-stat">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <FaFire style={{ color: "#e8824a" }} aria-hidden="true" />
                        <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Calories</p>
                      </div>
                      <p className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {manualResult.calories}
                      </p>
                      <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>kcal</p>
                    </div>
                    <div className="result-stat">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <FaDrumstickBite style={{ color: "#5a9e6f" }} aria-hidden="true" />
                        <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Protein</p>
                      </div>
                      <p className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {manualResult.protein}
                      </p>
                      <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>grams</p>
                    </div>
                  </div>

                  <button className="add-log-btn" onClick={addToDailyLog} aria-label="Add to daily log">
                    <FaPlus aria-hidden="true" /> Add to Daily Log
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ CREATE ══════════ */}
          {activeTab === 'create' && (
            <div className="cal-card" id="panel-create" role="tabpanel">
              <p className="section-title">Add Custom Food</p>
              <p className="section-sub">Add a new item to the database (values per 100 g).</p>

              <form onSubmit={handleCreateSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="c-name">Food Name</label>
                  <input
                    id="c-name" type="text" className="cal-input no-icon" required
                    placeholder="e.g. Protein Bar"
                    value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label" htmlFor="c-cal">Calories (per 100 g)</label>
                    <input
                      id="c-cal" type="number" min="0" className="cal-input no-icon" required
                      placeholder="e.g. 350"
                      value={createForm.calories} onChange={e => setCreateForm({ ...createForm, calories: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="c-pro">Protein (g)</label>
                    <input
                      id="c-pro" type="number" min="0" className="cal-input no-icon" required
                      placeholder="e.g. 25"
                      value={createForm.protein} onChange={e => setCreateForm({ ...createForm, protein: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="cal-btn" disabled={createLoading} aria-busy={createLoading}>
                  <FaCheck aria-hidden="true" />
                  {createLoading ? "Creating…" : "Create Food"}
                </button>
              </form>
            </div>
          )}

          {/* ══════════ UPLOAD ══════════ */}
          {activeTab === 'upload' && (
            <div className="cal-card" id="panel-upload" role="tabpanel">
              <p className="section-title">AI Food Scanner</p>
              <p className="section-sub">Upload a photo of your meal to estimate calories.</p>

              <form onSubmit={handleUploadSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="u-name">Your Name <span style={{ fontSize: ".78rem", color: "var(--clr-muted)" }}>(Optional)</span></label>
                  <input
                    id="u-name" type="text" className="cal-input no-icon"
                    placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="u-email">Email</label>
                  <input
                    id="u-email" type="email" className="cal-input no-icon" required
                    placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="field-label">Meal Photo</label>
                  <div className="drop-zone" aria-label="Upload meal photo">
                    <input type="file" accept="image/*" required onChange={e => setImage(e.target.files?.[0] ?? null)} aria-label="Choose meal photo" />
                    <FaCamera className="text-3xl mx-auto mb-2" style={{ color: "var(--clr-muted, #7a6a5e)" }} aria-hidden="true" />
                    <p className="text-sm font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                      {image ? image.name : "Click to upload or drag & drop"}
                    </p>
                  </div>
                </div>

                <button type="submit" className="cal-btn" disabled={uploadLoading} aria-busy={uploadLoading}>
                  <FaCamera aria-hidden="true" />
                  {uploadLoading ? "Scanning…" : "Scan Food"}
                </button>
              </form>

              {uploadResult && (
                <div className="result-box mt-4" aria-live="polite">
                  {uploadResult.error ? (
                    <p className="text-sm font-normal" style={{ color: "#b91c1c" }}>⚠️ {uploadResult.message}</p>
                  ) : (
                    <>
                      <p className="text-base font-normal mb-2" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        🔥 AI Result
                      </p>
                      <pre
                        className="text-sm font-normal rounded-xl p-4 overflow-x-auto"
                        style={{ background: "var(--clr-surface, #fff)", border: "1.5px solid var(--clr-border, #ecddd0)", color: "var(--clr-text-muted, #6b5c50)" }}
                      >
                        {JSON.stringify(uploadResult.ai, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}