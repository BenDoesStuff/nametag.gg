"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const testResults: any = {};

      // Test 1: Environment variables
      testResults.env = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "...",
      };

      // Test 2: Basic connection
      try {
        const { data, error } = await supabase.from("profiles").select("count");
        testResults.connection = { success: !error, error: error?.message };
      } catch (err) {
        testResults.connection = { success: false, error: "Connection failed" };
      }

      // Test 3: RLS policies
      try {
        const { data, error } = await supabase.from("profiles").select("*").limit(1);
        testResults.rls = { 
          canRead: !error, 
          error: error?.message,
          rowCount: data?.length || 0 
        };
      } catch (err) {
        testResults.rls = { canRead: false, error: "RLS test failed" };
      }

      // Test 4: Auth state
      try {
        const { data: { user } } = await supabase.auth.getUser();
        testResults.auth = { 
          hasUser: !!user, 
          userId: user?.id?.substring(0, 8) + "..." || "No user",
          email: user?.email || "No email"
        };
      } catch (err) {
        testResults.auth = { hasUser: false, error: "Auth test failed" };
      }

      setResults(testResults);
      setLoading(false);
    };

    runTests();
  }, []);

  if (loading) return <div className="p-8 text-white">Running diagnostics...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">System Diagnostics</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(results.env, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Database Connection</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(results.connection, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">RLS Policies</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(results.rls, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Authentication</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(results.auth, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}