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

export function useCompleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: number) => {
      const res = await apiRequest("POST", `/api/reset-runs/current/items/${itemId}/complete`);
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    }
  });
}

export function useSkipItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: number) => {
      const res = await apiRequest("POST", `/api/reset-runs/current/items/${itemId}/skip`);
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    }
  });
}

export function useDelayItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, delayMinutes, expectedScheduleRevision }: { itemId: number, delayMinutes: number, expectedScheduleRevision: number }) => {
      const res = await apiRequest("POST", `/api/reset-runs/current/items/${itemId}/delay`, { delayMinutes, expectedScheduleRevision });
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    }
  });
}

export type ResetEntryKind = "midday_reflection" | "evening_reflection" | "next_morning_reflection";

export interface ResetEntry {
  id: number;
  resetRunId: number;
  kind: ResetEntryKind;
  content: string;
  createdAt: string;
}

export interface ResetEntriesResponse {
  entries: ResetEntry[];
}

export function useResetEntries() {
  return useQuery<ResetEntriesResponse, Error>({
    queryKey: ["/api/reset-runs/current/entries"],
    retry: false,
  });
}

export function useSaveResetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ kind, content }: { kind: ResetEntryKind; content: string }) => {
      const res = await apiRequest("PUT", `/api/reset-runs/current/entries/${kind}`, { content });
      return (await res.json()) as { entry: ResetEntry };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reset-runs/current/entries"] });
    },
  });
}

export function useStartNextMorning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/reset-runs/current/next-morning");
      return (await res.json()) as CurrentResetResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/reset-runs/current"], data);
    },
  });
}

export function useUpdateFoodPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodPreference: string) => {
      const res = await apiRequest("PATCH", "/api/reset-runs/current/preferences", { foodPreference });
      return (await res.json()) as { resetRun: ResetRun };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<CurrentResetResponse | undefined>(
        ["/api/reset-runs/current"],
        (prev) => (prev ? { ...prev, resetRun: data.resetRun } : prev)
      );
    },
  });
}

