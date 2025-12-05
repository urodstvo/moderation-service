import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";
import type { GetMeResponse } from "../types";

export const getMeRequest = async () => {
  const token = getTokenFromStorage();
  const response = await fetch(`${API_URL}/auth/user/get-me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Me");
  }

  return (await response.json()) as GetMeResponse;
};
