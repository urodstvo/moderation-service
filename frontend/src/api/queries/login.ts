import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/provider";
import { loginRequest } from "../requests";
import type { LoginBody } from "../types";
import { AUTH_TOKEN_KEY } from "../helpers";

export const useLoginMutation = () => {
  const { setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (body: LoginBody) => await loginRequest(body),
    onError: () => {
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      queryClient.invalidateQueries({ queryKey: ["with-auth"] });
    },
  });

  return mutation;
};
