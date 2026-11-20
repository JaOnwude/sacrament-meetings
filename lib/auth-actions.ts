"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { toSafePath } from "./safe-redirect";

const LoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

// Used with useActionState: returns an error message, or nothing when sign-in succeeds
// (signIn() then redirects).
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return "Enter a valid email address and your password.";
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: toSafePath(formData.get("redirectTo")), // only a path on this site, never another host
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin"
        ? "Invalid email or password."
        : "Something went wrong. Please try again.";
    }
    throw error; // signIn() redirects by throwing; Next.js must see that
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
