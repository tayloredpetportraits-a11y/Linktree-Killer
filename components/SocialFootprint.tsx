'use client'

import { Check, X } from 'lucide-react'

interface SocialFootprintProps {
    businessName?: string
    industry?: string
    socials?: {
        instagram?: string | null
        facebook?: string | null
        linkedin?: string | null
    }
    bookingSystem?: string
}

export function SocialFootprint({ businessName, industry, socials, bookingSystem }: SocialFootprintProps) {
    if (!businessName) return null

    const detectedChannels = [
        { name: 'Instagram', detected: !!socials?.instagram, icon: 'fa-instagram', color: 'text-pink-400' },
        { name: 'Facebook', detected: !!socials?.facebook, icon: 'fa-facebook', color: 'text-blue-400' },
        { name: 'LinkedIn', detected: !!socials?.linkedin, icon: 'fa-linkedin', color: 'text-blue-500' },
        { name: 'Booking System', detected: bookingSystem && bookingSystem !== 'Unknown', icon: 'fa-calendar-check', color: 'text-green-400' }
    ]

    return (
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-emerald-500/30 rounded-xl p-4 shadow-2xl mb-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-check-double text-emerald-400 text-sm"></i>
                </div>
                <h3 className="text-sm font-bold text-white">Digital Footprint Verified</h3>
            </div>

            <div className="space-y-2">
                {detectedChannels.map((channel) => (
                    <div
                        key={channel.name}
                        className={`flex items-center justify-between p-2 rounded-lg transition ${channel.detected
                                ? 'bg-green-900/30 border border-green-500/20'
                                : 'bg-gray-800/50 border border-gray-700/50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <i className={`fa-brands ${channel.icon} ${channel.detected ? channel.color : 'text-gray-600'}`}></i>
                            <span className={`text-xs font-medium ${channel.detected ? 'text-white' : 'text-gray-500'}`}>
                                {channel.name}
                            </span>
                        </div>
                        {channel.detected ? (
                            <Check size={14} className="text-green-400" />
                        ) : (
                            <X size={14} className="text-gray-600" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-400">
                    <span className="text-emerald-400 font-medium">Target:</span> {businessName}
                </p>
                {industry && (
                    <p className="text-xs text-gray-500 mt-1">Industry: {industry}</p>
                )}
            </div>
        </div>
    )
}
