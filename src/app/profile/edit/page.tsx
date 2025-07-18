"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const EditProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  // Restrict editing to the profile owner only
  useEffect(() => {
    if (!loading && profile && userId && profile.id !== userId) {
      router.push(`/${profile.username}`);
    }
  }, [loading, profile, userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setSaving(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setError("Failed to upload avatar.");
      setSaving(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setProfile({ ...profile, avatar_url: data.publicUrl });
    setSaving(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq("id", profile.id);
    if (updateError) {
      setError("Failed to update profile.");
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (loading) return <div className="text-gray-400 text-center mt-12">Loading profile...</div>;
  if (!profile) return <div className="text-red-500 text-center mt-12">Profile not found.</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={profile.avatar_url || "/vercel.svg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-neon-green bg-gray-900 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="text-white mt-2"
            />
          </div>
          <input
            type="text"
            name="display_name"
            placeholder="Display Name"
            value={profile.display_name || ""}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
          />
          <textarea
            name="bio"
            placeholder="Bio (optional)"
            value={profile.bio || ""}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 rounded border-2 border-white bg-neon-green text-white font-bold text-lg shadow hover:bg-neon-green/80 hover:text-gray-900 transition-colors"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          {success && <div className="text-neon-green text-sm text-center mt-2">Profile updated!</div>}
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage; 