"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { BlockRenderer } from "@/components/blocks";
import { useProfileLayout } from "@/hooks/useProfileLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DEFAULT_THEME } from "@/lib/themePresets";
import { getDefaultLayout } from "@/lib/blockDefinitions";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  email: string;
  created_at: string;
  social_links?: { [platform: string]: string };
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Get profile layout and theme
  const { 
    layout, 
    loading: layoutLoading 
  } = useProfileLayout(profile?.id);


  useEffect(() => {
    
    const fetchProfileAndUser = async () => {
      try {
        console.log("Fetching profile for username:", username);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from("profiles")
          .select("count")
          .limit(1);
        
        console.log("Connection test:", { testData, testError });

        // Fetch the specific profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username.toLowerCase())
          .maybeSingle();

        console.log("Profile query:", {
          username: username.toLowerCase(),
          data,
          error,
          errorMessage: error?.message,
          errorCode: error?.code
        });

        if (error) {
          console.error("Profile fetch error:", error);
          setError(`Database error: ${error.message}`);
        } else if (!data) {
          console.log("No profile found for username:", username);
          setError(`No profile found for username: ${username}`);
        } else {
          console.log("Profile found successfully:", data);
          setProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      }
      setLoading(false);
    };

    if (username) {
      fetchProfileAndUser();
    }
  }, [username]);


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading profile for @{username}...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-300 mb-4">
            {error || `No profile found for username: ${username}`}
          </p>
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Use layout data or fall back to defaults
  const blocks = layout?.blocks || getDefaultLayout();
  const theme = layout?.theme || DEFAULT_THEME;

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Render blocks dynamically */}
          <div className="space-y-6">
            {blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                profile={profile}
                isEditing={false}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          {/* Edit Profile Button - Only visible to profile owner */}
          {currentUser && profile && currentUser.id === profile.id && (
            <div className="fixed bottom-6 right-6 z-50">
              <Link
                href="/profile-editor"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
                title="Edit Profile Layout"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="hidden sm:inline">Edit Layout</span>
              </Link>
            </div>
          )}

          {/* Loading indicator for layout */}
          {layoutLoading && (
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-gray-300 text-sm">Loading layout...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}