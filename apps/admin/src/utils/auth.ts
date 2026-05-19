import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRATION = "7d";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const token = userCookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, env.JWT_SECRET || "");
    return true;
  } catch {
    return false;
  }
}

export async function setAuthCookie() {

  const userCookies = await cookies();
  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET || "", {
    expiresIn: TOKEN_EXPIRATION,
  });

  userCookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
  });
}

export async function signOut() {
  const userCookies = await cookies();
  userCookies.delete(AUTH_COOKIE_NAME);
}
