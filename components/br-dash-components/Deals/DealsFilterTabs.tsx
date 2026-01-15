"use client";

type Props = {
  filter: string;
  setFilter: (f: "all" | "active" | "pending" | "completed") => void;
  counts: {
    all: number;
    active: number;
    pending: number;
    completed: number;
  };
};

export default function DealsFilterTabs({ filter, setFilter, counts }: Props) {
  const btn = (key: any, label: string, color: string) => (
    <button
      onClick={() => setFilter(key)}
      className="px-3 py-1 rounded"
      style={{ background: filter === key ? color : "#e5e7eb" }}
    >
      {label} ({counts[key as keyof typeof counts]})
    </button>
  );

  return (
    <div className="flex gap-2 mb-4">
      {btn("all", "All", "#94a3b8")}
      {btn("active", "Active", "#0ea5e9")}
      {btn("pending", "Pending", "#f59e0b")}
      {btn("completed", "Completed", "#10b981")}
    </div>
  );
}
