import { asyncAnalysisRequest } from "../requests";
import type { AnalysisBody } from "../types";
import { useMutation } from "@tanstack/react-query";

export const useAsyncAnalysisMutation = () => {
  const mutation = useMutation({
    mutationKey: ["async", "analysis"],
    mutationFn: async (body: AnalysisBody) => await asyncAnalysisRequest(body),
  });

  return mutation;
};
