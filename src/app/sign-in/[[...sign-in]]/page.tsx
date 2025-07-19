import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}
