import { LoginScreen } from "../../../components/LoginScreen";
import { PostEditorForm } from "../../../components/PostEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import { findAdminPostByUrlId } from "../../../utils/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginScreen redirectTo={`/post/${urlId}`} />;
  }

  const post = await findAdminPostByUrlId(urlId);
  if (!post) {
    return <main className="mx-auto max-w-3xl p-6">Post not found</main>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-6">
      <h1 className="text-2xl font-bold text-primary">Modify Post</h1>
      <PostEditorForm mode="update" initialPost={post} />
    </main>
  );
}
