/*
  # Create generations table for image generation history

  1. New Tables
    - `generations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text, the generation prompt)
      - `format` (text, Wide/Portrait/Square)
      - `style` (text, the selected style)
      - `lighting` (text, optional lighting setting)
      - `art_style` (text, optional art style setting)
      - `film_type` (text, optional film type setting)
      - `aspect_ratio` (text, aspect ratio setting)
      - `image_urls` (text[], array of generated image URLs)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `generations` table
    - Add policy for users to read/write their own generations
*/

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt text NOT NULL,
  format text NOT NULL DEFAULT 'Wide',
  style text NOT NULL DEFAULT 'Action Figure',
  lighting text,
  art_style text,
  film_type text,
  aspect_ratio text NOT NULL DEFAULT '16:9',
  image_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generations"
  ON generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON generations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON generations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);