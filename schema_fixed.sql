-- FIXED Supabase Schema for Linktree Killer Profiles Table
-- This fixes the UUID/BigInt mismatch error: "operator does not exist: uuid = bigint"
-- Run this in the Supabase SQL Editor

-- 1. RESET: Drop the old broken table and triggers (CAREFUL: Deletes current profile data)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. REBUILD: Create the profiles table with UUID as PRIMARY KEY (matching auth.users.id)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Branding
    name TEXT DEFAULT 'My Link Page',
    bio TEXT DEFAULT 'Welcome to your link page! 🎉',
    logo TEXT DEFAULT 'logo.gif',
    
    -- Theme Colors
    bg1 TEXT DEFAULT '#E4F3FF',
    bg2 TEXT DEFAULT '#E0D6FF',
    btn TEXT DEFAULT '#7DC6FF',
    btnText TEXT DEFAULT '#ffffff',
    btnPadY TEXT DEFAULT '18',
    btnRadius TEXT DEFAULT '50',
    
    -- Contact Information
    contactName TEXT DEFAULT '',
    contactPhone TEXT DEFAULT '',
    contactEmail TEXT DEFAULT '',
    contactTitle TEXT DEFAULT '',
    contactWebsite TEXT DEFAULT '',
    notificationEmail TEXT DEFAULT '',
    
    -- Media
    mediaUrl TEXT DEFAULT '',
    
    -- Links (stored as JSONB array)
    links JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SECURE: Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. PERMISSIONS: Users can only access their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);
    
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. AUTOMATION: Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TRIGGER: Auto-update updated_at on profile updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. AUTOMATION: Create function that auto-creates a profile on Sign Up
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        name, 
        bio, 
        logo, 
        links
    )
    VALUES (
        NEW.id,
        'My Link Page ' || to_char(NOW(), 'YYYY-MM-DD'),
        'Welcome to your link page! 🎉',
        'logo.gif',
        '[
            {"label": "My Website", "url": "https://example.com", "icon": "fa-globe"},
            {"label": "Contact Me", "url": "mailto:hello@example.com", "icon": "fa-envelope"}
        ]'::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER: Connect the function to the Sign Up event
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_profile_for_new_user();
