import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchText = (q ?? "").trim().toLowerCase();

  const matchedPosts = posts.filter((post) => {
    if (!post.active) {
      return false;
    }

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
