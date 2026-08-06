-- Add super_category system + item-type-specific fields
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS super_category TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS price_type TEXT,
  ADD COLUMN IF NOT EXISTS read_time TEXT,
  ADD COLUMN IF NOT EXISTS difficulty TEXT,
  ADD COLUMN IF NOT EXISTS recommendation_reason JSONB,
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS github_stars INTEGER,
  ADD COLUMN IF NOT EXISTS platforms JSONB,
  ADD COLUMN IF NOT EXISTS discount TEXT;

CREATE INDEX IF NOT EXISTS idx_resources_super_category ON public.resources(super_category);
CREATE INDEX IF NOT EXISTS idx_resources_subcategory ON public.resources(subcategory);
