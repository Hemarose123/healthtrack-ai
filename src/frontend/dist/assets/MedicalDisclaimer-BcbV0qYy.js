import { r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-B1i-rzHQ.js";
const MESSAGES = {
  full: "⚕️ This is AI-assisted analysis only — not a certified medical diagnosis. Results are for informational purposes only. Please consult a qualified doctor before making any health decisions.",
  compact: "⚕️ AI-assisted analysis only. Not a certified medical diagnosis. Consult your doctor.",
  food: "🍽️ AI calorie estimation — actual values may vary based on exact portion size and cooking method. For precise nutritional information, consult a registered dietitian."
};
function MedicalDisclaimer({
  variant = "full",
  dismissible = false,
  className
}) {
  const [dismissed, setDismissed] = reactExports.useState(false);
  if (dismissed) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "alert",
      "data-ocid": "medical_disclaimer",
      className: cn(
        "flex items-start gap-3 p-3 rounded-md border",
        "bg-amber-50 border-amber-200 text-amber-900",
        "dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-200",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed flex-1", children: MESSAGES[variant] }),
        dismissible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setDismissed(true),
            "aria-label": "Dismiss disclaimer",
            className: "text-amber-600 hover:text-amber-900 dark:text-amber-400 shrink-0 mt-0.5 transition-colors",
            children: "✕"
          }
        )
      ]
    }
  );
}
export {
  MedicalDisclaimer as M
};
