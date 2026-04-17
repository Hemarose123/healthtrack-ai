module {
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds from Time.now()
  public type MealType = { #breakfast; #lunch; #dinner; #snack };
  public type PortionSize = { #small; #medium; #large };
  public type MedicalCondition = { #diabetes; #pcod; #thyroid; #obesity; #none };
  public type ActivityLevel = { #sedentary; #light; #moderate; #active; #veryActive };
  public type DietType = { #vegetarian; #vegan; #nonVegetarian; #eggetarian };
  public type RiskLevel = { #green; #yellow; #red };
  public type HistoryCategory = { #meal; #mood; #symptom; #riskScore };
};
