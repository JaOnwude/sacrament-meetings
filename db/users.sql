-- Run in Vercel > Storage > your database > Query (Neon).
-- One row per leader who may sign in. Passwords are NEVER stored: only a bcrypt hash.
-- Create the account with:  node db/make-user-sql.mjs  (it prints the INSERT for you to paste).

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL        PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  name          VARCHAR(255)  NOT NULL,
  password_hash TEXT          NOT NULL
);
