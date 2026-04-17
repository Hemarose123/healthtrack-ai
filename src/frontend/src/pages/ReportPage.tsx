import { useState } from "react";
import { toast } from "sonner";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { useGenerateHealthReport, useMyProfile } from "../hooks/useBackend";
import type { HealthReport } from "../types";

const ALL_SECTIONS = [
  {
    key: "moodSummary" as const,
    label: "Mood Summary",
    emoji: "😊",
    description: "Average mood score, trend, and weekly summary",
  },
  {
    key: "latestRiskScore" as const,
    label: "Risk Score",
    emoji: "🩺",
    description: "BMI-based health risk with contributing factors",
  },
  {
    key: "recentSymptoms" as const,
    label: "Symptoms Log",
    emoji: "🤒",
    description: "Recent symptom checks with severity and remedies",
  },
  {
    key: "dietRecommendation" as const,
    label: "Diet Recommendations",
    emoji: "🥗",
    description: "Condition-based meal plan and food guidance",
  },
  {
    key: "calorieSummaryText" as const,
    label: "Calorie Summary",
    emoji: "🔥",
    description: "Weekly calorie intake vs daily goal",
  },
  {
    key: "dailyTip" as const,
    label: "Daily Health Tip",
    emoji: "💡",
    description: "AI-curated tip personalized to your profile",
  },
] as const;

type SectionKey = (typeof ALL_SECTIONS)[number]["key"];

function getRiskBadge(level: string) {
  if (level === "green") return { label: "Low Risk", cls: "badge-green" };
  if (level === "yellow") return { label: "Moderate", cls: "badge-yellow" };
  return { label: "High Risk", cls: "badge-red" };
}

/* ─── Section renderers ─── */

function MoodSection({ report }: { report: HealthReport }) {
  const avg = report.moodSummary.averageScore.toFixed(1);
  const emoji = Number(avg) >= 4 ? "😄" : Number(avg) >= 3 ? "😐" : "😕";
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl">{emoji}</span>
      <div>
        <p className="font-semibold text-foreground text-sm">
          Average Score: {avg} / 5
        </p>
        <p className="text-xs text-muted-foreground">
          {report.moodSummary.entries.length} entries · Period:{" "}
          {report.moodSummary.period}
        </p>
      </div>
    </div>
  );
}

function RiskSection({ report }: { report: HealthReport }) {
  if (!report.latestRiskScore)
    return (
      <p className="text-sm text-muted-foreground">
        No risk score recorded yet.
      </p>
    );
  const rs = report.latestRiskScore;
  const { label, cls } = getRiskBadge(rs.riskLevel as string);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-3xl text-foreground">
          {Number(rs.score)}/100
        </span>
        <span className={cls}>{label}</span>
      </div>
      <p className="text-xs text-muted-foreground">BMI: {rs.bmi.toFixed(1)}</p>
      {rs.factors.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rs.factors.map((f) => (
            <span key={f} className="badge-blue">
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SymptomsSection({ report }: { report: HealthReport }) {
  if (!report.recentSymptoms.length)
    return (
      <p className="text-sm text-muted-foreground">
        No recent symptoms logged.
      </p>
    );
  return (
    <div className="space-y-2">
      {report.recentSymptoms.slice(0, 3).map((s) => (
        <div
          key={Number(s.id)}
          className="border border-border rounded-lg p-3 bg-muted/20"
        >
          <p className="text-xs font-semibold text-foreground truncate">
            {s.symptomsText}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Severity: {Number(s.severity)}/5
          </p>
          {s.remedies[0] && (
            <p className="text-xs text-accent mt-0.5">🌿 {s.remedies[0]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function DietSection({ report }: { report: HealthReport }) {
  if (!report.dietRecommendation)
    return (
      <p className="text-sm text-muted-foreground">
        No diet recommendation generated.
      </p>
    );
  const d = report.dietRecommendation;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-foreground">
        Condition: {String(d.condition)}
      </p>
      <div>
        <p className="text-xs text-accent font-semibold mb-1">
          ✅ Recommended:
        </p>
        <p className="text-xs text-muted-foreground">
          {d.recommendedFoods.slice(0, 5).join(", ")}
        </p>
      </div>
      <div>
        <p className="text-xs text-destructive font-semibold mb-1">❌ Avoid:</p>
        <p className="text-xs text-muted-foreground">
          {d.avoidFoods.slice(0, 4).join(", ")}
        </p>
      </div>
    </div>
  );
}

function CalorieSection({ report }: { report: HealthReport }) {
  return (
    <p className="text-sm text-foreground">
      {report.calorieSummaryText || "No calorie data available."}
    </p>
  );
}

function TipSection({ report }: { report: HealthReport }) {
  return (
    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
      <p className="text-sm text-foreground">💡 {report.dailyTip}</p>
    </div>
  );
}

const RENDERERS: Record<SectionKey, (r: HealthReport) => React.ReactNode> = {
  moodSummary: (r) => <MoodSection report={r} />,
  latestRiskScore: (r) => <RiskSection report={r} />,
  recentSymptoms: (r) => <SymptomsSection report={r} />,
  dietRecommendation: (r) => <DietSection report={r} />,
  calorieSummaryText: (r) => <CalorieSection report={r} />,
  dailyTip: (r) => <TipSection report={r} />,
};

/* ─── Report Preview ─── */

function ReportPreview({
  report,
  selected,
}: { report: HealthReport; selected: Set<SectionKey> }) {
  const dateStr = new Date(
    Number(report.generatedAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div
      data-ocid="report.preview_card"
      className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden"
    >
      <div className="bg-primary px-6 py-5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏥</span>
          <div>
            <h2 className="font-display font-bold text-xl">
              OceanWell Health Report
            </h2>
            <p className="text-primary-foreground/80 text-sm">
              Generated: {dateStr}
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {ALL_SECTIONS.filter((s) => selected.has(s.key)).map((section) => (
          <div key={section.key} className="px-6 py-5">
            <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
              <span>{section.emoji}</span> {section.label}
            </h3>
            {RENDERERS[section.key](report)}
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          ⚕️ AI-generated report for informational purposes only. Consult a
          qualified doctor before making health decisions.
        </p>
      </div>
    </div>
  );
}

/* ─── JSON download ─── */

function downloadJSON(report: HealthReport) {
  const blob = new Blob(
    [
      JSON.stringify(
        report,
        (_, v) => (typeof v === "bigint" ? v.toString() : v),
        2,
      ),
    ],
    {
      type: "application/json",
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oceanwell-report-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Page ─── */

export default function ReportPage() {
  const { mutateAsync: generateReport, isPending } = useGenerateHealthReport();
  const { data: profile } = useMyProfile();

  const [report, setReport] = useState<HealthReport | null>(null);
  const [selected, setSelected] = useState<Set<SectionKey>>(
    new Set(ALL_SECTIONS.map((s) => s.key)),
  );

  function toggleSection(key: SectionKey) {
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
      toast.success("Report generated successfully!");
    } catch {
      toast.error("Failed to generate report. Please try again.");
    }
  }

  const bmi = profile?.healthProfile
    ? (
        profile.healthProfile.weightKg /
        (profile.healthProfile.heightCm / 100) ** 2
      ).toFixed(1)
    : null;

  return (
    <div
      className="page-container space-y-6 print:px-0"
      data-ocid="report.page"
    >
      {/* Header */}
      <div className="print:hidden">
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          📄 Health Report Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Generate a personalized summary of your health data
        </p>
      </div>

      {/* Disclaimers */}
      <div className="space-y-2 print:hidden">
        <MedicalDisclaimer variant="full" />
        <div className="flex items-start gap-3 p-3 rounded-md border bg-primary/5 border-primary/20 text-primary text-xs">
          🤖{" "}
          <span>
            AI-generated summary only. Accuracy depends on your logged data in
            the app.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left panel: section selector */}
        <div className="lg:col-span-2 print:hidden">
          <div className="bg-card border border-border rounded-xl p-5 shadow-subtle space-y-4 sticky top-4">
            <div>
              <h2 className="font-display font-semibold text-base text-foreground mb-1">
                📋 Report Sections
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose what to include in your report
              </p>
            </div>

            <fieldset className="space-y-2 border-0 p-0 m-0">
              <legend className="sr-only">Select report sections</legend>
              {ALL_SECTIONS.map((section) => (
                <label
                  key={section.key}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-smooth select-none"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(section.key)}
                    onChange={() => toggleSection(section.key)}
                    data-ocid={`report.section_checkbox.${section.key}`}
                    className="mt-0.5 w-4 h-4 accent-primary rounded shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {section.emoji} {section.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </label>
              ))}
            </fieldset>

            {/* Profile snapshot */}
            {profile?.healthProfile && bmi && (
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <p className="text-xs font-semibold text-foreground mb-1">
                  👤 Profile Snapshot
                </p>
                <p className="text-xs text-muted-foreground">
                  BMI {bmi} · Age {Number(profile.healthProfile.age)} · Goal{" "}
                  {Number(profile.healthProfile.dailyCalorieGoal)} kcal/day
                </p>
              </div>
            )}

            {/* Generate */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isPending || selected.size === 0}
              data-ocid="report.generate_button"
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="animate-spin">⏳</span> Generating…
                </>
              ) : (
                <>📊 Generate Report</>
              )}
            </button>

            {/* Export buttons */}
            {report && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  data-ocid="report.print_button"
                  className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm"
                >
                  🖨️ Print
                </button>
                <button
                  type="button"
                  onClick={() => downloadJSON(report)}
                  data-ocid="report.download_button"
                  className="btn-accent flex-1 flex items-center justify-center gap-1.5 text-sm"
                >
                  💾 Export
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: preview */}
        <div className="lg:col-span-3">
          {isPending ? (
            <div className="space-y-3" data-ocid="report.loading_state">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : report ? (
            <ReportPreview report={report} selected={selected} />
          ) : (
            <div
              data-ocid="report.empty_state"
              className="flex flex-col items-center justify-center min-h-[360px] bg-card border border-border rounded-xl shadow-subtle gap-4 text-center px-8"
            >
              <span className="text-6xl">📋</span>
              <h3 className="font-display font-semibold text-xl text-foreground">
                No Report Generated Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Select the sections you want, then click{" "}
                <strong>Generate Report</strong> to create your personalized
                health summary.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                data-ocid="report.empty_generate_button"
                className="btn-primary flex items-center gap-2"
              >
                📊 Generate My Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
