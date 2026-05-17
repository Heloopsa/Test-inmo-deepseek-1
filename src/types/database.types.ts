// Generated database types for InmuebleRD
// These match the SQL schema in supabase/schema.sql

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'buyer' | 'seller' | 'agent' | 'admin'
          agency_name: string | null
          license_number: string | null
          bio: string | null
          subscription_plan: 'free' | 'basic' | 'premium'
          subscription_expires_at: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['profiles']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<
          Database['public']['Tables']['profiles']['Insert']
        >
      }
      provinces: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: Omit<Database['public']['Tables']['provinces']['Row'], 'id'>
        Update: Partial<
          Database['public']['Tables']['provinces']['Insert']
        >
      }
      municipalities: {
        Row: {
          id: number
          province_id: number
          name: string
          slug: string
        }
        Insert: Omit<
          Database['public']['Tables']['municipalities']['Row'],
          'id'
        >
        Update: Partial<
          Database['public']['Tables']['municipalities']['Insert']
        >
      }
      properties: {
        Row: {
          id: string
          agent_id: string
          title: string
          description: string | null
          property_type:
            | 'apartment'
            | 'house'
            | 'condo'
            | 'land'
            | 'commercial'
            | 'office'
            | 'local'
          operation_type: 'sale' | 'rent' | 'rental_with_option'
          price: number
          currency: 'USD' | 'DOP'
          price_per_sqm: number | null
          area_sqm: number
          bedrooms: number | null
          bathrooms: number | null
          parking_spaces: number
          floor: number
          year_built: number | null
          status: 'active' | 'inactive' | 'sold' | 'rented'
          amenities: string[] | null
          features: Record<string, unknown> | null
          address: string | null
          latitude: number | null
          longitude: number | null
          municipality_id: number | null
          neighborhood: string | null
          building_name: string | null
          condo_fee: number | null
          energy_cert: string | null
          photos: string[] | null
          virtual_tour_url: string | null
          is_featured: boolean
          is_verified: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['properties']['Row'],
          'id' | 'created_at' | 'updated_at' | 'views_count'
        >
        Update: Partial<
          Database['public']['Tables']['properties']['Insert']
        >
      }
      leads: {
        Row: {
          id: string
          property_id: string
          buyer_name: string
          buyer_email: string
          buyer_phone: string | null
          message: string | null
          budget_min: number | null
          budget_max: number | null
          status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'lost'
          agent_id: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['leads']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['favorites']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<
          Database['public']['Tables']['favorites']['Insert']
        >
      }
      reviews: {
        Row: {
          id: string
          agent_id: string
          reviewer_name: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['reviews']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
    Views: never
    Functions: never
    Enums: never
  }
}

// Type exports for use in components
export type Profile = Database['public']['Tables']['profiles']['Row']
export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']

export type Province = Database['public']['Tables']['provinces']['Row']

export type Municipality = Database['public']['Tables']['municipalities']['Row']

export type Property = Database['public']['Tables']['properties']['Row']
export type InsertProperty = Database['public']['Tables']['properties']['Insert']
export type UpdateProperty = Database['public']['Tables']['properties']['Update']

export type Lead = Database['public']['Tables']['leads']['Row']
export type InsertLead = Database['public']['Tables']['leads']['Insert']
export type UpdateLead = Database['public']['Tables']['leads']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']

export type Review = Database['public']['Tables']['reviews']['Row']
export type InsertReview = Database['public']['Tables']['reviews']['Insert']

// Utility types
export type PropertyType = Property['property_type']
export type OperationType = Property['operation_type']
export type PropertyStatus = Property['status']
export type SubscriptionPlan = Profile['subscription_plan']