import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { useDietRecommendation } from "../hooks/useBackend";
import { MedicalCondition } from "../types";
import type { DietRecommendation } from "../types";

/* ─── Condition tab config ───────────────────────────────── */
const CONDITION_TABS = [
  { key: MedicalCondition.diabetes, label: "Diabetes", emoji: "🩸" },
  { key: MedicalCondition.pcod, label: "PCOD", emoji: "🌸" },
  { key: MedicalCondition.thyroid, label: "Thyroid", emoji: "🦋" },
  { key: MedicalCondition.obesity, label: "Obesity", emoji: "⚖️" },
  { key: MedicalCondition.none, label: "General", emoji: "🥗" },
] as const;

/* ─── Food emoji mapping ─────────────────────────────────── */
const FOOD_EMOJIS: Record<string, string> = {
  rice: "🍚",
  dal: "🫘",
  lentil: "🫘",
  bread: "🍞",
  roti: "🫓",
  vegetable: "🥦",
  salad: "🥗",
  fruit: "🍎",
  apple: "🍎",
  banana: "🍌",
  milk: "🥛",
  yogurt: "🍶",
  egg: "🥚",
  chicken: "🍗",
  fish: "🐟",
  oats: "🌾",
  nuts: "🥜",
  water: "💧",
  tea: "🍵",
  coffee: "☕",
  sweet: "🍬",
  sugar: "🍬",
  fried: "🍟",
  junk: "🌭",
  soda: "🥤",
};

function getFoodEmoji(food: string) {
  const lower = food.toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🥘";
}

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* ─── Accordion item ─────────────────────────────────────── */
function DayAccordion({
  day,
  foods,
  index,
  defaultOpen,
}: {
  day: string;
  foods: string[];
  index: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden">
      <button
        type="button"
        data-ocid={`diet.day_accordion.${index + 1}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-smooth",
          open
            ? "bg-primary/8 text-primary border-b border-primary/20"
            : "bg-muted/40 text-foreground hover:bg-muted",
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{open ? "📅" : "📆"}</span>
          {day}
        </span>
        <span
          className={cn(
            "text-xs transition-transform duration-200",
            open ? "rotate-180" : "",
          )}
        >
          ▼
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {foods.map((food, fi) => (
                <div
                  key={`${day}-food-${food.slice(0, 15)}-${fi}`}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-sm text-foreground"
                >
                  <span>{getFoodEmoji(food)}</span>
                  <span>{food}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function DietPage() {
  const { data: recs, isLoading } = useDietRecommendation();
  const [activeTab, setActiveTab] = useState<MedicalCondition>(
    MedicalCondition.none,
  );

  const allRecs = (recs ?? []) as DietRecommendation[];
  const rec: DietRecommendation | undefined =
    allRecs.find((r) => r.condition === activeTab) ?? allRecs[0];

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          🥗 Diet Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalized nutrition plans for your health condition
        </p>
      </motion.div>

      <MedicalDisclaimer variant="full" dismissible />

      {/* Condition tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div
          role="tablist"
          aria-label="Select condition"
          className="flex gap-2 overflow-x-auto pb-1"
          data-ocid="diet.condition_tabs"
        >
          {CONDITION_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              data-ocid={`diet.condition_tab.${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-smooth shrink-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/60",
              )}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !rec ? (
        <Card variant="elevated">
          <CardContent
            data-ocid="diet.empty_state"
            className="flex flex-col items-center py-12 gap-3 text-muted-foreground"
          >
            <span className="text-5xl">🍽️</span>
            <p className="text-sm">
              No diet plan available for this condition.
            </p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Recommended foods */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>✅ Recommended Foods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {rec.recommendedFoods.map((food, i) => (
                    <motion.div
                      key={`rec-food-${food.slice(0, 15)}-${i}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`diet.recommended_food.${i + 1}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/20 text-sm"
                    >
                      <span className="text-xl">{getFoodEmoji(food)}</span>
                      <span className="text-foreground leading-tight min-w-0 truncate">
                        {food}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Foods to avoid */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>❌ Foods to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" data-ocid="diet.avoid_foods_list">
                  {rec.avoidFoods.map((food, i) => (
                    <motion.li
                      key={`avoid-${food.slice(0, 15)}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-ocid={`diet.avoid_food.${i + 1}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <span className="text-base">❌</span>
                      <span className="text-sm text-foreground">{food}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 7-day plan */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>📅 7-Day Meal Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2" data-ocid="diet.week_plan_list">
                  {rec.sevenDayPlan.map((dayFoods, i) => (
                    <DayAccordion
                      key={`day-${DAY_LABELS[i] ?? i}`}
                      day={DAY_LABELS[i] ?? `Day ${i + 1}`}
                      foods={dayFoods}
                      index={i}
                      defaultOpen={i === 0}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            {rec.tips.length > 0 && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>💡 Nutrition Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5" data-ocid="diet.tips_list">
                    {rec.tips.map((tip, i) => (
                      <motion.li
                        key={`tip-${tip.slice(0, 20)}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        data-ocid={`diet.tip.${i + 1}`}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15"
                      >
                        <span className="text-primary font-bold shrink-0 mt-0.5">
                          💡
                        </span>
                        <p className="text-sm text-foreground">{tip}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
