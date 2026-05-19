import { AdminListScreen } from "../components/AdminListScreen";
import { LoginScreen } from "../components/LoginScreen";
import { isLoggedIn } from "../utils/auth";
import { listPostsForAdmin } from "../utils/posts";
import { logoutAction } from "./actions/auth";
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

  const adminPosts = listPostsForAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-6">
      <div className="flex justify-end">
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-700"
          >
            Logout
          </button>
        </form>
      </div>
      <AdminListScreen initialPosts={adminPosts} />
    </main>
  );
}
