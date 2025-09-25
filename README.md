# Next-Auth Fortress

A production-ready, password-less authentication template for Next.js 14+. Built with a modern, server-centric stack including the App Router, Drizzle ORM, and Iron Session.

---

## Introduction

Next-Auth Fortress is a starter kit designed to eliminate the boilerplate and complexity of implementing modern, secure authentication. It provides a robust foundation for your Next.js application by focusing on a **password-less first** approach, which enhances both security and user experience.

This template is intentionally minimal _after_ the authentication flow. Once a user is logged in, you are given a clean slate to build your application, without being locked into a rigid framework.

## Features

- **Multiple Auth Strategies:** Out-of-the-box support for modern, password-less methods.
  - **WebAuthn (Passkeys):** Secure, phishing-resistant login using biometrics or hardware keys.
  - **Google OAuth 2.0:** Simple and trusted social login.
  - **Email Magic Links:** Password-free sign-in via one-time links.
- **Modern Tech Stack:** Built on the latest standards.
  - **Next.js 14:** App Router, Server Components (RSC), and Server Actions.
  - **Drizzle ORM:** Type-safe, lightweight database access with zero dependencies.
  - **Chakra UI:** A simple, modular, and accessible component library.
- **Database Ready:** Includes a pre-configured schema for SQLite.
  - **Users & Credentials:** Tables for users, magic tokens, and WebAuthn credentials.
  - **Migrations:** Easily manage your database schema with `drizzle-kit`.
- **Secure by Default:**
  - **Iron Session:** Encrypted, stateless session management in cookies.
  - **Server-Side Logic:** All authentication logic is handled securely on the server.
- **Deploy Ready:**
  - **One-Click Vercel Deploy:** Get your own instance running in seconds (requires Turso for database).
  - **Comprehensive Environment Setup:** Clear instructions for all required secrets and keys.

## Tech Stack

| Technology                                              | Role                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [**Next.js**](https://nextjs.org/)                      | The React Framework for Production (using App Router)        |
| [**Drizzle ORM**](https://orm.drizzle.team/)            | TypeScript ORM for interacting with a SQLite database.       |
| [**SQLite**](https://www.sqlite.org/index.html)         | A lightweight, server-less SQL database engine (via LibSQL). |
| [**Chakra UI**](https://chakra-ui.com/)                 | Component library for the user interface.                    |
| [**Iron Session**](https://github.com/vvo/iron-session) | Secure, stateless session management via encrypted cookies.  |
| [**SimpleWebAuthn**](https://simplewebauthn.dev/)       | Library for simplifying WebAuthn (Passkey) implementation.   |
| [**Resend**](https://resend.com/)                       | Email API for delivering magic links.                        |

## Quick Start

Follow these steps to get a local development environment running.

### 1. Clone the Repository

```bash
git clone https://github.com/avisantoso/next-auth-fortress.git your-project-name
cd your-project-name
```

### 2. Configure Environment Variables

Create a `.env.local` file by copying the example file.

```bash
cp dotenv.example .env.local
```

Now, open `.env.local` and fill in the variables. For local development, you only need to set `DB_FILE_NAME` to a local path (e.g., `local.db`) and generate a `SESSION_KEY`. The rest are optional. See the [Environment Variables](#environment-variables) section below for details.

### 3. Install Dependencies

This project uses `pnpm` by default, but you can use `npm` or `yarn`.

```bash
pnpm install
```

### 4. Set Up the Database

Run the Drizzle push command. This will create and sync your local SQLite database file (e.g., `local.db`) with the schema defined in `/src/lib/utils/schema.ts`. This is perfect for rapid prototyping.

```bash
pnpm db:push
```

For production, use migrations. See the [FAQ](./FAQ.md) for details.

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## One-Click Deployment with Vercel & Turso

The default database setup uses a local SQLite file, which is **not suitable** for serverless deployment on Vercel. To deploy, you must use a hosted, serverless SQLite provider like **[Turso](https://turso.tech/)**.

### 1. Set up a Turso Database

1.  Sign up for a free Turso account.
2.  Install the Turso CLI and create a new database.
3.  Get your database URL (e.g., `libsql://your-db-name.turso.io`) and an authentication token. You will need these for your environment variables in Vercel.

### 2. Modify `db.ts` for Production

To handle both local development (file-based) and production (remote Turso DB), you need to update `src/lib/utils/db.ts`.

First, add the official LibSQL client to your project:

```bash
pnpm install @libsql/client
```

Then, replace the contents of `src/lib/utils/db.ts` with the following code. This allows your app to switch between the local DB and Turso based on the environment.

```typescript
// src/lib/utils/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

let client;

if (isProd) {
  // Production: Connect to remote Turso database
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error(
      "Production environment requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN"
    );
  }
  client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
} else {
  // Development: Connect to local SQLite file
  if (!process.env.DB_FILE_NAME) {
    throw new Error("Development environment requires DB_FILE_NAME");
  }
  client = createClient({
    url: process.env.DB_FILE_NAME,
  });
}

export const db = drizzle(client, { schema, logger: !isProd });
```

_**Note:** The schema `casing` option has been removed, as it's not supported by the standard client. Drizzle will default to the case used in your schema definition (`snake_case`)._

### 3. Deploy to Vercel

Click the button below to deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Favisantoso%2Fnext-auth-fortress&project-name=my-secure-app&repository-name=my-secure-app&env=SESSION_KEY,TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URL,RESEND_API_KEY,NEXT_PUBLIC_APP_URL,RPID,NOREPLY_EMAIL,BRAND_NAME&envDescription=Environment%20variables%20for%20your%20app.&demo-title=Next-Auth%20Fortress%20Demo&demo-description=See%20passwordless%20authentication%20in%20action.&demo-url=https%3A%2F%2Fnext-auth-fortress.vercel.app%2F)

When configuring your project on Vercel:

1.  **Skip** the prompt to create a Vercel Postgres database.
2.  Go to the project **Settings > Environment Variables**.
3.  Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from your Turso account.
4.  Add all other required and optional variables for the features you want to enable.

## Environment Variables

You'll need to set the following environment variables for the application to work correctly.

| Variable               | Description                                                                                        | Instructions / Example                                                                       |
| :--------------------- | :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| `SESSION_KEY`          | **Required.** A secret key (at least 32 characters) for encrypting session cookies.                | Run `openssl rand -hex 32` in your terminal to generate a secure key.                        |
| `DB_FILE_NAME`         | **Required (Local).** Path to the local SQLite database file for development.                      | `local.db`                                                                                   |
| `TURSO_DATABASE_URL`   | **Required (Production).** Connection string for your remote Turso database.                       | `libsql://your-db.turso.io`. Get this from your [Turso Dashboard](https://turso.tech/).      |
| `TURSO_AUTH_TOKEN`     | **Required (Production).** Auth token for your remote Turso database.                              | Get this from your [Turso Dashboard](https://turso.tech/).                                   |
| `GOOGLE_CLIENT_ID`     | **Optional.** Your Google OAuth 2.0 Client ID.                                                     | Get this from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_CLIENT_SECRET` | **Optional.** Your Google OAuth 2.0 Client Secret.                                                 | Get this from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_REDIRECT_URL`  | **Optional.** The path for Google to redirect to after authentication.                             | Should be set to `/api/auth/login-google`.                                                   |
| `RESEND_API_KEY`       | **Optional.** Your API key from Resend for sending magic link emails.                              | Get this from your [Resend Dashboard](https://resend.com/api-keys).                          |
| `NEXT_PUBLIC_APP_URL`  | **Required.** The full public URL of your application.                                             | Local: `http://localhost:3000`. Production: `https://yourdomain.com`.                        |
| `RPID`                 | **Required.** The Relying Party ID for WebAuthn (Passkeys). **Must not** include protocol or port. | Local: `localhost`. Production: `yourdomain.com`.                                            |
| `NOREPLY_EMAIL`        | **Optional.** The "from" email address for sending magic links.                                    | `Your App <noreply@yourdomain.com>`. Must be a domain verified with Resend.                  |
| `BRAND_NAME`           | **Required.** The name of your app, used in emails and on the UI.                                  | `Next-Auth Fortress`                                                                         |

## Further Documentation

- **[WEBAUTHN_TUTORIAL.md](./WEBAUTHN_TUTORIAL.md):** A deep dive into the WebAuthn (Passkey) implementation, explaining both registration and authentication flows.
- **[FAQ.md](./FAQ.md):** Frequently asked questions about customization, security, and deployment.

## Author & Attribution

This template was built with ❤️ by **Avi Santoso**.

I believe in building secure, user-friendly software and sharing knowledge with the community. If you find this template useful, please consider giving it a star!

- **Personal Website:** [avisantoso.com](https://avisantoso.com)
- **Need an AI Expert?** Visit [VerticalAI](https://www.verticalai.com.au).
