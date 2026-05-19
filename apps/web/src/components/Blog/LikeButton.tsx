"use client";

import { useState } from "react";

type LikeButtonProps = {
  postId: number;
  urlId: string;
  initialLikes: number;
};

type LikeResponse = {
  likes: number;
  liked: boolean;
};

export function LikeButton({ postId, urlId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggleLike() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, urlId }),
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as LikeResponse;
      setLikes(data.likes);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      data-test-id="like-button"
      onClick={handleToggleLike}
      disabled={isSaving}
      className="rounded border border-gray-300 px-2 py-1 text-secondary dark:border-gray-700"
    >
      {likes} likes
    </button>
  );
}
