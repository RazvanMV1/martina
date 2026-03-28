// lib/tokens.ts
import crypto from 'crypto';

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET!;
  const payload = Buffer.from(email.toLowerCase().trim()).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const secret = process.env.UNSUBSCRIBE_SECRET!;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64url');
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) return null;
    return Buffer.from(payload, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}
