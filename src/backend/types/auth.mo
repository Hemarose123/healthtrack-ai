import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Step 1: basic info
  public type BasicInfo = {
    username : Text;
    email : Text;
    passwordHash : Text; // bcrypt-style hash stored as Text
    fullName : Text;
    dateOfBirth : Text; // ISO date string
    gender : Text;
  };

  // Step 2: health profile
  public type HealthProfile = {
    age : Nat;
    weightKg : Float;
    heightCm : Float;
    medicalConditions : [Common.MedicalCondition];
    dietType : Common.DietType;
    activityLevel : Common.ActivityLevel;
    dailyCalorieGoal : Nat; // default 2000
  };

  // Step 3: lifestyle habits
  public type LifestyleHabits = {
    sleepHoursPerNight : Float;
    smokingStatus : Bool;
    alcoholConsumption : Bool;
    stressLevel : Nat; // 1-10
    fitnessGoals : Text;
  };

  public type User = {
    id : UserId;
    var basicInfo : BasicInfo;
    var healthProfile : ?HealthProfile;
    var lifestyle : ?LifestyleHabits;
    var registrationStep : Nat; // 1, 2, or 3 (complete)
    createdAt : Timestamp;
    var lastLogin : Timestamp;
  };

  // Shared-safe public view
  public type UserProfile = {
    id : UserId;
    basicInfo : BasicInfo;
    healthProfile : ?HealthProfile;
    lifestyle : ?LifestyleHabits;
    registrationStep : Nat;
    createdAt : Timestamp;
    lastLogin : Timestamp;
  };

  public type RegisterStep1Request = BasicInfo;
  public type RegisterStep2Request = HealthProfile;
  public type RegisterStep3Request = LifestyleHabits;

  public type LoginRequest = {
    email : Text;
    password : Text;
  };

  public type AuthResult = {
    #ok : UserProfile;
    #err : Text;
  };
};
