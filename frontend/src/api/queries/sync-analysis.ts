import { syncAnalysisRequest } from "../requests";
import type { AnalysisBody } from "../types";
import { useMutation } from "@tanstack/react-query";

export const useSyncAnalysisMutation = () => {
  const mutation = useMutation({
    mutationKey: ["sync", "analysis"],
    mutationFn: async (body: AnalysisBody) => await syncAnalysisRequest(body),
  });

  return mutation;
};
