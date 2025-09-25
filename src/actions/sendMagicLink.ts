"use server";

import { randomBytes } from "crypto";
import { Resend } from "resend";
import { format } from "date-fns";
import {
  createMagicToken,
  getValidTokenByEmail,
} from "@/lib/services/MagicTokenService";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const NOREPLY_EMAIL = process.env.NOREPLY_EMAIL!;

if (!NOREPLY_EMAIL) {
  throw new Error("Environment variable NOREPLY_EMAIL is not set");
}

const BRAND_NAME = process.env.BRAND_NAME!;

if (!BRAND_NAME) {
  throw new Error("Environment variable BRAND_NAME is not set");
}

const TOKEN_EXPIRY_HOURS = 1;

function generateMagicLinkEmail({
  magicLink,
  expiryTime,
  sentAtTime,
}: {
  magicLink: string;
  expiryTime: string;
  sentAtTime: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Sign In to ${BRAND_NAME}</title>
        <style>
          @media only screen and (max-width: 620px) {
            table.body h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
          }
          
          a {
            color: black;
            text-decoration: none;
          }
          
          a:visited {
            color: black;
          }
          
          a:hover {
            color: #666666;
          }
          
          a:active {
            color: #888888;
          }
          
          .button {
            background-color: transparent;
            border: 1px solid #333333;
            border-radius: 4px;
            color: #333333;
            padding: 10px 20px;
            text-align: center;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            font-weight: 500;
          }
          
          .link-box {
            margin: 15px 0;
            padding: 10px;
            background-color: #f8f8f8;
            border-radius: 4px;
            word-break: break-all;
          }
          
          .brand-link {
            color: #e91e63 !important;
            font-weight: 500;
          }
          
          .footer {
            margin-top: 20px;
            color: #666666;
            font-size: 12px;
            text-align: center;
          }
          
          .footer p {
            margin: 5px 0;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: sans-serif;
            color: #333333;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="color: #e91e63; margin-bottom: 20px;">${BRAND_NAME}</h1>
          <p>Hello,</p>
          <p>We received a request to sign in to your account using this email address. Click the button below to sign in:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" class="button">Sign In</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <div class="link-box">
            <a href="${magicLink}" class="brand-link">${magicLink}</a>
          </div>
          
          <p>If you didn't request this link, you can safely ignore this email.</p>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee;">
            <p style="color: #666666; font-size: 14px;">
              <strong>Link expires:</strong> ${expiryTime}
            </p>
          </div>
          
          <div class="footer">
            <p>Built with love by <a href="https://avisantoso.com" class="brand-link" target="_blank">Avi Santoso</a>.</p>
            <p>Need an AI expert? Visit <a href="https://www.verticalai.com.au" class="brand-link" target="_blank">VerticalAI</a>.</p>
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            <p>Sent at ${sentAtTime}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendMagicLink({ email }: { email: string }) {
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setHours(expiryDate.getHours() + TOKEN_EXPIRY_HOURS);

  const existingToken = await getValidTokenByEmail({ email });

  if (existingToken) {
    throw new Error(
      `We've already sent a magic link to this email recently. Please check your inbox, or try again in an hour.`
    );
  }

  const magicToken = await createMagicToken({
    token: randomBytes(32).toString("hex"),
    email,
    expiresAt: expiryDate,
  });

  const token = magicToken.token;

  const magicLink = `${APP_URL}/login?token=${token}`;
  const sentAtTime = format(now, "MMMM do, yyyy 'at' h:mm a");
  const expiryTime = format(expiryDate, "MMMM do, yyyy 'at' h:mm a");

  await resend.emails.send({
    from: NOREPLY_EMAIL,
    to: [email],
    subject: `Sign in to ${BRAND_NAME}`,
    html: generateMagicLinkEmail({ magicLink, expiryTime, sentAtTime }),
  });
}
