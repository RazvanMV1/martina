import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyUnsubscribeToken } from '@/lib/tokens';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 400 }
      );
    }

    // Verifică semnătura tokenului
    const email = verifyUnsubscribeToken(token);

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired link.' },
        { status: 400 }
      );
    }

    const normalized = email.toLowerCase().trim();

    const { error } = await supabase
      .from('email_subscribers')
      .delete()
      .eq('email', normalized);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
