import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface BasicInfo {
    username: string;
    dateOfBirth: string;
    fullName: string;
    email: string;
    gender: string;
    passwordHash: string;
}
export interface MoodEntry {
    id: bigint;
    userId: UserId;
    note: string;
    score: bigint;
    timestamp: Timestamp;
}
export interface WeeklySummary {
    weekEnd: string;
    averageDailyCalories: number;
    totalCalories: number;
    dailySummaries: Array<DailyCalorieSummary>;
    weekStart: string;
}
export interface RegisterStep2Request {
    age: bigint;
    activityLevel: ActivityLevel;
    heightCm: number;
    medicalConditions: Array<MedicalCondition>;
    weightKg: number;
    dietType: DietType;
    dailyCalorieGoal: bigint;
}
export interface RegisterStep3Request {
    stressLevel: bigint;
    fitnessGoals: string;
    sleepHoursPerNight: number;
    smokingStatus: boolean;
    alcoholConsumption: boolean;
}
export interface NutritionPer100g {
    fatG: number;
    fiberG: number;
    sugarG: number;
    caloriesPer100g: number;
    carbsG: number;
    proteinG: number;
}
export interface FoodItem {
    id: bigint;
    name: string;
    category: string;
    isIndian: boolean;
    nutrition: NutritionPer100g;
}
export interface DailyCalorieSummary {
    meals: Array<Meal>;
    date: string;
    goal: bigint;
    remainingCalories: number;
    totalCalories: number;
    percentageUsed: number;
}
export type AuthResult = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface Meal {
    id: bigint;
    foods: Array<MealFoodEntry>;
    userId: UserId;
    totalCarbs: number;
    note: string;
    totalFat: number;
    totalCalories: number;
    totalProtein: number;
    timestamp: Timestamp;
    mealType: MealType;
}
export interface LoginRequest {
    password: string;
    email: string;
}
export interface ExerciseItem {
    id: bigint;
    difficultyLevel: string;
    title: string;
    description: string;
    durationMinutes: bigint;
    exerciseType: string;
    youtubeUrl: string;
    condition: MedicalCondition;
}
export interface DietRecommendation {
    tips: Array<string>;
    sevenDayPlan: Array<Array<string>>;
    avoidFoods: Array<string>;
    recommendedFoods: Array<string>;
    condition: MedicalCondition;
}
export interface HealthReport {
    userId: UserId;
    recentSymptoms: Array<SymptomEntry>;
    generatedAt: Timestamp;
    moodSummary: MoodSummary;
    dietRecommendation?: DietRecommendation;
    dailyTip: string;
    calorieSummaryText: string;
    latestRiskScore?: RiskScoreEntry;
}
export interface SymptomEntry {
    id: bigint;
    userId: UserId;
    symptomsText: string;
    timestamp: Timestamp;
    severity: bigint;
    remedies: Array<string>;
}
export interface RegisterStep1Request {
    username: string;
    dateOfBirth: string;
    fullName: string;
    email: string;
    gender: string;
    passwordHash: string;
}
export interface HealthProfile {
    age: bigint;
    activityLevel: ActivityLevel;
    heightCm: number;
    medicalConditions: Array<MedicalCondition>;
    weightKg: number;
    dietType: DietType;
    dailyCalorieGoal: bigint;
}
export interface HistoryEvent {
    id: bigint;
    title: string;
    userId: UserId;
    description: string;
    timestamp: Timestamp;
    category: HistoryCategory;
}
export interface RiskScoreEntry {
    id: bigint;
    bmi: number;
    userId: UserId;
    score: bigint;
    timestamp: Timestamp;
    factors: Array<string>;
    riskLevel: RiskLevel;
}
export type UserId = Principal;
export interface LifestyleHabits {
    stressLevel: bigint;
    fitnessGoals: string;
    sleepHoursPerNight: number;
    smokingStatus: boolean;
    alcoholConsumption: boolean;
}
export interface AddMealRequest {
    foods: Array<MealFoodEntry>;
    note: string;
    mealType: MealType;
}
export interface MoodSummary {
    period: string;
    entries: Array<MoodEntry>;
    averageScore: number;
}
export interface MealFoodEntry {
    fat: number;
    fiber: number;
    gramsEstimate: number;
    carbs: number;
    calories: number;
    foodItemId: bigint;
    sugar: number;
    portionSize: PortionSize;
    foodName: string;
    protein: number;
}
export interface UserProfile {
    id: UserId;
    basicInfo: BasicInfo;
    createdAt: Timestamp;
    lastLogin: Timestamp;
    healthProfile?: HealthProfile;
    registrationStep: bigint;
    lifestyle?: LifestyleHabits;
}
export enum ActivityLevel {
    active = "active",
    veryActive = "veryActive",
    light = "light",
    sedentary = "sedentary",
    moderate = "moderate"
}
export enum DietType {
    vegan = "vegan",
    nonVegetarian = "nonVegetarian",
    eggetarian = "eggetarian",
    vegetarian = "vegetarian"
}
export enum HistoryCategory {
    symptom = "symptom",
    meal = "meal",
    mood = "mood",
    riskScore = "riskScore"
}
export enum MealType {
    breakfast = "breakfast",
    lunch = "lunch",
    snack = "snack",
    dinner = "dinner"
}
export enum MedicalCondition {
    none = "none",
    pcod = "pcod",
    thyroid = "thyroid",
    obesity = "obesity",
    diabetes = "diabetes"
}
export enum PortionSize {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum RiskLevel {
    red = "red",
    green = "green",
    yellow = "yellow"
}
export interface backendInterface {
    calculateRiskScore(): Promise<RiskScoreEntry>;
    checkSymptoms(symptomsText: string): Promise<SymptomEntry>;
    deleteMeal(mealId: bigint): Promise<boolean>;
    generateHealthReport(): Promise<HealthReport>;
    getDailySummary(date: string): Promise<DailyCalorieSummary>;
    getDailyTip(): Promise<string>;
    getDietRecommendation(): Promise<Array<DietRecommendation>>;
    getExercises(): Promise<Array<ExerciseItem>>;
    getExercisesByCondition(condition: MedicalCondition): Promise<Array<ExerciseItem>>;
    getFoodById(id: bigint): Promise<FoodItem | null>;
    getHealthHistory(categoryFilter: HistoryCategory | null, fromTs: bigint | null, toTs: bigint | null): Promise<Array<HistoryEvent>>;
    getLatestRiskScore(): Promise<RiskScoreEntry | null>;
    getMealHistory(offset: bigint, limit: bigint): Promise<Array<Meal>>;
    getMealsForDate(date: string): Promise<Array<Meal>>;
    getMoodEntries(period: string): Promise<MoodSummary>;
    getMyProfile(): Promise<UserProfile | null>;
    getSymptomHistory(offset: bigint, limit: bigint): Promise<Array<SymptomEntry>>;
    getWeeklySummary(weekStart: string): Promise<WeeklySummary>;
    listFoods(offset: bigint, limit: bigint): Promise<Array<FoodItem>>;
    logMeal(req: AddMealRequest): Promise<Meal>;
    logMood(score: bigint, note: string): Promise<MoodEntry>;
    login(req: LoginRequest): Promise<AuthResult>;
    registerStep1(req: RegisterStep1Request): Promise<AuthResult>;
    registerStep2(req: RegisterStep2Request): Promise<AuthResult>;
    registerStep3(req: RegisterStep3Request): Promise<AuthResult>;
    searchFoods(searchTerm: string): Promise<Array<FoodItem>>;
    setCalorieGoal(goal: bigint): Promise<AuthResult>;
    updateHealthProfile(req: RegisterStep2Request): Promise<AuthResult>;
    updateLifestyle(req: RegisterStep3Request): Promise<AuthResult>;
}
