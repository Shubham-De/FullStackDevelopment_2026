import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const tagPosts = posts.filter((post) => {
    if (!post.active) {
      return false;
    }

    const postTags = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    for (const tag of postTags) {
      if (toUrlPath(tag) === name) {
        return true;
      }
    }

    return false;
  });

  return (
    <AppLayout selectedTag={name}>
      <Main posts={tagPosts} />
    </AppLayout>
  );
}
