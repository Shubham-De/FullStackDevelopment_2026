import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu({
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: {
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  return (
    <aside className="w-full border-r border-gray-200 p-6 md:w-72 dark:border-gray-700">
      <a href="/" className="mb-8 inline-block text-3xl font-bold text-primary">
        Full Stack Blog
      </a>

      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} selectedCategory={selectedCategory} />
          </li>
          <li>
            <HistoryList
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              posts={posts}
            />
          </li>
          <li>
            <TagList selectedTag={selectedTag} posts={posts} />
          </li>
          <li>
            <a href="http://localhost:3002" className="text-sm text-secondary">
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
