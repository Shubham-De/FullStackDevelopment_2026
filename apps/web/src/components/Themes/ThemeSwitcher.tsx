"use client";

import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute("data-theme");
    if (htmlTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);

    // Save current choice so the server layout can reuse it later.
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
  };

  return (
    <Button
      onClick={toggleTheme}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-primary hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
