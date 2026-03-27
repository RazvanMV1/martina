import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code received' }, { status: 400 });
  }

  const response = await fetch('https://auth.aweber.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://martinavalenti.com/api/aweber-callback',
    }),
  });

  const data = await response.json();

  // Afișează tokenurile — le copiem în .env
  return NextResponse.json(data);
}
