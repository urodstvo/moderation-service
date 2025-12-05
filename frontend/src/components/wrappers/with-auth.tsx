import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/router";
import { useAuth } from "@/provider";
import { useGetMeQuery } from "@/api/queries";
import { useEffect } from "react";

export default function WithAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const me = useGetMeQuery();

  useEffect(() => {
    if (me.isSuccess) {
      setIsAuthenticated(true);
    }
  }, [me.isSuccess, setIsAuthenticated]);

  if (me.isPending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!isAuthenticated && me.isError) {
    return <Navigate to={routes.login.getPath()} replace />;
  }

  return children;
}
