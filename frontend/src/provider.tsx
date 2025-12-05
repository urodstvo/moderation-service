import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const ActiveRequestIdContext = createContext<{
  requestId: number | undefined;
  setRequestId: (value: number | undefined) => void;
}>({
  requestId: undefined,
  setRequestId: () => {},
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <ActiveRequestIdProvider>{children}</ActiveRequestIdProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AuthContext.Provider>;
};

const ActiveRequestIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [requestId, setRequestId] = useState<number | undefined>(undefined);

  return (
    <ActiveRequestIdContext.Provider value={{ requestId, setRequestId }}>{children}</ActiveRequestIdContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useActiveRequestId = () => {
  const context = useContext(ActiveRequestIdContext);
  if (!context) {
    throw new Error("useAuth must be used within an ActiveRequestIdProvider");
  }
  return context;
};
