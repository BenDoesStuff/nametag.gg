"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const UserSession: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();
        setProfile(profileData);
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setShowMenu(false);
  };

  if (loading) return null;

  return user ? (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="text-white text-sm font-bold px-2 py-1 rounded hover:bg-gray-800 border border-neon-green"
      >
        {profile?.display_name || user.email}
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 flex flex-col">
          {profile && (
            <Link
              href={`/${profile.username}`}
              className="px-4 py-2 text-sm text-white hover:bg-gray-800 border-b border-gray-800"
              onClick={() => setShowMenu(false)}
            >
              My Profile
            </Link>
          )}
          <Link
            href="/profile/edit"
            className="px-4 py-2 text-sm text-white hover:bg-gray-800 border-b border-gray-800"
            onClick={() => setShowMenu(false)}
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-white font-bold text-sm hover:underline">Log In</Link>
      <Link href="/signup" className="text-neon-green font-bold text-sm hover:underline">Sign Up</Link>
    </div>
  );
};

export default UserSession; 