"use client";

import { useState, MouseEvent } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Click handler - 50% left/right split
  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Left 50% = previous, Right 50% = next
    if (x < width * 0.5) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Image Display - Click Only */}
      <div 
        className="relative bg-gray-900 rounded-lg overflow-hidden group select-none cursor-pointer"
        onClick={handleImageClick}
      >
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <img
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Click zones overlay */}
        {images.length > 1 && (
          <>
            {/* Left half */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 hover:bg-black/10 transition-colors flex items-center justify-start pl-4">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>

            {/* Right half */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hover:bg-black/10 transition-colors flex items-center justify-end pr-4">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-semibold pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Horizontal Scrollable Thumbnail Row */}
      {images.length > 1 && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden snap-start transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-blue-500 opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
