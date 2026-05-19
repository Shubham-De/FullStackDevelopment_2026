"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-700"
    >
      Logout
    </button>
  );
}
