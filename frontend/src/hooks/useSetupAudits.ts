import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { SetupAudit } from "@/api/types";
import type { Report, Setup } from "@/features/audit/analyze";

export const useSetupAudits = () => useQuery(queries.setupAudits());
export const useSetupAudit = (id: string) => useQuery(queries.setupAudit(id));

export function useSaveSetupAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { label: string; setup: Setup; report: Report }) =>
      api<SetupAudit>("/setup-audits", { method: "POST", ...json(input) }),
    onSuccess: (saved) => {
      qc.setQueryData(queries.setupAudit(saved.id).queryKey, saved);
      return qc.invalidateQueries({ queryKey: queries.setupAudits().queryKey });
    },
  });
}

export function useDeleteSetupAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<undefined>(`/setup-audits/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queries.setupAudits().queryKey }),
  });
}
