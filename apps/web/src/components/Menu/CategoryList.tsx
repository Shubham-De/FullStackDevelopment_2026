import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedCategory,
}: {
  posts: Post[];
  selectedCategory?: string;
}) {
  const categoryItems = categories(posts);
  const requiredCategories = ["React", "Node", "Mongo", "DevOps"];

  // Add required assignment categories even when there are no posts in them yet.
  for (const requiredCategory of requiredCategories) {
    const alreadyExists = categoryItems.find((item) => item.name === requiredCategory);
    if (!alreadyExists) {
      categoryItems.push({
        name: requiredCategory,
        count: 0,
      });
    }
  }
  return (
    <LinkList title="Categories">
      {categoryItems.map((item) => {
        const categoryPath = toUrlPath(item.name);

        // Use URL-safe category values for links and selection checks.
        return (
          <SummaryItem
            key={item.name}
            count={item.count}
            name={item.name}
            isSelected={selectedCategory === categoryPath}
            link={`/category/${categoryPath}`}
            title={`Category / ${item.name}`}
          />
        );
      })}
    </LinkList>
  );
}
