'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OPENER = "Initializing Taylored AI Solutions Protocol...";
const COOK_PHASE = [
    "🔥 LET HIM COOK...",
    "🎨 YOINKING THE HEX CODES...",
    "👀 LOOKING RESPECTFULLY...",
    "🧬 STEALING BRAND DNA...",
    "📂 DECRYPTING ASSETS...",
    "💎 INJECTING THE VIBE..."
];
const FINISHER = "✅ ACCESS GRANTED.";

interface MatrixOverlayProps {
    isScanning: boolean;
    onComplete: () => void;
    brandColor?: string;  // Dynamic color from DNA
    logoUrl?: string;     // Logo for watermark
    realTimeData?: {      // Real DNA data to display
        businessName?: string;
        industry?: string;
        vibe?: string;
        instagram?: string;
        facebook?: string;
        bookingUrl?: string;
    };
}

export default function MatrixOverlay({ isScanning, onComplete, brandColor, logoUrl, realTimeData }: MatrixOverlayProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const [terminalColor, setTerminalColor] = useState('#FF5F00'); // Hacker Orange
    const [showFlash, setShowFlash] = useState(false);
    const [showLogo, setShowLogo] = useState(false);

    // Reset on scan start
    useEffect(() => {
        if (!isScanning) {
            setLogs([]);
            setTerminalColor('#FF5F00'); // Reset to orange
            setShowFlash(false);
            setShowLogo(false);
            return;
        }

        // Sequence Logic
        let step = 0;
        const maxSteps = 8; // Total messages to show

        const interval = setInterval(() => {
            let newMessage = "";

            if (step === 0) {
                newMessage = OPENER;
            } else if (step < maxSteps - 1) {
                // Pick random cook message
                newMessage = COOK_PHASE[Math.floor(Math.random() * COOK_PHASE.length)];
            } else {
                newMessage = FINISHER;
            }

            if (step < maxSteps) {
                setLogs(prev => [...prev, newMessage]);
                step++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 800);
            }
        }, 600);

        return () => clearInterval(interval);
    }, [isScanning, onComplete]);

    // Show real-time data as it arrives
    useEffect(() => {
        if (!realTimeData || !isScanning) return;

        const dataLogs: string[] = [];

        if (realTimeData.industry) {
            dataLogs.push(`🎯 INDUSTRY DETECTED: ${realTimeData.industry.toUpperCase()}`);
        }
        if (realTimeData.businessName) {
            dataLogs.push(`🏢 BUSINESS NAME: ${realTimeData.businessName.toUpperCase()}`);
        }
        if (realTimeData.instagram || realTimeData.facebook) {
            const socials = [];
            if (realTimeData.instagram) socials.push('INSTAGRAM');
            if (realTimeData.facebook) socials.push('FACEBOOK');
            dataLogs.push(`📱 SOCIALS FOUND: ${socials.join(' + ')}`);
        }
        if (realTimeData.bookingUrl) {
            const platform = realTimeData.bookingUrl.includes('square') ? 'SQUARE UP' :
                realTimeData.bookingUrl.includes('vagaro') ? 'VAGARO' :
                    realTimeData.bookingUrl.includes('gloss') ? 'GLOSSGENIUS' : 'BOOKING PLATFORM';
            dataLogs.push(`🔗 SECURED: ${platform}`);
        }

        // Add data logs with delays
        // Add data logs with delays - SLOW DOWN for dramatic effect
        dataLogs.forEach((log, index) => {
            setTimeout(() => {
                setLogs(prev => [...prev, log]);
            }, index * 2000); // 2s per log - Let them read it!
        });

        // Trigger "YOINKING HEX CODES" and color morph
        if (brandColor) {
            // Wait for all data logs to finish + 1 second buffer
            setTimeout(() => {
                setLogs(prev => [...prev, '🎨 YOINKING THE HEX CODES...']);

                // Flash effect
                setTimeout(() => {
                    setShowFlash(true);
                    setTimeout(() => setShowFlash(false), 100);

                    // Morph to brand color
                    setTimeout(() => {
                        setTerminalColor(brandColor);
                        setShowLogo(true);
                        setLogs(prev => [...prev, `>> DNA MATCH CONFIRMED: ${brandColor}`]);

                        // Final vibe check
                        const vibe = realTimeData?.vibe;
                        if (vibe) {
                            setTimeout(() => {
                                setLogs(prev => [...prev, `✨ VIBE CHECK: ${vibe.toUpperCase()}`]);
                                setTimeout(() => {
                                    setLogs(prev => [...prev, '🚀 DEPLOYING BUILDER...']);
                                    setTimeout(onComplete, 2000);
                                }, 2000);
                            }, 2000);
                        }
                    }, 150);
                }, 300);
            }, dataLogs.length * 2000 + 1000);
        }
    }, [realTimeData, brandColor, isScanning]);



    return (
        <AnimatePresence>
            {isScanning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono overflow-hidden"
                >
                    {/* White Flash Effect */}
                    {showFlash && (
                        <motion.div
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="absolute inset-0 bg-white z-50 pointer-events-none"
                        />
                    )}

                    {/* Matrix Rain Effect (Simplified CSS version) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(255,95,31,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,95,31,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Scanning Line - Dynamic Color */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-2 z-10"
                        style={{
                            backgroundColor: terminalColor,
                            boxShadow: `0 0 20px ${terminalColor}80`
                        }}
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Logo Watermark - Synced with Color Morph */}
                    {logoUrl && showLogo && (
                        <motion.div
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: [0, 0.8, 0.15] }} // Flash to 80% then settle at 15%
                            transition={{ duration: 1.5, times: [0, 0.4, 1] }} // Dramatic flash duration
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        >
                            <img
                                src={logoUrl}
                                alt="Brand Logo"
                                className="max-w-md max-h-md"
                                style={{
                                    filter: `grayscale(100%) drop-shadow(0 0 20px ${terminalColor})`,
                                }}
                            />
                        </motion.div>
                    )}

                    <div className="relative z-20 w-full max-w-2xl p-8">
                        <div
                            className="border bg-black/80 backdrop-blur-md p-6 rounded-sm transition-all duration-500"
                            style={{
                                borderColor: `${terminalColor}30`,
                                boxShadow: `0 0 30px ${terminalColor}20`
                            }}
                        >
                            <h2
                                className="font-bold mb-4 tracking-widest text-sm animate-pulse transition-colors duration-500"
                                style={{ color: terminalColor }}
                            >
                                SYSTEM TERMINAL &gt; SCANNERS: ONLINE
                            </h2>

                            <div
                                className="space-y-2 font-mono text-sm h-64 overflow-y-auto flex flex-col-reverse scrollbar-none"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <style jsx>{`
                                    .scrollbar-none::-webkit-scrollbar { display: none; }
                                `}</style>

                                {logs.slice().reverse().map((log, i) => {
                                    // Detect if this is a "Real Data" log (starts with specific emojis)
                                    const isDataLog = ['🎯', '🏢', '📱', '🔗', '✨', '🎨'].some(emoji => log.includes(emoji));
                                    const logColor = isDataLog ? '#00FF41' : terminalColor; // Matrix Green for data

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-mono text-lg font-bold my-1"
                                            style={{
                                                color: logColor,
                                                textShadow: `0 0 ${isDataLog ? '8px' : '5px'} ${logColor}`
                                            }}
                                        >
                                            <span
                                                className="mr-2"
                                                style={{
                                                    color: isDataLog ? '#00FF41' : `${terminalColor}60`,
                                                    opacity: 0.7,
                                                    textShadow: isDataLog ? '0 0 5px #00FF41' : `0 0 3px ${terminalColor}60`
                                                }}
                                            >
                                                [{new Date().toLocaleTimeString()}]
                                            </span>
                                            {'>'} {log}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className="mt-4 flex justify-between text-xs font-mono uppercase transition-colors duration-500"
                            style={{ color: `${terminalColor}60` }}
                        >
                            <span>Cpu: 98%</span>
                            <span>Ram: 42%</span>
                            <span>Encryption: 256-bit</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
