import AuthTypes "types/auth";
import FoodTypes "types/food";
import HealthTypes "types/health";
import List "mo:core/List";
import Map "mo:core/Map";

import AuthMixin "mixins/auth-api";
import FoodMixin "mixins/food-api";
import HealthMixin "mixins/health-api";

actor {
  // ── Auth state ──────────────────────────────────────────────────────────────
  let users = List.empty<AuthTypes.User>();
  let nextUserId = { var value : Nat = 0 };

  // ── Food state ──────────────────────────────────────────────────────────────
  let meals = List.empty<FoodTypes.Meal>();
  let nextMealId = { var value : Nat = 0 };

  // Pre-populated food database (seeded once at init)
  let foodDb : Map.Map<Nat, FoodTypes.FoodItem> = Map.fromArray<Nat, FoodTypes.FoodItem>([
    // ── Grains & Staples ───────────────────────────────────────────────────
    (0, { id = 0; name = "White Rice (cooked)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 130.0; proteinG = 2.7; carbsG = 28.2; fatG = 0.3; fiberG = 0.4; sugarG = 0.0 } }),
    (1, { id = 1; name = "Brown Rice (cooked)"; category = "Grains"; isIndian = false; nutrition = { caloriesPer100g = 112.0; proteinG = 2.6; carbsG = 23.5; fatG = 0.9; fiberG = 1.8; sugarG = 0.0 } }),
    (2, { id = 2; name = "Chapati / Roti (whole wheat)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 297.0; proteinG = 9.7; carbsG = 52.9; fatG = 5.3; fiberG = 3.2; sugarG = 0.3 } }),
    (3, { id = 3; name = "Paratha (plain)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 326.0; proteinG = 8.2; carbsG = 45.0; fatG = 13.0; fiberG = 2.5; sugarG = 0.5 } }),
    (4, { id = 4; name = "Idli"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 58.0; proteinG = 2.0; carbsG = 11.4; fatG = 0.4; fiberG = 0.5; sugarG = 0.0 } }),
    (5, { id = 5; name = "Dosa (plain)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 168.0; proteinG = 3.9; carbsG = 26.4; fatG = 5.3; fiberG = 1.0; sugarG = 0.5 } }),
    (6, { id = 6; name = "Poha (flattened rice)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 180.0; proteinG = 3.5; carbsG = 37.0; fatG = 2.0; fiberG = 1.2; sugarG = 0.0 } }),
    (7, { id = 7; name = "Upma"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 155.0; proteinG = 3.5; carbsG = 22.0; fatG = 5.0; fiberG = 2.0; sugarG = 0.0 } }),
    (8, { id = 8; name = "Oats (cooked)"; category = "Grains"; isIndian = false; nutrition = { caloriesPer100g = 68.0; proteinG = 2.4; carbsG = 12.0; fatG = 1.4; fiberG = 1.7; sugarG = 0.0 } }),
    (9, { id = 9; name = "Whole Wheat Bread"; category = "Grains"; isIndian = false; nutrition = { caloriesPer100g = 247.0; proteinG = 9.0; carbsG = 41.0; fatG = 4.2; fiberG = 6.0; sugarG = 5.0 } }),
    (10, { id = 10; name = "Quinoa (cooked)"; category = "Grains"; isIndian = false; nutrition = { caloriesPer100g = 120.0; proteinG = 4.4; carbsG = 21.3; fatG = 1.9; fiberG = 2.8; sugarG = 0.9 } }),
    (11, { id = 11; name = "Daliya (broken wheat porridge)"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 140.0; proteinG = 4.5; carbsG = 28.0; fatG = 0.8; fiberG = 4.0; sugarG = 0.0 } }),
    // ── Lentils & Legumes ──────────────────────────────────────────────────
    (12, { id = 12; name = "Toor Dal (cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 116.0; proteinG = 7.2; carbsG = 20.6; fatG = 0.4; fiberG = 3.7; sugarG = 0.0 } }),
    (13, { id = 13; name = "Moong Dal (cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 105.0; proteinG = 7.0; carbsG = 19.0; fatG = 0.4; fiberG = 4.1; sugarG = 0.0 } }),
    (14, { id = 14; name = "Rajma (kidney beans, cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 127.0; proteinG = 8.7; carbsG = 22.8; fatG = 0.5; fiberG = 7.4; sugarG = 0.3 } }),
    (15, { id = 15; name = "Chole (chickpeas, cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 164.0; proteinG = 8.9; carbsG = 27.4; fatG = 2.6; fiberG = 7.6; sugarG = 4.8 } }),
    (16, { id = 16; name = "Masoor Dal (red lentils, cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 116.0; proteinG = 9.0; carbsG = 20.1; fatG = 0.4; fiberG = 7.9; sugarG = 1.8 } }),
    (17, { id = 17; name = "Black Dal (Urad, cooked)"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 95.0; proteinG = 7.0; carbsG = 17.0; fatG = 0.4; fiberG = 3.3; sugarG = 0.0 } }),
    (18, { id = 18; name = "Moong Sprouts"; category = "Legumes"; isIndian = true; nutrition = { caloriesPer100g = 30.0; proteinG = 3.0; carbsG = 5.9; fatG = 0.2; fiberG = 1.8; sugarG = 0.0 } }),
    // ── Vegetables ────────────────────────────────────────────────────────
    (19, { id = 19; name = "Spinach (raw)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 23.0; proteinG = 2.9; carbsG = 3.6; fatG = 0.4; fiberG = 2.2; sugarG = 0.4 } }),
    (20, { id = 20; name = "Palak (cooked spinach)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 35.0; proteinG = 3.5; carbsG = 4.5; fatG = 0.5; fiberG = 2.5; sugarG = 0.5 } }),
    (21, { id = 21; name = "Broccoli (cooked)"; category = "Vegetables"; isIndian = false; nutrition = { caloriesPer100g = 35.0; proteinG = 2.4; carbsG = 7.2; fatG = 0.4; fiberG = 3.3; sugarG = 1.7 } }),
    (22, { id = 22; name = "Cauliflower (gobi, cooked)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 25.0; proteinG = 2.0; carbsG = 5.0; fatG = 0.3; fiberG = 2.3; sugarG = 1.9 } }),
    (23, { id = 23; name = "Aloo (potato, boiled)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 77.0; proteinG = 2.0; carbsG = 17.5; fatG = 0.1; fiberG = 1.8; sugarG = 0.8 } }),
    (24, { id = 24; name = "Tomato (raw)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 18.0; proteinG = 0.9; carbsG = 3.9; fatG = 0.2; fiberG = 1.2; sugarG = 2.6 } }),
    (25, { id = 25; name = "Onion (raw)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 40.0; proteinG = 1.1; carbsG = 9.3; fatG = 0.1; fiberG = 1.7; sugarG = 4.2 } }),
    (26, { id = 26; name = "Cucumber (raw)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 16.0; proteinG = 0.7; carbsG = 3.6; fatG = 0.1; fiberG = 0.5; sugarG = 1.7 } }),
    (27, { id = 27; name = "Bell Pepper (capsicum)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 31.0; proteinG = 1.0; carbsG = 6.0; fatG = 0.3; fiberG = 2.1; sugarG = 4.2 } }),
    (28, { id = 28; name = "Bhindi (okra, cooked)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 33.0; proteinG = 1.9; carbsG = 7.5; fatG = 0.2; fiberG = 3.2; sugarG = 1.5 } }),
    (29, { id = 29; name = "Bitter Gourd (karela)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 17.0; proteinG = 1.0; carbsG = 3.7; fatG = 0.2; fiberG = 2.8; sugarG = 1.9 } }),
    (30, { id = 30; name = "Sweet Potato (boiled)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 86.0; proteinG = 1.6; carbsG = 20.1; fatG = 0.1; fiberG = 3.0; sugarG = 4.2 } }),
    // ── Fruits ────────────────────────────────────────────────────────────
    (31, { id = 31; name = "Apple"; category = "Fruits"; isIndian = false; nutrition = { caloriesPer100g = 52.0; proteinG = 0.3; carbsG = 13.8; fatG = 0.2; fiberG = 2.4; sugarG = 10.4 } }),
    (32, { id = 32; name = "Banana"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 89.0; proteinG = 1.1; carbsG = 22.8; fatG = 0.3; fiberG = 2.6; sugarG = 12.2 } }),
    (33, { id = 33; name = "Mango (alphonso)"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 60.0; proteinG = 0.8; carbsG = 15.0; fatG = 0.4; fiberG = 1.6; sugarG = 13.7 } }),
    (34, { id = 34; name = "Orange"; category = "Fruits"; isIndian = false; nutrition = { caloriesPer100g = 47.0; proteinG = 0.9; carbsG = 11.8; fatG = 0.1; fiberG = 2.4; sugarG = 9.4 } }),
    (35, { id = 35; name = "Papaya"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 43.0; proteinG = 0.5; carbsG = 10.8; fatG = 0.3; fiberG = 1.7; sugarG = 7.8 } }),
    (36, { id = 36; name = "Guava"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 68.0; proteinG = 2.6; carbsG = 14.3; fatG = 1.0; fiberG = 5.4; sugarG = 8.9 } }),
    (37, { id = 37; name = "Watermelon"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 30.0; proteinG = 0.6; carbsG = 7.6; fatG = 0.2; fiberG = 0.4; sugarG = 6.2 } }),
    (38, { id = 38; name = "Blueberries"; category = "Fruits"; isIndian = false; nutrition = { caloriesPer100g = 57.0; proteinG = 0.7; carbsG = 14.5; fatG = 0.3; fiberG = 2.4; sugarG = 9.9 } }),
    (39, { id = 39; name = "Pomegranate (anaar)"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 83.0; proteinG = 1.7; carbsG = 18.7; fatG = 1.2; fiberG = 4.0; sugarG = 13.7 } }),
    (40, { id = 40; name = "Grapes"; category = "Fruits"; isIndian = false; nutrition = { caloriesPer100g = 69.0; proteinG = 0.7; carbsG = 18.1; fatG = 0.2; fiberG = 0.9; sugarG = 15.5 } }),
    // ── Proteins ──────────────────────────────────────────────────────────
    (41, { id = 41; name = "Chicken Breast (grilled)"; category = "Proteins"; isIndian = false; nutrition = { caloriesPer100g = 165.0; proteinG = 31.0; carbsG = 0.0; fatG = 3.6; fiberG = 0.0; sugarG = 0.0 } }),
    (42, { id = 42; name = "Chicken Curry"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 190.0; proteinG = 20.0; carbsG = 5.0; fatG = 10.0; fiberG = 0.5; sugarG = 1.0 } }),
    (43, { id = 43; name = "Egg (boiled, whole)"; category = "Proteins"; isIndian = false; nutrition = { caloriesPer100g = 155.0; proteinG = 13.0; carbsG = 1.1; fatG = 11.0; fiberG = 0.0; sugarG = 1.1 } }),
    (44, { id = 44; name = "Paneer (cottage cheese)"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 265.0; proteinG = 18.3; carbsG = 1.2; fatG = 20.8; fiberG = 0.0; sugarG = 0.0 } }),
    (45, { id = 45; name = "Salmon (grilled)"; category = "Proteins"; isIndian = false; nutrition = { caloriesPer100g = 208.0; proteinG = 20.0; carbsG = 0.0; fatG = 13.0; fiberG = 0.0; sugarG = 0.0 } }),
    (46, { id = 46; name = "Rohu Fish Curry"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 150.0; proteinG = 17.0; carbsG = 4.0; fatG = 7.5; fiberG = 0.0; sugarG = 0.5 } }),
    (47, { id = 47; name = "Tofu (firm)"; category = "Proteins"; isIndian = false; nutrition = { caloriesPer100g = 76.0; proteinG = 8.0; carbsG = 1.9; fatG = 4.8; fiberG = 0.3; sugarG = 0.0 } }),
    (48, { id = 48; name = "Greek Yogurt (plain, low fat)"; category = "Proteins"; isIndian = false; nutrition = { caloriesPer100g = 59.0; proteinG = 10.0; carbsG = 3.6; fatG = 0.4; fiberG = 0.0; sugarG = 3.2 } }),
    (49, { id = 49; name = "Curd / Dahi (plain)"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 61.0; proteinG = 3.5; carbsG = 4.7; fatG = 3.3; fiberG = 0.0; sugarG = 4.7 } }),
    (50, { id = 50; name = "Dal Makhani"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 155.0; proteinG = 7.0; carbsG = 18.0; fatG = 6.5; fiberG = 5.0; sugarG = 1.0 } }),
    // ── Nuts & Seeds ──────────────────────────────────────────────────────
    (51, { id = 51; name = "Almonds"; category = "Nuts"; isIndian = false; nutrition = { caloriesPer100g = 579.0; proteinG = 21.2; carbsG = 21.6; fatG = 49.9; fiberG = 12.5; sugarG = 4.4 } }),
    (52, { id = 52; name = "Walnuts"; category = "Nuts"; isIndian = false; nutrition = { caloriesPer100g = 654.0; proteinG = 15.2; carbsG = 13.7; fatG = 65.2; fiberG = 6.7; sugarG = 2.6 } }),
    (53, { id = 53; name = "Peanuts (roasted)"; category = "Nuts"; isIndian = true; nutrition = { caloriesPer100g = 567.0; proteinG = 25.8; carbsG = 16.1; fatG = 49.2; fiberG = 8.5; sugarG = 3.9 } }),
    (54, { id = 54; name = "Flaxseeds"; category = "Seeds"; isIndian = false; nutrition = { caloriesPer100g = 534.0; proteinG = 18.3; carbsG = 28.9; fatG = 42.2; fiberG = 27.3; sugarG = 1.5 } }),
    (55, { id = 55; name = "Chia Seeds"; category = "Seeds"; isIndian = false; nutrition = { caloriesPer100g = 486.0; proteinG = 17.0; carbsG = 42.0; fatG = 31.0; fiberG = 34.4; sugarG = 0.0 } }),
    // ── Dairy ─────────────────────────────────────────────────────────────
    (56, { id = 56; name = "Full Cream Milk"; category = "Dairy"; isIndian = true; nutrition = { caloriesPer100g = 61.0; proteinG = 3.2; carbsG = 4.8; fatG = 3.3; fiberG = 0.0; sugarG = 4.8 } }),
    (57, { id = 57; name = "Skimmed Milk"; category = "Dairy"; isIndian = false; nutrition = { caloriesPer100g = 34.0; proteinG = 3.4; carbsG = 5.0; fatG = 0.1; fiberG = 0.0; sugarG = 5.0 } }),
    (58, { id = 58; name = "Cheese (cheddar)"; category = "Dairy"; isIndian = false; nutrition = { caloriesPer100g = 403.0; proteinG = 25.0; carbsG = 1.3; fatG = 33.0; fiberG = 0.0; sugarG = 0.5 } }),
    // ── Snacks ────────────────────────────────────────────────────────────
    (59, { id = 59; name = "Samosa (2 pcs)"; category = "Snacks"; isIndian = true; nutrition = { caloriesPer100g = 308.0; proteinG = 6.0; carbsG = 35.0; fatG = 16.0; fiberG = 2.5; sugarG = 1.0 } }),
    (60, { id = 60; name = "Pakora (mixed veg)"; category = "Snacks"; isIndian = true; nutrition = { caloriesPer100g = 280.0; proteinG = 8.0; carbsG = 30.0; fatG = 14.0; fiberG = 3.0; sugarG = 1.0 } }),
    (61, { id = 61; name = "Dhokla"; category = "Snacks"; isIndian = true; nutrition = { caloriesPer100g = 150.0; proteinG = 5.5; carbsG = 24.0; fatG = 3.5; fiberG = 2.0; sugarG = 3.0 } }),
    (62, { id = 62; name = "Pani Puri (6 pcs)"; category = "Snacks"; isIndian = true; nutrition = { caloriesPer100g = 185.0; proteinG = 4.0; carbsG = 35.0; fatG = 4.5; fiberG = 2.5; sugarG = 3.0 } }),
    (63, { id = 63; name = "Granola Bar"; category = "Snacks"; isIndian = false; nutrition = { caloriesPer100g = 471.0; proteinG = 9.0; carbsG = 64.0; fatG = 20.0; fiberG = 4.5; sugarG = 25.0 } }),
    // ── Beverages ─────────────────────────────────────────────────────────
    (64, { id = 64; name = "Masala Chai (with milk & sugar)"; category = "Beverages"; isIndian = true; nutrition = { caloriesPer100g = 45.0; proteinG = 1.5; carbsG = 7.5; fatG = 1.5; fiberG = 0.0; sugarG = 6.0 } }),
    (65, { id = 65; name = "Lassi (sweet)"; category = "Beverages"; isIndian = true; nutrition = { caloriesPer100g = 87.0; proteinG = 3.5; carbsG = 14.0; fatG = 2.5; fiberG = 0.0; sugarG = 13.0 } }),
    (66, { id = 66; name = "Fresh Lime Water (no sugar)"; category = "Beverages"; isIndian = true; nutrition = { caloriesPer100g = 8.0; proteinG = 0.1; carbsG = 2.0; fatG = 0.0; fiberG = 0.0; sugarG = 0.5 } }),
    (67, { id = 67; name = "Coconut Water"; category = "Beverages"; isIndian = true; nutrition = { caloriesPer100g = 19.0; proteinG = 0.7; carbsG = 3.7; fatG = 0.2; fiberG = 1.1; sugarG = 2.6 } }),
    (68, { id = 68; name = "Green Tea"; category = "Beverages"; isIndian = false; nutrition = { caloriesPer100g = 1.0; proteinG = 0.0; carbsG = 0.2; fatG = 0.0; fiberG = 0.0; sugarG = 0.0 } }),
    (69, { id = 69; name = "Orange Juice (fresh)"; category = "Beverages"; isIndian = false; nutrition = { caloriesPer100g = 45.0; proteinG = 0.7; carbsG = 10.4; fatG = 0.2; fiberG = 0.2; sugarG = 8.4 } }),
    // ── Curries & Main Dishes ─────────────────────────────────────────────
    (70, { id = 70; name = "Palak Paneer"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 195.0; proteinG = 9.0; carbsG = 9.0; fatG = 14.0; fiberG = 2.5; sugarG = 2.0 } }),
    (71, { id = 71; name = "Butter Chicken (murgh makhani)"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 230.0; proteinG = 16.0; carbsG = 8.0; fatG = 15.0; fiberG = 1.0; sugarG = 3.0 } }),
    (72, { id = 72; name = "Biryani (chicken)"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 210.0; proteinG = 12.0; carbsG = 26.0; fatG = 7.0; fiberG = 1.5; sugarG = 1.0 } }),
    (73, { id = 73; name = "Sambhar"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 80.0; proteinG = 4.0; carbsG = 12.0; fatG = 2.0; fiberG = 3.5; sugarG = 2.0 } }),
    (74, { id = 74; name = "Khichdi (moong dal)"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 130.0; proteinG = 5.0; carbsG = 22.0; fatG = 3.0; fiberG = 3.0; sugarG = 0.5 } }),
    (75, { id = 75; name = "Vegetable Pulao"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 165.0; proteinG = 4.0; carbsG = 28.0; fatG = 4.5; fiberG = 2.0; sugarG = 1.0 } }),
    (76, { id = 76; name = "Fish Curry (south Indian)"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 175.0; proteinG = 18.0; carbsG = 6.0; fatG = 9.0; fiberG = 1.0; sugarG = 2.0 } }),
    // ── Salads ────────────────────────────────────────────────────────────
    (77, { id = 77; name = "Kachumber Salad"; category = "Salads"; isIndian = true; nutrition = { caloriesPer100g = 30.0; proteinG = 1.2; carbsG = 6.0; fatG = 0.3; fiberG = 1.8; sugarG = 3.5 } }),
    (78, { id = 78; name = "Caesar Salad (no croutons)"; category = "Salads"; isIndian = false; nutrition = { caloriesPer100g = 120.0; proteinG = 4.0; carbsG = 5.0; fatG = 10.0; fiberG = 1.5; sugarG = 1.0 } }),
    (79, { id = 79; name = "Sprouts Salad"; category = "Salads"; isIndian = true; nutrition = { caloriesPer100g = 75.0; proteinG = 5.5; carbsG = 12.0; fatG = 0.5; fiberG = 3.5; sugarG = 2.0 } }),
    // ── Desserts ──────────────────────────────────────────────────────────
    (80, { id = 80; name = "Rasgulla"; category = "Desserts"; isIndian = true; nutrition = { caloriesPer100g = 186.0; proteinG = 4.0; carbsG = 39.0; fatG = 2.0; fiberG = 0.0; sugarG = 35.0 } }),
    (81, { id = 81; name = "Gulab Jamun (2 pcs)"; category = "Desserts"; isIndian = true; nutrition = { caloriesPer100g = 387.0; proteinG = 6.5; carbsG = 56.0; fatG = 15.0; fiberG = 0.5; sugarG = 45.0 } }),
    (82, { id = 82; name = "Kheer (rice pudding)"; category = "Desserts"; isIndian = true; nutrition = { caloriesPer100g = 165.0; proteinG = 4.5; carbsG = 25.0; fatG = 5.5; fiberG = 0.2; sugarG = 20.0 } }),
    // ── International Foods ──────────────────────────────────────────────
    (83, { id = 83; name = "Pizza Margherita (1 slice)"; category = "International"; isIndian = false; nutrition = { caloriesPer100g = 250.0; proteinG = 10.0; carbsG = 32.0; fatG = 9.0; fiberG = 1.5; sugarG = 3.0 } }),
    (84, { id = 84; name = "Burger (veg patty)"; category = "International"; isIndian = false; nutrition = { caloriesPer100g = 280.0; proteinG = 9.0; carbsG = 38.0; fatG = 11.0; fiberG = 3.0; sugarG = 6.0 } }),
    (85, { id = 85; name = "Pasta (cooked, tomato sauce)"; category = "International"; isIndian = false; nutrition = { caloriesPer100g = 131.0; proteinG = 5.0; carbsG = 24.0; fatG = 1.5; fiberG = 1.8; sugarG = 3.0 } }),
    (86, { id = 86; name = "Sushi (salmon roll, 6 pcs)"; category = "International"; isIndian = false; nutrition = { caloriesPer100g = 145.0; proteinG = 6.5; carbsG = 20.0; fatG = 4.5; fiberG = 0.5; sugarG = 3.0 } }),
    (87, { id = 87; name = "French Fries"; category = "International"; isIndian = false; nutrition = { caloriesPer100g = 312.0; proteinG = 3.4; carbsG = 41.4; fatG = 15.0; fiberG = 3.8; sugarG = 0.3 } }),
    (88, { id = 88; name = "Avocado"; category = "Fruits"; isIndian = false; nutrition = { caloriesPer100g = 160.0; proteinG = 2.0; carbsG = 8.5; fatG = 14.7; fiberG = 6.7; sugarG = 0.7 } }),
    (89, { id = 89; name = "Sweet Corn (cooked)"; category = "Vegetables"; isIndian = false; nutrition = { caloriesPer100g = 96.0; proteinG = 3.4; carbsG = 21.0; fatG = 1.5; fiberG = 2.4; sugarG = 4.5 } }),
    (90, { id = 90; name = "Mushroom (cooked)"; category = "Vegetables"; isIndian = false; nutrition = { caloriesPer100g = 28.0; proteinG = 3.6; carbsG = 4.5; fatG = 0.4; fiberG = 1.3; sugarG = 2.0 } }),
    (91, { id = 91; name = "Carrot (raw)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 41.0; proteinG = 0.9; carbsG = 9.6; fatG = 0.2; fiberG = 2.8; sugarG = 4.7 } }),
    (92, { id = 92; name = "Peas (cooked)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 84.0; proteinG = 5.4; carbsG = 15.6; fatG = 0.4; fiberG = 5.5; sugarG = 5.7 } }),
    (93, { id = 93; name = "Coconut (desiccated)"; category = "Nuts"; isIndian = true; nutrition = { caloriesPer100g = 354.0; proteinG = 3.3; carbsG = 15.2; fatG = 33.5; fiberG = 9.0; sugarG = 6.2 } }),
    (94, { id = 94; name = "Pumpkin (cooked)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 26.0; proteinG = 1.0; carbsG = 6.5; fatG = 0.1; fiberG = 0.5; sugarG = 2.8 } }),
    (95, { id = 95; name = "Methi (fenugreek leaves, cooked)"; category = "Vegetables"; isIndian = true; nutrition = { caloriesPer100g = 49.0; proteinG = 4.4; carbsG = 6.0; fatG = 0.9; fiberG = 3.9; sugarG = 0.0 } }),
    (96, { id = 96; name = "Amla (Indian gooseberry)"; category = "Fruits"; isIndian = true; nutrition = { caloriesPer100g = 44.0; proteinG = 0.9; carbsG = 10.2; fatG = 0.6; fiberG = 4.3; sugarG = 5.0 } }),
    (97, { id = 97; name = "Ragi (finger millet) porridge"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 144.0; proteinG = 3.4; carbsG = 32.0; fatG = 1.5; fiberG = 3.6; sugarG = 1.0 } }),
    (98, { id = 98; name = "Curd Rice"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 120.0; proteinG = 3.5; carbsG = 20.0; fatG = 3.0; fiberG = 0.5; sugarG = 2.5 } }),
    (99, { id = 99; name = "Pav Bhaji"; category = "Snacks"; isIndian = true; nutrition = { caloriesPer100g = 225.0; proteinG = 6.0; carbsG = 35.0; fatG = 7.5; fiberG = 3.5; sugarG = 4.0 } }),
    (100, { id = 100; name = "Egg Bhurji (scrambled eggs)"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 190.0; proteinG = 14.0; carbsG = 5.0; fatG = 13.0; fiberG = 0.5; sugarG = 2.0 } }),
    (101, { id = 101; name = "Masala Omelette"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 185.0; proteinG = 12.0; carbsG = 4.0; fatG = 14.0; fiberG = 0.5; sugarG = 1.0 } }),
    (102, { id = 102; name = "Lemon Rice"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 155.0; proteinG = 3.0; carbsG = 28.0; fatG = 4.0; fiberG = 1.0; sugarG = 0.5 } }),
    (103, { id = 103; name = "Aloo Gobi Curry"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 95.0; proteinG = 2.5; carbsG = 13.0; fatG = 4.0; fiberG = 2.8; sugarG = 2.0 } }),
    (104, { id = 104; name = "Paneer Tikka"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 230.0; proteinG = 14.0; carbsG = 8.0; fatG = 16.0; fiberG = 1.5; sugarG = 2.0 } }),
    (105, { id = 105; name = "Tandoori Chicken"; category = "Proteins"; isIndian = true; nutrition = { caloriesPer100g = 195.0; proteinG = 28.0; carbsG = 5.0; fatG = 8.0; fiberG = 0.5; sugarG = 2.0 } }),
    (106, { id = 106; name = "Matar Paneer"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 185.0; proteinG = 9.0; carbsG = 12.0; fatG = 12.0; fiberG = 3.0; sugarG = 2.5 } }),
    (107, { id = 107; name = "Kadhi Pakora"; category = "Main Dish"; isIndian = true; nutrition = { caloriesPer100g = 125.0; proteinG = 4.5; carbsG = 15.0; fatG = 5.5; fiberG = 2.0; sugarG = 3.0 } }),
    (108, { id = 108; name = "Aloo Paratha"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 280.0; proteinG = 6.5; carbsG = 40.0; fatG = 10.0; fiberG = 2.5; sugarG = 1.0 } }),
    (109, { id = 109; name = "Uttapam"; category = "Grains"; isIndian = true; nutrition = { caloriesPer100g = 120.0; proteinG = 3.5; carbsG = 19.0; fatG = 3.5; fiberG = 1.5; sugarG = 1.0 } }),
    (110, { id = 110; name = "Pongal (sweet)"; category = "Desserts"; isIndian = true; nutrition = { caloriesPer100g = 175.0; proteinG = 3.5; carbsG = 30.0; fatG = 5.0; fiberG = 0.5; sugarG = 18.0 } }),
  ]);

  // ── Health state ────────────────────────────────────────────────────────────
  let moodEntries = List.empty<HealthTypes.MoodEntry>();
  let symptomEntries = List.empty<HealthTypes.SymptomEntry>();
  let riskScoreEntries = List.empty<HealthTypes.RiskScoreEntry>();
  let nextMoodId = { var value : Nat = 0 };
  let nextSymptomId = { var value : Nat = 0 };
  let nextRiskId = { var value : Nat = 0 };

  // Pre-populated exercise database
  let exercises : List.List<HealthTypes.ExerciseItem> = List.fromArray<HealthTypes.ExerciseItem>([
    // General / All conditions
    { id = 0; title = "Sun Salutation (Surya Namaskar)"; description = "A complete full-body yoga sequence that stretches and strengthens all major muscle groups. Perfect for starting your day."; youtubeUrl = "https://www.youtube.com/watch?v=Vg0piW685bA"; condition = #none; difficultyLevel = "beginner"; durationMinutes = 15; exerciseType = "yoga" },
    { id = 1; title = "Morning Walk"; description = "A brisk 30-minute morning walk to kickstart your metabolism and improve cardiovascular health."; youtubeUrl = "https://www.youtube.com/watch?v=hnLHiE9Ense"; condition = #none; difficultyLevel = "beginner"; durationMinutes = 30; exerciseType = "cardio" },
    { id = 2; title = "Deep Breathing (Pranayama)"; description = "Anulom Vilom (alternate nostril breathing) to reduce stress, improve lung capacity and mental clarity."; youtubeUrl = "https://www.youtube.com/watch?v=Lz5vBKCvO4E"; condition = #none; difficultyLevel = "beginner"; durationMinutes = 10; exerciseType = "yoga" },
    { id = 3; title = "Full Body Stretching"; description = "Gentle full-body stretch routine to improve flexibility, reduce stiffness and prevent injury."; youtubeUrl = "https://www.youtube.com/watch?v=L_xrDAtykMI"; condition = #none; difficultyLevel = "beginner"; durationMinutes = 20; exerciseType = "stretching" },
    // Diabetes
    { id = 4; title = "Chair Yoga for Diabetes"; description = "Low-impact yoga poses designed to improve insulin sensitivity and blood sugar regulation for diabetics."; youtubeUrl = "https://www.youtube.com/watch?v=G_8e5kSvPMU"; condition = #diabetes; difficultyLevel = "beginner"; durationMinutes = 20; exerciseType = "yoga" },
    { id = 5; title = "Walking After Meals"; description = "A gentle 15-minute post-meal walk proven to lower blood sugar levels by up to 22%."; youtubeUrl = "https://www.youtube.com/watch?v=hnLHiE9Ense"; condition = #diabetes; difficultyLevel = "beginner"; durationMinutes = 15; exerciseType = "cardio" },
    { id = 6; title = "Resistance Band Workout"; description = "Strength training with resistance bands to improve glucose uptake in muscles and reduce insulin resistance."; youtubeUrl = "https://www.youtube.com/watch?v=SWllzXlFfxI"; condition = #diabetes; difficultyLevel = "intermediate"; durationMinutes = 30; exerciseType = "strength" },
    // PCOD
    { id = 7; title = "Yoga for PCOD/PCOS"; description = "Targeted yoga sequence including Baddha Konasana and Supta Baddha Konasana to support hormonal balance and reduce PCOD symptoms."; youtubeUrl = "https://www.youtube.com/watch?v=m0L0TqLEJo0"; condition = #pcod; difficultyLevel = "beginner"; durationMinutes = 25; exerciseType = "yoga" },
    { id = 8; title = "HIIT for PCOS (low intensity)"; description = "Modified low-intensity interval training to help with weight management and insulin resistance in PCOS."; youtubeUrl = "https://www.youtube.com/watch?v=H9kzEzRoBrI"; condition = #pcod; difficultyLevel = "intermediate"; durationMinutes = 20; exerciseType = "cardio" },
    { id = 9; title = "Strength Training for PCOS"; description = "Weight training to improve hormonal balance, increase metabolism and manage PCOS symptoms effectively."; youtubeUrl = "https://www.youtube.com/watch?v=UBMk30rjy0o"; condition = #pcod; difficultyLevel = "intermediate"; durationMinutes = 35; exerciseType = "strength" },
    // Thyroid
    { id = 10; title = "Yoga for Thyroid (Sarvangasana)"; description = "Shoulder stand and supported bridge poses that stimulate the thyroid gland and improve its function."; youtubeUrl = "https://www.youtube.com/watch?v=XpH2sMRCpec"; condition = #thyroid; difficultyLevel = "intermediate"; durationMinutes = 20; exerciseType = "yoga" },
    { id = 11; title = "Neck Stretches for Thyroid"; description = "Gentle neck and throat exercises to stimulate thyroid gland circulation and reduce stiffness."; youtubeUrl = "https://www.youtube.com/watch?v=2DkiGMCLUuc"; condition = #thyroid; difficultyLevel = "beginner"; durationMinutes = 10; exerciseType = "stretching" },
    { id = 12; title = "Low-Impact Cardio for Thyroid"; description = "Swimming or cycling to boost metabolism and energy levels affected by thyroid disorders."; youtubeUrl = "https://www.youtube.com/watch?v=Yb1N6WXFuTg"; condition = #thyroid; difficultyLevel = "beginner"; durationMinutes = 30; exerciseType = "cardio" },
    // Obesity
    { id = 13; title = "Beginner Weight Loss Yoga"; description = "A 30-minute yoga flow focused on core strengthening, calorie burning and boosting metabolism for weight loss."; youtubeUrl = "https://www.youtube.com/watch?v=v7AYKMP6rOE"; condition = #obesity; difficultyLevel = "beginner"; durationMinutes = 30; exerciseType = "yoga" },
    { id = 14; title = "Low-Impact Cardio Workout"; description = "Joint-friendly cardio exercises for beginners — no jumping required. Burns calories while being easy on the knees."; youtubeUrl = "https://www.youtube.com/watch?v=ml6cT4AZdqI"; condition = #obesity; difficultyLevel = "beginner"; durationMinutes = 30; exerciseType = "cardio" },
    { id = 15; title = "Strength Training for Fat Loss"; description = "Full body resistance training routine to build muscle, boost metabolism and accelerate fat loss."; youtubeUrl = "https://www.youtube.com/watch?v=UBMk30rjy0o"; condition = #obesity; difficultyLevel = "intermediate"; durationMinutes = 40; exerciseType = "strength" },
    { id = 16; title = "HIIT for Beginners"; description = "High-intensity interval training adapted for beginners — 20-second work bursts to maximise calorie burn."; youtubeUrl = "https://www.youtube.com/watch?v=H9kzEzRoBrI"; condition = #obesity; difficultyLevel = "intermediate"; durationMinutes = 20; exerciseType = "cardio" },
  ]);

  // ── Mixin composition ────────────────────────────────────────────────────────
  include AuthMixin(users, nextUserId);
  include FoodMixin(meals, foodDb, users, nextMealId);
  include HealthMixin(
    moodEntries,
    symptomEntries,
    riskScoreEntries,
    exercises,
    users,
    nextMoodId,
    nextSymptomId,
    nextRiskId,
  );
};
