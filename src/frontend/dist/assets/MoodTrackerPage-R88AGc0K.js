import { r as reactExports, j as jsxRuntimeExports, c as cn, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { B as Badge } from "./badge-CVxodpuz.js";
import { B as Button } from "./button-Dt4o60Uo.js";
import { T as Textarea } from "./textarea-f-DPe8WQ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { e as useMoodEntries, p as useLogMood } from "./useBackend-D3WuyYMJ.js";
import { m as motion } from "./proxy-bm9pCfPV.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip } from "./generateCategoricalChart-C0H0LESu.js";
import { L as LineChart, a as Line } from "./LineChart-CLFY4pKL.js";
const MOODS = [
  { score: 1, emoji: "😢", label: "Very Sad" },
  { score: 2, emoji: "😞", label: "Sad" },
  { score: 3, emoji: "😐", label: "Neutral" },
  { score: 4, emoji: "😊", label: "Happy" },
  { score: 5, emoji: "😄", label: "Very Happy" }
];
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function moodEmoji(score) {
  var _a;
  return ((_a = MOODS.find((m) => m.score === score)) == null ? void 0 : _a.emoji) ?? "😐";
}
function moodLabel(score) {
  var _a;
  return ((_a = MOODS.find((m) => m.score === score)) == null ? void 0 : _a.label) ?? "Neutral";
}
function MoodTrackerPage() {
  const [selected, setSelected] = reactExports.useState(null);
  const [note, setNote] = reactExports.useState("");
  const { data: summary, isLoading } = useMoodEntries("30d");
  const logMood = useLogMood();
  const entries = (summary == null ? void 0 : summary.entries) ?? [];
  const chartData = reactExports.useMemo(() => {
    return [...entries].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)).slice(-30).map((e) => ({
      date: formatDate(e.timestamp),
      score: Number(e.score)
    }));
  }, [entries]);
  const weeklyAvg = reactExports.useMemo(() => {
    const recent = entries.slice(0, 7);
    if (!recent.length) return null;
    return recent.reduce((s, e) => s + Number(e.score), 0) / recent.length;
  }, [entries]);
  const suggestion = weeklyAvg !== null ? weeklyAvg < 3 ? "💙 Consider speaking to someone you trust — sharing helps." : "🌟 Keep it up! Your mood looks great this week." : null;
  async function handleSave() {
    if (selected === null) return;
    await logMood.mutateAsync({ score: BigInt(selected), note });
    setSelected(null);
    setNote("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "🧠 Mood Tracker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Log how you're feeling and track your emotional wellbeing over time" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full", dismissible: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "How are you feeling today?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-between gap-2 mb-4",
                role: "radiogroup",
                "aria-label": "Mood selector",
                children: MOODS.map((mood) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    "data-ocid": `mood.emoji_${mood.score}`,
                    className: cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl flex-1 transition-smooth border-2 cursor-pointer",
                      "focus-within:ring-2 focus-within:ring-ring",
                      selected === mood.score ? "border-primary bg-primary/10 scale-105 shadow-md" : "border-transparent bg-muted/40 hover:bg-muted hover:border-border"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "mood",
                          value: mood.score,
                          checked: selected === mood.score,
                          onChange: () => setSelected(mood.score),
                          className: "sr-only"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl leading-none", children: mood.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground leading-none hidden sm:block", children: mood.label })
                    ]
                  },
                  mood.score
                ))
              }
            ),
            selected !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                className: "mb-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground mb-2", children: [
                    moodEmoji(selected),
                    " ",
                    moodLabel(selected),
                    " — add a note (optional)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      "data-ocid": "mood.note_input",
                      placeholder: "What's on your mind? (optional)",
                      value: note,
                      onChange: (e) => setNote(e.target.value),
                      rows: 2,
                      className: "resize-none text-sm"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "mood.save_button",
                onClick: handleSave,
                disabled: selected === null || logMood.isPending,
                className: "w-full btn-primary border-0",
                children: logMood.isPending ? "Saving..." : "💾 Save Mood"
              }
            ),
            logMood.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                "data-ocid": "mood.success_state",
                className: "text-center text-sm text-accent mt-2",
                children: "✅ Mood logged successfully!"
              }
            )
          ] })
        ] })
      }
    ),
    suggestion && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -12 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        className: "rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3",
        "data-ocid": "mood.suggestion_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: "Weekly Insight" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-0.5", children: suggestion })
          ] }),
          weeklyAvg !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-blue shrink-0 self-start mt-0.5", children: [
            "Avg ",
            weeklyAvg.toFixed(1),
            " / 5"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.25 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📈 Mood Trend — Last 30 Days" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full border-2 border-border border-t-primary animate-spin" }) }) : chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "mood.chart_empty_state",
              className: "h-44 flex flex-col items-center justify-center text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl mb-2", children: "📊" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No data yet — start logging your mood!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: chartData, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "date",
                tick: { fontSize: 10, fill: "var(--muted-foreground)" },
                interval: "preserveStartEnd"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: [1, 5],
                ticks: [1, 2, 3, 4, 5],
                tick: { fontSize: 10, fill: "var(--muted-foreground)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: 12
                },
                formatter: (v) => [
                  `${moodEmoji(v)} ${moodLabel(v)} (${v})`,
                  "Mood"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "score",
                stroke: "oklch(0.48 0.14 232)",
                strokeWidth: 2.5,
                dot: { r: 4, fill: "oklch(0.48 0.14 232)" },
                activeDot: { r: 6 }
              }
            )
          ] }) }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.3 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📋 Mood History" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "mood.history_empty_state",
              className: "text-center py-8 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl block mb-2", children: "🗒️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No mood entries yet. Start logging!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-ocid": "mood.history_list", children: [...entries].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)).slice(0, 15).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.li,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: i * 0.04 },
              "data-ocid": `mood.history_item.${i + 1}`,
              className: "flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: moodEmoji(Number(entry.score)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: moodLabel(Number(entry.score)) }),
                  entry.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: entry.note })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: formatDate(entry.timestamp) })
              ]
            },
            String(entry.id)
          )) }) })
        ] })
      }
    )
  ] });
}
export {
  MoodTrackerPage as default
};
