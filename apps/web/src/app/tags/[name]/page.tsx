import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsFromDb } from "@repo/db/posts";
import { toUrlPath } from "@repo/utils/url";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getActivePostsFromDb();

  const tagPosts = posts.filter((post) => {

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
