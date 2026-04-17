import Types "../types/auth";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (
  users : List.List<Types.User>,
  nextUserId : { var value : Nat },
) {

  // ── Step 1: register basic info — creates user record keyed by caller principal ──
  public shared ({ caller }) func registerStep1(req : Types.RegisterStep1Request) : async Types.AuthResult {
    // Prevent anonymous callers
    if (caller.isAnonymous()) {
      return #err("Anonymous callers cannot register");
    };
    // Validate email format
    if (not AuthLib.isValidEmail(req.email)) {
      return #err("Invalid email format");
    };
    // Prevent duplicate registration by caller principal
    switch (AuthLib.findById(users, caller)) {
      case (?_existing) {
        return #err("User already registered. Use update functions to modify profile.");
      };
      case null {};
    };
    // Prevent duplicate email
    switch (AuthLib.findByEmail(users, req.email)) {
      case (?_existing) { return #err("Email already in use") };
      case null {};
    };
    // Hash the password
    let hashedReq : Types.BasicInfo = {
      req with passwordHash = AuthLib.hashPassword(req.passwordHash)
    };
    let now = Time.now();
    let user : Types.User = {
      id = caller;
      var basicInfo = hashedReq;
      var healthProfile = null;
      var lifestyle = null;
      var registrationStep = 1;
      createdAt = now;
      var lastLogin = now;
    };
    users.add(user);
    #ok(user.toProfile());
  };

  // ── Step 2: save health profile ────────────────────────────────────────────────
  public shared ({ caller }) func registerStep2(req : Types.RegisterStep2Request) : async Types.AuthResult {
    if (caller.isAnonymous()) return #err("Not authenticated");
    // Validate ranges
    if (req.age < 13 or req.age > 120) return #err("Age must be between 13 and 120");
    if (req.weightKg < 20.0 or req.weightKg > 500.0) return #err("Weight must be between 20 and 500 kg");
    if (req.heightCm < 50.0 or req.heightCm > 300.0) return #err("Height must be between 50 and 300 cm");
    if (req.dailyCalorieGoal < 500 or req.dailyCalorieGoal > 10000) return #err("Calorie goal must be between 500 and 10000");

    switch (AuthLib.findById(users, caller)) {
      case null { #err("User not found. Complete step 1 first.") };
      case (?user) {
        user.healthProfile := ?req;
        if (user.registrationStep < 2) user.registrationStep := 2;
        #ok(user.toProfile());
      };
    };
  };

  // ── Step 3: save lifestyle habits ─────────────────────────────────────────────
  public shared ({ caller }) func registerStep3(req : Types.RegisterStep3Request) : async Types.AuthResult {
    if (caller.isAnonymous()) return #err("Not authenticated");
    if (req.stressLevel < 1 or req.stressLevel > 10) return #err("Stress level must be between 1 and 10");

    switch (AuthLib.findById(users, caller)) {
      case null { #err("User not found. Complete step 1 first.") };
      case (?user) {
        user.lifestyle := ?req;
        user.registrationStep := 3;
        #ok(user.toProfile());
      };
    };
  };

  // ── Login: verify password by email, return profile ───────────────────────────
  public shared func login(req : Types.LoginRequest) : async Types.AuthResult {
    if (not AuthLib.isValidEmail(req.email)) return #err("Invalid email format");

    switch (AuthLib.findByEmail(users, req.email)) {
      case null { #err("Invalid email or password") };
      case (?user) {
        if (not AuthLib.verifyPassword(req.password, user.basicInfo.passwordHash)) {
          return #err("Invalid email or password");
        };
        user.lastLogin := Time.now();
        #ok(user.toProfile());
      };
    };
  };

  // ── Get own profile ────────────────────────────────────────────────────────────
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    switch (AuthLib.findById(users, caller)) {
      case null null;
      case (?user) ?user.toProfile();
    };
  };

  // ── Update health profile ──────────────────────────────────────────────────────
  public shared ({ caller }) func updateHealthProfile(req : Types.RegisterStep2Request) : async Types.AuthResult {
    if (caller.isAnonymous()) return #err("Not authenticated");
    if (req.age < 13 or req.age > 120) return #err("Age must be between 13 and 120");
    if (req.weightKg < 20.0 or req.weightKg > 500.0) return #err("Weight must be between 20 and 500 kg");
    if (req.heightCm < 50.0 or req.heightCm > 300.0) return #err("Height must be between 50 and 300 cm");
    if (req.dailyCalorieGoal < 500 or req.dailyCalorieGoal > 10000) return #err("Calorie goal must be between 500 and 10000");

    switch (AuthLib.findById(users, caller)) {
      case null { #err("User not found") };
      case (?user) {
        user.healthProfile := ?req;
        #ok(user.toProfile());
      };
    };
  };

  // ── Update lifestyle habits ────────────────────────────────────────────────────
  public shared ({ caller }) func updateLifestyle(req : Types.RegisterStep3Request) : async Types.AuthResult {
    if (caller.isAnonymous()) return #err("Not authenticated");
    if (req.stressLevel < 1 or req.stressLevel > 10) return #err("Stress level must be between 1 and 10");

    switch (AuthLib.findById(users, caller)) {
      case null { #err("User not found") };
      case (?user) {
        user.lifestyle := ?req;
        #ok(user.toProfile());
      };
    };
  };

  // ── Update calorie goal ────────────────────────────────────────────────────────
  public shared ({ caller }) func setCalorieGoal(goal : Nat) : async Types.AuthResult {
    if (caller.isAnonymous()) return #err("Not authenticated");
    if (goal < 500 or goal > 10000) return #err("Calorie goal must be between 500 and 10000");

    switch (AuthLib.findById(users, caller)) {
      case null { #err("User not found") };
      case (?user) {
        switch (user.healthProfile) {
          case null {
            // Create a minimal health profile with just the calorie goal
            return #err("Complete health profile (step 2) before setting calorie goal");
          };
          case (?hp) {
            user.healthProfile := ?{ hp with dailyCalorieGoal = goal };
            #ok(user.toProfile());
          };
        };
      };
    };
  };
};
