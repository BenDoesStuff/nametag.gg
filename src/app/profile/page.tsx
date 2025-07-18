import React from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { FriendList, AddFriend } from "@/components";

const mockProfile = {
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
};

// TODO: Replace mockProfile with data fetched from /api/profile in the future
const ProfilePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col items-center justify-center p-4">
      <ProfileCard {...mockProfile} />
      <div className="flex flex-col md:flex-row gap-8 mt-12 w-full items-start justify-center">
        <FriendList />
        <AddFriend />
      </div>
    </main>
  );
};

export default ProfilePage; 