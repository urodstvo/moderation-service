import { API_URL } from "..";
import type { AuthResponse, LoginBody } from "../types";

export const loginRequest = async (body: LoginBody) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return (await response.json()) as AuthResponse;
};
