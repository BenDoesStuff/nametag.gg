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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neon-green mb-4 drop-shadow-lg px-4">
          Welcome to Nametag
        </h1>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-xl px-4">
          Create your ultimate gamer profile. Link your accounts, show off your stats, and share your gaming identity with the world.
        </p>
        <Link
          href="/profile"
          className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded border-2 border-neon-green text-white font-bold text-sm sm:text-lg shadow hover:bg-neon-green hover:text-gray-900 transition-colors"
        >
          View Sample Profile
        </Link>
      </div>
      
      <section className="w-full max-w-7xl px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
          Featured Profiles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {featuredProfiles.map((profile, idx) => (
            <div key={idx} className="w-full max-w-sm">
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
