import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie, UserSession } from "@/lib/session";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("Auth0 error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(errorDescription || error)}`, APP_BASE_URL)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=No+authorization+code", APP_BASE_URL));
  }

  try {
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${APP_BASE_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(errorData.error_description || "Token exchange failed")}`, APP_BASE_URL)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, id_token, expires_in } = tokens;

    const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info");
      return NextResponse.redirect(new URL("/auth?error=Failed+to+fetch+user+info", APP_BASE_URL));
    }

    const userInfo = await userInfoResponse.json();

    const sessionData: UserSession = {
      sub: userInfo.sub,
      email: userInfo.email || "",
      name: userInfo.name || userInfo.nickname || "",
      picture: userInfo.picture || "",
      accessToken: access_token,
      idToken: id_token,
      expiresAt: Date.now() + expires_in * 1000,
    };

    const sessionJwt = await createSession(sessionData);
    await setSessionCookie(sessionJwt);

    return NextResponse.redirect(new URL("/dashboard", APP_BASE_URL));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent("Authentication failed")}`, APP_BASE_URL)
    );
  }
}
