import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { UserProfile } from "../types";

const STORAGE_KEY = "oceanwell_user_profile";

export function useAuth() {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  const isAuthenticated = userProfile !== null;

  // Restore session on mount
  useEffect(() => {
    if (actorLoading || initialized.current) return;
    initialized.current = true;

    const restore = async () => {
      if (!actor) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await actor.getMyProfile();
        if (profile) {
          setUserProfile(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } else {
          setUserProfile(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Not logged in — clear stale state
        setUserProfile(null);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, [actor, actorLoading]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!actor) return { success: false, error: "Not connected" };
      try {
        const result = await actor.login({ email, password });
        if (result.__kind__ === "ok") {
          setUserProfile(result.ok);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.ok));
          return { success: true };
        }
        return { success: false, error: result.err };
      } catch {
        return { success: false, error: "Login failed. Please try again." };
      }
    },
    [actor],
  );

  const logout = useCallback(() => {
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!actor) return;
    try {
      const profile = await actor.getMyProfile();
      if (profile) {
        setUserProfile(profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
    } catch {
      // ignore
    }
  }, [actor]);

  return {
    isAuthenticated,
    userProfile,
    isLoading: isLoading || actorLoading,
    login,
    logout,
    refreshProfile,
    actor,
  };
}
