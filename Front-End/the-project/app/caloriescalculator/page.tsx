"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from 'sweetalert2';
import { FaCamera, FaSearch, FaPlus, FaUtensils, FaWeightHanging } from "react-icons/fa";
import { useHealth } from '../context/HealthContext';
import { useTheme } from '../context/ThemeContext';

export default function CaloriesUploader() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'create'>('manual');

  // Upload State
  const [form, setForm] = useState({ name: "", email: "" });
  const [image, setImage] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Manual State
  const [manualFood, setManualFood] = useState("");
  const [manualWeight, setManualWeight] = useState("100"); // Default 100g
  const [manualResult, setManualResult] = useState<any>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // Create Food State
  const [createForm, setCreateForm] = useState({ name: "", calories: "", protein: "" });
  const [createLoading, setCreateLoading] = useState(false);

  // --- Upload Handlers ---
  const handleUploadChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadSubmit = async (e: any) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:8000/caloriescalculator", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadResult({ error: true, message: data.error || "Failed" });
        return;
      }

      setUploadResult({
        error: false,
        message: "Success",
        ai: data.result,
      });

    } catch (error) {
      console.error(error);
      setUploadResult({ error: true, message: "❌ Failed to send data." });
    } finally {
      setUploadLoading(false);
    }
  };

  // --- Manual Handlers ---
  const handleManualSubmit = async (e: any) => {
    e.preventDefault();
    if (!manualFood.trim()) return;

    setManualLoading(true);
    setManualResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/food/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: manualFood,
          weight: manualWeight
        }),
      });
      const data = await res.json();
      setManualResult(data);
    } catch (error) {
      console.error(error);
      setManualResult({ error: true, message: "Failed to calculate." });
    } finally {
      setManualLoading(false);
    }
  };

  const { refreshHealthData } = useHealth();

  const addToDailyLog = async () => {
    if (!session?.user?.email) {
      Swal.fire('Error', 'You must be logged in to save to your daily log.', 'error');
      return;
    }
    if (!manualResult) return;

    try {
      const res = await fetch("http://localhost:8000/api/daily-intake/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          foodName: manualResult.foodName,
          calories: manualResult.calories,
          protein: manualResult.protein
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: 'Success!',
          text: `Added ${manualResult.calories} kcal to your daily intake.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        setManualFood("");
        setManualResult(null);
        refreshHealthData(); // Update global health data
      } else {
        Swal.fire('Error', 'Failed to save.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Network error.', 'error');
    }
  };

  // --- Create Food Handlers ---
  const handleCreateChange = (e: any) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: any) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/food/create", {
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
        Swal.fire('Success', 'Food created successfully!', 'success');
        setCreateForm({ name: "", calories: "", protein: "" });
        setActiveTab('manual');
        setManualFood(data.food.name);
      } else {
        Swal.fire('Error', data.error || 'Failed to create food', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Network error', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-[#f6f4ee] text-[#4a3b34]'}`}>
      <div className="w-full max-w-2xl">
        <h1 className={`text-4xl text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>Calories Calculator</h1>
        <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Track your nutrition with AI or manual entry</p>
        {/* Tabs */}
        <div className={`flex justify-center mb-8 p-1 rounded-full shadow-sm border w-full max-w-full overflow-x-auto mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {[
            { id: 'manual', label: 'Manual Search', icon: <FaSearch /> },
            { id: 'create', label: 'Add New Food', icon: <FaPlus /> },
            { id: 'upload', label: 'AI Scan', icon: <FaCamera /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === tab.id
                ? (theme === 'dark' ? 'bg-gray-700 text-white shadow-md' : 'bg-[#5A4A42] text-white shadow-md')
                : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={`shadow-xl rounded-3xl p-8 border transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#e8dfd7]'}`}>

          {activeTab === 'manual' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2 className={`text-2xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Search Food</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Enter food name and weight to calculate</p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <FaUtensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Food Name (e.g. Rice)"
                      value={manualFood}
                      onChange={(e) => setManualFood(e.target.value)}
                      className={`w-full pl-10 p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                  <div className="w-1/3 relative">
                    <FaWeightHanging className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Weight (g)"
                      value={manualWeight}
                      onChange={(e) => setManualWeight(e.target.value)}
                      className={`w-full pl-10 p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={manualLoading}
                  className={`w-full py-4 rounded-2xl transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#5A4A42] text-white hover:bg-[#4a3b34]'}`}
                >
                  {manualLoading ? "Calculating..." : "Calculate Calories"}
                </button>
              </form>

              {manualResult && !manualResult.error && (
                <div className={`mt-6 p-6 rounded-3xl border animate-slide-up ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-[#effcf2] border-[#d2ead8]'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-2xl capitalize ${theme === 'dark' ? 'text-green-400' : 'text-[#2f5c3b]'}`}>{manualResult.foodName}</h3>
                      <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-green-300' : 'text-[#3c6e47]'}`}>{manualResult.weight}g serving</p>
                    </div>
                    {!manualResult.found && (
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs">
                        Estimated
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-2xl text-center shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Calories</p>
                      <p className={`text-3xl ${theme === 'dark' ? 'text-green-400' : 'text-[#2f5c3b]'}`}>{manualResult.calories}</p>
                      <p className="text-xs text-gray-400">kcal</p>
                    </div>
                    <div className={`p-4 rounded-2xl text-center shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Protein</p>
                      <p className={`text-3xl ${theme === 'dark' ? 'text-green-400' : 'text-[#2f5c3b]'}`}>{manualResult.protein}</p>
                      <p className="text-xs text-gray-400">grams</p>
                    </div>
                  </div>

                  <button
                    onClick={addToDailyLog}
                    className="w-full py-3 bg-[#3c6e47] text-white rounded-xl hover:bg-[#2f5c3b] transition  flex items-center justify-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add to Daily Log</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- Create Food Mode --- */}
          {activeTab === 'create' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Add Custom Food</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Add a new item to the database (per 100g)</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Food Name (e.g. Protein Bar)"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  required
                  className={`w-full p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                />
                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="calories"
                    placeholder="Calories (per 100g)"
                    value={createForm.calories}
                    onChange={handleCreateChange}
                    required
                    className={`w-1/2 p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  />
                  <input
                    type="number"
                    name="protein"
                    placeholder="Protein (g)"
                    value={createForm.protein}
                    onChange={handleCreateChange}
                    required
                    className={`w-1/2 p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={createLoading}
                  className={`w-full py-4 rounded-2xl transition text-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#5A4A42] text-white hover:bg-[#4a3b34]'}`}
                >
                  {createLoading ? "Creating..." : "Create Food"}
                </button>
              </form>
            </div>
          )}

          {/* --- Upload Mode --- */}
          {activeTab === 'upload' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2 className={`text-2xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>AI Food Scanner</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Upload a photo to estimate calories</p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name (optional)"
                  value={form.name}
                  onChange={handleUploadChange}
                  className={`w-full p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleUploadChange}
                  className={`w-full p-4 border rounded-2xl focus:ring-2 focus:ring-[#5A4A42] outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  required
                />

                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FaCamera className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to upload or drag and drop</p>
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className={`w-full py-4 rounded-2xl transition text-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#5A4A42] text-white hover:bg-[#4a3b34]'}`}
                >
                  {uploadLoading ? "Scanning..." : "Scan Food"}
                </button>
              </form>

              {/* ==== RESULT ==== */}
              {uploadResult && (
                <div className={`mt-6 text-left p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  {uploadResult.error ? (
                    <p className="text-red-600">{uploadResult.message}</p>
                  ) : (
                    <>
                      <h3 className={`text-lg mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>🔥 AI Result</h3>
                      <pre className={`text-sm whitespace-pre-wrap p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200'}`}>
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
    </div>
  );
}
