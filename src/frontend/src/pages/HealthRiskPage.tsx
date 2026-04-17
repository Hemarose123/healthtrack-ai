import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import {
  useCalculateRiskScore,
  useLatestRiskScore,
  useMyProfile,
} from "../hooks/useBackend";
import { RiskLevel } from "../types";
import type { RiskScoreEntry } from "../types";

/* ─── BMI helpers ─────────────────────────────────────────── */
function getBmiCategory(bmi: number) {
  if (bmi < 18.5)
    return { label: "Underweight", cls: "badge-blue", icon: "📉" };
  if (bmi < 25)
    return { label: "Healthy Weight", cls: "badge-green", icon: "✅" };
  if (bmi < 30) return { label: "Overweight", cls: "badge-yellow", icon: "⚠️" };
  return { label: "Obese", cls: "badge-red", icon: "🔴" };
}

/* ─── Risk gauge SVG ─────────────────────────────────────── */
const RADIUS = 72;
const HALF_CIRC = Math.PI * RADIUS;

function RiskGauge({ score, level }: { score: number; level: RiskLevel }) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = HALF_CIRC - (clamped / 100) * HALF_CIRC;

  const arcColor =
    level === RiskLevel.green
      ? "oklch(0.68 0.13 155)"
      : level === RiskLevel.yellow
        ? "oklch(0.78 0.15 85)"
        : "oklch(0.55 0.22 25)";

  const badgeCls =
    level === RiskLevel.green
      ? "bg-accent/10 text-accent border-accent/20"
      : level === RiskLevel.yellow
        ? "bg-yellow-500/10 text-yellow-700 border-yellow-400/30"
        : "bg-destructive/10 text-destructive border-destructive/20";

  const riskLabel =
    level === RiskLevel.green
      ? "HEALTHY"
      : level === RiskLevel.yellow
        ? "AT RISK"
        : "HIGH RISK";

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="-10 -10 180 100"
        className="w-52 h-28"
        role="img"
        aria-label={`Risk score ${score} out of 100`}
      >
        <title>{`Health Risk Score: ${score} out of 100`}</title>
        {/* Track arc */}
        <path
          d="M 0 80 A 72 72 0 0 1 144 80"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 0 80 A 72 72 0 0 1 144 80"
          fill="none"
          stroke={arcColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${HALF_CIRC}`}
          strokeDashoffset={`${offset}`}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x="72"
          y="68"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="currentColor"
        >
          {score}
        </text>
        <text
          x="72"
          y="82"
          textAnchor="middle"
          fontSize="10"
          fill="var(--muted-foreground)"
        >
          / 100
        </text>
      </svg>
      <span
        className={cn(
          "text-sm font-bold px-4 py-1 rounded-full border tracking-wide",
          badgeCls,
        )}
        data-ocid="health_risk.level_badge"
      >
        {riskLabel}
      </span>
    </div>
  );
}

/* ─── Condition advice ───────────────────────────────────── */
function conditionAdvice(level: RiskLevel) {
  if (level === RiskLevel.green)
    return {
      title: "🎉 You're in great health!",
      items: [
        "Maintain your current exercise routine",
        "Continue with a balanced, colorful diet",
        "Keep up with routine health checkups",
        "Prioritize 7-8 hours of quality sleep",
      ],
    };
  if (level === RiskLevel.yellow)
    return {
      title: "⚠️ Some areas need attention",
      items: [
        "Increase physical activity to 30 mins/day",
        "Reduce processed food and sugar intake",
        "Monitor your blood pressure regularly",
        "Consult a doctor for preventive screening",
      ],
    };
  return {
    title: "🔴 Immediate action recommended",
    items: [
      "Schedule a comprehensive health evaluation soon",
      "Adopt a medically supervised diet plan",
      "Begin a gentle, structured exercise program",
      "Manage stress through yoga or meditation",
    ],
  };
}

/* ─── Page ───────────────────────────────────────────────── */
export default function HealthRiskPage() {
  const { data: riskEntry, isLoading } = useLatestRiskScore();
  const { data: profile } = useMyProfile();
  const calcRisk = useCalculateRiskScore();

  const risk = riskEntry as RiskScoreEntry | null | undefined;
  const score = risk ? Number(risk.score) : 0;
  const bmiVal = risk?.bmi ?? 0;
  const bmiCat = useMemo(() => getBmiCategory(bmiVal), [bmiVal]);
  const level = risk?.riskLevel ?? RiskLevel.green;
  const advice = conditionAdvice(level);

  const hp = profile?.healthProfile;

  async function handleRecalculate() {
    await calcRisk.mutateAsync();
  }

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          ❤️ Health Risk Score
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-powered risk assessment based on your health profile
        </p>
      </motion.div>

      <MedicalDisclaimer variant="full" dismissible />

      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !risk ? (
        /* No data — prompt to calculate */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card variant="elevated">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <span className="text-6xl">🔬</span>
              <p className="font-display font-semibold text-lg text-foreground">
                No risk score yet
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Calculate your first health risk score based on your health
                profile data.
              </p>
              <Button
                data-ocid="health_risk.calculate_button"
                onClick={handleRecalculate}
                disabled={calcRisk.isPending}
                className="btn-primary border-0 mt-2"
              >
                {calcRisk.isPending
                  ? "Calculating..."
                  : "🚀 Calculate Risk Score"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Gauge card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <RiskGauge score={score} level={level} />
                <Button
                  data-ocid="health_risk.recalculate_button"
                  variant="outline"
                  onClick={handleRecalculate}
                  disabled={calcRisk.isPending}
                  size="sm"
                  className="transition-smooth"
                >
                  {calcRisk.isPending
                    ? "⏳ Recalculating..."
                    : "🔄 Recalculate"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* BMI + profile row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card variant="bordered">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                  BMI
                </p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {bmiVal.toFixed(1)}
                </p>
                <span
                  data-ocid="health_risk.bmi_badge"
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1.5 inline-block",
                    bmiCat.cls,
                  )}
                >
                  {bmiCat.icon} {bmiCat.label}
                </span>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                  Profile
                </p>
                {hp ? (
                  <>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {hp.weightKg} kg · {hp.heightCm} cm
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Age {String(hp.age)} · {hp.activityLevel}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete your profile
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contributing factors */}
          {risk.factors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>📊 Contributing Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul
                    className="space-y-2"
                    data-ocid="health_risk.factors_list"
                  >
                    {risk.factors.map((factor, i) => (
                      <motion.li
                        key={`factor-${factor.slice(0, 20)}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        data-ocid={`health_risk.factor_item.${i + 1}`}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/40"
                      >
                        <span className="text-primary text-sm">◆</span>
                        <span className="text-sm text-foreground">
                          {factor}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Advice card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>{advice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5" data-ocid="health_risk.advice_list">
                  {advice.items.map((item) => (
                    <li
                      key={`advice-${item.slice(0, 20)}`}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/diet-recommendations"
                  data-ocid="health_risk.diet_link"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  🥗 View Diet Recommendations →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
