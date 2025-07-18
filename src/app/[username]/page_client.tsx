"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (!data) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </main>
    );
  }

  if (error || !profile) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{profile.display_name}</h1>
        <p className="text-gray-300 mb-4">@{profile.username}</p>
        {profile.bio && (
          <p className="text-gray-400 mb-6">{profile.bio}</p>
        )}
        {profile.avatar_url && (
          <img 
            src={profile.avatar_url} 
            alt={profile.display_name}
            className="w-32 h-32 rounded-full border-4 border-neon-green"
          />
        )}
      </div>
    </main>
  );
}