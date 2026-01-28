-- Fix the incorrect URLs in the database
-- The Craft.me URLs were truncated, causing 404 errors

UPDATE profiles
SET links = '[
  {"title": "Order Your Pet''s Portrait", "url": "https://tayloredpetportraits.com/products"},
  {"title": "Taylored To Help Shelter Pets", "url": "https://cycles-write-6d5.craft.me/jv1tRUsBN2EO13"},
  {"title": "How it Works & TPP Education Hub", "url": "https://cycles-write-6d5.craft.me/Gvo5PlWSiCsxKt"},
  {"title": "Need it Today? DM Us!", "url": "https://ig.me/m/tayloredpetportraits"}
]'::jsonb
WHERE username = 'tayloredpetportraits';

-- Verify the update
SELECT username, title, links FROM profiles WHERE username = 'tayloredpetportraits';
