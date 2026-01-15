declare module "auth0-lock" {
  export interface Auth0LockConstructorOptions {
    container?: string;
    autoclose?: boolean;
    closable?: boolean;
    auth?: {
      redirectUrl?: string;
      responseType?: string;
      params?: {
        scope?: string;
        audience?: string;
      };
    };
    theme?: {
      primaryColor?: string;
      logo?: string;
    };
    languageDictionary?: {
      title?: string;
      signUpTitle?: string;
    };
    allowSignUp?: boolean;
    allowShowPassword?: boolean;
    rememberLastLogin?: boolean;
    [key: string]: unknown;
  }

  export interface AuthResult {
    accessToken: string;
    idToken: string;
    idTokenPayload: {
      sub: string;
      email?: string;
      name?: string;
      nickname?: string;
      picture?: string;
      [key: string]: unknown;
    };
    expiresIn: number;
    state?: string;
  }

  export interface Auth0Error {
    error: string;
    errorDescription: string;
  }

  export class Auth0Lock {
    constructor(
      clientId: string,
      domain: string,
      options?: Auth0LockConstructorOptions
    );
    show(): void;
    hide(): void;
    on(event: "authenticated", callback: (authResult: AuthResult) => void): void;
    on(event: "authorization_error", callback: (error: Auth0Error) => void): void;
    on(event: "unrecoverable_error", callback: (error: Auth0Error) => void): void;
    on(event: "hide", callback: () => void): void;
    on(event: "show", callback: () => void): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    getUserInfo(
      accessToken: string,
      callback: (error: Error | null, profile: Record<string, unknown>) => void
    ): void;
    logout(options?: { returnTo?: string }): void;
  }

  export default Auth0Lock;
}
