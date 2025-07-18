"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error || !data.user) {
      setError(error?.message || "Login failed");
      setLoading(false);
      return;
    }
    // Fetch profile to get username
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();
    setLoading(false);
    if (profile?.username) {
      router.push(`/${profile.username}`);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 rounded border-2 border-white bg-neon-green text-white font-bold text-lg shadow hover:bg-neon-green/80 hover:text-gray-900 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
        <p className="text-gray-400 text-sm mt-6 text-center">
          Don&apos;t have an account? <Link href="/signup" className="text-neon-green underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage; 