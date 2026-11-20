import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// In Next.js 16 the old middleware.ts file is renamed proxy.ts. It runs before each page and
// uses the `authorized` callback in auth.config.ts to redirect visitors who aren't signed in.
export default NextAuth(authConfig).auth;

export const config = {
  // Skip API routes, Next.js internals and PNG files (images, icons).
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
