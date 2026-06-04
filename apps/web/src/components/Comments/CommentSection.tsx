"use client";

import { useCallback, useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

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

type CommentSectionProps = {
  postId: number;
};

export function CommentSection({ postId }: CommentSectionProps) {
  // State to store the list of comments
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch comments from the API
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch {
      // If fetching fails, just show empty comments
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Load comments when the component first appears
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Count total comments (including nested ones)
  function countAllComments(commentList: CommentData[]): number {
    let total = 0;
    for (const comment of commentList) {
      total += 1; // count this comment
      total += countAllComments(comment.children); // count its replies
    }
    return total;
  }

  const totalCount = countAllComments(comments);

  return (
    <section className="space-y-4">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-primary">
        Comments ({totalCount})
      </h2>

      {/* Form to add a new top-level comment */}
      <CommentForm postId={postId} onCommentAdded={loadComments} />

      {/* Loading state */}
      {isLoading ? (
        <p className="text-sm text-secondary">Loading comments...</p>
      ) : null}

      {/* List of comments */}
      {!isLoading && comments.length === 0 ? (
        <p className="text-sm text-secondary">
          No comments yet. Be the first to comment!
        </p>
      ) : null}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentAdded={loadComments}
          />
        ))}
      </div>
    </section>
  );
}
