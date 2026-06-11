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

// قراءة رابط الباك-إند ديناميكياً من متغيرات البيئة (وفي حالة عدم وجوده يقرأ الـ Localhost الافتراضي برقم بورت 8000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CaloriesUploader() {
  const { data: session } = useSession();
  const { refreshHealthData } = useHealth();

  const [activeTab, setActiveTab] = useState<Tab>('manual');

  // Upload (AI Scan) state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Manual state
  const [manualFood, setManualFood] = useState("");
  const [manualWeight, setManualWeight] = useState("100");
  const [manualResult, setManualResult] = useState<any>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // Create state
  const [createForm, setCreateForm] = useState({ name: "", calories: "", protein: "" });
  const [createLoading, setCreateLoading] = useState(false);

  /* ── Handles File Selection & Preview ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  /* ── 1. Manual Search Handler ── */
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFood.trim()) return;
    setManualLoading(true); setManualResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/food/calculate`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: manualFood, weight: manualWeight }),
      });
      if (!res.ok) throw new Error();
      setManualResult(await res.json());
    } catch { 
      setManualResult({ error: true, message: "Failed to calculate nutrition. Please try again." }); 
    } finally { 
      setManualLoading(false); 
    }
  };

  /* ── 2. Unified Add to Daily Log Handler ── */
  const addToDailyLog = async (foodName: string, calories: number, protein: number) => {
    if (!session?.user?.email) { 
      Swal.fire('Error', 'You must be logged in to save meals.', 'error'); 
      return; 
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/daily-intake/add`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          foodName,
          calories: Number(calories),
          protein: Number(protein),
        }),
      });
      if (res.ok) {
        Swal.fire({ 
          title: 'Added!', 
          text: `"${foodName}" (${calories} kcal) logged successfully.`, 
          icon: 'success', 
          timer: 2000, 
          showConfirmButton: false 
        });
        // إفراغ الـ States بعد النجاح
        setManualFood(""); setManualResult(null); setUploadResult(null); setImage(null); setImagePreview(null);
        refreshHealthData(); // تحديث الـ Context بالبيانات الجديدة تلقائياً
      } else { 
        Swal.fire('Error', 'Failed to save to daily log.', 'error'); 
      }
    } catch { 
      Swal.fire('Error', 'Network error. Could not connect to server.', 'error'); 
    }
  };

  /* ── 3. Custom Food Creator Handler ── */
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!createForm.name || !createForm.calories || !createForm.protein) return;
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/food/create`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: createForm.name, 
          calories: Number(createForm.calories), 
          protein: Number(createForm.protein), 
          email: session?.user?.email 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('Success', 'Custom food added to database!', 'success');
        setCreateForm({ name: "", calories: "", protein: "" });
        setActiveTab('manual'); 
        setManualFood(data.food.name); // يحول المستخدم تلقائياً للتابة الأولى مع تعبئة الاسم
      } else { 
        Swal.fire('Error', data.error || 'Failed to create food.', 'error'); 
      }
    } catch { 
      Swal.fire('Error', 'Network error while creating food.', 'error'); 
    } finally { 
      setCreateLoading(false); 
    }
  };

  /* ── 4. AI Food Scanner Handler ── */
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!image) { Swal.fire('Warning', 'Please upload or snap a photo first.', 'warning'); return; }
    if (!session?.user?.email) { Swal.fire('Error', 'You must be logged in to use AI Scanner.', 'error'); return; }
    
    setUploadLoading(true); setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("email", session.user.email);
      formData.append("image", image);

      const res = await fetch(`${API_BASE_URL}/api/food/scan`, { method: "POST", body: formData });
      const data = await res.json();
      
      // نتوقع استلام النتيجة بشكل مهندم: { success: true, result: { foodName: "...", calories: 350, protein: 20 } }
      if (res.ok && data.result) {
        setUploadResult({ error: false, ai: data.result });
      } else {
        setUploadResult({ error: true, message: data.error || "AI could not recognize the meal. Try a clearer photo." });
      }
    } catch { 
      setUploadResult({ error: true, message: "Failed to connect to AI server." }); 
    } finally { 
      setUploadLoading(false); 
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'manual', label: 'Search Food', icon: <FaSearch aria-hidden="true" /> },
    { id: 'create', label: 'Add New Food', icon: <FaPlus aria-hidden="true" /> },
    { id: 'upload', label: 'AI Scan', icon: <FaCamera aria-hidden="true" /> },
  ];

  return (
    <>
      <style>{`
        .cal-root { min-height: 100vh; background: var(--clr-bg, #fdfaf6); padding: 2.5rem 1.5rem 5rem; }
        .cal-back { display: inline-flex; align-items: center; gap: .45rem; font-size: .9rem; color: var(--clr-accent, #c8956c); text-decoration: none; padding: .35rem .7rem; border-radius: .5rem; transition: background 180ms, transform 180ms; margin-bottom: 1.75rem; }
        .cal-back:hover { background: var(--clr-accent-soft, #f5e6d8); transform: translateX(-3px); }
        .cal-badge { width: 56px; height: 56px; border-radius: 50%; background: var(--clr-accent-soft, #f5e6d8); display: flex; align-items: center; justify-content: center; color: var(--clr-accent, #c8956c); font-size: 1.5rem; margin-bottom: 1rem; }
        .cal-divider { width: 2.5rem; height: 3px; border-radius: 9px; background: var(--clr-accent, #c8956c); margin: .6rem 0 1.5rem; }
        .tab-bar { display: flex; gap: .4rem; padding: .35rem; background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1rem; margin-bottom: 1.5rem; overflow-x: auto; }
        .tab-btn { display: flex; align-items: center; gap: .45rem; padding: .6rem 1.1rem; border-radius: .75rem; border: none; font-size: .9rem; cursor: pointer; white-space: nowrap; color: var(--clr-text-muted, #6b5c50); background: transparent; transition: background 180ms, color 180ms; flex: 1; justify-content: center; }
        .tab-btn:hover { background: var(--clr-accent-soft, #f5e6d8); }
        .tab-btn.active { background: var(--clr-accent, #c8956c); color: #fff; }
        .cal-card { background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 8px 32px rgba(74,59,47,.07); }
        .cal-input { width: 100%; padding: .8rem 1rem .8rem 2.6rem; border-radius: .875rem; border: 1.5px solid var(--clr-border, #ecddd0); background: var(--clr-bg, #fdfaf6); color: var(--clr-text, #2d1f14); font-size: 1rem; outline: none; transition: border-color 200ms, box-shadow 200ms; box-sizing: border-box; }
        .cal-input.no-icon { padding-left: 1rem; }
        .cal-input:focus { border-color: var(--clr-accent, #c8956c); box-shadow: 0 0 0 3px rgba(200,149,108,.12); }
        .field-wrap { position: relative; }
        .field-icon { position: absolute; left: .9rem; top: 50%; transform: translateY(-50%); color: var(--clr-muted, #7a6a5e); font-size: .9rem; pointer-events: none; }
        .field-label { display: block; font-size: .875rem; color: var(--clr-primary, #4a3b2f); margin-bottom: .4rem; }
        .cal-btn { width: 100%; padding: .9rem; border-radius: .875rem; border: none; background: var(--clr-accent, #c8956c); color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem; transition: background 200ms, transform 200ms, box-shadow 200ms; box-shadow: 0 4px 14px rgba(200,149,108,.3); }
        .cal-btn:hover:not(:disabled) { background: var(--clr-accent-hov, #b5794e); transform: translateY(-1px); }
        .cal-btn:disabled { opacity: .65; cursor: not-allowed; }
        .result-box { background: var(--clr-accent-soft, #f5e6d8); border: 1.5px solid rgba(200,149,108,.4); border-radius: 1.25rem; padding: 1.5rem; margin-top: 1.25rem; }
        .result-stat { background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1rem; padding: 1rem; text-align: center; }
        .add-log-btn { width: 100%; padding: .8rem; border-radius: .875rem; border: none; background: var(--clr-primary, #4a3b2f); color: #fff; font-size: .95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem; transition: background 200ms, transform 200ms; margin-top: 1rem; }
        .add-log-btn:hover { background: var(--clr-primary-hov, #362a20); transform: translateY(-1px); }
        .drop-zone { position: relative; border: 2px dashed var(--clr-border, #ecddd0); border-radius: 1rem; padding: 2.5rem 1rem; text-align: center; transition: border-color 200ms, background 200ms; cursor: pointer; }
        .drop-zone:hover { border-color: var(--clr-accent, #c8956c); background: var(--clr-accent-soft, #f5e6d8); }
        .drop-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .preview-img { max-height: 180px; object-fit: cover; border-radius: .75rem; margin: 0 auto .75rem; border: 1.5px solid var(--clr-border, #ecddd0); }
        .section-title { font-size: 1.1rem; color: var(--clr-primary, #4a3b2f); margin-bottom: .3rem; }
        .section-sub { font-size: .875rem; color: var(--clr-text-muted, #6b5c50); margin-bottom: 1.25rem; }
      `}</style>

      <div className="cal-root">
        <div className="max-w-xl mx-auto">

          {/* ── Back to Dashboard Button ── */}
          <Link href="/dashBoard" className="cal-back" aria-label="Back to Dashboard">
            <FaArrowLeft aria-hidden="true" className="text-xs" /> Back to Dashboard
          </Link>

          {/* ── Page Header ── */}
          <div className="cal-badge" aria-hidden="true"><FaUtensils /></div>
          <h1 className="text-3xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
            Calories Calculator
          </h1>
          <div className="cal-divider" aria-hidden="true" />
          <p className="text-base font-normal mb-6" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
            Track your daily nutrition using manual database lookup or AI instant meal scanning.
          </p>

          {/* ── Top Tabs Controller ── */}
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

          {/* ═══════════════════════════════════════════ */}
          {/* ══════════════ TAB 1: MANUAL ══════════════ */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'manual' && (
            <div className="cal-card" id="panel-manual" role="tabpanel">
              <p className="section-title">Search Food</p>
              <p className="section-sub">Enter food item name and serving weight to calculate nutritional values.</p>

              <form onSubmit={handleManualSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="food-name">Food Name</label>
                  <div className="field-wrap">
                    <FaUtensils className="field-icon" aria-hidden="true" />
                    <input
                      id="food-name" type="text" className="cal-input"
                      placeholder="e.g. Rice, Grilled chicken breast, Oats…"
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

                <button type="submit" className="cal-btn" disabled={manualLoading || !manualFood.trim()} aria-busy={manualLoading}>
                  <FaSearch aria-hidden="true" />
                  {manualLoading ? "Searching & Calculating…" : "Calculate Calories"}
                </button>
              </form>

              {/* Manual Result Panel */}
              {manualResult && (
                <div className="result-box" aria-live="polite">
                  {manualResult.error ? (
                    <p className="text-sm font-normal" style={{ color: "#b91c1c" }}>⚠️ {manualResult.message}</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-normal capitalize" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            {manualResult.foodName}
                          </p>
                          <p className="text-sm font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                            {manualResult.weight || manualWeight}g serving
                          </p>
                        </div>
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

                      <button className="add-log-btn" onClick={() => addToDailyLog(manualResult.foodName, manualResult.calories, manualResult.protein)} aria-label="Add to daily log">
                        <FaPlus aria-hidden="true" /> Add to Daily Log
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* ══════════════ TAB 2: CREATE ══════════════ */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'create' && (
            <div className="cal-card" id="panel-create" role="tabpanel">
              <p className="section-title">Add Custom Food</p>
              <p className="section-sub">Can't find a meal? Add a custom item to your database (values per 100 g).</p>

              <form onSubmit={handleCreateSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="c-name">Custom Food Name</label>
                  <input
                    id="c-name" type="text" className="cal-input no-icon" required
                    placeholder="e.g. Whey Protein ISO, Whey Bar"
                    value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label" htmlFor="c-cal">Calories (per 100g)</label>
                    <input
                      id="c-cal" type="number" min="0" className="cal-input no-icon" required
                      placeholder="e.g. 350"
                      value={createForm.calories} onChange={e => setCreateForm({ ...createForm, calories: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="c-pro">Protein (per 100g)</label>
                    <input
                      id="c-pro" type="number" min="0" className="cal-input no-icon" required
                      placeholder="e.g. 25"
                      value={createForm.protein} onChange={e => setCreateForm({ ...createForm, protein: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="cal-btn" disabled={createLoading || !createForm.name || !createForm.calories || !createForm.protein} aria-busy={createLoading}>
                  <FaCheck aria-hidden="true" />
                  {createLoading ? "Saving Custom Food…" : "Create & Save Food"}
                </button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* ══════════════ TAB 3: AI SCAN ═════════════ */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'upload' && (
            <div className="cal-card" id="panel-upload" role="tabpanel">
              <p className="section-title">AI Food Scanner</p>
              <p className="section-sub">Upload or take a photo of your food plate to instantly estimate calories and protein via Gemini AI.</p>

              <form onSubmit={handleUploadSubmit} noValidate className="space-y-4">
                <div>
                  <label className="field-label">Meal Photo</label>
                  <div className="drop-zone" aria-label="Upload meal photo container">
                    <input type="file" accept="image/*" required onChange={handleFileChange} aria-label="Choose image file" />
                    
                    {imagePreview ? (
                      <img src={imagePreview} alt="Meal preview" className="preview-img" />
                    ) : (
                      <FaCamera className="text-3xl mx-auto mb-2" style={{ color: "var(--clr-muted, #7a6a5e)" }} aria-hidden="true" />
                    )}
                    
                    <p className="text-sm font-normal px-2" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                      {image ? `Selected: ${image.name}` : "Click to snap/upload or drag & drop your plate image"}
                    </p>
                  </div>
                </div>

                <button type="submit" className="cal-btn" disabled={uploadLoading || !image} aria-busy={uploadLoading}>
                  <FaCamera aria-hidden="true" />
                  {uploadLoading ? "Gemini AI Analyzing Meal..." : "Scan Meal with AI"}
                </button>
              </form>

              {/* AI Structured Results Panel */}
              {uploadResult && (
                <div className="result-box mt-4" aria-live="polite">
                  {uploadResult.error ? (
                    <p className="text-sm font-normal" style={{ color: "#b91c1c" }}>⚠️ {uploadResult.message}</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-normal capitalize" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            {uploadResult.ai.foodName || "Detected Dish"}
                          </p>
                          <p className="text-sm font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                            AI Visual Macro Estimation
                          </p>
                        </div>
                        <span className="text-xs font-normal px-3 py-1 rounded-full" style={{ background: "rgba(200,149,108,.15)", color: "var(--clr-accent)" }}>
                          Gemini Vision Enabled
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="result-stat">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <FaFire style={{ color: "#e8824a" }} aria-hidden="true" />
                            <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Calories</p>
                          </div>
                          <p className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            {uploadResult.ai.calories}
                          </p>
                          <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>kcal</p>
                        </div>
                        <div className="result-stat">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <FaDrumstickBite style={{ color: "#5a9e6f" }} aria-hidden="true" />
                            <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Protein</p>
                          </div>
                          <p className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            {uploadResult.ai.protein}
                          </p>
                          <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>grams</p>
                        </div>
                      </div>

                      <button 
                        className="add-log-btn" 
                        onClick={() => addToDailyLog(uploadResult.ai.foodName, uploadResult.ai.calories, uploadResult.ai.protein)}
                        style={{ background: "var(--clr-accent, #c8956c)" }}
                      >
                        <FaPlus aria-hidden="true" /> Approve & Log AI Estimation
                      </button>
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