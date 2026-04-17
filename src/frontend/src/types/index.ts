// Re-export all backend types
export type {
  UserProfile,
  BasicInfo,
  HealthProfile,
  LifestyleHabits,
  MoodEntry,
  MoodSummary,
  SymptomEntry,
  RiskScoreEntry,
  FoodItem,
  NutritionPer100g,
  Meal,
  MealFoodEntry,
  AddMealRequest,
  DailyCalorieSummary,
  WeeklySummary,
  DietRecommendation,
  ExerciseItem,
  HistoryEvent,
  HealthReport,
  LoginRequest,
  RegisterStep1Request,
  RegisterStep2Request,
  RegisterStep3Request,
  AuthResult,
  Timestamp,
  UserId,
} from "../backend";

export {
  ActivityLevel,
  DietType,
  HistoryCategory,
  MealType,
  MedicalCondition,
  PortionSize,
  RiskLevel,
} from "../backend";

// App-specific types
export interface DetectedFood {
  id: string;
  name: string;
  emoji: string;
  grams: number;
  portionSize: "small" | "medium" | "large";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface ScanResult {
  foods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl: string | null;
}

export interface NavItem {
  label: string;
  emoji: string;
  path: string;
}

export type ColorVariant =
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "purple"
  | "orange";

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userProfile: import("../backend").UserProfile | null;
  isLoading: boolean;
}
