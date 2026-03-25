// lib/email.tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = 'https://martinavalenti.com';
  const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: 'Martina <hello@mail.martinavalenti.com>',
    to: email,
    subject: 'You requested access — confirm here',
    headers: {
      'List-Unsubscribe': `<mailto:hello@mail.martinavalenti.com?subject=unsubscribe>, <${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    text: `Not everyone gets in. You might be the exception.\n\nConfirm your access here: ${confirmUrl}\n\nThis link expires in 24 hours. If you didn't request this, ignore this email.\n\nUnsubscribe: ${unsubscribeUrl}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark">
          <meta name="supported-color-schemes" content="dark">
        </head>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        ">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" style="padding: 40px 20px;">

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
                  max-width: 480px;
                  background-color: #0d0d0d;
                  border-radius: 16px;
                  overflow: hidden;
                  border: 1px solid #1a1a1a;
                ">

                  <!-- HEADER -->
                  <tr>
                    <td style="
                      padding: 40px 40px 24px;
                      text-align: center;
                      background: linear-gradient(160deg, #1a0a0f 0%, #0d0d0d 100%);
                    ">
                      <p style="
                        margin: 0 0 12px;
                        font-size: 10px;
                        font-weight: 600;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        color: #f43f5e;
                        opacity: 0.7;
                      ">Exclusive Circle · By Invitation Only</p>
                      <h1 style="
                        margin: 0;
                        font-size: 26px;
                        font-weight: 700;
                        color: #ffffff;
                        line-height: 1.3;
                      ">Not everyone gets in.</h1>
                      <p style="
                        margin: 8px 0 0;
                        font-size: 22px;
                        font-weight: 400;
                        font-style: italic;
                        color: #f43f5e;
                        line-height: 1.3;
                      ">You might be the exception.</p>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding: 28px 40px;">
                      <p style="
                        margin: 0 0 28px;
                        font-size: 15px;
                        color: #9ca3af;
                        line-height: 1.7;
                      ">
                        You requested access to my private circle.
                        One click to confirm — and you&apos;re in.
                        <br/><br/>
                        <span style="color: #6b7280; font-size: 13px;">
                          No filters. No performance. Just the real me.
                        </span>
                      </p>

                      <!-- CTA BUTTON -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center" style="padding: 4px 0 28px;">
                            <a href="${confirmUrl}" style="
                              display: inline-block;
                              padding: 16px 44px;
                              background-color: #e11d48;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 13px;
                              font-weight: 700;
                              letter-spacing: 0.12em;
                              text-transform: uppercase;
                              border-radius: 12px;
                            ">
                              Confirm My Access &#8594;
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- LINK FALLBACK -->
                      <p style="
                        margin: 0 0 20px;
                        font-size: 11px;
                        color: #4b5563;
                        line-height: 1.6;
                        text-align: center;
                      ">
                        Button not working?
                        <a href="${confirmUrl}" style="color: #6b7280; word-break: break-all;">
                          Click here
                        </a>
                      </p>

                      <!-- EXPIRY NOTE -->
                      <p style="
                        margin: 0;
                        font-size: 12px;
                        color: #4b5563;
                        line-height: 1.6;
                        text-align: center;
                      ">
                        This link expires in
                        <strong style="color: #6b7280;">24 hours</strong>.
                        If you didn&apos;t request this, simply ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="
                      padding: 20px 40px;
                      border-top: 1px solid #1a1a1a;
                      text-align: center;
                    ">
                      <p style="
                        margin: 0 0 8px;
                        font-size: 10px;
                        color: #374151;
                        letter-spacing: 0.05em;
                      ">
                        Discreet &nbsp;·&nbsp; Select members only &nbsp;·&nbsp; Unsubscribe anytime
                      </p>
                      <a href="${unsubscribeUrl}" style="
                        font-size: 10px;
                        color: #374151;
                        text-decoration: underline;
                      ">
                        Unsubscribe
                      </a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
