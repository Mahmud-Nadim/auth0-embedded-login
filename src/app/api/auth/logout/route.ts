import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

export async function GET() {
  await clearSession();

  const logoutUrl = new URL(`https://${AUTH0_DOMAIN}/v2/logout`);
  logoutUrl.searchParams.set("client_id", AUTH0_CLIENT_ID || "");
  logoutUrl.searchParams.set("returnTo", APP_BASE_URL);

  return NextResponse.redirect(logoutUrl.toString());
}
