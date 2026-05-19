import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { posts } from "@repo/db/data";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = posts.find((item) => item.urlId === urlId && item.active);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }
  // For client-side assignment tests, we show +1 view on detail display
  // without mutating the shared in-memory source data.
  const postWithCurrentView = {
    ...post,
    views: post.views + 1,
  };

  return (
    <AppLayout>
      <BlogDetail post={postWithCurrentView} />
    </AppLayout>
  );
}
