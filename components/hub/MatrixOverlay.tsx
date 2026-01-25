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
}

export default function MatrixOverlay({ isScanning, onComplete }: MatrixOverlayProps) {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!isScanning) {
            setLogs([]);
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

    return (
        <AnimatePresence>
            {isScanning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono overflow-hidden"
                >
                    {/* Matrix Rain Effect (Simplified CSS version) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(255,95,31,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,95,31,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Scanning Line */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-2 bg-[#FF5F1F] shadow-[0_0_20px_rgba(255,95,31,0.8)] z-10"
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="relative z-20 w-full max-w-2xl p-8">
                        <div className="border border-[#FF5F1F]/30 bg-black/80 backdrop-blur-md p-6 rounded-sm shadow-[0_0_30px_rgba(255,95,31,0.2)]">
                            <h2 className="text-[#FF5F1F] font-bold mb-4 tracking-widest text-sm animate-pulse">
                                SYSTEM TERMINAL &gt; SCANNERS: ONLINE
                            </h2>

                            <div className="space-y-2 font-mono text-sm h-64 overflow-y-auto flex flex-col-reverse">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[#FF8C5A]"
                                    >
                                        <span className="text-[#FF5F1F]/60 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {'>'} {log}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between text-xs text-[#FF5F1F]/60 font-mono uppercase">
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
