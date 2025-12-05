export const AUTH_TOKEN_KEY = "auth_token_jwt";

export const getTokenFromStorage = (storage: Storage = localStorage) => {
  const token = storage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    throw new Error("Failed to get auth token");
  }

  return token;
};
