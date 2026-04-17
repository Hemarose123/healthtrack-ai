import { j as jsxRuntimeExports, C as CardSkeleton, b as Link, r as reactExports, R as RiskLevel } from "./index-B1i-rzHQ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardFooter } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { P as ProgressRing } from "./ProgressRing-C85Hl_Z0.js";
import { c as useMyProfile, d as useDailySummary, e as useMoodEntries, f as useLatestRiskScore, g as useDailyTip, h as useDietRecommendation } from "./useBackend-D3WuyYMJ.js";
import { m as motion } from "./proxy-bm9pCfPV.js";
function todayDateString() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function riskLevelLabel(level) {
  if (level === RiskLevel.green)
    return { label: "Low Risk", badge: "badge-green", ring: "green" };
  if (level === RiskLevel.yellow)
    return { label: "Moderate", badge: "badge-yellow", ring: "yellow" };
  return { label: "High Risk", badge: "badge-red", ring: "red" };
}
const MOOD_EMOJIS = {
  1: "😔",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😄"
};
const QUICK_ACTIONS = [
  {
    emoji: "🍽️",
    label: "Scan Food",
    to: "/food-scanner",
    ocid: "dashboard.scan_food.button"
  },
  {
    emoji: "😊",
    label: "Log Mood",
    to: "/mood-tracker",
    ocid: "dashboard.log_mood.button"
  },
  {
    emoji: "🔍",
    label: "Check Symptoms",
    to: "/symptoms",
    ocid: "dashboard.symptoms.button"
  },
  {
    emoji: "📄",
    label: "Get Report",
    to: "/report",
    ocid: "dashboard.report.button"
  }
];
function CalorieSummaryCard({ date }) {
  var _a;
  const { data: summary, isLoading } = useDailySummary(date);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {});
  const typedSummary = summary;
  const consumed = Number((typedSummary == null ? void 0 : typedSummary.totalCalories) ?? 0);
  const goal = Number((typedSummary == null ? void 0 : typedSummary.goal) ?? 2e3);
  const pct = goal > 0 ? Math.round(consumed / goal * 100) : 0;
  const mealCount = ((_a = typedSummary == null ? void 0 : typedSummary.meals) == null ? void 0 : _a.length) ?? 0;
  const ringVariant = pct < 80 ? "green" : pct <= 100 ? "yellow" : "red";
  const statusLabel = pct < 80 ? "On track" : pct <= 100 ? "Near goal" : "Over goal";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", hover: true, "data-ocid": "dashboard.calorie_summary.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🍽️ Daily Calories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: pct < 80 ? "badge-green" : pct <= 100 ? "badge-yellow" : "badge-red",
          children: statusLabel
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProgressRing,
        {
          value: Math.min(pct, 100),
          size: 88,
          variant: ringVariant,
          label: `${pct}%`,
          sublabel: "of goal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: consumed.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "of ",
            goal.toLocaleString(),
            " kcal goal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          mealCount,
          " meal",
          mealCount !== 1 ? "s" : "",
          " logged today"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/food-scanner",
          "data-ocid": "dashboard.log_meal.button",
          className: "btn-primary text-xs flex-1 text-center",
          children: "+ Log Meal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/food-scanner",
          "data-ocid": "dashboard.scan_food_link.button",
          className: "btn-secondary text-xs flex-1 text-center",
          children: "📷 Scan Plate"
        }
      )
    ] })
  ] });
}
function MoodSummaryCard() {
  const { data: moodSummary, isLoading } = useMoodEntries("today");
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {});
  const typedMood = moodSummary;
  const entries = (typedMood == null ? void 0 : typedMood.entries) ?? [];
  const latestEntry = entries[entries.length - 1];
  const todayScore = latestEntry ? Number(latestEntry.score) : 0;
  const streak = entries.length;
  const emoji = MOOD_EMOJIS[todayScore] ?? "😐";
  const moodLabel = todayScore === 0 ? "Not logged yet" : todayScore >= 4 ? "Feeling great!" : todayScore === 3 ? "Doing okay" : "Needs attention";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", hover: true, "data-ocid": "dashboard.mood_summary.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "😊 Mood Today" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl leading-none", children: todayScore > 0 ? emoji : "❓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: moodLabel }),
        streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "🔥 ",
          streak,
          "-day streak"
        ] }),
        todayScore > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Score: ",
          todayScore,
          "/5"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/mood-tracker",
          "data-ocid": "dashboard.log_mood_link.button",
          className: "btn-primary text-xs flex-1 text-center",
          children: todayScore > 0 ? "Update Mood" : "Log Mood"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/mood-tracker",
          "data-ocid": "dashboard.mood_history.button",
          className: "text-xs text-primary underline underline-offset-2",
          children: "View History →"
        }
      )
    ] })
  ] });
}
function HealthRiskCard() {
  const { data: riskEntry, isLoading } = useLatestRiskScore();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {});
  const typedRisk = riskEntry;
  const score = typedRisk ? Number(typedRisk.score) : null;
  const level = (typedRisk == null ? void 0 : typedRisk.riskLevel) ?? null;
  const bmi = typedRisk ? typedRisk.bmi.toFixed(1) : null;
  const { label, badge, ring } = level ? riskLevelLabel(level) : { label: "Not calculated", badge: "badge-blue", ring: "green" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", hover: true, "data-ocid": "dashboard.health_risk.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🏥 Health Risk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: badge, children: label })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: score !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProgressRing,
        {
          value: score,
          size: 88,
          variant: ring,
          label: `${score}`,
          sublabel: "risk score"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 min-w-0", children: bmi && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: bmi }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "BMI" })
      ] }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "📊" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "No assessment yet. Calculate your health risk score." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/health-risk",
        "data-ocid": "dashboard.risk_details.button",
        className: "btn-primary text-xs flex-1 text-center",
        children: score !== null ? "View Details" : "Calculate Score"
      }
    ) })
  ] });
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
      label: "Exercise"
    },
    {
      keyword: ["eat", "food", "diet", "nutrition", "fruit", "vegetable"],
      emoji: "🥗",
      label: "Nutrition"
    },
    {
      keyword: ["breath", "meditat", "stress", "calm"],
      emoji: "🧘",
      label: "Mindfulness"
    }
  ];
  const matched = reactExports.useMemo(() => {
    const lower = tipText.toLowerCase();
    return categories.find((c) => c.keyword.some((k) => lower.includes(k))) ?? {
      emoji: "💡",
      label: "Wellness"
    };
  }, [tipText]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", hover: true, "data-ocid": "dashboard.daily_tip.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "💡 Daily Tip" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-blue", children: [
        matched.emoji,
        " ",
        matched.label
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: tipText || "Stay consistent with your healthy habits today — small steps lead to big changes! 🌟" }) })
  ] });
}
function QuickActionsCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "dashboard.quick_actions.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "⚡ Quick Actions" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: QUICK_ACTIONS.map(({ emoji, label, to, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        "data-ocid": ocid,
        className: "flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/60 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-smooth group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl leading-none group-hover:scale-110 transition-smooth", children: emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground text-center leading-tight", children: label })
        ]
      },
      to
    )) }) })
  ] });
}
function DietRecommendationCard() {
  var _a;
  const { data: dietItems, isLoading } = useDietRecommendation();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {});
  const typedDiet = dietItems;
  const firstRec = (typedDiet == null ? void 0 : typedDiet[0]) ?? null;
  const topFoods = ((_a = firstRec == null ? void 0 : firstRec.recommendedFoods) == null ? void 0 : _a.slice(0, 3)) ?? [];
  const condition = (firstRec == null ? void 0 : firstRec.condition) ?? "";
  const tips = (firstRec == null ? void 0 : firstRec.tips) ?? [];
  const CONDITION_EMOJIS = {
    diabetes: "🍏",
    obesity: "🥦",
    pcod: "🫐",
    thyroid: "🐟",
    none: "🥗"
  };
  const conditionEmoji = CONDITION_EMOJIS[condition] ?? CONDITION_EMOJIS.none;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      variant: "elevated",
      hover: true,
      "data-ocid": "dashboard.diet_recommendation.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🥗 Today's Diet" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: topFoods.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-ocid": "dashboard.diet_list", children: topFoods.map((foodName, i) => {
          const itemIndex = i + 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              "data-ocid": `dashboard.diet_item.${itemIndex}`,
              className: "flex items-center gap-3 p-2 rounded-md bg-muted/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: conditionEmoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: foodName }),
                  tips[i] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: tips[i] })
                ] })
              ]
            },
            foodName
          );
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-4 gap-2",
            "data-ocid": "dashboard.diet_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "🥗" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Complete your health profile to get personalized diet tips." })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/diet-recommendations",
            "data-ocid": "dashboard.diet_full.button",
            className: "btn-accent text-xs flex-1 text-center",
            children: "View Full Plan →"
          }
        ) })
      ]
    }
  );
}
function DashboardPage() {
  var _a, _b;
  const { data: profile } = useMyProfile();
  const today = todayDateString();
  const firstName = ((_b = (_a = profile == null ? void 0 : profile.basicInfo) == null ? void 0 : _a.name) == null ? void 0 : _b.split(" ")[0]) ?? "there";
  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay,
      ease: [0.4, 0, 0.2, 1]
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { ...fadeUp(0), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground", children: [
        "👋 Hello, ",
        firstName,
        "!"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.05), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalorieSummaryCard, { date: today }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoodSummaryCard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.15), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthRiskCard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.2), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DailyTipCard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.25), children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionsCard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.3), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DietRecommendationCard, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeUp(0.35), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "compact", dismissible: true, className: "mt-2" }) })
  ] });
}
export {
  DashboardPage as default
};
