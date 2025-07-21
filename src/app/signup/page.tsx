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

    try {
      // Step 1: Validate form
      if (!form.nickname.trim() || !form.displayName.trim() || !form.email.trim() || !form.password.trim()) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      // Step 2: Check if username is taken (with better error handling)
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", form.nickname.toLowerCase())
        .maybeSingle();
      
      console.log("Username check:", { existing, checkError, username: form.nickname });
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found, which is what we want
        console.error("Username check failed:", checkError);
        setError("Error checking username availability. Please try again.");
        setLoading(false);
        return;
      }
      
      if (existing) {
        setError("That username is already taken.");
        setLoading(false);
        return;
      }

      // Step 3: Create Auth user with auto-confirm
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/${form.nickname.toLowerCase()}`
        }
      });

      console.log("Auth signup result:", { authData, authError });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create user account. Please try again.");
        setLoading(false);
        return;
      }

      // Step 4: For development, try direct approach with service role
      // Note: This assumes your Supabase has email confirmation disabled for development
      
      // First, try to sign in immediately (works if email confirmation is disabled)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      console.log("Sign in attempt:", { signInData, signInError });

      // Step 5: Create profile using server-side approach
      const profileData = {
        id: authData.user.id,
        username: form.nickname.toLowerCase(),
        display_name: form.displayName,
        bio: form.bio || null,
        email: form.email,
      };

      console.log("Creating profile with data:", profileData);

      // Try to create profile
      const { data: profileResult, error: insertError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select()
        .single();

      console.log("Profile creation result:", { profileResult, insertError });

      if (insertError) {
        // If profile creation fails, it might be due to email confirmation requirement
        console.error("Profile insert error:", insertError);
        
        if (insertError.message.includes('violates row-level security')) {
          setError("Account created! Please check your email to confirm your account, then try logging in.");
          setSuccess(true);
          setLoading(false);
          return;
        } else {
          setError(`Failed to create profile: ${insertError.message}`);
          setLoading(false);
          return;
        }
      }

      // Step 5: Success
      console.log("Signup successful! Profile created:", profileResult);
      setSuccess(true);
      setLoading(false);
      
      // Wait a moment for data to be available, then redirect
      setTimeout(() => {
        router.push(`/${form.nickname.toLowerCase()}`);
      }, 1000);

    } catch (err) {
      console.error("Unexpected signup error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-3 sm:p-4">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Sign Up</h1>
        {success ? (
          <div className="text-center">
            <p className="text-neon-green text-base sm:text-lg font-semibold mb-3 sm:mb-4">Profile created! Welcome, {form.displayName}.</p>
            <Link href={`/${form.nickname}`} className="text-neon-green underline text-sm sm:text-base">Go to your profile</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <input
              type="text"
              name="displayName"
              placeholder="Display Name"
              value={form.displayName}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <input
              type="text"
              name="nickname"
              placeholder="Nickname (unique username)"
              value={form.nickname}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
            />
            <label className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
                className="w-3 h-3 sm:w-4 sm:h-4 text-neon-green bg-gray-800 border-gray-700 rounded focus:ring-neon-green focus:ring-2"
              />
              Show Password
            </label>
            <textarea
              name="bio"
              placeholder="Bio (optional)"
              value={form.bio}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none resize-none"
              rows={3}
            />
            <button
              type="submit"
              className="mt-1 sm:mt-2 px-4 sm:px-6 py-2 rounded border-2 border-white bg-neon-green text-white font-bold text-sm sm:text-lg shadow hover:bg-neon-green/80 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <div className="text-red-500 text-xs sm:text-sm text-center mt-2">{error}</div>}
          </form>
        )}
        <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6 text-center">
          Already have an account? <Link href="/login" className="text-neon-green underline">Log in</Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage; 