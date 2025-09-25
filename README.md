# Next-Auth Fortress

A production-ready, password-less authentication template for Next.js 14+. Built with a modern, server-centric stack including the App Router, Drizzle ORM, and Iron Session. Get started in minutes, not days.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Favisantoso%2Fnext-auth-fortress&project-name=my-secure-app&repository-name=my-secure-app&env=SESSION_KEY,DATABASE_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URL,RESEND_API_KEY,NEXT_PUBLIC_APP_URL,RPID,NOREPLY_EMAIL,BRAND_NAME&envDescription=Required%20environment%20variables%20for%20the%20app%20to%20function.&demo-title=Next-Auth%20Fortress%20Demo&demo-description=See%20passwordless%20authentication%20in%20action.&demo-url=https%3A%2F%2Fnext-auth-fortress.vercel.app%2F)
&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Introduction

Next-Auth Fortress is a starter kit designed to eliminate the boilerplate and complexity of implementing modern, secure authentication. It provides a robust foundation for your Next.js application by focusing on a **password-less first** approach, which enhances both security and user experience.

This template is intentionally minimal _after_ the authentication flow. Once a user is logged in, you are given a clean slate to build your application, without being locked into a rigid framework.

**[➡️ View the Live Demo](https://next-auth-fortress.vercel.app/)**

## Features

- **Multiple Auth Strategies:** Out-of-the-box support for modern, password-less methods.
  - **WebAuthn (Passkeys):** Secure, phishing-resistant login using biometrics or hardware keys.
  - **Google OAuth 2.0:** Simple and trusted social login.
  - **Email Magic Links:** Password-free sign-in via one-time links.
- **Modern Tech Stack:** Built on the latest standards.
  - **Next.js 14:** App Router, Server Components (RSC), and Server Actions.
  - **Drizzle ORM:** Type-safe, lightweight database access with zero dependencies.
  - **Chakra UI:** A simple, modular, and accessible component library.
- **Database Ready:** Includes a pre-configured schema for PostgreSQL.
  - **Users & Credentials:** Tables for users, magic tokens, and WebAuthn credentials.
  - **Migrations:** Easily manage your database schema with `drizzle-kit`.
- **Secure by Default:**
  - **Iron Session:** Encrypted, stateless session management in cookies.
  - **Server-Side Logic:** All authentication logic is handled securely on the server.
- **Deploy Ready:**
  - **One-Click Vercel Deploy:** Get your own instance running in seconds.
  - **Comprehensive Environment Setup:** Clear instructions for all required secrets and keys.

## Tech Stack

| Technology                                              | Role                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [**Next.js**](https://nextjs.org/)                      | The React Framework for Production (using App Router)        |
| [**Drizzle ORM**](https://orm.drizzle.team/)            | TypeScript ORM for interacting with the PostgreSQL database. |
| [**PostgreSQL**](https://www.postgresql.org/)           | The world's most advanced open source relational database.   |
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

````

### 2. Configure Environment Variables

Create a `.env.local` file by copying the example file.

```bash
cp dotenv.example .env.local
```

Now, open `.env.local` and fill in the required variables. See the [Environment Variables](#environment-variables) section below for detailed instructions on where to find each value.

### 3. Install Dependencies

This project uses `pnpm` by default, but you can use `npm` or `yarn`.

```bash
pnpm install
```

### 4. Set Up the Database

Run the Drizzle push command to sync your database schema with the one defined in `/src/lib/utils/schema.ts`. This is perfect for rapid prototyping.

```bash
pnpm db:push
```

For production, use migrations. See the [FAQ](./FAQ.md) for details.

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## One-Click Deployment

The easiest way to deploy your instance is to use the Vercel Platform.

1.  Click the "Deploy with Vercel" button below.
2.  Follow the instructions to connect your GitHub account and create the repository.
3.  In the "Configure Project" step, create a **Vercel Postgres** database and connect it. This will automatically set the `DATABASE_URL` variable.
4.  Add the remaining environment variables as prompted.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Favisantoso%2Fnext-auth-fortress&project-name=my-secure-app&repository-name=my-secure-app&env=SESSION_KEY,DATABASE_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URL,RESEND_API_KEY,NEXT_PUBLIC_APP_URL,RPID,NOREPLY_EMAIL,BRAND_NAME&envDescription=Required%20environment%20variables%20for%20the%20app%20to%20function.&demo-title=Next-Auth%20Fortress%20Demo&demo-description=See%20passwordless%20authentication%20in%20action.&demo-url=https%3A%2F%2Fnext-auth-fortress.vercel.app%2F)

## Environment Variables

You'll need to set the following environment variables for the application to work correctly.

| Variable               | Description                                                                                           | Instructions / Example                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `SESSION_KEY`          | **Required.** A secret key (at least 32 characters) for encrypting session cookies with Iron Session. | Run `openssl rand -hex 32` in your terminal to generate a secure key.                        |
| `DATABASE_URL`         | **Required.** Connection string for your PostgreSQL database.                                         | e.g., `postgres://user:pass@host:port/db`. Vercel Postgres provides this automatically.      |
| `GOOGLE_CLIENT_ID`     | **Required.** Your Google OAuth 2.0 Client ID.                                                        | Get this from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_CLIENT_SECRET` | **Required.** Your Google OAuth 2.0 Client Secret.                                                    | Get this from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_REDIRECT_URL`  | **Required.** The path for Google to redirect to after authentication.                                | Should be set to `/api/auth/login-google`.                                                   |
| `RESEND_API_KEY`       | **Required.** Your API key from Resend for sending magic link emails.                                 | Get this from your [Resend Dashboard](https://resend.com/api-keys).                          |
| `NEXT_PUBLIC_APP_URL`  | **Required.** The full public URL of your application.                                                | For local dev: `http://localhost:3000`. For production: `https://yourdomain.com`.            |
| `RPID`                 | **Required.** The Relying Party ID for WebAuthn (Passkeys). **Must not** include protocol or port.    | For local dev: `localhost`. For production: `yourdomain.com`.                                |
| `NOREPLY_EMAIL`        | **Required.** The "from" email address for sending magic links.                                       | `Your App <noreply@yourdomain.com>`. Must be a domain verified with Resend.                  |
| `BRAND_NAME`           | **Required.** The name of your app, used in emails and on the UI.                                     | `Next-Auth Fortress`                                                                         |

## Further Documentation

- **[WEBAUTHN_TUTORIAL.md](./WEBAUTHN_TUTORIAL.md):** A deep dive into the WebAuthn (Passkey) implementation, explaining both registration and authentication flows.
- **[FAQ.md](./FAQ.md):** Frequently asked questions about customization, security, and deployment.

## Author & Attribution

This template was built with ❤️ by **Avi Santoso**.

I believe in building secure, user-friendly software and sharing knowledge with the community. If you find this template useful, please consider giving it a star!

- **Personal Website:** [avisantoso.com](https://avisantoso.com)
- **Need an AI Expert?** Visit [VerticalAI](https://www.verticalai.com.au).
````
