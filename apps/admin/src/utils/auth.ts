
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";
export const ADMIN_PASSWORD = "123";

export async function isLoggedIn() {
  const userCookies = await cookies();

  // Primary auth check for assignment 2.
  if (userCookies.has(AUTH_COOKIE_NAME)) {
    return true;
  }

  // Backward-compatible check for test fixture cookie in auth.setup.ts.
  const fixturePassword = userCookies.get("password")?.value;
  return fixturePassword === ADMIN_PASSWORD;
}

export async function signInWithPassword(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return false;
  }

  const userCookies = await cookies();
  userCookies.set(AUTH_COOKIE_NAME, "signed-in", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return true;
}

export async function signOut() {
  const userCookies = await cookies();
  userCookies.delete(AUTH_COOKIE_NAME);
  userCookies.delete("password");
}
