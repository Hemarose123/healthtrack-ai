import { r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-B1i-rzHQ.js";
const Card = reactExports.forwardRef(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-card shadow-md rounded-lg",
      elevated: "bg-card shadow-elevated rounded-lg border border-border/50",
      bordered: "bg-card border border-border rounded-lg",
      muted: "bg-muted/40 rounded-lg border border-border/40"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: cn(
          variants[variant],
          "transition-smooth",
          hover && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
          className
        ),
        ...props,
        children
      }
    );
  }
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("px-5 pt-5 pb-3", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h3",
  {
    ref,
    className: cn(
      "font-display font-semibold text-base text-foreground",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("px-5 pb-5", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn(
        "px-5 py-3 border-t border-border/60 flex items-center gap-3",
        className
      ),
      ...props
    }
  )
);
CardFooter.displayName = "CardFooter";
export {
  Card as C,
  CardHeader as a,
  CardTitle as b,
  CardContent as c,
  CardFooter as d
};
