import { getPostById, getPostByUrlId, toggleLikeForPostByIp } from "@repo/db/posts";
import { NextResponse } from "next/server";

type LikeRequestBody = {
  postId?: number;
  urlId?: string;
};

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

async function findPost(body: LikeRequestBody) {
  if (typeof body.postId === "number") {
    return getPostById(body.postId);
  }

  if (typeof body.urlId === "string" && body.urlId.trim()) {
    return getPostByUrlId(body.urlId.trim());
  }

  return null;
}

export async function POST(request: Request) {
  let body: LikeRequestBody = {};

  try {
    body = (await request.json()) as LikeRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const post = await findPost(body);
  if (!post || !post.active) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const userIP = getClientIp(request);
  const result = await toggleLikeForPostByIp(post.id, userIP);
  if (!result) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      likes: result.post.likes,
      liked: result.liked,
    },
    { status: 200 },
  );
}
