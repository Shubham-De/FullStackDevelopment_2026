import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";
import { updatePost } from "../../../../utils/posts";

export async function PUT(
  request: Request,
  context: { params: Promise<{ urlId: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { urlId } = await context.params;
  const input = (await request.json()) as {
    title: string;
    category: string;
    description: string;
    content: string;
    imageUrl: string;
    tags: string;
    active?: boolean;
  };

  const post = await updatePost(urlId, input);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post }, { status: 200 });
}
