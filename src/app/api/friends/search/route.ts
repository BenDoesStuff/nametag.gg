import { NextRequest, NextResponse } from "next/server";

const users = [
  { id: "1", displayName: "NeonNinja" },
  { id: "2", displayName: "PixelQueen" },
  { id: "3", displayName: "ClutchKing" },
  { id: "4", displayName: "MageMuse" },
  { id: "5", displayName: "You" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const results = users.filter((u) => u.displayName.toLowerCase().includes(q));
  return NextResponse.json(results);
} 