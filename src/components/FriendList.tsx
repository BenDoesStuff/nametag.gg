"use client";

import React, { useEffect, useState } from "react";

interface Friend {
  id: string;
  displayName: string;
}

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
        setLoading(false);
      });
  }, []);

  const removeFriend = async (friendId: string) => {
    await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  if (loading) return <div className="text-gray-400">Loading friends...</div>;

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow w-full max-w-md">
      <h2 className="text-xl font-bold text-neon-green mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <div className="text-gray-400">No friends yet.</div>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li key={friend.id} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-white font-medium">{friend.displayName}</span>
              <button
                onClick={() => removeFriend(friend.id)}
                className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList; 