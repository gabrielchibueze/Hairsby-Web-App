export default function formatDuration(minutes: any): string {
  const units = [
    { name: "year", limit: 525600, inMinutes: 525600 }, // 60 * 24 * 365
    { name: "month", limit: 43200, inMinutes: 43200 }, // 60 * 24 * 30 (approx)
    { name: "week", limit: 10080, inMinutes: 10080 }, // 60 * 24 * 7
    { name: "day", limit: 1440, inMinutes: 1440 }, // 60 * 24
    { name: "hr", limit: 60, inMinutes: 60 }, // 60
    { name: "min", limit: 1, inMinutes: 1 }, // 1
  ];

  let remaining = Number(minutes);
  const parts = [];

  for (const unit of units) {
    if (remaining >= unit.limit) {
      const count = Math.floor(remaining / unit.inMinutes);
      remaining %= unit.inMinutes;
      parts.push(`${count}${unit.name}${count > 1 ? "s" : ""}`);

      // Stop after 3 most significant units (e.g., "1 month 1 week 2 days")
      if (parts.length >= 3) break;
    }
  }

  return parts.length > 0 ? parts.join(" ") : "0 mins";
}
