import { getCommentsForPost, createComment } from "@repo/db/comments";
import { NextResponse } from "next/server";

// GET /api/comments?postId=1
// Returns all comments for a post, organized as a tree
export async function GET(request: Request) {
  // Get the postId from the URL query string
  const url = new URL(request.url);
  const postIdText = url.searchParams.get("postId");

  // Make sure postId is a valid number
  if (!postIdText) {
    return NextResponse.json({ message: "postId is required" }, { status: 400 });
  }

  const postId = Number(postIdText);
  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "postId must be a number" }, { status: 400 });
  }

  // Fetch comments from the database
  const comments = await getCommentsForPost(postId);
  return NextResponse.json({ comments }, { status: 200 });
}

// POST /api/comments
// Creates a new comment or reply
// Body: { postId: number, author: string, content: string, parentId?: number }
export async function POST(request: Request) {
  // Parse the request body
  let body: {
    postId?: number;
    author?: string;
    content?: string;
    parentId?: number | null;
  } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  if (typeof body.postId !== "number") {
    return NextResponse.json({ message: "postId is required" }, { status: 400 });
  }

  if (!body.author || body.author.trim().length === 0) {
    return NextResponse.json({ message: "author is required" }, { status: 400 });
  }

  if (!body.content || body.content.trim().length === 0) {
    return NextResponse.json({ message: "content is required" }, { status: 400 });
  }

  // Create the comment in the database
  const comment = await createComment(
    body.postId,
    body.author.trim(),
    body.content.trim(),
    body.parentId ?? null,
  );

  return NextResponse.json({ comment }, { status: 201 });
}
