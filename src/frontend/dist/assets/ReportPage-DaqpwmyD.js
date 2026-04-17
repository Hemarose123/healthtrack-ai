import { r as reactExports, j as jsxRuntimeExports, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { u as ue } from "./index-B3ubObd7.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { v as useGenerateHealthReport, c as useMyProfile } from "./useBackend-D3WuyYMJ.js";
const ALL_SECTIONS = [
  {
    key: "moodSummary",
    label: "Mood Summary",
    emoji: "😊",
    description: "Average mood score, trend, and weekly summary"
  },
  {
    key: "latestRiskScore",
    label: "Risk Score",
    emoji: "🩺",
    description: "BMI-based health risk with contributing factors"
  },
  {
    key: "recentSymptoms",
    label: "Symptoms Log",
    emoji: "🤒",
    description: "Recent symptom checks with severity and remedies"
  },
  {
    key: "dietRecommendation",
    label: "Diet Recommendations",
    emoji: "🥗",
    description: "Condition-based meal plan and food guidance"
  },
  {
    key: "calorieSummaryText",
    label: "Calorie Summary",
    emoji: "🔥",
    description: "Weekly calorie intake vs daily goal"
  },
  {
    key: "dailyTip",
    label: "Daily Health Tip",
    emoji: "💡",
    description: "AI-curated tip personalized to your profile"
  }
];
function getRiskBadge(level) {
  if (level === "green") return { label: "Low Risk", cls: "badge-green" };
  if (level === "yellow") return { label: "Moderate", cls: "badge-yellow" };
  return { label: "High Risk", cls: "badge-red" };
}
function MoodSection({ report }) {
  const avg = report.moodSummary.averageScore.toFixed(1);
  const emoji = Number(avg) >= 4 ? "😄" : Number(avg) >= 3 ? "😐" : "😕";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
        "Average Score: ",
        avg,
        " / 5"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        report.moodSummary.entries.length,
        " entries · Period:",
        " ",
        report.moodSummary.period
      ] })
    ] })
  ] });
}
function RiskSection({ report }) {
  if (!report.latestRiskScore)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No risk score recorded yet." });
  const rs = report.latestRiskScore;
  const { label, cls } = getRiskBadge(rs.riskLevel);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-3xl text-foreground", children: [
        Number(rs.score),
        "/100"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "BMI: ",
      rs.bmi.toFixed(1)
    ] }),
    rs.factors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: rs.factors.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-blue", children: f }, f)) })
  ] });
}
function SymptomsSection({ report }) {
  if (!report.recentSymptoms.length)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recent symptoms logged." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: report.recentSymptoms.slice(0, 3).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-lg p-3 bg-muted/20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: s.symptomsText }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          "Severity: ",
          Number(s.severity),
          "/5"
        ] }),
        s.remedies[0] && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent mt-0.5", children: [
          "🌿 ",
          s.remedies[0]
        ] })
      ]
    },
    Number(s.id)
  )) });
}
function DietSection({ report }) {
  if (!report.dietRecommendation)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No diet recommendation generated." });
  const d = report.dietRecommendation;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground", children: [
      "Condition: ",
      String(d.condition)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent font-semibold mb-1", children: "✅ Recommended:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.recommendedFoods.slice(0, 5).join(", ") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-semibold mb-1", children: "❌ Avoid:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.avoidFoods.slice(0, 4).join(", ") })
    ] })
  ] });
}
function CalorieSection({ report }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: report.calorieSummaryText || "No calorie data available." });
}
function TipSection({ report }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-primary/5 rounded-lg border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
    "💡 ",
    report.dailyTip
  ] }) });
}
const RENDERERS = {
  moodSummary: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(MoodSection, { report: r }),
  latestRiskScore: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RiskSection, { report: r }),
  recentSymptoms: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SymptomsSection, { report: r }),
  dietRecommendation: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(DietSection, { report: r }),
  calorieSummaryText: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(CalorieSection, { report: r }),
  dailyTip: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(TipSection, { report: r })
};
function ReportPreview({
  report,
  selected
}) {
  const dateStr = new Date(
    Number(report.generatedAt) / 1e6
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "report.preview_card",
      className: "bg-card border border-border rounded-xl shadow-subtle overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary px-6 py-5 text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🏥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: "OceanWell Health Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary-foreground/80 text-sm", children: [
              "Generated: ",
              dateStr
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: ALL_SECTIONS.filter((s) => selected.has(s.key)).map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: section.emoji }),
            " ",
            section.label
          ] }),
          RENDERERS[section.key](report)
        ] }, section.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "⚕️ AI-generated report for informational purposes only. Consult a qualified doctor before making health decisions." }) })
      ]
    }
  );
}
function downloadJSON(report) {
  const blob = new Blob(
    [
      JSON.stringify(
        report,
        (_, v) => typeof v === "bigint" ? v.toString() : v,
        2
      )
    ],
    {
      type: "application/json"
    }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oceanwell-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function ReportPage() {
  const { mutateAsync: generateReport, isPending } = useGenerateHealthReport();
  const { data: profile } = useMyProfile();
  const [report, setReport] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(
    new Set(ALL_SECTIONS.map((s) => s.key))
  );
  function toggleSection(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  async function handleGenerate() {
    try {
      const result = await generateReport();
      setReport(result);
      ue.success("Report generated successfully!");
    } catch {
      ue.error("Failed to generate report. Please try again.");
    }
  }
  const bmi = (profile == null ? void 0 : profile.healthProfile) ? (profile.healthProfile.weightKg / (profile.healthProfile.heightCm / 100) ** 2).toFixed(1) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "page-container space-y-6 print:px-0",
      "data-ocid": "report.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "📄 Health Report Generator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Generate a personalized summary of your health data" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-md border bg-primary/5 border-primary/20 text-primary text-xs", children: [
            "🤖",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI-generated summary only. Accuracy depends on your logged data in the app." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-subtle space-y-4 sticky top-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground mb-1", children: "📋 Report Sections" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose what to include in your report" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "space-y-2 border-0 p-0 m-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Select report sections" }),
              ALL_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-smooth select-none",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: selected.has(section.key),
                        onChange: () => toggleSection(section.key),
                        "data-ocid": `report.section_checkbox.${section.key}`,
                        className: "mt-0.5 w-4 h-4 accent-primary rounded shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                        section.emoji,
                        " ",
                        section.label
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: section.description })
                    ] })
                  ]
                },
                section.key
              ))
            ] }),
            (profile == null ? void 0 : profile.healthProfile) && bmi && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-1", children: "👤 Profile Snapshot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "BMI ",
                bmi,
                " · Age ",
                Number(profile.healthProfile.age),
                " · Goal",
                " ",
                Number(profile.healthProfile.dailyCalorieGoal),
                " kcal/day"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleGenerate,
                disabled: isPending || selected.size === 0,
                "data-ocid": "report.generate_button",
                className: "btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin", children: "⏳" }),
                  " Generating…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "📊 Generate Report" })
              }
            ),
            report && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => window.print(),
                  "data-ocid": "report.print_button",
                  className: "btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm",
                  children: "🖨️ Print"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => downloadJSON(report),
                  "data-ocid": "report.download_button",
                  className: "btn-accent flex-1 flex items-center justify-center gap-1.5 text-sm",
                  children: "💾 Export"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "report.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
          ] }) : report ? /* @__PURE__ */ jsxRuntimeExports.jsx(ReportPreview, { report, selected }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "report.empty_state",
              className: "flex flex-col items-center justify-center min-h-[360px] bg-card border border-border rounded-xl shadow-subtle gap-4 text-center px-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: "📋" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xl text-foreground", children: "No Report Generated Yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground max-w-xs", children: [
                  "Select the sections you want, then click",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Generate Report" }),
                  " to create your personalized health summary."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleGenerate,
                    "data-ocid": "report.empty_generate_button",
                    className: "btn-primary flex items-center gap-2",
                    children: "📊 Generate My Report"
                  }
                )
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  ReportPage as default
};
