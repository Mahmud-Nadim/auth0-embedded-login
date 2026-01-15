"use client";

import { useEffect, useRef } from "react";

interface Auth0LockProps {
  domain: string;
  clientId: string;
}

interface Auth0LockInstance {
  show: () => void;
  hide: () => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    Auth0Lock: new (
      clientId: string,
      domain: string,
      options?: Record<string, unknown>
    ) => Auth0LockInstance;
  }
}

// Carefully crafted CSS that works WITH Auth0 Lock's structure, not against it
const customStyles = `
  /* Base widget reset */
  .auth0-lock.auth0-lock .auth0-lock-widget {
    box-shadow: none !important;
    width: 100% !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-widget-container {
    box-shadow: none !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-cred-pane {
    background: #fff !important;
  }

  /* Header with logo */
  .auth0-lock.auth0-lock .auth0-lock-header {
    height: auto !important;
    padding: 28px 24px 24px !important;
    background: #f8fafc !important;
    border-bottom: 1px solid #e2e8f0 !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-header-bg {
    display: none !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-header-logo {
    height: 48px !important;
    margin: 0 auto !important;
    display: block !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-name {
    display: none !important;
  }

  /* Tabs */
  .auth0-lock.auth0-lock .auth0-lock-tabs-container {
    background: #fff !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-tabs {
    border-bottom: 1px solid #e2e8f0 !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-tabs li a {
    padding: 16px 24px !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    color: #64748b !important;
    border-bottom: 2px solid transparent !important;
    margin-bottom: -1px !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-tabs li.auth0-lock-tabs-current a {
    color: #14b8a6 !important;
    border-bottom-color: #14b8a6 !important;
  }

  /* Content area */
  .auth0-lock.auth0-lock .auth0-lock-content {
    padding: 24px !important;
    background: #fff !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-form {
    padding: 0 !important;
  }

  /* Input wrapper - keep original structure */
  .auth0-lock.auth0-lock .auth0-lock-input-block {
    margin-bottom: 16px !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap {
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    background: #fff !important;
    height: 52px !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap:hover {
    border-color: #cbd5e1 !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap.auth0-lock-focused {
    border-color: #14b8a6 !important;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1) !important;
  }

  /* Icon box - positioned on the left */
  .auth0-lock.auth0-lock .auth0-lock-input-wrap .auth0-lock-icon-box {
    width: 52px !important;
    background: transparent !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap .auth0-lock-icon {
    width: 20px !important;
    height: 20px !important;
    fill: #94a3b8 !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap.auth0-lock-focused .auth0-lock-icon {
    fill: #14b8a6 !important;
  }

  /* Input field - proper padding to avoid icon overlap */
  .auth0-lock.auth0-lock .auth0-lock-input-wrap .auth0-lock-input {
    font-size: 15px !important;
    color: #1e293b !important;
    background: transparent !important;
    padding-left: 52px !important;
    padding-right: 16px !important;
    height: 52px !important;
    line-height: 52px !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-input-wrap .auth0-lock-input::placeholder {
    color: #94a3b8 !important;
    opacity: 1 !important;
  }

  /* Password field needs extra right padding for the show/hide toggle */
  .auth0-lock.auth0-lock .auth0-lock-input-wrap.auth0-lock-input-wrap-with-icon .auth0-lock-input {
    padding-right: 48px !important;
  }

  /* Show password toggle */
  .auth0-lock.auth0-lock .auth0-lock-show-password {
    color: #94a3b8 !important;
    right: 16px !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-show-password:hover {
    color: #64748b !important;
  }

  /* Forgot password link */
  .auth0-lock.auth0-lock .auth0-lock-form .auth0-lock-alternative {
    text-align: center !important;
    padding: 0 !important;
    margin-top: 16px !important;
    background: transparent !important;
    border: none !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-alternative-link {
    color: #14b8a6 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-alternative-link:hover {
    color: #0d9488 !important;
  }

  /* Submit button - properly centered text */
  .auth0-lock.auth0-lock .auth0-lock-submit {
    height: 52px !important;
    border-radius: 8px !important;
    background: #14b8a6 !important;
    margin-top: 24px !important;
    transition: background 0.15s ease !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-submit:hover {
    background: #0d9488 !important;
  }

  /* Center the button text and hide arrow */
  .auth0-lock.auth0-lock .auth0-lock-submit .auth0-label-submit {
    font-size: 15px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-submit .auth0-label-submit svg {
    display: none !important;
  }

  /* Error messages */
  .auth0-lock.auth0-lock .auth0-global-message.auth0-global-message-error {
    border-radius: 8px !important;
    margin: 0 0 16px !important;
    padding: 12px 16px !important;
    background: #fef2f2 !important;
    border: 1px solid #fecaca !important;
  }

  .auth0-lock.auth0-lock .auth0-global-message.auth0-global-message-error span {
    color: #dc2626 !important;
    font-size: 14px !important;
  }

  /* Sign up form */
  .auth0-lock.auth0-lock .auth0-lock-sign-up-terms-agreement {
    margin-top: 16px !important;
    font-size: 13px !important;
    color: #64748b !important;
    text-align: center !important;
  }

  .auth0-lock.auth0-lock .auth0-lock-sign-up-terms-agreement a {
    color: #14b8a6 !important;
  }

  /* Password strength */
  .auth0-lock.auth0-lock .auth0-lock-password-strength {
    margin-top: 8px !important;
    padding: 12px !important;
    border-radius: 6px !important;
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
  }
`;

export default function Auth0LockWidget({ domain, clientId }: Auth0LockProps) {
  const lockRef = useRef<Auth0LockInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Inject custom styles
    const existingStyles = document.getElementById("auth0-lock-custom-styles");
    if (existingStyles) {
      existingStyles.remove();
    }
    const styleSheet = document.createElement("style");
    styleSheet.id = "auth0-lock-custom-styles";
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);

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
          oidcConformant: true,
          auth: {
            redirectUrl: `${window.location.origin}/api/auth/callback`,
            responseType: "code",
            sso: false,
            params: {
              scope: "openid profile email",
            },
          },
          theme: {
            logo: "https://cdn.brandfetch.io/ideueQCapa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1704430328398",
            primaryColor: "#14b8a6",
          },
          languageDictionary: {
            signUpSubmitLabel: "SIGN UP",
            loginSubmitLabel: "SIGN IN",
          },
          allowSignUp: true,
          allowShowPassword: true,
          rememberLastLogin: false,
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
      className="w-full"
    />
  );
}
