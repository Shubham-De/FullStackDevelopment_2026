"use client";

import type { Post } from "@repo/db/data";
import { useState } from "react";
import { BlogListItem } from "./ListItem";

// How many posts to show per page
const POSTS_PER_PAGE = 3;

export function BlogList({ posts }: { posts: Post[] }) {
  // currentPage starts at 1
  const [currentPage, setCurrentPage] = useState(1);     //tracks which page we're on Starts at page 1

  if (posts.length === 0) {
    return (
      <div className="py-6">
        <p className="text-secondary">0 Posts</p>
      </div>
    );
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);                                                         //If there are 7 posts and 3 per page 7 / 3 = 2.33, it rounds up to 3 pages

  // Get only the posts for the current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  function goToPreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  function goToNextPage() {
    setCurrentPage(currentPage + 1);
  }

  return (
    <div>
      {/* List of posts for current page */}
      <div className="space-y-6 py-6">
        {currentPosts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-4 py-4">
        {/* Previous button - hidden on first page */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page indicator */}
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next button - hidden on last page */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BlogList;
