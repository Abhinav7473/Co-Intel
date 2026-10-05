import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { Experiment, Run, RunInput } from "@/api/types";

export const useExperiments = () => useQuery(queries.experiments());
export const useExperiment = (id: string) => useQuery(queries.experiment(id));

export function useCreateExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<Experiment, "title" | "template" | "hypothesis" | "variant_a" | "variant_b">) =>
      api<Experiment>("/experiments", { method: "POST", ...json(input) }),
    onSuccess: (exp) => {
      qc.setQueryData(queries.experiment(exp.id).queryKey, exp);
      return qc.invalidateQueries({ queryKey: queries.experiments().queryKey });
    },
  });
}

export function useDeleteExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<undefined>(`/experiments/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queries.experiments().queryKey }),
  });
}

export function useAddRun(experimentId: string) {
  const qc = useQueryClient();
  const key = queries.experiment(experimentId).queryKey;
  return useMutation({
    mutationFn: (run: RunInput) => api<Run>(`/experiments/${experimentId}/runs`, { method: "POST", ...json(run) }),
    onSuccess: (run) => {
      qc.setQueryData(key, (old) => (old ? { ...old, runs: [...old.runs, run] } : old));
      return qc.invalidateQueries({ queryKey: queries.experiments().queryKey });
    },
  });
}

export function useDeleteRun(experimentId: string) {
  const qc = useQueryClient();
  const key = queries.experiment(experimentId).queryKey;
  return useMutation({
    mutationFn: (runId: string) => api<undefined>(`/experiments/${experimentId}/runs/${runId}`, { method: "DELETE" }),
    onSuccess: (_r, runId) => qc.setQueryData(key, (old) => (old ? { ...old, runs: old.runs.filter((r) => r.id !== runId) } : old)),
  });
}
