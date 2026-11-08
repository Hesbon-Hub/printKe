# Odeon Print — Next.js starter

A responsive storefront foundation for https://shop.odeondigital.co.ke.

## Requirements
- Node.js 20.9 or newer (use the current LTS supported by your host)
- npm

## Run locally on Windows
1. Extract this folder.
2. Open the folder in VS Code.
3. Open Terminal in VS Code.
4. Run:

```bash
npm install
npm run dev
```

5. Visit http://localhost:3000.

## Build check

```bash
npm run build
```

## Supabase authentication

The `/login` page uses Supabase Auth for email or phone/password sign-in, email or SMS one-time codes, account registration and password recovery.

1. In Supabase, enable the Email and Phone providers under **Authentication → Sign In / Providers**. Configure an SMS provider before using phone OTP or phone registration.
2. Add the local environment values from `.env.example` to `.env.local` using your Supabase project URL and publishable/anon key. Do not use the `service_role` key in a browser environment.
3. Add the local and deployed `/login` URLs to the Supabase project's allowed redirect URLs so password recovery can return to the app.
4. Restart the Next.js server after setting environment variables.

Successful sign-in currently returns to the storefront. Add a protected account area before exposing private order or profile data.

## Important
- This is Stage 1: responsive storefront shell and category navigation.
- Category links are placeholders until Stage 2 product listing pages are implemented.
- Authentication requires Supabase project configuration as described above. Checkout, order storage and payment integration are not active yet.
- Existing live website files are not included or changed.
- Do not upload this as a replacement for the current website until deployment support is confirmed and the build has been tested.

## Deployment note
HostPinnacle publicly lists Node.js support on its shared hosting plans, but the exact cPanel account must be checked for a Node.js application setup tool and a compatible runtime. Ask support to confirm Next.js production deployment, Node.js version, Passenger configuration, memory limits, environment variables and whether `next start` is supported. A standard cPanel static-file upload is not sufficient for a server-rendered Next.js application.
