import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";
import { createPost } from "../../../utils/posts";

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const input = (await request.json()) as {
    title: string;
    category: string;
    description: string;
    content: string;
    imageUrl: string;
    tags: string;
    active?: boolean;
  };

  const post = await createPost(input);
  return NextResponse.json({ post }, { status: 201 });
}
