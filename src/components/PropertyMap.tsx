'use client'

import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
}

export default function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet (it only works in the browser)
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const L = (await import('leaflet')).default

        // Fix default icon issue with Leaflet + bundlers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        const customIcon = L.divIcon({
          html: `<div class="flex items-center justify-center">
            <div class="relative">
              <div class="h-6 w-6 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                </svg>
              </div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-emerald-600"></div>
            </div>
          </div>`,
          className: '',
          iconSize: [24, 32],
          iconAnchor: [12, 32],
        })

        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b>${title}</b>`)

        mapInstanceRef.current = map
        markerRef.current = markerRef
      } catch {
        // silently fail — map won't show but rest of page works
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, title])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[300px] w-full z-0" />
      <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs text-gray-600 shadow-sm flex items-center gap-1">
        <MapPin className="h-3 w-3 text-emerald-600" />
        OpenStreetMap
      </div>
    </div>
  )
}