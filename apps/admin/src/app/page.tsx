import { AdminListScreen } from "../components/AdminListScreen";
import { LoginScreen } from "../components/LoginScreen";
import { LogoutButton } from "../components/LogoutButton";
import { isLoggedIn } from "../utils/auth";
import { listPostsForAdmin } from "../utils/posts";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginScreen redirectTo="/" showError={error === "invalid"} />;
  }

  const adminPosts = await listPostsForAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-6">
      <div className="flex justify-end">
        <LogoutButton />
      </div>
      <AdminListScreen initialPosts={adminPosts} />
    </main>
  );
}
