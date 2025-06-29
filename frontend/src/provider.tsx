import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction, useContext } from "react";

const AnalysisContext = createContext<{
  isLoading: boolean;
  error: string | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}>({
  isLoading: false,
  setIsLoading: () => {},
  error: null as string | null,
  setError: () => {},
});

export const Provider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  return useContext(AnalysisContext);
};
