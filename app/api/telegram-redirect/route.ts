import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_URL = 'https://t.me/themartinavalenti';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const normalized = email.toLowerCase().trim();

      await supabase
        .from('email_subscribers')
        .update({ telegram_clicked_at: new Date().toISOString() })
        .eq('email', normalized);
    }

    return NextResponse.redirect(TELEGRAM_URL);

  } catch (err) {
    console.error('Telegram redirect error:', err);
    // Chiar dacă e eroare, redirectează oricum la Telegram
    return NextResponse.redirect(TELEGRAM_URL);
  }
}
