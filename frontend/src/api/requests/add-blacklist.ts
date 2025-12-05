import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";

export const addToBlacklistRequest = async (phrase: string) => {
  const token = getTokenFromStorage();
  const response = await fetch(`${API_URL}/blacklist`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phrase }),
  });

  if (!response.ok) {
    throw new Error("Failed to add to blacklist");
  }

  return;
};
