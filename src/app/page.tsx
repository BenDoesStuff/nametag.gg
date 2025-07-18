import Link from "next/link";
import { ProfileCard } from "@/components/ProfileCard";

const featuredProfiles = [
  {
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
  },
  {
    displayName: "PixelQueen",
    avatarUrl: "/next.svg",
    bannerUrl: "/vercel.svg",
    bio: "Indie game dev & speedrunner. Catch me live on Twitch!",
    favoriteGames: ["Celeste", "Hollow Knight", "Stardew Valley"],
    platforms: ["Steam", "Twitch", "Discord"],
    socialLinks: [
      { platform: "Steam", url: "https://steamcommunity.com/id/pixelqueen" },
      { platform: "Twitch", url: "https://twitch.tv/pixelqueen" },
      { platform: "Discord", url: "https://discord.com/users/pixelqueen" },
    ],
    customTags: ["Streamer", "Speedrunner", "Dev"],
    twitchUrl: "https://player.twitch.tv/?channel=pixelqueen&parent=localhost",
  },
  {
    displayName: "ClutchKing",
    avatarUrl: "/globe.svg",
    bannerUrl: "/vercel.svg",
    bio: "FPS clutch master. LFG for ranked grind.",
    favoriteGames: ["CS:GO", "Valorant", "Rainbow Six"],
    platforms: ["Steam", "Xbox", "Discord"],
    socialLinks: [
      { platform: "Steam", url: "https://steamcommunity.com/id/clutchking" },
      { platform: "Xbox", url: "https://xbox.com/clutchking" },
      { platform: "Discord", url: "https://discord.com/users/clutchking" },
    ],
    customTags: ["Entry Fragger", "Immortal"],
  },
  {
    displayName: "MageMuse",
    avatarUrl: "/window.svg",
    bannerUrl: "/globe.svg",
    bio: "RPG theorycrafter. Lore is life.",
    favoriteGames: ["Final Fantasy XIV", "Genshin Impact", "Elden Ring"],
    platforms: ["PlayStation", "Discord"],
    socialLinks: [
      { platform: "PlayStation", url: "https://playstation.com/magemuse" },
      { platform: "Discord", url: "https://discord.com/users/magemuse" },
    ],
    customTags: ["Healer", "Lorekeeper"],
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-8">
      <h1 className="text-4xl md:text-6xl font-extrabold text-neon-green mb-4 text-center drop-shadow-lg">
        Welcome to Gamefolio
      </h1>
      <p className="text-gray-300 text-lg md:text-2xl mb-8 text-center max-w-xl">
        Create your ultimate gamer profile. Link your accounts, show off your stats, and share your gaming identity with the world.
      </p>
      <Link
        href="/profile"
        className="px-6 py-3 rounded border-2 border-neon-green text-white font-bold text-lg shadow hover:bg-neon-green hover:text-gray-900 transition-colors mb-12"
      >
        View Sample Profile
      </Link>
      <section className="w-full max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Featured Profiles
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {featuredProfiles.map((profile, idx) => (
            <div key={idx} className="w-full md:w-1/3 max-w-md">
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
