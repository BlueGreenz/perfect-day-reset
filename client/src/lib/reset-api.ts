import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

export type ResetRunStatus = 'setup' | 'ready' | 'active' | 'sleep' | 'next_morning' | 'completed' | 'abandoned';
export type ResetPhase = 'morning' | 'midday' | 'afternoon' | 'evening' | 'sleep' | 'next_morning';
export type ItemStatus = 'scheduled' | 'active' | 'completed' | 'skipped';

export interface ResetRun {
  id: number;
  userId: number;
  catalogVersion: string;
  status: ResetRunStatus;
  phase: ResetPhase | null;
  scheduleRevision: number;
  timezone: string;
  startAt: string;
  targetBedtimeAt: string;
  targetNextMorningAt: string;
  resetGoal: string | null;
  foodPreference: string | null;
  movementAccess: string | null;
  blockedTimesJson: any;
  startedAt: string | null;
  sleepStartedAt: string | null;
  nextMorningStartedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResetItem {
  id: number;
  resetRunId: number;
  activityKey: string;
  variantKey: string | null;
  phase: ResetPhase;
  sequence: number;
  originalScheduledAt: string;
  scheduledAt: string;
  durationMinutes: number;
  status: ItemStatus;
  completedAt: string | null;
  skippedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentResetResponse {
  resetRun: ResetRun;
  items: ResetItem[];
  currentItem: ResetItem | null;
}

export interface CreateResetInput {
  startAt: string;
  targetBedtimeAt: string;
  targetNextMorningAt: string;
  timezone: string;
  resetGoal?: string;
  foodPreference?: string;
  movementAccess?: string;
  blockedTimesJson?: any;
}

export function useCurrentReset() {
  return useQuery<CurrentResetResponse, Error>({
    queryKey: ["/api/reset-runs/current"],
    retry: false, // Don't retry 404s endlessly
  });
}

export function useCreateReset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateResetInput) => {
      const res = await apiRequest("POST", "/api/reset-runs", data);
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    }
  });
}

export function useStartReset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/reset-runs/current/start");
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    }
  });
}
