"use client";

import React, { useState } from 'react';
import { PlatformIcon } from './PlatformIcon';
import { 
  SUPPORTED_PLATFORMS, 
  PLATFORM_LABELS, 
  PLATFORM_PLACEHOLDERS,
  formatSocialLink,
  SupportedPlatform 
} from '@/hooks/useSocialLinks';

interface SocialLinkFormProps {
  onAddLink: (platform: string, value: string) => Promise<boolean>;
  existingPlatforms: string[];
  loading?: boolean;
}

export const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
  onAddLink,
  existingPlatforms,
  loading = false
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform>('discord');
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const availablePlatforms = SUPPORTED_PLATFORMS.filter(
    platform => !existingPlatforms.includes(platform)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a value');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formattedValue = formatSocialLink(selectedPlatform, inputValue.trim());
      const success = await onAddLink(selectedPlatform, formattedValue);
      
      if (success) {
        setInputValue('');
        setSuccess(`${PLATFORM_LABELS[selectedPlatform]} account added successfully!`);
        
        // Select next available platform
        const remainingPlatforms = availablePlatforms.filter(p => p !== selectedPlatform);
        if (remainingPlatforms.length > 0) {
          setSelectedPlatform(remainingPlatforms[0]);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add social link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (availablePlatforms.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-center">
          All supported platforms have been added! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-4">Add Social Account</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Platform
          </label>
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as SupportedPlatform)}
              className="w-full px-3 py-2 pl-10 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-neon-green outline-none appearance-none"
              disabled={loading || isSubmitting}
            >
              {availablePlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {PLATFORM_LABELS[platform]}
                </option>
              ))}
            </select>
            
            {/* Platform Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <PlatformIcon 
                platform={selectedPlatform} 
                className="w-4 h-4 text-gray-400" 
                size={16} 
              />
            </div>
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {selectedPlatform === 'discord' && 'Username or Invite Link'}
            {selectedPlatform === 'steam' && 'Steam ID or Profile URL'}
            {selectedPlatform === 'xbox' && 'Xbox Gamertag'}
            {selectedPlatform === 'playstation' && 'PSN ID'}
            {selectedPlatform === 'riot' && 'Riot ID (username#TAG)'}
            {selectedPlatform === 'epic' && 'Epic Games Username'}
            {selectedPlatform === 'github' && 'GitHub Username'}
            {selectedPlatform === 'twitch' && 'Twitch Username'}
            {selectedPlatform === 'youtube' && 'YouTube Channel'}
            {selectedPlatform === 'twitter' && 'Twitter Username'}
            {selectedPlatform === 'instagram' && 'Instagram Username'}
            {selectedPlatform === 'tiktok' && 'TikTok Username'}
            {selectedPlatform === 'spotify' && 'Spotify Username'}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            placeholder={PLATFORM_PLACEHOLDERS[selectedPlatform]}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-neon-green outline-none"
            disabled={loading || isSubmitting}
            maxLength={255}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isSubmitting || !inputValue.trim()}
          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-500 hover:border-green-600"
        >
          {isSubmitting ? 'Adding...' : `Add ${PLATFORM_LABELS[selectedPlatform]}`}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-900/50 border border-green-700 rounded-lg">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SocialLinkForm;