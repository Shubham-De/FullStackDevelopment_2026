import { type Post, posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export type AdminPost = Omit<Post, "date"> & { date: string };

export type EditablePostInput = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  active?: boolean;
};

function normalizeTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .join(",");
}

function toAdminPost(post: Post): AdminPost {
  return {
    ...post,
    // We pass ISO strings to client components to keep serialization simple.
    date: post.date.toISOString(),
  };
}

function buildUniqueUrlId(title: string) {
  const baseUrlId = toUrlPath(title) || "new-post";
  let nextUrlId = baseUrlId;
  let suffix = 2;

  while (posts.some((post) => post.urlId === nextUrlId)) {
    nextUrlId = `${baseUrlId}-${suffix}`;
    suffix += 1;
  }

  return nextUrlId;
}

export function listPostsForAdmin() {
  return posts.map((post) => toAdminPost(post));
}

export function findAdminPostByUrlId(urlId: string) {
  const post = posts.find((item) => item.urlId === urlId);
  if (!post) {
    return null;
  }

  return toAdminPost(post);
}

export function createPost(input: EditablePostInput) {
  const nextId = posts.reduce((maxId, post) => Math.max(maxId, post.id), 0) + 1;
  const urlId = buildUniqueUrlId(input.title);

  const newPost: Post = {
    id: nextId,
    urlId,
    title: input.title.trim(),
    category: input.category.trim() || "General",
    description: input.description.trim(),
    content: input.content,
    imageUrl: input.imageUrl.trim(),
    tags: normalizeTags(input.tags),
    active: input.active ?? true,
    date: new Date(),
    likes: 0,
    views: 0,
  };

  // Add to the top so latest post appears first in date-desc sort.
  posts.unshift(newPost);
  return toAdminPost(newPost);
}

export function updatePost(urlId: string, input: EditablePostInput) {
  const post = posts.find((item) => item.urlId === urlId);
  if (!post) {
    return null;
  }

  post.title = input.title.trim();
  post.category = input.category.trim() || post.category;
  post.description = input.description.trim();
  post.content = input.content;
  post.imageUrl = input.imageUrl.trim();
  post.tags = normalizeTags(input.tags);
  post.active = input.active ?? post.active;

  return toAdminPost(post);
}

export function togglePostActive(urlId: string) {
  const post = posts.find((item) => item.urlId === urlId);
  if (!post) {
    return null;
  }

  post.active = !post.active;
  return toAdminPost(post);
}
