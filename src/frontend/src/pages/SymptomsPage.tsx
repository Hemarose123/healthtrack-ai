import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/HealthCard";
import { CardSkeleton } from "../components/ui/LoadingSpinner";
import { MedicalDisclaimer } from "../components/ui/MedicalDisclaimer";
import { useCheckSymptoms, useSymptomHistory } from "../hooks/useBackend";
import type { SymptomEntry } from "../types";

function severityConfig(score: number) {
  if (score <= 3)
    return { label: "Mild", cls: "badge-green", barColor: "bg-accent" };
  if (score <= 6)
    return {
      label: "Moderate",
      cls: "badge-yellow",
      barColor: "bg-amber-500",
    };
  return { label: "Severe", cls: "badge-red", barColor: "bg-destructive" };
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SymptomsPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SymptomEntry | null>(null);
  const checkSymptoms = useCheckSymptoms();
  const { data: history, isLoading: historyLoading } = useSymptomHistory(0, 10);

  async function handleCheck() {
    if (!text.trim()) return;
    const res = await checkSymptoms.mutateAsync(text.trim());
    setResult(res);
  }

  const sevScore = result ? Number(result.severity) : 0;
  const cfg = result ? severityConfig(sevScore) : null;

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          🩺 Symptoms Checker
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Describe your symptoms and get AI-powered natural remedy suggestions
        </p>
      </motion.div>

      {/* Prominent Disclaimer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <MedicalDisclaimer variant="full" />
      </motion.div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>📝 Describe Your Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              data-ocid="symptoms.input"
              placeholder="Describe your symptoms... e.g., headache and fever for 2 days"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="resize-none text-sm mb-4"
            />
            <Button
              data-ocid="symptoms.check_button"
              onClick={handleCheck}
              disabled={!text.trim() || checkSymptoms.isPending}
              className="w-full btn-primary border-0"
            >
              {checkSymptoms.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  Analyzing symptoms...
                </span>
              ) : (
                "🔍 Check Symptoms"
              )}
            </Button>

            {checkSymptoms.isError && (
              <p
                data-ocid="symptoms.error_state"
                className="text-sm text-destructive mt-2 text-center"
              >
                Failed to analyze symptoms. Please try again.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && cfg && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>🔬 Analysis Results</CardTitle>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full border",
                      cfg.cls,
                    )}
                  >
                    {cfg.label} — Score {sevScore}/10
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Severity bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Severity Level</span>
                    <span>{sevScore} / 10</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sevScore * 10}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full", cfg.barColor)}
                    />
                  </div>
                </div>

                {/* Remedies */}
                {result.remedies.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      🌿 Natural Remedies
                    </p>
                    <ul className="space-y-2">
                      {result.remedies.map((remedy, i) => (
                        <motion.li
                          key={`remedy-${remedy.slice(0, 20)}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          data-ocid={`symptoms.remedy_item.${i + 1}`}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/20"
                        >
                          <span className="text-base shrink-0">🌿</span>
                          <span className="text-sm text-foreground">
                            {remedy}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Severe warning */}
                {sevScore >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    data-ocid="symptoms.severe_warning"
                    className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                  >
                    <span className="text-xl shrink-0">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-destructive">
                        See a Doctor — Severity is High
                      </p>
                      <p className="text-xs text-destructive/80 mt-0.5">
                        Your symptoms indicate a potentially serious condition.
                        Please consult a qualified healthcare professional
                        immediately.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>📋 Symptom History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <CardSkeleton />
            ) : !history || history.length === 0 ? (
              <div
                data-ocid="symptoms.history_empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <span className="text-4xl block mb-2">🩺</span>
                <p className="text-sm">No symptom checks yet.</p>
              </div>
            ) : (
              <ul className="space-y-2" data-ocid="symptoms.history_list">
                {history.map((entry: SymptomEntry, i: number) => {
                  const sc = Number(entry.severity);
                  const c = severityConfig(sc);
                  return (
                    <motion.li
                      key={`sentry-${String(entry.id)}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`symptoms.history_item.${i + 1}`}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/40"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {entry.symptomsText}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                      <Badge className={cn("shrink-0 text-[10px]", c.cls)}>
                        {c.label}
                      </Badge>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
