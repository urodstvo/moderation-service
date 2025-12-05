import { API_URL } from "..";
import { getTokenFromStorage } from "../helpers";

export const removeFromBlacklistRequest = async (phrase_id: string | number) => {
  const token = getTokenFromStorage();
  const response = await fetch(`${API_URL}/blacklist/${phrase_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove phrase");
  }

  return;
};
