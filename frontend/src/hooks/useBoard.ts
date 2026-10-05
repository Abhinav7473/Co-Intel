import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, json } from "@/api/client";
import { queries } from "@/api/queries";
import type { BoardPin } from "@/api/types";

/** Where each tool starts before anyone has dragged it. */
export const DEFAULT_PINS: BoardPin[] = [
  { key: "your-workflow", label: "Your workflow", control: 0.14, memory: 0.12 },
  { key: "copilot", label: "Copilot", control: 0.3, memory: 0.62 },
  { key: "claude-code", label: "Claude Code", control: 0.58, memory: 0.3 },
  { key: "generic-agent", label: "An agent", control: 0.88, memory: 0.74 },
  { key: "odysseus", label: "Odysseus", control: 0.8, memory: 0.9 },
];

/** Server pins win; defaults fill the gaps so the board is never empty. */
export function useBoard() {
  return useQuery({
    ...queries.board(),
    select: (saved) => {
      const byKey = new Map(saved.map((p) => [p.key, p]));
      const merged = DEFAULT_PINS.map((d) => byKey.get(d.key) ?? d);
      const extras = saved.filter((p) => !DEFAULT_PINS.some((d) => d.key === p.key));
      return [...merged, ...extras];
    },
  });
}

export function useSavePin() {
  const qc = useQueryClient();
  const key = queries.board().queryKey;
  return useMutation({
    mutationFn: (pin: BoardPin) =>
      api<BoardPin>(`/board/${pin.key}`, {
        method: "PUT",
        ...json({ label: pin.label, control: pin.control, memory: pin.memory }),
      }),
    // optimistic: the pin stays where it was dropped
    onMutate: async (pin) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old = []) => [...old.filter((p) => p.key !== pin.key), pin]);
      return { prev };
    },
    onError: (_e, _pin, ctx) => qc.setQueryData(key, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useResetBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<undefined>("/board", { method: "DELETE" }),
    onSuccess: () => qc.setQueryData(queries.board().queryKey, []),
  });
}
