import { createClient } from '@supabase/supabase-js';

const TARGET_USERNAME = 'taylor';

// 1. Force dynamic rendering for SSR
export const dynamic = 'force-dynamic';

export default async function Home() {
    // DEBUG: Hardcoded keys to rule out Vercel Env Var issues
    const supabase = createClient(
        'https://qxkicdhsrlpehgcsapsh.supabase.co',
        'sb_publishable_TTBR0ES-pM7LOWDsywEy7A_9BSlhWGg'
    );

    console.log(`[Linktree Killer] Connecting to DB for user: ${TARGET_USERNAME}`);

    // 2. Fetch the profile directly (No redirect)
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', TARGET_USERNAME)
        .single();

    if (error) {
        console.error('[Linktree Killer] DB Error:', error);
        return (
            <div className="min-h-screen bg-black text-red-500 p-10 font-mono">
                <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
        );
    }

    if (!profile) {
        console.error(`[Linktree Killer] Profile not found for: ${TARGET_USERNAME}`);
        return (
            <div className="min-h-screen bg-black text-white p-10 font-bold text-xl">
                System Online: User '{TARGET_USERNAME}' not found in DB.
            </div>
        );
    }

    console.log(`[Linktree Killer] Success! Loading profile: ${profile.title}`);

    // 3. Render the UI
    return (
        <div className="min-h-screen text-white relative overflow-hidden font-sans">
            <div className="fixed inset-0 bg-slate-950">
                <div className="absolute inset-0 opacity-40"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${profile.theme_color || '#3b82f6'} 0%, #000 100%)` }} />
            </div>
            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6 items-center pt-20">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-2xl">
                    {profile.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                </div>
                <h1 className="text-3xl font-bold mb-2">{profile.title}</h1>
                <p className="text-white/80 text-center mb-8">{profile.description}</p>
                <div className="flex flex-col gap-4 w-full">
                    {profile.links?.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" className="p-4 rounded-xl bg-white/10 border border-white/10 text-center font-bold">
                            {link.title}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
