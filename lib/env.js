export function validateEnv() {
  const required = ["NEXTAUTH_URL", "NEXTAUTH_SECRET"];
  required.forEach((env) => {
    if (!process.env[env]) {
      throw new Error("Missing required env variable: " + env);
    }
  });
}
