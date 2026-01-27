'use client';

import React from 'react';
import LiveVoiceAgent from '@/components/LiveVoiceAgent';
import { Terminal, Scissors, Calendar, MapPin, Instagram, Star, Sparkles } from 'lucide-react';

export default function ShaesDemo() {
    // ⚠️ REPLACE THIS WITH THE NEW ID YOU CREATE FOR SHAE
    const SHAE_ASSISTANT_ID = "REPLACE_WITH_SHAES_VAPI_ID";

    // THEME: LUXURY EMERALD
    const THEME = "#10B981";

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 selection:bg-[#10B981] selection:text-black">

            {/* 1. THE "DATA RECON" CARD (Green Edition) */}
            <div className="pt-6 px-4">
                <DataReconCard
                    businessName="Hair by Shae"
                    followers="4.2K"
                    rating="5.0/5.0"
                    color={THEME}
                />
            </div>

            {/* 2. THE VOICE AGENT (The Hook) */}
            <div className="px-4 mt-2">
                <LiveVoiceAgent
                    assistantId={SHAE_ASSISTANT_ID}
                    primaryColor={THEME}
                    statusLabel="SPEAK TO RECEPTION"
                />
            </div>

            {/* 3. THE PROFILE HEADER */}
            <div className="flex flex-col items-center px-6 -mt-2">
                <div className="w-28 h-28 rounded-full border-2 p-1 relative" style={{ borderColor: THEME }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                        {/* Placeholder for Shae's Logo/Face */}
                        <img
                            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&h=500&fit=crop"
                            alt="Hair by Shae"
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-black rounded-full p-1.5 border border-gray-800">
                        <Sparkles size={14} color={THEME} fill={THEME} />
                    </div>
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-wide">Hair by Shae</h1>
                <p className="text-sm font-medium mt-1 tracking-widest uppercase flex items-center gap-1" style={{ color: THEME }}>
                    <MapPin size={12} /> Frisco, TX
                </p>
                <p className="text-gray-400 text-center text-xs mt-3 max-w-xs leading-relaxed">
                    Specializing in Lived-in Color, Balayage, and Luxury Extensions.
                </p>
            </div>

            {/* 4. THE LINKS */}
            <div className="px-4 mt-8 space-y-3 max-w-md mx-auto">
                <LinkButton
                    title="Book Appointment"
                    subtitle="Next Opening: Feb 12th"
                    icon={<Calendar size={18} />}
                    href="#"
                    color={THEME}
                    variant="hero"
                />
                <LinkButton title="View Portfolio (Instagram)" icon={<Instagram size={18} />} href="#" color={THEME} />
                <LinkButton title="Extension Consultation" icon={<Scissors size={18} />} href="#" color={THEME} />
            </div>

            {/* 5. STICKY BOOKING BUTTON */}
            <a href="#"
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md text-black font-bold text-lg py-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform z-50"
                style={{ backgroundColor: THEME, boxShadow: `0 10px 30px ${THEME}40` }}
            >
                <Calendar size={20} fill="black" />
                BOOK NOW
            </a>

        </div>
    );
}

// --- REUSABLE COMPONENTS FOR THIS PAGE ---

function LinkButton({ title, subtitle, icon, href, variant, color }: any) {
    const isHero = variant === 'hero';
    return (
        <a href={href} className={`group block w-full p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${isHero ? 'bg-opacity-10 border-opacity-100' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            style={{
                backgroundColor: isHero ? `${color}10` : undefined,
                borderColor: isHero ? color : 'rgba(255,255,255,0.1)'
            }}>
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isHero ? 'text-black' : 'bg-white/10 text-white'}`}
                        style={{ backgroundColor: isHero ? color : undefined }}>
                        {icon}
                    </div>
                    <div className="text-left">
                        <h3 className={`font-bold ${isHero ? '' : 'text-white'}`} style={{ color: isHero ? color : undefined }}>{title}</h3>
                        {subtitle && <p className="text-[10px] text-gray-400">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </a>
    )
}

function DataReconCard({ businessName, followers, rating, color }: any) {
    return (
        <div className="w-full max-w-md mx-auto mb-6">
            <div className="bg-[#0a0a0a] border rounded-lg overflow-hidden font-mono text-xs"
                style={{ borderColor: `${color}60`, boxShadow: `0 0 20px ${color}10` }}>

                <div className="p-2 border-b flex justify-between items-center bg-opacity-5"
                    style={{ borderColor: `${color}30`, backgroundColor: `${color}05` }}>
                    <div className="flex items-center gap-2" style={{ color: color }}>
                        <Terminal size={12} />
                        <span className="tracking-widest font-bold text-[9px]">SYSTEM_CONNECTED</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
                </div>

                <div className="p-3 grid grid-cols-2 gap-2">
                    <div className="border border-white/10 p-2 rounded bg-white/5">
                        <span className="block text-gray-500 text-[8px] mb-1">INSTAGRAM</span>
                        <span className="font-bold text-sm" style={{ color: color }}>{followers}</span>
                    </div>
                    <div className="border border-white/10 p-2 rounded bg-white/5">
                        <span className="block text-gray-500 text-[8px] mb-1">REVIEWS</span>
                        <span className="font-bold text-sm" style={{ color: color }}>{rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
