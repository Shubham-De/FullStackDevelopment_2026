import { getActivePostsFromDb } from "@repo/db/posts";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export default async function Home() {
  // Home page should show only active posts from the DB.
  const activePosts = await getActivePostsFromDb();
  return (
    <AppLayout>
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}
