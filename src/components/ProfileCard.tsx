import React from "react";
import { PlatformIcon } from "./PlatformIcon";

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

// Platform name mapping for legacy support
const platformNameMap: Record<string, string> = {
  "Steam": "steam",
  "Epic Games": "epic",
  "Discord": "discord",
  "Riot Games": "riot",
  "Xbox": "xbox",
  "PlayStation": "playstation",
  "GitHub": "github",
  "Twitch": "twitch",
  "YouTube": "youtube",
  "Twitter": "twitter",
  "Instagram": "instagram",
  "TikTok": "tiktok",
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
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 w-full mx-auto">
      {bannerUrl && (
        <img src={bannerUrl} alt="Banner" className="w-full h-24 sm:h-32 object-cover" />
      )}
      <div className="flex flex-col items-center p-4 sm:p-6 relative">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-neon-green -mt-12 sm:-mt-16 bg-gray-900 object-cover"
        />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-2 text-white text-center">{displayName}</h2>
        {bio && <p className="text-gray-400 mt-1 text-center text-sm sm:text-base">{bio}</p>}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 justify-center">
          {customTags?.map((tag) => (
            <span
              key={tag}
              className="bg-neon-green/20 text-neon-green px-2 py-1 rounded text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 justify-center">
          {favoriteGames.map((game) => (
            <span
              key={game}
              className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
            >
              {game}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 justify-center">
          {platforms.map((platform) => {
            const iconPlatform = platformNameMap[platform] || platform.toLowerCase();
            return (
              <span
                key={platform}
                className="flex items-center gap-1 bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
              >
                <PlatformIcon 
                  platform={iconPlatform as any} 
                  className="w-3 h-3 sm:w-4 sm:h-4 text-current" 
                  size={16}
                />
                <span className="hidden sm:inline">{platform}</span>
              </span>
            );
          })}
        </div>
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
          {socialLinks.map((link) => {
            const iconPlatform = platformNameMap[link.platform] || link.platform.toLowerCase();
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neon-green transition-colors"
                title={link.platform}
              >
                <PlatformIcon 
                  platform={iconPlatform as any} 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  size={24}
                />
              </a>
            );
          })}
        </div>
        {(twitchUrl || youtubeUrl) && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 w-full">
            {twitchUrl && (
              <div className="flex-1">
                <iframe
                  src={twitchUrl}
                  title="Twitch Stream"
                  className="rounded-lg border border-gray-700 w-full aspect-video"
                  allowFullScreen
                />
              </div>
            )}
            {youtubeUrl && (
              <div className="flex-1">
                <iframe
                  src={youtubeUrl}
                  title="YouTube Video"
                  className="rounded-lg border border-gray-700 w-full aspect-video"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard; 