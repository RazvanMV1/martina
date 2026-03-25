// app/api/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = 'https://martinavalenti.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${BASE_URL}/invalid-token`);
    }

    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, status, token_expires_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${BASE_URL}/invalid-token`);
    }

    if (new Date() > new Date(data.token_expires_at)) {
      return NextResponse.redirect(`${BASE_URL}/token-expired`);
    }

    await supabaseAdmin
      .from('email_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        token: null,
      })
      .eq('id', data.id);

    return NextResponse.redirect(`${BASE_URL}/welcome`);

  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.redirect(`${BASE_URL}/invalid-token`);
  }
}
