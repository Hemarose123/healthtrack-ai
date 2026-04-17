import { a as useAuth, j as jsxRuntimeExports, C as CardSkeleton, r as reactExports, M as MedicalCondition, D as DietType, A as ActivityLevel } from "./index-B1i-rzHQ.js";
import { u as ue } from "./index-B3ubObd7.js";
import { c as useMyProfile, w as useUpdateHealthProfile, x as useUpdateLifestyle } from "./useBackend-D3WuyYMJ.js";
function UserAvatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map((n) => {
    var _a;
    return ((_a = n[0]) == null ? void 0 : _a.toUpperCase()) ?? "";
  }).join("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold font-display shadow-md flex-shrink-0", children: initials || "?" });
}
function BMIDisplay({ weight, height }) {
  if (!weight || !height) return null;
  const bmi = weight / (height / 100) ** 2;
  const config = bmi < 18.5 ? { label: "Underweight", cls: "badge-blue", emoji: "🔵" } : bmi < 25 ? { label: "Normal weight", cls: "badge-green", emoji: "🟢" } : bmi < 30 ? { label: "Overweight", cls: "badge-yellow", emoji: "🟡" } : { label: "Obese", cls: "badge-red", emoji: "🔴" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "profile.bmi_card",
      className: "bg-muted/40 rounded-lg border border-border/60 px-4 py-3 flex items-center justify-between",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Your BMI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: bmi.toFixed(1) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${config.cls} text-sm`, children: [
          config.emoji,
          " ",
          config.label
        ] })
      ]
    }
  );
}
const inputClass = "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";
const selectClass = "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50";
function Field({
  label,
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
    children
  ] });
}
const CONDITIONS = [
  { value: MedicalCondition.diabetes, label: "🩸 Diabetes" },
  { value: MedicalCondition.pcod, label: "🌸 PCOD" },
  { value: MedicalCondition.thyroid, label: "🦋 Thyroid" },
  { value: MedicalCondition.obesity, label: "⚖️ Obesity" },
  { value: MedicalCondition.none, label: "✅ None" }
];
function HealthProfileSection({
  health,
  onSave,
  isSaving
}) {
  const [form, setForm] = reactExports.useState({
    age: "",
    weightKg: "",
    heightCm: "",
    calorieGoal: "2000",
    activityLevel: ActivityLevel.moderate,
    dietType: DietType.vegetarian,
    medicalConditions: [MedicalCondition.none]
  });
  reactExports.useEffect(() => {
    if (health) {
      setForm({
        age: String(Number(health.age)),
        weightKg: String(health.weightKg),
        heightCm: String(health.heightCm),
        calorieGoal: String(Number(health.dailyCalorieGoal)),
        activityLevel: health.activityLevel,
        dietType: health.dietType,
        medicalConditions: health.medicalConditions
      });
    }
  }, [health]);
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
  const handleSave = () => {
    onSave({
      age: BigInt(Number(form.age)),
      weightKg: Number(form.weightKg),
      heightCm: Number(form.heightCm),
      dailyCalorieGoal: BigInt(Number(form.calorieGoal)),
      activityLevel: form.activityLevel,
      dietType: form.dietType,
      medicalConditions: form.medicalConditions
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md border border-border p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground flex items-center gap-2", children: "🏥 Health Profile" }),
    form.weightKg && form.heightCm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BMIDisplay,
      {
        weight: Number(form.weightKg),
        height: Number(form.heightCm)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎂 Age", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "profile.age_input",
          type: "number",
          min: "1",
          max: "120",
          value: form.age,
          onChange: (e) => setForm((f) => ({ ...f, age: e.target.value })),
          placeholder: "25",
          className: inputClass,
          disabled: isSaving
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "⚖️ Weight (kg)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "profile.weight_input",
          type: "number",
          step: "0.1",
          min: "10",
          value: form.weightKg,
          onChange: (e) => setForm((f) => ({ ...f, weightKg: e.target.value })),
          placeholder: "65",
          className: inputClass,
          disabled: isSaving
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "📏 Height (cm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "profile.height_input",
          type: "number",
          step: "0.1",
          min: "50",
          value: form.heightCm,
          onChange: (e) => setForm((f) => ({ ...f, heightCm: e.target.value })),
          placeholder: "170",
          className: inputClass,
          disabled: isSaving
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎯 Calorie goal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "profile.calorie_goal_input",
          type: "number",
          step: "50",
          min: "500",
          value: form.calorieGoal,
          onChange: (e) => setForm((f) => ({ ...f, calorieGoal: e.target.value })),
          placeholder: "2000",
          className: inputClass,
          disabled: isSaving
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🏃 Activity level", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "profile.activity_select",
          value: form.activityLevel,
          onChange: (e) => setForm((f) => ({
            ...f,
            activityLevel: e.target.value
          })),
          className: selectClass,
          disabled: isSaving,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.sedentary, children: "🪑 Sedentary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.light, children: "🚶 Light" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.moderate, children: "🏋️ Moderate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.active, children: "🏃 Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ActivityLevel.veryActive, children: "⚡ Very Active" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🥗 Diet type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "profile.diet_select",
          value: form.dietType,
          onChange: (e) => setForm((f) => ({ ...f, dietType: e.target.value })),
          className: selectClass,
          disabled: isSaving,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.vegetarian, children: "🌿 Vegetarian" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.vegan, children: "🌱 Vegan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.eggetarian, children: "🥚 Eggetarian" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DietType.nonVegetarian, children: "🍗 Non-Vegetarian" })
          ]
        }
      ) })
    ] }),
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
            "data-ocid": `profile.condition.${value}`,
            onClick: () => toggleCondition(value),
            disabled: isSaving,
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "profile.save_health_button",
        onClick: handleSave,
        disabled: isSaving,
        className: "btn-primary h-10 px-6",
        children: isSaving ? "💾 Saving…" : "💾 Save health profile"
      }
    )
  ] });
}
function LifestyleSection({
  lifestyle,
  onSave,
  isSaving
}) {
  const [form, setForm] = reactExports.useState({
    fitnessGoals: "",
    sleepHours: "7",
    stressLevel: 2,
    smokingStatus: false,
    alcoholConsumption: false
  });
  reactExports.useEffect(() => {
    if (lifestyle) {
      setForm({
        fitnessGoals: lifestyle.fitnessGoals,
        sleepHours: String(lifestyle.sleepHoursPerNight),
        stressLevel: Number(lifestyle.stressLevel),
        smokingStatus: lifestyle.smokingStatus,
        alcoholConsumption: lifestyle.alcoholConsumption
      });
    }
  }, [lifestyle]);
  const stressLabels = [
    "😌 Very low",
    "🙂 Low",
    "😐 Moderate",
    "😟 High",
    "😰 Very high"
  ];
  const handleSave = () => {
    onSave({
      fitnessGoals: form.fitnessGoals,
      sleepHoursPerNight: Number(form.sleepHours),
      stressLevel: BigInt(form.stressLevel),
      smokingStatus: form.smokingStatus,
      alcoholConsumption: form.alcoholConsumption
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md border border-border p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground flex items-center gap-2", children: "🌿 Lifestyle Habits" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "🎯 Fitness goals", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        "data-ocid": "profile.fitness_goals_input",
        value: form.fitnessGoals,
        onChange: (e) => setForm((f) => ({ ...f, fitnessGoals: e.target.value })),
        placeholder: "Describe your fitness goals…",
        rows: 3,
        disabled: isSaving,
        className: "w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth resize-none disabled:opacity-50"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "😴 Sleep hours per night", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "data-ocid": "profile.sleep_hours_input",
        type: "number",
        min: "1",
        max: "24",
        step: "0.5",
        value: form.sleepHours,
        onChange: (e) => setForm((f) => ({ ...f, sleepHours: e.target.value })),
        disabled: isSaving,
        className: inputClass
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "profile-stress-level",
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
          id: "profile-stress-level",
          "data-ocid": "profile.stress_level_input",
          type: "range",
          min: "1",
          max: "5",
          step: "1",
          value: form.stressLevel,
          onChange: (e) => setForm((f) => ({ ...f, stressLevel: Number(e.target.value) })),
          disabled: isSaving,
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
                "data-ocid": `profile.${key}_toggle`,
                role: "switch",
                "aria-checked": form[key],
                onClick: () => setForm((f) => ({ ...f, [key]: !f[key] })),
                disabled: isSaving,
                className: `relative w-10 h-5 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0 ${form[key] ? "bg-primary" : "bg-muted-foreground/30"}`,
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "profile.save_lifestyle_button",
        onClick: handleSave,
        disabled: isSaving,
        className: "btn-primary h-10 px-6",
        children: isSaving ? "💾 Saving…" : "💾 Save lifestyle"
      }
    )
  ] });
}
function ProfilePage() {
  const { userProfile, refreshProfile } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const updateHealth = useUpdateHealthProfile();
  const updateLifestyle = useUpdateLifestyle();
  const displayProfile = profile ?? userProfile;
  const handleSaveHealth = async (h) => {
    try {
      await updateHealth.mutateAsync({
        age: h.age,
        weightKg: h.weightKg,
        heightCm: h.heightCm,
        medicalConditions: h.medicalConditions,
        dailyCalorieGoal: h.dailyCalorieGoal,
        activityLevel: h.activityLevel,
        dietType: h.dietType
      });
      await refreshProfile();
      ue.success("✅ Health profile saved!", { duration: 3e3 });
    } catch {
      ue.error("Failed to save health profile. Please try again.");
    }
  };
  const handleSaveLifestyle = async (l) => {
    try {
      await updateLifestyle.mutateAsync({
        fitnessGoals: l.fitnessGoals,
        sleepHoursPerNight: l.sleepHoursPerNight,
        stressLevel: l.stressLevel,
        smokingStatus: l.smokingStatus,
        alcoholConsumption: l.alcoholConsumption
      });
      await refreshProfile();
      ue.success("✅ Lifestyle habits saved!", { duration: 3e3 });
    } catch {
      ue.error("Failed to save lifestyle. Please try again.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
    ] });
  }
  const fullName = (displayProfile == null ? void 0 : displayProfile.basicInfo.fullName) ?? "User";
  const email = (displayProfile == null ? void 0 : displayProfile.basicInfo.email) ?? "";
  const username = (displayProfile == null ? void 0 : displayProfile.basicInfo.username) ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "profile.page", className: "page-container space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md border border-border p-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { name: fullName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground truncate", children: fullName }),
        username && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
          "@",
          username
        ] }),
        email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: email })
        ] }),
        (displayProfile == null ? void 0 : displayProfile.registrationStep) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-green", children: [
          "✅ Step ",
          String(displayProfile.registrationStep),
          " completed"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm text-accent-foreground flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base flex-shrink-0", children: "ℹ️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This is AI-assisted analysis only — not a certified medical diagnosis. Please consult a qualified doctor." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HealthProfileSection,
      {
        health: displayProfile == null ? void 0 : displayProfile.healthProfile,
        onSave: handleSaveHealth,
        isSaving: updateHealth.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LifestyleSection,
      {
        lifestyle: displayProfile == null ? void 0 : displayProfile.lifestyle,
        onSave: handleSaveLifestyle,
        isSaving: updateLifestyle.isPending
      }
    )
  ] });
}
export {
  ProfilePage as default
};
