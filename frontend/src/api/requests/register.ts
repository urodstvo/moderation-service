import { API_URL } from "..";
import type { AuthResponse, RegisterBody } from "../types";

export const registerRequest = async (body: RegisterBody) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return (await response.json()) as AuthResponse;
};
