var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { S as Subscribable, s as shallowEqualObjects, k as hashKey, l as getDefaultState, n as notifyManager, m as useQueryClient, r as reactExports, p as noop, q as shouldThrowError, t as useQuery, w as useActor, x as createActor } from "./index-B1i-rzHQ.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function useSafeActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isReady: !!actor && !isFetching };
}
function useMyProfile() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: isReady
  });
}
function useDailyTip() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["daily-tip"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getDailyTip();
    },
    enabled: isReady
  });
}
function useDailySummary(date) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["daily-summary", date],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailySummary(date);
    },
    enabled: isReady && !!date
  });
}
function useWeeklySummary(weekStart) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["weekly-summary", weekStart],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWeeklySummary(weekStart);
    },
    enabled: isReady && !!weekStart
  });
}
function useMealHistory(offset = 0, limit = 20) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["meal-history", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMealHistory(BigInt(offset), BigInt(limit));
    },
    enabled: isReady
  });
}
function useLogMeal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMeal(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals-date"] });
      qc.invalidateQueries({ queryKey: ["daily-summary"] });
      qc.invalidateQueries({ queryKey: ["meal-history"] });
    }
  });
}
function useDeleteMeal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mealId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMeal(mealId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals-date"] });
      qc.invalidateQueries({ queryKey: ["daily-summary"] });
      qc.invalidateQueries({ queryKey: ["meal-history"] });
    }
  });
}
function useMoodEntries(period) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["mood-entries", period],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMoodEntries(period);
    },
    enabled: isReady
  });
}
function useLogMood() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ score, note }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logMood(score, note);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mood-entries"] });
    }
  });
}
function useCheckSymptoms() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text) => {
      if (!actor) throw new Error("Not connected");
      return actor.checkSymptoms(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["symptom-history"] });
    }
  });
}
function useSymptomHistory(offset = 0, limit = 20) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["symptom-history", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSymptomHistory(BigInt(offset), BigInt(limit));
    },
    enabled: isReady
  });
}
function useLatestRiskScore() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["latest-risk-score"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestRiskScore();
    },
    enabled: isReady
  });
}
function useCalculateRiskScore() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.calculateRiskScore();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["latest-risk-score"] });
    }
  });
}
function useDietRecommendation() {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["diet-recommendation"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDietRecommendation();
    },
    enabled: isReady
  });
}
function useSearchFoods(term) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["search-foods", term],
    queryFn: async () => {
      if (!actor || !term) return [];
      return actor.searchFoods(term);
    },
    enabled: isReady && term.length > 1
  });
}
function useListFoods(offset = 0, limit = 50) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: ["list-foods", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFoods(BigInt(offset), BigInt(limit));
    },
    enabled: isReady
  });
}
function useHealthHistory(categoryFilter = null, fromTs = null, toTs = null) {
  const { actor, isReady } = useSafeActor();
  return useQuery({
    queryKey: [
      "health-history",
      categoryFilter,
      fromTs == null ? void 0 : fromTs.toString(),
      toTs == null ? void 0 : toTs.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHealthHistory(categoryFilter, fromTs, toTs);
    },
    enabled: isReady
  });
}
function useGenerateHealthReport() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.generateHealthReport();
    }
  });
}
function useSetCalorieGoal() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal) => {
      if (!actor) throw new Error("Not connected");
      return actor.setCalorieGoal(goal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
function useRegisterStep1() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep1(req);
    }
  });
}
function useRegisterStep2() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep2(req);
    }
  });
}
function useRegisterStep3() {
  const { actor } = useSafeActor();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerStep3(req);
    }
  });
}
function useUpdateHealthProfile() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateHealthProfile(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
function useUpdateLifestyle() {
  const { actor } = useSafeActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLifestyle(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
export {
  useRegisterStep2 as a,
  useRegisterStep3 as b,
  useMyProfile as c,
  useDailySummary as d,
  useMoodEntries as e,
  useLatestRiskScore as f,
  useDailyTip as g,
  useDietRecommendation as h,
  useWeeklySummary as i,
  useMealHistory as j,
  useListFoods as k,
  useSearchFoods as l,
  useLogMeal as m,
  useDeleteMeal as n,
  useSetCalorieGoal as o,
  useLogMood as p,
  useCheckSymptoms as q,
  useSymptomHistory as r,
  useCalculateRiskScore as s,
  useHealthHistory as t,
  useRegisterStep1 as u,
  useGenerateHealthReport as v,
  useUpdateHealthProfile as w,
  useUpdateLifestyle as x
};
