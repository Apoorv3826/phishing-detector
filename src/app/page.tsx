import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UrlCheckerForm from "@/components/UrlCheckerForm";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Stay Safe Online
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Protect yourself from phishing attacks and malicious websites. Our
            advanced scanner analyzes URLs in real-time to keep you secure.
          </p>
        </div>
        <UrlCheckerForm />
      </div>
    </div>
  );
}
