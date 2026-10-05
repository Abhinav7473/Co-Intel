import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { PollSummary } from "@/api/types";

/** The anonymous "which mistakes did you make" poll (backend: /api/audit). */
export function usePoll() {
  return useQuery(queries.poll());
}

export function useSubmitPoll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mistakes: string[]) => api<PollSummary>("/audit", { method: "POST", ...json({ mistakes }) }),
    onSuccess: (summary) => qc.setQueryData(queries.poll().queryKey, summary),
  });
}
