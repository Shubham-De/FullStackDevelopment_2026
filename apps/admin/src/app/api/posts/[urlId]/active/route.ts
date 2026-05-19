import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../../utils/auth";
import { togglePostActive } from "../../../../../utils/posts";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ urlId: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { urlId } = await context.params;
  const post = await togglePostActive(urlId);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post }, { status: 200 });
}
