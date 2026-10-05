import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { Entry, EntryInput } from "@/api/types";

/** All knowledge-base entries (capped server-side); pages filter client-side. */
export function useEntries() {
  return useQuery(queries.entries());
}

export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EntryInput) => api<Entry>("/entries", { method: "POST", ...json(input) }),
    onSuccess: (entry) => qc.setQueryData(queries.entries().queryKey, (old = []) => [entry, ...old]),
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  const key = queries.entries().queryKey;
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<EntryInput> & { id: string; pinned?: boolean }) =>
      api<Entry>(`/entries/${id}`, { method: "PATCH", ...json(patch) }),
    onMutate: async ({ id, ...patch }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old = []) => old.map((e) => (e.id === id ? { ...e, ...patch } : e)));
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(key, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  const key = queries.entries().queryKey;
  return useMutation({
    mutationFn: (id: string) => api<undefined>(`/entries/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old = []) => old.filter((e) => e.id !== id));
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(key, ctx?.prev),
  });
}
