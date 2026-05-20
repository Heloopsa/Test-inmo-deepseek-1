'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Home } from 'lucide-react'

interface PropertyGalleryProps {
  photos: string[]
  title: string
}

export default function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const prev = () => setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1))

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-gray-100">
        <Home className="h-16 w-16 text-gray-300" />
      </div>
    )
  }

  return (
    <>
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 cursor-pointer group"
        onClick={() => setShowLightbox(true)}>
        <Image
          src={photos[activeIndex]}
          alt={`${title} - Foto principal`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
          {activeIndex + 1} / {photos.length}
        </div>

        {photos.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-emerald-500 ring-offset-2 scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={photo} alt={`${title} - Foto ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-all z-10">
            <X className="h-6 w-6" />
          </button>

          <div className="relative h-[90vh] w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[activeIndex]} alt={`${title} - Foto ${activeIndex + 1}`} fill className="object-contain" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {activeIndex + 1} / {photos.length}
            </div>
          </div>

          {photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white shadow-lg hover:bg-white/40 transition-all">
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white shadow-lg hover:bg-white/40 transition-all">
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}