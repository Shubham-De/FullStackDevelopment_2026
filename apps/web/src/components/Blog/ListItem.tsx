import type { Post } from "@repo/db/data";
function formatPostDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDisplayTitle(title: string) {
  // Remove only ending punctuation so unit tests and UI stay consistent.
  return title.replace(/[!?.]+$/g, "");
}

export function BlogListItem({ post }: { post: Post }) {
  const formattedDate = formatPostDate(post.date);
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const title = getDisplayTitle(post.title);
  return (
    <article
      key={post.id}
      className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row dark:border-gray-700"
      data-test-id={`blog-post-${post.id}`}
    >
      <img
        src={post.imageUrl}
        alt={title}
        className="h-52 w-full rounded-lg object-cover md:w-72"
      />

      <div className="flex-1 space-y-3">
        <a href={`/post/${post.urlId}`} className="text-2xl font-semibold text-primary">
          {title}
        </a>

        <p className="text-secondary">{post.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
          <span>{post.category}</span>
          <span>{formattedDate}</span>
          {postTags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-6 border-t border-gray-200 pt-3 text-sm text-secondary dark:border-gray-700">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
