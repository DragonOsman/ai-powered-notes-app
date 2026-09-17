import SignIn from "@/components/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In"
};

interface SignInProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn callbackUrl={callbackUrl} />
    </div>
  );
}