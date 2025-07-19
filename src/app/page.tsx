import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UrlCheckerForm from "@/components/UrlCheckerForm";

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-xl p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
        <UrlCheckerForm />
      </div>
    </main>
  );
}
