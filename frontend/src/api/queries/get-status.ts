import { useQuery } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY } from "../helpers";
import { getStatusRequest } from "../requests";

export const useGetStatusQuery = (request_id: "active" | number) => {
  const query = useQuery({
    queryKey: ["get-status", "with-auth", request_id],
    queryFn: async () => await getStatusRequest(request_id),
    enabled: !!localStorage.getItem(AUTH_TOKEN_KEY),
    refetchInterval: 2000,
  });

  return query;
};
