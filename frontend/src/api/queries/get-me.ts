import { useQuery } from "@tanstack/react-query";
import { getMeRequest } from "../requests";

export const useGetMeQuery = () => {
  const query = useQuery({
    queryKey: ["get-me", "with-auth"],
    queryFn: async () => await getMeRequest(),
    select: (data) => data.user,
    refetchOnWindowFocus: false,
  });

  return query;
};
