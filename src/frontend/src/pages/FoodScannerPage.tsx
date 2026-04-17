import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { ProgressRing } from "../components/ui/ProgressRing";
import {
  useDailySummary,
  useDeleteMeal,
  useListFoods,
  useLogMeal,
  useMealHistory,
  useMyProfile,
  useSearchFoods,
  useSetCalorieGoal,
  useWeeklySummary,
} from "../hooks/useBackend";
import type { DetectedFood, FoodItem } from "../types";
import { MealType, PortionSize } from "../types";

// ─── Food emoji mapping ────────────────────────────────────────────────────
const FOOD_EMOJIS: Record<string, string> = {
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
  chickpea: "🫘",
};

function getFoodEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍽️";
}

// ─── Portion gram estimates ───────────────────────────────────────────────
const PORTION_GRAMS: Record<"small" | "medium" | "large", number> = {
  small: 80,
  medium: 150,
  large: 220,
};

function calcNutrition(item: FoodItem, grams: number) {
  const n = item.nutrition;
  const factor = grams / 100;
  return {
    calories: Math.round(n.caloriesPer100g * factor),
    protein: Math.round(n.proteinG * factor * 10) / 10,
    carbs: Math.round(n.carbsG * factor * 10) / 10,
    fat: Math.round(n.fatG * factor * 10) / 10,
    fiber: Math.round(n.fiberG * factor * 10) / 10,
  };
}

function foodItemToDetected(
  item: FoodItem,
  portion: "small" | "medium" | "large" = "medium",
): DetectedFood {
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
    fiber: nutri.fiber,
  };
}

// ─── Simulate AI detection — picks 2–4 random items ──────────────────────
function simulateDetection(foods: FoodItem[]): DetectedFood[] {
  if (!foods.length) return [];
  const shuffled = [...foods].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 3);
  return shuffled.slice(0, count).map((f) => foodItemToDetected(f, "medium"));
}

// ─── Date / time helpers ──────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function getWeekStart(daysAgo = 6) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}
function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatTimestamp(ts: bigint) {
  const d = new Date(Number(ts) / 1_000_000);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

// ─── Detected Food Card ───────────────────────────────────────────────────
interface DetectedCardProps {
  food: DetectedFood;
  index: number;
  onPortionChange: (
    id: string,
    portion: "small" | "medium" | "large",
    item: FoodItem,
  ) => void;
  onRemove: (id: string) => void;
  originalItem: FoodItem | undefined;
}

function DetectedFoodCard({
  food,
  index,
  onPortionChange,
  onRemove,
  originalItem,
}: DetectedCardProps) {
  return (
    <div
      data-ocid={`food_scanner.detected_item.${index + 1}`}
      className="bg-card border border-border rounded-xl p-4 transition-smooth hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl leading-none shrink-0">{food.emoji}</span>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground truncate">
              {food.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {food.grams}g · {food.calories} kcal
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(food.id)}
          aria-label={`Remove ${food.name}`}
          data-ocid={`food_scanner.remove_item.${index + 1}`}
          className="text-muted-foreground hover:text-destructive transition-colors text-sm p-1 rounded shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Portion selector */}
      <div className="flex gap-1.5 mb-3">
        {(["small", "medium", "large"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() =>
              originalItem && onPortionChange(food.id, p, originalItem)
            }
            data-ocid={`food_scanner.portion_${p}.${index + 1}`}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-smooth capitalize
              ${
                food.portionSize === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
              }`}
          >
            {p === "small"
              ? "S · 80g"
              : p === "medium"
                ? "M · 150g"
                : "L · 220g"}
          </button>
        ))}
      </div>

      {/* Nutrition grid */}
      <div className="grid grid-cols-5 gap-1 text-center">
        {[
          { label: "Protein", val: `${food.protein}g` },
          { label: "Carbs", val: `${food.carbs}g` },
          { label: "Fat", val: `${food.fat}g` },
          { label: "Fiber", val: `${food.fiber}g` },
          { label: "Kcal", val: String(food.calories) },
        ].map(({ label, val }) => (
          <div key={label} className="bg-muted/40 rounded-lg p-1.5">
            <p className="text-xs font-bold text-foreground">{val}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function FoodScannerPage() {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(
    MealType.lunch,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [calorieGoalInput, setCalorieGoalInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Derived values
  const calorieGoal = Number(profile?.healthProfile?.dailyCalorieGoal ?? 2000);
  const todayCalories = dailySummary?.totalCalories ?? 0;
  const calorieProgress = Math.min(
    100,
    Math.round((todayCalories / calorieGoal) * 100),
  );
  const remaining = Math.max(0, calorieGoal - todayCalories);
  const totalPlateCalories = detectedFoods.reduce((s, f) => s + f.calories, 0);

  const foodItemsMap = new Map<string, FoodItem>(
    (listFoods ?? []).map((f) => [f.id.toString(), f]),
  );

  // ─── File handling ─────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setDetectedFoods([]);
      setHasScanned(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  // ─── Simulate AI scan ──────────────────────────────────────────────────
  const handleScan = () => {
    if (!imagePreview || !listFoods?.length) return;
    setIsScanning(true);
    setTimeout(() => {
      const detected = simulateDetection(listFoods);
      setDetectedFoods(detected);
      setHasScanned(true);
      setIsScanning(false);
    }, 1500);
  };

  // ─── Portion change ────────────────────────────────────────────────────
  const handlePortionChange = (
    id: string,
    portion: "small" | "medium" | "large",
    item: FoodItem,
  ) => {
    setDetectedFoods((prev) =>
      prev.map((f) => (f.id === id ? foodItemToDetected(item, portion) : f)),
    );
  };

  const handleRemoveFood = (id: string) => {
    setDetectedFoods((prev) => prev.filter((f) => f.id !== id));
  };

  // ─── Add from search ───────────────────────────────────────────────────
  const handleAddSearchFood = (item: FoodItem) => {
    const already = detectedFoods.find((f) => f.id === item.id.toString());
    if (already) {
      toast.info(`${item.name} is already on the plate`);
      return;
    }
    setDetectedFoods((prev) => [...prev, foodItemToDetected(item, "medium")]);
    setSearchTerm("");
    setHasScanned(true);
  };

  // ─── Log meal ──────────────────────────────────────────────────────────
  const handleLogMeal = async () => {
    if (!detectedFoods.length) {
      toast.error("No foods detected yet — scan your plate first.");
      return;
    }
    try {
      const foods = detectedFoods.map((f) => ({
        foodItemId: BigInt(f.id),
        foodName: f.name,
        portionSize:
          f.portionSize === "small"
            ? PortionSize.small
            : f.portionSize === "large"
              ? PortionSize.large
              : PortionSize.medium,
        gramsEstimate: f.grams,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        fiber: f.fiber,
        sugar: 0,
      }));
      await logMeal.mutateAsync({
        foods,
        mealType: selectedMealType,
        note: "",
      });
      toast.success("🎉 Meal logged successfully!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to log meal. Please try again.");
    }
  };

  // ─── Save calorie goal ─────────────────────────────────────────────────
  const handleSaveGoal = async () => {
    const val = Number.parseInt(calorieGoalInput, 10);
    if (!val || val < 500 || val > 8000) {
      toast.error("Enter a valid goal (500–8000 kcal)");
      return;
    }
    try {
      await setCalorieGoalMut.mutateAsync(BigInt(val));
      toast.success("Calorie goal updated!");
      setCalorieGoalInput("");
    } catch {
      toast.error("Failed to update goal.");
    }
  };

  // ─── Weekly chart data ─────────────────────────────────────────────────
  const chartData = weeklySummary?.dailySummaries
    ? [...weeklySummary.dailySummaries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((s) => ({
          date: formatDateShort(s.date),
          calories: Math.round(s.totalCalories),
          goal: Number(s.goal),
        }))
    : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          calories: 0,
          goal: calorieGoal,
        };
      });

  // Diet suggestion text
  const dietSuggestion =
    todayCalories > calorieGoal
      ? `You're ${Math.round(todayCalories - calorieGoal)} kcal over goal — try a light salad or fruit next.`
      : remaining < 300
        ? `Only ${Math.round(remaining)} kcal left — a small snack like yogurt or nuts fits perfectly.`
        : `${Math.round(remaining)} kcal remaining — a balanced meal with lean protein and vegetables is ideal.`;

  const nowDisplay = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="page-container space-y-6 pb-12">
      {/* Page header */}
      <div className="flex items-center gap-3 py-2">
        <span className="text-4xl">🍽️</span>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Food Plate Scanner
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered calorie detection — scan your meal instantly
          </p>
        </div>
      </div>

      {/* Medical disclaimer banner */}
      <MedicalDisclaimer variant="full" />

      {/* ── Section 1: Image Upload Zone ──────────────────────────────── */}
      <Card variant="elevated" data-ocid="food_scanner.upload_section">
        <CardHeader>
          <CardTitle>📷 Scan Your Food Plate</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            data-ocid="food_scanner.dropzone"
            className={`relative rounded-xl border-2 border-dashed transition-smooth overflow-hidden
              ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : imagePreview
                    ? "border-border"
                    : "border-border"
              }
              ${imagePreview ? "h-64" : "h-52 flex items-center justify-center"}`}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Food plate preview"
                  className="w-full h-full object-cover"
                />
                {/* Scan-frame corners */}
                <div className="absolute inset-4 pointer-events-none">
                  <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-sm" />
                  <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-sm" />
                  <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-sm" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-sm" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setDetectedFoods([]);
                    setHasScanned(false);
                  }}
                  className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm border border-border text-foreground text-xs px-2 py-1 rounded-lg hover:bg-card transition-smooth"
                  data-ocid="food_scanner.clear_image_button"
                >
                  ✕ Clear
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-center px-6 py-4 select-none w-full h-full flex flex-col items-center justify-center hover:bg-primary/[0.03] transition-smooth rounded-xl"
                aria-label="Click to upload food photo"
              >
                <div className="text-5xl mb-3">📷</div>
                <p className="font-display font-semibold text-foreground mb-1">
                  Drop your food photo here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to upload · JPG, PNG, WEBP supported
                </p>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
          />

          <div className="flex gap-3 mt-4">
            {!imagePreview ? (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full btn-primary"
                data-ocid="food_scanner.upload_button"
              >
                📂 Choose Photo
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1"
                  data-ocid="food_scanner.change_photo_button"
                >
                  📂 Change
                </Button>
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !listFoods?.length}
                  className="flex-1 btn-primary"
                  data-ocid="food_scanner.scan_button"
                >
                  {isScanning ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" /> Scanning…
                    </span>
                  ) : (
                    "🔍 Scan Food"
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Scanning animation ─────────────────────────────────────────── */}
      {isScanning && (
        <Card variant="elevated" data-ocid="food_scanner.loading_state">
          <CardContent>
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                  🤖
                </span>
              </div>
              <div className="text-center">
                <p className="font-display font-semibold text-foreground">
                  AI Analysing Your Plate…
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Detecting food items and calculating nutrition
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Section 2: AI Detection Results ──────────────────────────── */}
      {hasScanned && !isScanning && (
        <Card variant="elevated" data-ocid="food_scanner.results_section">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>🤖 AI Detected Foods</CardTitle>
              <Badge className="badge-blue">{detectedFoods.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {detectedFoods.length === 0 ? (
              <div
                className="text-center py-6 text-muted-foreground"
                data-ocid="food_scanner.detected.empty_state"
              >
                <p className="text-3xl mb-2">🍽️</p>
                <p className="font-medium text-sm">
                  No items — add food via manual search below.
                </p>
              </div>
            ) : (
              <>
                {detectedFoods.map((food, i) => (
                  <DetectedFoodCard
                    key={food.id}
                    food={food}
                    index={i}
                    onPortionChange={handlePortionChange}
                    onRemove={handleRemoveFood}
                    originalItem={foodItemsMap.get(food.id)}
                  />
                ))}

                {/* Total plate calories */}
                <div className="mt-2 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Total Plate Calories
                    </p>
                    <p className="font-display font-bold text-3xl text-primary">
                      {totalPlateCalories}{" "}
                      <span className="text-base font-normal text-muted-foreground">
                        kcal
                      </span>
                    </p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>
                        Protein:{" "}
                        {detectedFoods
                          .reduce((s, f) => s + f.protein, 0)
                          .toFixed(1)}
                        g
                      </span>
                      <span>
                        Carbs:{" "}
                        {detectedFoods
                          .reduce((s, f) => s + f.carbs, 0)
                          .toFixed(1)}
                        g
                      </span>
                      <span>
                        Fat:{" "}
                        {detectedFoods
                          .reduce((s, f) => s + f.fat, 0)
                          .toFixed(1)}
                        g
                      </span>
                    </div>
                  </div>
                  <span className="text-5xl">🍽️</span>
                </div>

                {/* Food calorie disclaimer */}
                <MedicalDisclaimer
                  variant="food"
                  dismissible
                  className="mt-1"
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Section 3: Log Meal ──────────────────────────────────────── */}
      {hasScanned && !isScanning && detectedFoods.length > 0 && (
        <Card variant="elevated" data-ocid="food_scanner.log_section">
          <CardHeader>
            <CardTitle>📋 Log This Meal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meal type buttons */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Meal Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    [MealType.breakfast, "🌅", "Breakfast"],
                    [MealType.lunch, "☀️", "Lunch"],
                    [MealType.dinner, "🌆", "Dinner"],
                    [MealType.snack, "🍿", "Snack"],
                  ] as const
                ).map(([type, emoji, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedMealType(type)}
                    data-ocid={`food_scanner.meal_type_${type}`}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-smooth
                      ${
                        selectedMealType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                      }`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timestamp row */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2.5">
              <span>🕐</span>
              <span>
                Logging at:{" "}
                <strong className="text-foreground">
                  {nowDisplay} · {formatDateShort(today)}
                </strong>
              </span>
            </div>

            <Button
              onClick={handleLogMeal}
              disabled={logMeal.isPending}
              className="w-full btn-primary text-base py-3"
              data-ocid="food_scanner.log_meal_button"
            >
              {logMeal.isPending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Logging…
                </span>
              ) : (
                "✅ Log This Meal"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Section 4: Calorie Goal & Progress ───────────────────────── */}
      <Card variant="elevated" data-ocid="food_scanner.calorie_goal_section">
        <CardHeader>
          <CardTitle>🎯 Daily Calorie Goal & Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5 mb-5">
            <ProgressRing
              value={calorieProgress}
              size={110}
              strokeWidth={10}
              variant={
                calorieProgress > 100
                  ? "red"
                  : calorieProgress > 80
                    ? "yellow"
                    : "blue"
              }
              label={`${calorieProgress}%`}
              sublabel="of goal"
            />
            <div className="flex-1 min-w-0 space-y-2">
              {[
                {
                  label: "Consumed today",
                  val: `${Math.round(todayCalories)} kcal`,
                  color: "text-foreground",
                },
                {
                  label: "Daily goal",
                  val: `${calorieGoal} kcal`,
                  color: "text-foreground",
                },
                {
                  label: "Remaining",
                  val: `${Math.round(remaining)} kcal`,
                  color: remaining === 0 ? "text-destructive" : "text-accent",
                },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-semibold ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diet suggestion */}
          <div className="mb-4 bg-secondary/10 border border-secondary/20 rounded-lg p-3 text-xs text-secondary-foreground leading-relaxed">
            💡 {dietSuggestion}
          </div>

          {/* Goal edit input */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`Set new goal (current: ${calorieGoal} kcal)`}
              value={calorieGoalInput}
              onChange={(e) => setCalorieGoalInput(e.target.value)}
              min={500}
              max={8000}
              data-ocid="food_scanner.calorie_goal_input"
              className="flex-1"
            />
            <Button
              onClick={handleSaveGoal}
              disabled={setCalorieGoalMut.isPending || !calorieGoalInput}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth shrink-0"
              data-ocid="food_scanner.save_goal_button"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 5: Manual Food Search ────────────────────────────── */}
      <Card variant="elevated" data-ocid="food_scanner.search_section">
        <CardHeader>
          <CardTitle>🔎 Manual Food Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Search the food database and add items to your current meal.
          </p>
          <Input
            placeholder="Search foods — e.g. rice, chicken, dosa, quinoa…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-ocid="food_scanner.search_input"
          />
          {searchTerm.length > 1 && (
            <div
              className="max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border"
              data-ocid="food_scanner.search_results"
            >
              {!searchResults?.length ? (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  No results for "{searchTerm}"
                </div>
              ) : (
                searchResults.map((item, i) => (
                  <button
                    key={item.id.toString()}
                    type="button"
                    onClick={() => handleAddSearchFood(item)}
                    data-ocid={`food_scanner.search_result.${i + 1}`}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">
                        {getFoodEmoji(item.name)}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground block truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.category} ·{" "}
                          {item.isIndian ? "🇮🇳 Indian" : "International"}
                        </span>
                      </div>
                    </span>
                    <span className="text-xs text-primary font-semibold shrink-0 ml-3 bg-primary/10 px-2 py-0.5 rounded-full">
                      {Math.round(item.nutrition.caloriesPer100g)} /100g
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section 6: Meal History ───────────────────────────────────── */}
      <Card variant="elevated" data-ocid="food_scanner.history_section">
        <CardHeader>
          <CardTitle>📅 Meal History</CardTitle>
        </CardHeader>
        <CardContent>
          {!mealHistory?.length ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="food_scanner.history.empty_state"
            >
              <p className="text-4xl mb-2">🍽️</p>
              <p className="font-medium text-sm">
                No meals logged yet — scan your plate to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {mealHistory.slice(0, 14).map((meal, i) => {
                const { date, time } = formatTimestamp(meal.timestamp);
                const mealEmoji =
                  meal.mealType === MealType.breakfast
                    ? "🌅"
                    : meal.mealType === MealType.lunch
                      ? "☀️"
                      : meal.mealType === MealType.dinner
                        ? "🌆"
                        : "🍿";
                return (
                  <div
                    key={meal.id.toString()}
                    data-ocid={`food_scanner.history.item.${i + 1}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/60 hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{mealEmoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {meal.mealType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {date} · {time} ·{" "}
                          <span className="text-foreground font-medium">
                            {meal.foods.length} item
                            {meal.foods.length !== 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="badge-blue">
                        {Math.round(meal.totalCalories)} kcal
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await deleteMeal.mutateAsync(meal.id);
                            toast.success("Meal deleted");
                          } catch {
                            toast.error("Failed to delete meal");
                          }
                        }}
                        aria-label={`Delete ${meal.mealType} meal`}
                        data-ocid={`food_scanner.history.delete_button.${i + 1}`}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section 7: Weekly Calorie Chart ──────────────────────────── */}
      <Card variant="elevated" data-ocid="food_scanner.chart_section">
        <CardHeader>
          <CardTitle>📊 Weekly Calorie Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="calorieGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="oklch(0.48 0.14 232)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.48 0.14 232)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0.02 220)"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "oklch(0.48 0.03 230)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.48 0.03 230)" }}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid oklch(0.88 0.02 220)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} kcal`]}
              />
              <ReferenceLine
                y={calorieGoal}
                stroke="oklch(0.68 0.13 155)"
                strokeDasharray="5 3"
                strokeWidth={2}
                label={{
                  value: "Goal",
                  position: "insideTopRight" as const,
                  fontSize: 11,
                  fill: "oklch(0.68 0.13 155)",
                }}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="oklch(0.48 0.14 232)"
                strokeWidth={2.5}
                fill="url(#calorieGradient)"
                name="Calories"
                dot={{
                  r: 3,
                  fill: "oklch(0.48 0.14 232)",
                  strokeWidth: 0,
                }}
                activeDot={{ r: 5, fill: "oklch(0.48 0.14 232)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Last 7 days · Green dashed line = your daily calorie goal
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
