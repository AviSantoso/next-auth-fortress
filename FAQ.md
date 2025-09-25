# Frequently Asked Questions (FAQ)

### 1. How can I customize the UI and branding?

The UI is built with [Chakra UI](https://chakra-ui.com/). All UI components are located in `src/components/`.

- **Global Styles & Theme:** Modify the theme (fonts, colors, radii) in `src/components/ui/provider.tsx`.
- **Layout:** The main app layout, header, and footer are in `src/components/layout/`.
- **Pages:** The core authentication pages (`LoginPage`, `RegisterPage`, etc.) are in `src/components/pages/`. You can edit these React components directly to change their structure and content.
- **Branding:** Replace "Next-Auth Fortress" with your app's name in `Header.tsx`, `LoginPage.tsx`, and the `<title>` tag in `layout.tsx`.

### 2. How do I add a new OAuth provider (e.g., GitHub, Discord)?

This template is designed to be extensible. Here's the general process for adding a new provider like GitHub:

1.  **Create an OAuth App:** Go to GitHub's developer settings to create a new OAuth App and get a Client ID and Client Secret. Add them to your `.env.local` file.
2.  **Client Helper:** Create a new utility file (e.g., `src/lib/utils/getGitHubOAuthClient.ts`) to configure the official GitHub OAuth client with your credentials.
3.  **Server Actions:**
    - Create an action like `getGitHubAuthUrl.ts` to generate the authorization URL.
    - Create a corresponding callback API route (e.g., `src/app/api/auth/login-github/route.ts`). This route will handle the code returned by GitHub, exchange it for an access token, fetch the user's email, and then call your `getOrCreateUser` and `setAuth` server actions.
4.  **Frontend Button:** Add a "Sign in with GitHub" button to `src/components/pages/LoginPage.tsx` that calls your new `getGitHubAuthUrl` action and redirects the user.

### 3. What database is used and what are the deployment considerations?

This template uses **SQLite** through the `libsql` driver, which makes local development incredibly simple.

- **For Local Development:** The database is just a single file (e.g., `local.db`). It's configured in `.env.local` via the `DB_FILE_NAME` variable. This requires zero setup—no separate database server to install or run.
- **For Production:** Serverless environments like Vercel do not support storing a writable file. Therefore, you **must** use a remote, serverless-compatible SQLite provider. The recommended solution is **[Turso](https://turso.tech/)**.

The database connection in `src/lib/utils/db.ts` is already configured to switch between the local file in development and a remote Turso database in production, based on your environment variables. Refer to the `README.md` for full deployment instructions.

### 4. Is this template secure for production?

This template was built with security as a priority. Key security features include:

- **No Passwords Stored:** The passwordless approach mitigates risks associated with password breaches.
- **Encrypted Sessions:** [Iron Session](https://github.com/vvo/iron-session) encrypts all session data using a strong secret key (`SESSION_KEY`) before storing it in a cookie.
- **Server-Side Validation:** All authentication logic and verification (OAuth codes, magic tokens, WebAuthn challenges) are handled exclusively in server-side code (Next.js Server Actions and API Routes), preventing client-side tampering.
- **HTTP-Only Cookies:** Session cookies are configured to be `httpOnly`, preventing them from being accessed by client-side JavaScript.

**Disclaimer:** While the template provides a secure foundation, you are responsible for keeping your `.env.local` secrets safe, managing your production environment securely, and auditing any new code you add.

### 5. How does the session management work?

Session management is handled by **Iron Session**. When a user successfully logs in, the `setAuth` server action creates a session object containing the `userId` and `email`. Iron Session encrypts this object and stores it in a stateless, `httpOnly` cookie.

On subsequent requests, you can call the `getSession` function in any Server Component, API Route, or Server Action. Iron Session automatically finds the cookie, decrypts it with your `SESSION_KEY`, and gives you the session data. This is efficient and works perfectly in serverless environments as it doesn't require a database lookup for every request.

### 6. Why passwordless? Can I add traditional password login?

We chose a passwordless-first approach because it provides a better user experience and stronger security. It eliminates password fatigue for users and protects them from phishing attacks (especially with WebAuthn/passkeys).

If you must add password authentication, you would need to:

1.  Add a `hashedPassword` column to the `UserTable` in `src/lib/utils/schema.ts`.
2.  Use a library like `bcrypt` to hash and verify passwords.
3.  Create new server actions to handle user registration (hashing the password) and login (comparing the password hash).
4.  Add a password field and a dedicated login form to the `LoginPage`.
5.  **Critically, ensure you never store passwords in plain text.**

### 7. How do I access user data on a protected page?

Once a user is logged in, you can access their session data in any Server Component.

```tsx
// src/app/dashboard/page.tsx
import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.email) {
    // If no session exists, redirect to login
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.email}!</h1>
      <p>Your user ID is: {session.userId}</p>
    </div>
  );
}
```

The `AuthProvider` in `src/app/layout.tsx` handles the top-level redirection logic, ensuring unauthenticated users are always sent to the `/login` page.

### 8. How do I manage database schema changes in production?

The `pnpm db:push` command is great for development but is not recommended for production databases as it can be destructive. For production, you should use Drizzle's migration system:

1.  **Generate a Migration:** After changing your schema in `src/lib/utils/schema.ts`, run the following command to generate an SQL migration file:

    ```bash
    pnpm db:generate
    ```

    This will create a new SQL file in the `drizzle` directory.

2.  **Apply the Migration:** Run the migration against your production database. You can do this locally by pointing your `.env.local` to the production database URL, or as part of your CI/CD pipeline.
    ```bash
    pnpm db:migrate
    ```

### 9. Why was Iron Session chosen over a library like NextAuth.js?

[NextAuth.js (now Auth.js)](https://authjs.dev/) is an excellent, comprehensive authentication library. It's a great choice if you need a full-featured solution that abstracts away much of the complexity.

This template uses **Iron Session** and other lower-level libraries to provide a more unopinionated and transparent foundation. The goals are:

- **Granular Control:** You have direct control over every step of the authentication flow.
- **Server-Centric:** The implementation aligns perfectly with the Next.js App Router and Server Actions paradigm.
- **Minimal Abstraction:** The code is easier to trace and understand, making it an ideal learning resource and a flexible starting point without the "magic" of a larger framework.

### 10. Where do I add user profile information, like a first name?

The database schema (`src/lib/utils/schema.ts`) already includes a `firstName` field on the `UserTable`, which is currently unused.

To build a profile update feature:

1.  **Create a Profile Page:** Create a new page, for example at `src/app/profile/page.tsx`.
2.  **Build a Form:** On that page, create a form with an input for the user's first name.
3.  **Create a Server Action:** Write a new server action (e.g., `updateUserProfile.ts`) that takes the new name, gets the `userId` from the session, and uses a Drizzle query to update the corresponding user in the database.
4.  **Fetch Existing Data:** Your profile page should also fetch the current user data from the database to pre-populate the form. You can extend the `UserService.ts` for this.

### 11. Why was SQLite chosen for this template?

SQLite was chosen to make the developer experience as frictionless as possible, while still providing a robust path to production.

- **Simplicity:** For local development, there is zero configuration. It works out of the box without needing to install or run a separate database service like PostgreSQL.
- **Serverless-Friendly:** When paired with a service like [Turso](https://turso.tech/), SQLite becomes a powerful, edge-ready database that fits perfectly into serverless architectures like Vercel.
- **Low Cost & Portability:** Starting with a local file is free, and providers like Turso have generous free tiers. Your entire database is a single file, making it easy to back up and move.

### 12. How do I customize the magic link email?

The email template is a simple HTML string generated within a server action. You can directly edit it for customization.

1.  Navigate to `src/actions/sendMagicLink.ts`.
2.  Find the `generateMagicLinkEmail` function.
3.  The body of this function is a template literal containing the full HTML of the email. You can modify the HTML, inline CSS, and text directly in this string.

For more complex designs, consider using an email framework like [React Email](https://react.email/) or [MJML](https://mjml.io/), generating the HTML, and then integrating it into this function.

### 13. How is client-side state managed?

This template uses [**Zustand**](https://github.com/pmndrs/zustand) for minimal, lightweight global client-side state management.

- **Location:** The store is defined in `src/lib/utils/appStore.ts`.
- **Usage:** It is currently used on the `LoginPage` to hold the value of the email input. This allows UI elements, like the "Continue with Email" button, to reactively appear or disappear based on the store's state.
- **Extensibility:** If your application needs more complex client-side state (e.g., managing UI toggles, caching data), you can easily extend this existing Zustand store without pulling in a heavier library like Redux.

### 14. How should I handle authentication errors?

The template provides a foundation for error handling using `try...catch` blocks in the client-side components and a central `toaster` for user notifications.

- **Client-Side:** In components like `AddPasskeyButton.tsx` and `LoginWithPasskeyButton.tsx`, the primary authentication functions (`startRegistration`, `verifyLogin`, etc.) are wrapped in `try...catch` blocks.
- **User Feedback:** When an error is caught, `toaster.create()` is called to show a user-friendly error message (e.g., "Login was cancelled"). Specific errors, like the user cancelling a WebAuthn prompt, are caught and handled gracefully.
- **Server-Side:** Server actions throw errors on failure (e.g., if a challenge is missing or verification fails). These errors are caught by the client that called the action.

You can extend this by adding more specific error checks and providing more detailed feedback to the user based on the type of error thrown from the server.
