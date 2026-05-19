// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  const tagCounter: Record<string, number> = {};

  for (const post of posts) {
    if (!post.active) {
      continue;
    }

    const postTags = post.tags.split(",");
    for (const rawTag of postTags) {
      const tag = rawTag.trim();
      if (!tag) {
        continue;
      }

      if (!tagCounter[tag]) {
        tagCounter[tag] = 0;
      }
      tagCounter[tag] += 1;
    }
  }

  const sortedTagNames = Object.keys(tagCounter).sort((a, b) =>
    a.localeCompare(b),
  );

  const result: { name: string; count: number }[] = [];
  for (const tagName of sortedTagNames) {
    result.push({
      name: tagName,
      count: tagCounter[tagName] ?? 0,
    });
  }

  return result;
}
