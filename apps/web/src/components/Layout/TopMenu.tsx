"use client";
import { useMemo } from "react";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";
function debounce(fn: (value: string) => void, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (value: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(value);
    }, delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  // useMemo keeps one debounced function instance during rerenders.
  const handleSearch = useMemo(() => {
    return debounce((searchText: string) => {
      router.push(`/search?q=${encodeURIComponent(searchText)}`);
    });
  }, [router]);

  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-gray-200 pb-4 md:flex-row md:items-center dark:border-gray-700">
      <form
        action="#"
        method="GET"
        className="grid flex-1 grid-cols-1"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="search"
          name="q"
          placeholder="Search"
          defaultValue={query ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-primary dark:border-gray-700 dark:bg-gray-800"
          onChange={(event) => handleSearch(event.target.value)}
        />
      </form>
      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}
