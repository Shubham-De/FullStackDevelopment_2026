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
  const categoryPosts = posts.filter((post) => toUrlPath(post.category) === name);

  return (
    <AppLayout selectedCategory={name}>
      <Main posts={categoryPosts} />
    </AppLayout>
  );
}
