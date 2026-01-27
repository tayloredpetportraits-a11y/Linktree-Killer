'use client';
import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, PhoneOff, Loader2 } from 'lucide-react';

// ⚠️ PUBLIC KEY (from Vapi Dashboard → API Keys → Public Key)
const vapi = new Vapi('7d840f06-e7b9-43bd-b7be-45fad293d99c');

export default function LiveVoiceAgent({ assistantId, primaryColor, statusLabel }: any) {
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        // 1. Handle Call State
        vapi.on('call-start', () => {
            setConnecting(false);
            setConnected(true);
        });

        vapi.on('call-end', () => {
            setConnected(false);
            setIsSpeaking(false);
        });

        // 2. Visualizer (Makes button pulse when AI talks)
        vapi.on('speech-start', () => setIsSpeaking(true));
        vapi.on('speech-end', () => setIsSpeaking(false));

        return () => {
            vapi.stop(); // Cleanup on unmount
        };
    }, []);

    const toggleCall = async () => {
        if (connected) {
            vapi.stop();
        } else {
            setConnecting(true);
            // THE MAGIC: Connects to the assistant we just created 30s ago
            vapi.start(assistantId);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={toggleCall}
                className={`w-full py-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group ${connected
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white text-black hover:scale-[1.02]'
                    }`}
                style={!connected ? { boxShadow: `0 0 30px -5px ${primaryColor}40` } : {}}
            >
                {/* Background Shimmer */}
                {!connected && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Icon State */}
                <div className={`mb-2 p-3 rounded-full transition-all ${connected ? 'bg-white/20 text-white' : 'bg-black/5 text-black'
                    } ${isSpeaking ? 'animate-pulse scale-110' : ''}`}>
                    {connecting ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : connected ? (
                        <PhoneOff size={24} />
                    ) : (
                        <Mic size={24} />
                    )}
                </div>

                {/* Text State */}
                <span className="font-bold text-lg tracking-tight">
                    {connecting ? "CONNECTING..." : connected ? "TAP TO END CALL" : statusLabel || "START DEMO CALL"}
                </span>

                {!connected && (
                    <span className="text-xs text-gray-500 mt-1 font-mono">
                        AI RECEPTIONIST READY
                    </span>
                )}
            </button>

            {/* Live Connection Indicator */}
            {connected && (
                <p className="text-center text-xs text-green-500 mt-4 font-mono animate-pulse">
                    ● LIVE AUDIO CONNECTION ESTABLISHED
                </p>
            )}
        </div>
    );
}
