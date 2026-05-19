import type { Prisma } from "@prisma/client";
import type { Post } from "./data.js";
import { client } from "./client.js";

export type EditablePostInput = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  active?: boolean;
};

type PrismaPostWithLikeCount = Prisma.PostGetPayload<{
  include: { _count: { select: { Likes: true } } };
}>;

function toAppPost(post: PrismaPostWithLikeCount): Post {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    tags: post.tags,
    active: post.active,
    likes: post._count.Likes,
  };
}

function normalizeTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .join(",");
}

function toSlug(text: string) {
  const lowerCaseText = text.toLowerCase();
  const withHyphens = lowerCaseText.replace(/[^a-z0-9]/g, "-");
  const withSingleHyphens = withHyphens.replace(/-+/g, "-");
  const withoutLeadingHyphens = withSingleHyphens.replace(/^-+/, "");
  return withoutLeadingHyphens.replace(/-+$/, "");
}

async function createUniqueUrlId(title: string) {
  const baseUrlId = toSlug(title) || "new-post";
  let nextUrlId = baseUrlId;
  let suffix = 2;

  // Keep incrementing suffix until we find a free slug.
  while (await client.db.post.findUnique({ where: { urlId: nextUrlId } })) {
    nextUrlId = `${baseUrlId}-${suffix}`;
    suffix += 1;
  }

  return nextUrlId;
}

export async function getAllPostsFromDb() {
  const posts = await client.db.post.findMany({
    include: { _count: { select: { Likes: true } } },
    orderBy: { date: "desc" },
  });

  return posts.map((post) => toAppPost(post));
}

export async function getActivePostsFromDb() {
  const posts = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { Likes: true } } },
    orderBy: { date: "desc" },
  });

  return posts.map((post) => toAppPost(post));
}

export async function getPostByUrlId(urlId: string) {
  const post = await client.db.post.findUnique({
    where: { urlId },
    include: { _count: { select: { Likes: true } } },
  });

  if (!post) {
    return null;
  }

  return toAppPost(post);
}

export async function getPostById(postId: number) {
  const post = await client.db.post.findUnique({
    where: { id: postId },
    include: { _count: { select: { Likes: true } } },
  });

  if (!post) {
    return null;
  }

  return toAppPost(post);
}

export async function incrementPostViews(urlId: string, activeOnly = true) {
  const existingPost = await client.db.post.findUnique({
    where: { urlId },
    select: { active: true },
  });

  if (!existingPost) {
    return null;
  }

  if (activeOnly && !existingPost.active) {
    return null;
  }

  const updatedPost = await client.db.post.update({
    where: { urlId },
    data: {
      views: { increment: 1 },
    },
    include: { _count: { select: { Likes: true } } },
  });

  return toAppPost(updatedPost);
}

export async function createPostInDb(input: EditablePostInput) {
  const urlId = await createUniqueUrlId(input.title);
  const createdPost = await client.db.post.create({
    data: {
      title: input.title.trim(),
      urlId,
      category: input.category.trim() || "General",
      description: input.description.trim(),
      content: input.content,
      imageUrl: input.imageUrl.trim(),
      tags: normalizeTags(input.tags),
      active: input.active ?? true,
    },
    include: { _count: { select: { Likes: true } } },
  });

  return toAppPost(createdPost);
}

export async function updatePostInDb(urlId: string, input: EditablePostInput) {
  const existingPost = await client.db.post.findUnique({ where: { urlId } });
  if (!existingPost) {
    return null;
  }

  const updatedPost = await client.db.post.update({
    where: { urlId },
    data: {
      title: input.title.trim(),
      category: input.category.trim() || existingPost.category,
      description: input.description.trim(),
      content: input.content,
      imageUrl: input.imageUrl.trim(),
      tags: normalizeTags(input.tags),
      active: input.active ?? existingPost.active,
    },
    include: { _count: { select: { Likes: true } } },
  });

  return toAppPost(updatedPost);
}

export async function togglePostActiveInDb(urlId: string) {
  const existingPost = await client.db.post.findUnique({
    where: { urlId },
    select: { active: true },
  });
  if (!existingPost) {
    return null;
  }

  const updatedPost = await client.db.post.update({
    where: { urlId },
    data: { active: !existingPost.active },
    include: { _count: { select: { Likes: true } } },
  });

  return toAppPost(updatedPost);
}

export async function toggleLikeForPostByIp(postId: number, userIP: string) {
  const likeKey = {
    postId_userIP: {
      postId,
      userIP,
    },
  };
  const existingLike = await client.db.like.findUnique({
    where: likeKey,
  });

  if (existingLike) {
    await client.db.like.delete({ where: likeKey });
  } else {
    await client.db.like.create({
      data: {
        postId,
        userIP,
      },
    });
  }

  const post = await client.db.post.findUnique({
    where: { id: postId },
    include: { _count: { select: { Likes: true } } },
  });
  if (!post) {
    return null;
  }

  return {
    liked: !existingLike,
    post: toAppPost(post),
  };
}
