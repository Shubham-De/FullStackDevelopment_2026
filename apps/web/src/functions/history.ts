export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
  const historyCounter: Record<string, number> = {};

  for (const post of posts) {
    if (!post.active) {
      continue;
    }

    const month = post.date.getMonth() + 1;
    const year = post.date.getFullYear();
    const key = `${year}-${month}`;

    if (!historyCounter[key]) {
      historyCounter[key] = 0;
    }
    historyCounter[key] += 1;
  }

  const result: { month: number; year: number; count: number }[] = [];

  for (const key of Object.keys(historyCounter)) {
    const [yearString, monthString] = key.split("-");
    const year = Number(yearString);
    const month = Number(monthString);

    result.push({
      year,
      month,
      count: historyCounter[key] ?? 0,
    });
  }

  result.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    return b.month - a.month;
  });

  return result;
}
