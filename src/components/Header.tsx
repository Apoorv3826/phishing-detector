"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react"; // optional icon lib

export default function Header() {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800">
      <Link href="/" className="text-xl font-bold">
        Phishing Detector
      </Link>

      {isSignedIn && (
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          {/* 🌙 Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <UserButton afterSignOutUrl="/" />
        </div>
      )}

      {!isSignedIn && (
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="hover:underline">
            Sign In
          </Link>
          <Link href="/sign-up" className="hover:underline">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
