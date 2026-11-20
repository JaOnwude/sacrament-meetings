// Prints the SQL to create a leader account, with the password stored as a bcrypt hash.
// Nothing is written to the database and nothing is saved to disk. You paste the printed
// INSERT into the Neon query editor yourself.
//
// Usage:  node db/make-user-sql.mjs you@example.com "Your Name"
// It then asks for the password (typed characters are hidden). Choose a long, unique password
// that you don't use anywhere else, and never put it in code or send it to anyone.
import bcrypt from "bcryptjs";

const [email, name] = process.argv.slice(2);
if (!email || !name || !email.includes("@")) {
  console.error('Usage: node db/make-user-sql.mjs you@example.com "Your Name"');
  process.exit(1);
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error("Run this in a normal terminal so the password can be typed hidden."));
      return;
    }
    process.stdout.write(question);
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") { // Ctrl+C
          process.stdout.write("\n");
          process.exit(130);
        } else if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(value);
          return;
        } else if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else {
          value += char;
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

// Normal use: type the password when asked (hidden). For automation you can instead set the
// NEW_USER_PASSWORD environment variable for that one command, but then the password can end up
// in your shell history, so prefer typing it.
const fromEnv = process.env.NEW_USER_PASSWORD;
const password = fromEnv ?? (await askHidden("Password (at least 10 characters, hidden): "));
if (fromEnv === undefined) {
  const again = await askHidden("Type it again: ");
  if (password !== again) {
    console.error("The two passwords did not match. Nothing was created.");
    process.exit(1);
  }
}
if (password.length < 10) {
  console.error("Use at least 10 characters. Nothing was created.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const q = (text) => "'" + text.replace(/'/g, "''") + "'";

console.log("\n-- Paste this into the Neon query editor and run it once:\n");
console.log(
  `INSERT INTO users (email, name, password_hash)\nVALUES (${q(email.trim().toLowerCase())}, ${q(name.trim())}, ${q(hash)});`,
);
console.log("\n-- (The hash is not the password and cannot be reversed to it.)");
