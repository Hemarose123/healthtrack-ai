import { u as useNavigate, a as useAuth, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, b as Link } from "./index-B1i-rzHQ.js";
function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (result.success) {
      navigate({ to: "/dashboard" });
    } else {
      setError(result.error ?? "Login failed. Please try again.");
    }
  };
  const isLoading = submitting || authLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary px-6 py-8 text-center flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-5xl leading-none",
          role: "img",
          "aria-label": "hospital",
          children: "🏥"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-primary-foreground tracking-tight mt-1", children: "OceanWell" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-sm", children: "AI-Powered Digital Healthcare Tracker" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center px-4 pt-8 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md border border-border p-6 transition-smooth", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-1", children: "Welcome back 👋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Sign in to your health dashboard" }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "login.error_state",
            className: "mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm font-medium flex items-center gap-2",
            role: "alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️" }),
              error
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "login-email",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "📧 Email address"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "login-email",
                "data-ocid": "login.email_input",
                type: "email",
                autoComplete: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "you@example.com",
                disabled: isLoading,
                className: "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "login-password",
                className: "block text-sm font-semibold text-foreground mb-1.5",
                children: "🔒 Password"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "login-password",
                "data-ocid": "login.password_input",
                type: "password",
                autoComplete: "current-password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Enter your password",
                disabled: isLoading,
                className: "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "data-ocid": "login.submit_button",
              type: "submit",
              disabled: isLoading,
              className: "btn-primary w-full h-10 flex items-center justify-center gap-2 mt-2",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Signing in…" })
              ] }) : "Sign in →"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-5 border-t border-border/60 text-center text-sm text-muted-foreground", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/register",
              "data-ocid": "login.register_link",
              className: "text-primary font-semibold hover:underline transition-smooth",
              children: "Register here"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground leading-relaxed px-2", children: "🔒 Your health data is encrypted and stored securely on the Internet Computer." })
    ] }) })
  ] });
}
export {
  LoginPage as default
};
