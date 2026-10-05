import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { Assessment } from "@/api/types";

export const useAssessments = () => useQuery(queries.assessments());

export function useSaveAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<Assessment, "answers" | "scores" | "overall">) =>
      api<Assessment>("/assessments", { method: "POST", ...json(input) }),
    onSuccess: (saved) => qc.setQueryData(queries.assessments().queryKey, (old = []) => [saved, ...old]),
  });
}

export function useDeleteAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<undefined>(`/assessments/${id}`, { method: "DELETE" }),
    onSuccess: (_r, id) => qc.setQueryData(queries.assessments().queryKey, (old = []) => old.filter((a) => a.id !== id)),
  });
}
