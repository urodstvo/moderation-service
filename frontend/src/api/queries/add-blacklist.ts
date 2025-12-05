import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToBlacklistRequest } from "../requests/add-blacklist";

export const useAddToBlacklistMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add-blacklist"],
    mutationFn: async (phrase: string) => await addToBlacklistRequest(phrase),
    onSuccess: () => {
      console.log("succes");
      queryClient.invalidateQueries({ queryKey: ["get-blacklist", "with-auth"] });
    },
  });

  return mutation;
};
