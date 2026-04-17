import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AddMealRequest,
  HistoryCategory,
  MedicalCondition,
  RegisterStep1Request,
  RegisterStep2Request,
  RegisterStep3Request,
} from "../types";

function useSafeActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isReady: !!actor && !isFetching };
}

export function useMyProfile() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: isReady,
  });
}

export function useDailyTip() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["daily-tip"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getDailyTip();
    },
    enabled: isReady,
  });
}

export function useDailySummary(date: string) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["daily-summary", date],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailySummary(date);
    },
    enabled: isReady && !!date,
  });
}

export function useWeeklySummary(weekStart: string) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["weekly-summary", weekStart],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWeeklySummary(weekStart);
    },
    enabled: isReady && !!weekStart,
  });
}

export function useMealsForDate(date: string) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["meals-date", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMealsForDate(date);
    },
    enabled: isReady && !!date,
  });
}

export function useMealHistory(offset = 0, limit = 20) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["meal-history", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMealHistory(BigInt(offset), BigInt(limit));
    },
    enabled: isReady,
  });
}

export function useLogMeal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddMealRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMeal(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals-date"] });
      qc.invalidateQueries({ queryKey: ["daily-summary"] });
      qc.invalidateQueries({ queryKey: ["meal-history"] });
    },
  });
}

export function useDeleteMeal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mealId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMeal(mealId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals-date"] });
      qc.invalidateQueries({ queryKey: ["daily-summary"] });
      qc.invalidateQueries({ queryKey: ["meal-history"] });
    },
  });
}

export function useMoodEntries(period: string) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["mood-entries", period],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMoodEntries(period);
    },
    enabled: isReady,
  });
}

export function useLogMood() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ score, note }: { score: bigint; note: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMood(score, note);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mood-entries"] });
    },
  });
}

export function useCheckSymptoms() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.checkSymptoms(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["symptom-history"] });
    },
  });
}

export function useSymptomHistory(offset = 0, limit = 20) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["symptom-history", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSymptomHistory(BigInt(offset), BigInt(limit));
    },
    enabled: isReady,
  });
}

export function useLatestRiskScore() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["latest-risk-score"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestRiskScore();
    },
    enabled: isReady,
  });
}

export function useCalculateRiskScore() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.calculateRiskScore();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["latest-risk-score"] });
    },
  });
}

export function useDietRecommendation() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["diet-recommendation"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDietRecommendation();
    },
    enabled: isReady,
  });
}

export function useExercises() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercises();
    },
    enabled: isReady,
  });
}

export function useExercisesByCondition(condition: MedicalCondition) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["exercises-condition", condition],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercisesByCondition(condition);
    },
    enabled: isReady,
  });
}

export function useSearchFoods(term: string) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["search-foods", term],
    queryFn: async () => {
      if (!actor || !term) return [];
      return actor.searchFoods(term);
    },
    enabled: isReady && term.length > 1,
  });
}

export function useListFoods(offset = 0, limit = 50) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["list-foods", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFoods(BigInt(offset), BigInt(limit));
    },
    enabled: isReady,
  });
}

export function useHealthHistory(
  categoryFilter: HistoryCategory | null = null,
  fromTs: bigint | null = null,
  toTs: bigint | null = null,
) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: [
      "health-history",
      categoryFilter,
      fromTs?.toString(),
      toTs?.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHealthHistory(categoryFilter, fromTs, toTs);
    },
    enabled: isReady,
  });
}

export function useGenerateHealthReport() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.generateHealthReport();
    },
  });
}

export function useSetCalorieGoal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.setCalorieGoal(goal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useRegisterStep1() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req: RegisterStep1Request) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep1(req);
    },
  });
}

export function useRegisterStep2() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req: RegisterStep2Request) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep2(req);
    },
  });
}

export function useRegisterStep3() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req: RegisterStep3Request) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep3(req);
    },
  });
}

export function useUpdateHealthProfile() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: RegisterStep2Request) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateHealthProfile(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateLifestyle() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: RegisterStep3Request) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLifestyle(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
