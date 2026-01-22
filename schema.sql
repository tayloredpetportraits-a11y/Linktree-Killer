-- Supabase Schema for Linktree Killer Profiles Table
-- Run this in the Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id BIGSERIAL PRIMARY KEY,
    
    -- Branding
    name TEXT DEFAULT 'Taylored Pet Portraits',
    bio TEXT DEFAULT 'Custom portraits & helping shelter pets 🐾',
    logo TEXT DEFAULT 'logo.gif',
    
    -- Theme Colors
    bg1 TEXT DEFAULT '#E4F3FF',
    bg2 TEXT DEFAULT '#E0D6FF',
    btn TEXT DEFAULT '#7DC6FF',
    btnText TEXT DEFAULT '#ffffff',
    btnPadY TEXT DEFAULT '18',
    btnRadius TEXT DEFAULT '50',
    
    -- Contact Information
    contactName TEXT DEFAULT 'Taylor Strong',
    contactPhone TEXT DEFAULT '555-0123',
    contactEmail TEXT DEFAULT 'hello@taylored.com',
    contactTitle TEXT DEFAULT 'Founder',
    contactWebsite TEXT DEFAULT 'https://tayloredpetportraits.com',
    notificationEmail TEXT DEFAULT 'leads@mybrand.com',
    
    -- Media
    mediaUrl TEXT DEFAULT '',
    
    -- Links (stored as JSONB array)
    links JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access"
    ON profiles FOR SELECT
    USING (true);

-- Create policy to allow public insert/update (for now - you may want to restrict this later)
CREATE POLICY "Allow public insert/update"
    ON profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update"
    ON profiles FOR UPDATE
    USING (true);

-- Insert default profile (id = 1)
INSERT INTO profiles (id, name, bio, logo, links)
VALUES (
    1,
    'Taylored Pet Portraits',
    'Custom portraits & helping shelter pets 🐾',
    'logo.gif',
    '[
        {"label": "Check out the Website", "url": "https://tayloredpetportraits.com", "icon": "fa-globe"},
        {"label": "Follow on Instagram", "url": "https://instagram.com/tayloredpetportraits", "icon": "fa-instagram"},
        {"label": "Order a Portrait", "url": "https://tayloredpetportraits.com/products", "icon": "fa-paintbrush"},
        {"label": "Contact Us", "url": "mailto:hello@example.com", "icon": "fa-envelope"}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
