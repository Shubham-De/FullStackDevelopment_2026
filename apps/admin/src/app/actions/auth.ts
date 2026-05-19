"use server";

import { redirect } from "next/navigation";
import { signInWithPassword, signOut } from "../../utils/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const isSuccess = await signInWithPassword(password);

  if (isSuccess) {
    redirect(redirectTo || "/");
  }

  redirect("/?error=invalid");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}
