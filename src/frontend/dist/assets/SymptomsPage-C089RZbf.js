import { r as reactExports, j as jsxRuntimeExports, c as cn, C as CardSkeleton } from "./index-B1i-rzHQ.js";
import { B as Badge } from "./badge-CVxodpuz.js";
import { B as Button } from "./button-Dt4o60Uo.js";
import { T as Textarea } from "./textarea-f-DPe8WQ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./HealthCard-DPfxaZJ5.js";
import { M as MedicalDisclaimer } from "./MedicalDisclaimer-BcbV0qYy.js";
import { q as useCheckSymptoms, r as useSymptomHistory } from "./useBackend-D3WuyYMJ.js";
import { m as motion } from "./proxy-bm9pCfPV.js";
import { A as AnimatePresence } from "./index-ZVjQZLXi.js";
function severityConfig(score) {
  if (score <= 3)
    return { label: "Mild", cls: "badge-green", barColor: "bg-accent" };
  if (score <= 6)
    return {
      label: "Moderate",
      cls: "badge-yellow",
      barColor: "bg-amber-500"
    };
  return { label: "Severe", cls: "badge-red", barColor: "bg-destructive" };
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function SymptomsPage() {
  const [text, setText] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const checkSymptoms = useCheckSymptoms();
  const { data: history, isLoading: historyLoading } = useSymptomHistory(0, 10);
  async function handleCheck() {
    if (!text.trim()) return;
    const res = await checkSymptoms.mutateAsync(text.trim());
    setResult(res);
  }
  const sevScore = result ? Number(result.severity) : 0;
  const cfg = result ? severityConfig(sevScore) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground flex items-center gap-2", children: "🩺 Symptoms Checker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Describe your symptoms and get AI-powered natural remedy suggestions" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.35 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MedicalDisclaimer, { variant: "full" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📝 Describe Your Symptoms" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "symptoms.input",
                placeholder: "Describe your symptoms... e.g., headache and fever for 2 days",
                value: text,
                onChange: (e) => setText(e.target.value),
                rows: 4,
                className: "resize-none text-sm mb-4"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "symptoms.check_button",
                onClick: handleCheck,
                disabled: !text.trim() || checkSymptoms.isPending,
                className: "w-full btn-primary border-0",
                children: checkSymptoms.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" }),
                  "Analyzing symptoms..."
                ] }) : "🔍 Check Symptoms"
              }
            ),
            checkSymptoms.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "symptoms.error_state",
                className: "text-sm text-destructive mt-2 text-center",
                children: "Failed to analyze symptoms. Please try again."
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: result && cfg && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.45 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "🔬 Analysis Results" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full border",
                  cfg.cls
                ),
                children: [
                  cfg.label,
                  " — Score ",
                  sevScore,
                  "/10"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Severity Level" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  sevScore,
                  " / 10"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${sevScore * 10}%` },
                  transition: { duration: 0.8, ease: "easeOut" },
                  className: cn("h-full rounded-full", cfg.barColor)
                }
              ) })
            ] }),
            result.remedies.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "🌿 Natural Remedies" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: result.remedies.map((remedy, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.li,
                {
                  initial: { opacity: 0, x: -8 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: i * 0.06 },
                  "data-ocid": `symptoms.remedy_item.${i + 1}`,
                  className: "flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0", children: "🌿" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: remedy })
                  ]
                },
                `remedy-${remedy.slice(0, 20)}`
              )) })
            ] }),
            sevScore >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.97 },
                animate: { opacity: 1, scale: 1 },
                "data-ocid": "symptoms.severe_warning",
                className: "flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: "⚠️" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-destructive", children: "See a Doctor — Severity is High" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 mt-0.5", children: "Your symptoms indicate a potentially serious condition. Please consult a qualified healthcare professional immediately." })
                  ] })
                ]
              }
            )
          ] })
        ] })
      },
      "result"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "📋 Symptom History" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}) : !history || history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "symptoms.history_empty_state",
              className: "text-center py-8 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl block mb-2", children: "🩺" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No symptom checks yet." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-ocid": "symptoms.history_list", children: history.map((entry, i) => {
            const sc = Number(entry.severity);
            const c = severityConfig(sc);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.li,
              {
                initial: { opacity: 0, x: -8 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: i * 0.04 },
                "data-ocid": `symptoms.history_item.${i + 1}`,
                className: "flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground truncate", children: entry.symptomsText }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatDate(entry.timestamp) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("shrink-0 text-[10px]", c.cls), children: c.label })
                ]
              },
              `sentry-${String(entry.id)}`
            );
          }) }) })
        ] })
      }
    )
  ] });
}
export {
  SymptomsPage as default
};
