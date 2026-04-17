import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import {
  useRegisterStep1,
  useRegisterStep2,
  useRegisterStep3,
} from "../hooks/useBackend";
import { ActivityLevel, DietType, MedicalCondition } from "../types";

// ─── Step progress indicator ─────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2 mb-6"
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-smooth",
                done ? "bg-accent text-accent-foreground" : "",
                active ? "bg-primary text-primary-foreground shadow-md" : "",
                !done && !active ? "bg-muted text-muted-foreground" : "",
              ].join(" ")}
            >
              {done ? "✓" : step}
            </div>
            {i < total - 1 && (
              <div
                className={`w-8 h-0.5 rounded-full transition-smooth ${done ? "bg-accent" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground font-medium">
        Step {current} of {total}
      </span>
    </div>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-foreground mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-destructive font-medium flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";
const selectClass =
  "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";

// ─── Step 1 ──────────────────────────────────────────────────────────────────
interface Step1Data {
  fullName: string;
  email: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
}
const emptyStep1: Step1Data = {
  fullName: "",
  email: "",
  username: "",
  dateOfBirth: "",
  gender: "male",
  password: "",
  confirmPassword: "",
};

function Step1Form({
  onNext,
  defaultValues,
}: { onNext: (d: Step1Data) => void; defaultValues: Step1Data }) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState<Partial<Step1Data>>({});

  const set =
    (k: keyof Step1Data) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Partial<Step1Data> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required.";
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onNext(form);
  };

  return (
    <div className="space-y-4">
      <Field label="👤 Full name" error={errors.fullName}>
        <input
          data-ocid="register.fullname_input"
          type="text"
          value={form.fullName}
          onChange={set("fullName")}
          placeholder="Arjun Sharma"
          className={inputClass}
        />
      </Field>
      <Field label="🔖 Username" error={errors.username}>
        <input
          data-ocid="register.username_input"
          type="text"
          value={form.username}
          onChange={set("username")}
          placeholder="arjun123"
          className={inputClass}
        />
      </Field>
      <Field label="📧 Email address" error={errors.email}>
        <input
          data-ocid="register.email_input"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="arjun@example.com"
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="🎂 Date of birth" error={errors.dateOfBirth}>
          <input
            data-ocid="register.dob_input"
            type="date"
            value={form.dateOfBirth}
            onChange={set("dateOfBirth")}
            className={inputClass}
          />
        </Field>
        <Field label="⚥ Gender">
          <select
            data-ocid="register.gender_select"
            value={form.gender}
            onChange={set("gender")}
            className={selectClass}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>
      <Field label="🔒 Password" error={errors.password}>
        <input
          data-ocid="register.password_input"
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="Min 8 characters"
          className={inputClass}
        />
      </Field>
      <Field label="🔒 Confirm password" error={errors.confirmPassword}>
        <input
          data-ocid="register.confirm_password_input"
          type="password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          placeholder="Repeat password"
          className={inputClass}
        />
      </Field>
      <button
        type="button"
        data-ocid="register.next_button.1"
        onClick={handleNext}
        className="btn-primary w-full h-10 mt-2"
      >
        Next: Health Info →
      </button>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────
interface Step2Data {
  age: string;
  weightKg: string;
  heightCm: string;
  medicalConditions: MedicalCondition[];
  calorieGoal: string;
  activityLevel: ActivityLevel;
  dietType: DietType;
}
const emptyStep2: Step2Data = {
  age: "",
  weightKg: "",
  heightCm: "",
  medicalConditions: [MedicalCondition.none],
  calorieGoal: "2000",
  activityLevel: ActivityLevel.moderate,
  dietType: DietType.vegetarian,
};

const CONDITIONS = [
  { value: MedicalCondition.diabetes, label: "🩸 Diabetes" },
  { value: MedicalCondition.pcod, label: "🌸 PCOD" },
  { value: MedicalCondition.thyroid, label: "🦋 Thyroid" },
  { value: MedicalCondition.obesity, label: "⚖️ Obesity" },
  { value: MedicalCondition.none, label: "✅ None" },
];

function Step2Form({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (d: Step2Data) => void;
  onBack: () => void;
  defaultValues: Step2Data;
}) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step2Data, string>>
  >({});

  const setField =
    (k: keyof Step2Data) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleCondition = (cond: MedicalCondition) => {
    setForm((f) => {
      if (cond === MedicalCondition.none)
        return { ...f, medicalConditions: [MedicalCondition.none] };
      const without = f.medicalConditions.filter(
        (c) => c !== MedicalCondition.none && c !== cond,
      );
      const hasIt = f.medicalConditions.includes(cond);
      const next = hasIt ? without : [...without, cond];
      return {
        ...f,
        medicalConditions: next.length === 0 ? [MedicalCondition.none] : next,
      };
    });
  };

  const validate = () => {
    const e: Partial<Record<keyof Step2Data, string>> = {};
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120)
      e.age = "Valid age (1–120) required.";
    if (!form.weightKg || Number(form.weightKg) < 10)
      e.weightKg = "Valid weight required.";
    if (!form.heightCm || Number(form.heightCm) < 50)
      e.heightCm = "Valid height required.";
    if (!form.calorieGoal || Number(form.calorieGoal) < 500)
      e.calorieGoal = "Calorie goal must be at least 500.";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onNext(form);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="🎂 Age" error={errors.age}>
          <input
            data-ocid="register.age_input"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={setField("age")}
            placeholder="25"
            className={inputClass}
          />
        </Field>
        <Field label="⚖️ Weight (kg)" error={errors.weightKg}>
          <input
            data-ocid="register.weight_input"
            type="number"
            min="10"
            step="0.1"
            value={form.weightKg}
            onChange={setField("weightKg")}
            placeholder="65"
            className={inputClass}
          />
        </Field>
        <Field label="📏 Height (cm)" error={errors.heightCm}>
          <input
            data-ocid="register.height_input"
            type="number"
            min="50"
            step="0.1"
            value={form.heightCm}
            onChange={setField("heightCm")}
            placeholder="170"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="🏃 Activity level">
        <select
          data-ocid="register.activity_select"
          value={form.activityLevel}
          onChange={setField("activityLevel")}
          className={selectClass}
        >
          <option value={ActivityLevel.sedentary}>
            🪑 Sedentary (desk job)
          </option>
          <option value={ActivityLevel.light}>🚶 Light (1–3 days/week)</option>
          <option value={ActivityLevel.moderate}>
            🏋️ Moderate (3–5 days/week)
          </option>
          <option value={ActivityLevel.active}>
            🏃 Active (6–7 days/week)
          </option>
          <option value={ActivityLevel.veryActive}>
            ⚡ Very Active (intense daily)
          </option>
        </select>
      </Field>

      <Field label="🥗 Diet type">
        <select
          data-ocid="register.diet_select"
          value={form.dietType}
          onChange={setField("dietType")}
          className={selectClass}
        >
          <option value={DietType.vegetarian}>🌿 Vegetarian</option>
          <option value={DietType.vegan}>🌱 Vegan</option>
          <option value={DietType.eggetarian}>🥚 Eggetarian</option>
          <option value={DietType.nonVegetarian}>🍗 Non-Vegetarian</option>
        </select>
      </Field>

      <div>
        <p
          className="block text-sm font-semibold text-foreground mb-2"
          aria-label="Medical conditions"
        >
          🏥 Medical conditions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CONDITIONS.map(({ value, label }) => {
            const checked = form.medicalConditions.includes(value);
            return (
              <button
                key={value}
                type="button"
                data-ocid={`register.condition.${value}`}
                onClick={() => toggleCondition(value)}
                className={[
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth text-left",
                  checked
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border text-foreground hover:border-primary/50",
                ].join(" ")}
              >
                <span
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs ${checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                >
                  {checked && "✓"}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="🎯 Daily calorie goal (kcal)" error={errors.calorieGoal}>
        <input
          data-ocid="register.calorie_goal_input"
          type="number"
          min="500"
          step="50"
          value={form.calorieGoal}
          onChange={setField("calorieGoal")}
          placeholder="2000"
          className={inputClass}
        />
      </Field>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          data-ocid="register.back_button.1"
          onClick={onBack}
          className="btn-secondary flex-1 h-10"
        >
          ← Back
        </button>
        <button
          type="button"
          data-ocid="register.next_button.2"
          onClick={handleNext}
          className="btn-primary flex-1 h-10"
        >
          Next: Lifestyle →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────
interface Step3Data {
  fitnessGoals: string;
  sleepHours: string;
  stressLevel: number;
  smokingStatus: boolean;
  alcoholConsumption: boolean;
}
const emptyStep3: Step3Data = {
  fitnessGoals: "",
  sleepHours: "7",
  stressLevel: 2,
  smokingStatus: false,
  alcoholConsumption: false,
};

function Step3Form({
  onSubmit,
  onBack,
  defaultValues,
  isLoading,
}: {
  onSubmit: (d: Step3Data) => void;
  onBack: () => void;
  defaultValues: Step3Data;
  isLoading: boolean;
}) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step3Data, string>>
  >({});

  const validate = () => {
    const e: Partial<Record<keyof Step3Data, string>> = {};
    if (!form.fitnessGoals.trim())
      e.fitnessGoals = "Please describe your fitness goals.";
    if (
      !form.sleepHours ||
      Number(form.sleepHours) < 1 ||
      Number(form.sleepHours) > 24
    )
      e.sleepHours = "Enter valid sleep hours (1–24).";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onSubmit(form);
  };

  const stressLabels = [
    "😌 Very low",
    "🙂 Low",
    "😐 Moderate",
    "😟 High",
    "😰 Very high",
  ];

  return (
    <div className="space-y-4">
      <Field label="🎯 Fitness goals" error={errors.fitnessGoals}>
        <textarea
          data-ocid="register.fitness_goals_input"
          value={form.fitnessGoals}
          onChange={(e) =>
            setForm((f) => ({ ...f, fitnessGoals: e.target.value }))
          }
          placeholder="e.g. Lose 5 kg in 3 months, improve stamina, manage blood sugar…"
          rows={3}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth resize-none disabled:opacity-50"
        />
      </Field>

      <Field label="😴 Sleep hours per night" error={errors.sleepHours}>
        <input
          data-ocid="register.sleep_hours_input"
          type="number"
          min="1"
          max="24"
          step="0.5"
          value={form.sleepHours}
          onChange={(e) =>
            setForm((f) => ({ ...f, sleepHours: e.target.value }))
          }
          placeholder="7"
          disabled={isLoading}
          className={inputClass}
        />
      </Field>

      <div>
        <label
          htmlFor="register-stress-level"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          🧠 Stress level:{" "}
          <span className="text-primary">
            {stressLabels[form.stressLevel - 1]}
          </span>
        </label>
        <input
          id="register-stress-level"
          data-ocid="register.stress_level_input"
          type="range"
          min="1"
          max="5"
          step="1"
          value={form.stressLevel}
          onChange={(e) =>
            setForm((f) => ({ ...f, stressLevel: Number(e.target.value) }))
          }
          disabled={isLoading}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 – Very low</span>
          <span>5 – Very high</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(["smokingStatus", "alcoholConsumption"] as const).map((key) => {
          const labelMap = {
            smokingStatus: "🚬 Smoker?",
            alcoholConsumption: "🍺 Drinks alcohol?",
          };
          return (
            <div
              key={key}
              className="flex items-center gap-3 bg-muted/40 rounded-lg px-3 py-3 border border-border/60"
            >
              <button
                type="button"
                data-ocid={`register.${key}_toggle`}
                role="switch"
                aria-checked={form[key]}
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                disabled={isLoading}
                className={[
                  "relative w-10 h-5 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0",
                  form[key] ? "bg-primary" : "bg-muted-foreground/30",
                ].join(" ")}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card transition-smooth ${form[key] ? "translate-x-5" : ""}`}
                />
              </button>
              <span className="text-sm font-medium text-foreground">
                {labelMap[key]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          data-ocid="register.back_button.2"
          onClick={onBack}
          disabled={isLoading}
          className="btn-secondary flex-1 h-10"
        >
          ← Back
        </button>
        <button
          type="button"
          data-ocid="register.submit_button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-primary flex-1 h-10 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating…</span>
            </>
          ) : (
            "🎉 Create Account"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const step1Mutation = useRegisterStep1();
  const step2Mutation = useRegisterStep2();
  const step3Mutation = useRegisterStep3();

  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [step1Data, setStep1Data] = useState<Step1Data>(emptyStep1);
  const [step2Data, setStep2Data] = useState<Step2Data>(emptyStep2);

  const STEP_TITLES = [
    { emoji: "👤", title: "Basic Information" },
    { emoji: "🏥", title: "Health Profile" },
    { emoji: "🌿", title: "Lifestyle Habits" },
  ];

  const handleStep1Next = async (data: Step1Data) => {
    setApiError("");
    setStep1Data(data);
    try {
      const result = await step1Mutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        passwordHash: data.password,
      });
      if (result.__kind__ === "err") {
        setApiError(result.err);
        return;
      }
      setStep(2);
    } catch {
      setApiError("Registration failed. Please try again.");
    }
  };

  const handleStep2Next = async (data: Step2Data) => {
    setApiError("");
    setStep2Data(data);
    try {
      const result = await step2Mutation.mutateAsync({
        age: BigInt(Number(data.age)),
        weightKg: Number(data.weightKg),
        heightCm: Number(data.heightCm),
        medicalConditions: data.medicalConditions,
        dailyCalorieGoal: BigInt(Number(data.calorieGoal)),
        activityLevel: data.activityLevel,
        dietType: data.dietType,
      });
      if (result.__kind__ === "err") {
        setApiError(result.err);
        return;
      }
      setStep(3);
    } catch {
      setApiError("Could not save health profile. Please try again.");
    }
  };

  const handleStep3Submit = async (data: Step3Data) => {
    setApiError("");
    try {
      const result = await step3Mutation.mutateAsync({
        fitnessGoals: data.fitnessGoals,
        sleepHoursPerNight: Number(data.sleepHours),
        stressLevel: BigInt(data.stressLevel),
        smokingStatus: data.smokingStatus,
        alcoholConsumption: data.alcoholConsumption,
      });
      if (result.__kind__ === "err") {
        setApiError(result.err);
        return;
      }
      await login(step1Data.email, step1Data.password);
      navigate({ to: "/dashboard" });
    } catch {
      setApiError("Could not complete registration. Please try again.");
    }
  };

  const isSubmitting =
    step1Mutation.isPending ||
    step2Mutation.isPending ||
    step3Mutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary px-6 py-6 text-center flex flex-col items-center gap-1">
        <span
          className="text-4xl leading-none"
          role="img"
          aria-label="hospital"
        >
          🏥
        </span>
        <h1 className="font-display font-bold text-xl text-primary-foreground mt-1">
          OceanWell
        </h1>
        <p className="text-primary-foreground/80 text-xs">
          Create your health profile
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-12">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <StepIndicator current={step} total={3} />

            <div className="mb-5">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <span>{STEP_TITLES[step - 1].emoji}</span>
                {STEP_TITLES[step - 1].title}
              </h2>
            </div>

            {apiError && (
              <div
                data-ocid="register.error_state"
                className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm font-medium flex items-center gap-2"
                role="alert"
              >
                <span>⚠️</span>
                {apiError}
              </div>
            )}

            {step === 1 && (
              <Step1Form onNext={handleStep1Next} defaultValues={step1Data} />
            )}
            {step === 2 && (
              <Step2Form
                onNext={handleStep2Next}
                onBack={() => setStep(1)}
                defaultValues={step2Data}
              />
            )}
            {step === 3 && (
              <Step3Form
                onSubmit={handleStep3Submit}
                onBack={() => setStep(2)}
                defaultValues={emptyStep3}
                isLoading={isSubmitting}
              />
            )}
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              data-ocid="register.login_link"
              className="text-primary font-semibold hover:underline transition-smooth"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
