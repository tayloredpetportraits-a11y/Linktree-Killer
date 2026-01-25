'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Lock } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) throw signInError

            // Redirect to the One-Click Hub (Home)
            router.push('/')
            router.refresh()
        } catch (err) {
            console.error('Login error:', err)
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] font-sans selection:bg-[#d4e79e]/30 selection:text-[#d4e79e]">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#d4e79e] rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#d4e79e] to-emerald-400 mb-4 shadow-lg shadow-[#d4e79e]/20">
                        <span className="font-bold text-xl text-[#121212]">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                        Taylored AI Solutions Hub
                    </h1>
                    <p className="text-white/40 text-sm">
                        Enterprise Access Portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#1E1E1E]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#d4e79e]/50 focus:ring-1 focus:ring-[#d4e79e]/50 transition-all font-light"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#d4e79e]/50 focus:ring-1 focus:ring-[#d4e79e]/50 transition-all font-light"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                                <span className="mt-0.5">⚠️</span>
                                <div>{error}</div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#d4e79e] hover:bg-[#c3d68b] text-[#121212] font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(212,231,158,0.2)]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin"></div>
                                    <span className="opacity-80">Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    Launch Hub <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-8 text-white/20 text-xs">
                    Protected by <span className="text-white/40 font-medium">Taylored AI Security Protocol</span>.
                </p>
            </div>
        </div>
    )
}
