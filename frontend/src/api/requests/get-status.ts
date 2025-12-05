import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";
import type { GetStatusResponse } from "../types";

export const getStatusRequest = async (request_id: "active" | number) => {
  const token = getTokenFromStorage();
  const response = await fetch(`${API_URL}/request/${request_id.toString()}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get status");
  }

  return (await response.json()) as GetStatusResponse;
};
