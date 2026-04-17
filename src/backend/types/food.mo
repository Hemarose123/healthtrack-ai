import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;

  // Nutrition per 100g
  public type NutritionPer100g = {
    caloriesPer100g : Float;
    proteinG : Float;
    carbsG : Float;
    fatG : Float;
    fiberG : Float;
    sugarG : Float;
  };

  public type FoodItem = {
    id : Nat;
    name : Text;
    category : Text;
    nutrition : NutritionPer100g;
    isIndian : Bool;
  };

  public type MealFoodEntry = {
    foodItemId : Nat;
    foodName : Text;
    portionSize : Common.PortionSize;
    gramsEstimate : Float; // small=100, medium=200, large=350
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    fiber : Float;
    sugar : Float;
  };

  public type Meal = {
    id : Nat;
    userId : UserId;
    mealType : Common.MealType;
    foods : [MealFoodEntry];
    totalCalories : Float;
    totalProtein : Float;
    totalCarbs : Float;
    totalFat : Float;
    timestamp : Timestamp;
    note : Text;
  };

  public type DailyCalorieSummary = {
    date : Text; // YYYY-MM-DD
    totalCalories : Float;
    goal : Nat;
    meals : [Meal];
    remainingCalories : Float;
    percentageUsed : Float;
  };

  public type AddMealRequest = {
    mealType : Common.MealType;
    foods : [MealFoodEntry];
    note : Text;
  };

  public type WeeklySummary = {
    weekStart : Text;
    weekEnd : Text;
    dailySummaries : [DailyCalorieSummary];
    averageDailyCalories : Float;
    totalCalories : Float;
  };
};
