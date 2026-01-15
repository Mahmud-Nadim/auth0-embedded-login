"use client";

import { useEffect, useRef } from "react";

interface Auth0LockProps {
  domain: string;
  clientId: string;
}

declare global {
  interface Window {
    Auth0Lock: new (
      clientId: string,
      domain: string,
      options?: Record<string, unknown>
    ) => {
      show: () => void;
      hide: () => void;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export default function Auth0LockWidget({ domain, clientId }: Auth0LockProps) {
  const lockRef = useRef<ReturnType<typeof window.Auth0Lock> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://cdn.auth0.com/js/lock/14.2.2/lock.min.js";
    script.async = true;

    script.onload = () => {
      if (typeof window.Auth0Lock !== "undefined") {
        const lockOptions = {
          container: "lock-container",
          autoclose: true,
          closable: false,
          auth: {
            redirectUrl: `${window.location.origin}/api/auth/callback`,
            responseType: "code",
            params: {
              scope: "openid profile email",
            },
          },
          theme: {
            primaryColor: "#3b82f6",
          },
          languageDictionary: {
            title: "Welcome",
            signUpTitle: "Create Account",
          },
          allowSignUp: true,
          allowShowPassword: true,
          rememberLastLogin: true,
        };

        lockRef.current = new window.Auth0Lock(clientId, domain, lockOptions);
        lockRef.current.show();

        lockRef.current.on("authenticated", (authResult: unknown) => {
          console.log("Authentication successful:", authResult);
        });

        lockRef.current.on("authorization_error", (error: unknown) => {
          console.error("Authorization error:", error);
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (lockRef.current) {
        lockRef.current.hide();
      }
    };
  }, [domain, clientId]);

  return (
    <div
      id="lock-container"
      ref={containerRef}
      className="w-full max-w-md mx-auto"
      style={{ minHeight: "500px" }}
    />
  );
}
