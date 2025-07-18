"use client";

import React, { useState } from "react";

interface User {
  id: string;
  displayName: string;
}

const AddFriend: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<string[]>([]);

  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const addFriend = async (friendId: string) => {
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    setAdded((prev) => [...prev, friendId]);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow w-full max-w-md mt-8">
      <h2 className="text-xl font-bold text-neon-green mb-4">Add Friend</h2>
      <form onSubmit={searchUsers} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-neon-green text-gray-900 font-bold shadow hover:bg-neon-green/80 transition-colors"
        >
          Search
        </button>
      </form>
      {loading && <div className="text-gray-400">Searching...</div>}
      <ul className="space-y-2">
        {results.map((user) => (
          <li key={user.id} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
            <span className="text-white font-medium">{user.displayName}</span>
            <button
              onClick={() => addFriend(user.id)}
              disabled={added.includes(user.id)}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                added.includes(user.id)
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-neon-green text-gray-900 hover:bg-neon-green/80"
              }`}
            >
              {added.includes(user.id) ? "Added" : "Add Friend"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFriend; 