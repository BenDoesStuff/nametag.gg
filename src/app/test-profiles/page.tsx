"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const testQueries = async () => {
      // Test 1: Select all profiles
      const { data: allProfiles, error: allError } = await supabase
        .from("profiles")
        .select("*");
      
      console.log("All profiles query:", { allProfiles, allError });
      
      // Test 2: Count profiles
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      console.log("Profile count:", { count, countError });
      
      if (allError) {
        setError(allError.message);
      } else {
        setProfiles(allProfiles || []);
      }
    };
    
    testQueries();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Test</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div>
        <h2 className="text-xl mb-2">Profiles found: {profiles.length}</h2>
        {profiles.map((profile, idx) => (
          <div key={idx} className="border p-4 mb-2">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Display Name:</strong> {profile.display_name}</p>
            <p><strong>ID:</strong> {profile.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}