import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";
import { createPost } from "../../../utils/posts";

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  let input: {
    title: string;
    category: string;
    description: string;
    content: string;
    imageUrl: string;
    tags: string;
    active?: boolean;
  };

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const post = await createPost(input);
  return NextResponse.json({ post }, { status: 201 });
}
