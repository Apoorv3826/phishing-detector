// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Optional: you can control which routes are protected
export const config = {
  matcher: [
    "/", // protect homepage
    "/dashboard(.*)", // protect dashboard and all subroutes
    "/api/phishing/history", // protect API if needed
  ],
};
