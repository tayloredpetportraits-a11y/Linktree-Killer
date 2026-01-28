-- Fix the missing column error
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS brand_colors jsonb;

-- While we are at it, ensure these exist too so you don't crash later
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vibe text,
ADD COLUMN IF NOT EXISTS font text;
