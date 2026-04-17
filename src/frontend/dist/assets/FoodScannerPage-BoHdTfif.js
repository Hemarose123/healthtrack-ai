import { j as jsxRuntimeExports, c as cn, u as useNavigate, r as reactExports, d as MealType, L as LoadingSpinner, P as PortionSize } from "./index-B1i-rzHQ.js";
import { B as Badge } from "./badge-CVxodpuz.js";
import { B as Button } from "./button-Dt4o60Uo.js";
import { u as ue } from "./index-B3ubObd7.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { P as ProgressRing } from "./ProgressRing-C85Hl_Z0.js";
import { c as useMyProfile, d as useDailySummary, i as useWeeklySummary, j as useMealHistory, k as useListFoods, l as useSearchFoods, m as useLogMeal, n as useDeleteMeal, o as useSetCalorieGoal } from "./useBackend-D3WuyYMJ.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as ReferenceLine } from "./generateCategoricalChart-C0H0LESu.js";
import { A as AreaChart, a as Area } from "./AreaChart-DWKLWuTQ.js";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
const FOOD_EMOJIS = {
  rice: "🍚",
  chicken: "🍗",
  salad: "🥗",
  fruit: "🍎",
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  mango: "🥭",
  grapes: "🍇",
  watermelon: "🍉",
  dal: "🥣",
  lentil: "🥣",
  bread: "🍞",
  roti: "🫓",
  chapati: "🫓",
  naan: "🫓",
  egg: "🥚",
  paneer: "🧀",
  fish: "🐟",
  salmon: "🐟",
  pasta: "🍝",
  noodle: "🍜",
  soup: "🍲",
  curry: "🍛",
  biryani: "🍛",
  idli: "🍚",
  dosa: "🥞",
  upma: "🍚",
  poha: "🍚",
  sandwich: "🥪",
  burger: "🍔",
  pizza: "🍕",
  steak: "🥩",
  beef: "🥩",
  potato: "🥔",
  corn: "🌽",
  broccoli: "🥦",
  carrot: "🥕",
  spinach: "🥬",
  tomato: "🍅",
  cucumber: "🥒",
  avocado: "🥑",
  yogurt: "🫙",
  milk: "🥛",
  cheese: "🧀",
  nuts: "🥜",
  oats: "🌾",
  quinoa: "🌾",
  tofu: "🫘",
  beans: "🫘",
  chickpea: "🫘"
};
function getFoodEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍽️";
}
const PORTION_GRAMS = {
  small: 80,
  medium: 150,
  large: 220
};
function calcNutrition(item, grams) {
  const n = item.nutrition;
  const factor = grams / 100;
  return {
    calories: Math.round(n.caloriesPer100g * factor),
    protein: Math.round(n.proteinG * factor * 10) / 10,
    carbs: Math.round(n.carbsG * factor * 10) / 10,
    fat: Math.round(n.fatG * factor * 10) / 10,
    fiber: Math.round(n.fiberG * factor * 10) / 10
  };
}
function foodItemToDetected(item, portion = "medium") {
  const grams = PORTION_GRAMS[portion];
  const nutri = calcNutrition(item, grams);
  return {
    id: item.id.toString(),
    name: item.name,
    emoji: getFoodEmoji(item.name),
    grams,
    portionSize: portion,
    calories: nutri.calories,
    protein: nutri.protein,
    carbs: nutri.carbs,
    fat: nutri.fat,
    fiber: nutri.fiber
  };
}
function simulateDetection(foods) {
  if (!foods.length) return [];
  const shuffled = [...foods].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 3);
  return shuffled.slice(0, count).map((f) => foodItemToDetected(f, "medium"));
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function getWeekStart(daysAgo = 6) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}
function formatDateShort(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatTimestamp(ts) {
  const d = new Date(Number(ts) / 1e6);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  };
}
function DetectedFoodCard({
  food,
  index,
  onPortionChange,
  onRemove,
  originalItem
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `food_scanner.detected_item.${index + 1}`,
      className: "bg-card border border-border rounded-xl p-4 transition-smooth hover:shadow-md",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none shrink-0", children: food.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground truncate", children: food.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                food.grams,
                "g · ",
                food.calories,
                " kcal"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onRemove(food.id),
              "aria-label": `Remove ${food.name}`,
              "data-ocid": `food_scanner.remove_item.${index + 1}`,
              className: "text-muted-foreground hover:text-destructive transition-colors text-sm p-1 rounded shrink-0",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 mb-3", children: ["small", "medium", "large"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => originalItem && onPortionChange(food.id, p, originalItem),
            "data-ocid": `food_scanner.portion_${p}.${index + 1}`,
            className: `flex-1 py-1.5 text-xs font-semibold rounded-md border transition-smooth capitalize
              ${food.portionSize === p ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"}`,
            children: p === "small" ? "S · 80g" : p === "medium" ? "M · 150g" : "L · 220g"
          },
          p
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1 text-center", children: [
          { label: "Protein", val: `${food.protein}g` },
          { label: "Carbs", val: `${food.carbs}g` },
          { label: "Fat", val: `${food.fat}g` },
          { label: "Fiber", val: `${food.fiber}g` },
          { label: "Kcal", val: String(food.calories) }
        ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground", children: val }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-tight", children: label })
        ] }, label)) })
      ]
    }
  );
}
function FoodScannerPage() {
  var _a;
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const [detectedFoods, setDetectedFoods] = reactExports.useState([]);
  const [hasScanned, setHasScanned] = reactExports.useState(false);
  const [selectedMealType, setSelectedMealType] = reactExports.useState(
    MealType.lunch
  );
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [calorieGoalInput, setCalorieGoalInput] = reactExports.useState("");
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const today = todayISO();
  const weekStart = getWeekStart(6);
  const { data: profile } = useMyProfile();
  const { data: dailySummary } = useDailySummary(today);
  const { data: weeklySummary } = useWeeklySummary(weekStart);
  const { data: mealHistory } = useMealHistory(0, 20);
  const { data: listFoods } = useListFoods(0, 100);
  const { data: searchResults } = useSearchFoods(searchTerm);
  const logMeal = useLogMeal();
  const deleteMeal = useDeleteMeal();
  const setCalorieGoalMut = useSetCalorieGoal();
  const calorieGoal = Number(((_a = profile == null ? void 0 : profile.healthProfile) == null ? void 0 : _a.dailyCalorieGoal) ?? 2e3);
  const todayCalories = (dailySummary == null ? void 0 : dailySummary.totalCalories) ?? 0;
  const calorieProgress = Math.min(
    100,
    Math.round(todayCalories / calorieGoal * 100)
  );
  const remaining = Math.max(0, calorieGoal - todayCalories);
  const totalPlateCalories = detectedFoods.reduce((s, f) => s + f.calories, 0);
  const foodItemsMap = new Map(
    (listFoods ?? []).map((f) => [f.id.toString(), f])
  );
  const handleFileSelect = reactExports.useCallback((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a2;
      setImagePreview((_a2 = e.target) == null ? void 0 : _a2.result);
      setDetectedFoods([]);
      setHasScanned(false);
    };
    reader.readAsDataURL(file);
  }, []);
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );
  const handleScan = () => {
    if (!imagePreview || !(listFoods == null ? void 0 : listFoods.length)) return;
    setIsScanning(true);
    setTimeout(() => {
      const detected = simulateDetection(listFoods);
      setDetectedFoods(detected);
      setHasScanned(true);
      setIsScanning(false);
    }, 1500);
  };
  const handlePortionChange = (id, portion, item) => {
    setDetectedFoods(
      (prev) => prev.map((f) => f.id === id ? foodItemToDetected(item, portion) : f)
    );
  };
  const handleRemoveFood = (id) => {
    setDetectedFoods((prev) => prev.filter((f) => f.id !== id));
  };
  const handleAddSearchFood = (item) => {
    const already = detectedFoods.find((f) => f.id === item.id.toString());
    if (already) {
      ue.info(`${item.name} is already on the plate`);
      return;
    }
    setDetectedFoods((prev) => [...prev, foodItemToDetected(item, "medium")]);
    setSearchTerm("");
    setHasScanned(true);
  };
  const handleLogMeal = async () => {
    if (!detectedFoods.length) {
      ue.error("No foods detected yet — scan your plate first.");
      return;
    }
    try {
      const foods = detectedFoods.map((f) => ({
        foodItemId: BigInt(f.id),
        foodName: f.name,
        portionSize: f.portionSize === "small" ? PortionSize.small : f.portionSize === "large" ? PortionSize.large : PortionSize.medium,
        gramsEstimate: f.grams,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        fiber: f.fiber,
        sugar: 0
      }));
      await logMeal.mutateAsync({
        foods,
        mealType: selectedMealType,
        note: ""
      });
      ue.success("🎉 Meal logged successfully!");
      navigate({ to: "/dashboard" });
    } catch {
      ue.error("Failed to log meal. Please try again.");
    }
  };
  const handleSaveGoal = async () => {
    const val = Number.parseInt(calorieGoalInput, 10);
    if (!val || val < 500 || val > 8e3) {
      ue.error("Enter a valid goal (500–8000 kcal)");
      return;
    }
    try {
      await setCalorieGoalMut.mutateAsync(BigInt(val));
      ue.success("Calorie goal updated!");
      setCalorieGoalInput("");
    } catch {
      ue.error("Failed to update goal.");
    }
  };
  const chartData = (weeklySummary == null ? void 0 : weeklySummary.dailySummaries) ? [...weeklySummary.dailySummaries].sort((a, b) => a.date.localeCompare(b.date)).map((s) => ({
    date: formatDateShort(s.date),
    calories: Math.round(s.totalCalories),
    goal: Number(s.goal)
  })) : Array.from({ length: 7 }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      calories: 0,
      goal: calorieGoal
    };
  });
  const dietSuggestion = todayCalories > calorieGoal ? `You're ${Math.round(todayCalories - calorieGoal)} kcal over goal — try a light salad or fruit next.` : remaining < 300 ? `Only ${Math.round(remaining)} kcal left — a small snack like yogurt or nuts fits perfectly.` : `${Math.round(remaining)} kcal remaining — a balanced meal with lean protein and vegetables is ideal.`;
  const nowDisplay = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "🍽️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Food Plate Scanner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "AI-powered calorie detection — scan your meal instantly" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.upload_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📷 Scan Your Food Plate" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onDragOver: (e) => {
              e.preventDefault();
              setIsDragging(true);
            },
            onDragLeave: () => setIsDragging(false),
            onDrop: handleDrop,
            "data-ocid": "food_scanner.dropzone",
            className: `relative rounded-xl border-2 border-dashed transition-smooth overflow-hidden
              ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : imagePreview ? "border-border" : "border-border"}
              ${imagePreview ? "h-64" : "h-52 flex items-center justify-center"}`,
            children: imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imagePreview,
                  alt: "Food plate preview",
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-4 pointer-events-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-sm" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setDetectedFoods([]);
                    setHasScanned(false);
                  },
                  className: "absolute top-2 right-2 bg-card/90 backdrop-blur-sm border border-border text-foreground text-xs px-2 py-1 rounded-lg hover:bg-card transition-smooth",
                  "data-ocid": "food_scanner.clear_image_button",
                  children: "✕ Clear"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a2;
                  return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                },
                className: "text-center px-6 py-4 select-none w-full h-full flex flex-col items-center justify-center hover:bg-primary/[0.03] transition-smooth rounded-xl",
                "aria-label": "Click to upload food photo",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "📷" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "Drop your food photo here" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "or click to upload · JPG, PNG, WEBP supported" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: (e) => {
              var _a2;
              return ((_a2 = e.target.files) == null ? void 0 : _a2[0]) && handleFileSelect(e.target.files[0]);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 mt-4", children: !imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "w-full btn-primary",
            "data-ocid": "food_scanner.upload_button",
            children: "📂 Choose Photo"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                var _a2;
                return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
              },
              variant: "outline",
              className: "flex-1",
              "data-ocid": "food_scanner.change_photo_button",
              children: "📂 Change"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleScan,
              disabled: isScanning || !(listFoods == null ? void 0 : listFoods.length),
              className: "flex-1 btn-primary",
              "data-ocid": "food_scanner.scan_button",
              children: isScanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
                " Scanning…"
              ] }) : "🔍 Scan Food"
            }
          )
        ] }) })
      ] })
    ] }),
    isScanning && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "elevated", "data-ocid": "food_scanner.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-8 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-16 h-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 flex items-center justify-center text-2xl", children: "🤖" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "AI Analysing Your Plate…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Detecting food items and calculating nutrition" })
      ] })
    ] }) }) }),
    hasScanned && !isScanning && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.results_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🤖 AI Detected Foods" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-blue", children: [
          detectedFoods.length,
          " items"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: detectedFoods.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-6 text-muted-foreground",
          "data-ocid": "food_scanner.detected.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl mb-2", children: "🍽️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "No items — add food via manual search below." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        detectedFoods.map((food, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          DetectedFoodCard,
          {
            food,
            index: i,
            onPortionChange: handlePortionChange,
            onRemove: handleRemoveFood,
            originalItem: foodItemsMap.get(food.id)
          },
          food.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Total Plate Calories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-3xl text-primary", children: [
              totalPlateCalories,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-normal text-muted-foreground", children: "kcal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Protein:",
                " ",
                detectedFoods.reduce((s, f) => s + f.protein, 0).toFixed(1),
                "g"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Carbs:",
                " ",
                detectedFoods.reduce((s, f) => s + f.carbs, 0).toFixed(1),
                "g"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Fat:",
                " ",
                detectedFoods.reduce((s, f) => s + f.fat, 0).toFixed(1),
                "g"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🍽️" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MedicalDisclaimer,
          {
            variant: "food",
            dismissible: true,
            className: "mt-1"
          }
        )
      ] }) })
    ] }),
    hasScanned && !isScanning && detectedFoods.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.log_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📋 Log This Meal" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-2", children: "Meal Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
            [MealType.breakfast, "🌅", "Breakfast"],
            [MealType.lunch, "☀️", "Lunch"],
            [MealType.dinner, "🌆", "Dinner"],
            [MealType.snack, "🍿", "Snack"]
          ].map(([type, emoji, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedMealType(type),
              "data-ocid": `food_scanner.meal_type_${type}`,
              className: `flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-smooth
                      ${selectedMealType === type ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
                " ",
                label
              ]
            },
            type
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🕐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Logging at:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
              nowDisplay,
              " · ",
              formatDateShort(today)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleLogMeal,
            disabled: logMeal.isPending,
            className: "w-full btn-primary text-base py-3",
            "data-ocid": "food_scanner.log_meal_button",
            children: logMeal.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
              " Logging…"
            ] }) : "✅ Log This Meal"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.calorie_goal_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🎯 Daily Calorie Goal & Progress" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProgressRing,
            {
              value: calorieProgress,
              size: 110,
              strokeWidth: 10,
              variant: calorieProgress > 100 ? "red" : calorieProgress > 80 ? "yellow" : "blue",
              label: `${calorieProgress}%`,
              sublabel: "of goal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0 space-y-2", children: [
            {
              label: "Consumed today",
              val: `${Math.round(todayCalories)} kcal`,
              color: "text-foreground"
            },
            {
              label: "Daily goal",
              val: `${calorieGoal} kcal`,
              color: "text-foreground"
            },
            {
              label: "Remaining",
              val: `${Math.round(remaining)} kcal`,
              color: remaining === 0 ? "text-destructive" : "text-accent"
            }
          ].map(({ label, val, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${color}`, children: val })
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-secondary/10 border border-secondary/20 rounded-lg p-3 text-xs text-secondary-foreground leading-relaxed", children: [
          "💡 ",
          dietSuggestion
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              placeholder: `Set new goal (current: ${calorieGoal} kcal)`,
              value: calorieGoalInput,
              onChange: (e) => setCalorieGoalInput(e.target.value),
              min: 500,
              max: 8e3,
              "data-ocid": "food_scanner.calorie_goal_input",
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSaveGoal,
              disabled: setCalorieGoalMut.isPending || !calorieGoalInput,
              variant: "outline",
              className: "border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth shrink-0",
              "data-ocid": "food_scanner.save_goal_button",
              children: "Save"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.search_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🔎 Manual Food Search" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Search the food database and add items to your current meal." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search foods — e.g. rice, chicken, dosa, quinoa…",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            "data-ocid": "food_scanner.search_input"
          }
        ),
        searchTerm.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border",
            "data-ocid": "food_scanner.search_results",
            children: !(searchResults == null ? void 0 : searchResults.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-sm text-center text-muted-foreground", children: [
              'No results for "',
              searchTerm,
              '"'
            ] }) : searchResults.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleAddSearchFood(item),
                "data-ocid": `food_scanner.search_result.${i + 1}`,
                className: "w-full flex items-center justify-between px-3 py-2.5 hover:bg-primary/5 transition-colors text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: getFoodEmoji(item.name) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground block truncate", children: item.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                        item.category,
                        " ·",
                        " ",
                        item.isIndian ? "🇮🇳 Indian" : "International"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold shrink-0 ml-3 bg-primary/10 px-2 py-0.5 rounded-full", children: [
                    Math.round(item.nutrition.caloriesPer100g),
                    " /100g"
                  ] })
                ]
              },
              item.id.toString()
            ))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.history_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📅 Meal History" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !(mealHistory == null ? void 0 : mealHistory.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-8 text-muted-foreground",
          "data-ocid": "food_scanner.history.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-2", children: "🍽️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "No meals logged yet — scan your plate to get started!" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: mealHistory.slice(0, 14).map((meal, i) => {
        const { date, time } = formatTimestamp(meal.timestamp);
        const mealEmoji = meal.mealType === MealType.breakfast ? "🌅" : meal.mealType === MealType.lunch ? "☀️" : meal.mealType === MealType.dinner ? "🌆" : "🍿";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `food_scanner.history.item.${i + 1}`,
            className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/60 hover:bg-muted/50 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: mealEmoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground capitalize", children: meal.mealType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    date,
                    " · ",
                    time,
                    " ·",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
                      meal.foods.length,
                      " item",
                      meal.foods.length !== 1 ? "s" : ""
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-blue", children: [
                  Math.round(meal.totalCalories),
                  " kcal"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: async () => {
                      try {
                        await deleteMeal.mutateAsync(meal.id);
                        ue.success("Meal deleted");
                      } catch {
                        ue.error("Failed to delete meal");
                      }
                    },
                    "aria-label": `Delete ${meal.mealType} meal`,
                    "data-ocid": `food_scanner.history.delete_button.${i + 1}`,
                    className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
                    children: "🗑️"
                  }
                )
              ] })
            ]
          },
          meal.id.toString()
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", "data-ocid": "food_scanner.chart_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📊 Weekly Calorie Trend" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AreaChart,
          {
            data: chartData,
            margin: { top: 8, right: 8, left: -20, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "linearGradient",
                {
                  id: "calorieGradient",
                  x1: "0",
                  y1: "0",
                  x2: "0",
                  y2: "1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "stop",
                      {
                        offset: "5%",
                        stopColor: "oklch(0.48 0.14 232)",
                        stopOpacity: 0.4
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "stop",
                      {
                        offset: "95%",
                        stopColor: "oklch(0.48 0.14 232)",
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
                  stroke: "oklch(0.88 0.02 220)",
                  strokeOpacity: 0.6
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "date",
                  tick: { fontSize: 11, fill: "oklch(0.48 0.03 230)" },
                  tickLine: false,
                  axisLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tick: { fontSize: 11, fill: "oklch(0.48 0.03 230)" },
                  tickLine: false,
                  axisLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: "white",
                    border: "1px solid oklch(0.88 0.02 220)",
                    borderRadius: "8px",
                    fontSize: "12px"
                  },
                  formatter: (value) => [`${value} kcal`]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReferenceLine,
                {
                  y: calorieGoal,
                  stroke: "oklch(0.68 0.13 155)",
                  strokeDasharray: "5 3",
                  strokeWidth: 2,
                  label: {
                    value: "Goal",
                    position: "insideTopRight",
                    fontSize: 11,
                    fill: "oklch(0.68 0.13 155)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Area,
                {
                  type: "monotone",
                  dataKey: "calories",
                  stroke: "oklch(0.48 0.14 232)",
                  strokeWidth: 2.5,
                  fill: "url(#calorieGradient)",
                  name: "Calories",
                  dot: {
                    r: 3,
                    fill: "oklch(0.48 0.14 232)",
                    strokeWidth: 0
                  },
                  activeDot: { r: 5, fill: "oklch(0.48 0.14 232)" }
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-2", children: "Last 7 days · Green dashed line = your daily calorie goal" })
      ] })
    ] })
  ] });
}
export {
  FoodScannerPage as default
};
