import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import Link from 'next/link';

// --- VERSION CHECK: V2 (If you see this text, it worked) ---
const TARGET_USERNAME = 'taylor';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata(): Promise<Metadata> {
    const { data } = await supabase
        .from('profiles')
        .select('title, description')
        .eq('username', TARGET_USERNAME)
        .single();

    return {
        title: data?.title || 'Taylored Pet Portraits',
        description: data?.description || 'My Links',
    };
}

export default async function Home() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', TARGET_USERNAME)
        .single();

    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold text-red-500">Profile Not Found</h1>
                <p className="mt-2">Looking for user: <strong>{TARGET_USERNAME}</strong></p>
                <p className="text-sm opacity-50 mt-4">Database Check: Failed</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full relative overflow-hidden text-white ${profile.font_style === 'elegant' ? 'font-serif' : 'font-sans'}`}>
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-slate-950">
                <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 50%, ${profile.theme_color || '#3b82f6'} 0%, #000 100%)` }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6 items-center pt-20">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-2xl">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-700" />
                    )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{profile.title}</h1>
                <p className="text-white/80 text-center mb-8">{profile.description}</p>

                <div className="w-full flex flex-col gap-4">
                    {profile.links?.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-center font-bold transition">
                            {link.title}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
