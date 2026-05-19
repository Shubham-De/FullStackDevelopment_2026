import type { Post } from "@repo/db/data";
import {
  createPostInDb,
  getAllPostsFromDb,
  getPostByUrlId,
  togglePostActiveInDb,
  updatePostInDb,
  type EditablePostInput as DbEditablePostInput,
} from "@repo/db/posts";

export type AdminPost = Omit<Post, "date"> & { date: string };
export type EditablePostInput = DbEditablePostInput;

function toAdminPost(post: Post): AdminPost {
  return {
    ...post,
    // We pass ISO strings to client components to keep serialization simple.
    date: post.date.toISOString(),
  };
}

export async function listPostsForAdmin() {
  const posts = await getAllPostsFromDb();
  return posts.map((post) => toAdminPost(post));
}

export async function findAdminPostByUrlId(urlId: string) {
  const post = await getPostByUrlId(urlId);
  if (!post) {
    return null;
  }

  return toAdminPost(post);
}

export async function createPost(input: EditablePostInput) {
  const post = await createPostInDb(input);
  return toAdminPost(post);
}

export async function updatePost(urlId: string, input: EditablePostInput) {
  const post = await updatePostInDb(urlId, input);
  if (!post) {
    return null;
  }

  return toAdminPost(post);
}

export async function togglePostActive(urlId: string) {
  const post = await togglePostActiveInDb(urlId);
  if (!post) {
    return null;
  }

  return toAdminPost(post);
}
