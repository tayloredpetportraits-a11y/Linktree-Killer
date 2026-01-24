import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // DEBUG: Hardcoded keys to ensure Builder works immediately
    return createBrowserClient(
        'https://qxkicdhsrlpehgcsapsh.supabase.co',
        'sb_publishable_TTBR0ES-pM7LOWDsywEy7A_9BSlhWGg'
    )
}

// Legacy export for compatibility
export const supabase = createClient()
