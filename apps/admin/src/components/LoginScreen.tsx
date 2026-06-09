
export function LoginScreen({
  redirectTo = "/",
  showError = false,
}: {
  redirectTo?: string;
  showError?: boolean;
}) {
  return (
    <main className="mx-auto mt-20 w-full max-w-md rounded-xl border border-gray-200 p-6 dark:border-gray-700">
      <h1 className="mb-2 text-2xl font-bold text-primary">Sign in to your account</h1>
      <p className="mb-6 text-sm text-secondary">
        Enter the password to access admin features.
      </p>

      <form action="/api/auth" method="POST" className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300"
        >
          Sign In
        </button>
      </form>

      {showError ? (
        <p className="mt-3 text-sm text-red-600">Invalid password. Please try again.</p>
      ) : null}
    </main>
  );
}
