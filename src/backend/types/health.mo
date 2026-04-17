import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type UserId = Common.UserId;

  // Mood
  public type MoodEntry = {
    id : Nat;
    userId : UserId;
    score : Nat; // 1-5
    note : Text;
    timestamp : Timestamp;
  };

  public type MoodSummary = {
    entries : [MoodEntry];
    averageScore : Float;
    period : Text;
  };

  // Symptoms
  public type SymptomEntry = {
    id : Nat;
    userId : UserId;
    symptomsText : Text;
    severity : Nat; // 1-10 (AI-simulated)
    remedies : [Text];
    timestamp : Timestamp;
  };

  // Risk score
  public type RiskScoreEntry = {
    id : Nat;
    userId : UserId;
    bmi : Float;
    score : Nat; // 0-100
    riskLevel : Common.RiskLevel;
    factors : [Text];
    timestamp : Timestamp;
  };

  // Diet recommendation
  public type DietRecommendation = {
    condition : Common.MedicalCondition;
    recommendedFoods : [Text];
    avoidFoods : [Text];
    sevenDayPlan : [[Text]]; // 7 days, each day has list of meal suggestions
    tips : [Text];
  };

  // Exercise / Yoga
  public type ExerciseItem = {
    id : Nat;
    title : Text;
    description : Text;
    youtubeUrl : Text;
    condition : Common.MedicalCondition;
    difficultyLevel : Text; // beginner/intermediate/advanced
    durationMinutes : Nat;
    exerciseType : Text; // yoga/cardio/strength/stretching
  };

  // History timeline event (shared-safe union)
  public type HistoryEvent = {
    id : Nat;
    userId : UserId;
    category : Common.HistoryCategory;
    title : Text;
    description : Text;
    timestamp : Timestamp;
  };

  // Health report summary
  public type HealthReport = {
    userId : UserId;
    generatedAt : Timestamp;
    moodSummary : MoodSummary;
    latestRiskScore : ?RiskScoreEntry;
    recentSymptoms : [SymptomEntry];
    dietRecommendation : ?DietRecommendation;
    calorieSummaryText : Text;
    dailyTip : Text;
  };
};
