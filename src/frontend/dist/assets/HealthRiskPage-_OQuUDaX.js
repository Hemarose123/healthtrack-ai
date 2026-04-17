import { r as reactExports, R as RiskLevel, j as jsxRuntimeExports, C as CardSkeleton, c as cn, b as Link } from "./index-B1i-rzHQ.js";
import { B as Button } from "./button-Dt4o60Uo.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { f as useLatestRiskScore, c as useMyProfile, s as useCalculateRiskScore } from "./useBackend-D3WuyYMJ.js";
import { m as motion } from "./proxy-bm9pCfPV.js";
function getBmiCategory(bmi) {
  if (bmi < 18.5)
    return { label: "Underweight", cls: "badge-blue", icon: "📉" };
  if (bmi < 25)
    return { label: "Healthy Weight", cls: "badge-green", icon: "✅" };
  if (bmi < 30) return { label: "Overweight", cls: "badge-yellow", icon: "⚠️" };
  return { label: "Obese", cls: "badge-red", icon: "🔴" };
}
const RADIUS = 72;
const HALF_CIRC = Math.PI * RADIUS;
function RiskGauge({ score, level }) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = HALF_CIRC - clamped / 100 * HALF_CIRC;
  const arcColor = level === RiskLevel.green ? "oklch(0.68 0.13 155)" : level === RiskLevel.yellow ? "oklch(0.78 0.15 85)" : "oklch(0.55 0.22 25)";
  const badgeCls = level === RiskLevel.green ? "bg-accent/10 text-accent border-accent/20" : level === RiskLevel.yellow ? "bg-yellow-500/10 text-yellow-700 border-yellow-400/30" : "bg-destructive/10 text-destructive border-destructive/20";
  const riskLabel = level === RiskLevel.green ? "HEALTHY" : level === RiskLevel.yellow ? "AT RISK" : "HIGH RISK";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "-10 -10 180 100",
        className: "w-52 h-28",
        role: "img",
        "aria-label": `Risk score ${score} out of 100`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: `Health Risk Score: ${score} out of 100` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M 0 80 A 72 72 0 0 1 144 80",
              fill: "none",
              stroke: "var(--muted)",
              strokeWidth: "14",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M 0 80 A 72 72 0 0 1 144 80",
              fill: "none",
              stroke: arcColor,
              strokeWidth: "14",
              strokeLinecap: "round",
              strokeDasharray: `${HALF_CIRC}`,
              strokeDashoffset: `${offset}`,
              style: {
                transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: "72",
              y: "68",
              textAnchor: "middle",
              fontSize: "28",
              fontWeight: "bold",
              fill: "currentColor",
              children: score
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: "72",
              y: "82",
              textAnchor: "middle",
              fontSize: "10",
              fill: "var(--muted-foreground)",
              children: "/ 100"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "text-sm font-bold px-4 py-1 rounded-full border tracking-wide",
          badgeCls
        ),
        "data-ocid": "health_risk.level_badge",
        children: riskLabel
      }
    )
  ] });
}
function conditionAdvice(level) {
  if (level === RiskLevel.green)
    return {
      title: "🎉 You're in great health!",
      items: [
        "Maintain your current exercise routine",
        "Continue with a balanced, colorful diet",
        "Keep up with routine health checkups",
        "Prioritize 7-8 hours of quality sleep"
      ]
    };
  if (level === RiskLevel.yellow)
    return {
      title: "⚠️ Some areas need attention",
      items: [
        "Increase physical activity to 30 mins/day",
        "Reduce processed food and sugar intake",
        "Monitor your blood pressure regularly",
        "Consult a doctor for preventive screening"
      ]
    };
  return {
    title: "🔴 Immediate action recommended",
    items: [
      "Schedule a comprehensive health evaluation soon",
      "Adopt a medically supervised diet plan",
      "Begin a gentle, structured exercise program",
      "Manage stress through yoga or meditation"
    ]
  };
}
function HealthRiskPage() {
  const { data: riskEntry, isLoading } = useLatestRiskScore();
  const { data: profile } = useMyProfile();
  const calcRisk = useCalculateRiskScore();
  const risk = riskEntry;
  const score = risk ? Number(risk.score) : 0;
  const bmiVal = (risk == null ? void 0 : risk.bmi) ?? 0;
  const bmiCat = reactExports.useMemo(() => getBmiCategory(bmiVal), [bmiVal]);
  const level = (risk == null ? void 0 : risk.riskLevel) ?? RiskLevel.green;
  const advice = conditionAdvice(level);
  const hp = profile == null ? void 0 : profile.healthProfile;
  async function handleRecalculate() {
    await calcRisk.mutateAsync();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "❤️ Health Risk Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "AI-powered risk assessment based on your health profile" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full", dismissible: true }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
    ] }) : !risk ? (
      /* No data — prompt to calculate */
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.97 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.4 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center py-12 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: "🔬" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-lg text-foreground", children: "No risk score yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "Calculate your first health risk score based on your health profile data." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "health_risk.calculate_button",
                onClick: handleRecalculate,
                disabled: calcRisk.isPending,
                className: "btn-primary border-0 mt-2",
                children: calcRisk.isPending ? "Calculating..." : "🚀 Calculate Risk Score"
              }
            )
          ] }) })
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.05 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RiskGauge, { score, level }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "health_risk.recalculate_button",
                variant: "outline",
                onClick: handleRecalculate,
                disabled: calcRisk.isPending,
                size: "sm",
                className: "transition-smooth",
                children: calcRisk.isPending ? "⏳ Recalculating..." : "🔄 Recalculate"
              }
            )
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.1 },
          className: "grid grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "bordered", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold tracking-wide", children: "BMI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground mt-1", children: bmiVal.toFixed(1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  "data-ocid": "health_risk.bmi_badge",
                  className: cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1.5 inline-block",
                    bmiCat.cls
                  ),
                  children: [
                    bmiCat.icon,
                    " ",
                    bmiCat.label
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "bordered", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold tracking-wide", children: "Profile" }),
              hp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground mt-1", children: [
                  hp.weightKg,
                  " kg · ",
                  hp.heightCm,
                  " cm"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Age ",
                  String(hp.age),
                  " · ",
                  hp.activityLevel
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Complete your profile" })
            ] }) })
          ]
        }
      ),
      risk.factors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.15 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📊 Contributing Factors" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ul",
              {
                className: "space-y-2",
                "data-ocid": "health_risk.factors_list",
                children: risk.factors.map((factor, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.li,
                  {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: i * 0.06 },
                    "data-ocid": `health_risk.factor_item.${i + 1}`,
                    className: "flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/40",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-sm", children: "◆" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: factor })
                    ]
                  },
                  `factor-${factor.slice(0, 20)}`
                ))
              }
            ) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.2 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: advice.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", "data-ocid": "health_risk.advice_list", children: advice.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-start gap-2 text-sm text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold shrink-0", children: "✓" }),
                    item
                  ]
                },
                `advice-${item.slice(0, 20)}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/diet-recommendations",
                  "data-ocid": "health_risk.diet_link",
                  className: "inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors",
                  children: "🥗 View Diet Recommendations →"
                }
              )
            ] })
          ] })
        }
      )
    ] })
  ] });
}
export {
  HealthRiskPage as default
};
