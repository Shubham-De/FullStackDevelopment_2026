import type { Post } from "@repo/db/data";
import { marked } from "marked";
import { CommentSection } from "../Comments/CommentSection";
import { LikeButton } from "./LikeButton";
function formatPostDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDisplayTitle(title: string) {
  return title.replace(/[!?.]+$/g, "");
}

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);
  const formattedDate = formatPostDate(post.date);
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const title = getDisplayTitle(post.title);

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
    >
      <img
        src={post.imageUrl}
        alt={title}
        className="h-64 w-full rounded-lg object-cover"
      />

      <a href={`/post/${post.urlId}`} className="text-3xl font-semibold text-primary">
        {title}
      </a>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
        <span>{post.category}</span>
        <span>{formattedDate}</span>
        {postTags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="flex items-center gap-6 border-y border-gray-200 py-3 text-sm text-secondary dark:border-gray-700">
        <span>{post.views} views</span>
        <LikeButton postId={post.id} urlId={post.urlId} initialLikes={post.likes} />
      </div>

      {/* Content is stored as markdown, so we render parsed HTML here. */}
      <div
        data-test-id="content-markdown"
        className="prose prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Comment section - allows users to leave comments and replies */}
      <CommentSection postId={post.id} />
    </article>
  );
}
