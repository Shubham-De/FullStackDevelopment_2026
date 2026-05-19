"use server";
import { env } from "@repo/env/admin";

import { redirect } from "next/navigation";
import { setAuthCookie, signOut } from "../../utils/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const isSuccess = password === env.PASSWORD;

  if (isSuccess) {
    await setAuthCookie();
    redirect(redirectTo || "/");
  }

  redirect("/?error=invalid");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}
