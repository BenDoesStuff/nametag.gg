"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SignupPage = () => {
  const [form, setForm] = useState({
    displayName: "",
    nickname: "",
    email: "",
    password: "",
    avatarUrl: "",
    bio: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Check if username (nickname) is taken
    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", form.nickname)
      .maybeSingle();
    
    console.log("Username check result:", { existing, checkError, username: form.nickname });
    if (existing) {
      setError("That nickname is already taken.");
      setLoading(false);
      return;
    }
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (authError || !authData.user) {
      setError(authError?.message || "Failed to register. Try again.");
      setLoading(false);
      return;
    }
    // Wait for session/user to be available
    let user: typeof authData.user | null = authData.user;
    if (!user) {
      const { data: userData } = await supabase.auth.getUser();
      user = userData.user;
    }
    if (!user) {
      setError("Could not get authenticated user. Try logging in.");
      setLoading(false);
      return;
    }
    // Insert new profile with user id
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        username: form.nickname,
        display_name: form.displayName,
        avatar_url: form.avatarUrl,
        bio: form.bio,
        email: form.email,
      },
    ]);
    if (insertError) {
      console.error("Profile insert error:", insertError);
      setError(`Failed to create profile: ${insertError.message}`);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    router.push(`/${form.nickname}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h1>
        {success ? (
          <div className="text-center">
            <p className="text-neon-green text-lg font-semibold mb-4">Profile created! Welcome, {form.displayName}.</p>
            <Link href={`/${form.nickname}`} className="text-neon-green underline">Go to your profile</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="displayName"
              placeholder="Display Name"
              value={form.displayName}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <input
              type="text"
              name="nickname"
              placeholder="Nickname (unique username)"
              value={form.nickname}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
                className="accent-neon-green"
              />
              Show Password
            </label>
            <input
              type="url"
              name="avatarUrl"
              placeholder="Avatar URL (optional)"
              value={form.avatarUrl}
              onChange={handleChange}
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <textarea
              name="bio"
              placeholder="Bio (optional)"
              value={form.bio}
              onChange={handleChange}
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none resize-none"
              rows={3}
            />
            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded border-2 border-white bg-neon-green text-white font-bold text-lg shadow hover:bg-neon-green/80 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </form>
        )}
        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account? <Link href="/login" className="text-neon-green underline">Log in</Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage; 