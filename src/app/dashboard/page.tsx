import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.picture && (
                  <Image
                    src={session.picture}
                    alt={session.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {session.name || session.email}
                </span>
              </div>
              <Link
                href="/api/auth/logout"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 mb-4">
              {session.picture ? (
                <Image
                  src={session.picture}
                  alt={session.name || "User"}
                  width={96}
                  height={96}
                  className="rounded-full ring-4 ring-blue-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {(session.name || session.email)?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome back, {session.name || "User"}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You have successfully logged in using Auth0 embedded login.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Your Profile Information
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {session.name || "Not provided"}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {session.email || "Not provided"}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  User ID (sub)
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-mono text-sm break-all">
                  {session.sub}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Session
            </Link>
            <Link
              href="/api/auth/logout"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
