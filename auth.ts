import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "@/lib/users";

const CredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

// When the email isn't found we still run one bcrypt comparison, so a wrong email and a
// wrong password take about the same time (this makes it harder to discover which emails exist).
let dummyHash: string | undefined;
function getDummyHash(): string {
  dummyHash ??= bcrypt.hashSync("not-a-real-password", 10);
  return dummyHash;
}

// The configuration is a function, so Auth.js is set up when a request arrives instead of when
// this file is first imported (Next.js doesn't allow random values to be generated while it
// pre-builds pages).
export const { auth, signIn, signOut, handlers } = NextAuth(() => ({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);
        if (!user) {
          await bcrypt.compare(password, getDummyHash());
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        // Only these fields go into the session. The hash never leaves the server.
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
}));
