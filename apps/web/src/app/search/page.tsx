import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsFromDb } from "@repo/db/posts";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchText = (q ?? "").trim().toLowerCase();
  const posts = await getActivePostsFromDb();

  const matchedPosts = posts.filter((post) => {

    if (!searchText) {
      return true;
    }

    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();
    return title.includes(searchText) || description.includes(searchText);
  });

  return (
    <AppLayout query={q}>
      <Main posts={matchedPosts} />
    </AppLayout>
  );
}
