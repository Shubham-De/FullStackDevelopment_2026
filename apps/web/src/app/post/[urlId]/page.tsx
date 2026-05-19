import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { incrementPostViews } from "@repo/db/posts";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = await incrementPostViews(urlId, true);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}
