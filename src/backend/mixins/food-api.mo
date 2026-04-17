import Types "../types/food";
import AuthTypes "../types/auth";
import FoodLib "../lib/food";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

mixin (
  meals : List.List<Types.Meal>,
  foodDb : Map.Map<Nat, Types.FoodItem>,
  users : List.List<AuthTypes.User>,
  nextMealId : { var value : Nat },
) {
  // Search food database
  public shared query func searchFoods(searchTerm : Text) : async [Types.FoodItem] {
    FoodLib.searchFoods(foodDb, searchTerm);
  };

  // Get all foods (paginated)
  public shared query func listFoods(offset : Nat, limit : Nat) : async [Types.FoodItem] {
    let all = foodDb.values().toArray();
    let size = all.size();
    if (offset >= size) return [];
    let end = if (offset + limit > size) size else offset + limit;
    Array.tabulate<Types.FoodItem>(end - offset, func(i : Nat) : Types.FoodItem { all[offset + i] });
  };

  // Get food by id
  public shared query func getFoodById(id : Nat) : async ?Types.FoodItem {
    FoodLib.getFoodById(foodDb, id);
  };

  // Log a meal for the caller
  public shared ({ caller }) func logMeal(req : Types.AddMealRequest) : async Types.Meal {
    // Resolve full food entries with nutrition calculations
    let resolvedFoods = req.foods.map(func(entry : Types.MealFoodEntry) : Types.MealFoodEntry {
      switch (foodDb.get(entry.foodItemId)) {
        case (?foodItem) FoodLib.calcEntryNutrition(foodItem, entry.portionSize);
        case null entry; // keep as-is if food not found (manual entry)
      };
    });

    let totalCalories = resolvedFoods.foldLeft(0.0, func(acc : Float, e : Types.MealFoodEntry) : Float { acc + e.calories });
    let totalProtein = resolvedFoods.foldLeft(0.0, func(acc : Float, e : Types.MealFoodEntry) : Float { acc + e.protein });
    let totalCarbs = resolvedFoods.foldLeft(0.0, func(acc : Float, e : Types.MealFoodEntry) : Float { acc + e.carbs });
    let totalFat = resolvedFoods.foldLeft(0.0, func(acc : Float, e : Types.MealFoodEntry) : Float { acc + e.fat });

    let id = nextMealId.value;
    nextMealId.value += 1;

    // Prune old meals if over 1000 per user
    let userMealCount = meals.filter(func(m : Types.Meal) : Bool {
      Principal.equal(m.userId, caller)
    }).size();
    if (userMealCount >= 1000) {
      // Find and remove oldest meal for this user
      switch (meals.findIndex(func(m : Types.Meal) : Bool { Principal.equal(m.userId, caller) })) {
        case (?idx) {
          let mSz = meals.size();
          let mLast : Nat = if (mSz > 0) { mSz - 1 } else { 0 };
          meals.put(idx, meals.at(mLast));
          ignore meals.removeLast();
        };
        case null {};
      };
    };

    let meal : Types.Meal = {
      id = id;
      userId = caller;
      mealType = req.mealType;
      foods = resolvedFoods;
      totalCalories = totalCalories;
      totalProtein = totalProtein;
      totalCarbs = totalCarbs;
      totalFat = totalFat;
      timestamp = Time.now();
      note = req.note;
    };
    meals.add(meal);
    meal;
  };

  // Get meals for a specific date (YYYY-MM-DD)
  public shared query ({ caller }) func getMealsForDate(date : Text) : async [Types.Meal] {
    FoodLib.getMealsForDate(meals, caller, date);
  };

  // Get daily calorie summary for a date
  public shared query ({ caller }) func getDailySummary(date : Text) : async Types.DailyCalorieSummary {
    let goal = switch (users.find(func(u : AuthTypes.User) : Bool { Principal.equal(u.id, caller) })) {
      case (?user) switch (user.healthProfile) {
        case (?hp) hp.dailyCalorieGoal;
        case null 2000;
      };
      case null 2000;
    };
    FoodLib.buildDailySummary(meals, caller, date, goal);
  };

  // Get weekly calorie summary from a start date
  public shared query ({ caller }) func getWeeklySummary(weekStart : Text) : async Types.WeeklySummary {
    let goal = switch (users.find(func(u : AuthTypes.User) : Bool { Principal.equal(u.id, caller) })) {
      case (?user) switch (user.healthProfile) {
        case (?hp) hp.dailyCalorieGoal;
        case null 2000;
      };
      case null 2000;
    };
    FoodLib.buildWeeklySummary(meals, caller, weekStart, goal);
  };

  // Get all meals history for the caller (most recent first)
  public shared query ({ caller }) func getMealHistory(offset : Nat, limit : Nat) : async [Types.Meal] {
    let userMeals = meals.filter(func(m : Types.Meal) : Bool {
      Principal.equal(m.userId, caller)
    });
    userMeals.sortInPlace(func(a : Types.Meal, b : Types.Meal) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    });
    let arr = userMeals.toArray();
    let size = arr.size();
    if (offset >= size) return [];
    let end = if (offset + limit > size) size else offset + limit;
    Array.tabulate<Types.Meal>(end - offset, func(i : Nat) : Types.Meal { arr[offset + i] });
  };

  // Delete a meal by id
  public shared ({ caller }) func deleteMeal(mealId : Nat) : async Bool {
    switch (meals.findIndex(func(m : Types.Meal) : Bool { m.id == mealId and Principal.equal(m.userId, caller) })) {
      case (?idx) {
        // Swap with last and remove
        let sz = meals.size();
        let last : Nat = if (sz > 0) { sz - 1 } else { 0 };
        if (idx != last) {
          meals.put(idx, meals.at(last));
        };
        ignore meals.removeLast();
        true;
      };
      case null false;
    };
  };
};
