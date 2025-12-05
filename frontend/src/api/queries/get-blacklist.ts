import { useQuery } from "@tanstack/react-query";
import { getBlacklistRequest } from "../requests/get-blacklist";

export const useGetBlacklistQuery = () => {
  const query = useQuery({
    queryKey: ["get-blacklist", "with-auth"],
    queryFn: async () => await getBlacklistRequest(),
    refetchOnWindowFocus: false,
  });

  return query;
};
