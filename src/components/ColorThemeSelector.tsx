"use client";

import React, { useState } from 'react';
import { ColorTheme, PREDEFINED_THEMES, createCustomTheme, isValidHex } from '@/lib/colorThemes';

interface ColorThemeSelectorProps {
  currentTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => Promise<boolean>;
  loading?: boolean;
  disabled?: boolean;
}

export const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  loading = false,
  disabled = false
}) => {
  const [customColor, setCustomColor] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);

  const handlePresetTheme = async (theme: ColorTheme) => {
    setApplying(theme.themeName);
    try {
      await onThemeChange(theme);
    } finally {
      setApplying(null);
    }
  };

  const handleCustomTheme = async () => {
    if (!isValidHex(customColor)) {
      return;
    }

    setApplying('custom');
    try {
      const customTheme = createCustomTheme(customColor, customName || undefined);
      const success = await onThemeChange(customTheme);
      if (success) {
        setCustomColor('');
        setCustomName('');
        setShowCustomInput(false);
      }
    } finally {
      setApplying(null);
    }
  };

  const presetThemes = Object.values(PREDEFINED_THEMES);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Color Theme</h3>
        <p className="text-gray-400 text-sm mb-6">
          Choose a color theme for your profile. This will change the accent color throughout your page.
        </p>
      </div>

      {/* Current Theme Preview */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <div>
            <div className="text-white font-medium">{currentTheme.displayName}</div>
            <div className="text-gray-400 text-sm">{currentTheme.description}</div>
          </div>
        </div>
      </div>

      {/* Preset Themes Grid */}
      <div>
        <h4 className="text-white font-medium mb-3">Preset Themes</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {presetThemes.map((theme) => {
            const isSelected = currentTheme.themeName === theme.themeName;
            const isApplying = applying === theme.themeName;
            
            return (
              <button
                key={theme.themeName}
                onClick={() => handlePresetTheme(theme)}
                disabled={disabled || loading || isApplying}
                className={`
                  group relative p-3 rounded-lg border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-current shadow-lg' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                  ${disabled || loading || isApplying 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105'
                  }
                  bg-gray-800/50 hover:bg-gray-700/50
                `}
                style={{ 
                  borderColor: isSelected ? theme.primary : undefined,
                  boxShadow: isSelected ? `0 0 20px ${theme.primary}20` : undefined
                }}
              >
                {/* Color Preview */}
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className={`
                      w-6 h-6 rounded-full border-2 transition-transform
                      ${isSelected ? 'border-white scale-110' : 'border-gray-500 group-hover:border-gray-400'}
                    `}
                    style={{ backgroundColor: theme.primary }}
                  />
                  {isApplying && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                
                {/* Theme Info */}
                <div className="text-left">
                  <div className="text-white text-sm font-medium truncate">
                    {theme.displayName}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {theme.primary}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div 
                    className="absolute top-1 right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Custom Color</h4>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            disabled={disabled || loading}
            className="text-sm px-3 py-1 rounded border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            {showCustomInput ? 'Cancel' : 'Add Custom'}
          </button>
        </div>

        {showCustomInput && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color (Hex)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#FF6B35"
                    disabled={disabled || loading}
                    className="w-full px-3 py-2 pl-10 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-current focus:outline-none"
                    style={{ 
                      borderColor: isValidHex(customColor) ? customColor : undefined 
                    }}
                  />
                  {/* Color Preview */}
                  <div 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded border border-gray-500"
                    style={{ 
                      backgroundColor: isValidHex(customColor) ? customColor : '#374151' 
                    }}
                  />
                </div>
                <input
                  type="color"
                  value={isValidHex(customColor) ? customColor : '#39FF14'}
                  onChange={(e) => setCustomColor(e.target.value)}
                  disabled={disabled || loading}
                  className="w-12 h-10 rounded cursor-pointer border border-gray-600"
                />
              </div>
              {customColor && !isValidHex(customColor) && (
                <p className="text-red-400 text-xs mt-1">
                  Please enter a valid hex color (e.g., #FF6B35)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme Name (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="My Custom Theme"
                disabled={disabled || loading}
                className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:border-current focus:outline-none"
              />
            </div>

            <button
              onClick={handleCustomTheme}
              disabled={disabled || loading || !isValidHex(customColor) || applying === 'custom'}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {applying === 'custom' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Custom Theme'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Theme Preview Example */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">Preview</h4>
        <div className="space-y-3">
          {/* Username Preview */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: currentTheme.primary }}
            />
            <div>
              <div 
                className="font-semibold"
                style={{ color: currentTheme.primary }}
              >
                Your Username
              </div>
              <div className="text-gray-400 text-sm">@nametag_user</div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="flex gap-4">
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentTheme.primary }}
              >
                42
              </div>
              <div className="text-gray-400 text-xs">Games</div>
            </div>
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentTheme.primary }}
              >
                128
              </div>
              <div className="text-gray-400 text-xs">Friends</div>
            </div>
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentTheme.primary }}
              >
                87
              </div>
              <div className="text-gray-400 text-xs">Achievements</div>
            </div>
          </div>

          {/* Button Preview */}
          <button 
            className="px-4 py-2 border-2 rounded-lg font-medium transition-colors"
            style={{ 
              borderColor: currentTheme.primary,
              color: currentTheme.primary
            }}
          >
            Example Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorThemeSelector;