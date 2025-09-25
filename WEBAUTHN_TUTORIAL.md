# WebAuthn Tutorial

Alright, let's pull back the curtain on the coolest part of this template: **WebAuthn**, the magic behind passkeys. Forget passwords. We're talking about logging in with your fingerprint, your face, or a physical security key. It's fast, it's futuristic, and it's virtually phish-proof.

This tutorial will walk you through the dance between the user's browser and our server. It might seem complex, but it's really just a very secure, cryptographic handshake. We'll break it down into two parts:

- **Part 1: Registration** – Creating the passkey for the first time.
- **Part 2: Authentication** – Using that passkey to sign in later.

Our secret weapon for this is the `simplewebauthn` library, which does a ton of the heavy lifting. We're mainly focused on how our Next.js server actions prepare the data for it and verify the results.

### The Core Idea

At its heart, WebAuthn is a challenge-response protocol.

1.  **Server:** "Hey browser, prove you are who you say you are. Sign this unique, random message (the `challenge`)."
2.  **Browser & Authenticator (Your Phone/Key):** Your device takes the `challenge`, signs it using a secret **private key** that _never leaves your device_, and sends the signature back.
3.  **Server:** The server looks up the **public key** it saved for you during registration, verifies the signature, and says, "Yep, that's you. Welcome aboard."

Let's see it in action.

---

## Part 1: Registration (Creating the Passkey)

This happens on the `/register` page after a user has already signed in with Google or a magic link. We're associating a new, strong credential with their existing account.

### Step 1: The Client Kicks Things Off (`AddPasskeyButton.tsx`)

Our `AddPasskeyButton` component handles the entire client-side flow. The most important part is the `handleAddPasskey` function.

```tsx
// src/components/AddPasskeyButton.tsx

const handleAddPasskey = async () => {
  setIsLoading(true);
  try {
    // 1. Ask our server for the registration rules
    const options = await getRegistrationOptions();

    // 2. Hand these options to the browser's WebAuthn API
    const registrationResponse = await startRegistration({ optionsJSON: options });

    // 3. Send the browser's response back to our server for verification
    await verifyRegistration(registrationResponse);

    // ... handle success
  } // ... handle errors
};
```

This neatly shows the three main steps of the dance from the client's perspective.

### Step 2: The Server Prepares the Challenge (`getRegistrationOptions.ts`)

When `getRegistrationOptions()` is called, this server action prepares the "rules of the game" for the browser.

1.  It checks that the user is actually logged in (by reading the `session`). This is crucial—we need to know _who_ is creating this passkey.
2.  It generates a unique, cryptographically secure `challenge`. This is the one-time secret word for this specific registration attempt.
3.  It saves this `challenge` in the user's session. We'll need to check it in the next step.
4.  It bundles this `challenge` with our application's info (like our `rpID` from `.env.local`) and returns it to the client.

```typescript
// src/actions/passkeys/getRegistrationOptions.ts

export async function getRegistrationOptions() {
  const session = await getSession(); // <-- Make sure user is logged in
  const email = session.email;
  // ...
  const challenge = await generateChallenge(); // <-- Create the secret word
  session.challenge = challenge; // <-- Save it for later
  await session.save();

  const options: GenerateRegistrationOptionsOpts = {
    challenge, // <-- Here's the challenge
    rpName: "Next-Auth Fortress",
    rpID: HOST_SETTINGS.expectedRPID, // <-- From your .env
    userID: user.id.toString(), // <-- Associate with this user
    // ... other options
  };

  return await generateRegistrationOptions(options); // <-- simplewebauthn builds the final package
}
```

### Step 3: The Server Verifies the Result (`verifyRegistration.ts`)

After the user authenticates with their device (e.g., Touch ID), the browser sends the signed response back. This server action is our bouncer at the door, making sure everything is legit.

1.  It retrieves the `challenge` we saved in the session moments ago.
2.  It uses `simplewebauthn/server`'s `verifyRegistrationResponse` to perform a ton of complex checks. Most importantly, it verifies that the `challenge` signed by the device matches the one we sent.
3.  If verification succeeds, it extracts the new credential's **public key** and other metadata.
4.  It saves this public key, a `signCount` (for security), and the `userId` into our `UserCredential` table using a service.

```typescript
// src/actions/passkeys/verifyRegistration.ts

// ...
const { verified, registrationInfo } = await verifyRegistrationResponse({
  response: registrationResponse,
  expectedChallenge: (challengeB64) => { ... }, // <-- Compares against session challenge
  expectedOrigin: HOST_SETTINGS.expectedOrigin,
  expectedRPID: HOST_SETTINGS.expectedRPID,
});

if (!verified || !registrationInfo) {
  throw new Error("Could not be verified.");
}

// ...
const credential = registrationInfo.credential;

// Save the new credential to the database
await createCredential({
  userId: user.id,
  externalId: credential.id,
  publicKey: credential.publicKey as Buffer, // <-- The precious public key
  signCount: credential.counter, // <-- The starting sign count
  // ...
});
```

And that's it! The passkey is now securely stored and associated with the user.

---

## Part 2: Authentication (Using the Passkey)

Now for the easy part. The user returns to our site and wants to sign in.

### Step 1: The Login Button (`LoginWithPasskeyButton.tsx`)

Just like before, it all starts with a simple button click. The flow looks almost identical to the registration button.

```tsx
// src/components/LoginWithPasskeyButton.tsx

async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
  // ...
  // 1. Get login options and a challenge from the server
  const options = await getLoginOptions();

  // 2. Ask the browser to sign the challenge
  const authResponse = await startAuthentication({ optionsJSON: options });

  // 3. Send the signature back to the server for verification
  await verifyLogin(authResponse);

  redirect("/"); // <-- Success! We're in.
}
```

### Step 2: The Server Prepares the Login Challenge (`getLoginOptions.ts`)

This is simpler than the registration version. It doesn't need to know who the user is yet. It just needs to generate a challenge for _someone_ to sign.

```typescript
// src/actions/passkeys/getLoginOptions.ts

export async function getLoginOptions() {
  const challenge = await generateChallenge();
  const session = await getSession();

  session.challenge = challenge; // <-- Save the challenge to the session
  await session.save();

  const authOptions: GenerateAuthenticationOptionsOpts = {
    challenge,
    rpID: HOST_SETTINGS.expectedRPID,
  };

  return await generateAuthenticationOptions(authOptions);
}
```

### Step 3: The Server Verifies the Login (`verifyLogin.ts`)

This is the final checkpoint. The server receives the signed `challenge`.

1.  It looks up the passkey in the database using the `credentialID` sent from the browser. _This tells us which user is attempting to log in._
2.  It retrieves that user's stored **public key** and `signCount`.
3.  It uses `verifyAuthenticationResponse` to check if the signature is valid for the `challenge` we just issued.
4.  It also checks that the `signCount` from the authenticator is higher than the one we have stored. This is a slick security move that prevents "replay attacks."
5.  If all checks pass, it updates the `signCount` in our database, and most importantly, **it calls `setAuth` to create the user's login session.**

```typescript
// src/actions/passkeys/verifyLogin.ts

// ...
const dbCredential = await getCredentialByExternalId({ externalId: authResponse.rawId });
// ...

const verification = await verifyAuthenticationResponse({
  response: authResponse,
  expectedChallenge: (challengeB64) => { ... },
  // ...
  credential: {
    id: ...,
    publicKey: new Uint8Array(dbCredential.publicKey), // <-- The stored public key
    counter: dbCredential.signCount, // <-- The last known sign count
  },
});

// ... If verified ...

await incrementSignCount({ credentialId: dbCredential.id }); // <-- Update sign count

const user = await getUserById({ userId: dbCredential.userId });

await setAuth({ email: user.email, userId: user.id }); // <-- LOG IN!
```

### Conclusion

That's the entire flow. It's a beautiful, secure exchange where the most sensitive secret never leaves your personal device. By breaking it down, you can see it's a logical sequence of asking for, signing, and verifying a unique secret word.

Welcome to the password-less future.
