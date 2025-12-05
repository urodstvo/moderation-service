import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/provider";
import { registerRequest } from "../requests";
import type { RegisterBody } from "../types";
import { AUTH_TOKEN_KEY } from "../helpers";

export const useRegisterMutation = () => {
  const { setIsAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (body: RegisterBody) => await registerRequest(body),
    onError: () => {
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    },
  });

  return mutation;
};
