-- NUCLEAR FIX: Add user_id column and fix all compatibility issues
-- Run this in Supabase SQL Editor to fix the "column profiles.user_id does not exist" error

-- 1. NUCLEAR OPTION: Delete ALL users and profiles to start fresh (OPTIONAL - comment out if you want to keep data)
-- TRUNCATE TABLE auth.users CASCADE;

-- 2. FIX THE BUG: Add the 'user_id' column that your code might be looking for
-- We'll make it mirror 'id' so they're always the same
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Populate user_id for existing rows (set it equal to id)
UPDATE public.profiles 
SET user_id = id 
WHERE user_id IS NULL;

-- 4. Make user_id NOT NULL and add index for performance
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- 5. Update the trigger function to populate BOTH id and user_id
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        user_id,  -- Add user_id here too
        name, 
        bio, 
        logo, 
        links,
        bg1,
        bg2,
        btn,
        btnText,
        btnPadY,
        btnRadius
    )
    VALUES (
        NEW.id,
        NEW.id,  -- Set user_id = id (they're the same)
        'My Link Page ' || to_char(NOW(), 'YYYY-MM-DD'),
        'Welcome to your link page! 🎉',
        'logo.gif',
        '[
            {"label": "My Website", "url": "https://example.com", "icon": "fa-globe"},
            {"label": "Contact Me", "url": "mailto:hello@example.com", "icon": "fa-envelope"}
        ]'::jsonb,
        '#E4F3FF',
        '#E0D6FF',
        '#7DC6FF',
        '#ffffff',
        '18',
        '50'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_profile_for_new_user();

-- 7. Add a constraint to ensure user_id always equals id
CREATE OR REPLACE FUNCTION public.ensure_user_id_matches_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Always keep user_id in sync with id
    IF NEW.user_id IS NULL OR NEW.user_id != NEW.id THEN
        NEW.user_id := NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_user_id_with_id ON public.profiles;
CREATE TRIGGER sync_user_id_with_id
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_user_id_matches_id();
