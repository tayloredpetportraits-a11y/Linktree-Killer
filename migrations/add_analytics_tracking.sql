-- Migration: Add Analytics Tracking to Profiles Table
-- Date: 2026-01-23
-- Description: Adds page_views counter, fb_pixel_id, and google_analytics_id columns to support analytics tracking

-- Add page_views column (integer counter for total profile views)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 0;

-- Add fb_pixel_id column (Facebook Pixel tracking ID)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fb_pixel_id TEXT;

-- Add google_analytics_id column (Google Analytics GA4 measurement ID)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS google_analytics_id TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.page_views IS 'Total number of page views for this profile';
COMMENT ON COLUMN public.profiles.fb_pixel_id IS 'Facebook Pixel ID for analytics tracking';
COMMENT ON COLUMN public.profiles.google_analytics_id IS 'Google Analytics GA4 measurement ID (e.g., G-XXXXXXXXXX)';

-- Create RPC function to atomically increment page views
CREATE OR REPLACE FUNCTION public.increment_page_views(profile_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET page_views = page_views + 1
    WHERE id = profile_id;
END;
$$;

-- Add comment for the function
COMMENT ON FUNCTION public.increment_page_views IS 'Atomically increments the page_views counter for a given profile';
