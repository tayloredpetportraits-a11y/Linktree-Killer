import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import Link from 'next/link';

// --- THIS IS THE KEY ---
// We tell the home page to ALWAYS load the user "taylor"
const TARGET_USERNAME = 'taylor';

// 1. Setup Database Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Set the Browser Title (SEO)
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

// 3. The Main Page (Your Link in Bio)
export default async function Home() {
    // Fetch YOUR profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', TARGET_USERNAME)
        .single();

    // Safety Check: Did the database update work?
    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold text-red-500">Profile Not Found</h1>
                <p className="mt-2">The code is looking for username: <strong>'{TARGET_USERNAME}'</strong></p>
                <p className="opacity-50 mt-4 text-sm">Please run the SQL command to rename your user to 'taylor'</p>
            </div>
        );
    }

    // --- RENDER YOUR PROFILE ---
    return (
        <div className={`min-h-screen w-full relative overflow-hidden text-white ${getFont(profile.font_style)}`}>

            {/* 1. Background Layer (Lava/Video/Mesh) */}
            <BackgroundLayer profile={profile} />

            {/* 2. Content Layer */}
            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6">

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mt-12 mb-8 animate-fade-in">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 mb-4 shadow-2xl">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-700 animate-pulse" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">{profile.title}</h1>
                    <p className="text-white/80 font-medium">{profile.description}</p>
                </div>

                {/* Newsletter (If you turned it on in Builder) */}
                {profile.newsletter_enabled && (
                    <div className={`mb-8 mx-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-lg ${profile.newsletter_size === 'large' ? 'p-8' : 'p-5'}`}>
                        <h3 className="font-bold mb-3 text-lg">{profile.newsletter_heading || "Join my list"}</h3>
                        <form className="flex flex-col gap-2">
                            <input type="email" placeholder="Your email..." className="w-full bg-black/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 ring-blue-500/50 transition" />
                            <button className="w-full py-3 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-md uppercase tracking-wide">
                                Subscribe
                            </button>
                        </form>
                    </div>
                )}

                {/* Links Stack */}
                <div className="flex flex-col gap-4 pb-12">
                    {profile.links?.map((link: any, i: number) => (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between backdrop-blur-sm shadow-sm"
                        >
                            <span className="font-semibold text-lg">{link.title}</span>
                            <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    ))}
                </div>

                {/* Hidden Login Link (So you can get back to Builder) */}
                <div className="mt-auto py-8 text-center">
                    <Link href="/builder" className="text-xs font-bold opacity-30 hover:opacity-100 transition uppercase tracking-widest">
                        Admin Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

// --- HELPER FUNCTIONS ---
function getFont(style: string) {
    if (style === 'elegant') return 'font-serif';
    if (style === 'brutal') return 'font-mono';
    return 'font-sans';
}

function BackgroundLayer({ profile }: { profile: any }) {
    const { background_type, theme_color, accent_color, video_background_url } = profile;
    if (background_type === 'video' && video_background_url) {
        return (
            <>
                <video src={video_background_url} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0" />
                <div className="fixed inset-0 bg-black/50 z-0 backdrop-blur-[2px]" />
            </>
        );
    }
    return (
        <div className="fixed inset-0 z-0 bg-slate-950">
            <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 50%, ${theme_color || '#3b82f6'} 0%, #000 100%)` }} />
            <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob" style={{ backgroundColor: theme_color || '#3b82f6' }}></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" style={{ backgroundColor: accent_color || '#8b5cf6' }}></div>
            {profile.texture_overlay === 'noise' && (
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            )}
        </div>
    );
}
