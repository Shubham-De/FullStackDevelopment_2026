import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  const db = client.db;

  // Run everything in a single transaction so it's fast
  await db.$transaction(async (tx) => {
    // Clear old data
    await tx.comment.deleteMany();
    await tx.like.deleteMany();
    await tx.post.deleteMany();

    // Insert all posts and likes
    for (const post of posts) {
      await tx.post.create({
        data: {
          id: post.id,
          urlId: post.urlId,
          title: post.title,
          content: post.content,
          description: post.description,
          imageUrl: post.imageUrl,
          date: post.date,
          category: post.category,
          tags: post.tags
            .split(",")
            .map((tag) => tag.trim())
            .join(","),
          views: post.views,
          active: post.active,
        },
      });

      for (let index = 0; index < post.likes; index += 1) {
        await tx.like.create({
          data: {
            postId: post.id,
            userIP: `192.168.100.${index}`,
          },
        });
      }
    }
  });
  await client.db.$disconnect();
  //global.prisma = undefined;
}
