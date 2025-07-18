import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    displayName: "NeonNinja",
    avatarUrl: "/vercel.svg",
    bannerUrl: "/next.svg",
    bio: "Top 500 FPS player. Always grinding. Always winning.",
    favoriteGames: ["Valorant", "Apex Legends", "Overwatch 2"],
    platforms: ["Steam", "Discord", "Riot Games"],
    socialLinks: [
      { platform: "Steam", url: "https://steamcommunity.com/id/neonninja" },
      { platform: "Discord", url: "https://discord.com/users/neonninja" },
      { platform: "Riot Games", url: "https://riotgames.com/neonninja" },
    ],
    customTags: ["Duelist", "Radiant", "Team Alpha"],
    twitchUrl: "https://player.twitch.tv/?channel=neonninja&parent=localhost",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  });
} 