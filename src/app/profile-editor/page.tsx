"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ProfileBlock, ProfileTheme } from "@/types/layout";

const EditProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        
        setUserId(user.id);
        
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          setError("Failed to load profile");
          return;
        }
        
        setProfile(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Restrict editing to the profile owner only
  useEffect(() => {
    if (!loading && profile && userId && profile.id !== userId) {
      router.push("/");
    }
  }, [loading, profile, userId, router]);

  const handleSave = async (blocks: ProfileBlock[], theme: ProfileTheme) => {
    try {
      // The ProfileEditor already handles saving via useProfileLayout
      // We can add additional logic here if needed
      router.push("/");
    } catch (err) {
      console.error("Error saving profile layout:", err);
      setError("Failed to save profile changes");
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading profile editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Profile not found</div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProfileEditor
      profile={profile}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EditProfilePage;