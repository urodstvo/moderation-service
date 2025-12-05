import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";
import type { AnalysisBody, SyncAnalysisResponse } from "../types";

export const syncAnalysisRequest = async (body: AnalysisBody) => {
  const token = getTokenFromStorage();
  const data = new FormData();

  body.files.forEach((file) => {
    data.append("files", file);
  });

  const response = await fetch(`${API_URL}/analysis/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error("Failed to sync analyze");
  }

  return (await response.json()) as SyncAnalysisResponse;
};
