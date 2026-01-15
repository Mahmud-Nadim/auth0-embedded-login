"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Auth0LockWidget = dynamic(
  () => import("@/components/Auth0LockWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-teal-500 animate-spin"></div>
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
    <div className="h-screen w-screen overflow-hidden flex bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:block lg:w-[420px] xl:w-[480px] 2xl:w-[520px] flex-shrink-0 bg-navy-900 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-coral-500/15 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative h-full flex flex-col p-8 xl:p-10">
          {/* Logo */}
          <div className="bg-white rounded-lg px-4 py-2.5 inline-flex self-start shadow-lg">
            <Image
              src="https://cdn.brandfetch.io/ideueQCapa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1704430328398"
              alt="Pro Carrier"
              width={140}
              height={36}
              className="h-7 w-auto"
              unoptimized
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Streamline Your
              <span className="block text-teal-400">Shipment Management</span>
            </h1>
            <p className="text-navy-300 text-base leading-relaxed max-w-sm mb-8">
              Track shipments, manage freight spend, and monitor carbon emissions in one dashboard.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: "check", label: "Real-time tracking", desc: "Monitor 24/7", color: "teal" },
                { icon: "chart", label: "Analytics", desc: "Detailed insights", color: "coral" },
                { icon: "globe", label: "Carbon monitoring", desc: "Track impact", color: "teal" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    feature.color === "teal" ? "bg-teal-500" : "bg-coral-500"
                  }`}>
                    {feature.icon === "check" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {feature.icon === "chart" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {feature.icon === "globe" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.label}</p>
                    <p className="text-navy-400 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-navy-500">
            <span>&copy; {new Date().getFullYear()} Pro Carrier</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-navy-900 px-4 py-3 flex-shrink-0">
          <div className="bg-white rounded-md px-3 py-1.5 inline-flex">
            <Image
              src="https://cdn.brandfetch.io/ideueQCapa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1704430328398"
              alt="Pro Carrier"
              width={100}
              height={24}
              className="h-5 w-auto"
              unoptimized
            />
          </div>
        </div>

        {/* Auth Content - Centered */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-[440px]">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{decodeURIComponent(error)}</p>
              </div>
            )}

            {/* Auth Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {domain && clientId ? (
                <Auth0LockWidget domain={domain} clientId={clientId} />
              ) : (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">Configuration Required</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Add Auth0 credentials to your .env file
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured with enterprise encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
