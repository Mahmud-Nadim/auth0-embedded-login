"use client";

import dynamic from "next/dynamic";

const Auth0LockWidget = dynamic(
  () => import("@/components/Auth0LockWidget"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

interface AuthPageClientProps {
  error?: string;
}

export default function AuthPageClient({ error }: AuthPageClientProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "";
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Sign In to Your Account
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Use the form below to sign in or create a new account
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm text-center">
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {domain && clientId ? (
            <Auth0LockWidget domain={domain} clientId={clientId} />
          ) : (
            <div className="p-8 text-center">
              <p className="text-red-500">
                Missing Auth0 configuration. Please check your environment variables.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Required: NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
