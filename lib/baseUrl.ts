export function baseUrl() {
  if (typeof window !== "undefined") return "";
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (env) return env.startsWith("http") ? env : `https://${env}`;
  return "http://localhost:3000";
}
