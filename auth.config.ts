import type { NextAuthConfig } from "next-auth";

// Pages leaders use to change the schedule. Everything else (the meeting list, the detail
// pages, the print view and the read-only API) stays public.
function isProtectedPath(pathname: string): boolean {
  return pathname === "/meetings/new" || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);
}

// This part of the config is safe for the proxy (no database or password code here).
export const authConfig = {
  pages: {
    signIn: "/login", // use our own login page instead of the Auth.js default
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = Boolean(auth?.user);

      if (isProtectedPath(nextUrl.pathname)) {
        // Page views: false sends the visitor to /login?callbackUrl=<this page>.
        // Form submits (POST) are Server Actions. They check the session themselves (see
        // requireSession in lib/actions.ts) and send the user to /login cleanly, whereas a
        // redirect from here would interrupt the form request.
        return request.method === "GET" ? isLoggedIn : true;
      }

      // A signed-in leader doesn't need the login page.
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/meetings", nextUrl));
      }

      return true;
    },
  },
  providers: [], // the Credentials provider is added in auth.ts
} satisfies NextAuthConfig;
