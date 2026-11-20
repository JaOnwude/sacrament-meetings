import { getSql } from "./db";

// A user as stored in the database. passwordHash is a bcrypt hash, never the password.
export interface UserRecord {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
}

// Looks a user up by email, ignoring upper/lower case. The email is a query parameter.
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, name, password_hash AS "passwordHash"
    FROM users
    WHERE lower(email) = lower(${email})
  `;
  const row = rows[0] as unknown as UserRecord | undefined;
  return row ? { ...row, id: Number(row.id) } : null;
}
