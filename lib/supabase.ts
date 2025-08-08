import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          format: string
          style: string
          lighting?: string
          art_style?: string
          film_type?: string
          aspect_ratio: string
          image_urls: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          format: string
          style: string
          lighting?: string
          art_style?: string
          film_type?: string
          aspect_ratio: string
          image_urls: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          format?: string
          style?: string
          lighting?: string
          art_style?: string
          film_type?: string
          aspect_ratio?: string
          image_urls?: string[]
          created_at?: string
        }
      }
    }
  }
}