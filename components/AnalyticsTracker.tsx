'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AnalyticsTrackerProps {
    profileId: string
    fbPixel?: string
    googleAnalytics?: string
}

export default function AnalyticsTracker({ profileId, fbPixel, googleAnalytics }: AnalyticsTrackerProps) {
    useEffect(() => {
        // Page View Tracking with SessionStorage debouncing
        const trackPageView = async () => {
            const sessionKey = `has_viewed_${profileId}`

            // Check if user has already been counted in this session
            if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
                try {
                    // Call RPC function to increment page views
                    const { error } = await supabase.rpc('increment_page_views', {
                        profile_id: profileId
                    })

                    if (error) {
                        console.error('Error incrementing page views:', error)
                    } else {
                        // Mark as viewed in this session
                        sessionStorage.setItem(sessionKey, 'true')
                        console.log('✅ Page view tracked for profile:', profileId)
                    }
                } catch (err) {
                    console.error('Failed to track page view:', err)
                }
            }
        }

        trackPageView()
    }, [profileId])

    useEffect(() => {
        // Facebook Pixel injection
        if (fbPixel && typeof window !== 'undefined') {
            // Check if already loaded
            if (!(window as any).fbq) {
                // Create script element
                const script = document.createElement('script')
                script.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${fbPixel}');
                    fbq('track', 'PageView');
                `

                // Inject into head
                document.head.appendChild(script)
                console.log('✅ Facebook Pixel loaded:', fbPixel)

                // Cleanup function
                return () => {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script)
                    }
                }
            } else {
                // If fbq already exists, just track PageView
                ; (window as any).fbq('track', 'PageView')
            }
        }
    }, [fbPixel])

    useEffect(() => {
        // Google Analytics (GA4) injection
        if (googleAnalytics && typeof window !== 'undefined') {
            // Check if already loaded
            if (!(window as any).gtag) {
                // Create gtag.js script
                const gtagScript = document.createElement('script')
                gtagScript.async = true
                gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`

                // Create initialization script
                const initScript = document.createElement('script')
                initScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${googleAnalytics}');
                `

                // Inject into head
                document.head.appendChild(gtagScript)
                document.head.appendChild(initScript)
                console.log('✅ Google Analytics loaded:', googleAnalytics)

                // Cleanup function
                return () => {
                    if (gtagScript.parentNode) {
                        gtagScript.parentNode.removeChild(gtagScript)
                    }
                    if (initScript.parentNode) {
                        initScript.parentNode.removeChild(initScript)
                    }
                }
            } else {
                // If gtag already exists, just track PageView
                ; (window as any).gtag('config', googleAnalytics, {
                    page_path: window.location.pathname,
                })
            }
        }
    }, [googleAnalytics])

    // This component doesn't render anything visible
    return null
}
