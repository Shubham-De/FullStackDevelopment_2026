import { type Post, posts } from "./data.js";

function clonePost(post: Post): Post {
  return {
    ...post,
    date: new Date(post.date),
  };
}

// Snapshot the original array once so seed() can restore it any time.
const initialPosts = posts.map((post) => clonePost(post));

export async function seed() {
  posts.length = 0;
  for (const post of initialPosts) {
    posts.push(clonePost(post));
  }
}
