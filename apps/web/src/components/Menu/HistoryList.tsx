import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);
  return (
    <LinkList title="History">
      {historyItems.map((item) => {
        const monthName = months[item.month] || String(item.month);
        const label = `${monthName}, ${item.year}`;
        const yearText = String(item.year);
        const monthText = String(item.month);

        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            count={item.count}
            isSelected={
              selectedYear === yearText && selectedMonth === monthText
            }
            link={`/history/${item.year}/${item.month}`}
            name={label}
            title={`History / ${label}`}
          />
        );
      })}
    </LinkList>
  );
}
