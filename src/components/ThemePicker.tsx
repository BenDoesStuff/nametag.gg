"use client";

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ProfileTheme } from '@/types/layout';
import { THEME_PRESETS, DEFAULT_THEME, createTheme } from '@/lib/themePresets';

interface ThemePickerProps {
  currentTheme: ProfileTheme;
  onThemeChange: (theme: ProfileTheme) => void;
  className?: string;
}

type ColorProperty = keyof ProfileTheme['colors'];

export function ThemePicker({ currentTheme, onThemeChange, className = '' }: ThemePickerProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [editingColor, setEditingColor] = useState<ColorProperty | null>(null);
  const [tempColor, setTempColor] = useState('#000000');

  const handlePresetSelect = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      const newTheme = createTheme(preset.colors);
      onThemeChange(newTheme);
    }
  };

  const handleColorEdit = (property: ColorProperty) => {
    let colorValue = '';
    
    if (property === 'bgGradient') {
      colorValue = currentTheme.colors.bgGradient[0];
    } else {
      colorValue = currentTheme.colors[property] as string;
    }
    
    setTempColor(colorValue);
    setEditingColor(property);
  };

  const handleColorSave = () => {
    if (!editingColor) return;

    const newColors = { ...currentTheme.colors };
    
    if (editingColor === 'bgGradient') {
      newColors.bgGradient = [tempColor, newColors.bgGradient[1]];
    } else {
      (newColors as any)[editingColor] = tempColor;
    }

    const newTheme = createTheme(newColors);
    onThemeChange(newTheme);
    setEditingColor(null);
  };

  const handleReset = () => {
    onThemeChange(DEFAULT_THEME);
  };

  const colorProperties: { key: ColorProperty; label: string; description: string }[] = [
    { key: 'accent', label: 'Accent Color', description: 'Primary brand color' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary accent color' },
    { key: 'bgGradient', label: 'Background', description: 'Background gradient start' },
    { key: 'cardBg', label: 'Card Background', description: 'Card and surface color' },
    { key: 'text', label: 'Text Color', description: 'Primary text color' },
    { key: 'textSecondary', label: 'Secondary Text', description: 'Muted text color' },
  ];

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-2">Theme Customization</h3>
        <p className="text-gray-400">Choose a preset or create your own color scheme</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'presets'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'custom'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Custom Colors
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                    currentTheme.name === preset.name
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                  }`}
                >
                  {/* Preview */}
                  <div className="flex gap-2 mb-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-600"
                      style={{ 
                        background: `linear-gradient(135deg, ${preset.colors.bgGradient[0]}, ${preset.colors.bgGradient[1]})` 
                      }}
                    />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{preset.name}</h4>
                  <p className="text-gray-400 text-sm">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorProperties.map((prop) => {
                let displayColor = '';
                if (prop.key === 'bgGradient') {
                  displayColor = currentTheme.colors.bgGradient[0];
                } else {
                  displayColor = currentTheme.colors[prop.key] as string;
                }

                return (
                  <button
                    key={prop.key}
                    onClick={() => handleColorEdit(prop.key)}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-gray-500 flex-shrink-0"
                      style={{ backgroundColor: displayColor }}
                    />
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">{prop.label}</div>
                      <div className="text-gray-400 text-xs">{prop.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-700/50">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Reset to Default Theme
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Color Picker Modal */}
      {editingColor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Edit {colorProperties.find(p => p.key === editingColor)?.label}
              </h3>
              <button
                onClick={() => setEditingColor(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Color Picker */}
              <div className="flex justify-center">
                <HexColorPicker
                  color={tempColor}
                  onChange={setTempColor}
                />
              </div>

              {/* Color Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hex Color
                </label>
                <input
                  type="text"
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Preview</div>
                <div 
                  className="w-full h-12 rounded-lg border-2 border-gray-600"
                  style={{ backgroundColor: tempColor }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingColor(null)}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleColorSave}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}