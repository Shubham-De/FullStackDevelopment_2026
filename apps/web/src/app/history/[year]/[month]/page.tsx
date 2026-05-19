import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const yearNumber = Number(year);
  const monthNumber = Number(month);

  const historyPosts = posts.filter((post) => {
    if (!post.active) {
      return false;
    }

    return (
      post.date.getFullYear() === yearNumber &&
      post.date.getMonth() + 1 === monthNumber
    );
  });
  return (
    <AppLayout selectedYear={year} selectedMonth={month}>
      <Main posts={historyPosts} />
    </AppLayout>
  );
}
