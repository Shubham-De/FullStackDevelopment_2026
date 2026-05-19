"use client";

import { useMemo, useState } from "react";
import type { AdminPost } from "../utils/posts";

function formatDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTagLabel(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => `#${tag}`)
    .join(", ");
}

function parseFilterDate(dateText: string) {
  const digitsOnly = dateText.replace(/\D/g, "");
  if (digitsOnly.length !== 8) {
    return null;
  }

  const day = Number(digitsOnly.slice(0, 2));
  const month = Number(digitsOnly.slice(2, 4));
  const year = Number(digitsOnly.slice(4, 8));
  const parsedDate = new Date(year, month - 1, day);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function AdminListScreen({ initialPosts }: { initialPosts: AdminPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [statusMessage, setStatusMessage] = useState("");

  const visiblePosts = useMemo(() => {
    const contentValue = contentFilter.trim().toLowerCase();
    const tagValue = tagFilter.trim().toLowerCase();
    const selectedDate = parseFilterDate(dateFilter);
    let filtered = [...posts];

    // Keep filtering steps separate so each rule is easy to explain.
    if (contentValue) {
      filtered = filtered.filter((post) => {
        const titleText = post.title.toLowerCase();
        const contentText = post.content.toLowerCase();
        return titleText.includes(contentValue) || contentText.includes(contentValue);
      });
    }

    if (tagValue) {
      filtered = filtered.filter((post) => post.tags.toLowerCase().includes(tagValue));
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (post) => new Date(post.date).getTime() >= selectedDate.getTime(),
      );
    }

    if (visibilityFilter === "active") {
      filtered = filtered.filter((post) => post.active);
    }

    if (visibilityFilter === "inactive") {
      filtered = filtered.filter((post) => !post.active);
    }

    // Sorting is done last so filtered records stay in predictable order.
    filtered.sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [contentFilter, dateFilter, posts, sortBy, tagFilter, visibilityFilter]);

  async function handleToggleStatus(urlId: string) {
    const response = await fetch(`/api/posts/${urlId}/active`, {
      method: "PATCH",
    });

    if (!response.ok) {
      setStatusMessage("Could not update post status");
      return;
    }

    const data = (await response.json()) as { post: AdminPost };
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.urlId === urlId ? data.post : post)),
    );
    setStatusMessage("Post status updated");
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin of Full Stack Blog</h1>
        <a
          href="/posts/create"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300"
        >
          Create Post
        </a>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-2 dark:border-gray-700">
        <div>
          <label htmlFor="filter-content" className="mb-1 block text-sm font-medium">
            Filter by Content:
          </label>
          <input
            id="filter-content"
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <div>
          <label htmlFor="filter-tag" className="mb-1 block text-sm font-medium">
            Filter by Tag:
          </label>
          <input
            id="filter-tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <div>
          <label htmlFor="filter-date" className="mb-1 block text-sm font-medium">
            Filter by Date Created:
          </label>
          <input
            id="filter-date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            placeholder="DDMMYYYY"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <div>
          <label htmlFor="filter-visibility" className="mb-1 block text-sm font-medium">
            Filter by Visibility:
          </label>
          <select
            id="filter-visibility"
            value={visibilityFilter}
            onChange={(event) => setVisibilityFilter(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="mb-1 block text-sm font-medium">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
          </select>
        </div>
      </div>

      {statusMessage ? <p className="text-sm text-secondary">{statusMessage}</p> : null}

      <div className="space-y-4">
        {visiblePosts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-40 w-full rounded-lg object-cover md:w-60"
              />

              <div className="flex-1 space-y-2">
                <a href={`/post/${post.urlId}`} className="text-xl font-semibold text-primary">
                  {post.title}
                </a>
                <p className="text-sm text-secondary">{formatTagLabel(post.tags)}</p>
                <p className="text-sm text-secondary">
                  Posted on {formatDateLabel(post.date)}
                </p>
                <p className="text-sm text-secondary">{post.category}</p>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(post.urlId)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700"
                >
                  {post.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
