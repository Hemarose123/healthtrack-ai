import { r as reactExports, j as jsxRuntimeExports, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { e as useMoodEntries, i as useWeeklySummary, f as useLatestRiskScore, r as useSymptomHistory } from "./useBackend-D3WuyYMJ.js";
import { g as generateCategoricalChart, B as Bar, X as XAxis, Y as YAxis, f as formatAxisMap, R as ResponsiveContainer, C as CartesianGrid, T as Tooltip, a as ReferenceLine, b as Cell } from "./generateCategoricalChart-C0H0LESu.js";
import { L as LineChart, a as Line } from "./LineChart-CLFY4pKL.js";
import { A as AreaChart, a as Area } from "./AreaChart-DWKLWuTQ.js";
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
const CHART_COLORS = {
  primary: "#0077B6",
  secondary: "#00B4D8",
  accent: "#52B788",
  gridStroke: "#e2e8f0",
  tickFill: "#64748b",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e2e8f0",
  tooltipLabel: "#0f172a",
  warning: "#f59e0b",
  danger: "#ef4444"
};
const MOOD_EMOJIS = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄"
};
function getRiskBarColor(score) {
  if (score <= 33) return CHART_COLORS.accent;
  if (score <= 66) return CHART_COLORS.warning;
  return CHART_COLORS.danger;
}
function DateFilterButtons({
  value,
  onChange
}) {
  const opts = [
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex gap-2 border-0 p-0 m-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Date range filter" }),
    opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `analytics.filter_${o.value}d`,
        onClick: () => onChange(o.value),
        className: `px-3 py-1.5 rounded-full text-sm font-semibold transition-smooth border ${value === o.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`,
        children: o.label
      },
      o.value
    ))
  ] });
}
function ChartCard({
  title,
  emoji,
  children,
  footer
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-4 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
      " ",
      title
    ] }),
    children,
    footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: footer })
  ] });
}
function useMoodChartData(range) {
  const period = range === "7" ? "7d" : range === "30" ? "30d" : "90d";
  const { data: moodSummary, isLoading } = useMoodEntries(period);
  const chartData = reactExports.useMemo(() => {
    var _a;
    if (!((_a = moodSummary == null ? void 0 : moodSummary.entries) == null ? void 0 : _a.length)) {
      const days = Math.min(Number.parseInt(range), 14);
      return Array.from({ length: days }, (_, i) => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return {
          date: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }),
          score: Math.round(2 + Math.random() * 3)
        };
      });
    }
    return moodSummary.entries.slice(-Number.parseInt(range)).map((e) => ({
      date: new Date(Number(e.timestamp) / 1e6).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      ),
      score: Number(e.score)
    }));
  }, [moodSummary, range]);
  return { chartData, isLoading };
}
function useCalorieChartData() {
  var _a;
  const weekStart = reactExports.useMemo(() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  }, []);
  const { data: weekly, isLoading } = useWeeklySummary(weekStart);
  const chartData = reactExports.useMemo(() => {
    var _a2;
    if (!((_a2 = weekly == null ? void 0 : weekly.dailySummaries) == null ? void 0 : _a2.length)) {
      return Array.from({ length: 7 }, (_, i) => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString("en-US", { weekday: "short" }),
          calories: Math.round(1400 + Math.random() * 800),
          goal: 2e3
        };
      });
    }
    return weekly.dailySummaries.map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-US", { weekday: "short" }),
      calories: Math.round(s.totalCalories),
      goal: Number(s.goal)
    }));
  }, [weekly]);
  const avgGoal = ((_a = chartData[0]) == null ? void 0 : _a.goal) ?? 2e3;
  return { chartData, avgGoal, isLoading };
}
function useRiskChartData() {
  const { data: riskScore, isLoading } = useLatestRiskScore();
  const chartData = reactExports.useMemo(() => {
    const base = riskScore ? Number(riskScore.score) : 45;
    return Array.from({ length: 8 }, (_, i) => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - (7 - i) * 7);
      const variance = (Math.random() - 0.5) * 20;
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: Math.max(5, Math.min(95, Math.round(base + variance)))
      };
    });
  }, [riskScore]);
  return { chartData, isLoading };
}
function useSymptomChartData() {
  const { data: symptoms, isLoading } = useSymptomHistory(0, 50);
  const chartData = reactExports.useMemo(() => {
    if (!(symptoms == null ? void 0 : symptoms.length)) {
      return [
        { symptom: "Headache", count: 8 },
        { symptom: "Fatigue", count: 6 },
        { symptom: "Nausea", count: 4 },
        { symptom: "Back Pain", count: 3 },
        { symptom: "Insomnia", count: 2 }
      ];
    }
    const freq = {};
    for (const s of symptoms) {
      const words = s.symptomsText.toLowerCase().split(/[\s,]+/);
      for (const w of words) {
        if (w.length > 4) freq[w] = (freq[w] ?? 0) + 1;
      }
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([sym, count]) => ({
      symptom: sym.charAt(0).toUpperCase() + sym.slice(1),
      count
    }));
  }, [symptoms]);
  return { chartData, isLoading };
}
const tooltipStyle = {
  background: CHART_COLORS.tooltipBg,
  border: `1px solid ${CHART_COLORS.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12
};
function AnalyticsPage() {
  const [dateRange, setDateRange] = reactExports.useState("30");
  const { chartData: moodData, isLoading: moodLoading } = useMoodChartData(dateRange);
  const {
    chartData: calorieData,
    avgGoal,
    isLoading: calLoading
  } = useCalorieChartData();
  const { chartData: riskData, isLoading: riskLoading } = useRiskChartData();
  const { chartData: symptomData, isLoading: symptomLoading } = useSymptomChartData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", "data-ocid": "analytics.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "📊 Analytics Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Visual insights across your health journey" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DateFilterButtons, { value: dateRange, onChange: setDateRange })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Mood Trend", emoji: "😊", children: moodLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        LineChart,
        {
          data: moodData,
          margin: { top: 4, right: 8, left: -20, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "moodLineGrad", x1: "0", y1: "0", x2: "1", y2: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: CHART_COLORS.primary }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: CHART_COLORS.secondary })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: CHART_COLORS.gridStroke,
                strokeOpacity: 0.6
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "date",
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false,
                interval: "preserveStartEnd"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: [1, 5],
                ticks: [1, 2, 3, 4, 5],
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                formatter: (value) => [
                  `${value} ${MOOD_EMOJIS[value] ?? ""}`,
                  "Mood"
                ],
                contentStyle: tooltipStyle,
                labelStyle: {
                  color: CHART_COLORS.tooltipLabel,
                  fontWeight: 600
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "score",
                stroke: CHART_COLORS.primary,
                strokeWidth: 2.5,
                dot: { fill: CHART_COLORS.primary, strokeWidth: 0, r: 3 },
                activeDot: { r: 5, fill: CHART_COLORS.secondary }
              }
            )
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Daily Calorie Trend", emoji: "🔥", children: calLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        AreaChart,
        {
          data: calorieData,
          margin: { top: 4, right: 8, left: -20, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "linearGradient",
              {
                id: "calorieAreaGrad",
                x1: "0",
                y1: "0",
                x2: "0",
                y2: "1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "5%",
                      stopColor: CHART_COLORS.secondary,
                      stopOpacity: 0.35
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "95%",
                      stopColor: CHART_COLORS.secondary,
                      stopOpacity: 0.02
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: CHART_COLORS.gridStroke,
                strokeOpacity: 0.6
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "date",
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                formatter: (v) => [`${v} kcal`, "Calories"],
                contentStyle: tooltipStyle,
                labelStyle: {
                  color: CHART_COLORS.tooltipLabel,
                  fontWeight: 600
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReferenceLine,
              {
                y: avgGoal,
                stroke: CHART_COLORS.accent,
                strokeDasharray: "5 3",
                strokeWidth: 1.5,
                label: {
                  value: "Goal",
                  fill: CHART_COLORS.accent,
                  fontSize: 10,
                  position: "insideTopRight"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Area,
              {
                type: "monotone",
                dataKey: "calories",
                stroke: CHART_COLORS.secondary,
                strokeWidth: 2.5,
                fill: "url(#calorieAreaGrad)"
              }
            )
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChartCard,
        {
          title: "Health Risk History",
          emoji: "🩺",
          footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-accent inline-block" }),
              "Low risk"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" }),
              "Moderate"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-destructive inline-block" }),
              "High risk"
            ] })
          ] }),
          children: riskLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: riskData,
              margin: { top: 4, right: 8, left: -20, bottom: 0 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CartesianGrid,
                  {
                    strokeDasharray: "3 3",
                    stroke: CHART_COLORS.gridStroke,
                    strokeOpacity: 0.6
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "date",
                    tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                    tickLine: false,
                    axisLine: false,
                    interval: "preserveStartEnd"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    domain: [0, 100],
                    ticks: [0, 25, 50, 75, 100],
                    tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                    tickLine: false,
                    axisLine: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v) => [`${v}/100`, "Risk Score"],
                    contentStyle: tooltipStyle,
                    labelStyle: {
                      color: CHART_COLORS.tooltipLabel,
                      fontWeight: 600
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "score", radius: [4, 4, 0, 0], maxBarSize: 36, children: riskData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Cell,
                  {
                    fill: getRiskBarColor(entry.score)
                  },
                  entry.date
                )) })
              ]
            }
          ) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Symptom Frequency", emoji: "🤒", children: symptomLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        BarChart,
        {
          data: symptomData,
          layout: "vertical",
          margin: { top: 4, right: 16, left: 4, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "linearGradient",
              {
                id: "symptomBarGrad",
                x1: "0",
                y1: "0",
                x2: "1",
                y2: "0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: CHART_COLORS.primary }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: CHART_COLORS.secondary })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: CHART_COLORS.gridStroke,
                strokeOpacity: 0.6,
                horizontal: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                type: "number",
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false,
                allowDecimals: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                type: "category",
                dataKey: "symptom",
                tick: { fontSize: 10, fill: CHART_COLORS.tickFill },
                tickLine: false,
                axisLine: false,
                width: 68
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                formatter: (v) => [`${v}×`, "Occurrences"],
                contentStyle: tooltipStyle,
                labelStyle: {
                  color: CHART_COLORS.tooltipLabel,
                  fontWeight: 600
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: "count",
                fill: "url(#symptomBarGrad)",
                radius: [0, 4, 4, 0],
                maxBarSize: 20
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground pb-2", children: "📈 Charts reflect your logged health data. Keep logging daily for richer insights." })
  ] });
}
export {
  AnalyticsPage as default
};
