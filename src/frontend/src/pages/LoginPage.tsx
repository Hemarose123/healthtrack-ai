import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ocean blue header */}
      <div className="bg-primary px-6 py-8 text-center flex flex-col items-center gap-2">
        <span
          className="text-5xl leading-none"
          role="img"
          aria-label="hospital"
        >
          🏥
        </span>
        <h1 className="font-display font-bold text-2xl text-primary-foreground tracking-tight mt-1">
          OceanWell
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          AI-Powered Digital Healthcare Tracker
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-12">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl shadow-md border border-border p-6 transition-smooth">
            <h2 className="font-display font-bold text-xl text-foreground mb-1">
              Welcome back 👋
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Sign in to your health dashboard
            </p>

            {error && (
              <div
                data-ocid="login.error_state"
                className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm font-medium flex items-center gap-2"
                role="alert"
              >
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  📧 Email address
                </label>
                <input
                  id="login-email"
                  data-ocid="login.email_input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  🔒 Password
                </label>
                <input
                  id="login-password"
                  data-ocid="login.password_input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50"
                />
              </div>

              <button
                data-ocid="login.submit_button"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-10 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  "Sign in →"
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-border/60 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                data-ocid="login.register_link"
                className="text-primary font-semibold hover:underline transition-smooth"
              >
                Register here
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed px-2">
            🔒 Your health data is encrypted and stored securely on the Internet
            Computer.
          </p>
        </div>
      </div>
    </div>
  );
}
