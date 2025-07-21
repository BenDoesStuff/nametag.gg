"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';
import { supabase } from '@/lib/supabaseClient';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MediaItem {
  id: string;
  url: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

interface GalleryBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export function GalleryBlock({ 
  block, 
  profile, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: GalleryBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'masonry';
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  // Fetch media gallery data
  useEffect(() => {
    const fetchMediaData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: mediaData, error: mediaError } = await supabase
          .from('profile_media')
          .select('*')
          .eq('profile_id', profile.id)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (mediaError) {
          console.error('Error fetching media data:', mediaError);
          setError('Failed to load gallery');
          setMediaItems([]);
        } else {
          setMediaItems(mediaData || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching media data:', err);
        setError('Failed to load gallery');
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [profile?.id]);

  const renderMasonryVariant = () => {
    if (mediaItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="external-link" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No media yet</p>
          <p className="text-sm">Add images to showcase your gaming moments and achievements</p>
        </div>
      );
    }

    return (
      <>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative rounded-lg overflow-hidden border border-gray-700/50 group-hover:border-blue-500/50 transition-colors">
                <Image
                  src={item.url}
                  alt={item.caption || 'Gallery image'}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9a3 3 0 000 6 3 3 0 000-6zm0 8a5 5 0 110-10 5 5 0 010 10zm.93-9.412l-1 1.732c.313.192.612.463.857.707l1-1.732A6.978 6.978 0 0012.93 7.588zm2.187 2.187l-1.732 1c.244.245.515.544.707.857l1.732-1A6.978 6.978 0 0015.117 9.775z"/>
                    </svg>
                    {item.caption && (
                      <p className="text-sm">{item.caption}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Gallery image'}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedImage.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                  <p className="text-center">{selectedImage.caption}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderCarouselVariant = () => {
    if (mediaItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="external-link" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No media yet</p>
          <p className="text-sm">Add images to create your media carousel</p>
        </div>
      );
    }

    // Show only first 3 images in carousel variant
    const carouselItems = mediaItems.slice(0, 3);

    return (
      <div className="gallery-carousel">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ 
            clickable: true,
            el: '.swiper-pagination-custom'
          }}
          className="rounded-lg overflow-hidden"
          breakpoints={{
            640: {
              slidesPerView: mediaItems.length >= 2 ? 2 : 1,
            },
            1024: {
              slidesPerView: mediaItems.length >= 3 ? 3 : mediaItems.length,
            },
          }}
        >
          {carouselItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/50 group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.url}
                  alt={item.caption || 'Gallery image'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm truncate">{item.caption}</p>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9a3 3 0 000 6 3 3 0 000-6zm0 8a5 5 0 110-10 5 5 0 010 10z"/>
                  </svg>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        {carouselItems.length > 1 && (
          <>
            <button className="swiper-button-prev-custom absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button className="swiper-button-next-custom absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </>
        )}

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom flex justify-center mt-4 gap-2"></div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Gallery image'}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedImage.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                  <p className="text-center">{selectedImage.caption}</p>
                </div>
              )}
            </div>
          </div>
        )}
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
      case 'carousel':
        return renderCarouselVariant();
      case 'masonry':
      default:
        return renderMasonryVariant();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform="external-link" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Media Gallery
            {mediaItems.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({mediaItems.length} {mediaItems.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h3>
        </div>
        <div className={`text-sm ${themeClasses.textSecondary} capitalize`}>
          {variant === 'masonry' ? 'Masonry' : 'Carousel'}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit Controls */}
      {isEditing && (
        <>
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            Gallery Block - {variant}
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

      <style jsx global>{`
        .gallery-carousel .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .gallery-carousel .swiper-pagination-custom .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

// Export variants for the block picker
export const galleryBlockVariants = [
  {
    id: 'masonry',
    name: 'Masonry Grid',
    description: 'CSS columns-based masonry layout with lightbox'
  },
  {
    id: 'carousel',
    name: '3-Image Carousel',
    description: 'Swiper.js carousel with navigation and pagination'
  }
];