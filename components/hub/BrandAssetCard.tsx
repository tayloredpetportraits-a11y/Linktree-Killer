'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

interface BrandAssetCardProps {
    brandData: {
        title: string;
        theme_color: string;
        brand_colors: string[];
        fonts: string[];
        avatar_url?: string;
    };
}

export default function BrandAssetCard({ brandData }: BrandAssetCardProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all" />

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold text-xl tracking-tight">Brand Matrix</h3>
                    <p className="text-slate-400 text-sm">Decoded DNA</p>
                </div>
                {brandData.avatar_url && (
                    <div className="w-12 h-12 rounded-lg border border-slate-700 overflow-hidden bg-slate-800">
                        <img src={brandData.avatar_url} alt="Brand" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Colors */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Color Palette</h4>
                    <div className="grid grid-cols-5 gap-2">
                        {brandData.brand_colors.map((color, i) => (
                            <button
                                key={i}
                                onClick={() => copyToClipboard(color)}
                                className="group/color relative aspect-square rounded-lg border border-white/10 transition-transform hover:scale-105 hover:z-10 focus:outline-none"
                                style={{ backgroundColor: color }}
                                title={color}
                            >
                                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 bg-black/40 text-white text-[10px] font-mono transition-opacity">
                                    {copied === color ? 'COPIED' : ''}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fonts */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Typography</h4>
                    <div className="space-y-2">
                        {brandData.fonts.map((font, i) => (
                            <div
                                key={i}
                                className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex justify-between items-center group/font hover:border-indigo-500/50 transition-colors"
                            >
                                <span className="text-white text-sm">{font}</span>
                                <span className="text-xs text-slate-600 font-mono Aa">Aa</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action */}
                <button className="w-full mt-2 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2 border border-dashed border-slate-800 rounded-lg hover:border-indigo-500/30 transition-all">
                    <Copy className="w-3 h-3" />
                    Export Brand Kit JSON
                </button>
            </div>
        </div>
    );
}
