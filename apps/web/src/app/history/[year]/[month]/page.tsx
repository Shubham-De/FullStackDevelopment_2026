import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsFromDb } from "@repo/db/posts";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const posts = await getActivePostsFromDb();

  const historyPosts = posts.filter(
    (post) =>
      post.date.getFullYear() === yearNumber &&
      post.date.getMonth() + 1 === monthNumber,
  );

  return (
    <AppLayout selectedYear={year} selectedMonth={month}>
      <Main posts={historyPosts} />
    </AppLayout>
  );
}
