-- alaolo.com resource aggregator schema (i18n via JSONB)
-- Languages supported in JSONB: en, zh, ja, ko

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  slogan JSONB,
  description JSONB,
  logo_url TEXT,
  cover_url TEXT,
  website_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_color TEXT DEFAULT '#F5C518',
  view_count INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  editors_pick BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  use_cases JSONB,
  highlights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_created ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_view ON public.resources(view_count DESC);

-- Resource-Tag join
CREATE TABLE IF NOT EXISTS public.resource_tags (
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- Screenshots
CREATE TABLE IF NOT EXISTS public.screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption JSONB,
  sort_order INT DEFAULT 0
);

-- Info grid (quick info cards: model / capability / input / output / pricing / platform)
CREATE TABLE IF NOT EXISTS public.info_grid (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  label JSONB NOT NULL,
  value JSONB NOT NULL,
  sort_order INT DEFAULT 0
);

-- Pricing plans
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  name JSONB NOT NULL,
  price TEXT,
  price_period JSONB,
  features JSONB,
  highlighted BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- Pros / Cons
CREATE TABLE IF NOT EXISTS public.pros_cons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pro','con')),
  content JSONB NOT NULL,
  sort_order INT DEFAULT 0
);

-- Alternatives
CREATE TABLE IF NOT EXISTS public.alternatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  alt_resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  reason JSONB,
  UNIQUE(resource_id, alt_resource_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_grid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pros_cons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "public read categories" ON public.categories;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read tags" ON public.tags;
CREATE POLICY "public read tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read resources" ON public.resources;
CREATE POLICY "public read resources" ON public.resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read resource_tags" ON public.resource_tags;
CREATE POLICY "public read resource_tags" ON public.resource_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read screenshots" ON public.screenshots;
CREATE POLICY "public read screenshots" ON public.screenshots FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read info_grid" ON public.info_grid;
CREATE POLICY "public read info_grid" ON public.info_grid FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read pricing_plans" ON public.pricing_plans;
CREATE POLICY "public read pricing_plans" ON public.pricing_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read pros_cons" ON public.pros_cons;
CREATE POLICY "public read pros_cons" ON public.pros_cons FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read alternatives" ON public.alternatives;
CREATE POLICY "public read alternatives" ON public.alternatives FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read reviews" ON public.reviews;
CREATE POLICY "public read reviews" ON public.reviews FOR SELECT USING (true);

-- User-scoped policies
DROP POLICY IF EXISTS "users insert own reviews" ON public.reviews;
CREATE POLICY "users insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users update own reviews" ON public.reviews;
CREATE POLICY "users update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users delete own reviews" ON public.reviews;
CREATE POLICY "users delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users select own favorites" ON public.favorites;
CREATE POLICY "users select own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users insert own favorites" ON public.favorites;
CREATE POLICY "users insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users delete own favorites" ON public.favorites;
CREATE POLICY "users delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Helper RPC to increment view_count safely
CREATE OR REPLACE FUNCTION public.increment_view(resource_slug TEXT)
RETURNS void AS $$
  UPDATE public.resources SET view_count = view_count + 1 WHERE slug = resource_slug;
$$ LANGUAGE sql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_view(TEXT) TO anon, authenticated;
