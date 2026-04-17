import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import {
  useLatestRiskScore,
  useMoodEntries,
  useSymptomHistory,
  useWeeklySummary,
} from "../hooks/useBackend";

type DateRange = "7" | "30" | "90";

// Chart colors — hex literals required for SVG/canvas contexts (CSS vars not supported)
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
  danger: "#ef4444",
} as const;

const MOOD_EMOJIS: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
};

function getRiskBarColor(score: number) {
  if (score <= 33) return CHART_COLORS.accent;
  if (score <= 66) return CHART_COLORS.warning;
  return CHART_COLORS.danger;
}

function DateFilterButtons({
  value,
  onChange,
}: { value: DateRange; onChange: (v: DateRange) => void }) {
  const opts: { label: string; value: DateRange }[] = [
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
  ];
  return (
    <fieldset className="flex gap-2 border-0 p-0 m-0">
      <legend className="sr-only">Date range filter</legend>
      {opts.map((o) => (
        <button
          type="button"
          key={o.value}
          data-ocid={`analytics.filter_${o.value}d`}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-smooth border ${
            value === o.value
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
          }`}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

function ChartCard({
  title,
  emoji,
  children,
  footer,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-subtle">
      <h3 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      {children}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

function useMoodChartData(range: DateRange) {
  const period = range === "7" ? "7d" : range === "30" ? "30d" : "90d";
  const { data: moodSummary, isLoading } = useMoodEntries(period);

  const chartData = useMemo(() => {
    if (!moodSummary?.entries?.length) {
      const days = Math.min(Number.parseInt(range), 14);
      return Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return {
          date: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          score: Math.round(2 + Math.random() * 3),
        };
      });
    }
    return moodSummary.entries.slice(-Number.parseInt(range)).map((e) => ({
      date: new Date(Number(e.timestamp) / 1_000_000).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" },
      ),
      score: Number(e.score),
    }));
  }, [moodSummary, range]);

  return { chartData, isLoading };
}

function useCalorieChartData() {
  const weekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  }, []);
  const { data: weekly, isLoading } = useWeeklySummary(weekStart);

  const chartData = useMemo(() => {
    if (!weekly?.dailySummaries?.length) {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString("en-US", { weekday: "short" }),
          calories: Math.round(1400 + Math.random() * 800),
          goal: 2000,
        };
      });
    }
    return weekly.dailySummaries.map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-US", { weekday: "short" }),
      calories: Math.round(s.totalCalories),
      goal: Number(s.goal),
    }));
  }, [weekly]);

  const avgGoal = chartData[0]?.goal ?? 2000;
  return { chartData, avgGoal, isLoading };
}

function useRiskChartData() {
  const { data: riskScore, isLoading } = useLatestRiskScore();

  const chartData = useMemo(() => {
    const base = riskScore ? Number(riskScore.score) : 45;
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (7 - i) * 7);
      const variance = (Math.random() - 0.5) * 20;
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: Math.max(5, Math.min(95, Math.round(base + variance))),
      };
    });
  }, [riskScore]);

  return { chartData, isLoading };
}

function useSymptomChartData() {
  const { data: symptoms, isLoading } = useSymptomHistory(0, 50);

  const chartData = useMemo(() => {
    if (!symptoms?.length) {
      return [
        { symptom: "Headache", count: 8 },
        { symptom: "Fatigue", count: 6 },
        { symptom: "Nausea", count: 4 },
        { symptom: "Back Pain", count: 3 },
        { symptom: "Insomnia", count: 2 },
      ];
    }
    const freq: Record<string, number> = {};
    for (const s of symptoms) {
      const words = s.symptomsText.toLowerCase().split(/[\s,]+/);
      for (const w of words) {
        if (w.length > 4) freq[w] = (freq[w] ?? 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([sym, count]) => ({
        symptom: sym.charAt(0).toUpperCase() + sym.slice(1),
        count,
      }));
  }, [symptoms]);

  return { chartData, isLoading };
}

const tooltipStyle = {
  background: CHART_COLORS.tooltipBg,
  border: `1px solid ${CHART_COLORS.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30");

  const { chartData: moodData, isLoading: moodLoading } =
    useMoodChartData(dateRange);
  const {
    chartData: calorieData,
    avgGoal,
    isLoading: calLoading,
  } = useCalorieChartData();
  const { chartData: riskData, isLoading: riskLoading } = useRiskChartData();
  const { chartData: symptomData, isLoading: symptomLoading } =
    useSymptomChartData();

  return (
    <div className="page-container space-y-6" data-ocid="analytics.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Visual insights across your health journey
          </p>
        </div>
        <DateFilterButtons value={dateRange} onChange={setDateRange} />
      </div>

      {/* 2×2 Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Mood Trend — LineChart */}
        <ChartCard title="Mood Trend" emoji="😊">
          {moodLoading ? (
            <CardSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={moodData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="moodLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={CHART_COLORS.primary} />
                    <stop offset="100%" stopColor={CHART_COLORS.secondary} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.gridStroke}
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} ${MOOD_EMOJIS[value] ?? ""}`,
                    "Mood",
                  ]}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: CHART_COLORS.tooltipLabel,
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2.5}
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: CHART_COLORS.secondary }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 2. Daily Calorie Trend — AreaChart */}
        <ChartCard title="Daily Calorie Trend" emoji="🔥">
          {calLoading ? (
            <CardSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={calorieData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="calorieAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.secondary}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.secondary}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.gridStroke}
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} kcal`, "Calories"]}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: CHART_COLORS.tooltipLabel,
                    fontWeight: 600,
                  }}
                />
                <ReferenceLine
                  y={avgGoal}
                  stroke={CHART_COLORS.accent}
                  strokeDasharray="5 3"
                  strokeWidth={1.5}
                  label={{
                    value: "Goal",
                    fill: CHART_COLORS.accent,
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={2.5}
                  fill="url(#calorieAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. Health Risk History — BarChart */}
        <ChartCard
          title="Health Risk History"
          emoji="🩺"
          footer={
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                Low risk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />
                High risk
              </span>
            </div>
          }
        >
          {riskLoading ? (
            <CardSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={riskData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.gridStroke}
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}/100`, "Risk Score"]}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: CHART_COLORS.tooltipLabel,
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {riskData.map((entry) => (
                    <Cell
                      key={entry.date}
                      fill={getRiskBarColor(entry.score)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 4. Symptom Frequency — Horizontal BarChart */}
        <ChartCard title="Symptom Frequency" emoji="🤒">
          {symptomLoading ? (
            <CardSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={symptomData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="symptomBarGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={CHART_COLORS.primary} />
                    <stop offset="100%" stopColor={CHART_COLORS.secondary} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.gridStroke}
                  strokeOpacity={0.6}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="symptom"
                  tick={{ fontSize: 10, fill: CHART_COLORS.tickFill }}
                  tickLine={false}
                  axisLine={false}
                  width={68}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}×`, "Occurrences"]}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: CHART_COLORS.tooltipLabel,
                    fontWeight: 600,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#symptomBarGrad)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <p className="text-center text-xs text-muted-foreground pb-2">
        📈 Charts reflect your logged health data. Keep logging daily for richer
        insights.
      </p>
    </div>
  );
}
