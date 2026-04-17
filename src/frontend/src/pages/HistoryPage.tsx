import { useMemo, useState } from "react";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { useHealthHistory } from "../hooks/useBackend";
import { HistoryCategory } from "../types";
import type { HistoryEvent } from "../types";

const PAGE_SIZE = 20;

interface FilterTab {
  label: string;
  value: HistoryCategory | "all";
  emoji: string;
}

const FILTER_TABS: FilterTab[] = [
  { label: "All", value: "all", emoji: "📋" },
  { label: "Meals", value: HistoryCategory.meal, emoji: "🍽️" },
  { label: "Mood", value: HistoryCategory.mood, emoji: "😊" },
  { label: "Symptoms", value: HistoryCategory.symptom, emoji: "🤒" },
  { label: "Risk Score", value: HistoryCategory.riskScore, emoji: "🩺" },
];

interface CategoryStyle {
  border: string;
  iconBg: string;
  badge: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  [HistoryCategory.meal]: {
    border: "border-l-primary",
    iconBg: "bg-primary/10",
    badge: "badge-blue",
  },
  [HistoryCategory.mood]: {
    border: "border-l-accent",
    iconBg: "bg-accent/10",
    badge: "badge-green",
  },
  [HistoryCategory.symptom]: {
    border: "border-l-yellow-400",
    iconBg: "bg-yellow-50",
    badge: "badge-yellow",
  },
  [HistoryCategory.riskScore]: {
    border: "border-l-destructive",
    iconBg: "bg-destructive/10",
    badge: "badge-red",
  },
};

const CATEGORY_EMOJI: Record<string, string> = {
  [HistoryCategory.meal]: "🍽️",
  [HistoryCategory.mood]: "😊",
  [HistoryCategory.symptom]: "🤒",
  [HistoryCategory.riskScore]: "🩺",
};

function formatTimestamp(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryLabel(cat: string) {
  return FILTER_TABS.find((t) => t.value === cat)?.label ?? cat;
}

function HistoryEventItem({
  event,
  index,
}: { event: HistoryEvent; index: number }) {
  const styles =
    CATEGORY_STYLES[event.category as string] ??
    CATEGORY_STYLES[HistoryCategory.meal];
  const emoji = CATEGORY_EMOJI[event.category as string] ?? "📋";
  const label = getCategoryLabel(event.category as string);

  return (
    <div
      data-ocid={`history.item.${index + 1}`}
      className={`flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-subtle border-l-4 ${styles.border} transition-smooth hover:shadow-md`}
    >
      <div
        className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center text-xl shrink-0 mt-0.5`}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {event.title}
          </h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}
          >
            {label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5">
          {formatTimestamp(event.timestamp)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      data-ocid="history.empty_state"
      className="flex flex-col items-center justify-center py-16 text-center gap-3"
    >
      <span className="text-5xl">🗂️</span>
      <h3 className="font-display font-semibold text-lg text-foreground">
        No {label} events yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Start logging your health data and your timeline will appear here.
      </p>
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryCategory | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);

  const categoryFilter = activeTab === "all" ? null : activeTab;

  const fromTs = useMemo<bigint | null>(() => {
    if (!fromDate) return null;
    return BigInt(new Date(fromDate).getTime()) * 1_000_000n;
  }, [fromDate]);

  const toTs = useMemo<bigint | null>(() => {
    if (!toDate) return null;
    return BigInt(new Date(`${toDate}T23:59:59`).getTime()) * 1_000_000n;
  }, [toDate]);

  const { data: events, isLoading } = useHealthHistory(
    categoryFilter,
    fromTs,
    toTs,
  );

  const paginatedEvents = useMemo(() => {
    const all = events ?? [];
    return all.slice(0, (page + 1) * PAGE_SIZE);
  }, [events, page]);

  const hasMore = (events?.length ?? 0) > paginatedEvents.length;
  const activeTabInfo =
    FILTER_TABS.find((t) => t.value === activeTab) ?? FILTER_TABS[0];

  function handleTabChange(val: HistoryCategory | "all") {
    setActiveTab(val);
    setPage(0);
  }

  function clearDateFilters() {
    setFromDate("");
    setToDate("");
    setPage(0);
  }

  return (
    <div className="page-container space-y-5" data-ocid="history.page">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          🕐 Health History
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your complete health event timeline
        </p>
      </div>

      {/* Category Tabs */}
      <div
        className="flex gap-2 flex-wrap"
        role="tablist"
        aria-label="Filter by health category"
      >
        {FILTER_TABS.map((tab) => (
          <button
            type="button"
            key={String(tab.value)}
            role="tab"
            aria-selected={activeTab === tab.value}
            data-ocid={`history.filter.${tab.value}`}
            onClick={() => handleTabChange(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-smooth border ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            📅 Date Range
          </span>
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="history-from"
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                From
              </label>
              <input
                id="history-from"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(0);
                }}
                data-ocid="history.from_date_input"
                className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="history-to"
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                To
              </label>
              <input
                id="history-to"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(0);
                }}
                data-ocid="history.to_date_input"
                className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={clearDateFilters}
                data-ocid="history.clear_filter_button"
                className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-smooth hover:bg-muted"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          Showing {paginatedEvents.length} of {events?.length ?? 0} events
          {activeTab !== "all" &&
            ` · ${activeTabInfo.emoji} ${activeTabInfo.label}`}
        </p>
      )}

      {/* Event List */}
      <ul className="space-y-3" aria-label="Health history timeline">
        {isLoading ? (
          ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
            <li key={k}>
              <CardSkeleton />
            </li>
          ))
        ) : paginatedEvents.length === 0 ? (
          <EmptyState label={activeTabInfo.label} />
        ) : (
          paginatedEvents.map((event, i) => (
            <li key={Number(event.id)}>
              <HistoryEventItem event={event} index={i} />
            </li>
          ))
        )}
      </ul>

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            data-ocid="history.pagination_next"
            className="btn-primary flex items-center gap-2"
          >
            Load More <span>↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
