"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle(); // Use maybeSingle() instead of single()

        console.log("Profile query result:", { data, error, username });

        if (error) {
          console.error("Profile fetch error:", error.message || error);
          setError(true);
        } else if (!data) {
          console.log("No profile found for username:", username);
          setError(true);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(true);
      }
      setLoading(false);
    };

    if (username) fetchProfile();
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
            className="w-32 h-32 rounded-full border-4 border-neon-green object-cover"
          />
        )}
      </div>
    </main>
  );
}