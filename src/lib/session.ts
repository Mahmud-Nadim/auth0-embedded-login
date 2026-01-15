import { cookies } from "next/headers";
import * as jose from "jose";

const AUTH0_SECRET = process.env.AUTH0_SECRET || "your-secret-key-at-least-32-chars";
const COOKIE_NAME = "auth_session";

export interface UserSession {
  sub: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

const getSecretKey = () => {
  return new TextEncoder().encode(AUTH0_SECRET);
};

export async function createSession(userData: UserSession): Promise<string> {
  const jwt = await new jose.SignJWT({ ...userData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());

  return jwt;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify(sessionCookie.value, getSecretKey());
    return payload as unknown as UserSession;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function setSessionCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
