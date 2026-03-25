// app/api/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/invalid-token', request.url)
      );
    }

    // Căutăm tokenul în baza de date
    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, status, token_expires_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      return NextResponse.redirect(
        new URL('/invalid-token', request.url)
      );
    }

    // Verificăm dacă tokenul a expirat
    if (new Date() > new Date(data.token_expires_at)) {
      return NextResponse.redirect(
        new URL('/token-expired', request.url)
      );
    }

    // Confirmăm emailul
    await supabaseAdmin
      .from('email_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        token: null, // ștergem tokenul după confirmare
      })
      .eq('id', data.id);

    // Redirectăm către pagina de succes cu link Telegram
    return NextResponse.redirect(
      new URL('/welcome', request.url)
    );

  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.redirect(
      new URL('/invalid-token', request.url)
    );
  }
}
