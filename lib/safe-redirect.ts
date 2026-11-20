// Turns a "where to go after sign-in" value into a path on THIS site, or the fallback.
// Auth.js sends the return address as a full URL (http://host/meetings/new); a form could also
// send a plain path. Only the path and query are kept, so a value like "https://evil.example/x"
// can never send someone to another website.
export function toSafePath(value: unknown, fallback = "/meetings"): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  try {
    // The base is only used so relative values parse; its host is thrown away.
    const url = new URL(value, "http://placeholder.invalid");
    const path = `${url.pathname}${url.search}`;
    // Never loop back to the login page itself.
    if (url.pathname === "/login") return fallback;
    return path.startsWith("/") ? path : fallback;
  } catch {
    return fallback;
  }
}
