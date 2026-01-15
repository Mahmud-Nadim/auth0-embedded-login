import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AuthPageClient from "./AuthPageClient";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;

  return <AuthPageClient error={error} />;
}
