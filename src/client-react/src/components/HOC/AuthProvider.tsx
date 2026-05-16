import { useLazyGetMeQuery } from "@/store/apis/UserApi";
import { useAppDispatch } from "@/store/hooks";
import { logout, setUser } from "@/store/slices/AuthSlice";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    (async () => {
      try {
        const response = await triggerGetMe().unwrap();
        // The backend returns { success, message, user }
        const user = response.user;
        if (user) {
          dispatch(setUser({ user }));
        } else {
          console.error("No user data in response");
          dispatch(logout());
        }
      } catch (error: any) {
        // If it's a 401 or no token, user is unauthenticated — expected behavior
        if (error?.status === 401 || error?.status === 'PARSING_ERROR') {
          dispatch(logout());
        } else if (error?.status === 'FETCH_ERROR') {
          // Network issues, just logout or stay as guest
          console.warn("Auth check: Network error (offline?)");
          dispatch(logout());
        } else {
          const errorMsg = error?.data?.message || error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
          if (errorMsg !== '{}') {
            console.error("Unexpected error during auth:", errorMsg);
          }
          dispatch(logout());
        }
      }
    })();
  }, []);

  return <>{children}</>;
}
