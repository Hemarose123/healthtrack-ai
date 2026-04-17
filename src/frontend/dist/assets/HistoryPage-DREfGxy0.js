import { r as reactExports, H as HistoryCategory, j as jsxRuntimeExports, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { t as useHealthHistory } from "./useBackend-D3WuyYMJ.js";
const PAGE_SIZE = 20;
const FILTER_TABS = [
  { label: "All", value: "all", emoji: "📋" },
  { label: "Meals", value: HistoryCategory.meal, emoji: "🍽️" },
  { label: "Mood", value: HistoryCategory.mood, emoji: "😊" },
  { label: "Symptoms", value: HistoryCategory.symptom, emoji: "🤒" },
  { label: "Risk Score", value: HistoryCategory.riskScore, emoji: "🩺" }
];
const CATEGORY_STYLES = {
  [HistoryCategory.meal]: {
    border: "border-l-primary",
    iconBg: "bg-primary/10",
    badge: "badge-blue"
  },
  [HistoryCategory.mood]: {
    border: "border-l-accent",
    iconBg: "bg-accent/10",
    badge: "badge-green"
  },
  [HistoryCategory.symptom]: {
    border: "border-l-yellow-400",
    iconBg: "bg-yellow-50",
    badge: "badge-yellow"
  },
  [HistoryCategory.riskScore]: {
    border: "border-l-destructive",
    iconBg: "bg-destructive/10",
    badge: "badge-red"
  }
};
const CATEGORY_EMOJI = {
  [HistoryCategory.meal]: "🍽️",
  [HistoryCategory.mood]: "😊",
  [HistoryCategory.symptom]: "🤒",
  [HistoryCategory.riskScore]: "🩺"
};
function formatTimestamp(ts) {
  return new Date(Number(ts) / 1e6).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function getCategoryLabel(cat) {
  var _a;
  return ((_a = FILTER_TABS.find((t) => t.value === cat)) == null ? void 0 : _a.label) ?? cat;
}
function HistoryEventItem({
  event,
  index
}) {
  const styles = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES[HistoryCategory.meal];
  const emoji = CATEGORY_EMOJI[event.category] ?? "📋";
  const label = getCategoryLabel(event.category);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `history.item.${index + 1}`,
      className: `flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-subtle border-l-4 ${styles.border} transition-smooth hover:shadow-md`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center text-xl shrink-0 mt-0.5`,
            children: emoji
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground truncate", children: event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`,
                children: label
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: event.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1.5", children: formatTimestamp(event.timestamp) })
        ] })
      ]
    }
  );
}
function EmptyState({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "history.empty_state",
      className: "flex flex-col items-center justify-center py-16 text-center gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🗂️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-lg text-foreground", children: [
          "No ",
          label,
          " events yet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Start logging your health data and your timeline will appear here." })
      ]
    }
  );
}
function HistoryPage() {
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [fromDate, setFromDate] = reactExports.useState("");
  const [toDate, setToDate] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const categoryFilter = activeTab === "all" ? null : activeTab;
  const fromTs = reactExports.useMemo(() => {
    if (!fromDate) return null;
    return BigInt(new Date(fromDate).getTime()) * 1000000n;
  }, [fromDate]);
  const toTs = reactExports.useMemo(() => {
    if (!toDate) return null;
    return BigInt((/* @__PURE__ */ new Date(`${toDate}T23:59:59`)).getTime()) * 1000000n;
  }, [toDate]);
  const { data: events, isLoading } = useHealthHistory(
    categoryFilter,
    fromTs,
    toTs
  );
  const paginatedEvents = reactExports.useMemo(() => {
    const all = events ?? [];
    return all.slice(0, (page + 1) * PAGE_SIZE);
  }, [events, page]);
  const hasMore = ((events == null ? void 0 : events.length) ?? 0) > paginatedEvents.length;
  const activeTabInfo = FILTER_TABS.find((t) => t.value === activeTab) ?? FILTER_TABS[0];
  function handleTabChange(val) {
    setActiveTab(val);
    setPage(0);
  }
  function clearDateFilters() {
    setFromDate("");
    setToDate("");
    setPage(0);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-5", "data-ocid": "history.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "🕐 Health History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Your complete health event timeline" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-2 flex-wrap",
        role: "tablist",
        "aria-label": "Filter by health category",
        children: FILTER_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeTab === tab.value,
            "data-ocid": `history.filter.${tab.value}`,
            onClick: () => handleTabChange(tab.value),
            className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-smooth border ${activeTab === tab.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label })
            ]
          },
          String(tab.value)
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-4 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground whitespace-nowrap", children: "📅 Date Range" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "history-from",
              className: "text-xs text-muted-foreground whitespace-nowrap",
              children: "From"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "history-from",
              type: "date",
              value: fromDate,
              onChange: (e) => {
                setFromDate(e.target.value);
                setPage(0);
              },
              "data-ocid": "history.from_date_input",
              className: "text-sm border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "history-to",
              className: "text-xs text-muted-foreground whitespace-nowrap",
              children: "To"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "history-to",
              type: "date",
              value: toDate,
              onChange: (e) => {
                setToDate(e.target.value);
                setPage(0);
              },
              "data-ocid": "history.to_date_input",
              className: "text-sm border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }),
        (fromDate || toDate) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearDateFilters,
            "data-ocid": "history.clear_filter_button",
            className: "text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-smooth hover:bg-muted",
            children: "✕ Clear"
          }
        )
      ] })
    ] }) }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Showing ",
      paginatedEvents.length,
      " of ",
      (events == null ? void 0 : events.length) ?? 0,
      " events",
      activeTab !== "all" && ` · ${activeTabInfo.emoji} ${activeTabInfo.label}`
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", "aria-label": "Health history timeline", children: isLoading ? ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) }, k)) : paginatedEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { label: activeTabInfo.label }) : paginatedEvents.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryEventItem, { event, index: i }) }, Number(event.id))) }),
    hasMore && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setPage((p) => p + 1),
        "data-ocid": "history.pagination_next",
        className: "btn-primary flex items-center gap-2",
        children: [
          "Load More ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "↓" })
        ]
      }
    ) })
  ] });
}
export {
  HistoryPage as default
};
