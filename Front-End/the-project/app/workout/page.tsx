"use client";
import React, { useState, useEffect } from "react";
import sal from "sal.js";
import "sal.js/dist/sal.css";
import Image from "next/image";
import Link from "next/link";
import image from "@/theEnvironment/1762025728119.png"
export default function WorkoutFormPage() {
  useEffect(() => {
    sal({ threshold: 0.2, once: true, root: null });
  }, []);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    goal: "lose_fat",
    level: "beginner",
    daysPerWeek: "3",
    sessionMinutes: "45",
    equipment: {
      bodyweight: true,
      dumbbells: false,
      barbell: false,
      bands: false,
      machine: false,
    },
    notes: "",
    email: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const toggleEquip = (key: string) =>
    setForm((p) => ({
      ...p,
      equipment: { ...p.equipment, [key]: !p.equipment[key as keyof typeof p.equipment] },
    }));

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.age || Number(form.age) <= 0) return "Please enter a valid age.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const err = validate();
    if (err) {
      setResult({ ok: false, message: err });
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      ...form,
    };
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ✅ هنا كانت المشكلة
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Data sent successfully:", data);
        setResult({
          ok: true,
          message: "✅ Submitted successfully! Your workout request will be sent to You In Some Minutes.",
        });
      } else {
        console.error("❌ Server error:", data);
        setResult({
          ok: false,
          message: data.error || "❌ Failed to send — check webhook URL or network.",
        });
      }
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      setResult({
        ok: false,
        message: "❌ Network error — check your backend or CORS settings.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans leading-relaxed bg-gray-50 text-gray-800">
      {/* Hero */}
      <section className="relative h-[46vh] md:h-[54vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#EFE7DC] to-[#5a4a42ab]"></div>
        <div className="relative z-10 p-4" data-sal="zoom-in" data-sal-duration="600">
          <div className="mx-auto w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <Image src={image} alt="Your Health" width={192} height={192} className="object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">
            Personalized Workout Request
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700">
            Fill the short form below and an automated workflow will build a workout plan for you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 md:px-12">
        <div className="max-w-4xl mx-auto rounded-2xl shadow-md p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Tell us a bit about you</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                  placeholder="Ahmed Eissa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                  placeholder="e.g. 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal</label>
                <select
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                >
                  <option value="lose_fat">Lose Fat</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="stay_fit">Stay Fit / Tone</option>
                  <option value="rehab">Rehab / Mobility</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => update("level", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Days / week</label>
                <select
                  value={form.daysPerWeek}
                  onChange={(e) => update("daysPerWeek", e.target.value)}
                  className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                >
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Available equipment</label>
              <div className="flex flex-wrap gap-3">
                {equipmentList.map((eq) => (
                  <label key={eq.key} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.equipment[eq.key as keyof typeof form.equipment]}
                      onChange={() => toggleEquip(eq.key)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{eq.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Extra notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className="mt-1 block w-full border rounded-md p-3 focus:ring-2 focus:ring-[#5A4A42] bg-white border-gray-300"
                placeholder="Any injuries, preferences, or constraints..."
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="font-bold py-3 px-6 rounded-md disabled:opacity-60 bg-[#5A4A42] text-white hover:bg-[#4a3b34]"
              >
                {submitting ? "Sending..." : "Send"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: "",
                    age: "",
                    gender: "male",
                    goal: "lose_fat",
                    level: "beginner",
                    daysPerWeek: "3",
                    sessionMinutes: "45",
                    equipment: {
                      bodyweight: true,
                      dumbbells: false,
                      barbell: false,
                      bands: false,
                      machine: false,
                    },
                    notes: "",
                    email: "",
                  });
                  setResult(null);
                }}
                className="border py-3 px-4 rounded-md border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`mt-4 p-3 rounded-md ${result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
              >
                {result.message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 md:px-12 text-center bg-[#e3dbcf] text-[#5A4A42]">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">
            Want a custom plan delivered automatically?
          </h3>
          <p className="mb-4">
            Connect this form to your automation to generate programs, save to DB, or send an email to the user.
          </p>
          <Link href="/" className="underline font-medium text-[#5A4A42]">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

/* Equipment list */
const equipmentList = [
  { key: "bodyweight", label: "Bodyweight" },
  { key: "dumbbells", label: "Dumbbells" },
  { key: "barbell", label: "Barbell" },
  { key: "bands", label: "Resistance Bands" },
  { key: "machine", label: "Gym Machines" },
];
