import { NextResponse } from "next/server";

// Mock user and friend data
let users = [
  { id: "1", displayName: "NeonNinja" },
  { id: "2", displayName: "PixelQueen" },
  { id: "3", displayName: "ClutchKing" },
  { id: "4", displayName: "MageMuse" },
  { id: "5", displayName: "You" },
];

// friends: { [userId]: [{ id, status }] }
let friends: Record<string, { id: string; status: "pending" | "accepted" }[]> = {
  "5": [
    { id: "1", status: "accepted" },
    { id: "2", status: "pending" },
  ],
};

// friendRequests: { [userId]: [{ from, to }] }
let friendRequests: Array<{ from: string; to: string }> = [
  { from: "2", to: "5" }, // PixelQueen sent a request to You
];

// GET: List accepted friends for userId=5
export async function GET() {
  const userId = "5";
  const accepted = (friends[userId] || []).filter((f) => f.status === "accepted");
  const friendList = users.filter((u) => accepted.some((f) => f.id === u.id));
  return NextResponse.json(friendList);
}

// POST: Send a friend request (expects { friendId })
export async function POST(req: Request) {
  const userId = "5";
  const { friendId } = await req.json();
  if (!users.find((u) => u.id === friendId)) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // If already friends or pending
  if ((friends[userId] || []).some((f) => f.id === friendId)) {
    return NextResponse.json({ error: "Already friends or pending" }, { status: 400 });
  }
  // Add pending to both users
  friends[userId] = [...(friends[userId] || []), { id: friendId, status: "pending" }];
  friends[friendId] = [...(friends[friendId] || []), { id: userId, status: "pending" }];
  friendRequests.push({ from: userId, to: friendId });
  return NextResponse.json({ success: true });
}

// DELETE: Remove a friend (expects { friendId })
export async function DELETE(req: Request) {
  const userId = "5";
  const { friendId } = await req.json();
  friends[userId] = (friends[userId] || []).filter((f) => f.id !== friendId);
  friends[friendId] = (friends[friendId] || []).filter((f) => f.id !== userId);
  friendRequests = friendRequests.filter(
    (r) => !(r.from === userId && r.to === friendId) && !(r.from === friendId && r.to === userId)
  );
  return NextResponse.json({ success: true });
}

// GET /api/friends/requests: List incoming friend requests for userId=5
export async function GET_requests() {
  const userId = "5";
  const incoming = friendRequests.filter((r) => r.to === userId);
  const fromUsers = users.filter((u) => incoming.some((r) => r.from === u.id));
  return NextResponse.json(fromUsers);
}

// POST /api/friends/accept: Accept a friend request (expects { friendId })
export async function POST_accept(req: Request) {
  const userId = "5";
  const { friendId } = await req.json();
  // Update both users' friend status
  friends[userId] = (friends[userId] || []).map((f) =>
    f.id === friendId ? { ...f, status: "accepted" } : f
  );
  friends[friendId] = (friends[friendId] || []).map((f) =>
    f.id === userId ? { ...f, status: "accepted" } : f
  );
  // Remove from friendRequests
  friendRequests = friendRequests.filter(
    (r) => !(r.from === friendId && r.to === userId)
  );
  return NextResponse.json({ success: true });
} 