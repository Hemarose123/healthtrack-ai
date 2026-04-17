import Types "../types/health";
import CommonTypes "../types/common";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  public type MoodEntry = Types.MoodEntry;
  public type SymptomEntry = Types.SymptomEntry;
  public type RiskScoreEntry = Types.RiskScoreEntry;
  public type DietRecommendation = Types.DietRecommendation;
  public type ExerciseItem = Types.ExerciseItem;
  public type HistoryEvent = Types.HistoryEvent;
  public type HealthReport = Types.HealthReport;

  // ── Mood helpers ─────────────────────────────────────────────────────────────

  public func getMoodEntriesForUser(
    entries : List.List<MoodEntry>,
    userId : Principal,
  ) : [MoodEntry] {
    entries.filter(func(e : MoodEntry) : Bool {
      Principal.equal(e.userId, userId)
    }).toArray();
  };

  public func calcAverageMood(entries : [MoodEntry]) : Float {
    if (entries.size() == 0) return 0.0;
    let total = entries.foldLeft(0.0, func(acc : Float, e : MoodEntry) : Float {
      acc + e.score.toFloat()
    });
    total / entries.size().toFloat();
  };

  // ── Symptoms AI simulation ───────────────────────────────────────────────────

  // keyword → (severity contribution, remedies)
  type SymptomRule = { keyword : Text; severity : Nat; remedies : [Text] };

  let symptomRules : [SymptomRule] = [
    {
      keyword = "headache";
      severity = 4;
      remedies = [
        "💧 Drink plenty of water",
        "😴 Rest in a dark quiet room",
        "🧊 Apply cold compress on forehead",
        "🌿 Try peppermint or lavender aromatherapy",
      ];
    },
    {
      keyword = "fever";
      severity = 6;
      remedies = [
        "💧 Stay well hydrated",
        "🧊 Use cool damp cloth on forehead",
        "🛏️ Get adequate rest",
        "🌡️ Monitor temperature every 4 hours",
        "🍵 Drink warm ginger-lemon tea",
      ];
    },
    {
      keyword = "fatigue";
      severity = 3;
      remedies = [
        "😴 Ensure 7-8 hours of quality sleep",
        "🥗 Eat iron-rich foods (spinach, lentils)",
        "🚶 Light exercise like a 10-min walk",
        "🧘 Practice deep breathing",
        "☀️ Get morning sunlight exposure",
      ];
    },
    {
      keyword = "nausea";
      severity = 5;
      remedies = [
        "🍵 Sip on ginger tea or lemon water",
        "🍌 Eat small bland meals (banana, toast)",
        "🌬️ Get fresh air",
        "🙅 Avoid strong smells",
        "💊 Try acupressure wristbands",
      ];
    },
    {
      keyword = "cough";
      severity = 4;
      remedies = [
        "🍯 Honey-ginger-lemon warm drink",
        "💨 Inhale steam with eucalyptus",
        "💧 Stay hydrated",
        "🌿 Tulsi (Holy Basil) tea",
        "🚭 Avoid dusty or smoky environments",
      ];
    },
    {
      keyword = "chest pain";
      severity = 9;
      remedies = [
        "⚠️ Seek medical attention immediately if severe",
        "😮‍💨 Practice slow deep breathing",
        "🛋️ Rest in a comfortable position",
        "🚫 Avoid caffeine and alcohol",
        "👨‍⚕️ Consult a doctor — chest pain needs evaluation",
      ];
    },
    {
      keyword = "back pain";
      severity = 5;
      remedies = [
        "🧊 Apply ice pack first 48 hrs, then heat",
        "🧘 Gentle stretching and yoga",
        "🚶 Short walks to keep muscles active",
        "💆 Massage with warm oil",
        "🪑 Improve posture and ergonomics",
      ];
    },
    {
      keyword = "stomach";
      severity = 4;
      remedies = [
        "🍵 Drink warm ginger or fennel tea",
        "🍌 Eat light, easily digestible foods",
        "💧 Stay hydrated with ORS if needed",
        "🚫 Avoid spicy, oily foods",
        "🧘 Try gentle abdominal massage",
      ];
    },
    {
      keyword = "cold";
      severity = 3;
      remedies = [
        "🍵 Warm turmeric milk (golden milk)",
        "💧 Drink warm fluids frequently",
        "💨 Steam inhalation with eucalyptus oil",
        "😴 Rest well",
        "🌿 Tulsi kadha (herbal decoction)",
      ];
    },
    {
      keyword = "anxiety";
      severity = 5;
      remedies = [
        "🧘 Practice 4-7-8 breathing technique",
        "🚶 Take a gentle walk in nature",
        "📔 Journaling to release thoughts",
        "🎵 Listen to calming music",
        "🌿 Ashwagandha herbal supplement",
      ];
    },
    {
      keyword = "insomnia";
      severity = 4;
      remedies = [
        "📱 Avoid screens 1 hour before bed",
        "🫖 Chamomile tea before bedtime",
        "🌙 Keep a consistent sleep schedule",
        "🧘 Try progressive muscle relaxation",
        "🌿 Lavender aromatherapy for sleep",
      ];
    },
    {
      keyword = "dizziness";
      severity = 6;
      remedies = [
        "🛋️ Sit or lie down immediately",
        "💧 Drink water — may be dehydrated",
        "🍌 Eat a small snack if blood sugar is low",
        "🔄 Move slowly when changing positions",
        "👨‍⚕️ Consult a doctor if episodes recur",
      ];
    },
  ];

  public func analyzeSymptoms(symptomsText : Text) : (Nat, [Text]) {
    let lower = symptomsText.toLower();
    var totalSeverity : Nat = 0;
    var matchCount : Nat = 0;
    let remedyList = List.empty<Text>();

    for (rule in symptomRules.values()) {
      if (lower.contains(#text(rule.keyword))) {
        totalSeverity += rule.severity;
        matchCount += 1;
        for (remedy in rule.remedies.values()) {
          // avoid duplicates (simple check)
          if (remedyList.find(func(r : Text) : Bool { r == remedy }) == null) {
            remedyList.add(remedy);
          };
        };
      };
    };

    let severity : Nat = if (matchCount == 0) {
      2 // default mild severity
    } else {
      let avg = totalSeverity / matchCount;
      if (avg > 10) 10 else avg;
    };

    if (remedyList.isEmpty()) {
      remedyList.add("💧 Stay well hydrated");
      remedyList.add("😴 Get adequate rest");
      remedyList.add("🍵 Drink warm herbal tea");
      remedyList.add("👨‍⚕️ Consult a doctor if symptoms persist");
    };

    (severity, remedyList.toArray());
  };

  // ── Health risk score ────────────────────────────────────────────────────────

  public func calcRiskScore(
    bmi : Float,
    conditions : [CommonTypes.MedicalCondition],
  ) : (Nat, CommonTypes.RiskLevel, [Text]) {
    let factors = List.empty<Text>();

    // BMI scoring
    var bmiScore : Nat = 0;
    if (bmi < 18.5) {
      bmiScore := 25;
      factors.add("⚠️ Underweight (BMI " # bmi.toText() # ")");
    } else if (bmi <= 24.9) {
      bmiScore := 0;
      factors.add("✅ Healthy BMI (" # bmi.toText() # ")");
    } else if (bmi <= 29.9) {
      bmiScore := 20;
      factors.add("⚠️ Overweight (BMI " # bmi.toText() # ")");
    } else {
      bmiScore := 40;
      factors.add("🔴 Obese (BMI " # bmi.toText() # ")");
    };

    // Condition scoring (+10 per condition)
    var condScore : Nat = 0;
    for (cond in conditions.values()) {
      switch (cond) {
        case (#diabetes) {
          condScore += 15;
          factors.add("🩺 Diabetes");
        };
        case (#pcod) {
          condScore += 10;
          factors.add("🩺 PCOD");
        };
        case (#thyroid) {
          condScore += 10;
          factors.add("🩺 Thyroid disorder");
        };
        case (#obesity) {
          condScore += 15;
          factors.add("🩺 Obesity");
        };
        case (#none) {};
      };
    };

    let rawScore = bmiScore + condScore;
    let score : Nat = if (rawScore > 100) 100 else rawScore;
    let riskLevel : CommonTypes.RiskLevel = if (score < 30) #green else if (score < 60) #yellow else #red;

    (score, riskLevel, factors.toArray());
  };

  // ── Diet recommendations ─────────────────────────────────────────────────────

  public func getDietRecommendation(condition : CommonTypes.MedicalCondition) : DietRecommendation {
    switch (condition) {
      case (#diabetes) {
        {
          condition = #diabetes;
          recommendedFoods = [
            "🥬 Leafy greens (spinach, methi)",
            "🥑 Avocado",
            "🫘 Legumes (dal, chana)",
            "🐟 Fatty fish (salmon, mackerel)",
            "🥚 Eggs",
            "🫐 Berries",
            "🥜 Nuts (almonds, walnuts)",
            "🌾 Whole grains (brown rice, oats)",
            "🧄 Garlic and onion",
            "🫑 Bell peppers",
          ];
          avoidFoods = [
            "🍬 Sugary beverages and sweets",
            "🍞 White bread and refined flour",
            "🍚 White rice in large portions",
            "🍟 Fried and processed foods",
            "🍭 Candy and desserts",
            "🥤 Fruit juices (high sugar)",
            "🍰 Pastries and cakes",
          ];
          sevenDayPlan = [
            ["Oats porridge with nuts", "Dal + Brown rice + Salad", "Grilled fish + Vegetables"],
            ["Methi paratha (1) + Curd", "Rajma curry + Roti", "Egg curry + Steamed veggies"],
            ["Besan chilla + Green chutney", "Mixed dal + Brown rice", "Grilled chicken + Salad"],
            ["Smoothie (spinach+berries)", "Chickpea curry + Roti", "Paneer tikka + Raita"],
            ["Daliya upma", "Moong dal khichdi", "Baked fish + Stir-fry veggies"],
            ["Sprouts salad + Eggs", "Palak paneer + Roti", "Tofu stir-fry + Brown rice"],
            ["Ragi dosa + Sambhar", "Vegetable soup + Dal", "Grilled prawns + Veggies"],
          ];
          tips = [
            "🕐 Eat small meals every 2-3 hours",
            "📏 Control portion sizes",
            "🚶 Walk 30 minutes after meals",
            "💧 Drink 8-10 glasses of water daily",
            "🌙 Avoid eating 2 hours before bed",
          ];
        };
      };
      case (#pcod) {
        {
          condition = #pcod;
          recommendedFoods = [
            "🥬 Anti-inflammatory veggies (broccoli, spinach)",
            "🫐 Antioxidant-rich berries",
            "🌾 Whole grains (quinoa, oats)",
            "🫘 High-fiber legumes",
            "🐟 Omega-3 rich fish",
            "🥜 Flaxseeds and chia seeds",
            "🫚 Olive oil (healthy fats)",
            "🧄 Turmeric and anti-inflammatory spices",
          ];
          avoidFoods = [
            "🍬 Refined sugars and sweets",
            "🥛 Full-fat dairy (limit)",
            "🍞 Processed and refined carbs",
            "🍔 Fast food",
            "🧂 Excess salt",
            "🥤 Sugary drinks",
          ];
          sevenDayPlan = [
            ["Oats with flaxseed + Berries", "Quinoa salad + Grilled veggies", "Salmon + Steamed broccoli"],
            ["Smoothie (spinach+chia)", "Lentil soup + Roti", "Tofu stir-fry + Brown rice"],
            ["Eggs + Avocado toast", "Chickpea salad", "Grilled chicken + Vegetables"],
            ["Methi seeds water + Fruit", "Dal + Brown rice", "Paneer tikka + Salad"],
            ["Ragi porridge + Nuts", "Mixed vegetable curry + Roti", "Baked fish + Quinoa"],
            ["Greek yogurt + Berries", "Palak soup + Whole wheat roti", "Stir-fry veggies + Eggs"],
            ["Daliya with vegetables", "Rajma + Brown rice", "Grilled prawns + Salad"],
          ];
          tips = [
            "🌿 Include spearmint tea to help with hormones",
            "🏃 Regular exercise improves insulin sensitivity",
            "😴 Prioritize 8 hours of quality sleep",
            "🧘 Manage stress with yoga and meditation",
            "💊 Consider inositol supplements (consult doctor)",
          ];
        };
      };
      case (#thyroid) {
        {
          condition = #thyroid;
          recommendedFoods = [
            "🐟 Iodine-rich seafood (seaweed, fish)",
            "🥚 Eggs (iodine + selenium)",
            "🥜 Brazil nuts (selenium)",
            "🫘 Legumes and beans",
            "🍗 Lean chicken",
            "🫐 Antioxidant-rich fruits",
            "🌾 Whole grains",
            "🧅 Onions and garlic",
          ];
          avoidFoods = [
            "🥦 Raw cruciferous veggies in excess (cook them)",
            "🌰 Soy products in large amounts",
            "🍬 Processed foods",
            "☕ Excess caffeine",
            "🍺 Alcohol",
            "🧂 Processed salt",
          ];
          sevenDayPlan = [
            ["Eggs + Whole grain toast", "Fish curry + Brown rice", "Chicken soup + Veggies"],
            ["Oats + Walnuts + Berries", "Legume salad + Roti", "Grilled salmon + Salad"],
            ["Greek yogurt + Nuts", "Rajma curry + Brown rice", "Egg stir-fry + Veggies"],
            ["Smoothie (banana+almond milk)", "Tuna salad wrap", "Grilled chicken + Quinoa"],
            ["Daliya + Seeds", "Dal tadka + Roti", "Seafood curry + Brown rice"],
            ["Fruit bowl + Brazil nuts", "Paneer curry + Roti", "Baked fish + Steamed veggies"],
            ["Scrambled eggs + Toast", "Mixed dal + Brown rice", "Prawn masala + Roti"],
          ];
          tips = [
            "⏰ Take thyroid medication on empty stomach",
            "☕ Wait 30 min after meds before coffee",
            "💊 Adequate selenium and iodine are essential",
            "🧘 Yoga poses like shoulder stand may help",
            "👨‍⚕️ Regular thyroid level monitoring needed",
          ];
        };
      };
      case (#obesity) {
        {
          condition = #obesity;
          recommendedFoods = [
            "🥬 High-volume, low-calorie vegetables",
            "🍎 High-fiber fruits (apple, pear)",
            "🫘 Protein-rich legumes",
            "🥚 Eggs (satiating protein)",
            "🐟 Lean protein (fish, chicken)",
            "🥣 Oats and whole grains",
            "🥜 Nuts (in moderation)",
            "💧 Water-rich foods (cucumber, watermelon)",
          ];
          avoidFoods = [
            "🍟 Fried and fast foods",
            "🍬 Sugary snacks and beverages",
            "🍰 High-calorie desserts",
            "🥤 Sugary drinks and juices",
            "🍞 Refined carbohydrates",
            "🧀 High-fat dairy",
            "🥩 Processed meats",
          ];
          sevenDayPlan = [
            ["Oats + Apple slices", "Salad + Grilled chicken (200g)", "Vegetable soup + Dal"],
            ["Eggs (2) + Cucumber", "Lentil soup + 1 Roti", "Stir-fry veggies + Tofu"],
            ["Smoothie (spinach+banana)", "Grilled fish + Steamed veggies", "Moong dal khichdi"],
            ["Sprouts salad", "Rajma (small portion) + Brown rice", "Grilled chicken + Salad"],
            ["Daliya with veggies", "Chickpea salad + Yogurt", "Clear vegetable soup"],
            ["Greek yogurt + Berries", "Mixed veg curry (no oil) + Roti", "Baked fish + Quinoa"],
            ["Fruit bowl", "Dal + Brown rice (small)", "Egg white bhurji + Salad"],
          ];
          tips = [
            "🥤 Drink a glass of water before meals",
            "🐌 Eat slowly and mindfully",
            "📱 Track calories with this app",
            "🏃 Aim for 10,000 steps daily",
            "🌙 Avoid eating after 8 PM",
            "😴 Poor sleep increases hunger hormones",
          ];
        };
      };
      case (#none) {
        {
          condition = #none;
          recommendedFoods = [
            "🥬 Fresh leafy vegetables daily",
            "🍎 2-3 seasonal fruits",
            "🫘 Legumes and pulses",
            "🌾 Whole grains (brown rice, oats)",
            "🥜 Handful of nuts",
            "🐟 Fish or lean protein 3x/week",
            "🥚 Eggs",
            "💧 8-10 glasses of water",
          ];
          avoidFoods = [
            "🍟 Deep-fried foods",
            "🍬 Excess sugars",
            "🥤 Sugary beverages",
            "🍞 Highly refined carbohydrates",
            "🧂 Excess salt",
            "🍺 Alcohol in excess",
          ];
          sevenDayPlan = [
            ["Poha + Tea", "Dal + Rice + Sabzi", "Roti + Sabzi + Salad"],
            ["Idli (3) + Sambhar", "Rajma + Rice", "Paneer curry + Roti"],
            ["Paratha + Curd", "Chole + Rice", "Egg curry + Roti"],
            ["Upma + Fruits", "Mixed dal + Roti", "Grilled chicken + Salad"],
            ["Dosa + Chutney", "Palak paneer + Roti", "Fish curry + Brown rice"],
            ["Oats porridge", "Vegetable pulao + Raita", "Dal makhani + Roti"],
            ["Aloo poha + Tea", "Kadhi + Rice", "Chicken curry + Roti + Salad"],
          ];
          tips = [
            "🌈 Eat a rainbow of vegetables",
            "⏰ Maintain regular meal timings",
            "🚶 30 minutes of activity daily",
            "💧 Stay well hydrated",
            "😴 7-8 hours of sleep nightly",
          ];
        };
      };
    };
  };

  // ── Exercise list ─────────────────────────────────────────────────────────────

  public func getExercisesForCondition(
    exercises : List.List<ExerciseItem>,
    condition : CommonTypes.MedicalCondition,
  ) : [ExerciseItem] {
    exercises.filter(func(e : ExerciseItem) : Bool {
      switch (e.condition) {
        case (#none) true; // general exercises for everyone
        case (c) c == condition;
      };
    }).toArray();
  };

  // ── History builder ───────────────────────────────────────────────────────────

  public func buildHistoryEvents(
    moods : List.List<MoodEntry>,
    symptoms : List.List<SymptomEntry>,
    riskScores : List.List<RiskScoreEntry>,
    userId : Principal,
    categoryFilter : ?CommonTypes.HistoryCategory,
    fromTs : ?Int,
    toTs : ?Int,
  ) : [HistoryEvent] {
    let events = List.empty<HistoryEvent>();
    var nextId : Nat = 0;

    let inRange = func(ts : Int) : Bool {
      let afterFrom = switch (fromTs) {
        case (?from) ts >= from;
        case null true;
      };
      let beforeTo = switch (toTs) {
        case (?to) ts <= to;
        case null true;
      };
      afterFrom and beforeTo;
    };

    let includeMood = switch (categoryFilter) {
      case (?#mood) true;
      case (null) true;
      case _ false;
    };
    let includeSymptom = switch (categoryFilter) {
      case (?#symptom) true;
      case (null) true;
      case _ false;
    };
    let includeRisk = switch (categoryFilter) {
      case (?#riskScore) true;
      case (null) true;
      case _ false;
    };

    if (includeMood) {
      moods.forEach(func(m : MoodEntry) {
        if (Principal.equal(m.userId, userId) and inRange(m.timestamp)) {
          let emoji = if (m.score >= 5) "😄" else if (m.score >= 4) "🙂" else if (m.score >= 3) "😐" else if (m.score >= 2) "😔" else "😢";
          events.add({
            id = nextId;
            userId = userId;
            category = #mood;
            title = emoji # " Mood logged: " # m.score.toText() # "/5";
            description = if (m.note == "") "No note added" else m.note;
            timestamp = m.timestamp;
          });
          nextId += 1;
        };
      });
    };

    if (includeSymptom) {
      symptoms.forEach(func(s : SymptomEntry) {
        if (Principal.equal(s.userId, userId) and inRange(s.timestamp)) {
          events.add({
            id = nextId;
            userId = userId;
            category = #symptom;
            title = "🩺 Symptoms checked (severity " # s.severity.toText() # "/10)";
            description = s.symptomsText;
            timestamp = s.timestamp;
          });
          nextId += 1;
        };
      });
    };

    if (includeRisk) {
      riskScores.forEach(func(r : RiskScoreEntry) {
        if (Principal.equal(r.userId, userId) and inRange(r.timestamp)) {
          let levelText = switch (r.riskLevel) {
            case (#green) "Low Risk 🟢";
            case (#yellow) "Medium Risk 🟡";
            case (#red) "High Risk 🔴";
          };
          events.add({
            id = nextId;
            userId = userId;
            category = #riskScore;
            title = "📊 Health risk score: " # r.score.toText() # "/100 — " # levelText;
            description = "BMI: " # r.bmi.toText();
            timestamp = r.timestamp;
          });
          nextId += 1;
        };
      });
    };

    // Sort by timestamp descending
    events.sortInPlace(func(a : HistoryEvent, b : HistoryEvent) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    });
    events.toArray();
  };

  // ── Daily health tips ─────────────────────────────────────────────────────────

  let healthTips : [Text] = [
    "💧 Drink at least 8 glasses of water today — hydration boosts energy and focus.",
    "🌞 Get 15 minutes of morning sunlight to regulate your circadian rhythm and mood.",
    "🥬 Add one extra serving of vegetables to your next meal for fiber and vitamins.",
    "🧘 Take 5 minutes for deep belly breathing to reduce cortisol levels.",
    "🚶 A 20-minute walk after meals can lower blood sugar by up to 22%.",
    "😴 Aim for 7-8 hours of uninterrupted sleep — it's when your body repairs itself.",
    "🍎 Eat an apple a day — the quercetin in apple skin fights inflammation.",
    "🧄 Add raw garlic to your food — it has natural antibacterial properties.",
    "🏃 Even 10 minutes of exercise releases endorphins and improves your mood.",
    "🫁 Practice box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.",
    "🌿 Try tulsi (holy basil) tea — it's an adaptogen that reduces stress.",
    "🥜 A handful of mixed nuts daily provides heart-healthy omega-3 fatty acids.",
    "📱 Take digital detox breaks — 20 minutes away from screens every 2 hours.",
    "🍋 Start your day with warm lemon water to boost digestion and immunity.",
    "🧠 Learn something new today — mental stimulation reduces dementia risk.",
    "🤸 Stretch for 5 minutes every hour if you sit at a desk — it prevents injury.",
    "🫐 Blueberries are a brain superfood — eat them 3x a week for memory.",
    "🌬️ Nasal breathing activates the parasympathetic system and calms anxiety.",
    "🥗 Aim for 30 different plant foods per week for a diverse gut microbiome.",
    "☀️ Vitamin D deficiency affects 1 in 4 people — get tested if you feel low.",
    "🫀 Your heart beats 100,000 times daily — thank it with 30 min of movement.",
    "🧊 Cold water splashes on your face activates the vagus nerve and reduces stress.",
    "🌙 A consistent bedtime (even weekends) massively improves sleep quality.",
    "🥚 Eggs are one of the most nutrient-dense foods — don't skip the yolk.",
    "🎵 Music at 432Hz frequency has been shown to reduce anxiety and promote calm.",
    "🧹 A clean, decluttered space reduces cortisol and improves mental clarity.",
    "💃 Dance for 10 minutes — it's exercise, stress relief, and joy all in one.",
    "🍵 Green tea contains L-theanine, which improves focus without anxiety.",
    "🌳 Spend 20 minutes in nature today — it lowers blood pressure and stress.",
    "😂 Laughter really is medicine — it boosts immunity and reduces pain.",
    "🥦 Cruciferous vegetables like broccoli contain sulforaphane, a cancer-fighter.",
    "💪 Resistance training 2x/week prevents muscle loss and boosts metabolism.",
    "🫶 Acts of kindness release oxytocin and serotonin — help someone today.",
  ];

  public func getDailyTip(dayOfYear : Nat) : Text {
    let idx = dayOfYear % healthTips.size();
    healthTips[idx];
  };
};
