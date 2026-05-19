export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // Keep styling logic simple: add "selected" class only when active.
  const selectedClass = isSelected
    ? "selected bg-gray-200 text-primary dark:bg-gray-700"
    : "";

  return (
    <li>
      <a
        href={link}
        title={title}
        className={`flex items-center justify-between rounded-md px-2 py-1 text-sm text-secondary hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 ${selectedClass}`}
      >
        <span>{name}</span>
        <span
          data-test-id="post-count"
          className="rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700"
        >
          {count}
        </span>
      </a>
    </li>
  );
}
