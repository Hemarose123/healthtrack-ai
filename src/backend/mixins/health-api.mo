import Types "../types/health";
import AuthTypes "../types/auth";
import CommonTypes "../types/common";
import HealthLib "../lib/health";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

mixin (
  moodEntries : List.List<Types.MoodEntry>,
  symptomEntries : List.List<Types.SymptomEntry>,
  riskScoreEntries : List.List<Types.RiskScoreEntry>,
  exercises : List.List<Types.ExerciseItem>,
  users : List.List<AuthTypes.User>,
  nextMoodId : { var value : Nat },
  nextSymptomId : { var value : Nat },
  nextRiskId : { var value : Nat },
) {
  // ── Mood Tracker ─────────────────────────────────────────────────────────────

  // Log a mood entry
  public shared ({ caller }) func logMood(score : Nat, note : Text) : async Types.MoodEntry {
    let clampedScore : Nat = if (score < 1) 1 else if (score > 5) 5 else score;
    let id = nextMoodId.value;
    nextMoodId.value += 1;
    let entry : Types.MoodEntry = {
      id = id;
      userId = caller;
      score = clampedScore;
      note = note;
      timestamp = Time.now();
    };
    moodEntries.add(entry);
    entry;
  };

  // Get mood entries (optionally filtered by period: "week" or "month")
  public shared query ({ caller }) func getMoodEntries(period : Text) : async Types.MoodSummary {
    let now = Time.now();
    let cutoff : Int = if (period == "week") {
      now - 7 * 24 * 60 * 60 * 1_000_000_000;
    } else if (period == "month") {
      now - 30 * 24 * 60 * 60 * 1_000_000_000;
    } else {
      0; // all time
    };

    let userEntries = moodEntries.filter(func(e : Types.MoodEntry) : Bool {
      Principal.equal(e.userId, caller) and e.timestamp >= cutoff
    });
    userEntries.sortInPlace(func(a : Types.MoodEntry, b : Types.MoodEntry) : { #less; #equal; #greater } {
      Int.compare(a.timestamp, b.timestamp)
    });
    let arr = userEntries.toArray();
    let avg = HealthLib.calcAverageMood(arr);
    {
      entries = arr;
      averageScore = avg;
      period = period;
    };
  };

  // ── Symptoms Checker ─────────────────────────────────────────────────────────

  // Check symptoms (AI-simulated rule-based)
  public shared ({ caller }) func checkSymptoms(symptomsText : Text) : async Types.SymptomEntry {
    let (severity, remedies) = HealthLib.analyzeSymptoms(symptomsText);
    let id = nextSymptomId.value;
    nextSymptomId.value += 1;
    let entry : Types.SymptomEntry = {
      id = id;
      userId = caller;
      symptomsText = symptomsText;
      severity = severity;
      remedies = remedies;
      timestamp = Time.now();
    };
    symptomEntries.add(entry);
    entry;
  };

  // Get symptom history
  public shared query ({ caller }) func getSymptomHistory(offset : Nat, limit : Nat) : async [Types.SymptomEntry] {
    let userSymptoms = symptomEntries.filter(func(s : Types.SymptomEntry) : Bool {
      Principal.equal(s.userId, caller)
    });
    userSymptoms.sortInPlace(func(a : Types.SymptomEntry, b : Types.SymptomEntry) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    });
    let arr = userSymptoms.toArray();
    let size = arr.size();
    if (offset >= size) return [];
    let end = if (offset + limit > size) size else offset + limit;
    Array.tabulate<Types.SymptomEntry>(end - offset, func(i : Nat) : Types.SymptomEntry { arr[offset + i] });
  };

  // ── Health Risk Score ─────────────────────────────────────────────────────────

  // Calculate and store a health risk score
  public shared ({ caller }) func calculateRiskScore() : async Types.RiskScoreEntry {
    let (bmi, conditions) = switch (users.find(func(u : AuthTypes.User) : Bool { Principal.equal(u.id, caller) })) {
      case (?user) {
        switch (user.healthProfile) {
          case (?hp) {
            // BMI = weight(kg) / (height(m))^2
            let heightM = hp.heightCm / 100.0;
            let bmiVal = hp.weightKg / (heightM * heightM);
            (bmiVal, hp.medicalConditions);
          };
          case null (22.0, [] : [CommonTypes.MedicalCondition]);
        };
      };
      case null (22.0, [] : [CommonTypes.MedicalCondition]);
    };

    let (score, riskLevel, factors) = HealthLib.calcRiskScore(bmi, conditions);
    let id = nextRiskId.value;
    nextRiskId.value += 1;
    let entry : Types.RiskScoreEntry = {
      id = id;
      userId = caller;
      bmi = bmi;
      score = score;
      riskLevel = riskLevel;
      factors = factors;
      timestamp = Time.now();
    };
    riskScoreEntries.add(entry);
    entry;
  };

  // Get latest risk score
  public shared query ({ caller }) func getLatestRiskScore() : async ?Types.RiskScoreEntry {
    var latest : ?Types.RiskScoreEntry = null;
    riskScoreEntries.forEach(func(r : Types.RiskScoreEntry) {
      if (Principal.equal(r.userId, caller)) {
        switch (latest) {
          case null { latest := ?r };
          case (?prev) {
            if (r.timestamp > prev.timestamp) { latest := ?r };
          };
        };
      };
    });
    latest;
  };

  // ── Diet Recommendations ──────────────────────────────────────────────────────

  // Get diet recommendation for caller's condition(s)
  public shared query ({ caller }) func getDietRecommendation() : async [Types.DietRecommendation] {
    let conditions : [CommonTypes.MedicalCondition] = switch (users.find(func(u : AuthTypes.User) : Bool {
      Principal.equal(u.id, caller)
    })) {
      case (?user) switch (user.healthProfile) {
        case (?hp) hp.medicalConditions;
        case null [#none];
      };
      case null [#none];
    };

    // Deduplicate and get recommendations
    let seen = List.empty<Text>();
    let recs = List.empty<Types.DietRecommendation>();
    for (cond in conditions.values()) {
      let key = debug_show(cond);
      if (seen.find(func(k : Text) : Bool { k == key }) == null) {
        seen.add(key);
        recs.add(HealthLib.getDietRecommendation(cond));
      };
    };
    if (recs.isEmpty()) {
      recs.add(HealthLib.getDietRecommendation(#none));
    };
    recs.toArray();
  };

  // ── Exercise & Yoga ───────────────────────────────────────────────────────────

  // Get exercises for caller's conditions
  public shared query ({ caller }) func getExercises() : async [Types.ExerciseItem] {
    let conditions : [CommonTypes.MedicalCondition] = switch (users.find(func(u : AuthTypes.User) : Bool {
      Principal.equal(u.id, caller)
    })) {
      case (?user) switch (user.healthProfile) {
        case (?hp) hp.medicalConditions;
        case null [#none];
      };
      case null [#none];
    };

    let seen = List.empty<Nat>();
    let result = List.empty<Types.ExerciseItem>();
    for (cond in conditions.values()) {
      let condExercises = HealthLib.getExercisesForCondition(exercises, cond);
      for (ex in condExercises.values()) {
        if (seen.find(func(id : Nat) : Bool { id == ex.id }) == null) {
          seen.add(ex.id);
          result.add(ex);
        };
      };
    };
    // Always include general (#none) exercises too
    let generalExercises = HealthLib.getExercisesForCondition(exercises, #none);
    for (ex in generalExercises.values()) {
      if (seen.find(func(id : Nat) : Bool { id == ex.id }) == null) {
        seen.add(ex.id);
        result.add(ex);
      };
    };
    result.toArray();
  };

  // Get all exercises filtered by condition
  public shared query func getExercisesByCondition(condition : CommonTypes.MedicalCondition) : async [Types.ExerciseItem] {
    HealthLib.getExercisesForCondition(exercises, condition);
  };

  // ── Health History Timeline ────────────────────────────────────────────────────

  // Get history events filtered by category and/or date range
  public shared query ({ caller }) func getHealthHistory(
    categoryFilter : ?CommonTypes.HistoryCategory,
    fromTs : ?Int,
    toTs : ?Int,
  ) : async [Types.HistoryEvent] {
    HealthLib.buildHistoryEvents(
      moodEntries,
      symptomEntries,
      riskScoreEntries,
      caller,
      categoryFilter,
      fromTs,
      toTs,
    );
  };

  // ── Daily Health Tips ─────────────────────────────────────────────────────────

  // Get today's rotating tip (uses day-of-year from current timestamp)
  public shared query func getDailyTip() : async Text {
    let now = Time.now();
    let secondsPerDay : Int = 86400;
    let dayOfYear : Nat = ((now / 1_000_000_000) / secondsPerDay % 365).toNat();
    HealthLib.getDailyTip(dayOfYear);
  };

  // ── Health Report ─────────────────────────────────────────────────────────────

  // Generate health report summary for the caller
  public shared ({ caller }) func generateHealthReport() : async Types.HealthReport {
    let now = Time.now();
    let sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1_000_000_000;

    // Mood for last 7 days
    let recentMoods = moodEntries.filter(func(e : Types.MoodEntry) : Bool {
      Principal.equal(e.userId, caller) and e.timestamp >= sevenDaysAgo
    }).toArray();
    let avgMood = HealthLib.calcAverageMood(recentMoods);
    let moodSummary : Types.MoodSummary = {
      entries = recentMoods;
      averageScore = avgMood;
      period = "week";
    };

    // Latest risk score
    var latestRisk : ?Types.RiskScoreEntry = null;
    riskScoreEntries.forEach(func(r : Types.RiskScoreEntry) {
      if (Principal.equal(r.userId, caller)) {
        switch (latestRisk) {
          case null { latestRisk := ?r };
          case (?prev) {
            if (r.timestamp > prev.timestamp) { latestRisk := ?r };
          };
        };
      };
    });

    // Last 5 symptoms
    let userSymptoms = symptomEntries.filter(func(s : Types.SymptomEntry) : Bool {
      Principal.equal(s.userId, caller)
    });
    userSymptoms.sortInPlace(func(a : Types.SymptomEntry, b : Types.SymptomEntry) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    });
    let symptomArr = userSymptoms.toArray();
    let recentSymptoms = if (symptomArr.size() <= 5) symptomArr
      else Array.tabulate(5, func(i : Nat) : Types.SymptomEntry { symptomArr[i] });

    // Diet recommendation for user condition
    let conditions : [CommonTypes.MedicalCondition] = switch (users.find(func(u : AuthTypes.User) : Bool {
      Principal.equal(u.id, caller)
    })) {
      case (?user) switch (user.healthProfile) {
        case (?hp) hp.medicalConditions;
        case null [#none];
      };
      case null [#none];
    };
    let primaryCondition : CommonTypes.MedicalCondition = if (conditions.size() > 0) conditions[0] else #none;
    let dietRec : ?Types.DietRecommendation = ?HealthLib.getDietRecommendation(primaryCondition);

    // Calorie summary text
    let calorieSummaryText = "Weekly calorie report available in the Food Tracker section. AI estimation — actual values may vary.";

    // Daily tip
    let dayOfYear : Nat = ((now / 1_000_000_000) / 86400 % 365).toNat();
    let tip = HealthLib.getDailyTip(dayOfYear);

    {
      userId = caller;
      generatedAt = now;
      moodSummary = moodSummary;
      latestRiskScore = latestRisk;
      recentSymptoms = recentSymptoms;
      dietRecommendation = dietRec;
      calorieSummaryText = calorieSummaryText;
      dailyTip = tip;
    };
  };
};
