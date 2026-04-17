import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { useLogMood, useMoodEntries } from "../hooks/useBackend";
import type { MoodEntry } from "../types";

const MOODS = [
  { score: 1, emoji: "😢", label: "Very Sad" },
  { score: 2, emoji: "😞", label: "Sad" },
  { score: 3, emoji: "😐", label: "Neutral" },
  { score: 4, emoji: "😊", label: "Happy" },
  { score: 5, emoji: "😄", label: "Very Happy" },
] as const;

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function moodEmoji(score: number) {
  return MOODS.find((m) => m.score === score)?.emoji ?? "😐";
}

function moodLabel(score: number) {
  return MOODS.find((m) => m.score === score)?.label ?? "Neutral";
}

export default function MoodTrackerPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const { data: summary, isLoading } = useMoodEntries("30d");
  const logMood = useLogMood();

  const entries: MoodEntry[] = summary?.entries ?? [];

  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
      .slice(-30)
      .map((e) => ({
        date: formatDate(e.timestamp),
        score: Number(e.score),
      }));
  }, [entries]);

  const weeklyAvg = useMemo(() => {
    const recent = entries.slice(0, 7);
    if (!recent.length) return null;
    return recent.reduce((s, e) => s + Number(e.score), 0) / recent.length;
  }, [entries]);

  const suggestion =
    weeklyAvg !== null
      ? weeklyAvg < 3
        ? "💙 Consider speaking to someone you trust — sharing helps."
        : "🌟 Keep it up! Your mood looks great this week."
      : null;

  async function handleSave() {
    if (selected === null) return;
    await logMood.mutateAsync({ score: BigInt(selected), note });
    setSelected(null);
    setNote("");
  }

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          🧠 Mood Tracker
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Log how you're feeling and track your emotional wellbeing over time
        </p>
      </motion.div>

      <MedicalDisclaimer variant="full" dismissible />

      {/* Log Mood Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Emoji selector */}
            <div
              className="flex items-center justify-between gap-2 mb-4"
              role="radiogroup"
              aria-label="Mood selector"
            >
              {MOODS.map((mood) => (
                <label
                  key={mood.score}
                  data-ocid={`mood.emoji_${mood.score}`}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl flex-1 transition-smooth border-2 cursor-pointer",
                    "focus-within:ring-2 focus-within:ring-ring",
                    selected === mood.score
                      ? "border-primary bg-primary/10 scale-105 shadow-md"
                      : "border-transparent bg-muted/40 hover:bg-muted hover:border-border",
                  )}
                >
                  <input
                    type="radio"
                    name="mood"
                    value={mood.score}
                    checked={selected === mood.score}
                    onChange={() => setSelected(mood.score)}
                    className="sr-only"
                  />
                  <span className="text-3xl leading-none">{mood.emoji}</span>
                  <span className="text-[10px] font-medium text-muted-foreground leading-none hidden sm:block">
                    {mood.label}
                  </span>
                </label>
              ))}
            </div>

            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4"
              >
                <p className="text-sm font-medium text-foreground mb-2">
                  {moodEmoji(selected)} {moodLabel(selected)} — add a note
                  (optional)
                </p>
                <Textarea
                  data-ocid="mood.note_input"
                  placeholder="What's on your mind? (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                />
              </motion.div>
            )}

            <Button
              data-ocid="mood.save_button"
              onClick={handleSave}
              disabled={selected === null || logMood.isPending}
              className="w-full btn-primary border-0"
            >
              {logMood.isPending ? "Saving..." : "💾 Save Mood"}
            </Button>

            {logMood.isSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="mood.success_state"
                className="text-center text-sm text-accent mt-2"
              >
                ✅ Mood logged successfully!
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly insight */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3"
          data-ocid="mood.suggestion_panel"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">Weekly Insight</p>
            <p className="text-sm text-foreground mt-0.5">{suggestion}</p>
          </div>
          {weeklyAvg !== null && (
            <Badge className="badge-blue shrink-0 self-start mt-0.5">
              Avg {weeklyAvg.toFixed(1)} / 5
            </Badge>
          )}
        </motion.div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>📈 Mood Trend — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-border border-t-primary animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div
                data-ocid="mood.chart_empty_state"
                className="h-44 flex flex-col items-center justify-center text-muted-foreground"
              >
                <span className="text-3xl mb-2">📊</span>
                <p className="text-sm">
                  No data yet — start logging your mood!
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [
                      `${moodEmoji(v)} ${moodLabel(v)} (${v})`,
                      "Mood",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.48 0.14 232)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "oklch(0.48 0.14 232)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>📋 Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <CardSkeleton />
            ) : entries.length === 0 ? (
              <div
                data-ocid="mood.history_empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <span className="text-4xl block mb-2">🗒️</span>
                <p className="text-sm">No mood entries yet. Start logging!</p>
              </div>
            ) : (
              <ul className="space-y-2" data-ocid="mood.history_list">
                {[...entries]
                  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .slice(0, 15)
                  .map((entry, i) => (
                    <motion.li
                      key={String(entry.id)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`mood.history_item.${i + 1}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/40"
                    >
                      <span className="text-2xl">
                        {moodEmoji(Number(entry.score))}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {moodLabel(Number(entry.score))}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.note}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(entry.timestamp)}
                      </span>
                    </motion.li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
