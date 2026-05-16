import { useNavigate } from "react-router-dom";
import CustomLoader from "../feedback/CustomLoader";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      // if (!isLoading && !isAuthenticated) {
      //   navigate("/sign-in");
      // }
    }, [isLoading, isAuthenticated]);

    if (isLoading) return <CustomLoader />;

    return <Component {...props} />;
  };
}
