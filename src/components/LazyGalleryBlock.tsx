/**
 * Example of dynamic import for heavy components
 * This shows how to lazy-load the GalleryBlock with Swiper.js
 */

'use client';

import { lazy, Suspense } from 'react';
import { ProfileBlock } from '@/types/layout';

// Dynamically import the heavy GalleryBlock component
const GalleryBlock = lazy(() => 
  import('./blocks/GalleryBlock').then(module => ({ 
    default: module.GalleryBlock 
  }))
);

// Loading component for the gallery
function GalleryLoadingSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-gray-600 rounded animate-pulse" />
        <div className="w-32 h-6 bg-gray-600 rounded animate-pulse" />
      </div>
      
      {/* Masonry grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            className={`bg-gray-600 rounded animate-pulse ${
              i % 3 === 0 ? 'h-48' : i % 2 === 0 ? 'h-32' : 'h-40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface LazyGalleryBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

/**
 * Lazy-loaded GalleryBlock component
 * Only loads the heavy Swiper.js code when this component is actually rendered
 */
export function LazyGalleryBlock(props: LazyGalleryBlockProps) {
  return (
    <Suspense fallback={<GalleryLoadingSkeleton />}>
      <GalleryBlock {...props} />
    </Suspense>
  );
}

// Usage example in BlockRenderer.tsx:
/*
import { LazyGalleryBlock } from '@/components/LazyGalleryBlock';

// In your switch statement:
case 'gallery':
  return (
    <LazyGalleryBlock 
      block={block} 
      profile={profile} 
      isEditing={isEditing}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
*/