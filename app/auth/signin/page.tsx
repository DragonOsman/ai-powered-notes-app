import SignIn from "@/components/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In"
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn />
    </div>
  );
}