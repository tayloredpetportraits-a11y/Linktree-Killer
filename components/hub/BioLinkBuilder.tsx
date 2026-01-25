'use client';

import { Smartphone } from 'lucide-react';
import PhonePreview from '@/components/PhonePreview';

interface BioLinkBuilderProps {
    brandData: any;
}

export default function BioLinkBuilder({ brandData }: BioLinkBuilderProps) {
    // Construct links from social_links if available
    const links = brandData.social_links?.map((link: any) => ({
        title: link.label,
        url: link.url
    })) || [];

    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-0 overflow-hidden shadow-xl flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Bio Link Builder</h3>
                    <p className="text-slate-500 text-xs text-nowrap">Live Preview</p>
                </div>
                <div className="ml-auto">
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full transition-colors font-medium">
                        Launch Builder
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-slate-950/50 p-4 flex items-center justify-center relative">
                {/* Mobile Preview container */}
                <div className="scale-[0.85] origin-center shadow-2xl rounded-[3rem] overflow-hidden border-8 border-slate-900 ring-1 ring-slate-800 h-[700px] w-[350px] bg-black">
                    <PhonePreview
                        title={brandData.title}
                        description={brandData.bio}
                        avatar_url={brandData.avatar_url}
                        background_image=""
                        background_type="mesh"
                        video_background_url=""
                        font_style={brandData.fonts?.[0]?.toLowerCase().includes('serif') ? 'elegant' : 'modern'}
                        theme_color={brandData.theme_color}
                        accent_color={brandData.brand_colors?.[1] || brandData.theme_color}
                        animation_speed="slow"
                        animation_type="drift"
                        texture_overlay="noise"
                        enable_spotlight={true}
                        lead_gen_enabled={true}
                        links={links}
                    />
                </div>
            </div>
        </div>
    );
}
