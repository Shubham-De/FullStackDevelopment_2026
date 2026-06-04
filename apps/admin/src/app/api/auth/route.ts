import { env } from "@repo/env/admin";
import { NextResponse } from "next/server";
import { setAuthCookie, signOut } from "../../../utils/auth";

 //Checks if the request is sending JSON or a form
function isJsonRequest(request: Request) {                   
  const contentType = request.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

export async function POST(request: Request) {
  const jsonRequest = isJsonRequest(request);

  let password = "";
  let redirectTo = "/";

  if (jsonRequest) {
    const body = (await request.json()) as {
      password?: string;
      redirectTo?: string;
    };
    password = String(body.password ?? "");
    redirectTo = String(body.redirectTo ?? "/");
  } else {
    const formData = await request.formData();
    password = String(formData.get("password") ?? "");
    redirectTo = String(formData.get("redirectTo") ?? "/");
  }

  if (password !== env.PASSWORD) {
    if (jsonRequest) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/?error=invalid", request.url));
  }

  await setAuthCookie();

  if (jsonRequest) {
    return NextResponse.json({ message: "Authenticated" }, { status: 200 });
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

export async function DELETE() {
  await signOut();
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
