import { j as jsxRuntimeExports, c as cn } from "./index-B1i-rzHQ.js";
const ringColors = {
  blue: "stroke-primary",
  green: "stroke-accent",
  yellow: "stroke-yellow-500",
  red: "stroke-destructive"
};
const textColors = {
  blue: "text-primary",
  green: "text-accent",
  yellow: "text-yellow-600",
  red: "text-destructive"
};
function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  variant = "blue",
  label,
  sublabel,
  className,
  animated = true
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - clampedValue / 100 * circumference;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col items-center gap-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { width: size, height: size }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: size,
          height: size,
          viewBox: `0 0 ${size} ${size}`,
          className: "-rotate-90",
          "aria-label": `Progress: ${clampedValue}%`,
          role: "img",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: size / 2,
                cy: size / 2,
                r: radius,
                fill: "none",
                className: "stroke-muted",
                strokeWidth
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: size / 2,
                cy: size / 2,
                r: radius,
                fill: "none",
                className: cn(
                  ringColors[variant],
                  animated && "transition-all duration-700 ease-out"
                ),
                strokeWidth,
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                strokeLinecap: "round"
              }
            )
          ]
        }
      ),
      label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "font-display font-bold text-sm",
            textColors[variant]
          ),
          children: label
        }
      ) })
    ] }),
    sublabel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: sublabel })
  ] });
}
export {
  ProgressRing as P
};
