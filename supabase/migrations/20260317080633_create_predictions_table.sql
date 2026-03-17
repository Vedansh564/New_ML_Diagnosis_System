/*
  # Create predictions table for medical diagnosis system

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key) - Unique identifier for each prediction
      - `predicted_class` (text) - The predicted disease class
      - `confidence` (float) - Confidence score of the prediction (0-1)
      - `disease_type` (text) - Type of disease (Chest X-Ray, Retinal Image, etc.)
      - `severity` (text, nullable) - Severity level if applicable
      - `is_normal` (boolean) - Whether the prediction indicates normal/healthy
      - `created_at` (timestamptz) - Timestamp of prediction

  2. Security
    - Enable RLS on `predictions` table
    - Add policy for anyone to insert predictions (for demo purposes)
    - Add policy for anyone to read predictions (for demo purposes)
    
  Note: In production, you should restrict these policies based on user authentication
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  predicted_class text NOT NULL,
  confidence float NOT NULL,
  disease_type text NOT NULL,
  severity text,
  is_normal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert predictions"
  ON predictions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to read predictions"
  ON predictions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_disease_type ON predictions(disease_type);
CREATE INDEX IF NOT EXISTS idx_predictions_is_normal ON predictions(is_normal);
