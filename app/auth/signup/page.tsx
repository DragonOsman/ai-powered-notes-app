import SignUp from "@/components/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up"
};

interface SignUpProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp callbackUrl={callbackUrl} />
    </div>
  );
}