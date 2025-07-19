import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider"; // ✅ ADD THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phishing Detector",
  description: "Check suspicious URLs for phishing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} bg-gray-100 dark:bg-black text-gray-900 dark:text-white`}
        >
          <ThemeProvider>
            {" "}
            {/* ✅ WRAP THIS */}
            <Header />
            <main className="p-4">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
