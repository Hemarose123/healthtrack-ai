import Types "../types/food";
import CommonTypes "../types/common";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  public type FoodItem = Types.FoodItem;
  public type Meal = Types.Meal;
  public type DailyCalorieSummary = Types.DailyCalorieSummary;
  public type WeeklySummary = Types.WeeklySummary;
  public type MealFoodEntry = Types.MealFoodEntry;

  // Estimate grams from portion size
  public func portionToGrams(portion : CommonTypes.PortionSize) : Float {
    switch (portion) {
      case (#small) 100.0;
      case (#medium) 200.0;
      case (#large) 350.0;
    };
  };

  // Calculate nutrition for a single food entry given portion
  public func calcEntryNutrition(foodItem : FoodItem, portion : CommonTypes.PortionSize) : MealFoodEntry {
    let grams = portionToGrams(portion);
    let factor = grams / 100.0;
    {
      foodItemId = foodItem.id;
      foodName = foodItem.name;
      portionSize = portion;
      gramsEstimate = grams;
      calories = foodItem.nutrition.caloriesPer100g * factor;
      protein = foodItem.nutrition.proteinG * factor;
      carbs = foodItem.nutrition.carbsG * factor;
      fat = foodItem.nutrition.fatG * factor;
      fiber = foodItem.nutrition.fiberG * factor;
      sugar = foodItem.nutrition.sugarG * factor;
    };
  };

  // Sum up calories across all food entries
  public func sumCalories(foods : [MealFoodEntry]) : Float {
    foods.foldLeft(0.0, func(acc : Float, e : MealFoodEntry) : Float { acc + e.calories });
  };

  // Convert nanosecond timestamp to YYYY-MM-DD
  public func timestampToDate(ts : Int) : Text {
    // Convert nanoseconds to seconds
    let seconds = ts / 1_000_000_000;
    // Days since Unix epoch (1970-01-01)
    let totalDays = seconds / 86400;

    // Algorithm to convert days since epoch to year/month/day
    let z = totalDays + 719468;
    let era : Int = if (z >= 0) z / 146097 else (z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if (mp < 10) mp + 3 else mp - 9;
    let yr = if (m <= 2) y + 1 else y;

    let yearStr = yr.toText();
    let monthStr = if (m < 10) "0" # m.toText() else m.toText();
    let dayStr = if (d < 10) "0" # d.toText() else d.toText();
    yearStr # "-" # monthStr # "-" # dayStr;
  };

  // Get meals for a specific user on a specific date (YYYY-MM-DD)
  public func getMealsForDate(meals : List.List<Meal>, userId : Principal, date : Text) : [Meal] {
    meals.filter(func(m : Meal) : Bool {
      Principal.equal(m.userId, userId) and timestampToDate(m.timestamp) == date
    }).toArray();
  };

  // Build daily calorie summary for a date
  public func buildDailySummary(
    meals : List.List<Meal>,
    userId : Principal,
    date : Text,
    goal : Nat,
  ) : DailyCalorieSummary {
    let dayMeals = getMealsForDate(meals, userId, date);
    let total = dayMeals.foldLeft(0.0, func(acc : Float, m : Meal) : Float { acc + m.totalCalories });
    let goalF : Float = goal.toFloat();
    let remaining = goalF - total;
    let pct = if (goalF > 0.0) (total / goalF) * 100.0 else 0.0;
    {
      date = date;
      totalCalories = total;
      goal = goal;
      meals = dayMeals;
      remainingCalories = remaining;
      percentageUsed = pct;
    };
  };

  // Add days to a YYYY-MM-DD date string
  func addDays(date : Text, n : Int) : Text {
    // Parse date
    let parts = date.split(#char '-').toArray();
    if (parts.size() != 3) return date;
    let yr = switch (parts[0].toInt()) { case (?v) v; case null 2024 };
    let mo = switch (parts[1].toInt()) { case (?v) v; case null 1 };
    let dy = switch (parts[2].toInt()) { case (?v) v; case null 1 };

    // Convert to days since epoch, add n, convert back
    let y = if (mo <= 2) yr - 1 else yr;
    let m_adj = if (mo <= 2) mo + 9 else mo - 3;
    let era2 : Int = if (y >= 0) y / 400 else (y - 399) / 400;
    let yoe2 = y - era2 * 400;
    let doy2 = (153 * m_adj + 2) / 5 + dy - 1;
    let doe2 = yoe2 * 365 + yoe2 / 4 - yoe2 / 100 + doy2;
    let z2 = era2 * 146097 + doe2 - 719468;
    timestampToDate((z2 + n) * 86400 * 1_000_000_000);
  };

  // Build weekly summary from a start date
  public func buildWeeklySummary(
    meals : List.List<Meal>,
    userId : Principal,
    weekStart : Text,
    goal : Nat,
  ) : WeeklySummary {
    let days = Array.tabulate(7, func(i : Nat) : DailyCalorieSummary {
      let date = addDays(weekStart, i.toInt());
      buildDailySummary(meals, userId, date, goal);
    });
    let totalCals = days.foldLeft(0.0, func(acc : Float, d : DailyCalorieSummary) : Float { acc + d.totalCalories });
    let avg = totalCals / 7.0;
    let weekEnd = addDays(weekStart, 6);
    {
      weekStart = weekStart;
      weekEnd = weekEnd;
      dailySummaries = days;
      averageDailyCalories = avg;
      totalCalories = totalCals;
    };
  };

  // Get food item by id from database map
  public func getFoodById(db : Map.Map<Nat, FoodItem>, id : Nat) : ?FoodItem {
    db.get(id);
  };

  // Search foods by name substring (case-insensitive)
  public func searchFoods(db : Map.Map<Nat, FoodItem>, searchTerm : Text) : [FoodItem] {
    let lower = searchTerm.toLower();
    db.values().filter(func(f : FoodItem) : Bool {
      f.name.toLower().contains(#text lower)
    }).toArray();
  };
};
