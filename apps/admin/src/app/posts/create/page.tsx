import { LoginScreen } from "../../../components/LoginScreen";
import { PostEditorForm } from "../../../components/PostEditorForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginScreen redirectTo="/posts/create" />;
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-6">
      <h1 className="text-2xl font-bold text-primary">Create Post</h1>
      <PostEditorForm mode="create" />
    </main>
  );
}
