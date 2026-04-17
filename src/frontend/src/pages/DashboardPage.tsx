import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { ProgressRing } from "../components/ui/ProgressRing";
import {
  useDailySummary,
  useDailyTip,
  useDietRecommendation,
  useLatestRiskScore,
  useMoodEntries,
  useMyProfile,
} from "../hooks/useBackend";
import {
  type DailyCalorieSummary,
  type DietRecommendation,
  type MoodSummary,
  RiskLevel,
  type RiskScoreEntry,
} from "../types";

// ── helpers ────────────────────────────────────────────────────────────────────

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

function riskLevelLabel(level: RiskLevel): {
  label: string;
  badge: string;
  ring: "green" | "yellow" | "red";
} {
  if (level === RiskLevel.green)
    return { label: "Low Risk", badge: "badge-green", ring: "green" };
  if (level === RiskLevel.yellow)
    return { label: "Moderate", badge: "badge-yellow", ring: "yellow" };
  return { label: "High Risk", badge: "badge-red", ring: "red" };
}

const MOOD_EMOJIS: Record<number, string> = {
  1: "😔",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const QUICK_ACTIONS = [
  {
    emoji: "🍽️",
    label: "Scan Food",
    to: "/food-scanner",
    ocid: "dashboard.scan_food.button",
  },
  {
    emoji: "😊",
    label: "Log Mood",
    to: "/mood-tracker",
    ocid: "dashboard.log_mood.button",
  },
  {
    emoji: "🔍",
    label: "Check Symptoms",
    to: "/symptoms",
    ocid: "dashboard.symptoms.button",
  },
  {
    emoji: "📄",
    label: "Get Report",
    to: "/report",
    ocid: "dashboard.report.button",
  },
];

// ── sub-components ─────────────────────────────────────────────────────────────

function CalorieSummaryCard({ date }: { date: string }) {
  const { data: summary, isLoading } = useDailySummary(date);

  if (isLoading) return <CardSkeleton />;

  const typedSummary = summary as DailyCalorieSummary | null;
  const consumed = Number(typedSummary?.totalCalories ?? 0);
  const goal = Number(typedSummary?.goal ?? 2000);
  const pct = goal > 0 ? Math.round((consumed / goal) * 100) : 0;
  const mealCount = typedSummary?.meals?.length ?? 0;
  const ringVariant = pct < 80 ? "green" : pct <= 100 ? "yellow" : "red";
  const statusLabel =
    pct < 80 ? "On track" : pct <= 100 ? "Near goal" : "Over goal";

  return (
    <Card variant="elevated" hover data-ocid="dashboard.calorie_summary.card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🍽️ Daily Calories</CardTitle>
          <span
            className={
              pct < 80
                ? "badge-green"
                : pct <= 100
                  ? "badge-yellow"
                  : "badge-red"
            }
          >
            {statusLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <ProgressRing
            value={Math.min(pct, 100)}
            size={88}
            variant={ringVariant}
            label={`${pct}%`}
            sublabel="of goal"
          />
          <div className="flex-1 space-y-2 min-w-0">
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {consumed.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                of {goal.toLocaleString()} kcal goal
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {mealCount} meal{mealCount !== 1 ? "s" : ""} logged today
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to="/food-scanner"
          data-ocid="dashboard.log_meal.button"
          className="btn-primary text-xs flex-1 text-center"
        >
          + Log Meal
        </Link>
        <Link
          to="/food-scanner"
          data-ocid="dashboard.scan_food_link.button"
          className="btn-secondary text-xs flex-1 text-center"
        >
          📷 Scan Plate
        </Link>
      </CardFooter>
    </Card>
  );
}

function MoodSummaryCard() {
  const { data: moodSummary, isLoading } = useMoodEntries("today");

  if (isLoading) return <CardSkeleton />;

  const typedMood = moodSummary as MoodSummary | null;
  const entries = typedMood?.entries ?? [];
  const latestEntry = entries[entries.length - 1];
  const todayScore = latestEntry ? Number(latestEntry.score) : 0;
  const streak = entries.length;
  const emoji = MOOD_EMOJIS[todayScore] ?? "😐";
  const moodLabel =
    todayScore === 0
      ? "Not logged yet"
      : todayScore >= 4
        ? "Feeling great!"
        : todayScore === 3
          ? "Doing okay"
          : "Needs attention";

  return (
    <Card variant="elevated" hover data-ocid="dashboard.mood_summary.card">
      <CardHeader>
        <CardTitle>😊 Mood Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-5xl leading-none">
            {todayScore > 0 ? emoji : "❓"}
          </span>
          <div className="space-y-1 min-w-0">
            <p className="font-display font-semibold text-foreground">
              {moodLabel}
            </p>
            {streak > 0 && (
              <p className="text-sm text-muted-foreground">
                🔥 {streak}-day streak
              </p>
            )}
            {todayScore > 0 && (
              <p className="text-xs text-muted-foreground">
                Score: {todayScore}/5
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to="/mood-tracker"
          data-ocid="dashboard.log_mood_link.button"
          className="btn-primary text-xs flex-1 text-center"
        >
          {todayScore > 0 ? "Update Mood" : "Log Mood"}
        </Link>
        <Link
          to="/mood-tracker"
          data-ocid="dashboard.mood_history.button"
          className="text-xs text-primary underline underline-offset-2"
        >
          View History →
        </Link>
      </CardFooter>
    </Card>
  );
}

function HealthRiskCard() {
  const { data: riskEntry, isLoading } = useLatestRiskScore();

  if (isLoading) return <CardSkeleton />;

  const typedRisk = riskEntry as RiskScoreEntry | null;
  const score = typedRisk ? Number(typedRisk.score) : null;
  const level = typedRisk?.riskLevel ?? null;
  const bmi = typedRisk ? typedRisk.bmi.toFixed(1) : null;
  const { label, badge, ring } = level
    ? riskLevelLabel(level)
    : { label: "Not calculated", badge: "badge-blue", ring: "green" as const };

  return (
    <Card variant="elevated" hover data-ocid="dashboard.health_risk.card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🏥 Health Risk</CardTitle>
          <span className={badge}>{label}</span>
        </div>
      </CardHeader>
      <CardContent>
        {score !== null ? (
          <div className="flex items-center gap-5">
            <ProgressRing
              value={score}
              size={88}
              variant={ring}
              label={`${score}`}
              sublabel="risk score"
            />
            <div className="space-y-1 min-w-0">
              {bmi && (
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {bmi}
                  </p>
                  <p className="text-xs text-muted-foreground">BMI</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-3 gap-2">
            <span className="text-4xl">📊</span>
            <p className="text-sm text-muted-foreground text-center">
              No assessment yet. Calculate your health risk score.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          to="/health-risk"
          data-ocid="dashboard.risk_details.button"
          className="btn-primary text-xs flex-1 text-center"
        >
          {score !== null ? "View Details" : "Calculate Score"}
        </Link>
      </CardFooter>
    </Card>
  );
}

function DailyTipCard() {
  const { data: tip, isLoading } = useDailyTip();

  const tipText = typeof tip === "string" ? tip : "";

  const categories = [
    { keyword: ["water", "hydrat"], emoji: "💧", label: "Hydration" },
    { keyword: ["sleep", "rest"], emoji: "😴", label: "Sleep" },
    {
      keyword: ["exercise", "walk", "move", "yoga"],
      emoji: "🏃",
      label: "Exercise",
    },
    {
      keyword: ["eat", "food", "diet", "nutrition", "fruit", "vegetable"],
      emoji: "🥗",
      label: "Nutrition",
    },
    {
      keyword: ["breath", "meditat", "stress", "calm"],
      emoji: "🧘",
      label: "Mindfulness",
    },
  ];

  const matched = useMemo(() => {
    const lower = tipText.toLowerCase();
    return (
      categories.find((c) => c.keyword.some((k) => lower.includes(k))) ?? {
        emoji: "💡",
        label: "Wellness",
      }
    );
  }, [tipText]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card variant="elevated" hover data-ocid="dashboard.daily_tip.card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>💡 Daily Tip</CardTitle>
          <span className="badge-blue">
            {matched.emoji} {matched.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">
          {tipText ||
            "Stay consistent with your healthy habits today — small steps lead to big changes! 🌟"}
        </p>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card variant="elevated" data-ocid="dashboard.quick_actions.card">
      <CardHeader>
        <CardTitle>⚡ Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ emoji, label, to, ocid }) => (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/60 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-smooth group"
            >
              <span className="text-3xl leading-none group-hover:scale-110 transition-smooth">
                {emoji}
              </span>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DietRecommendationCard() {
  const { data: dietItems, isLoading } = useDietRecommendation();

  if (isLoading) return <CardSkeleton />;

  const typedDiet = dietItems as DietRecommendation[] | null;
  // Show top 3 recommended foods from the first recommendation
  const firstRec = typedDiet?.[0] ?? null;
  const topFoods = firstRec?.recommendedFoods?.slice(0, 3) ?? [];
  const condition = firstRec?.condition ?? "";
  const tips = firstRec?.tips ?? [];

  const CONDITION_EMOJIS: Record<string, string> = {
    diabetes: "🍏",
    obesity: "🥦",
    pcod: "🫐",
    thyroid: "🐟",
    none: "🥗",
  };
  const conditionEmoji = CONDITION_EMOJIS[condition] ?? CONDITION_EMOJIS.none;

  return (
    <Card
      variant="elevated"
      hover
      data-ocid="dashboard.diet_recommendation.card"
    >
      <CardHeader>
        <CardTitle>🥗 Today's Diet</CardTitle>
      </CardHeader>
      <CardContent>
        {topFoods.length > 0 ? (
          <ul className="space-y-2" data-ocid="dashboard.diet_list">
            {topFoods.map((foodName, i) => {
              const itemIndex = i + 1;
              return (
                <li
                  key={foodName}
                  data-ocid={`dashboard.diet_item.${itemIndex}`}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/40"
                >
                  <span className="text-xl leading-none">{conditionEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {foodName}
                    </p>
                    {tips[i] && (
                      <p className="text-xs text-muted-foreground truncate">
                        {tips[i]}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className="flex flex-col items-center py-4 gap-2"
            data-ocid="dashboard.diet_empty_state"
          >
            <span className="text-4xl">🥗</span>
            <p className="text-sm text-muted-foreground text-center">
              Complete your health profile to get personalized diet tips.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          to="/diet-recommendations"
          data-ocid="dashboard.diet_full.button"
          className="btn-accent text-xs flex-1 text-center"
        >
          View Full Plan →
        </Link>
      </CardFooter>
    </Card>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: profile } = useMyProfile();
  const today = todayDateString();

  const firstName =
    (
      profile as { basicInfo?: { name?: string } } | null
    )?.basicInfo?.name?.split(" ")[0] ?? "there";

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  });

  return (
    <div className="page-container space-y-6" data-ocid="dashboard.page">
      {/* Header greeting */}
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display font-bold text-2xl text-foreground">
          👋 Hello, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div {...fadeUp(0.05)}>
          <CalorieSummaryCard date={today} />
        </motion.div>

        <motion.div {...fadeUp(0.1)}>
          <MoodSummaryCard />
        </motion.div>

        <motion.div {...fadeUp(0.15)}>
          <HealthRiskCard />
        </motion.div>

        <motion.div {...fadeUp(0.2)}>
          <DailyTipCard />
        </motion.div>

        <motion.div {...fadeUp(0.25)}>
          <QuickActionsCard />
        </motion.div>

        <motion.div {...fadeUp(0.3)}>
          <DietRecommendationCard />
        </motion.div>
      </div>

      {/* Medical disclaimer */}
      <motion.div {...fadeUp(0.35)}>
        <MedicalDisclaimer variant="compact" dismissible className="mt-2" />
      </motion.div>
    </div>
  );
}
