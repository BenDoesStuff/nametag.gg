"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';
import { supabase } from '@/lib/supabaseClient';

interface QAItem {
  question: string;
  answer: string;
}

interface AboutData {
  about_text?: string;
  about_qa?: QAItem[];
}

interface AboutBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export function AboutBlock({ 
  block, 
  profile, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: AboutBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'richText';
  
  const [aboutData, setAboutData] = useState<AboutData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('about_text, about_qa')
          .eq('id', profile.id)
          .single();

        if (profileError) {
          console.error('Error fetching about data:', profileError);
          setError('Failed to load about data');
          setAboutData({});
        } else {
          setAboutData({
            about_text: profileData?.about_text || '',
            about_qa: profileData?.about_qa || []
          });
        }
      } catch (err) {
        console.error('Unexpected error fetching about data:', err);
        setError('Failed to load about data');
        setAboutData({});
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [profile?.id]);

  const renderRichTextVariant = () => {
    const aboutText = aboutData.about_text || '';
    
    if (!aboutText.trim()) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="calendar" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No about information yet</p>
          <p className="text-sm">Add your story, background, or bio to share with others</p>
        </div>
      );
    }

    return (
      <div className={`prose prose-invert max-w-none ${themeClasses.textSecondary}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          className="leading-relaxed"
          components={{
            h1: ({children}) => <h1 className={`text-2xl font-bold mb-4 ${themeClasses.textPrimary}`}>{children}</h1>,
            h2: ({children}) => <h2 className={`text-xl font-semibold mb-3 ${themeClasses.textPrimary}`}>{children}</h2>,
            h3: ({children}) => <h3 className={`text-lg font-medium mb-2 ${themeClasses.textPrimary}`}>{children}</h3>,
            p: ({children}) => <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>,
            strong: ({children}) => <strong className={`font-semibold ${themeClasses.textPrimary}`}>{children}</strong>,
            em: ({children}) => <em className="italic text-gray-300">{children}</em>,
            ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300">{children}</ol>,
            li: ({children}) => <li className="text-gray-300">{children}</li>,
            blockquote: ({children}) => (
              <blockquote className={`border-l-4 ${themeClasses.accentBorder} pl-4 py-2 mb-4 italic text-gray-400`}>
                {children}
              </blockquote>
            ),
            code: ({children}) => (
              <code className={`px-2 py-1 rounded text-sm ${themeClasses.cardBg} ${themeClasses.textPrimary} font-mono`}>
                {children}
              </code>
            ),
            pre: ({children}) => (
              <pre className={`p-4 rounded-lg overflow-x-auto mb-4 ${themeClasses.cardBg}`}>
                {children}
              </pre>
            ),
          }}
        >
          {aboutText}
        </ReactMarkdown>
      </div>
    );
  };

  const renderQAVariant = () => {
    const qaItems = aboutData.about_qa || [];
    
    if (qaItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="calendar" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No Q&A information yet</p>
          <p className="text-sm">Add questions and answers to tell your story</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {qaItems.map((item, index) => (
          <div 
            key={index}
            className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50 ${themeClasses.hoverAccent} transition-all duration-200`}
          >
            <div className={`text-sm font-medium mb-2 ${themeClasses.textPrimary} uppercase tracking-wide`}>
              Q: {item.question}
            </div>
            <div className="text-gray-300 leading-relaxed">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
        </div>
      );
    }

    switch (variant) {
      case 'qa':
        return renderQAVariant();
      case 'richText':
      default:
        return renderRichTextVariant();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform="calendar" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            About Me
          </h3>
        </div>
        {variant === 'qa' && (
          <div className={`text-sm ${themeClasses.textSecondary}`}>
            Q&A Format
          </div>
        )}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit Controls */}
      {isEditing && (
        <>
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            About Block - {variant}
          </div>
          <div className="absolute top-2 right-20 flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(block)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded text-xs"
                title="Edit block"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(block.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                title="Delete block"
              >
                🗑️
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Export variants for the block picker
export const aboutBlockVariants = [
  {
    id: 'richText',
    name: 'Rich Text',
    description: 'Markdown-formatted paragraph with rich text support'
  },
  {
    id: 'qa',
    name: 'Q&A Cards',
    description: 'Question and answer format with card layout'
  }
];