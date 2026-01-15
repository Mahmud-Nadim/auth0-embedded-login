# Next.js Auth0 Embedded Login

A Next.js 15 application with Auth0 embedded login using the Auth0 Lock widget.

## Features

- **Embedded Login**: Auth0 Lock widget embedded directly in your application (no redirect to Auth0 hosted page)
- **Session Management**: Secure JWT-based session using HTTP-only cookies
- **Protected Dashboard**: User dashboard showing profile information after login
- **TypeScript**: Full TypeScript support
- **Tailwind CSS**: Modern styling with dark mode support

## Prerequisites

1. An Auth0 account (free tier available at [auth0.com](https://auth0.com))
2. Node.js 18+ installed

## Auth0 Setup

### 1. Create an Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **+ Create Application**
4. Choose **Regular Web Applications**
5. Give it a name (e.g., "Next.js Embedded Login")

### 2. Configure Application Settings

In your Auth0 application settings, configure:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000/auth
```

**Allowed Web Origins (REQUIRED for embedded login):**
```
http://localhost:3000
```

**Allowed Origins (CORS):**
```
http://localhost:3000
```

### 3. Enable Cross-Origin Authentication

For embedded login to work, you need to enable Cross-Origin Authentication:

1. Go to **Settings** → **Advanced Settings** → **OAuth**
2. Ensure **OIDC Conformant** is enabled
3. Set **JsonWebToken Signature Algorithm** to **RS256**

### 4. Get Your Credentials

From your application settings, copy:
- **Domain** (e.g., `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret**

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.local.example` to `.env.local` and fill in your Auth0 credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_SECRET=generate-a-random-32-char-string-here

   APP_BASE_URL=http://localhost:3000

   NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
   ```

   > **Tip:** Generate `AUTH0_SECRET` using: `openssl rand -hex 32`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
auth0-embedded-login/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── callback/route.ts  # Auth0 callback handler
│   │   │       └── logout/route.ts    # Logout handler
│   │   ├── auth/
│   │   │   ├── page.tsx               # Login page (server component)
│   │   │   └── AuthPageClient.tsx     # Login page (client component)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Protected dashboard
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Redirects to /auth
│   ├── components/
│   │   └── Auth0LockWidget.tsx        # Auth0 Lock component
│   ├── lib/
│   │   └── session.ts                 # Session management
│   └── types/
│       └── auth0-lock.d.ts            # TypeScript definitions
├── .env.local.example                 # Environment variables template
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## How It Works

### Authentication Flow

1. User visits `/auth` → Auth0 Lock widget is displayed
2. User enters credentials → Lock sends them directly to Auth0
3. Auth0 authenticates and redirects to `/api/auth/callback` with authorization code
4. Callback handler exchanges code for tokens
5. Session is created and stored in HTTP-only cookie
6. User is redirected to `/dashboard`

### Session Management

- Sessions are JWT tokens stored in HTTP-only cookies
- Tokens are signed with `AUTH0_SECRET`
- Sessions expire after 24 hours
- Protected routes check for valid session server-side

## Customization

### Lock Widget Options

Edit `src/components/Auth0LockWidget.tsx` to customize the Lock widget:

```typescript
const lockOptions = {
  theme: {
    primaryColor: "#3b82f6",        // Primary color
    logo: "https://your-logo.png",  // Your logo
  },
  languageDictionary: {
    title: "Your App Name",
    signUpTitle: "Create Account",
  },
  allowSignUp: true,                // Enable/disable sign up
  allowShowPassword: true,          // Show password toggle
  rememberLastLogin: true,          // Remember last login
};
```

### Adding Social Connections

1. Go to Auth0 Dashboard → **Authentication** → **Social**
2. Enable desired providers (Google, GitHub, etc.)
3. Enable them for your application
4. Lock widget will automatically show them

## Troubleshooting

### "Login required" or callback errors
- Verify **Allowed Callback URLs** includes your callback URL
- Verify **Allowed Web Origins** includes your domain

### Lock widget not showing
- Check browser console for errors
- Verify `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID` are set
- Ensure the Auth0 Lock script is loading (check Network tab)

### CORS errors
- Ensure **Allowed Web Origins** is set in Auth0 dashboard
- Enable Cross-Origin Authentication in Auth0 settings

## License

MIT
