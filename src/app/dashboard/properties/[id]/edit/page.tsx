'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Plus, X, Loader2, CheckCircle2 } from 'lucide-react'

const propertyTypes = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Condominio' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
  { value: 'local', label: 'Local Comercial' },
]

const operationTypes = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'rental_with_option', label: 'Alquiler con opción a compra' },
]

const currencies = [
  { value: 'USD', label: 'US$ Dólar' },
  { value: 'DOP', label: 'RD$ Peso Dominicano' },
]

const statusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'inactive', label: 'Inactiva' },
  { value: 'sold', label: 'Vendida' },
  { value: 'rented', label: 'Alquilada' },
]

const amenityOptions = [
  { value: 'pool', label: 'Piscina' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'security', label: 'Seguridad 24/7' },
  { value: 'parking', label: 'Estacionamiento' },
  { value: 'elevator', label: 'Elevador' },
  { value: 'garden', label: 'Jardín' },
  { value: 'playground', label: 'Zona de juegos' },
  { value: 'barbecue', label: 'Parrilla' },
  { value: 'laundry', label: 'Lavandería' },
  { value: 'storage', label: 'Cuarto de almacenamiento' },
  { value: 'concierge', label: 'Conserje' },
  { value: 'solar', label: 'Energía solar' },
]

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    loadProperty()
  }, [])

  const loadProperty = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth/login')

      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!data) {
        router.push('/dashboard/properties')
        return
      }

      const prop = data as any
      const form = document.forms.namedItem('editForm')
      if (form) {
        ;(form.elements.namedItem('title') as HTMLInputElement).value = prop.title || ''
        ;(form.elements.namedItem('description') as HTMLTextAreaElement).value = prop.description || ''
        ;(form.elements.namedItem('property_type') as HTMLSelectElement).value = prop.property_type || ''
        ;(form.elements.namedItem('operation_type') as HTMLSelectElement).value = prop.operation_type || ''
        ;(form.elements.namedItem('price') as HTMLInputElement).value = prop.price || ''
        ;(form.elements.namedItem('currency') as HTMLSelectElement).value = prop.currency || 'USD'
        ;(form.elements.namedItem('area_sqm') as HTMLInputElement).value = prop.area_sqm || ''
        ;(form.elements.namedItem('bedrooms') as HTMLInputElement).value = prop.bedrooms || 0
        ;(form.elements.namedItem('bathrooms') as HTMLInputElement).value = prop.bathrooms || 0
        ;(form.elements.namedItem('parking_spaces') as HTMLInputElement).value = prop.parking_spaces || 0
        ;(form.elements.namedItem('neighborhood') as HTMLInputElement).value = prop.neighborhood || ''
        ;(form.elements.namedItem('address') as HTMLInputElement).value = prop.address || ''
        ;(form.elements.namedItem('status') as HTMLSelectElement).value = prop.status || 'active'
      }

      setPhotos(prop.photos || [])
      setSelectedAmenities(prop.amenities || [])
    } catch {
      router.push('/dashboard/properties')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAmenity = (value: string) => {
    setSelectedAmenities(prev =>
      prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
    )
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhotos(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const filePath = `properties/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(urlData.publicUrl)
      }

      setPhotos(prev => [...prev, ...uploadedUrls])
    } catch (err: any) {
      setError(err.message || 'Error al subir fotos')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const propertyData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        property_type: formData.get('property_type') as string,
        operation_type: formData.get('operation_type') as string,
        price: parseFloat(formData.get('price') as string),
        currency: formData.get('currency') as string,
        area_sqm: parseFloat(formData.get('area_sqm') as string),
        bedrooms: parseInt(formData.get('bedrooms') as string) || 0,
        bathrooms: parseInt(formData.get('bathrooms') as string) || 0,
        parking_spaces: parseInt(formData.get('parking_spaces') as string) || 0,
        neighborhood: formData.get('neighborhood') as string,
        address: formData.get('address') as string,
        photos,
        amenities: selectedAmenities,
        status: formData.get('status') as string,
      }

      const { error: updateError } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push('/dashboard/properties')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar propiedad')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/dashboard/properties" className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 mb-3">
            <ArrowLeft className="h-4 w-4" />
            Volver a mis propiedades
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar propiedad</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form name="editForm" onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fotos de la propiedad</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <img src={photo} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-all">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-emerald-400 hover:bg-emerald-50">
                {uploadingPhotos ? (
                  <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Subir foto</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhotos} />
              </label>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input type="text" name="title" required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea name="description" rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select name="property_type" required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">Seleccionar...</option>
                  {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operación *</label>
                <select name="operation_type" required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">Seleccionar...</option>
                  {operationTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input type="number" name="price" required min={0} step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                <select name="currency"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²) *</label>
                <input type="number" name="area_sqm" required min={1} step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select name="status"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Detalles</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
                <input type="number" name="bedrooms" min={0}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                <input type="number" name="bathrooms" min={0} step="0.5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estacionamientos</label>
                <input type="number" name="parking_spaces" min={0}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenidades</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {amenityOptions.map(amenity => (
                  <button key={amenity.value} type="button" onClick={() => toggleAmenity(amenity.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                      selectedAmenities.includes(amenity.value)
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {selectedAmenities.includes(amenity.value) && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector / Barrio</label>
                <input type="text" name="neighborhood"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input type="text" name="address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/dashboard/properties"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
              Cancelar
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}