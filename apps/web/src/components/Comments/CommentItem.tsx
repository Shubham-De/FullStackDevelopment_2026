"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";

// The shape of a comment (matches what our API returns)
type CommentData = {
  id: number;
  postId: number;
  parentId: number | null;
  author: string;
  content: string;
  createdAt: string;
  children: CommentData[];
};

type CommentItemProps = {
  comment: CommentData;
  onCommentAdded: () => void; // called when a reply is added
};

// Format a date string into something readable like "Jun 4, 2026"
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CommentItem({ comment, onCommentAdded }: CommentItemProps) {
  // Track whether the reply form is open
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="space-y-3">
      {/* The comment itself */}
      <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        {/* Author and date */}
        <div className="mb-1 flex items-center gap-2 text-sm">
          <span className="font-semibold text-primary">{comment.author}</span>
          <span className="text-secondary">{formatDate(comment.createdAt)}</span>
        </div>

        {/* Comment text */}
        <p className="text-sm text-primary">{comment.content}</p>

        {/* Reply button */}
        <button
          type="button"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mt-2 text-xs text-secondary hover:text-primary"
        >
          {showReplyForm ? "Cancel Reply" : "Reply"}
        </button>
      </div>

      {/* Reply form - only shown when "Reply" button is clicked */}
      {showReplyForm ? (
        <div className="ml-6">
          <CommentForm
            postId={comment.postId}
            parentId={comment.id}
            onCommentAdded={() => {
              setShowReplyForm(false); // close the reply form
              onCommentAdded(); // refresh the comments
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      ) : null}

      {/* Nested replies - indented with ml-6 */}
      {comment.children.length > 0 ? (
        <div className="ml-6 space-y-3">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
