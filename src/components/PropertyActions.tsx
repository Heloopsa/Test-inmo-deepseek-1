'use client'

import { Heart, Share2 } from 'lucide-react'

interface PropertyActionsProps {
  title: string
}

export default function PropertyActions({ title }: PropertyActionsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={handleShare}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-50 hover:text-emerald-600"
        title="Compartir"
      >
        <Share2 className="h-5 w-5" />
      </button>
      <button
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-50 hover:text-red-500"
        title="Guardar"
      >
        <Heart className="h-5 w-5" />
      </button>
    </div>
  )
}