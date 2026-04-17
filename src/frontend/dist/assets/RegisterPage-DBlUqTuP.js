import { u as useNavigate, a as useAuth, r as reactExports, D as DietType, A as ActivityLevel, M as MedicalCondition, j as jsxRuntimeExports, b as Link, L as LoadingSpinner } from "./index-B1i-rzHQ.js";
import { u as useRegisterStep1, a as useRegisterStep2, b as useRegisterStep3 } from "./useBackend-D3WuyYMJ.js";
function StepIndicator({ current, total }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-center gap-2 mb-6",
      "aria-label": `Step ${current} of ${total}`,
      children: [
        Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: [
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-smooth",
                  done ? "bg-accent text-accent-foreground" : "",
                  active ? "bg-primary text-primary-foreground shadow-md" : "",
                  !done && !active ? "bg-muted text-muted-foreground" : ""
                ].join(" "),
                children: done ? "✓" : step
              }
            ),
            i < total - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-8 h-0.5 rounded-full transition-smooth ${done ? "bg-accent" : "bg-border"}`
              }
            )
          ] }, step);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground font-medium", children: [
          "Step ",
          current,
          " of ",
          total
        ] })
      ]
    }
  );
}
function Field({
  label,
  error,
  htmlFor,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor,
        className: "block text-sm font-semibold text-foreground mb-1.5",
        children: label
      }
    ),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-destructive font-medium flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️" }),
      error
    ] })
  ] });
}
const inputClass = "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";
const selectClass = "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";
const emptyStep1 = {
  fullName: "",
  email: "",
  username: "",
  dateOfBirth: "",
  gender: "male",
  password: "",
  confirmPassword: ""
};
function Step1Form({
  onNext,
  defaultValues
}) {
  const [form, setForm] = reactExports.useState(defaultValues);
  const [errors, setErrors] = reactExports.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const e = {};
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "👤 Full name", error: errors.fullName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.fullname_input",
        type: "text",
        value: form.fullName,
        onChange: set("fullName"),
        placeholder: "Arjun Sharma",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🔖 Username", error: errors.username, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.username_input",
        type: "text",
        value: form.username,
        onChange: set("username"),
        placeholder: "arjun123",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "📧 Email address", error: errors.email, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.email_input",
        type: "email",
        value: form.email,
        onChange: set("email"),
        placeholder: "arjun@example.com",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎂 Date of birth", error: errors.dateOfBirth, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "register.dob_input",
          type: "date",
          value: form.dateOfBirth,
          onChange: set("dateOfBirth"),
          className: inputClass
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "⚥ Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "register.gender_select",
          value: form.gender,
          onChange: set("gender"),
          className: selectClass,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "male", children: "Male" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "female", children: "Female" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🔒 Password", error: errors.password, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.password_input",
        type: "password",
        value: form.password,
        onChange: set("password"),
        placeholder: "Min 8 characters",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🔒 Confirm password", error: errors.confirmPassword, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.confirm_password_input",
        type: "password",
        value: form.confirmPassword,
        onChange: set("confirmPassword"),
        placeholder: "Repeat password",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "register.next_button.1",
        onClick: handleNext,
        className: "btn-primary w-full h-10 mt-2",
        children: "Next: Health Info →"
      }
    )
  ] });
}
const emptyStep2 = {
  age: "",
  weightKg: "",
  heightCm: "",
  medicalConditions: [MedicalCondition.none],
  calorieGoal: "2000",
  activityLevel: ActivityLevel.moderate,
  dietType: DietType.vegetarian
};
const CONDITIONS = [
  { value: MedicalCondition.diabetes, label: "🩸 Diabetes" },
  { value: MedicalCondition.pcod, label: "🌸 PCOD" },
  { value: MedicalCondition.thyroid, label: "🦋 Thyroid" },
  { value: MedicalCondition.obesity, label: "⚖️ Obesity" },
  { value: MedicalCondition.none, label: "✅ None" }
];
function Step2Form({
  onNext,
  onBack,
  defaultValues
}) {
  const [form, setForm] = reactExports.useState(defaultValues);
  const [errors, setErrors] = reactExports.useState({});
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleCondition = (cond) => {
    setForm((f) => {
      if (cond === MedicalCondition.none)
        return { ...f, medicalConditions: [MedicalCondition.none] };
      const without = f.medicalConditions.filter(
        (c) => c !== MedicalCondition.none && c !== cond
      );
      const hasIt = f.medicalConditions.includes(cond);
      const next = hasIt ? without : [...without, cond];
      return {
        ...f,
        medicalConditions: next.length === 0 ? [MedicalCondition.none] : next
      };
    });
  };
  const validate = () => {
    const e = {};
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎂 Age", error: errors.age, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "register.age_input",
          type: "number",
          min: "1",
          max: "120",
          value: form.age,
          onChange: setField("age"),
          placeholder: "25",
          className: inputClass
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "⚖️ Weight (kg)", error: errors.weightKg, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "register.weight_input",
          type: "number",
          min: "10",
          step: "0.1",
          value: form.weightKg,
          onChange: setField("weightKg"),
          placeholder: "65",
          className: inputClass
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "📏 Height (cm)", error: errors.heightCm, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "register.height_input",
          type: "number",
          min: "50",
          step: "0.1",
          value: form.heightCm,
          onChange: setField("heightCm"),
          placeholder: "170",
          className: inputClass
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🏃 Activity level", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        "data-ocid": "register.activity_select",
        value: form.activityLevel,
        onChange: setField("activityLevel"),
        className: selectClass,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.sedentary, children: "🪑 Sedentary (desk job)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.light, children: "🚶 Light (1–3 days/week)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.moderate, children: "🏋️ Moderate (3–5 days/week)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.active, children: "🏃 Active (6–7 days/week)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.veryActive, children: "⚡ Very Active (intense daily)" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🥗 Diet type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        "data-ocid": "register.diet_select",
        value: form.dietType,
        onChange: setField("dietType"),
        className: selectClass,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.vegetarian, children: "🌿 Vegetarian" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.vegan, children: "🌱 Vegan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.eggetarian, children: "🥚 Eggetarian" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.nonVegetarian, children: "🍗 Non-Vegetarian" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "block text-sm font-semibold text-foreground mb-2",
          "aria-label": "Medical conditions",
          children: "🏥 Medical conditions"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: CONDITIONS.map(({ value, label }) => {
        const checked = form.medicalConditions.includes(value);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `register.condition.${value}`,
            onClick: () => toggleCondition(value),
            className: [
              "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth text-left",
              checked ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-foreground hover:border-primary/50"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs ${checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`,
                  children: checked && "✓"
                }
              ),
              label
            ]
          },
          value
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎯 Daily calorie goal (kcal)", error: errors.calorieGoal, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.calorie_goal_input",
        type: "number",
        min: "500",
        step: "50",
        value: form.calorieGoal,
        onChange: setField("calorieGoal"),
        placeholder: "2000",
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "register.back_button.1",
          onClick: onBack,
          className: "btn-secondary flex-1 h-10",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "register.next_button.2",
          onClick: handleNext,
          className: "btn-primary flex-1 h-10",
          children: "Next: Lifestyle →"
        }
      )
    ] })
  ] });
}
const emptyStep3 = {
  fitnessGoals: "",
  sleepHours: "7",
  stressLevel: 2,
  smokingStatus: false,
  alcoholConsumption: false
};
function Step3Form({
  onSubmit,
  onBack,
  defaultValues,
  isLoading
}) {
  const [form, setForm] = reactExports.useState(defaultValues);
  const [errors, setErrors] = reactExports.useState({});
  const validate = () => {
    const e = {};
    if (!form.fitnessGoals.trim())
      e.fitnessGoals = "Please describe your fitness goals.";
    if (!form.sleepHours || Number(form.sleepHours) < 1 || Number(form.sleepHours) > 24)
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
    "😰 Very high"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎯 Fitness goals", error: errors.fitnessGoals, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        "data-ocid": "register.fitness_goals_input",
        value: form.fitnessGoals,
        onChange: (e) => setForm((f) => ({ ...f, fitnessGoals: e.target.value })),
        placeholder: "e.g. Lose 5 kg in 3 months, improve stamina, manage blood sugar…",
        rows: 3,
        disabled: isLoading,
        className: "w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth resize-none disabled:opacity-50"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "😴 Sleep hours per night", error: errors.sleepHours, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "register.sleep_hours_input",
        type: "number",
        min: "1",
        max: "24",
        step: "0.5",
        value: form.sleepHours,
        onChange: (e) => setForm((f) => ({ ...f, sleepHours: e.target.value })),
        placeholder: "7",
        disabled: isLoading,
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "register-stress-level",
          className: "block text-sm font-semibold text-foreground mb-2",
          children: [
            "🧠 Stress level:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: stressLabels[form.stressLevel - 1] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "register-stress-level",
          "data-ocid": "register.stress_level_input",
          type: "range",
          min: "1",
          max: "5",
          step: "1",
          value: form.stressLevel,
          onChange: (e) => setForm((f) => ({ ...f, stressLevel: Number(e.target.value) })),
          disabled: isLoading,
          className: "w-full accent-primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1 – Very low" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 – Very high" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["smokingStatus", "alcoholConsumption"].map((key) => {
      const labelMap = {
        smokingStatus: "🚬 Smoker?",
        alcoholConsumption: "🍺 Drinks alcohol?"
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 bg-muted/40 rounded-lg px-3 py-3 border border-border/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `register.${key}_toggle`,
                role: "switch",
                "aria-checked": form[key],
                onClick: () => setForm((f) => ({ ...f, [key]: !f[key] })),
                disabled: isLoading,
                className: [
                  "relative w-10 h-5 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0",
                  form[key] ? "bg-primary" : "bg-muted-foreground/30"
                ].join(" "),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card transition-smooth ${form[key] ? "translate-x-5" : ""}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: labelMap[key] })
          ]
        },
        key
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "register.back_button.2",
          onClick: onBack,
          disabled: isLoading,
          className: "btn-secondary flex-1 h-10",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "register.submit_button",
          onClick: handleSubmit,
          disabled: isLoading,
          className: "btn-primary flex-1 h-10 flex items-center justify-center gap-2",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creating…" })
          ] }) : "🎉 Create Account"
        }
      )
    ] })
  ] });
}
function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const step1Mutation = useRegisterStep1();
  const step2Mutation = useRegisterStep2();
  const step3Mutation = useRegisterStep3();
  const [step, setStep] = reactExports.useState(1);
  const [apiError, setApiError] = reactExports.useState("");
  const [step1Data, setStep1Data] = reactExports.useState(emptyStep1);
  const [step2Data, setStep2Data] = reactExports.useState(emptyStep2);
  const STEP_TITLES = [
    { emoji: "👤", title: "Basic Information" },
    { emoji: "🏥", title: "Health Profile" },
    { emoji: "🌿", title: "Lifestyle Habits" }
  ];
  const handleStep1Next = async (data) => {
    setApiError("");
    setStep1Data(data);
    try {
      const result = await step1Mutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        passwordHash: data.password
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
  const handleStep2Next = async (data) => {
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
        dietType: data.dietType
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
  const handleStep3Submit = async (data) => {
    setApiError("");
    try {
      const result = await step3Mutation.mutateAsync({
        fitnessGoals: data.fitnessGoals,
        sleepHoursPerNight: Number(data.sleepHours),
        stressLevel: BigInt(data.stressLevel),
        smokingStatus: data.smokingStatus,
        alcoholConsumption: data.alcoholConsumption
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
  const isSubmitting = step1Mutation.isPending || step2Mutation.isPending || step3Mutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary px-6 py-6 text-center flex flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-4xl leading-none",
          role: "img",
          "aria-label": "hospital",
          children: "🏥"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-primary-foreground mt-1", children: "OceanWell" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-xs", children: "Create your health profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center px-4 pt-6 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md border border-border p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step, total: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: STEP_TITLES[step - 1].emoji }),
          STEP_TITLES[step - 1].title
        ] }) }),
        apiError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "register.error_state",
            className: "mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm font-medium flex items-center gap-2",
            role: "alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️" }),
              apiError
            ]
          }
        ),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step1Form, { onNext: handleStep1Next, defaultValues: step1Data }),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step2Form,
          {
            onNext: handleStep2Next,
            onBack: () => setStep(1),
            defaultValues: step2Data
          }
        ),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step3Form,
          {
            onSubmit: handleStep3Submit,
            onBack: () => setStep(2),
            defaultValues: emptyStep3,
            isLoading: isSubmitting
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            "data-ocid": "register.login_link",
            className: "text-primary font-semibold hover:underline transition-smooth",
            children: "Sign in"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  RegisterPage as default
};
