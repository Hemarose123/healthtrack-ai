import { r as reactExports, M as MedicalCondition, j as jsxRuntimeExports, c as cn, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { h as useDietRecommendation } from "./useBackend-D3WuyYMJ.js";
import { m as motion } from "./proxy-bm9pCfPV.js";
import { A as AnimatePresence } from "./index-ZVjQZLXi.js";
const CONDITION_TABS = [
  { key: MedicalCondition.diabetes, label: "Diabetes", emoji: "🩸" },
  { key: MedicalCondition.pcod, label: "PCOD", emoji: "🌸" },
  { key: MedicalCondition.thyroid, label: "Thyroid", emoji: "🦋" },
  { key: MedicalCondition.obesity, label: "Obesity", emoji: "⚖️" },
  { key: MedicalCondition.none, label: "General", emoji: "🥗" }
];
const FOOD_EMOJIS = {
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
  soda: "🥤"
};
function getFoodEmoji(food) {
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
  "Sunday"
];
function DayAccordion({
  day,
  foods,
  index,
  defaultOpen
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `diet.day_accordion.${index + 1}`,
        onClick: () => setOpen((v) => !v),
        className: cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-smooth",
          open ? "bg-primary/8 text-primary border-b border-primary/20" : "bg-muted/40 text-foreground hover:bg-muted"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: open ? "📅" : "📆" }),
            day
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-xs transition-transform duration-200",
                open ? "rotate-180" : ""
              ),
              children: "▼"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { height: 0 },
        animate: { height: "auto" },
        exit: { height: 0 },
        transition: { duration: 0.25, ease: "easeInOut" },
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2", children: foods.map((food, fi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 p-2 rounded-md bg-muted/40 text-sm text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getFoodEmoji(food) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: food })
            ]
          },
          `${day}-food-${food.slice(0, 15)}-${fi}`
        )) })
      }
    ) })
  ] });
}
function DietPage() {
  const { data: recs, isLoading } = useDietRecommendation();
  const [activeTab, setActiveTab] = reactExports.useState(
    MedicalCondition.none
  );
  const allRecs = recs ?? [];
  const rec = allRecs.find((r) => r.condition === activeTab) ?? allRecs[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "🥗 Diet Recommendations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Personalized nutrition plans for your health condition" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full", dismissible: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            role: "tablist",
            "aria-label": "Select condition",
            className: "flex gap-2 overflow-x-auto pb-1",
            "data-ocid": "diet.condition_tabs",
            children: CONDITION_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": activeTab === tab.key,
                "data-ocid": `diet.condition_tab.${tab.key}`,
                onClick: () => setActiveTab(tab.key),
                className: cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-smooth shrink-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === tab.key ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/60"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label })
                ]
              },
              tab.key
            ))
          }
        )
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
    ] }) : !rec ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardContent,
      {
        "data-ocid": "diet.empty_state",
        className: "flex flex-col items-center py-12 gap-3 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🍽️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No diet plan available for this condition." })
        ]
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.3 },
        className: "space-y-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "✅ Recommended Foods" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: rec.recommendedFoods.map((food, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.94 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: i * 0.04 },
                "data-ocid": `diet.recommended_food.${i + 1}`,
                className: "flex items-center gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/20 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: getFoodEmoji(food) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground leading-tight min-w-0 truncate", children: food })
                ]
              },
              `rec-food-${food.slice(0, 15)}-${i}`
            )) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "❌ Foods to Avoid" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-ocid": "diet.avoid_foods_list", children: rec.avoidFoods.map((food, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.li,
              {
                initial: { opacity: 0, x: -8 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: i * 0.05 },
                "data-ocid": `diet.avoid_food.${i + 1}`,
                className: "flex items-center gap-2.5 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "❌" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: food })
                ]
              },
              `avoid-${food.slice(0, 15)}-${i}`
            )) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📅 7-Day Meal Plan" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "diet.week_plan_list", children: rec.sevenDayPlan.map((dayFoods, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              DayAccordion,
              {
                day: DAY_LABELS[i] ?? `Day ${i + 1}`,
                foods: dayFoods,
                index: i,
                defaultOpen: i === 0
              },
              `day-${DAY_LABELS[i] ?? i}`
            )) }) })
          ] }),
          rec.tips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "💡 Nutrition Tips" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", "data-ocid": "diet.tips_list", children: rec.tips.map((tip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.li,
              {
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: i * 0.06 },
                "data-ocid": `diet.tip.${i + 1}`,
                className: "flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold shrink-0 mt-0.5", children: "💡" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: tip })
                ]
              },
              `tip-${tip.slice(0, 20)}`
            )) }) })
          ] })
        ]
      },
      activeTab
    ) })
  ] });
}
export {
  DietPage as default
};
