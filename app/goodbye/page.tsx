import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goodbye",
  description: "Your account has been deleted. We're sorry to see you go!"
}

export default function GoodbyePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Goodbye!
        </h1>
        <p className="text-gray-700">
          Your account has been successfully deleted. We're sorry to see you go!
        </p>
      </div>
    </div>
  );
}