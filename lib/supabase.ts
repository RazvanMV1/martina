// lib/supabase.ts
// Clientul Supabase pentru server-side (API Routes).
// Folosim SERVICE_ROLE_KEY — bypass complet al Row Level Security.
// IMPORTANT: acest client NU se folosește niciodata în componente client-side
// deoarece SERVICE_ROLE_KEY nu trebuie expus în browser.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env.local file.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // Dezactivăm persistența sesiunii — nu avem nevoie de auth
    // în acest API Route, doar de acces la baza de date.
    autoRefreshToken: false,
    persistSession: false,
  },
});
