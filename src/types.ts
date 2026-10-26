export type CapacityOption = {
  id: string
  slug: string
  title: string
  description: string
  capacity: number
  registered_count: number
  sort_order: number
}

export interface RegistrationResult {
  ok: boolean
  code?: string
  message?: string
  ticket_code?: string
  track?: string
  workshop?: string
}

export interface Database {
  public: {
    Tables: {
      tracks: { Row: CapacityOption; Insert: Partial<CapacityOption>; Update: Partial<CapacityOption>; Relationships: [] }
      workshops: { Row: CapacityOption; Insert: Partial<CapacityOption>; Update: Partial<CapacityOption>; Relationships: [] }
      registrations: {
        Row: {
          id: string
          ticket_code: string
          full_name: string
          email: string
          phone: string
          college: string
          stream: string
          year_of_study: string
          is_ieee_member: boolean
          ieee_membership_no: string | null
          dietary: string | null
          track_id: string
          workshop_id: string
          checked_in: boolean
          created_at: string
        }
        Insert: never
        Update: { checked_in?: boolean }
        Relationships: []
      }
      admins: { Row: { user_id: string }; Insert: { user_id: string }; Update: never; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: {
      register_student: {
        Args: {
          p_full_name: string
          p_email: string
          p_phone: string
          p_college: string
          p_stream: string
          p_year: string
          p_is_ieee_member: boolean
          p_ieee_no: string | null
          p_dietary: string | null
          p_track_id: string
          p_workshop_id: string
          p_consent: boolean
        }
        Returns: RegistrationResult
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
