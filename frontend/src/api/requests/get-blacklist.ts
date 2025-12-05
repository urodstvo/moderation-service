import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";
import type { GetBlacklistResponse } from "../types";

export const getBlacklistRequest = async () => {
  const token = getTokenFromStorage();
  const response = await fetch(`${API_URL}/blacklist`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Me");
  }

  return (await response.json()) as GetBlacklistResponse;
};
