import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromBlacklistRequest } from "../requests/remove-blacklist";

export const useRemoveFromBlacklistMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["remove-blacklist"],
    mutationFn: async (phrase_id: string | number) => await removeFromBlacklistRequest(phrase_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-blacklist"] });
    },
  });

  return mutation;
};
