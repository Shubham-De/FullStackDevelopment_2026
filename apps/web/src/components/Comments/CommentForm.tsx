"use client";

import { useState } from "react";

// Props that this form needs
type CommentFormProps = {
  postId: number;
  parentId?: number | null; // if this is a reply, parentId is the comment we're replying to
  onCommentAdded: () => void; // callback to refresh comments after adding
  onCancel?: () => void; // optional cancel button (used for reply forms)
};

export function CommentForm({ postId, parentId, onCommentAdded, onCancel }: CommentFormProps) {
  // Form fields
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Handle form submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // prevent page reload

    // Simple validation
    if (!author.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      // Send the comment to our API
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: author.trim(),
          content: content.trim(),
          parentId: parentId ?? null,
        }),
      });

      if (!response.ok) {
        setError("Failed to post comment. Please try again.");
        return;
      }

      // Clear the form and tell the parent to refresh
      setAuthor("");
      setContent("");
      onCommentAdded();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name input */}
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Comment text */}
      <div>
        <textarea
          placeholder={parentId ? "Write a reply..." : "Write a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Error message */}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300"
        >
          {isSaving ? "Posting..." : parentId ? "Reply" : "Post Comment"}
        </button>

        {/* Show cancel button only for reply forms */}
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm dark:border-gray-700"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
