-- 🔓 Open the Gates Migration
-- adds missing columns to prevent Save Error for scraped data

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS brand_colors jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vibe text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS fonts text;
