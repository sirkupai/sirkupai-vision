// Image configuration for Supabase Storage
export const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`
  : null

// Your custom bucket name
export const BUCKET_NAME = 'sirkupai-images'

// Generate URLs for your numbered images (1-23)
export const SIRKUPAI_SLIDER_IMAGES = SUPABASE_STORAGE_URL 
  ? Array.from({ length: 23 }, (_, i) => 
      `${SUPABASE_STORAGE_URL}/${BUCKET_NAME}/sirkupImage%20(${i + 1}).jpg`
    )
  : []

// Fallback images (current Pexels images)
export const FALLBACK_SLIDER_IMAGES = [
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
  "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
  "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
  "https://images.pexels.com/photos/3861961/pexels-photo-3861961.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
  "https://images.pexels.com/photos/3861457/pexels-photo-3861457.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
]

// Function to get slider images (with fallback)
export function getSliderImages() {
  // Check if Supabase URL is configured
  if (SUPABASE_STORAGE_URL && SIRKUPAI_SLIDER_IMAGES.length > 0) {
    return SIRKUPAI_SLIDER_IMAGES
  }
  return FALLBACK_SLIDER_IMAGES
}

// Function to dynamically fetch all images from Supabase bucket
export async function fetchAllBucketImages() {
  try {
    if (!SUPABASE_STORAGE_URL) {
      return FALLBACK_SLIDER_IMAGES
    }

    // This would require Supabase client to list files
    // For now, we'll use the predefined array
    // You can extend this later to dynamically fetch from the bucket
    return SIRKUPAI_SLIDER_IMAGES
  } catch (error) {
    console.error('Error fetching bucket images:', error)
    return FALLBACK_SLIDER_IMAGES
  }
}

// Function to add new image URL (for when you upload new images)
export function addImageToBucket(imageNumber: number) {
  if (!SUPABASE_STORAGE_URL) return null
  return `${SUPABASE_STORAGE_URL}/${BUCKET_NAME}/sirkupImage%20(${imageNumber}).jpg`
}