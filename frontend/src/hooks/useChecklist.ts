import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { ChecklistItem } from "@/api/types";

export function useChecklist() {
  return useQuery({
    ...queries.checklist(),
    select: (items) => new Set(items.filter((i) => i.done).map((i) => i.key)),
  });
}

export function useToggleChecklist() {
  const qc = useQueryClient();
  const key = queries.checklist().queryKey;
  return useMutation({
    mutationFn: (item: ChecklistItem) =>
      api<ChecklistItem>(`/checklist/${item.key}`, { method: "PUT", ...json({ done: item.done }) }),
    onMutate: async (item) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old = []) => [...old.filter((i) => i.key !== item.key), item]);
      return { prev };
    },
    onError: (_e, _item, ctx) => qc.setQueryData(key, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}
