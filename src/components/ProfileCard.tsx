import React from "react";

export interface ProfileCardProps {
  displayName: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  favoriteGames: string[];
  platforms: string[];
  socialLinks: { platform: string; url: string }[];
  customTags?: string[];
  twitchUrl?: string;
  youtubeUrl?: string;
}

const platformIcons: Record<string, string> = {
  Steam: "/globe.svg",
  "Epic Games": "/globe.svg",
  Discord: "/globe.svg",
  "Riot Games": "/globe.svg",
  Xbox: "/globe.svg",
  PlayStation: "/globe.svg",
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  displayName,
  avatarUrl,
  bannerUrl,
  bio,
  favoriteGames,
  platforms,
  socialLinks,
  customTags,
  twitchUrl,
  youtubeUrl,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 max-w-2xl mx-auto">
      {bannerUrl && (
        <img src={bannerUrl} alt="Banner" className="w-full h-32 object-cover" />
      )}
      <div className="flex flex-col items-center p-6 relative">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-neon-green -mt-16 bg-gray-900 object-cover"
        />
        <h2 className="text-2xl font-bold mt-2 text-white">{displayName}</h2>
        {bio && <p className="text-gray-400 mt-1 text-center">{bio}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          {customTags?.map((tag) => (
            <span
              key={tag}
              className="bg-neon-green/20 text-neon-green px-2 py-1 rounded text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {favoriteGames.map((game) => (
            <span
              key={game}
              className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
            >
              {game}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="flex items-center gap-1 bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
            >
              <img src={platformIcons[platform] || "/globe.svg"} alt={platform} className="w-4 h-4" />
              {platform}
            </span>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-green transition-colors"
            >
              <img src={platformIcons[link.platform] || "/globe.svg"} alt={link.platform} className="w-6 h-6" />
            </a>
          ))}
        </div>
        {(twitchUrl || youtubeUrl) && (
          <div className="flex gap-4 mt-6 w-full justify-center">
            {twitchUrl && (
              <iframe
                src={twitchUrl}
                title="Twitch Stream"
                className="rounded-lg border border-gray-700"
                width="320"
                height="180"
                allowFullScreen
              />
            )}
            {youtubeUrl && (
              <iframe
                src={youtubeUrl}
                title="YouTube Video"
                className="rounded-lg border border-gray-700"
                width="320"
                height="180"
                allowFullScreen
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard; 