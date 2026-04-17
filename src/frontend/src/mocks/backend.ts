import type { backendInterface, UserProfile, MoodEntry, MoodSummary, SymptomEntry, RiskScoreEntry, Meal, WeeklySummary, DailyCalorieSummary, FoodItem, ExerciseItem, DietRecommendation, HealthReport, HistoryEvent, AuthResult } from "../backend";
import { ActivityLevel, DietType, HistoryCategory, MealType, MedicalCondition, PortionSize, RiskLevel } from "../backend";

const mockPrincipal = { toText: () => "mock-principal-id-12345" } as any;

const mockBasicInfo = {
  username: "alexm",
  dateOfBirth: "1990-05-15",
  fullName: "Alex Morgan",
  email: "alex@example.com",
  gender: "Male",
  passwordHash: "hashed",
};

const mockHealthProfile = {
  age: BigInt(34),
  activityLevel: ActivityLevel.moderate,
  heightCm: 175,
  medicalConditions: [MedicalCondition.none],
  weightKg: 72,
  dietType: DietType.nonVegetarian,
  dailyCalorieGoal: BigInt(2100),
};

const mockLifestyle = {
  stressLevel: BigInt(3),
  fitnessGoals: "Lose weight and stay fit",
  sleepHoursPerNight: 7.5,
  smokingStatus: false,
  alcoholConsumption: false,
};

const mockUserProfile: UserProfile = {
  id: mockPrincipal,
  basicInfo: mockBasicInfo,
  createdAt: BigInt(Date.now() - 86400000) * BigInt(1000000),
  lastLogin: BigInt(Date.now()) * BigInt(1000000),
  healthProfile: mockHealthProfile,
  registrationStep: BigInt(3),
  lifestyle: mockLifestyle,
};

const mockAuthResult: AuthResult = {
  __kind__: "ok",
  ok: mockUserProfile,
};

const mockMoodEntries: MoodEntry[] = [
  { id: BigInt(1), userId: mockPrincipal, note: "Feeling great today!", score: BigInt(5), timestamp: BigInt(Date.now() - 86400000) * BigInt(1000000) },
  { id: BigInt(2), userId: mockPrincipal, note: "Bit tired after work", score: BigInt(3), timestamp: BigInt(Date.now() - 2 * 86400000) * BigInt(1000000) },
  { id: BigInt(3), userId: mockPrincipal, note: "Good morning run", score: BigInt(4), timestamp: BigInt(Date.now() - 3 * 86400000) * BigInt(1000000) },
  { id: BigInt(4), userId: mockPrincipal, note: "Stressed about deadline", score: BigInt(2), timestamp: BigInt(Date.now() - 4 * 86400000) * BigInt(1000000) },
  { id: BigInt(5), userId: mockPrincipal, note: "Weekend vibes!", score: BigInt(5), timestamp: BigInt(Date.now() - 5 * 86400000) * BigInt(1000000) },
];

const mockMoodSummary: MoodSummary = {
  period: "week",
  entries: mockMoodEntries,
  averageScore: 3.8,
};

const mockSymptomEntry: SymptomEntry = {
  id: BigInt(1),
  userId: mockPrincipal,
  symptomsText: "Mild headache and fatigue",
  timestamp: BigInt(Date.now() - 86400000) * BigInt(1000000),
  severity: BigInt(2),
  remedies: ["Drink more water", "Get adequate rest", "Try ginger tea for headache relief"],
};

const mockRiskScore: RiskScoreEntry = {
  id: BigInt(1),
  bmi: 23.5,
  userId: mockPrincipal,
  score: BigInt(72),
  timestamp: BigInt(Date.now() - 3600000) * BigInt(1000000),
  factors: ["Moderate activity level", "Good sleep habits", "No smoking"],
  riskLevel: RiskLevel.green,
};

const mockFoodItem: FoodItem = {
  id: BigInt(41),
  name: "Chicken Breast (grilled)",
  category: "Proteins",
  isIndian: false,
  nutrition: { caloriesPer100g: 165, proteinG: 31, carbsG: 0, fatG: 3.6, fiberG: 0, sugarG: 0 },
};

const mockFoods: FoodItem[] = [
  mockFoodItem,
  { id: BigInt(10), name: "Quinoa (cooked)", category: "Grains", isIndian: false, nutrition: { caloriesPer100g: 120, proteinG: 4.4, carbsG: 21.3, fatG: 1.9, fiberG: 2.8, sugarG: 0.9 } },
  { id: BigInt(78), name: "Caesar Salad", category: "Salads", isIndian: false, nutrition: { caloriesPer100g: 120, proteinG: 4, carbsG: 5, fatG: 10, fiberG: 1.5, sugarG: 1 } },
  { id: BigInt(88), name: "Avocado", category: "Fruits", isIndian: false, nutrition: { caloriesPer100g: 160, proteinG: 2, carbsG: 8.5, fatG: 14.7, fiberG: 6.7, sugarG: 0.7 } },
  { id: BigInt(0), name: "White Rice (cooked)", category: "Grains", isIndian: true, nutrition: { caloriesPer100g: 130, proteinG: 2.7, carbsG: 28.2, fatG: 0.3, fiberG: 0.4, sugarG: 0 } },
];

const mockMealFoodEntries = [
  { fat: 5.4, fiber: 0, gramsEstimate: 150, carbs: 0, calories: 248, foodItemId: BigInt(41), sugar: 0, portionSize: PortionSize.medium, foodName: "Chicken Breast (grilled)", protein: 46.5 },
  { fat: 2.85, fiber: 4.2, gramsEstimate: 200, carbs: 42.6, calories: 240, foodItemId: BigInt(10), sugar: 1.8, portionSize: PortionSize.medium, foodName: "Quinoa Salad", protein: 8.8 },
  { fat: 7.35, fiber: 3.35, gramsEstimate: 50, carbs: 4.25, calories: 80, foodItemId: BigInt(88), sugar: 0.35, portionSize: PortionSize.small, foodName: "Avocado", protein: 1 },
];

const mockMeal: Meal = {
  id: BigInt(1),
  foods: mockMealFoodEntries,
  userId: mockPrincipal,
  totalCarbs: 46.85,
  note: "Healthy lunch",
  totalFat: 15.6,
  totalCalories: 568,
  totalProtein: 56.3,
  timestamp: BigInt(Date.now() - 3600000) * BigInt(1000000),
  mealType: MealType.lunch,
};

const mockBreakfastMeal: Meal = {
  id: BigInt(2),
  foods: [{ fat: 11, fiber: 0, gramsEstimate: 200, carbs: 2.2, calories: 310, foodItemId: BigInt(43), sugar: 2.2, portionSize: PortionSize.medium, foodName: "Boiled Eggs (2)", protein: 26 }],
  userId: mockPrincipal,
  totalCarbs: 2.2,
  note: "Quick breakfast",
  totalFat: 11,
  totalCalories: 310,
  totalProtein: 26,
  timestamp: BigInt(Date.now() - 7200000) * BigInt(1000000),
  mealType: MealType.breakfast,
};

const mockDailySummary: DailyCalorieSummary = {
  meals: [mockBreakfastMeal, mockMeal],
  date: new Date().toISOString().split("T")[0],
  goal: BigInt(2100),
  remainingCalories: 860,
  totalCalories: 1240,
  percentageUsed: 59,
};

const mockWeeklySummary: WeeklySummary = {
  weekEnd: new Date().toISOString().split("T")[0],
  averageDailyCalories: 1850,
  totalCalories: 12950,
  dailySummaries: [
    { meals: [mockMeal], date: "2026-04-10", goal: BigInt(2100), remainingCalories: 400, totalCalories: 1700, percentageUsed: 81 },
    { meals: [mockMeal], date: "2026-04-11", goal: BigInt(2100), remainingCalories: 650, totalCalories: 1450, percentageUsed: 69 },
    { meals: [mockMeal], date: "2026-04-12", goal: BigInt(2100), remainingCalories: 200, totalCalories: 1900, percentageUsed: 90 },
    { meals: [mockMeal], date: "2026-04-13", goal: BigInt(2100), remainingCalories: 800, totalCalories: 1300, percentageUsed: 62 },
    { meals: [mockMeal], date: "2026-04-14", goal: BigInt(2100), remainingCalories: 450, totalCalories: 1650, percentageUsed: 79 },
    { meals: [mockMeal], date: "2026-04-15", goal: BigInt(2100), remainingCalories: 860, totalCalories: 1240, percentageUsed: 59 },
    { meals: [], date: "2026-04-16", goal: BigInt(2100), remainingCalories: 2100, totalCalories: 0, percentageUsed: 0 },
  ],
  weekStart: "2026-04-10",
};

const mockExercises: ExerciseItem[] = [
  { id: BigInt(0), difficultyLevel: "beginner", title: "Sun Salutation (Surya Namaskar)", description: "A complete full-body yoga sequence.", durationMinutes: BigInt(15), exerciseType: "yoga", youtubeUrl: "https://www.youtube.com/watch?v=Vg0piW685bA", condition: MedicalCondition.none },
  { id: BigInt(1), difficultyLevel: "beginner", title: "Morning Walk", description: "A brisk 30-minute morning walk.", durationMinutes: BigInt(30), exerciseType: "cardio", youtubeUrl: "https://www.youtube.com/watch?v=hnLHiE9Ense", condition: MedicalCondition.none },
  { id: BigInt(2), difficultyLevel: "beginner", title: "Deep Breathing (Pranayama)", description: "Alternate nostril breathing to reduce stress.", durationMinutes: BigInt(10), exerciseType: "yoga", youtubeUrl: "https://www.youtube.com/watch?v=Lz5vBKCvO4E", condition: MedicalCondition.none },
];

const mockDietRecommendations: DietRecommendation[] = [
  {
    tips: ["Eat more fiber-rich foods", "Reduce processed sugar", "Stay hydrated with 8 glasses of water"],
    sevenDayPlan: [
      ["Oatmeal with fruits", "Grilled chicken salad", "Dal with brown rice"],
      ["Smoothie bowl", "Quinoa salad", "Stir-fry vegetables"],
      ["Poha", "Rajma rice", "Palak paneer roti"],
      ["Idli sambhar", "Moong dal soup", "Grilled fish"],
      ["Fruit bowl", "Chole rice", "Egg curry"],
      ["Daliya porridge", "Sprouts salad", "Khichdi"],
      ["Upma", "Lentil soup", "Tandoori chicken"],
    ],
    avoidFoods: ["Processed snacks", "Sugary beverages", "Deep fried foods"],
    recommendedFoods: ["Leafy greens", "Whole grains", "Lean proteins"],
    condition: MedicalCondition.none,
  },
];

const mockHealthReport: HealthReport = {
  userId: mockPrincipal,
  recentSymptoms: [mockSymptomEntry],
  generatedAt: BigInt(Date.now()) * BigInt(1000000),
  moodSummary: mockMoodSummary,
  dietRecommendation: mockDietRecommendations[0],
  dailyTip: "Drink at least 8 glasses of water today to stay hydrated and support your metabolism.",
  calorieSummaryText: "You have consumed 1240 kcal of your 2100 kcal daily goal. Great progress!",
  latestRiskScore: mockRiskScore,
};

const mockHistoryEvents: HistoryEvent[] = [
  { id: BigInt(1), title: "Logged Lunch Meal", userId: mockPrincipal, description: "Grilled chicken with quinoa salad - 568 kcal", timestamp: BigInt(Date.now() - 3600000) * BigInt(1000000), category: HistoryCategory.meal },
  { id: BigInt(2), title: "Mood Entry", userId: mockPrincipal, description: "Feeling great today! Score: 5/5", timestamp: BigInt(Date.now() - 86400000) * BigInt(1000000), category: HistoryCategory.mood },
  { id: BigInt(3), title: "Risk Score Calculated", userId: mockPrincipal, description: "BMI: 23.5 - Green risk level", timestamp: BigInt(Date.now() - 172800000) * BigInt(1000000), category: HistoryCategory.riskScore },
  { id: BigInt(4), title: "Symptom Check", userId: mockPrincipal, description: "Mild headache - Severity: 2/5", timestamp: BigInt(Date.now() - 259200000) * BigInt(1000000), category: HistoryCategory.symptom },
];

export const mockBackend: backendInterface = {
  calculateRiskScore: async () => mockRiskScore,
  checkSymptoms: async (_symptomsText: string) => mockSymptomEntry,
  deleteMeal: async (_mealId: bigint) => true,
  generateHealthReport: async () => mockHealthReport,
  getDailySummary: async (_date: string) => mockDailySummary,
  getDailyTip: async () => "Drink at least 8 glasses of water today to stay hydrated and support your metabolism. 💧",
  getDietRecommendation: async () => mockDietRecommendations,
  getExercises: async () => mockExercises,
  getExercisesByCondition: async (_condition: MedicalCondition) => mockExercises,
  getFoodById: async (_id: bigint) => mockFoodItem,
  getHealthHistory: async (_categoryFilter: any, _fromTs: any, _toTs: any) => mockHistoryEvents,
  getLatestRiskScore: async () => mockRiskScore,
  getMealHistory: async (_offset: bigint, _limit: bigint) => [mockMeal, mockBreakfastMeal],
  getMealsForDate: async (_date: string) => [mockMeal, mockBreakfastMeal],
  getMoodEntries: async (_period: string) => mockMoodSummary,
  getMyProfile: async () => mockUserProfile,
  getSymptomHistory: async (_offset: bigint, _limit: bigint) => [mockSymptomEntry],
  getWeeklySummary: async (_weekStart: string) => mockWeeklySummary,
  listFoods: async (_offset: bigint, _limit: bigint) => mockFoods,
  logMeal: async (_req: any) => mockMeal,
  logMood: async (_score: bigint, _note: string) => mockMoodEntries[0],
  login: async (_req: any) => mockAuthResult,
  registerStep1: async (_req: any) => mockAuthResult,
  registerStep2: async (_req: any) => mockAuthResult,
  registerStep3: async (_req: any) => mockAuthResult,
  searchFoods: async (_searchTerm: string) => mockFoods,
  setCalorieGoal: async (_goal: bigint) => mockAuthResult,
  updateHealthProfile: async (_req: any) => mockAuthResult,
  updateLifestyle: async (_req: any) => mockAuthResult,
};
