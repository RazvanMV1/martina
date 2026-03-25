// lib/email.tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  email: string,
  token: string
): Promise<void> {
  const confirmUrl = `${process.env.APP_URL}/api/confirm?token=${token}`;

  await resend.emails.send({
    from: 'Martina <hello@mail.martinavalenti.com>',
    to: email,
    subject: 'Please confirm your email address',
    text: `Hi, please confirm your email by clicking this link: ${confirmUrl}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        ">
          <table width="100%" cellpadding="0" cellspacing="0" style="
            max-width: 480px;
            margin: 40px auto;
            background-color: #1f2937;
            border-radius: 16px;
            overflow: hidden;
          ">
            <!-- HEADER -->
            <tr>
              <td style="
                padding: 40px 40px 20px;
                text-align: center;
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
              ">
                <p style="
                  margin: 0 0 8px;
                  font-size: 11px;
                  font-weight: 600;
                  letter-spacing: 0.2em;
                  text-transform: uppercase;
                  color: #f43f5e;
                ">Private Access · Members Only</p>
                <h1 style="
                  margin: 0;
                  font-size: 28px;
                  font-weight: 700;
                  color: #ffffff;
                  line-height: 1.2;
                ">One step away from<br/>my secret world 🔥</h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 24px 40px;">
                <p style="
                  margin: 0 0 24px;
                  font-size: 16px;
                  color: #9ca3af;
                  line-height: 1.6;
                ">
                  You requested exclusive access to my private content. 
                  Click the button below to confirm your email and 
                  unlock the link to my Telegram.
                </p>

                <!-- CTA BUTTON -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 8px 0 24px;">
                      <a href="${confirmUrl}" style="
                        display: inline-block;
                        padding: 16px 40px;
                        background-color: #f43f5e;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 14px;
                        font-weight: 700;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        border-radius: 12px;
                      ">
                        ✅ Confirm My Access
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="
                  margin: 0;
                  font-size: 12px;
                  color: #6b7280;
                  line-height: 1.6;
                ">
                  This link expires in <strong style="color: #9ca3af;">24 hours</strong>. 
                  If you didn't request this, simply ignore this email.
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="
                padding: 20px 40px;
                border-top: 1px solid #374151;
                text-align: center;
              ">
                <p style="
                  margin: 0;
                  font-size: 11px;
                  color: #4b5563;
                ">
                  Spam-free · 100% discreet · Unsubscribe anytime
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
